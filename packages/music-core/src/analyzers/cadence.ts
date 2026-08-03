import type { Meter, Note } from '../types.js';
import { metricWeight } from './rhythm.js';
import type { ChordResult } from './chord.js';
import type { KeyEstimate } from './key.js';

/**
 * Un accord daté. `notes` porte les notes sonnant sur la fenêtre (nécessaire
 * pour déterminer la voix de soprano — la seule condition des quatre de la
 * cadence parfaite (l16 M1) que `ChordResult` seul ne porte pas). `idiomTags`
 * est posé par l'idiom-tagger (S2.J4, pas encore écrit) : dépendance d'ordre
 * du pipeline (F-16) — ici simplement lu s'il est fourni.
 */
export interface TimedChord {
  chord: ChordResult;
  from: number;
  to: number;
  notes: readonly Note[];
  idiomTags?: readonly string[];
}

export type CadenceKind = 'perfect' | 'imperfect' | 'half' | 'deceptive' | 'plagal' | 'modal';
export interface CadenceEvent {
  kind: CadenceKind;
  at: number; // tick de l'accord d'arrivée
  /**
   * Les degrés de la paire (pénultième, arrivée), en demi-tons depuis la
   * tonique. Portés par les cadences MODALES, que les specs nomment par leur
   * formule exacte (`modal:♭VII-I`, `modal:IV-i`…) et non par une catégorie
   * fonctionnelle : en modal, c'est le CHEMIN qui fait la cadence, puisqu'il
   * n'y a pas de dominante pour la faire à sa place.
   */
  degrees?: [number, number];
}

/**
 * Les quatre formules modales du cursus (M3 l08, l13). Toutes descendent ou
 * montent sur la tonique SANS sensible : c'est leur définition même, et c'est
 * pourquoi aucune ne peut être classée par `functionOf`.
 */
const MODAL_PENULTS = new Set([1, 2, 5, 10]); // ♭II, II, IV, ♭VII

/** Vrai pour les modes où la grammaire fonctionnelle ne s'applique pas. */
function isExoticMode(key: KeyEstimate): boolean {
  return key.mode !== 'major' && key.mode !== 'minor';
}

/** Mètre par défaut (F-5, F-2) : aucune solution M1-M3 ne déclare de mètre. */
const DEFAULT_BAR_TICKS = 1920;

function pc(n: number): number {
  return ((n % 12) + 12) % 12;
}

export function functionOf(chord: ChordResult, key: KeyEstimate): 'T' | 'S' | 'D' | 'other' {
  const degree = pc(chord.root - key.tonic);

  if (key.mode === 'major') {
    if (degree === 0 || degree === 4 || degree === 9) return 'T'; // I, iii, vi
    if (degree === 5 || degree === 2) return 'S'; // IV, ii
    if (degree === 7 || degree === 11 || degree === 10) return 'D'; // V, vii°, ♭VII (back-door)
    return 'other';
  }
  if (key.mode === 'minor') {
    if (degree === 0 || degree === 8 || degree === 3) return 'T'; // i, VI, III
    if (degree === 5 || degree === 2) return 'S'; // iv, ii°
    if (degree === 7 || degree === 11 || degree === 10) return 'D'; // v/V, vii° (mineur harmonique), VII (back-door)
    return 'other';
  }
  // Modes exotiques (M3, `forbidFunctionalCadence`) : pas de grammaire fonctionnelle —
  // seule la tonique porte un repos, tout le reste est hors T/S/D par construction.
  return degree === 0 ? 'T' : 'other';
}

function isRootPosition(chord: ChordResult): boolean {
  return chord.bass === pc(chord.root);
}

function sopranoPc(notes: readonly Note[]): number | null {
  if (notes.length === 0) return null;
  return pc(notes.reduce((max, n) => (n.pitch > max.pitch ? n : max)).pitch);
}

function submediantDegree(key: KeyEstimate): number {
  return key.mode === 'minor' ? 8 : 9; // VI (mineur) vs vi (majeur)
}

/**
 * **F-5** : n'enregistre que si l'accord d'arrivée tient ≥ 1 mesure OU termine
 * un SEGMENT. Une cadence est un fait de forme : sans poids structurel, un
 * V→I de passage au milieu d'une phrase n'est pas une ponctuation.
 *
 * `segmentEnds` porte TOUTES les frontières, pas seulement la fin de la pièce.
 * La distinction est décisive : `m01-e30-cadence-lab` demande quatre cadences
 * en quatre segments de deux mesures (`segmentBars: 2`), et chacune arrive sur
 * une blanche. Jugées contre la seule fin de pièce, trois d'entre elles étaient
 * invisibles — dont la parfaite, sur l'exercice qui l'enseigne.
 */
function passesF5(arrival: TimedChord, opts: { segmentEnd?: number; segmentEnds?: readonly number[] }): boolean {
  const holds = arrival.to - arrival.from >= DEFAULT_BAR_TICKS;
  const ends = opts.segmentEnds ?? (opts.segmentEnd !== undefined ? [opts.segmentEnd] : []);
  return holds || ends.includes(arrival.to);
}

function classifyPair(penult: TimedChord, arrival: TimedChord, key: KeyEstimate): CadenceEvent['kind'] | null {
  const penultDeg = pc(penult.chord.root - key.tonic);
  const arrivalDeg = pc(arrival.chord.root - key.tonic);

  // En mode exotique, la grammaire fonctionnelle ne s'applique pas (cf.
  // `functionOf`) : une arrivée sur la tonique par ♭II, II, IV ou ♭VII est une
  // cadence MODALE, nommée par son chemin. Le classement fonctionnel n'aurait
  // rien à en dire — `modal:♭VII-I` ne trouvait aucune branche et sortait nul.
  if (isExoticMode(key) && arrivalDeg === 0 && MODAL_PENULTS.has(penultDeg)) return 'modal';

  // F-16 : un accord tagué aug6 (idiome tourné en amont) n'est jamais un V/IV
  // fonctionnel de la tonalité courante — seul "half" (arrêt sur le VRAI V
  // suivant) reste éligible, jamais perfect/imperfect/deceptive/plagal.
  const penultIsAug6 = penult.idiomTags?.includes('aug6') ?? false;

  if (!penultIsAug6 && penultDeg === 7 && arrivalDeg === 0) {
    const soprano = sopranoPc(arrival.notes);
    const strict = isRootPosition(penult.chord) && isRootPosition(arrival.chord) && soprano === pc(key.tonic);
    return strict ? 'perfect' : 'imperfect';
  }
  if (!penultIsAug6 && penultDeg === 7 && arrivalDeg === submediantDegree(key)) return 'deceptive';
  if (!penultIsAug6 && penultDeg === 5 && arrivalDeg === 0) return 'plagal';
  if (arrivalDeg === 7) return 'half'; // arrêt sur V, quel que soit le chemin (y compris depuis un aug6)
  return null;
}

/**
 * **F-2** : repli monophonique quand aucune harmonie n'est disponible.
 *
 * Le critère d'ACCENT a été corrigé pendant le verrou n°2. Il exigeait
 * `start % mesure === 0`, c'est-à-dire le PREMIER TEMPS — or une cadence
 * parfaite ne tombe pas nécessairement sur le temps 1 : les quatre mélodies
 * concernées du corpus (m01-s49, m02-s05, m02-s10, m02-s21) concluent toutes
 * sensible → tonique sur une valeur tenue, au temps 3 ou après une levée, et
 * aucune n'était reconnue.
 *
 * Ce qui fait la conclusion, ce n'est pas la position absolue : c'est que
 * l'arrivée soit **plus accentuée et plus longue que sa préparation**. C'est
 * exactement la relation que décrit m01-l16 — la sensible brève sur l'appui
 * faible, la tonique tenue sur l'appui fort qui suit.
 */
function monophonicCadence(melody: readonly Note[], key: KeyEstimate, meter: Meter): CadenceEvent[] {
  if (melody.length < 2) return [];
  const last = melody[melody.length - 1]!;
  const penult = melody[melody.length - 2]!;
  const lastDeg = pc(last.pitch - key.tonic);
  const penultDeg = pc(penult.pitch - key.tonic);

  const held = last.duration >= DEFAULT_BAR_TICKS / 4 && last.duration >= penult.duration;
  const accented = metricWeight(last.start, meter) >= metricWeight(penult.start, meter);
  if ((penultDeg === 11 || penultDeg === 2) && lastDeg === 0 && held && accented) {
    return [{ kind: 'perfect', at: last.start }];
  }
  if (lastDeg === 7 || lastDeg === 2) {
    return [{ kind: 'half', at: last.start }];
  }
  return [];
}

export function detectCadences(
  chords: readonly TimedChord[],
  key: KeyEstimate,
  opts: {
    segmentEnd?: number;
    /** Les frontières de segment, en ticks (F-5). Prime sur `segmentEnd`. */
    segmentEnds?: readonly number[];
    melodyOnly?: readonly Note[];
    /** Métrique, pour l'accent du repli monophonique (F-2). */
    meter?: Meter;
  } = {},
): CadenceEvent[] {
  if (opts.melodyOnly) return monophonicCadence(opts.melodyOnly, key, opts.meter ?? [4, 4]);

  const events: CadenceEvent[] = [];
  // 1. Fenêtre glissante paire (pénultième → finale) sur toute la séquence.
  for (let i = 0; i < chords.length - 1; i++) {
    const penult = chords[i]!;
    const arrival = chords[i + 1]!;
    const kind = classifyPair(penult, arrival, key);
    if (!kind || !passesF5(arrival, opts)) continue;
    const event: CadenceEvent = { kind, at: arrival.from };
    if (kind === 'modal') {
      event.degrees = [pc(penult.chord.root - key.tonic), pc(arrival.chord.root - key.tonic)];
    }
    events.push(event);
  }
  return events;
}
