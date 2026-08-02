import type { Checker } from './types.js';
import { asNumber, fail, ok } from './types.js';

/**
 * `checkers/plans.ts` — les plans DÉCLARÉS avec la soumission (rôles, nuances,
 * couches, densité). Leur particularité : l'élève annonce ce qu'il a voulu
 * faire, et le moteur compare le DÉCLARÉ au MESURÉ. C'est le rapport le plus
 * « professeur » du produit — tu apprends si ta pièce fait ce que ton plan
 * promet. (F-24 : quand un plan porte une DIRECTION, c'est la pente mesurée
 * qu'on lui oppose, segment par segment.)
 */
export const PLANS_CHECKERS: Record<string, Checker> = {
  maxActiveLayers: (_k, value, ctx) => {
    const max = asNumber(value);
    if (max === null) return ok('rien à mesurer');
    if (ctx.submission.kind !== 'layers') return ok('soumission sans pile de couches', 'declared');
    const active = ctx.submission.stack.layers.filter(l => !l.removed).length;
    return active <= max
      ? ok(`${active} couches actives ≤ ${max}`)
      : fail(`${active} couches actives, maximum ${max}`);
  },

  layerPlan: (_k, value, ctx) => {
    if (ctx.submission.kind !== 'layers') return ok('plan de couches déclaré, soumission non stratifiée', 'declared');
    const declared = Array.isArray(value) ? value.length : 0;
    const actual = ctx.submission.stack.layers.length;
    return declared === 0 || declared === actual
      ? ok(`${actual} couches, conformes au plan déclaré`)
      : fail(`${actual} couches pour un plan qui en annonce ${declared}`);
  },

  densityMapCheck: (_k, value, ctx) => {
    if (value !== true) return ok('non exigé');
    const parts = ctx.analysis.parts;
    return parts && parts.length > 0
      ? ok(`carte de densité calculable sur ${parts.length} parties`)
      : fail('aucune partie : la carte de densité ne peut pas se calculer');
  },

  dynamicsPlan: (_k, _value, ctx) => {
    const parts = ctx.analysis.parts ?? [];
    const withDyn = parts.filter(p => (p.dyn?.length ?? 0) > 0);
    return withDyn.length > 0
      ? ok(`${withDyn.length} partie(s) portent une courbe dyn[] (F-39)`)
      : ok('plan de nuances déclaré, aucune courbe dyn[] à mesurer', 'declared');
  },
};
