import { TICKS } from '../types.js';
import type { Meter } from '../types.js';
import type { EvalWindow, ExerciseSpec } from '../rules/types.js';

/**
 * **F-41** — `markGivenTicks(spec) → EvalWindow`.
 *
 * TOUT checker et TOUTE règle reçoivent cette fenêtre et ignorent les ticks du
 * matériau donné. Le given reste du CONTEXTE — il faut le voir pour juger les
 * liaisons, les préparations et les raccords aux frontières — mais il n'est
 * jamais jugé : reprocher à l'élève une quinte parallèle qui se trouve dans
 * l'ostinato fourni est la manière la plus sûre de perdre sa confiance.
 */

const DENOM_LETTER: Record<number, string> = { 1: 'w', 2: 'h', 4: 'q', 8: 'e', 16: 's' };

function barTicks(meter: Meter): number {
  const letter = DENOM_LETTER[meter[1]];
  const unit = letter === undefined ? undefined : TICKS[letter];
  if (unit === undefined) throw new Error(`window : dénominateur de métrique non supporté (${meter[1]})`);
  return meter[0] * unit;
}

/** Les plages données telles que la spec les déclare. Deux formes acceptées. */
function givenRangesOf(spec: ExerciseSpec, bar: number): { from: number; to: number }[] {
  const given = spec.given;
  if (!given) return [];

  // (a) `given.bars: [premier, dernier]` — mesures 1-based, bornes incluses.
  const bars = given.bars;
  if (Array.isArray(bars) && bars.length === 2 && typeof bars[0] === 'number' && typeof bars[1] === 'number') {
    return [{ from: (bars[0] - 1) * bar, to: bars[1] * bar }];
  }

  // (b) `given.ranges: [{from, to}]` — déjà en ticks.
  const ranges = (given as { ranges?: unknown }).ranges;
  if (Array.isArray(ranges)) {
    return ranges
      .filter((r): r is { from: number; to: number } =>
        typeof r === 'object' && r !== null &&
        typeof (r as { from?: unknown }).from === 'number' &&
        typeof (r as { to?: unknown }).to === 'number')
      .map(r => ({ from: r.from, to: r.to }));
  }

  return [];
}

export interface WindowOpts {
  meter?: Meter;
  /** Fin de la pièce, si connue : borne la fenêtre. */
  totalTicks?: number;
}

export function markGivenTicks(spec: ExerciseSpec, opts: WindowOpts = {}): EvalWindow {
  const bar = barTicks(opts.meter ?? ([4, 4] as Meter));
  const givenRanges = givenRangesOf(spec, bar);
  const from = 0;
  const to = opts.totalTicks ?? Infinity;

  const isGiven = (tick: number): boolean => givenRanges.some(r => tick >= r.from && tick < r.to);
  return {
    from,
    to,
    givenRanges,
    isGiven,
    judges: (tick: number) => tick >= from && tick < to && !isGiven(tick),
  };
}

/** Fenêtre qui juge tout — pour les appels sans spec (tests d'analyseurs, outils). */
export function fullWindow(totalTicks = Infinity): EvalWindow {
  return {
    from: 0,
    to: totalTicks,
    givenRanges: [],
    isGiven: () => false,
    judges: (tick: number) => tick >= 0 && tick < totalTicks,
  };
}
