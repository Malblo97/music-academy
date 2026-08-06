import type { Issue, Note, Part, Severity, Submission } from '../types.js';
import type { KeyEstimate } from '../analyzers/key.js';
import type { CadenceEvent, TimedChord } from '../analyzers/cadence.js';
import type { IdiomTag, Vertical } from '../analyzers/idioms.js';
import type { MotifReport } from '../analyzers/motifs.js';
import type { ContourResult } from '../analyzers/contour.js';
import type { PhraseAnalysis } from '../analyzers/phrase.js';
import type { RhythmProfile } from '../analyzers/rhythm.js';
import type { CollectionResult } from '../analyzers/collection.js';

/**
 * `rules/types.ts` — le contrat commun des ~46 règles.
 *
 * Une règle ne DÉTECTE rien elle-même : elle lit le `AnalysisBundle` produit en
 * amont et le traduit en `Issue` pédagogiques. C'est de l'assemblage, et c'est
 * voulu — la détection vit dans les analyseurs, qui ont leurs propres fixtures ;
 * la règle, elle, porte le JUGEMENT et la parole adressée à l'élève.
 */

export type SubmissionKind = Submission['kind'];

/** Tout ce que les analyseurs ont su dire de la soumission. Les champs absents sont ceux qui ne s'appliquent pas. */
export interface AnalysisBundle {
  notes: readonly Note[];
  /**
   * La tonalité de TRAVAIL : celle que la consigne déclare, ou l'estimation à
   * défaut. Tout ce qui raisonne en degrés lit celle-ci.
   */
  key: KeyEstimate;
  /**
   * Ce que `estimateKey` a lu dans les notes SEULES, sans la consigne. Sert au
   * checker `key` : c'est en comparant les deux qu'on sait si l'élève a écrit
   * dans la tonalité demandée.
   */
  estimatedKey?: KeyEstimate;
  voices?: readonly (readonly Note[])[];
  parts?: readonly Part[];
  verticals?: readonly Vertical[];
  chords?: readonly TimedChord[];
  cadences?: readonly CadenceEvent[];
  idioms?: readonly IdiomTag[];
  motifs?: MotifReport;
  contour?: ContourResult;
  phrases?: PhraseAnalysis;
  rhythm?: RhythmProfile;
  collection?: CollectionResult | null;
  /** Courbe de tension, un point par demi-mesure. Silhouette et amplitude. */
  tension?: readonly number[];
  /**
   * Saillance de climax, un point par demi-mesure — la mesure DÉDIÉE à la
   * localisation (décision n°38). Répond à « OÙ ça culmine ? », et à rien
   * d'autre : la forme et l'amplitude se lisent sur `tension`.
   */
  climax?: readonly number[];
}

export interface StyleProfileRef {
  id: string;
  targetMood?: string;
  /** Surcharge LOCALE : fusionnée par-dessus la matrice du profil. */
  ruleWeights?: Record<string, number>;
}

export interface ExerciseSpec {
  id: string;
  kind?: string;
  /**
   * **L'ÉCRITURE attendue** — `kind` dit ce qu'on produit, `texture` dit
   * comment c'est disposé (décision n°34).
   *
   * `choral` (le défaut, appliqué partout où rien n'est déclaré) : des voix
   * indépendantes, que la conduite juge. `keyboard` : une réalisation au
   * clavier — fondamentale à la main gauche, bloc de guide tones et de tensions
   * à la main droite. Un bloc n'a pas de voix : son sommet n'est pas un
   * soprano, ses notes intérieures ne sont pas des lignes, et les familles
   * `vl.*`/`cp.*` n'ont rien à y suivre. Elles sont alors ÉTEINTES et NOMMÉES
   * dans `silencedRules` — jamais tues en silence.
   *
   * `stratified` (décision n°35) : un TAPIS tenu surmonté d'une LIGNE — la
   * formule éditoriale du corpus est « tapis TENU (liaisons par note, F-21) ».
   * Contrairement à `keyboard`, la conduite y est bien jugée : le tapis est de
   * la vraie polyphonie. Seul `vl.spacing` change, et d'un cran : il exempte
   * l'écart du HAUT — entre la nappe et la ligne — comme il exempte déjà celui
   * du bas.
   */
  texture?: 'choral' | 'keyboard' | 'stratified';
  lessonId?: string;
  constraints?: Record<string, unknown>;
  styleProfile?: StyleProfileRef;
  /** Le matériau FOURNI : hors du champ d'évaluation (F-41), mais dans le contexte. */
  given?: { notation?: string; bars?: [number, number]; [k: string]: unknown };
  [k: string]: unknown;
}

/**
 * **F-41** — la fenêtre d'évaluation. Le matériau donné reste du CONTEXTE
 * (liaisons, préparations, raccords aux frontières) mais n'est jamais jugé :
 * on ne reproche pas à l'élève une faute qu'il n'a pas écrite.
 */
export interface EvalWindow {
  from: number;
  to: number;
  /** Plages fournies par la consigne, en ticks. */
  givenRanges: readonly { from: number; to: number }[];
  /** Vrai si ce tick appartient au matériau donné. */
  isGiven(tick: number): boolean;
  /** Vrai si ce tick est à juger (dans la fenêtre ET hors given). */
  judges(tick: number): boolean;
}

export interface RuleCtx {
  submission: Submission;
  analysis: AnalysisBundle;
  spec: ExerciseSpec;
  window: EvalWindow;
}

/**
 * Le bloc `pedagogy` — la raison d'être du produit (Manuel §3, point 5). Le
 * rapport n'est pas une sanction : il explique POURQUOI, montre COMMENT, dit
 * QUAND la règle s'applique (et quand elle ne s'applique pas), nomme l'erreur
 * classique et propose une alternative.
 */
export interface Pedagogy {
  why: string;
  how: string;
  when: string;
  commonMistake: string;
  alternative: string;
}

export interface Rule {
  id: string;
  severity: Severity;
  /** Poids par défaut, re-pondérable par profil jusqu'à 0. */
  weight: number;
  appliesTo: readonly SubmissionKind[];
  /**
   * **La règle SUIT-ELLE une ligne d'un accord au suivant ?**
   *
   * `appliesTo` dit de quelle FORME de soumission la règle sait parler ;
   * ceci dit de quelle ÉCRITURE. Les familles `vl.*` et `cp.*` jugent des voix
   * indépendantes — le soprano de cet accord contre le soprano du suivant. Sur
   * une réalisation de clavier, ces voix n'existent pas : la main droite est un
   * bloc dont le sommet change de fonction à chaque position, la main gauche
   * est une fondamentale. Leur appliquer la conduite, c'est juger des lignes
   * que personne n'a écrites (décision n°34, `ExerciseSpec.texture`).
   */
  needsIndependentVoices?: boolean;
  detect(ctx: RuleCtx): Issue[];
  pedagogy: Pedagogy;
  lessonRef: string;
}

/** Fabrique d'`Issue` : rappelle systématiquement la règle et sa leçon. */
export function ruleIssue(rule: Pick<Rule, 'id' | 'severity' | 'lessonRef'>, atTick: number | undefined, message: string, severity?: Severity): Issue {
  const issue: Issue = { ruleId: rule.id, severity: severity ?? rule.severity, message, lessonRef: rule.lessonRef };
  if (atTick !== undefined) issue.atTick = atTick;
  return issue;
}

/** Les notes réellement jugées : dans la fenêtre, hors matériau donné (F-41). */
export function judgedNotes(ctx: RuleCtx): Note[] {
  return [...ctx.analysis.notes].filter(n => ctx.window.judges(n.start)).sort((a, b) => a.start - b.start);
}

/**
 * **La LIGNE jugée** — une note par attaque, la plus aiguë.
 *
 * C'est ce que les règles de mélodie doivent lire, et la distinction n'est pas
 * cosmétique : sur un choral à quatre voix, `judgedNotes` rend les quatre voix
 * entremêlées par ordre d'attaque. Un « saut de septième non récupéré » y
 * apparaît à chaque accord — entre le soprano d'un temps et la basse du
 * suivant — alors qu'aucune ligne ne saute. Juger cette soupe, c'est reprocher
 * à l'élève une mélodie qu'il n'a pas écrite.
 */
export function judgedLine(ctx: RuleCtx): Note[] {
  const top = new Map<number, Note>();
  for (const n of ctx.analysis.notes) {
    if (!ctx.window.judges(n.start)) continue;
    const cur = top.get(n.start);
    if (!cur || n.pitch > cur.pitch) top.set(n.start, n);
  }
  return [...top.values()].sort((a, b) => a.start - b.start);
}

/** La même ligne, hors contexte de règle : le chant d'une texture. */
export function melodicLine(notes: readonly Note[]): Note[] {
  const top = new Map<number, Note>();
  for (const n of notes) {
    const cur = top.get(n.start);
    if (!cur || n.pitch > cur.pitch) top.set(n.start, n);
  }
  return [...top.values()].sort((a, b) => a.start - b.start);
}
