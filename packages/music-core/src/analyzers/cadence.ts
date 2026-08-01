import type { Note } from '../types.js';
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

export type CadenceKind = 'perfect' | 'imperfect' | 'half' | 'deceptive' | 'plagal';
export interface CadenceEvent {
  kind: CadenceKind;
  at: number; // tick de l'accord d'arrivée
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

/** F-5 : n'enregistre que si l'accord d'arrivée tient ≥ 1 mesure OU termine le segment. */
function passesF5(arrival: TimedChord, opts: { segmentEnd?: number }): boolean {
  const holds = arrival.to - arrival.from >= DEFAULT_BAR_TICKS;
  const endsSegment = opts.segmentEnd !== undefined && arrival.to === opts.segmentEnd;
  return holds || endsSegment;
}

function classifyPair(penult: TimedChord, arrival: TimedChord, key: KeyEstimate): CadenceKind | null {
  const penultDeg = pc(penult.chord.root - key.tonic);
  const arrivalDeg = pc(arrival.chord.root - key.tonic);

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

/** F-2 : repli monophonique quand aucune harmonie n'est disponible. */
function monophonicCadence(melody: readonly Note[], key: KeyEstimate): CadenceEvent[] {
  if (melody.length < 2) return [];
  const last = melody[melody.length - 1]!;
  const penult = melody[melody.length - 2]!;
  const lastDeg = pc(last.pitch - key.tonic);
  const penultDeg = pc(penult.pitch - key.tonic);

  const longOnStrongBeat = last.duration >= DEFAULT_BAR_TICKS / 2 && last.start % DEFAULT_BAR_TICKS === 0;
  if ((penultDeg === 11 || penultDeg === 2) && lastDeg === 0 && longOnStrongBeat) {
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
  opts: { segmentEnd?: number; melodyOnly?: readonly Note[] } = {},
): CadenceEvent[] {
  if (opts.melodyOnly) return monophonicCadence(opts.melodyOnly, key);

  const events: CadenceEvent[] = [];
  // 1. Fenêtre glissante paire (pénultième → finale) sur toute la séquence.
  for (let i = 0; i < chords.length - 1; i++) {
    const penult = chords[i]!;
    const arrival = chords[i + 1]!;
    const kind = classifyPair(penult, arrival, key);
    if (kind && passesF5(arrival, opts)) events.push({ kind, at: arrival.from });
  }
  return events;
}
