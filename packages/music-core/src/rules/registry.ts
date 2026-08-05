import type { Issue } from '../types.js';
import type { Rule, RuleCtx } from './types.js';
import { MELODY_RULES } from './melody.js';
import { HARMONY_RULES } from './harmony.js';
import { VL_RULES } from './vl.js';
import { RHYTHM_RULES } from './rhythm.js';
import { ORCH_RULES } from './orch.js';
import { CP_RULES } from './cp.js';
import { SD_RULES } from './sd.js';
import { JAZZ_RULES } from './jazz.js';
import { effectiveWeight, isSilenced } from './profiles.js';

/**
 * `rules/registry.ts` — le registre des règles, ÉCHEC BRUYANT compris.
 *
 * Demander une règle qui n'existe pas lance : une spec qui référence
 * `melody.tres-jolie` doit s'arrêter net, pas passer silencieusement. Un
 * identifiant en double lance aussi — deux règles du même nom feraient une
 * pondération de profil imprévisible.
 */

const ALL: readonly Rule[] = [
  ...MELODY_RULES,
  ...HARMONY_RULES,
  ...VL_RULES,
  ...RHYTHM_RULES,
  ...ORCH_RULES,
  ...CP_RULES,
  ...SD_RULES,
  ...JAZZ_RULES,
];

function build(): Map<string, Rule> {
  const map = new Map<string, Rule>();
  for (const rule of ALL) {
    if (map.has(rule.id)) throw new Error(`registre : règle en double « ${rule.id} »`);
    map.set(rule.id, rule);
  }
  return map;
}

export const REGISTRY: Map<string, Rule> = build();

/** Récupère une règle. Lance si l'identifiant est inconnu (échec bruyant). */
export function rule(id: string): Rule {
  const found = REGISTRY.get(id);
  if (!found) throw new Error(`registre : règle inconnue « ${id} » — vérifie l'orthographe ou enregistre-la`);
  return found;
}

/** Les identifiants d'une famille (`melody`, `vl`, `orch`…). */
export function familyOf(prefix: string): Rule[] {
  return [...REGISTRY.values()].filter(r => r.id.startsWith(`${prefix}.`));
}

export interface RunResult {
  issues: Issue[];
  /** Règles éteintes par le profil : le rapport doit pouvoir les NOMMER. */
  silenced: string[];
  /** Poids effectif retenu pour chaque règle qui a parlé. */
  weights: Record<string, number>;
}

/**
 * Exécute toutes les règles applicables à la soumission, profil appliqué.
 * Une règle éteinte (poids 0) n'est pas exécutée : elle est LISTÉE, pour que le
 * rapport puisse dire « en thriller, la répétition est un moyen — la règle de
 * monotonie ne s'applique pas ici ».
 */
export function runRules(ctx: RuleCtx, opts: { only?: readonly string[] } = {}): RunResult {
  const kind = ctx.submission.kind;
  const profile = ctx.spec.styleProfile;
  const issues: Issue[] = [];
  const silenced: string[] = [];
  const weights: Record<string, number> = {};

  // **Décision n°34** : sur une réalisation de clavier, il n'y a pas de voix à
  // suivre. Les familles qui en tracent sont éteintes — et LISTÉES, au même
  // titre que celles qu'un profil neutralise : « en écriture de clavier, la
  // main droite est un bloc — la conduite des voix ne s'y juge pas ».
  const keyboard = ctx.spec.texture === 'keyboard';

  for (const r of REGISTRY.values()) {
    if (opts.only && !opts.only.includes(r.id)) continue;
    if (!r.appliesTo.includes(kind)) continue;
    if (keyboard && r.needsIndependentVoices === true) {
      silenced.push(r.id);
      continue;
    }
    if (isSilenced(r.id, r.weight, profile)) {
      silenced.push(r.id);
      continue;
    }
    weights[r.id] = effectiveWeight(r.id, r.weight, profile);
    // Une règle peut produire un diagnostic plus fin que son propre
    // identifiant (`vl.direct-perfect` sous `vl.parallel-perfects`) : on note
    // qui l'a produit, sinon le rapport ne saurait plus où prendre la pedagogy.
    for (const issue of r.detect(ctx)) {
      issues.push(issue.ruleId === r.id ? issue : { ...issue, ownerRuleId: r.id });
    }
  }

  return {
    issues: issues.sort((a, b) => (a.atTick ?? 0) - (b.atTick ?? 0)),
    silenced,
    weights,
  };
}
