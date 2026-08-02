import { TICKS } from '../types.js';
import type { Meter, Note } from '../types.js';

/** Vélocité supposée quand la notation n'en porte pas (le parseur n'en produit pas). */
const DEFAULT_VELOCITY = 64;

const DENOM_LETTER: Record<number, string> = { 1: 'w', 2: 'h', 4: 'q', 8: 'e', 16: 's' };

/** Ticks d'un temps (l'unité du dénominateur) et d'une mesure entière. */
export function beatTicks([, den]: Meter): number {
  const letter = DENOM_LETTER[den];
  const unit = letter === undefined ? undefined : TICKS[letter];
  if (unit === undefined) throw new Error(`rythme : dénominateur de métrique non supporté (${den})`);
  return unit;
}

export function barTicks(meter: Meter): number {
  return meter[0] * beatTicks(meter);
}

/**
 * Le POIDS MÉTRIQUE d'une position : 3 = premier temps, 2 = temps fort médian
 * (le 3 d'un 4/4), 1 = autre temps, 0 = hors temps. C'est l'échelle que la
 * prosodie corrèle — « les syllabes longues tombent sur les appuis » (m02-l09).
 */
export function metricWeight(tick: number, meter: Meter): number {
  const bar = barTicks(meter);
  const beat = beatTicks(meter);
  const inBar = ((tick % bar) + bar) % bar;
  if (inBar === 0) return 3;
  if (inBar % beat !== 0) return 0;
  const beatIndex = inBar / beat;
  const half = meter[0] / 2;
  return Number.isInteger(half) && beatIndex === half ? 2 : 1;
}

export interface RhythmProfile {
  /** Attaques par mesure. */
  density: number;
  /** Entropie de Shannon des durées, en bits (0 = une seule valeur). */
  durationEntropy: number;
  /** Part PONDÉRÉE des attaques hors temps (la double compte plus que la croche). */
  syncopationScore: number;
  /** Part BRUTE des attaques hors temps — la valeur que lisent les `authorNotes` M1/M2. */
  offBeatRatio: number;
  /** Ticks des mesures scandées 3+3+2 (la clave, m01-l09). */
  asymmetries: { pattern: '3+3+2'; at: number }[];
  /** Pearson(durée × vélocité, poids métrique). */
  prosodyCorrelation: number;
}

export interface ProsodyOpts {
  /**
   * Le jazz déclame à l'envers : les valeurs longues fuient les appuis (m08-l01).
   * `inverted` corrèle contre les poids métriques NIÉS — un swing bien déclamé
   * rend alors une corrélation positive.
   */
  inverted?: boolean;
}

function pearson(a: readonly number[], b: readonly number[]): number {
  const n = a.length;
  if (n < 2) return 0;
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

/** Une note par attaque (la ligne), triée. */
function attacks(notes: readonly Note[]): Note[] {
  const top = new Map<number, Note>();
  for (const n of notes) {
    const cur = top.get(n.start);
    if (!cur || n.pitch > cur.pitch) top.set(n.start, n);
  }
  return [...top.values()].sort((a, b) => a.start - b.start);
}

/**
 * Poids de syncope d'une attaque : 0 sur un temps, 0.5 à la demi-mesure du
 * temps (la croche de contretemps), 1 plus fin encore (la double). Une attaque
 * qui tombe entre les mailles pèse plus qu'une croche « et ».
 */
function syncopationWeight(tick: number, meter: Meter): number {
  const beat = beatTicks(meter);
  const inBeat = ((tick % beat) + beat) % beat;
  if (inBeat === 0) return 0;
  return inBeat === beat / 2 ? 0.5 : 1;
}

export function prosodyCorrelation(notes: readonly Note[], meter: Meter, opts: ProsodyOpts = {}): number {
  const line = attacks(notes);
  if (line.length < 2) return 0;
  const emphasis = line.map(n => n.duration * (n.velocity ?? DEFAULT_VELOCITY));
  const weights = line.map(n => (opts.inverted ? -metricWeight(n.start, meter) : metricWeight(n.start, meter)));
  return pearson(emphasis, weights);
}

/**
 * `rhythmProfile(notes, meter)` — densité, entropie, syncope, asymétries et
 * prosodie. Tout se compte sur les ATTAQUES : une ronde liée ne scande qu'une
 * fois, si longtemps qu'elle dure.
 */
export function rhythmProfile(notes: readonly Note[], meter: Meter, opts: ProsodyOpts = {}): RhythmProfile {
  const line = attacks(notes);
  const bar = barTicks(meter);
  const total = line.reduce((m, n) => Math.max(m, n.start + n.duration), 0);
  const bars = total > 0 ? total / bar : 0;

  if (line.length === 0) {
    return { density: 0, durationEntropy: 0, syncopationScore: 0, offBeatRatio: 0, asymmetries: [], prosodyCorrelation: 0 };
  }

  // Entropie de Shannon sur l'histogramme des durées.
  const counts = new Map<number, number>();
  for (const n of line) counts.set(n.duration, (counts.get(n.duration) ?? 0) + 1);
  let durationEntropy = 0;
  for (const c of counts.values()) {
    const p = c / line.length;
    durationEntropy -= p * Math.log2(p);
  }

  const weights = line.map(n => syncopationWeight(n.start, meter));
  const syncopationScore = weights.reduce((s, w) => s + w, 0) / line.length;
  const offBeatRatio = weights.filter(w => w > 0).length / line.length;

  // 3+3+2 : la mesure scandée en 3, 3 puis 2 croches — l'asymétrie de m01-l09.
  const asymmetries: { pattern: '3+3+2'; at: number }[] = [];
  const eighth = TICKS.e!;
  if (bar % eighth === 0 && bar / eighth === 8) {
    for (let barStart = 0; barStart < total; barStart += bar) {
      const onsets = line.filter(n => n.start >= barStart && n.start < barStart + bar).map(n => n.start - barStart);
      const expected = [0, 3 * eighth, 6 * eighth];
      if (onsets.length === 3 && expected.every((e, i) => onsets[i] === e)) {
        asymmetries.push({ pattern: '3+3+2', at: barStart });
      }
    }
  }

  return {
    density: bars > 0 ? line.length / bars : 0,
    durationEntropy,
    syncopationScore,
    offBeatRatio,
    asymmetries,
    prosodyCorrelation: prosodyCorrelation(notes, meter, opts),
  };
}
