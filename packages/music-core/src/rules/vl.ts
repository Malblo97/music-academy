import type { Issue } from '../types.js';
import type { Rule, RuleCtx } from './types.js';
import { voiceLeadingIssues } from '../analyzers/voiceleading.js';

/**
 * `rules/vl.ts` — les quatre règles de conduite. Le travail est fait par
 * `analyzers/voiceleading.ts`, exceptions codées comprises ; ces règles
 * FILTRENT sa sortie par famille, appliquent la fenêtre F-41 et portent la
 * parole pédagogique. Une seule passe d'analyse pour les quatre.
 */

function analyse(ctx: RuleCtx, ruleId: string): Issue[] {
  const voices = ctx.analysis.voices;
  if (!voices || voices.length < 2) return [];
  const context: Parameters<typeof voiceLeadingIssues>[2] = {};
  if (ctx.analysis.idioms) context.idioms = ctx.analysis.idioms;
  if (ctx.analysis.cadences) context.cadences = ctx.analysis.cadences;
  // F-66 : sans le chiffrage, la sensible se juge hors contexte fonctionnel.
  if (ctx.analysis.chords) context.chords = ctx.analysis.chords;
  // Décision n°35 : la consigne déclare-t-elle un tapis surmonté d'une ligne ?
  if (ctx.spec.texture === 'stratified') context.stratified = true;

  return voiceLeadingIssues(voices, ctx.analysis.key, context)
    .filter(i => i.ruleId === ruleId || (ruleId === 'vl.parallel-perfects' && i.ruleId === 'vl.mozart-fifths'))
    // F-41 : ce que l'élève n'a pas écrit ne lui est pas reproché.
    .filter(i => i.atTick === undefined || ctx.window.judges(i.atTick));
}

export const VL_RULES: Rule[] = [
  {
    id: 'vl.parallel-perfects',
    needsIndependentVoices: true,
    severity: 'error',
    weight: 1,
    appliesTo: ['voices', 'parts', 'midi'],
    lessonRef: 'm01-l12',
    detect: (ctx: RuleCtx) => [
      ...analyse(ctx, 'vl.parallel-perfects'),
      ...analyse(ctx, 'vl.direct-perfect'),
    ],
    pedagogy: {
      why: "Deux voix qui bougent en quintes ou en octaves parallèles cessent d'être deux voix : l'oreille les fusionne en une seule, épaissie. Tout l'enjeu de l'écriture à plusieurs voix disparaît d'un coup.",
      how: "Fais bouger tes voix en sens CONTRAIRE dès que tu approches d'une quinte ou d'une octave. Si les deux doivent monter, change l'intervalle : une sixte, une tierce.",
      when: "En écriture classique. **0.1 en `epic-film`** (l'épique assume la puissance des parallèles), **0 en `impressionist`** et sous tout tag `planing` : là, c'est le procédé même. Et **F-15** : les quintes de Mozart sous une sixte augmentée sont nommées, jamais fautives.",
      commonMistake: "Harmoniser une mélodie en doublant simplement à la quinte. Ce n'est pas de l'harmonie, c'est un épaississement — parfois superbe, mais il faut le savoir.",
      alternative: "Si tu veux la puissance du parallélisme : déclare-le. Un planing tagué est CRÉDITÉ par le moteur, et le rapport te dira que tu l'as fait exprès.",
    },
  },
  {
    id: 'vl.leading-tone-resolution',
    needsIndependentVoices: true,
    severity: 'error',
    weight: 1,
    appliesTo: ['voices', 'parts', 'midi'],
    lessonRef: 'm01-l15',
    detect: (ctx: RuleCtx) => analyse(ctx, 'vl.leading-tone-resolution'),
    pedagogy: {
      why: "La sensible est la note qui TIRE : elle est à un demi-ton de la tonique et toute l'oreille l'y attend. Ne pas l'y mener, c'est promettre puis se taire.",
      how: "Fais-la monter d'un demi-ton sur la tonique, à la voix où tu l'as écrite.",
      when: "Aux voix extrêmes surtout. En voix INTERNE, la sensible frustrée (qui descend chercher la quinte) est permise — sans elle, l'accord d'arrivée serait incomplet. Et **F-1** : la sensible de passage dans une ligne conjointe hors cadence n'est qu'une suggestion.",
      commonMistake: "Doubler la sensible pour compléter un accord. Deux voix ne peuvent pas monter sur la même tonique sans faire des octaves.",
      alternative: "En modal, il n'y a pas de sensible et c'est tant mieux : la cadence dorienne IV→i se passe très bien de cette tension (« le V7 est un poison » en modal).",
    },
  },
  {
    id: 'vl.spacing',
    needsIndependentVoices: true,
    severity: 'warning',
    weight: 1,
    appliesTo: ['voices', 'parts', 'midi'],
    lessonRef: 'm01-l12',
    detect: (ctx: RuleCtx) => analyse(ctx, 'vl.spacing'),
    pedagogy: {
      why: "Entre deux voix supérieures, un écart de plus d'une octave laisse un trou : l'accord se déchire en deux blocs au lieu de sonner comme un corps.",
      how: "Garde au plus une octave entre soprano et alto, et entre alto et ténor. La basse, elle, a le droit de s'éloigner : c'est le sol, pas un étage.",
      when: "En écriture serrée à quatre voix. Les textures orchestrales larges et les voicings de piano ouverts ont leurs propres lois (m07-l03).",
      commonMistake: "Monter le soprano sans monter le reste. L'accord ne suit pas, et la mélodie se retrouve toute seule au-dessus du vide.",
      alternative: "Si tu veux vraiment le grand écart : mets quelque chose dedans — une doublure d'octave, une note de passage. Le trou n'est un défaut que s'il reste vide.",
    },
  },
  {
    id: 'vl.doubled-leading-tone',
    needsIndependentVoices: true,
    severity: 'error',
    weight: 1,
    appliesTo: ['voices', 'parts', 'midi'],
    lessonRef: 'm01-l15',
    detect: (ctx: RuleCtx) => analyse(ctx, 'vl.doubled-leading-tone'),
    pedagogy: {
      why: "Deux sensibles veulent aller au même endroit, par le même chemin. Elles y arrivent en octaves parallèles — la faute que la règle précédente interdit, fabriquée par construction.",
      how: "Double la fondamentale ou la quinte de l'accord, jamais sa sensible.",
      when: "Toujours, en écriture à voix indépendantes. La question ne se pose pas quand la sensible est une doublure d'octave assumée dans un tutti orchestral.",
      commonMistake: "Compléter un V à quatre voix en doublant ce qui tombait sous la main. C'est toujours la sensible qui tombe sous la main.",
      alternative: "Un V incomplet (sans quinte) vaut mieux qu'un V à sensible doublée : F-3 accepte l'accord de septième sans sa quinte, précisément pour t'offrir cette porte de sortie.",
    },
  },
];
