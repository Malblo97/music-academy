import type { Issue, Note, Severity } from '../types.js';
import type { Pedagogy } from '../rules/types.js';
import { REGISTRY } from '../rules/registry.js';
import type { ConstraintReport } from '../constraints/checkers/index.js';
import type { CraftResult } from './craft.js';
import { MAX_ISSUES_SHOWN, type ScoreParts, type WeightedIssue } from './scoring.js';

/**
 * `pipeline/feedback.ts` — l'assemblage du rapport.
 *
 * Le rapport n'est pas une sanction, c'est un cours particulier. Trois règles
 * gouvernent son montage, et chacune vient d'une observation sur l'apprenant :
 *
 *  1. **on plafonne** — un élève à qui l'on montre dix-sept fautes n'en corrige
 *     aucune ; les masquées comptent dans la note et sont COMPTÉES dans le
 *     rapport (`hiddenIssueCount`) : on hiérarchise, on ne dissimule pas ;
 *  2. **on explique** — chaque issue embarque son bloc `pedagogy` et sa leçon ;
 *  3. **on commence par ce qui marche** — les `strengths` sont générées depuis
 *     le craft, avec le chiffre observé, pour qu'elles ne sonnent pas creux.
 */

const SEVERITY_RANK: Record<Severity, number> = { error: 0, warning: 1, suggestion: 2, info: 3 };

/** Une issue telle que le rapport la présente : la faute ET son cours. */
export interface ReportedIssue extends Issue {
  weight: number;
  pedagogy: Pedagogy;
}

export interface ConstraintOutcome {
  key: string;
  pass: boolean;
  detail: string;
  mode: 'measured' | 'declared';
  performanceOnly?: boolean;
}

export interface FeedbackReport {
  score: number;
  engineVer: string;
  subscores: { correctness: number; constraints: number; craft: number };
  issues: ReportedIssue[];
  /** Fautes comptées dans la note mais non montrées (plafond MAX_ISSUES_SHOWN). */
  hiddenIssueCount: number;
  strengths: string[];
  constraintResults: ConstraintOutcome[];
  /** Règles éteintes par le profil — le rapport doit pouvoir les NOMMER. */
  silencedRules: string[];
  improvedVersion: Note[] | null;
}

/**
 * Le tri : sévérité d'abord, poids ensuite, position en dernier. Une erreur de
 * poids 0.1 passe donc AVANT un avertissement de poids 2 — c'est voulu : la
 * gravité est une propriété de la règle, le poids n'est qu'un réglage de style.
 */
export function sortIssues(issues: readonly WeightedIssue[]): WeightedIssue[] {
  return [...issues].sort((a, b) =>
    SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]
    || b.weight - a.weight
    || (a.atTick ?? 0) - (b.atTick ?? 0));
}

/**
 * Les points forts, générés depuis le craft : toute composante ≥ 0.8 donne une
 * phrase, et la phrase CITE son chiffre. Une félicitation sans preuve ne vaut
 * rien — elle s'use en trois exercices.
 */
const STRENGTH_THRESHOLD = 0.8;
const MAX_STRENGTHS = 4;

export function buildStrengths(craft: CraftResult | null, constraints: readonly ConstraintReport[]): string[] {
  const out: string[] = [];

  for (const c of craft?.components ?? []) {
    if (c.value >= STRENGTH_THRESHOLD) out.push(`${capitalize(c.label)} — ${c.evidence}.`);
  }

  // Les contraintes REMARQUABLES : celles qui ont été mesurées (pas déclarées)
  // et tenues. Une contrainte déclarative tenue n'est pas un exploit.
  for (const c of constraints) {
    if (out.length >= MAX_STRENGTHS) break;
    if (c.result.pass && c.result.mode === 'measured' && !c.result.performanceOnly) {
      out.push(`Contrainte « ${c.key} » tenue : ${c.result.detail}.`);
    }
  }

  return out.slice(0, MAX_STRENGTHS);
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0]!.toUpperCase() + s.slice(1);
}

export interface BuildFeedbackInput {
  engineVer: string;
  score: ScoreParts;
  issues: readonly WeightedIssue[];
  constraints: readonly ConstraintReport[];
  craft: CraftResult | null;
  silencedRules: readonly string[];
}

export function buildFeedback(input: BuildFeedbackInput): FeedbackReport {
  const sorted = sortIssues(input.issues);
  const shown = sorted.slice(0, MAX_ISSUES_SHOWN);

  const issues: ReportedIssue[] = shown.map(i => {
    const rule = REGISTRY.get(i.ownerRuleId ?? i.ruleId);
    if (!rule) throw new Error(`feedback : issue produite par une règle inconnue « ${i.ownerRuleId ?? i.ruleId} »`);
    return { ...i, pedagogy: rule.pedagogy };
  });

  return {
    score: input.score.score,
    engineVer: input.engineVer,
    subscores: input.score.subscores,
    issues,
    hiddenIssueCount: sorted.length - shown.length,
    strengths: buildStrengths(input.craft, input.constraints),
    constraintResults: input.constraints.map(c => {
      const outcome: ConstraintOutcome = {
        key: c.key,
        pass: c.result.pass,
        detail: c.result.detail,
        mode: c.result.mode,
      };
      if (c.result.performanceOnly) outcome.performanceOnly = true;
      return outcome;
    }),
    silencedRules: [...input.silencedRules],
    /**
     * **null au MVP** — décision d'implémentation, inscrite au registre.
     * Le plafond ≤ 30 % de notes modifiées est déjà codé
     * (`IMPROVED_VERSION_MAX_CHANGE`) et vérifié par `checkImprovedVersion` :
     * la V1 branchera des heuristiques par famille de défaut sur ce contrat
     * sans le rouvrir.
     */
    improvedVersion: null,
  };
}

/**
 * Le garde-fou de `improvedVersion` : le moteur AMÉLIORE, il ne recompose pas.
 * Au-delà de 30 % de notes touchées, la pièce n'est plus celle de l'élève —
 * et un élève à qui l'on rend une autre pièce n'apprend rien.
 */
export function changedRatio(original: readonly Note[], improved: readonly Note[]): number {
  if (original.length === 0) return improved.length === 0 ? 0 : 1;
  const key = (n: Note): string => `${n.start}:${n.pitch}:${n.duration}`;
  const before = new Set(original.map(key));
  const kept = improved.filter(n => before.has(key(n))).length;
  const touched = Math.max(original.length - kept, Math.abs(improved.length - original.length));
  return touched / original.length;
}
