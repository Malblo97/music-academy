import type { Issue, Severity } from '../types.js';

/**
 * `pipeline/scoring.ts` — LES CONSTANTES DE CALIBRAGE.
 *
 * Un seul fichier, commenté, versionné : quand une note bouge, on doit pouvoir
 * dire QUEL chiffre l'a fait bouger. Ces valeurs ne sont pas des préférences,
 * ce sont les paramètres validés par le verrou n°2 — les solutions de référence
 * de M1, M2 et M3 notées ≥ 85.
 *
 * **Toute modification suit la procédure de finding** : une fixture qui
 * reproduit le cas réel, un re-run complet du verrou, une note au registre
 * `docs/DECISIONS_LOCALES.md`. Baisser un seuil pour faire passer une pièce est
 * la manière la plus sûre de rendre le moteur inutile.
 */

/**
 * Le coût d'une faute, par sévérité. Une `error` de poids 1 coûte 15 points de
 * correctness : sept suffisent à annuler le terme. Une `suggestion` coûte 2
 * points — elle se remarque sans punir, ce qui est exactement son rôle. Un
 * `info` ne coûte rien : il informe, il ne juge pas.
 */
export const SEVERITY_PENALTY: Record<Severity, number> = {
  error: 0.15,
  warning: 0.06,
  suggestion: 0.02,
  info: 0,
};

/**
 * Sous ce seuil, `estimateKey` n'a pas tranché : la pièce est modale, atonale
 * ou trop courte. Les règles qui raisonnent en degrés se taisent alors, plutôt
 * que de juger dans une tonalité inventée.
 */
export const AMBIGUOUS_KEY_CONF = 0.08;

/**
 * Le plafond d'issues MONTRÉES. Les autres comptent dans la note mais restent
 * hors du rapport : un élève à qui l'on présente dix-sept fautes n'en corrige
 * aucune. Le compte des masquées est affiché — on cache, on ne ment pas.
 */
export const MAX_ISSUES_SHOWN = 6;

/**
 * `improvedVersion` modifie au plus 30 % des notes de l'élève. Au-delà, le
 * moteur ne corrige plus : il recompose, et la pièce cesse d'être celle de
 * l'élève (Manuel §3, contrainte dure).
 */
export const IMPROVED_VERSION_MAX_CHANGE = 0.30;

export function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

export function sum(xs: readonly number[]): number {
  return xs.reduce((a, b) => a + b, 0);
}

export function avg(xs: readonly number[]): number {
  return xs.length === 0 ? 0 : sum(xs) / xs.length;
}

/** Une issue avec le poids EFFECTIF de sa règle (profil de la spec appliqué). */
export interface WeightedIssue extends Issue {
  weight: number;
}

/**
 * Une contrainte telle que le score la voit. `evaluated` porte **F-35** : une
 * clé de performance n'entre dans la note que si le rendu a réellement pu être
 * jugé — sur une solution écrite, qui est une partition et non une exécution,
 * elle ne compte pas.
 */
export interface ScoredConstraint {
  key: string;
  pass: boolean;
  performanceOnly?: boolean;
  evaluated?: boolean;
}

export interface Rubric {
  correctness: number;
  constraints: number;
  craft: number;
}

export interface ScoreParts {
  score: number;
  subscores: Rubric;
  /** Les trois termes bruts, en 0–1 — ce que le rapport explique. */
  ratios: Rubric;
}

/**
 * La note. Trois termes indépendants, pondérés par la rubric de la spec : ce
 * que l'élève a évité (correctness), ce qu'il a respecté (constraints), ce
 * qu'il a réussi (craft). Un exercice de conduite met le poids sur le premier,
 * un exercice de plan sur le second, un exercice d'écriture sur le troisième —
 * c'est la spec qui décide, jamais le moteur.
 */
export function computeScore(
  rubric: Rubric,
  { issues, constraints, craft }: {
    issues: readonly WeightedIssue[];
    constraints: readonly ScoredConstraint[];
    craft: number;
  },
): ScoreParts {
  const correctness = clamp01(1 - sum(issues.map(i => SEVERITY_PENALTY[i.severity] * i.weight)));

  // F-35/F-48 : les clés de performance non jugées sortent du dénominateur.
  const scoredCs = constraints.filter(c => !c.performanceOnly || c.evaluated);
  // Aucune contrainte à noter : le terme est NEUTRE (1), pas nul — sinon une
  // spec sans contraintes serait punie de tout son poids `constraints`.
  const constraintsRatio = scoredCs.length ? avg(scoredCs.map(c => (c.pass ? 1 : 0))) : 1;
  const craftRatio = clamp01(craft);

  const exact: Rubric = {
    correctness: correctness * rubric.correctness,
    constraints: constraintsRatio * rubric.constraints,
    craft: craftRatio * rubric.craft,
  };

  return {
    score: Math.round(exact.correctness + exact.constraints + exact.craft),
    subscores: {
      correctness: Math.round(exact.correctness),
      constraints: Math.round(exact.constraints),
      craft: Math.round(exact.craft),
    },
    ratios: { correctness, constraints: constraintsRatio, craft: craftRatio },
  };
}

/** La rubric par défaut, quand la spec n'en déclare pas (Guide §1.4 : somme 100). */
export const DEFAULT_RUBRIC: Rubric = { correctness: 40, constraints: 40, craft: 20 };

export function rubricOf(raw: unknown): Rubric {
  if (raw && typeof raw === 'object') {
    const r = raw as Partial<Rubric>;
    if (typeof r.correctness === 'number' && typeof r.constraints === 'number' && typeof r.craft === 'number') {
      return { correctness: r.correctness, constraints: r.constraints, craft: r.craft };
    }
  }
  return DEFAULT_RUBRIC;
}
