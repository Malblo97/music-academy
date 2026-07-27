import { TICKS } from '../types.js';
import type { Note, Meter } from '../types.js';
import { midiToName } from './parse.js';

/**
 * Régénère la notation source depuis une partition. Approche : ligne de
 * balayage sur les points de coupure (débuts/fins de notes ET barres de
 * mesure) — entre deux points de coupure consécutifs, l'ensemble des notes
 * actives est constant, donc regroupable en un seul événement (accord si ≥ 2
 * notes). Chaque segment est ensuite découpé en jetons de durée LÉGAUX pour le
 * mètre courant, et les morceaux d'une même note sont reliés par des liaisons
 * ('~'), reproduisant la sémantique F-21.
 *
 * DOMAINE DE VALIDITÉ (F-52) : `printNotation` est l'inverse de `parseNotation`
 * SANS options de rendu. Une `Note[]` passée par `applySwing` ou `applyHumanize`
 * a des attaques hors grille et n'est PAS imprimable (échec bruyant) : le swing
 * et l'humanize appartiennent au rendu, pas à la notation. `velocity` n'a pas de
 * syntaxe : l'aller-retour porte sur la projection {pitch, start, duration,
 * spelling}.
 *
 * Garanties F-52 :
 *   1. Aucun jeton ne franchit une frontière métrique au moins aussi forte que
 *      lui — plus de `w.` en 4/4, plus de valeur pointée ingravable. Les barres
 *      de mesure étant des points de coupure, une liaison par-dessus une barre
 *      n'est jamais fusionnée ; les liaisons INTRA-mesure continuent de fusionner
 *      (comportement voulu de `normalize()`).
 *   2. Les barres `|` sont émises. Sans elles, `parseNotation(printNotation(s),
 *      { strictBars: true })` échouait sur toute pièce de plus d'une mesure : le
 *      contrôle de mesure comparait la longueur totale à une seule mesure.
 *   3. `lengthTicks` exprime les silences finaux (la durée totale est
 *      sémantiquement porteuse : les checkers raisonnent en mesures).
 *   4. `Note.spelling` est respecté quand il est présent — F-6 reste intact :
 *      l'orthographe concerne le rendu, jamais le jugement.
 *
 * Propriété visée (verrou n°3 reformulé) : `parseNotation(printNotation(score))`
 * ≡ `score.notes` sur des `Note[]` arbitraires — et NON `print(parse(x))` ≡ `x`,
 * faux par construction : la syntaxe de surface est plus riche que le modèle.
 */

const MIN_TICK = TICKS.s ?? 120; // double croche : plus petite valeur du jeu de jetons

/**
 * Jetons dérivés de `TICKS` (source unique) : les deux tables ne peuvent plus
 * diverger, et l'invariant « trié décroissant » n'est plus porté en silence par
 * un tableau littéral.
 */
const TOKEN_LETTER: Record<number, string> = (() => {
  const out: Record<number, string> = {};
  for (const [letter, base] of Object.entries(TICKS)) {
    out[base] = letter;
    if (Number.isInteger(base * 1.5)) out[base * 1.5] = `${letter}.`;
  }
  return out;
})();

const TOKEN_TICKS: number[] = Object.keys(TOKEN_LETTER)
  .map(Number)
  .sort((a, b) => b - a);

export interface PrintableScore {
  notes: readonly Note[];
  /** REQUIS : sans mètre, l'impression produit de la notation ingravable. Pas de défaut. */
  meter: Meter;
  /** Durée totale si elle excède la dernière note (silences finaux). Défaut : fin de la dernière note. */
  lengthTicks?: number;
}

// ---------------------------------------------------------------------------
// Mètre et hiérarchie métrique
// ---------------------------------------------------------------------------

function unitTicks(den: number): number {
  const map: Record<number, string> = { 1: 'w', 2: 'h', 4: 'q', 8: 'e', 16: 's' };
  const letter = map[den];
  const v = letter === undefined ? undefined : TICKS[letter];
  if (v === undefined) throw new Error(`notation: dénominateur de métrique non supporté : ${den}`);
  return v;
}

function barTicksOf([num, den]: Meter): number {
  if (!Number.isInteger(num) || num < 1) throw new Error(`notation: numérateur de métrique invalide (${num})`);
  return num * unitTicks(den);
}

/**
 * Les niveaux métriques de la mesure, du plus fort au plus faible (ticks).
 * Simple : mesure → moitiés successives → temps → subdivisions.
 * Composé (6/8, 9/8, 12/8) : le temps vaut trois croches et se subdivise par 3.
 * Mètres impairs (7/8…) : on retombe au niveau de la subdivision — plus de
 * liaisons, jamais d'illégalité (le regroupement 3+2+2 n'est pas déductible du
 * chiffrage ; le jour où il le sera, il viendra de la spec, pas d'ici).
 */
function metricalLevels(meter: Meter): number[] {
  const [num, den] = meter;
  const bar = barTicksOf(meter);
  const compound = den === 8 && num > 3 && num % 3 === 0;
  const beat = compound ? 3 * unitTicks(den) : unitTicks(den);

  const levels: number[] = [bar];
  let cur = bar;
  while (cur / 2 >= beat && (cur / 2) % beat === 0) {
    cur /= 2;
    levels.push(cur);
  }
  if (cur !== beat) levels.push(beat);

  cur = compound ? beat / 3 : beat / 2;
  while (cur >= MIN_TICK) {
    levels.push(cur);
    cur /= 2;
  }

  return [...new Set(levels)].filter(v => v >= MIN_TICK).sort((a, b) => b - a);
}

/**
 * Un jeton de longueur `len` posé à l'offset `offset` (relatif au début de la
 * mesure) est légal s'il ne franchit aucune frontière métrique au moins aussi
 * forte que lui. C'est ici, et nulle part ailleurs, que se règle la tolérance
 * aux syncopes : assouplir la comparaison `lv < len` autorise les valeurs
 * syncopées (blanche au temps 2 en 4/4) au prix de la lisibilité rythmique.
 */
function isLegalToken(offset: number, len: number, levels: number[]): boolean {
  if (TOKEN_LETTER[len] === undefined) return false;
  for (const lv of levels) {
    if (lv < len) break; // niveaux décroissants : les plus faibles sont sans effet
    const boundary = Math.ceil((offset + 1) / lv) * lv; // 1er multiple de lv strictement > offset
    if (boundary < offset + len) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Découpage en jetons
// ---------------------------------------------------------------------------

/** Dernier recours : spans plus courts que la subdivision la plus fine. */
function greedyDurationSplit(ticks: number): number[] {
  const out: number[] = [];
  let rem = ticks;
  while (rem > 0) {
    const t = TOKEN_TICKS.find(v => v <= rem);
    if (t === undefined) {
      throw new Error(
        `notation: durée non représentable en écriture standard (${rem} ticks restants) — ` +
          `attaque hors grille ? le swing et l'humanize ne sont pas imprimables (F-52)`,
      );
    }
    out.push(t);
    rem -= t;
  }
  return out;
}

/** Découpe [start, end) — offsets relatifs à la mesure, span garanti intra-mesure. */
function splitInBar(start: number, end: number, levels: number[]): number[] {
  const len = end - start;
  if (len <= 0) return [];
  if (isLegalToken(start, len, levels)) return [len];

  for (const lv of levels) {
    const boundary = Math.ceil((start + 1) / lv) * lv;
    if (boundary < end) {
      return [...splitInBar(start, boundary, levels), ...splitInBar(boundary, end, levels)];
    }
  }
  return greedyDurationSplit(len);
}

/** Découpe un span absolu, barres comprises (chemin unique notes + silences). */
function splitSpan(absStart: number, absEnd: number, bar: number, levels: number[]): number[] {
  const out: number[] = [];
  let s = absStart;
  while (s < absEnd) {
    const barStart = Math.floor(s / bar) * bar;
    const e = Math.min(absEnd, barStart + bar);
    out.push(...splitInBar(s - barStart, e - barStart, levels));
    s = e;
  }
  return out;
}

function ticksToDurToken(len: number): string {
  const letter = TOKEN_LETTER[len];
  if (letter === undefined) throw new Error(`notation: durée non représentable en écriture standard (${len} ticks)`);
  return `:${letter}`;
}

// ---------------------------------------------------------------------------
// Balayage
// ---------------------------------------------------------------------------

interface Chunk {
  pitch: number;
  name: string;
  start: number;
  len: number;
  tie: boolean;
}

function collectCutPoints(notes: readonly Note[], total: number, bar: number): number[] {
  const set = new Set<number>();
  for (const n of notes) {
    set.add(n.start);
    set.add(n.start + n.duration);
  }
  for (let b = bar; b < total; b += bar) set.add(b);
  return [...set].sort((a, b) => a - b);
}

function noteToChunks(note: Note, cuts: number[], bar: number, levels: number[]): Chunk[] {
  const end = note.start + note.duration;
  const bounds = [note.start, ...cuts.filter(c => c > note.start && c < end), end];
  const name = note.spelling ?? midiToName(note.pitch);
  const chunks: Chunk[] = [];

  for (let i = 0; i < bounds.length - 1; i++) {
    const segStart = bounds[i];
    const segEnd = bounds[i + 1];
    if (segStart === undefined || segEnd === undefined) continue;
    const isLastSeg = i === bounds.length - 2;
    const pieces = splitSpan(segStart, segEnd, bar, levels);
    let cursor = segStart;
    for (let j = 0; j < pieces.length; j++) {
      const len = pieces[j];
      if (len === undefined) continue;
      const isLastPiece = j === pieces.length - 1;
      chunks.push({ pitch: note.pitch, name, start: cursor, len, tie: !(isLastSeg && isLastPiece) });
      cursor += len;
    }
  }
  return chunks;
}

/**
 * La liaison d'un accord est portée par chaque hauteur À L'INTÉRIEUR des
 * crochets (`[C4~+E4]:h`) — conforme à `parse.ts`, qui lit le tilde post-hauteur
 * dans un accord et IGNORE le tilde post-hauteur hors accord (F-21). Pour une
 * note seule, la liaison va donc après le jeton de durée (`C4:h~`).
 */
function formatChord(chunks: Chunk[], durTok: string): string {
  const inner = [...chunks]
    .sort((a, b) => a.pitch - b.pitch)
    .map(c => `${c.name}${c.tie ? '~' : ''}`)
    .join('+');
  return `[${inner}]${durTok}`;
}

/** Deux notes de même hauteur qui se chevauchent sont inexprimables (la table `pending` de `resolveTies` est indexée par hauteur). */
function assertNoSamePitchOverlap(notes: readonly Note[]): void {
  const byPitch = new Map<number, Note[]>();
  for (const n of notes) {
    const arr = byPitch.get(n.pitch) ?? [];
    arr.push(n);
    byPitch.set(n.pitch, arr);
  }
  for (const [pitch, arr] of byPitch) {
    const sorted = [...arr].sort((a, b) => a.start - b.start);
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const cur = sorted[i];
      if (!prev || !cur) continue;
      if (cur.start < prev.start + prev.duration) {
        throw new Error(
          `notation: deux notes de même hauteur se chevauchent (${midiToName(pitch)} à ${prev.start} et ${cur.start}) — ` +
            `inexprimable en notation (F-52)`,
        );
      }
    }
  }
}

export function printNotation(score: PrintableScore): string {
  const { notes, meter, lengthTicks } = score;
  const bar = barTicksOf(meter);
  const levels = metricalLevels(meter);

  for (const n of notes) {
    if (!Number.isInteger(n.start) || n.start < 0) {
      throw new Error(`notation: position invalide (${n.start}) pour la hauteur ${n.pitch}`);
    }
    if (!Number.isInteger(n.duration) || n.duration <= 0) {
      throw new Error(
        `notation: durée nulle ou négative (${n.duration}) pour la hauteur ${n.pitch} à ${n.start} — ` +
          `une note ne peut pas disparaître silencieusement`,
      );
    }
  }
  assertNoSamePitchOverlap(notes);

  const maxEnd = notes.reduce((acc, n) => Math.max(acc, n.start + n.duration), 0);
  const total = lengthTicks ?? maxEnd;
  if (total < maxEnd) {
    throw new Error(`notation: lengthTicks (${total}) plus court que la dernière note (${maxEnd})`);
  }
  if (total === 0) return '';

  const cuts = collectCutPoints(notes, total, bar);
  const byStart = new Map<number, Chunk[]>();
  for (const n of notes) {
    for (const c of noteToChunks(n, cuts, bar, levels)) {
      const arr = byStart.get(c.start) ?? [];
      arr.push(c);
      byStart.set(c.start, arr);
    }
  }

  /** Événements datés, barres insérées à la fin (un `|` par frontière franchie). */
  const events: Array<{ tick: number; text: string }> = [];
  const pushRests = (from: number, to: number): void => {
    let t = from;
    for (const len of splitSpan(from, to, bar, levels)) {
      events.push({ tick: t, text: `r${ticksToDurToken(len)}` });
      t += len;
    }
  };

  let cursor = 0;
  for (const start of [...byStart.keys()].sort((a, b) => a - b)) {
    if (start > cursor) pushRests(cursor, start);

    const chunks = byStart.get(start);
    if (!chunks || chunks.length === 0) continue;
    const first = chunks[0];
    if (!first) continue;

    // Invariant du balayage : toutes les bornes de notes étant des points de
    // coupure, deux notes actives sur un même segment reçoivent le MÊME
    // découpage. Si cet invariant tombe, `cursor` devient faux et les silences
    // émis seraient fantaisistes — donc on échoue bruyamment.
    if (chunks.some(c => c.len !== first.len)) {
      throw new Error(`notation: invariant de balayage rompu à ${start} (longueurs de chunks divergentes)`);
    }

    const durTok = ticksToDurToken(first.len);
    events.push({
      tick: start,
      text: chunks.length === 1 ? `${first.name}${durTok}${first.tie ? '~' : ''}` : formatChord(chunks, durTok),
    });
    cursor = start + first.len;
  }

  if (total > cursor) pushRests(cursor, total);

  const parts: string[] = [];
  let barIndex = 0;
  for (const ev of events) {
    const evBar = Math.floor(ev.tick / bar);
    while (barIndex < evBar) {
      parts.push('|');
      barIndex++;
    }
    parts.push(ev.text);
  }

  return parts.join(' ');
}