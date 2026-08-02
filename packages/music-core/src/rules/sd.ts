import type { Issue, Layer, LayerStack } from '../types.js';
import type { Rule, RuleCtx } from './types.js';
import { ruleIssue } from './types.js';

/**
 * `rules/sd.ts` — **les six jumelles spectrales**. Chacune reprend, dans le
 * monde des couches, une règle d'orchestration : le masquage de bande répond à
 * `orch.masking`, la couverture de rôles à `orch.role-coverage`, et ainsi de
 * suite. Le vocabulaire change, la physique non.
 *
 * Ces règles jugent la PILE DÉCLARÉE (`kind: 'layers'`) : bandes, rôles,
 * sidechain, largeur stéréo. C'est ce que la soumission porte, et c'est donc ce
 * qui se vérifie — pas un rendu audio que le moteur n'a pas.
 */

const REQUIRED_ROLES = ['sub', 'body', 'top'] as const;
/** Deux couches qui se recouvrent de plus de cette part de leur bande se masquent. */
const BAND_OVERLAP = 0.6;
/** En deçà, la pile est mono : rien n'occupe les côtés. */
const MIN_WIDE_LAYERS = 1;

function stackOf(ctx: RuleCtx): LayerStack | null {
  return ctx.submission.kind === 'layers' ? ctx.submission.stack : null;
}

function overlap(a: Layer, b: Layer): number {
  if (!a.band || !b.band) return 0;
  const lo = Math.max(a.band.low, b.band.low);
  const hi = Math.min(a.band.high, b.band.high);
  if (hi <= lo) return 0;
  const smallest = Math.min(a.band.high - a.band.low, b.band.high - b.band.low);
  return smallest > 0 ? (hi - lo) / smallest : 0;
}

export const SD_RULES: Rule[] = [
  {
    id: 'sd.band-masking',
    severity: 'warning',
    weight: 1,
    appliesTo: ['layers'],
    lessonRef: 'm06-l04',
    detect: (ctx: RuleCtx): Issue[] => {
      const stack = stackOf(ctx);
      if (!stack) return [];
      const self = { id: 'sd.band-masking', severity: 'warning' as const, lessonRef: 'm06-l04' };
      const issues: Issue[] = [];
      for (let i = 0; i < stack.layers.length; i++) {
        for (let j = i + 1; j < stack.layers.length; j++) {
          const a = stack.layers[i]!;
          const b = stack.layers[j]!;
          if (a.removed || b.removed) continue;
          if (overlap(a, b) >= BAND_OVERLAP) {
            issues.push(ruleIssue(self, undefined,
              `« ${a.id} » et « ${b.id} » occupent la même bande : deux sons dans le même trou en font un seul, trouble`));
          }
        }
      }
      return issues;
    },
    pedagogy: {
      why: "C'est la même physique qu'à l'orchestre : deux timbres dans la même bande de fréquences se masquent. En synthèse, la tentation est plus forte encore, parce qu'on peut empiler sans limite.",
      how: "Donne à chaque couche sa bande, et filtre pour l'y tenir. Ce qui déborde chez le voisin doit être coupé chez toi.",
      when: "Sur toute pile hybride. Deux couches volontairement à l'unisson (un doublage d'octave, un renfort) se déclarent — le renfort n'est pas un masquage.",
      commonMistake: "Ajouter une couche pour « épaissir » un son qui manque de présence. Neuf fois sur dix, la présence revient en RETIRANT quelque chose de la même bande.",
      alternative: "Le partage temporel : deux couches dans la même bande, mais jamais en même temps. L'oreille les entend comme une seule qui évolue.",
    },
  },
  {
    id: 'sd.role-coverage',
    severity: 'warning',
    weight: 1,
    appliesTo: ['layers'],
    lessonRef: 'm06-l03',
    detect: (ctx: RuleCtx): Issue[] => {
      const stack = stackOf(ctx);
      if (!stack) return [];
      const present = new Set(stack.layers.filter(l => !l.removed).map(l => l.role));
      const missing = REQUIRED_ROLES.filter(r => !present.has(r));
      if (missing.length === 0) return [];
      return [ruleIssue({ id: 'sd.role-coverage', severity: 'warning', lessonRef: 'm06-l03' }, undefined,
        `rôle(s) manquant(s) : ${missing.join(', ')} — la pile n'a pas ${missing.includes('sub') ? 'de socle' : 'tous ses étages'}`)];
    },
    pedagogy: {
      why: "Une pile hybride se construit par rôles, pas par sons : le sub tient le bas, le corps donne la matière, le dessus donne l'air. Il manque un rôle, il manque un étage — et l'oreille cherche l'étage vide.",
      how: "Nomme le rôle de chaque couche AVANT de choisir son timbre. Si deux couches portent le même rôle, l'une des deux est de trop.",
      when: "Sur toute pile qui doit tenir seule. Une texture d'ambiance peut n'avoir ni sub ni dessus — mais c'est un choix, et il se déclare.",
      commonMistake: "Empiler quatre nappes superbes et se retrouver sans transitoire ni socle. C'est joli et ça ne tient pas dans un mix.",
      alternative: "Le rôle `trigger` (une couche qui n'existe qu'à l'attaque) remplace souvent un `top` permanent : il donne la définition sans encombrer.",
    },
  },
  {
    id: 'sd.density',
    severity: 'suggestion',
    weight: 1,
    appliesTo: ['layers'],
    lessonRef: 'm06-l04',
    detect: (ctx: RuleCtx): Issue[] => {
      const stack = stackOf(ctx);
      if (!stack) return [];
      const active = stack.layers.filter(l => !l.removed);
      if (active.length <= 6) return [];
      return [ruleIssue({ id: 'sd.density', severity: 'suggestion', lessonRef: 'm06-l04' }, undefined,
        `${active.length} couches actives simultanément : au-delà de six, on n'ajoute plus du son, on ajoute de la moyenne`)];
    },
    pedagogy: {
      why: "Chaque couche ajoutée réduit la place des autres. Passé un certain nombre, la pile tend vers le bruit rose : beaucoup d'énergie, aucune identité.",
      how: "Fixe-toi un plafond (six est un bon repère) et impose-toi de RETIRER une couche pour en ajouter une.",
      when: "Sur les piles denses. Une nappe d'ambiance à douze couches très filtrées est un autre exercice — le plafond se déclare alors dans la consigne.",
      commonMistake: "Résoudre un problème de définition en empilant. Le problème de définition se résout presque toujours en enlevant.",
      alternative: "L'automation : douze couches dont six seulement sonnent à la fois, en alternance. La richesse vient du CHANGEMENT, pas de la simultanéité.",
    },
  },
  {
    id: 'sd.stereo',
    severity: 'suggestion',
    weight: 1,
    appliesTo: ['layers'],
    lessonRef: 'm06-l06',
    detect: (ctx: RuleCtx): Issue[] => {
      const stack = stackOf(ctx);
      if (!stack) return [];
      const active = stack.layers.filter(l => !l.removed);
      if (active.length < 3) return [];
      const wide = active.filter(l => (l.width ?? 0) > 0.5);
      const subWide = active.filter(l => l.role === 'sub' && (l.width ?? 0) > 0.3);
      const issues: Issue[] = [];
      const self = { id: 'sd.stereo', severity: 'suggestion' as const, lessonRef: 'm06-l06' };
      if (wide.length < MIN_WIDE_LAYERS) {
        issues.push(ruleIssue(self, undefined, 'toutes les couches sont au centre : la pile n\'occupe aucun espace'));
      }
      for (const layer of subWide) {
        issues.push(ruleIssue(self, undefined, `« ${layer.id} » est un sub élargi : le grave se tient au CENTRE, toujours`));
      }
      return issues;
    },
    pedagogy: {
      why: "L'espace stéréo est une dimension de plus pour séparer des sons qui se disputent la même bande. Ne pas l'utiliser, c'est écouter en mono ; l'utiliser dans le grave, c'est perdre le grave.",
      how: "Élargis le haut, garde le bas au centre. Le sub est mono, sans discussion — c'est physique, pas esthétique.",
      when: "Dès trois couches. Un son mono assumé (une voix, un lead central) n'a pas à s'élargir.",
      commonMistake: "Élargir tout pour « faire grand ». Quand tout est large, plus rien ne l'est — et le mix s'effondre en mono.",
      alternative: "Laisse une couche large et une couche étroite jouer la même chose : le contraste crée la profondeur mieux que la largeur seule.",
    },
  },
  {
    id: 'sd.sustain-sidechain',
    severity: 'suggestion',
    weight: 1,
    appliesTo: ['layers'],
    lessonRef: 'm06-l05',
    detect: (ctx: RuleCtx): Issue[] => {
      const stack = stackOf(ctx);
      if (!stack) return [];
      const active = stack.layers.filter(l => !l.removed);
      const pads = active.filter(l => l.role === 'texture' || l.role === 'body');
      const triggers = active.filter(l => l.trigger === true);
      if (pads.length === 0 || triggers.length === 0) return [];
      const ducked = pads.some(p => p.sidechainedBy !== undefined);
      if (ducked) return [];
      return [ruleIssue({ id: 'sd.sustain-sidechain', severity: 'suggestion', lessonRef: 'm06-l05' }, undefined,
        'une tenue et un transitoire cohabitent sans sidechain : le transitoire va disparaître dans la nappe')];
    },
    pedagogy: {
      why: "Un transitoire a besoin de place au moment exact où il frappe. Une nappe continue occupe cette place. Le sidechain fait respirer la nappe à chaque coup — c'est ce qui rend le coup audible.",
      how: "Déclare quelle couche déclenche et quelle couche s'efface. Quelques dizaines de millisecondes suffisent : on ne cherche pas l'effet de pompage, on cherche la place.",
      when: "Dès qu'une tenue et un transitoire cohabitent. Deux nappes sans percussion n'ont rien à ducker.",
      commonMistake: "Monter le volume du transitoire jusqu'à ce qu'on l'entende. Il devient agressif et il n'est toujours pas net.",
      alternative: "Un creux fixe dans la nappe, à la bande du transitoire : moins vivant qu'un sidechain, mais ça ne bouge pas et ça marche.",
    },
  },
  {
    id: 'sd.hybrid-cohabitation',
    severity: 'suggestion',
    weight: 1,
    appliesTo: ['layers'],
    lessonRef: 'm06-l08',
    detect: (ctx: RuleCtx): Issue[] => {
      const stack = stackOf(ctx);
      if (!stack) return [];
      const active = stack.layers.filter(l => !l.removed);
      const sampled = active.filter(l => l.source === 'sample' || l.source === 'granular');
      const synth = active.filter(l => l.source && l.source !== 'sample' && l.source !== 'granular');
      if (sampled.length === 0 || synth.length === 0) return [];
      const shared = sampled.some(s => synth.some(y => overlap(s, y) >= BAND_OVERLAP));
      if (!shared) return [];
      return [ruleIssue({ id: 'sd.hybrid-cohabitation', severity: 'suggestion', lessonRef: 'm06-l08' }, undefined,
        'acoustique échantillonné et synthèse dans la même bande : l\'hybride se sent au lieu de se fondre')];
    },
    pedagogy: {
      why: "L'hybride réussi ne se remarque pas : on entend UN son, pas un orchestre plus un synthé. La couture se voit quand les deux mondes se battent pour la même bande.",
      how: "Répartis les mondes par étage : l'acoustique porte le corps et l'attaque, la synthèse porte le sub et l'air. Chacun fait ce que l'autre ne sait pas faire.",
      when: "Sur toute pile mêlant échantillons et synthèse.",
      commonMistake: "Doubler une nappe de cordes par une nappe de synthé sur la même tessiture, en espérant « le meilleur des deux ». On obtient un flou qui n'est ni l'un ni l'autre.",
      alternative: "Fais entrer la synthèse SOUS l'acoustique (un sub sinusoïdal sous les contrebasses) : personne ne l'entend comme un synthé, et tout le monde entend que c'est plus grand.",
    },
  },
];
