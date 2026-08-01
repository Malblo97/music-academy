import type { Note } from '../types.js';
import { CHORD_FORMS } from '../data/chordForms.js';

/**
 * Plan de pédale (F-18) : la/les plages où une pitch-class est tenue en
 * bourdon pendant que l'harmonie change au-dessus. `ranges` en TICKS (mêmes
 * unités que `Note.start`/`at.from`/`at.to`) — la conversion mesure→ticks est
 * à la charge de l'appelant, qui connaît le mètre. `state` documente le
 * rapport pédale/accord pour un jugement séparé (`harmony.*`) ; `detectChord`
 * ne s'en sert pas pour décider — toute plage couvrante suffit à exclure la pc.
 */
export interface PedalPlan {
  pc: number;
  ranges: { from: number; to: number; state: 'compatible' | 'frottee' | 'contredite' | 'resolution' }[];
}

export interface ChordResult {
  root: number; // pitch-class de la fondamentale
  form: string; // nom de la forme (data/chordForms.ts)
  bass: number; // pitch-class réellement à la basse (hors pédale exclue)
  inversion: number; // 0 = fondamentale à la basse, 1/2/3 = renversements
  pcs: number[]; // pitch-classes de la verticalité jugée (pédale exclue)
}

function pc(pitch: number): number {
  return ((pitch % 12) + 12) % 12;
}

function overlaps(aFrom: number, aTo: number, bFrom: number, bTo: number): boolean {
  return aFrom < bTo && bFrom < aTo;
}

/** F-18 : la pédale est couverte par le plan si une de ses plages recouvre la fenêtre jugée. */
function pedalCoversWindow(plan: PedalPlan | undefined, from: number, to: number): boolean {
  return plan !== undefined && plan.ranges.some(r => overlaps(r.from, r.to, from, to));
}

export function detectChord(
  notes: readonly Note[],
  at: { from: number; to: number },
  ctx?: { pedalPlan?: PedalPlan },
): ChordResult | null {
  const sounding = notes.filter(n => overlaps(n.start, n.start + n.duration, at.from, at.to));
  if (sounding.length === 0) return null;

  // 1. Verticalité = pitch-classes sonnant sur la fenêtre.
  const pcs = new Set(sounding.map(n => pc(n.pitch)));

  // 2. F-18 : si le plan de pédale couvre la fenêtre, retire sa pc AVANT le matching.
  if (ctx?.pedalPlan && pedalCoversWindow(ctx.pedalPlan, at.from, at.to)) {
    pcs.delete(ctx.pedalPlan.pc);
  }
  if (pcs.size === 0) return null;

  // Basse réelle = pc la plus grave restante (la pédale exclue est jugée à part).
  const lowestNote = sounding
    .filter(n => pcs.has(pc(n.pitch)))
    .reduce((min, n) => (n.pitch < min.pitch ? n : min));
  const bass = pc(lowestNote.pitch);

  // 3. Essaie chaque forme × 12 fondamentales — match exact des pcs requises.
  interface Candidate { root: number; formName: string; richness: number; rootPosition: boolean }
  const candidates: Candidate[] = [];
  for (const form of CHORD_FORMS) {
    for (let root = 0; root < 12; root++) {
      const formPcs = form.intervals.map(iv => pc(root + iv));
      const formPcSet = new Set(formPcs);
      // Aucune pc étrangère à la forme.
      if (![...pcs].every(p => formPcSet.has(p))) continue;
      // Toutes les pcs requises (la 5e omise seulement si fifthOptional) présentes.
      const fifthPc = pc(root + 7);
      const required = form.fifthOptional ? formPcs.filter(p => p !== fifthPc) : formPcs;
      if (!required.every(p => pcs.has(p))) continue;

      candidates.push({ root, formName: form.name, richness: form.intervals.length, rootPosition: bass === pc(root) });
    }
  }
  if (candidates.length === 0) return null;

  // 4. Départage : forme la plus riche compatible, puis basse = fondamentale > renversement.
  candidates.sort((a, b) => b.richness - a.richness || Number(b.rootPosition) - Number(a.rootPosition));
  const winner = candidates[0]!;

  const form = CHORD_FORMS.find(f => f.name === winner.formName)!;
  const inversion = form.intervals.findIndex(iv => pc(winner.root + iv) === bass);

  return { root: winner.root, form: winner.formName, bass, inversion: Math.max(0, inversion), pcs: [...pcs].sort((a, b) => a - b) };
}

// ---------------------------------------------------------------------------
// Notes étrangères — la table des six (m02-l08, §3 : "la table générale... que
// detectChord utilise pour qualifier"). Un seul critère distingue Appoggiature
// de Retard alors qu'ils partagent temps fort + départ conjoint descendant :
// l'arrivée par TENUE (préparée) contre l'arrivée par SAUT/directe.
// ---------------------------------------------------------------------------

export type NonChordToneKind = 'passing' | 'neighbor' | 'appoggiatura' | 'suspension' | 'anticipation' | 'escape';

export interface NCTNote {
  pitch: number;
  /** Vrai si la note est la continuation (même hauteur, pas de nouvelle attaque) de la précédente — Retard. */
  tied: boolean;
}

function isStep(a: number, b: number): boolean {
  const d = Math.abs(a - b);
  return d >= 1 && d <= 2;
}

export function classifyNonChordTone(
  note: NCTNote,
  prevPitch: number | null,
  nextPitch: number | null,
  beatWeight: 'strong' | 'weak',
): NonChordToneKind | null {
  const arrivedByStep = prevPitch !== null && isStep(prevPitch, note.pitch);
  const leavesByStep = nextPitch !== null && isStep(note.pitch, nextPitch);
  const leavesDescendingStep = leavesByStep && nextPitch! < note.pitch;

  if (beatWeight === 'strong') {
    if (leavesDescendingStep && note.tied) return 'suspension'; // Retard : arrivée tenue, départ conjoint descendant
    if (leavesDescendingStep && !note.tied) return 'appoggiatura'; // Appoggiature : arrivée par saut/directe, départ conjoint descendant
    return null;
  }

  // Temps faible (Passage / Broderie / Anticipation / Échappée) : arrivée toujours conjointe.
  if (!arrivedByStep) return null;
  if (nextPitch !== null && nextPitch === note.pitch) return 'anticipation'; // départ = tenue dans l'accord suivant (même hauteur)
  if (prevPitch !== null && nextPitch !== null && nextPitch === prevPitch) return 'neighbor'; // Broderie : retour à la note de départ
  if (leavesByStep) {
    const arriveDir = Math.sign(note.pitch - prevPitch!);
    const leaveDir = Math.sign(nextPitch! - note.pitch);
    if (arriveDir === leaveDir) return 'passing'; // Passage : conjoint, même direction
  }
  if (nextPitch !== null && !leavesByStep) {
    const arriveDir = Math.sign(note.pitch - prevPitch!);
    const leaveDir = Math.sign(nextPitch - note.pitch);
    if (arriveDir !== 0 && leaveDir !== 0 && arriveDir !== leaveDir) return 'escape'; // Échappée : saut en direction opposée
  }
  return null;
}
