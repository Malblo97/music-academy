import { TICKS } from '../types.js';
import type { Meter, Note } from '../types.js';
import { barTicks } from './rhythm.js';

export interface PhraseBoundary {
  /** Tick de l'attaque qui OUVRE la phrase suivante. */
  at: number;
  kind: 'rest' | 'long-note' | 'elision';
}

export interface Phrase {
  from: number;
  /** Frontière suivante (ou fin de la pièce) : la phrase se mesure de seuil à seuil. */
  to: number;
  noteCount: number;
}

export interface PhraseAnalysis {
  phrases: Phrase[];
  boundaries: PhraseBoundary[];
  /** Ticks des élisions — une frontière que le compositeur a refusé de respirer. */
  elisions: number[];
  structure: 'period' | 'sentence' | null;
}

/** Le silence qui fait frontière : une noire au moins (m02-l06). */
const MIN_REST = TICKS.q!;
/** Une note « longue » : au moins deux fois la durée médiane de la pièce. */
const LONG_NOTE_FACTOR = 2;
/** L'élision se paie d'un élan : au moins trois intervalles montants avant la cible. */
const MIN_ELISION_ASCENT = 3;
/**
 * Les bornes du conséquent, rapportées à l'antécédent. Elles ne sont pas une
 * tolérance mais les DEUX PROCÉDÉS que `m02-l06-phrase` §1 nomme et chiffre :
 * « l'extension retarde la cadence attendue : la phrase de 4 mesures en dure 5
 * ou 6 » (soit ×1.5) et « la compression fait l'inverse : la phrase attendue
 * sur 4 mesures conclut en 3 » (soit ×0.75). Une symétrie unique à ±25 %
 * refusait le nom de « période » à `m02-e11-stretch-and-cut`, dont la consigne
 * déclare pourtant `phraseBarPlan: [4,6]` ET `phraseStructure: "period"` dans
 * le même bloc de contraintes — le moteur contredisait la spec qu'il vérifiait.
 */
const CONSEQUENT_MAX = 1.5;
const CONSEQUENT_MIN = 0.75;
/** Le « 2 » du 1+1+2 : la continuation vaut au moins 1.75 énoncé. */
const SENTENCE_CONTINUATION = 1.75;

function melodyLine(notes: readonly Note[]): Note[] {
  const top = new Map<number, Note>();
  for (const n of notes) {
    const cur = top.get(n.start);
    if (!cur || n.pitch > cur.pitch) top.set(n.start, n);
  }
  return [...top.values()].sort((a, b) => a.start - b.start);
}

function median(values: readonly number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
}

function pc(pitch: number): number {
  return ((pitch % 12) + 12) % 12;
}

/**
 * ÉLISION — la frontière sans silence. L'analyseur ne peut pas la lire dans un
 * blanc puisqu'il n'y en a pas : il la lit dans le GESTE. La note doit être
 * (a) sur le premier temps d'une mesure, (b) un sommet local strict, (c) le
 * terme d'une montée d'au moins trois intervalles, (d) suivie d'une descente,
 * (e) sans le moindre silence de part et d'autre. C'est exactement « la note
 * qui conclut la phrase 1 ET lance la 2 » de m02-s12 ; et c'est ce qui refuse
 * le climax intérieur du conséquent de m01-s29, approché par deux degrés
 * seulement (fixture négative).
 */
function isElision(line: readonly Note[], i: number, meter: Meter): boolean {
  const bar = barTicks(meter);
  const note = line[i];
  const before = line[i - 1];
  const after = line[i + 1];
  if (!note || !before || !after) return false;
  if (note.start % bar !== 0) return false;
  if (note.pitch <= before.pitch || note.pitch <= after.pitch) return false;
  if (before.start + before.duration < note.start) return false; // un blanc : ce n'est plus une élision
  if (note.start + note.duration < after.start) return false;

  let ascent = 0;
  for (let k = i; k > 0 && line[k]!.pitch > line[k - 1]!.pitch; k--) ascent++;
  return ascent >= MIN_ELISION_ASCENT;
}

function detectBoundaries(line: readonly Note[], meter: Meter): PhraseBoundary[] {
  const bar = barTicks(meter);
  const longThreshold = Math.max(median(line.map(n => n.duration)) * LONG_NOTE_FACTOR, bar / meter[0]);
  const boundaries: PhraseBoundary[] = [];

  for (let i = 0; i < line.length - 1; i++) {
    const note = line[i]!;
    const next = line[i + 1]!;
    const gap = next.start - (note.start + note.duration);

    if (gap >= MIN_REST) {
      boundaries.push({ at: next.start, kind: 'rest' });
      continue;
    }
    // La note longue ne fait frontière que si elle BOUCLE la mesure : une blanche
    // au milieu d'une mesure est une valeur d'écriture, pas une respiration.
    if (note.duration >= longThreshold && (note.start + note.duration) % bar === 0) {
      boundaries.push({ at: next.start, kind: 'long-note' });
      continue;
    }
    if (isElision(line, i + 1, meter)) {
      boundaries.push({ at: next.start, kind: 'elision' });
    }
  }
  return boundaries;
}

/** Les intervalles d'ouverture d'une phrase — sa carte d'identité. */
function head(line: readonly Note[], phrase: Phrase, count: number): number[] {
  const inside = line.filter(n => n.start >= phrase.from && n.start < phrase.to);
  const out: number[] = [];
  for (let i = 1; i < inside.length && out.length < count; i++) {
    out.push(inside[i]!.pitch - inside[i - 1]!.pitch);
  }
  return out;
}

function sameHead(a: readonly number[], b: readonly number[]): boolean {
  return a.length > 0 && a.length === b.length && a.every((v, i) => v === b[i]);
}

/** PHRASE-PÉRIODE 1+1+2 : dire, redire, puis la continuation qui vaut les deux. */
function isSentence(line: readonly Note[], a: Phrase, b: Phrase, c: Phrase): boolean {
  const spanA = a.to - a.from;
  const spanB = b.to - b.from;
  const twinned = Math.abs(spanA - spanB) / Math.max(spanA, spanB) <= 0.125;
  const continuation = c.to - c.from >= SENTENCE_CONTINUATION * spanA;
  // Les deux énoncés doivent commencer PAREIL — c'est le « redire ».
  return twinned && continuation && sameHead(head(line, a, 2), head(line, b, 2));
}

/**
 * La PHRASE-PÉRIODE se cherche dans une suite de trois phrases consécutives, pas
 * dans le compte total. Exiger `phrases.length === 3` revenait à supposer qu'une
 * pièce n'en contient qu'une : `m02-s06` en aligne trois (« trois phrases » dit
 * son titre, « dire-redire-précipiter-conclure ✓ » ses `authorNotes`),
 * l'analyseur y lisait cinq phrases et rendait « indéterminée » — sur
 * l'exercice canonique de la phrase-période.
 *
 * La PÉRIODE, elle, reste une lecture de la pièce ENTIÈRE (deux phrases,
 * l'antécédent suspendu par rapport à la conclusion réelle). Son gabarit est
 * trop lâche pour être cherché par fenêtres : deux mesures voisines qui ne
 * finissent pas sur la même note en feraient une, et les fixtures négatives
 * `period-negative-antecedent-concludes` et `sentence-negative-different-heads`
 * l'ont dit tout de suite. Seul le gabarit serré de la phrase-période (jumelles
 * à 12,5 % près, continuation ≥ 1.75, mêmes intervalles de tête) supporte le
 * balayage.
 */
function detectStructure(line: readonly Note[], phrases: readonly Phrase[]): 'period' | 'sentence' | null {
  const last = line[line.length - 1];
  if (!last) return null;

  for (let i = 0; i + 2 < phrases.length; i++) {
    if (isSentence(line, phrases[i]!, phrases[i + 1]!, phrases[i + 2]!)) return 'sentence';
  }

  // PÉRIODE : deux phrases, l'antécédent SUSPENDU (il ne se pose pas sur la note
  // finale), le conséquent CONCLUSIF (il s'y pose) — et un conséquent qui a le
  // droit d'être étendu ou comprimé (voir CONSEQUENT_MIN/MAX).
  if (phrases.length === 2) {
    const [a, b] = phrases as [Phrase, Phrase];
    const ratio = (b.to - b.from) / (a.to - a.from);
    const endA = [...line].reverse().find(n => n.start < a.to);
    if (ratio >= CONSEQUENT_MIN && ratio <= CONSEQUENT_MAX && endA && pc(endA.pitch) !== pc(last.pitch)) {
      return 'period';
    }
  }
  return null;
}

/**
 * `phraseAnalysis(notes, meter)` — où la mélodie respire, et ce que ses
 * respirations dessinent. Les phrases se mesurent de SEUIL À SEUIL (silences
 * compris) : c'est ainsi qu'un 1+1+2 se lit 1 mesure, 1 mesure, 2 mesures même
 * quand les deux énoncés courts ne contiennent qu'une demi-mesure de notes.
 */
export function phraseAnalysis(notes: readonly Note[], meter: Meter): PhraseAnalysis {
  const line = melodyLine(notes);
  if (line.length === 0) return { phrases: [], boundaries: [], elisions: [], structure: null };

  const boundaries = detectBoundaries(line, meter);
  const end = line.reduce((m, n) => Math.max(m, n.start + n.duration), 0);

  const starts = [line[0]!.start, ...boundaries.map(b => b.at)];
  const phrases: Phrase[] = starts.map((from, i) => {
    const to = starts[i + 1] ?? end;
    return { from, to, noteCount: line.filter(n => n.start >= from && n.start < to).length };
  });

  return {
    phrases,
    boundaries,
    elisions: boundaries.filter(b => b.kind === 'elision').map(b => b.at),
    structure: detectStructure(line, phrases),
  };
}
