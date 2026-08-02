import type { Note } from '../types.js';

/**
 * `findMotifs` v2 (S2.J5). Un motif est décrit en TROIS COUCHES SÉPARABLES —
 * `intervalShape` (les intervalles), `rhythmShape` (les durées en RATIOS sur la
 * première) et l'ancrage — parce que les transformations du métier n'en
 * touchent qu'une à la fois : transposer garde le rythme, augmenter garde les
 * intervalles, inverser retourne les intervalles et garde tout le reste.
 *
 * Deux findings vivent ici :
 *  - **F-12** : la transposition TONALE (l'imitation « dans la gamme ») décale
 *    les intervalles de ±1 dt. Elle n'est acceptée que si les SIGNES du contour
 *    sont identiques ET le rythme conservé — sinon on accepterait n'importe quoi.
 *  - **F-10** : l'augmentation uniforme est INVISIBLE aux ratios (doubler toutes
 *    les durées ne change aucun rapport). On compare donc le facteur d'échelle
 *    ABSOLU : ≥ 1.5 → augmentation, ≤ 0.67 → diminution.
 */

export type OccurrenceKind = 'exact' | 'transposed' | 'rhythmic' | 'inverted';
export type OccurrenceSub = 'real' | 'tonal' | 'augmentation' | 'diminution';

export interface Occurrence {
  /** Tick de départ de l'occurrence. */
  at: number;
  kind: OccurrenceKind;
  sub?: OccurrenceSub;
}

export interface Motif {
  /** Tick de départ de l'énoncé de référence. */
  anchor: number;
  /** Nombre de notes. */
  length: number;
  intervalShape: number[];
  /** Durées rapportées à la première (F-10 : les ratios seuls ne suffisent pas). */
  rhythmShape: number[];
  occurrences: Occurrence[];
}

export interface Fragment extends Motif {
  parentAnchor: number;
  /**
   * Le fragment porte l'ASPÉRITÉ du parent : son intervalle le plus large ou sa
   * durée la plus atypique. Faux = on fragmente le remplissage.
   */
  isDistinctive: boolean;
}

export interface MotifReport {
  motifs: Motif[];
  bestMotif: Motif | null;
  hasVariedRepetition: boolean;
  maxExactRepetitions: number;
  fragments: Fragment[];
}

export interface FindMotifsOpts {
  /** Fenêtre de candidats (défauts 3 et 8). */
  minLength?: number;
  maxLength?: number;
  /** Occurrences minimales, l'énoncé compris (défaut 2). */
  minOccurrences?: number;
  /** Occurrences minimales d'un fragment, HORS occurrences complètes (défaut 3). */
  minFragmentOccurrences?: number;
}

const TONAL_TOLERANCE = 1; // F-12 : ±1 demi-ton
const AUGMENTATION_FACTOR = 1.5; // F-10
const DIMINUTION_FACTOR = 0.67; // F-10
const MIN_INVERTED_INTERVALS = 3; // garde-fou de l'inversion

interface Line {
  pitch: number[];
  start: number[];
  duration: number[];
}

/**
 * La ligne jugée : une note par attaque, la plus AIGUË (le chant). Les
 * analyseurs de motifs travaillent sur une voix ; l'appelant qui veut juger une
 * voix interne la lui passe seule.
 */
function melodyLine(notes: readonly Note[]): Line {
  const top = new Map<number, Note>();
  for (const n of notes) {
    const cur = top.get(n.start);
    if (!cur || n.pitch > cur.pitch) top.set(n.start, n);
  }
  const sorted = [...top.values()].sort((a, b) => a.start - b.start);
  return {
    pitch: sorted.map(n => n.pitch),
    start: sorted.map(n => n.start),
    duration: sorted.map(n => n.duration),
  };
}

function intervalsOf(line: Line, s: number, length: number): number[] {
  return Array.from({ length: length - 1 }, (_, i) => line.pitch[s + i + 1]! - line.pitch[s + i]!);
}

function ratiosOf(line: Line, s: number, length: number): number[] {
  const first = line.duration[s]!;
  return Array.from({ length }, (_, i) => line.duration[s + i]! / first);
}

/**
 * Égalité des `rhythmShape` en arithmétique ENTIÈRE (produits croisés) : les
 * ratios flottants de `q` sur `q.` ne se comparent pas à l'identique d'une
 * occurrence à l'autre.
 */
function sameRhythmShape(line: Line, a: number, b: number, length: number): boolean {
  const da = line.duration[a]!;
  const db = line.duration[b]!;
  for (let i = 1; i < length; i++) {
    if (line.duration[a + i]! * db !== line.duration[b + i]! * da) return false;
  }
  return true;
}

function classify(line: Line, a: number, b: number, length: number): Occurrence | null {
  const at = line.start[b]!;
  const ivA = intervalsOf(line, a, length);
  const ivB = intervalsOf(line, b, length);
  const sameIntervals = ivA.every((v, i) => v === ivB[i]);
  const sameRhythm = sameRhythmShape(line, a, b, length);
  const scale = line.duration[b]! / line.duration[a]!;

  if (sameIntervals && sameRhythm) {
    if (scale === 1) {
      const samePitch = line.pitch[a] === line.pitch[b];
      // « exact » = les deux couches ET l'ancrage ; sinon c'est une transposition
      // réelle (intervalles identiques, ancrage libre).
      return samePitch ? { at, kind: 'exact' } : { at, kind: 'transposed', sub: 'real' };
    }
    // F-10 : même forme rythmique, durées absolues × k.
    if (scale >= AUGMENTATION_FACTOR) return { at, kind: 'rhythmic', sub: 'augmentation' };
    if (scale <= DIMINUTION_FACTOR) return { at, kind: 'rhythmic', sub: 'diminution' };
    return { at, kind: 'rhythmic' };
  }
  if (sameIntervals) return { at, kind: 'rhythmic' };

  // F-12 : tonale — ±1 dt, MAIS contour et rythme intacts (les deux gardes).
  if (sameRhythm && scale === 1) {
    const contourKept = ivA.every((v, i) => Math.sign(v) === Math.sign(ivB[i]!));
    const withinTolerance = ivA.every((v, i) => Math.abs(v - ivB[i]!) <= TONAL_TOLERANCE);
    if (contourKept && withinTolerance) return { at, kind: 'transposed', sub: 'tonal' };

    // Inversion : le miroir exact, ≥ 3 intervalles et rythme conservé.
    if (ivA.length >= MIN_INVERTED_INTERVALS && ivA.some(v => v !== 0) && ivA.every((v, i) => ivB[i] === -v)) {
      return { at, kind: 'inverted' };
    }
  }
  return null;
}

/**
 * Occurrences NON CHEVAUCHANTES, l'énoncé compris, prises de gauche à droite
 * depuis l'ancrage (qui est, par construction, la première de sa classe).
 */
function occurrencesOf(line: Line, anchor: number, length: number): { indices: number[]; occurrences: Occurrence[] } {
  const indices: number[] = [];
  const occurrences: Occurrence[] = [];
  let nextFree = anchor;
  for (let b = anchor; b + length <= line.pitch.length; b++) {
    if (b < nextFree) continue;
    const occ = b === anchor ? ({ at: line.start[b]!, kind: 'exact' } as Occurrence) : classify(line, anchor, b, length);
    if (!occ) continue;
    indices.push(b);
    occurrences.push(occ);
    nextFree = b + length;
  }
  return { indices, occurrences };
}

function isAnchor(line: Line, s: number, length: number): boolean {
  for (let b = 0; b + length <= s; b++) {
    if (classify(line, b, s, length)) return false;
  }
  return true;
}

/**
 * Distinctivité : l'aspérité mesurée. Moitié intervallique (le plus grand saut,
 * saturé à l'octave), moitié rythmique (la variété des durées) — un motif qui
 * martèle une hauteur sur des durées égales vaut zéro, et c'est voulu.
 */
function distinctiveness(intervalShape: readonly number[], rhythmShape: readonly number[]): number {
  const maxLeap = intervalShape.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  const distinctDurations = new Set(rhythmShape.map(r => r.toFixed(6))).size;
  const rhythmic = rhythmShape.length > 1 ? (distinctDurations - 1) / (rhythmShape.length - 1) : 0;
  return 0.5 * Math.min(1, maxLeap / 12) + 0.5 * rhythmic;
}

function coverageOf(indices: readonly number[], length: number, total: number): number {
  return total === 0 ? 0 : (indices.length * length) / total;
}

interface Candidate {
  motif: Motif;
  indices: number[];
  start: number;
}

/** L'index de la durée la plus ATYPIQUE du parent (la plus rare), ou -1. */
function atypicalDurationIndex(rhythmShape: readonly number[]): number {
  const counts = new Map<string, number>();
  const keys = rhythmShape.map(r => r.toFixed(6));
  for (const k of keys) counts.set(k, (counts.get(k) ?? 0) + 1);
  if (counts.size <= 1) return -1;
  let bestKey = '';
  let bestCount = Infinity;
  for (const [k, c] of counts) {
    if (c < bestCount) { bestCount = c; bestKey = k; }
  }
  return keys.indexOf(bestKey);
}

export function findMotifs(notes: readonly Note[], opts: FindMotifsOpts = {}): MotifReport {
  const minLength = opts.minLength ?? 3;
  const maxLength = opts.maxLength ?? 8;
  const minOccurrences = opts.minOccurrences ?? 2;
  const minFragmentOccurrences = opts.minFragmentOccurrences ?? 3;

  const line = melodyLine(notes);
  const n = line.pitch.length;
  const empty: MotifReport = { motifs: [], bestMotif: null, hasVariedRepetition: false, maxExactRepetitions: 0, fragments: [] };
  if (n < minLength) return empty;

  // 1. Candidats : toutes les fenêtres de minLength..maxLength notes, réduites
  //    aux ANCRAGES (la première fenêtre de sa classe) pour ne pas rapporter
  //    N fois le même motif sous N ancrages différents.
  const candidates: Candidate[] = [];
  for (let length = minLength; length <= Math.min(maxLength, n); length++) {
    for (let s = 0; s + length <= n; s++) {
      if (!isAnchor(line, s, length)) continue;
      const { indices, occurrences } = occurrencesOf(line, s, length);
      if (occurrences.length < minOccurrences) continue;
      candidates.push({
        motif: {
          anchor: line.start[s]!,
          length,
          intervalShape: intervalsOf(line, s, length),
          rhythmShape: ratiosOf(line, s, length),
          occurrences,
        },
        indices,
        start: s,
      });
    }
  }

  // 2. Maximalité : un motif entièrement contenu dans un motif PLUS LONG qui ne
  //    dit pas moins (autant d'occurrences) n'apprend rien — on le retire.
  candidates.sort((a, b) => b.motif.length - a.motif.length || a.start - b.start);
  const kept: Candidate[] = [];
  for (const c of candidates) {
    const covered = kept.some(k =>
      k.motif.length > c.motif.length &&
      k.motif.occurrences.length >= c.motif.occurrences.length &&
      c.indices.every(i => k.indices.some(j => i >= j && i + c.motif.length <= j + k.motif.length)));
    if (!covered) kept.push(c);
  }

  // 3. `bestMotif` = couverture × distinctivité.
  let bestMotif: Motif | null = null;
  let bestScore = -1;
  for (const c of kept) {
    const coverage = coverageOf(c.indices, c.motif.length, n);
    const score = coverage * distinctiveness(c.motif.intervalShape, c.motif.rhythmShape);
    if (score > bestScore || (score === bestScore && bestMotif && c.motif.length > bestMotif.length)) {
      bestScore = score;
      bestMotif = c.motif;
    }
  }

  // 4. Fragments : sous-motifs ≥ 3 notes, ≥ 3 occurrences HORS occurrences
  //    complètes du parent (le covered-set) — sinon on compterait comme
  //    « fragmentation » les fragments que l'énoncé complet contient déjà.
  const fragments: Fragment[] = [];
  const seen = new Set<string>();
  for (const parent of kept) {
    if (parent.motif.length < minLength + 1) continue;
    const parentMaxLeap = parent.motif.intervalShape.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
    const atypical = atypicalDurationIndex(parent.motif.rhythmShape);

    for (let length = minLength; length < parent.motif.length; length++) {
      for (let off = 0; off + length <= parent.motif.length; off++) {
        const s = parent.start + off;
        const { indices, occurrences } = occurrencesOf(line, s, length);
        const outside = occurrences.filter((_, k) => {
          const at = indices[k]!;
          return !parent.indices.some(j => at >= j && at + length <= j + parent.motif.length);
        });
        if (outside.length < minFragmentOccurrences) continue;

        const intervalShape = intervalsOf(line, s, length);
        // Un même fragment peut être sous-motif de plusieurs parents : il est
        // rattaché au premier (le plus long, `kept` étant trié par longueur).
        const key = `${line.start[s]}|${length}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const carriesLeap = intervalShape.some(v => Math.abs(v) === parentMaxLeap && parentMaxLeap > 0);
        const carriesAtypical = atypical >= 0 && atypical >= off && atypical < off + length;
        fragments.push({
          anchor: line.start[s]!,
          length,
          intervalShape,
          rhythmShape: ratiosOf(line, s, length),
          occurrences: outside,
          parentAnchor: parent.motif.anchor,
          isDistinctive: carriesLeap || carriesAtypical,
        });
      }
    }
  }

  const motifs = kept.map(c => c.motif).sort((a, b) => a.anchor - b.anchor || a.length - b.length);
  const maxExactRepetitions = motifs.reduce(
    (m, mo) => Math.max(m, mo.occurrences.filter(o => o.kind === 'exact').length), 0);
  const hasVariedRepetition = motifs.some(mo => mo.occurrences.some(o => o.kind !== 'exact'));

  return { motifs, bestMotif, hasVariedRepetition, maxExactRepetitions, fragments };
}
