import type { Note } from '../types.js';

/**
 * Les six familles de collections du cursus (M3, l08–l12). `melodic-minor`
 * existe pour F-20 : le lydien ♭7 (le G7♯11 de s09) n'est ni diatonique ni
 * altération d'un diatonique — c'est une ROTATION du mineur mélodique, et sans
 * la famille il restait indétectable.
 */
export type CollectionFamily =
  | 'pentatonic'
  | 'whole-tone'
  | 'diatonic'
  | 'melodic-minor'
  | 'octatonic'
  | 'chromatic';

export interface CollectionResult {
  family: CollectionFamily;
  /** pc de la racine de la collection (sa rotation « zéro »). */
  transposition: number;
  /** Part des DURÉES dont la pitch-class appartient à la collection. */
  coverage: number;
}

/** Seuil de la collection « stricte » (S2.J4) : en deçà, la lecture ne tient pas. */
export const STRICT_COVERAGE = 0.95;

interface FamilySpec {
  family: CollectionFamily;
  /** Intervalles depuis la racine. */
  intervals: readonly number[];
  /** Nombre de transpositions DISTINCTES (les tons entiers n'en ont que 2). */
  transpositions: number;
}

/**
 * L'ordre EST la priorité : la collection la plus PETITE qui tienne gagne. Dire
 * « chromatique » d'une pièce en tons entiers serait vrai et muet — la
 * chromatique, qui couvre tout par construction, n'est donc examinée qu'en
 * dernier recours. Diatonique passe avant mineur mélodique à cardinalité égale :
 * c'est le cas ordinaire, et F-20 n'est pas là pour requalifier tout le corpus.
 */
const FAMILIES: readonly FamilySpec[] = [
  { family: 'pentatonic', intervals: [0, 2, 4, 7, 9], transpositions: 12 },
  { family: 'whole-tone', intervals: [0, 2, 4, 6, 8, 10], transpositions: 2 },
  { family: 'diatonic', intervals: [0, 2, 4, 5, 7, 9, 11], transpositions: 12 },
  { family: 'melodic-minor', intervals: [0, 2, 3, 5, 7, 9, 11], transpositions: 12 },
  { family: 'octatonic', intervals: [0, 1, 3, 4, 6, 7, 9, 10], transpositions: 3 },
  { family: 'chromatic', intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], transpositions: 1 },
];

function pc(pitch: number): number {
  return ((pitch % 12) + 12) % 12;
}

function specOf(family: CollectionFamily): FamilySpec {
  const spec = FAMILIES.find(f => f.family === family);
  if (!spec) throw new Error(`collection : famille inconnue "${family}"`);
  return spec;
}

/** Durée cumulée par pitch-class sur la fenêtre. */
function durationByPc(notes: readonly Note[], window?: [number, number]): { byPc: number[]; total: number } {
  const [from, to] = window ?? [0, Infinity];
  const byPc = new Array<number>(12).fill(0);
  let total = 0;
  for (const n of notes) {
    const dur = Math.min(n.start + n.duration, to) - Math.max(n.start, from);
    if (dur <= 0) continue;
    const p = pc(n.pitch);
    byPc[p] = byPc[p]! + dur;
    total += dur;
  }
  return { byPc, total };
}

/** Les pitch-classes de la collection, triées. */
export function collectionPcs(family: CollectionFamily, transposition: number): number[] {
  return specOf(family).intervals.map(i => pc(i + transposition)).sort((a, b) => a - b);
}

/**
 * Le rang (1-based) de `anchorPc` dans la collection — la ROTATION, c'est-à-dire
 * le mode. `rotationOf('melodic-minor', 2, 7) === 4` : sol dans ré mineur
 * mélodique = 4e rotation = lydien ♭7 (F-20). `null` si l'ancre n'est pas membre.
 */
export function rotationOf(family: CollectionFamily, transposition: number, anchorPc: number): number | null {
  const idx = specOf(family).intervals.indexOf(pc(anchorPc - transposition));
  return idx < 0 ? null : idx + 1;
}

/**
 * « À quel point est-ce du <famille> de <transposition> ? » — la question
 * inverse de `detectCollection`, celle que pose `requireCollection` : la
 * collection est IMPOSÉE par la consigne et on mesure ce qui en sort.
 * Comparer à `STRICT_COVERAGE`.
 */
export function collectionCoverage(
  notes: readonly Note[],
  family: CollectionFamily,
  transposition: number,
  window?: [number, number],
): number {
  const { byPc, total } = durationByPc(notes, window);
  if (total === 0) return 0;
  const members = new Set(collectionPcs(family, transposition));
  let inside = 0;
  for (let p = 0; p < 12; p++) if (members.has(p)) inside += byPc[p]!;
  return inside / total;
}

/**
 * `detectCollection(notes, window)` → la plus petite collection qui tienne au
 * seuil strict, sa transposition, et la couverture obtenue. La chromatique est
 * le dernier recours : la rendre signifie « aucune collection plus étroite ne
 * tient », jamais « la pièce est chromatique par choix ». `null` si la fenêtre
 * ne contient rien.
 */
export function detectCollection(notes: readonly Note[], window?: [number, number]): CollectionResult | null {
  const { byPc, total } = durationByPc(notes, window);
  if (total === 0) return null;

  for (const spec of FAMILIES) {
    let best: CollectionResult | null = null;
    for (let t = 0; t < spec.transpositions; t++) {
      const members = new Set(spec.intervals.map(i => pc(i + t)));
      let inside = 0;
      for (let p = 0; p < 12; p++) if (members.has(p)) inside += byPc[p]!;
      const coverage = inside / total;
      // Départage interne : couverture, puis la transposition la plus basse.
      if (!best || coverage > best.coverage + 1e-9) best = { family: spec.family, transposition: t, coverage };
    }
    if (best && best.coverage >= STRICT_COVERAGE) return best;
  }
  // Inatteignable : la chromatique couvre 1 par construction.
  return { family: 'chromatic', transposition: 0, coverage: 1 };
}
