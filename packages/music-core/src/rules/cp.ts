import type { Issue } from '../types.js';
import type { Rule, RuleCtx } from './types.js';
import { ruleIssue } from './types.js';
import { checkSpecies } from '../analyzers/species.js';
import type { Species, SpeciesOpts } from '../analyzers/species.js';
import { suspensionCheck } from '../analyzers/suspension.js';
import { detectEntries, stretteCheck } from '../analyzers/imitation.js';

/**
 * `rules/cp.ts` — les contrats de contrepoint. Le cantus firmus et l'espèce
 * sont DÉCLARÉS par la consigne (`species`, `cfPosition`) ; sans déclaration,
 * ces règles se taisent plutôt que de deviner qui est le cantus.
 */

function speciesOf(ctx: RuleCtx): Species | null {
  const declared = ctx.spec.constraints?.species;
  return typeof declared === 'number' && declared >= 1 && declared <= 5 ? (declared as Species) : null;
}

/** Les deux voix du contrepoint : le cantus est celui que la consigne désigne. */
function pair(ctx: RuleCtx): { cf: readonly { pitch: number; start: number; duration: number }[]; cp: readonly { pitch: number; start: number; duration: number }[]; opts: SpeciesOpts } | null {
  const voices = ctx.analysis.voices;
  if (!voices || voices.length < 2) return null;
  const position = ctx.spec.constraints?.cfPosition;
  const cpAbove = position === 'above' || position === undefined;
  const [a, b] = voices as [readonly { pitch: number; start: number; duration: number }[], readonly { pitch: number; start: number; duration: number }[]];
  // Le cantus est en rondes : c'est la voix dont les durées sont les plus longues.
  const meanA = a.reduce((s, n) => s + n.duration, 0) / Math.max(1, a.length);
  const meanB = b.reduce((s, n) => s + n.duration, 0) / Math.max(1, b.length);
  const cf = meanA >= meanB ? a : b;
  const cp = cf === a ? b : a;
  const opts: SpeciesOpts = { cpPosition: cpAbove ? 'above' : 'below', key: ctx.analysis.key };
  return { cf, cp, opts };
}

export const CP_RULES: Rule[] = [
  {
    id: 'cp.species-contract',
    severity: 'error',
    weight: 1,
    appliesTo: ['voices'],
    lessonRef: 'm04-l02',
    detect: (ctx: RuleCtx): Issue[] => {
      const species = speciesOf(ctx);
      const voices = pair(ctx);
      if (species === null || !voices) return [];
      return checkSpecies(species, voices.cf, voices.cp, voices.opts).issues
        .filter(i => i.ruleId.startsWith(`species${species}`) || i.ruleId === 'cpt.parallel-perfects')
        .filter(i => i.atTick === undefined || ctx.window.judges(i.atTick));
    },
    pedagogy: {
      why: "Les espèces ne sont pas un jeu de contraintes arbitraires : chacune isole UNE difficulté. La première n'apprend que le choix des consonances ; la deuxième ajoute le temps faible ; la troisième le remplissage ; la quatrième le retard. Mélanger, c'est n'apprendre aucune.",
      how: "Relis ton contrepoint appui par appui : chaque note tombant sur une note du cantus doit consoner. Ce qui se passe entre deux appuis obéit à l'espèce en cours, pas à une autre.",
      when: "Quand la consigne DÉCLARE l'espèce. Sans déclaration, ces règles se taisent — deviner qui est le cantus produirait des verdicts absurdes.",
      commonMistake: "Écrire une belle ligne d'abord et vérifier les intervalles après. L'ordre inverse est plus rapide : la ligne naît des consonances disponibles.",
      alternative: "La cinquième espèce autorise le mélange — mais elle vient APRÈS les quatre autres, quand chaque outil a été appris seul.",
    },
  },
  {
    id: 'cp.suspension',
    severity: 'warning',
    weight: 1,
    appliesTo: ['voices', 'parts'],
    lessonRef: 'm04-l05',
    detect: (ctx: RuleCtx): Issue[] => {
      const voices = ctx.analysis.voices;
      if (!voices || voices.length < 2) return [];
      const required = ctx.spec.constraints?.requireCadentialSuspension === true || speciesOf(ctx) === 4;
      if (!required) return [];
      const { suspensions } = suspensionCheck(voices);
      if (suspensions.length > 0) return [];
      return [ruleIssue({ id: 'cp.suspension', severity: 'warning', lessonRef: 'm04-l05' }, undefined,
        'aucun retard trouvé : préparation consonante, liaison, dissonance sur l\'appui, résolution descendante — les quatre temps doivent y être')];
    },
    pedagogy: {
      why: "Le retard est le geste le plus expressif du contrepoint : une note reste alors qu'elle ne devrait plus, frotte, puis cède. C'est de la friction ORGANISÉE — préparée, donc supportable, et résolue, donc satisfaisante.",
      how: "Quatre temps, toujours : la note consone (préparation), elle est TENUE par-dessus le changement (liaison), elle dissone sur l'appui, elle descend d'un degré (résolution).",
      when: "En quatrième espèce, et partout où la consigne le demande. Le détecteur, lui, travaille sur toute paire de voix et tout style : le retard n'appartient pas aux espèces.",
      commonMistake: "Attaquer la dissonance au lieu de la tenir. Une dissonance frappée est une appoggiature — c'est un autre geste, plus brutal, et il ne se prépare pas.",
      alternative: "La chaîne : la résolution de l'un prépare le suivant. Trois maillons de 7-6 sur des marches descendantes, et tu tiens le moteur du lamento.",
    },
  },
  {
    id: 'cp.cambiata',
    severity: 'info',
    weight: 1,
    appliesTo: ['voices'],
    lessonRef: 'm04-l04',
    detect: (ctx: RuleCtx): Issue[] => {
      const species = speciesOf(ctx);
      const voices = pair(ctx);
      if (species === null || !voices) return [];
      const figures = checkSpecies(species, voices.cf, voices.cp, voices.opts).figures;
      const cambiata = figures.filter(f => f.kind === 'cambiata');
      if (cambiata.length === 0) return [];
      return [ruleIssue({ id: 'cp.cambiata', severity: 'info', lessonRef: 'm04-l04' }, cambiata[0]!.at,
        `cambiata reconnue (${cambiata.length}) : le dessin 8-7-5-6 est exact`)];
    },
    pedagogy: {
      why: "La cambiata est la seule figure du catalogue qui saute PAR une dissonance au lieu de la traverser. Elle a un dessin précis — degré descendant, tierce descendante, degré ascendant — et c'est ce dessin qui la rend acceptable.",
      how: "Descends d'un degré, saute une tierce vers le bas, remonte d'un degré. 8-7-5-6 : les chiffres sont un aide-mémoire, le geste est une courbe.",
      when: "En troisième et cinquième espèces. Le moteur la SIGNALE quand il la trouve : c'est une réussite à nommer, pas une faute à traquer.",
      commonMistake: "L'à-peu-près : une quarte au lieu de la tierce, ou la remontée oubliée. Ce n'est alors plus une cambiata, et la dissonance redevient une faute nue.",
      alternative: "Si le geste ne tombe pas juste, contente-toi d'une broderie ou d'un passage : ils font le même travail de remplissage sans exiger un dessin exact.",
    },
  },
  {
    id: 'cp.imitation',
    severity: 'warning',
    weight: 1,
    appliesTo: ['voices', 'parts'],
    lessonRef: 'm04-l09',
    detect: (ctx: RuleCtx): Issue[] => {
      const voices = ctx.analysis.voices;
      const plan = ctx.spec.constraints?.imitationPlan ?? ctx.spec.constraints?.motifStatementsPerVoice;
      if (!voices || voices.length < 2 || plan === undefined) return [];
      const head = voices[0]?.slice(0, 4);
      if (!head || head.length < 3) return [];
      const entries = detectEntries(voices, head, { answer: 'tonal' });
      const perVoice = new Set(entries.map(e => e.voice));
      if (perVoice.size >= 2) return [];
      return [ruleIssue({ id: 'cp.imitation', severity: 'warning', lessonRef: 'm04-l09' }, undefined,
        'la tête n\'est reprise par aucune autre voix : il n\'y a pas d\'imitation, seulement une superposition')];
    },
    pedagogy: {
      why: "Imiter, c'est faire dire la même chose à quelqu'un d'autre, plus tard. Sans reprise identifiable, les voix se superposent mais ne se PARLENT pas.",
      how: "Prends les trois ou quatre premières notes d'une voix et fais-les entrer dans une autre, une mesure ou deux plus tard, à l'octave ou à la quinte.",
      when: "Quand la consigne demande une imitation, un canon ou un fugato.",
      commonMistake: "Reprendre la tête en changeant le rythme. La transposition se pardonne, l'altération du rythme non : c'est le rythme qui rend la tête reconnaissable.",
      alternative: "La réponse TONALE : mute le premier intervalle pour rester dans le ton. C'est la solution de la fugue, et le moteur la reconnaît (F-28) — à condition que la suite reste exacte.",
    },
  },
  {
    id: 'cp.canon-strette',
    severity: 'info',
    weight: 1,
    appliesTo: ['voices', 'parts'],
    lessonRef: 'm04-l10',
    detect: (ctx: RuleCtx): Issue[] => {
      const voices = ctx.analysis.voices;
      if (!voices || voices.length < 2) return [];
      const head = voices[0]?.slice(0, 4);
      if (!head || head.length < 3) return [];
      const entries = detectEntries(voices, head, { answer: 'real' });
      if (entries.length < 3) return [];
      const headTicks = head.reduce((s, n) => s + n.duration, 0);
      const report = stretteCheck(entries, headTicks);
      if (!report.compresses) return [];
      return [ruleIssue({ id: 'cp.canon-strette', severity: 'info', lessonRef: 'm04-l10' }, entries[0]!.at,
        `strette : ${report.delays.length} délais qui se resserrent${report.overlaps ? ', avec chevauchement' : ''} — la compression est en place`)];
    },
    pedagogy: {
      why: "Dans une strette, ce n'est pas le sujet qui fait la tension, c'est le DÉLAI qui rétrécit. Le filet se resserre, et l'auditeur le sent avant de le comprendre.",
      how: "Fais entrer ton sujet à deux mesures, puis à une, puis à une demie. L'arche des délais est ton moteur — dessine-la avant d'écrire les notes.",
      when: "Le moteur signale la strette quand il la trouve (c'est une info). La consigne peut l'exiger explicitement.",
      commonMistake: "Écrire un sujet impossible à superposer à lui-même. Teste-le CONTRE lui-même aux délais visés avant de bâtir la pièce : si ça ne consonne pas, la strette ne se fera jamais.",
      alternative: "Le canon strict va plus loin : identité complète et décalée, jusqu'à la clausule où la machine s'arrête. La rupture finale n'est pas une triche, c'est la convention.",
    },
  },
];
