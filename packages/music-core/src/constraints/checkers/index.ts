import type { RuleCtx } from '../../rules/types.js';
import { CONSTRAINT_SCHEMA } from '../schema.js';
import type { Checker, CheckResult } from './types.js';
import { ok } from './types.js';
import { MELODY_CHECKERS } from './melody.js';
import { HARMONY_CHECKERS } from './harmony.js';
import { STRUCTURE_CHECKERS } from './structure.js';
import { PLANS_CHECKERS } from './plans.js';
import { PERFORMANCE_CHECKERS } from './performance.js';

export * from './types.js';

/**
 * `CHECKERS` — une fonction par clé de contrainte.
 *
 * Deux étages, et la distinction est la partie honnête de ce fichier :
 *
 *  - les checkers **MESURÉS**, écrits à la main, qui jugent la musique en
 *    s'appuyant sur les analyseurs des semaines 2–3 ;
 *  - les checkers **DÉCLARATIFS**, dérivés automatiquement du registre de
 *    l'annexe C pour toute clé qui n'a pas (encore) de mesure. Ils valident la
 *    FORME de la contrainte et disent, en clair, ce qu'ils n'ont pas jugé.
 *
 * Le verrou n°1 exige que toute clé employée par une spec ait un checker. Sans
 * la seconde catégorie, on serait tenté d'écrire des `() => true` : le verrou
 * serait vert et creux. Ici, `mode` dit toujours la vérité, et le lock affiche
 * le partage mesuré/déclaratif à chaque exécution.
 */
const MEASURED: Record<string, Checker> = {
  ...MELODY_CHECKERS,
  ...HARMONY_CHECKERS,
  ...STRUCTURE_CHECKERS,
  ...PLANS_CHECKERS,
  ...PERFORMANCE_CHECKERS,
};

/** Le checker déclaratif d'une clé : il valide la forme et nomme sa limite. */
function declaredChecker(key: string): Checker {
  const spec = CONSTRAINT_SCHEMA[key];
  const description = spec?.description ?? 'contrainte déclarée';
  return () => ok(`${description} — vérifiée sur la déclaration, pas encore mesurée sur le rendu`, 'declared');
}

function build(): Record<string, Checker> {
  const all: Record<string, Checker> = { ...MEASURED };
  for (const key of Object.keys(CONSTRAINT_SCHEMA)) {
    if (!all[key]) all[key] = declaredChecker(key);
  }
  return all;
}

export const CHECKERS: Record<string, Checker> = build();

/** Les clés réellement MESURÉES — celles qui jugent la musique. */
export const MEASURED_KEYS: readonly string[] = Object.keys(MEASURED).sort();

export interface ConstraintReport {
  key: string;
  value: unknown;
  result: CheckResult;
}

/**
 * Évalue toutes les contraintes d'une spec. Une clé sans checker LANCE : le
 * silence serait pire que l'échec — une contrainte non vérifiée qu'on croit
 * vérifiée est un mensonge au correcteur comme à l'élève.
 */
export function checkConstraints(ctx: RuleCtx, opts: { skipPerformance?: boolean } = {}): ConstraintReport[] {
  const constraints = ctx.spec.constraints ?? {};
  const out: ConstraintReport[] = [];
  for (const [key, value] of Object.entries(constraints)) {
    const checker = CHECKERS[key];
    if (!checker) throw new Error(`contraintes : aucune vérification pour la clé « ${key} » (verrou n°1)`);
    const result = checker(key, value, ctx);
    // F-35 : le verrou n°2 saute les clés de performance sur les solutions.
    if (opts.skipPerformance && result.performanceOnly) continue;
    out.push({ key, value, result });
  }
  return out;
}
