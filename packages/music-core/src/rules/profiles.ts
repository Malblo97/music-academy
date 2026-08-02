import type { StyleProfileRef } from './types.js';

/**
 * `rules/profiles.ts` — Manuel §3.6. Un profil est une MATRICE DE POIDS sur les
 * règles, plus des drapeaux sémantiques. C'est ici qu'est encodée la
 * philosophie du cursus : « la règle avant l'écart » — on enseigne la norme,
 * puis l'écart comme choix conscient. Le thriller n'a pas le droit d'ignorer
 * `melody.monotony` : il l'a mise à zéro, et c'est écrit noir sur blanc.
 *
 * Un poids à 0 éteint la règle. Un poids > 1 la renforce.
 */

export interface StyleProfile {
  id: string;
  label: string;
  weights: Readonly<Record<string, number>>;
  flags?: Readonly<Record<string, boolean>>;
}

export const PROFILES: Record<string, StyleProfile> = {
  'classical-common': {
    id: 'classical-common',
    label: 'classique commun — les poids par défaut',
    weights: {},
    flags: {},
  },
  'romantic-film': {
    id: 'romantic-film',
    label: 'romantique de film',
    // Le geste saut + récupération EST le style : la règle est renforcée, pas relâchée.
    weights: { 'melody.leap-recovery': 1.3 },
  },
  'epic-film': {
    id: 'epic-film',
    label: 'épique',
    // L'épique assume la puissance des parallèles — sans les autoriser tout à fait.
    weights: { 'vl.parallel-perfects': 0.1, 'melody.climax': 1.2 },
  },
  'thriller-tension': {
    id: 'thriller-tension',
    label: 'thriller — l\'étau',
    // La répétition obstinée est le MOYEN, et la non-résolution est le BUT.
    weights: { 'melody.monotony': 0, 'melody.tension-placement': 0, 'melody.out-of-key': 0.5 },
    flags: { repetitionIsPositive: true },
  },
  'neo-noir': {
    id: 'neo-noir',
    label: 'néo-noir',
    // Le couloir remplace la porte : les septièmes restent ouvertes, la boucle prime.
    weights: {
      'harmony.unresolved-seventh': 0.4,
      'harmony.loop-coherence': 1.4,
      'melody.ending-weak': 0.5,
    },
  },
  jazz: {
    id: 'jazz',
    label: 'jazz',
    // Les septièmes sont la matière ordinaire, pas des événements à résoudre.
    weights: {
      'harmony.unresolved-seventh': 0.3,
      'rhythm.syncopation-target': 1.2,
      'vl.parallel-perfects': 0.5,
    },
    flags: { invertedProsody: true },
  },
  'hybrid-sd': {
    id: 'hybrid-sd',
    label: 'hybride / sound design',
    // Le jugement se déplace vers le spectre : la conduite tonale compte moins.
    weights: {
      'vl.parallel-perfects': 0.2,
      'melody.no-motif': 0.5,
      'sd.band-masking': 1.4,
      'sd.role-coverage': 1.4,
    },
  },
  impressionist: {
    id: 'impressionist',
    label: 'impressionniste',
    // Le planing EST le procédé : la dette de §7.4, soldée.
    weights: {
      'vl.parallel-perfects': 0,
      'harmony.retrogression': 0,
      'harmony.unresolved-seventh': 0.3,
    },
  },
  'modern-horror': {
    id: 'modern-horror',
    label: 'horreur moderne',
    // La collection remplace la tonalité : « le cluster n'est pas un accord sale ».
    weights: {
      'melody.out-of-key': 0,
      'harmony.overchromatic': 0,
      'melody.tension-placement': 0.5,
      'orch.low-interval-limit': 0.5,
    },
  },
};

export const DEFAULT_PROFILE = 'classical-common';

/**
 * Le poids EFFECTIF d'une règle : le poids de base, écrasé par la matrice du
 * profil, elle-même écrasée par la surcharge locale de la spec
 * (`styleProfile.ruleWeights`). L'ordre compte — le plus local gagne.
 */
export function effectiveWeight(ruleId: string, baseWeight: number, ref?: StyleProfileRef): number {
  const profile = PROFILES[ref?.id ?? DEFAULT_PROFILE];
  const fromProfile = profile?.weights[ruleId];
  const fromSpec = ref?.ruleWeights?.[ruleId];
  if (fromSpec !== undefined) return fromSpec;
  if (fromProfile !== undefined) return fromProfile;
  return baseWeight;
}

/** Un drapeau sémantique du profil (`repetitionIsPositive` en thriller…). */
export function profileFlag(flag: string, ref?: StyleProfileRef): boolean {
  return PROFILES[ref?.id ?? DEFAULT_PROFILE]?.flags?.[flag] === true;
}

/** Vrai si la règle est ÉTEINTE dans ce contexte (poids nul). */
export function isSilenced(ruleId: string, baseWeight: number, ref?: StyleProfileRef): boolean {
  return effectiveWeight(ruleId, baseWeight, ref) === 0;
}
