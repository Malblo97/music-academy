import type { Mode, Note } from '../types.js';
import { KS_MAJOR, KS_MINOR } from '../data/krumhansl.js';

export interface KeyEstimate {
  tonic: number; // pitch-class 0-11
  mode: Mode;
  confidence: number;
  ambiguous: boolean;
  alternates: KeyEstimate[];
  rawProfiles: number[]; // 24 corrélations : indices 0-11 = majeur (tonique i), 12-23 = mineur (tonique i-12)
}

/** Constante de calibrage (scoring.ts) : écart best-second sous ce seuil = tonalité ambiguë (F-11). */
const AMBIGUITY_THRESHOLD = 0.08;

/** Mètre par défaut pour la détection des temps forts (F-19.b) : aucune solution M1-M3 ne déclare de mètre — cf. solutions.test.ts. */
const DEFAULT_BAR_TICKS = 1920;

const MAJOR_SCALE_STEPS = [0, 2, 4, 5, 7, 9, 11];

/** Le rang de chaque mode dans la rotation de la gamme majeure (l07 M1). */
const MODE_ROTATION: Record<string, number> = {
  major: 0, dorian: 1, phrygian: 2, lydian: 3, mixolydian: 4, minor: 5, locrian: 6,
};

/**
 * **Les pitch-classes d'une tonalité**, mode compris.
 *
 * Une seule définition pour tout le moteur : la règle `melody.out-of-key`, le
 * checker `key` et tout ce qui demandera « cette note appartient-elle à la
 * tonalité ? » doivent répondre la même chose. Les avoir écrites deux fois,
 * c'était garantir qu'elles divergent — et la version câblée en majeur jugeait
 * une pièce en dorien contre le MAJEUR de sa tonique, comptant sa tierce et sa
 * septième mineures comme des notes étrangères.
 *
 * En mineur, la sensible et la 6e haussées font partie de la tonalité : le
 * mineur harmonique et le mélodique ne sont pas des écarts (m01-l11).
 */
export function scalePcs(tonic: number, mode: Mode | string): Set<number> {
  const rot = MODE_ROTATION[mode] ?? 0;
  const base = MAJOR_SCALE_STEPS[rot]!;
  const out = new Set(MAJOR_SCALE_STEPS.map((_, i) => pc(tonic + MAJOR_SCALE_STEPS[(i + rot) % 7]! - base)));
  if (rot === 5) {
    out.add(pc(tonic + 11)); // sensible du mineur harmonique
    out.add(pc(tonic + 9)); // 6e du mineur mélodique
  }
  return out;
}
/** Le mode de chaque degré de la gamme majeure, dans l'ordre des degrés (l07 M1). */
const MODE_BY_DEGREE: Mode[] = ['major', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'minor', 'locrian'];
/** Intervalle (demi-tons depuis la tonique) de la note caractéristique de chaque mode modal (garde-fou F-19). */
const CHARACTERISTIC_INTERVAL: Partial<Record<Mode, number>> = {
  dorian: 9, // 6̂ majeure
  phrygian: 1, // ♭2̂
  lydian: 6, // ♯4̂
  mixolydian: 10, // ♭7̂
  locrian: 6, // ♭5̂
};

function pc(pitch: number): number {
  return ((pitch % 12) + 12) % 12;
}

function rotate(profile: readonly number[], tonic: number): number[] {
  // rotated[p] = poids du degré (p - tonic) dans le profil de référence.
  return Array.from({ length: 12 }, (_, p) => profile[((p - tonic) % 12 + 12) % 12]!);
}

function pearson(a: readonly number[], b: readonly number[]): number {
  const n = a.length;
  const meanA = a.reduce((s, v) => s + v, 0) / n;
  const meanB = b.reduce((s, v) => s + v, 0) / n;
  let num = 0, denA = 0, denB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i]! - meanA;
    const db = b[i]! - meanB;
    num += da * db;
    denA += da * da;
    denB += db * db;
  }
  const den = Math.sqrt(denA * denB);
  return den === 0 ? 0 : num / den;
}

/** La voix la plus grave : à chaque attaque, la note la plus basse sonnant à cet instant. */
function bassLine(notes: readonly Note[]): Note[] {
  const byStart = new Map<number, Note>();
  for (const n of notes) {
    const cur = byStart.get(n.start);
    if (!cur || n.pitch < cur.pitch) byStart.set(n.start, n);
  }
  return [...byStart.values()].sort((a, b) => a.start - b.start);
}

/** F-19.a/b : la pitch-class d'ancrage de la basse, ou null si aucune n'émerge. */
function insistencePc(notes: readonly Note[]): number | null {
  const bass = bassLine(notes);
  if (bass.length === 0) return null;

  // (a) ≥ 50 % de la durée totale de la voix la plus grave sur une seule pc.
  const totalDur = bass.reduce((s, n) => s + n.duration, 0);
  const durByPc = new Map<number, number>();
  for (const n of bass) durByPc.set(pc(n.pitch), (durByPc.get(pc(n.pitch)) ?? 0) + n.duration);
  const byDuration = [...durByPc.entries()].sort((a, b) => b[1] - a[1])[0];
  if (byDuration && totalDur > 0 && byDuration[1] / totalDur >= 0.5) return byDuration[0];

  // (b) première ET dernière basse identiques + majorité des temps forts (mètre par défaut 4/4).
  const firstPc = pc(bass[0]!.pitch);
  const lastPc = pc(bass[bass.length - 1]!.pitch);
  if (firstPc === lastPc) {
    const onBeat = bass.filter(n => n.start % DEFAULT_BAR_TICKS === 0);
    const onBeatSamePc = onBeat.filter(n => pc(n.pitch) === firstPc);
    if (onBeat.length > 0 && onBeatSamePc.length / onBeat.length > 0.5) return firstPc;
  }

  return null;
}

/**
 * La gamme majeure "parente" dont TOUTES les pcs utilisées sont membres — au
 * sens propre (recherche indépendante du verdict Krumhansl, qui peut se
 * tromper de MODE tout en ayant la bonne tonique, ex. un bourdon dorien lu
 * "mineur"). `null` si aucune rotation ne contient la collection entière
 * (mineur harmonique, chromatisme...).
 */
function findParentMajorTonic(usedPcs: ReadonlySet<number>): number | null {
  for (let t = 0; t < 12; t++) {
    const scale = new Set(MAJOR_SCALE_STEPS.map(s => pc(s + t)));
    if ([...usedPcs].every(p => scale.has(p))) return t;
  }
  return null;
}

/** Fabrique une KeyEstimate "plate" (sans alternates ni rawProfiles) pour les alternates. */
function flatEstimate(tonic: number, mode: Mode, confidence: number): KeyEstimate {
  return { tonic, mode, confidence, ambiguous: false, alternates: [], rawProfiles: [] };
}

export function estimateKey(notes: Note[], opts?: { window?: [number, number] }): KeyEstimate {
  const [from, to] = opts?.window ?? [0, Infinity];
  const relevant = notes.filter(n => n.start < to && n.start + n.duration > from);

  // 1. Histogramme des 12 pitch-classes pondéré par durée (recadrée sur la fenêtre).
  const histogram = new Array(12).fill(0) as number[];
  for (const n of relevant) {
    const start = Math.max(n.start, from);
    const end = Math.min(n.start + n.duration, to);
    const dur = Math.max(0, end - start);
    const p = pc(n.pitch);
    histogram[p] = (histogram[p] ?? 0) + dur;
  }

  // 2. Corrélation de Pearson contre les 24 rotations (12 maj + 12 min) — stockées AVANT toute retouche (F-11).
  const rawProfiles: number[] = [
    ...Array.from({ length: 12 }, (_, t) => pearson(histogram, rotate(KS_MAJOR, t))),
    ...Array.from({ length: 12 }, (_, t) => pearson(histogram, rotate(KS_MINOR, t))),
  ];

  const ranked = rawProfiles
    .map((corr, i) => ({ corr, tonic: i % 12, mode: (i < 12 ? 'major' : 'minor') as Mode }))
    .sort((a, b) => b.corr - a.corr);
  const best = ranked[0]!;
  const second = ranked[1]!;

  // 3. Confiance et ambiguïté — sur le verdict BRUT, avant F-19/modal (F-11).
  const confidence = best.corr - second.corr;
  const ambiguous = confidence < AMBIGUITY_THRESHOLD;

  let tonic = best.tonic;
  let mode = best.mode;

  const usedPcs = new Set(histogram.map((d, p) => (d > 0 ? p : -1)).filter(p => p >= 0));

  // 4. F-19 — l'ancrage par insistance (avant d'accepter le verdict Krumhansl).
  // Recalculée même quand l'ancrage confirme la tonique Krumhansl : le bourdon
  // peut corriger le MODE (dorien lu "mineur" faute de sensible) sans changer
  // de tonique — l'important est que le résultat FINAL soit correct, pas que
  // Krumhansl ait eu tort sur la tonique.
  const anchor = insistencePc(relevant);
  let relabeled = false;
  if (anchor !== null) {
    const parentMajorTonic = findParentMajorTonic(usedPcs);
    if (parentMajorTonic !== null) {
      const degreeIndex = MAJOR_SCALE_STEPS.indexOf(pc(anchor - parentMajorTonic));
      if (degreeIndex >= 0) {
        const candidateMode = MODE_BY_DEGREE[degreeIndex]!;
        const characteristic = CHARACTERISTIC_INTERVAL[candidateMode];
        // Garde-fou : la note caractéristique du mode candidat doit être exposée,
        // sinon on ne bascule pas (ex. pédale de dominante sous un I qui reste majeur).
        const exposed = characteristic === undefined || usedPcs.has(pc(anchor + characteristic));
        if (exposed) {
          tonic = anchor;
          mode = candidateMode;
          relabeled = true;
        }
      }
    }
  }
  if (!relabeled && mode === 'major') {
    // 5. Passe modale classique (sans insistance) : majeur détecté mais ♭7 exposé
    // et AUCUNE sensible (7 naturelle) présente → mixolydien (raffinement d'étiquette,
    // jamais de changement de tonique hors F-19).
    const hasFlat7 = usedPcs.has(pc(tonic + 10));
    const hasNatural7 = usedPcs.has(pc(tonic + 11));
    if (hasFlat7 && !hasNatural7) mode = 'mixolydian';
  }

  const alternates = ranked.slice(1, 4).map(r => flatEstimate(r.tonic, r.mode, r.corr));

  return { tonic, mode, confidence, ambiguous, alternates, rawProfiles };
}
