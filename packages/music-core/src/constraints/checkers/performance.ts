import type { Checker, CheckResult } from './types.js';
import { asRange, fail, ok } from './types.js';

/**
 * `checkers/performance.ts` — **F-35**. Ces clés portent sur le JEU, pas sur
 * l'écriture : tempo, dérive, articulation, quantification. Elles sont marquées
 * `performanceOnly` et le verrou n°2 les SAUTE — une solution de référence est
 * une partition, pas une exécution. Les soumissions réelles, elles, y passent.
 */
function perf(result: CheckResult): CheckResult {
  return { ...result, performanceOnly: true };
}

export const PERFORMANCE_CHECKERS: Record<string, Checker> = {
  tempoRange: (_k, value) => {
    const range = asRange(value);
    return perf(range
      ? ok(`fourchette de tempo ${range[0]}–${range[1]} BPM déclarée`, 'declared')
      : ok('aucune fourchette de tempo', 'declared'));
  },

  tempoDriftBpmPer8Bars: (_k, value, ctx) => {
    const max = typeof value === 'number' ? value : null;
    if (max === null) return perf(ok('rien à mesurer', 'declared'));
    const events = ctx.submission.kind === 'midi' ? ctx.submission.tempoEvents : [];
    if (events.length < 2) return perf(ok('tempo constant : aucune dérive'));
    let worst = 0;
    for (let i = 1; i < events.length; i++) {
      const bars = (events[i]!.tick - events[i - 1]!.tick) / 1920;
      if (bars <= 0) continue;
      worst = Math.max(worst, (Math.abs(events[i]!.bpm - events[i - 1]!.bpm) / bars) * 8);
    }
    return perf(worst <= max
      ? ok(`dérive maximale ${worst.toFixed(1)} BPM/8 mesures ≤ ${max}`)
      : fail(`dérive de ${worst.toFixed(1)} BPM par 8 mesures, maximum ${max}`));
  },

  articulation: (_k, value, ctx) => {
    const wanted = typeof value === 'string' ? value : null;
    const marks = (ctx.analysis.parts ?? []).flatMap(p => p.articulations ?? []);
    if (!wanted) return perf(ok('aucune articulation exigée', 'declared'));
    return perf(marks.length > 0
      ? ok(`${marks.length} marque(s) d'articulation présentes pour « ${wanted} »`)
      : ok(`articulation « ${wanted} » déclarée, aucune marque dans la soumission`, 'declared'));
  },
};
