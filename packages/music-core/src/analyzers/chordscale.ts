import { TICKS } from '../types.js';
import type { Issue, Meter, Note } from '../types.js';
import { avoidDegrees, chordScaleOf } from '../data/chordScales.js';
import type { Vertical } from './idioms.js';
import { metricWeight } from './rhythm.js';

/**
 * `chordScaleCheck` (m08-l06) — chaque note est rapportée à la gamme de
 * l'accord sous lequel elle sonne. Deux verdicts seulement :
 *
 *  - **hors gamme** : une issue, SAUF chromatisme conduit (approché ET quitté
 *    par demi-ton dans la même direction — le chromatisme qui MÈNE quelque part
 *    n'est pas une faute, c'est le geste de m01-l22) ;
 *  - **note d'évitement (F-45)** : légale quand elle PASSE, flaguée quand elle
 *    SE POSE. « Posée » a fallu être chiffré pour que le checker sache le
 *    mesurer (m08-s06, témoin F-45) : **temps fort OU durée ≥ noire OU quittée
 *    par saut**. Passante : temps faible ET brève ET quittée par degré.
 */

/** F-45 : au-delà, la note ne passe plus, elle se pose. */
const POSED_DURATION = TICKS.q!;

export interface ChordScaleOpts {
  meter?: Meter;
}

function pc(n: number): number {
  return ((n % 12) + 12) % 12;
}

/** La ligne jugée : une note par attaque, la plus aiguë. */
function melodyLine(notes: readonly Note[]): Note[] {
  const top = new Map<number, Note>();
  for (const n of notes) {
    const cur = top.get(n.start);
    if (!cur || n.pitch > cur.pitch) top.set(n.start, n);
  }
  return [...top.values()].sort((a, b) => a.start - b.start);
}

function isStep(a: number, b: number): boolean {
  const d = Math.abs(a - b);
  return d >= 1 && d <= 2;
}

/** Chromatisme CONDUIT : arrivée et départ d'un demi-ton, dans la même direction. */
function isConductedChromatic(prev: Note | undefined, note: Note, next: Note | undefined): boolean {
  if (!prev || !next) return false;
  const inMotion = note.pitch - prev.pitch;
  const outMotion = next.pitch - note.pitch;
  return Math.abs(inMotion) === 1 && Math.abs(outMotion) === 1 && Math.sign(inMotion) === Math.sign(outMotion);
}

/** F-45 : la note d'évitement est-elle POSÉE ? */
export function isPosed(note: Note, next: Note | undefined, meter: Meter): boolean {
  if (metricWeight(note.start, meter) >= 2) return true; // temps fort
  if (note.duration >= POSED_DURATION) return true; // longue
  return next !== undefined && !isStep(note.pitch, next.pitch); // quittée par saut
}

/**
 * Rend une issue par note fautive. Les verticalités sans accord détecté
 * (`chord: null` — empilements non tertiens) sont ignorées : la grammaire
 * chord-scale ne s'y applique pas.
 */
export function chordScaleCheck(
  notes: readonly Note[],
  verticals: readonly Vertical[],
  opts: ChordScaleOpts = {},
): Issue[] {
  const meter = opts.meter ?? ([4, 4] as Meter);
  const line = melodyLine(notes);
  const issues: Issue[] = [];

  for (let i = 0; i < line.length; i++) {
    const note = line[i]!;
    const vertical = verticals.find(v => note.start >= v.from && note.start < v.to);
    const chord = vertical?.chord;
    if (!chord) continue;
    const cs = chordScaleOf(chord.form);
    if (!cs) continue;

    const degree = pc(note.pitch - chord.root);
    const prev = line[i - 1];
    const next = line[i + 1];

    // Une TENSION de l'accord n'est pas une étrangère à sa gamme : c'est
    // l'accord lui-même. Le ♭9 d'un G7♭9 a déjà été lu au chiffrage
    // (décision n°33) — le reprocher ici, ce serait compter deux fois la même
    // note, une fois comme couleur et une fois comme faute.
    if (chord.tensions.includes(degree)) continue;

    if (!cs.intervals.includes(degree)) {
      if (isConductedChromatic(prev, note, next)) continue;
      issues.push({
        ruleId: 'jazz.chord-scale',
        severity: 'warning',
        atTick: note.start,
        message: `hors ${cs.scale} de l'accord : degré ${degree} non conduit (le chromatisme doit MENER quelque part)`,
        lessonRef: 'm08-l06',
      });
      continue;
    }

    if (avoidDegrees(cs).includes(degree) && isPosed(note, next, meter)) {
      issues.push({
        ruleId: 'jazz.avoid-note',
        severity: 'warning',
        atTick: note.start,
        message: `note d'évitement posée (degré ${degree} sur ${cs.scale}) : elle passe, elle ne se pose pas (F-45)`,
        lessonRef: 'm08-l06',
      });
    }
  }
  return issues;
}
