import type { Mute } from '../types.js';

/**
 * Données instruments — annexe F du Manuel (les 11 du MVP, valeurs normatives)
 * ÉTENDUES aux fiches V1 de M5 (décision n°27, 26 fiches). Règle §7.1 : toute
 * donnée chiffrée est transcrite de sa fiche, commentaire-citation à l'appui,
 * et évolue dans la même PR que la fiche.
 *
 * Hauteurs en MIDI, sons RÉELS (C4 = 60). `transposition` note le décalage
 * écrit→réel pour mémoire ; les analyseurs travaillent en sons réels.
 */

export type InstrumentFamily = 'strings' | 'woodwind' | 'brass' | 'keyboard' | 'percussion' | 'harp';

/**
 * Comment le son se tient : `unlimited` (archet en section), `breath` / `lips`
 * (budget d'endurance, cf. `ENDURANCE_BUDGET`), `decay` (l'instrument qui MENT :
 * piano, harpe, célesta), `resonant` (percussion à résonance contrôlable),
 * `infinite` (l'orgue — le seul sans décroissance NI respiration).
 */
export type Sustain = 'unlimited' | 'breath' | 'lips' | 'decay' | 'resonant' | 'infinite';

export interface RegisterZone {
  from: number;
  to: number;
  label: string;
  /** Facteur appliqué à la puissance dans cette zone (annexe F : flûte ×0.4→×1.6). */
  powerFactor: number;
  /** Zone où la note s'expose : timbre fragile, justesse difficile, ou coût d'endurance. */
  exposedRisk?: boolean;
}

export interface MuteModifier {
  power: number;
  /** Variation d'aptitude au fondu : +1 = se fond mieux (F-40). */
  blend: number;
}

export interface Instrument {
  id: string;
  family: InstrumentFamily;
  /** Tessiture praticable, sons réels. */
  range: [number, number];
  sweetSpot: [number, number];
  /** Puissance sur 10, aux deux bouts de la nuance. */
  dynamicPower: { pp: number; ff: number };
  /** Agilité sur 10. */
  agility: number;
  sustain: Sustain;
  /** Écrit → réel, en demi-tons (mémoire ; les analyseurs sont en sons réels). */
  transposition?: number;
  registerZones?: readonly RegisterZone[];
  blendsWith?: readonly string[];
  avoidWith?: readonly string[];
  muteModifiers?: Partial<Record<Mute, MuteModifier>>;
  /** La fiche dont la ligne est tirée (règle §7.1). */
  lessonRef: string;
}

export const INSTRUMENTS: readonly Instrument[] = [
  // fiche m05-l02-violins §Carte d'identité — « corde de sol = lyrisme viscéral ; suraigu désincarné »
  {
    id: 'violin-1', family: 'strings', range: [55, 95], sweetSpot: [57, 88],
    dynamicPower: { pp: 2, ff: 7 }, agility: 10, sustain: 'unlimited',
    registerZones: [
      { from: 55, to: 62, label: 'corde de sol', powerFactor: 0.9 },
      { from: 63, to: 88, label: 'médium', powerFactor: 1 },
      { from: 89, to: 95, label: 'suraigu', powerFactor: 1.1, exposedRisk: true },
    ],
    blendsWith: ['violin-2', 'viola', 'flute'],
    muteModifiers: { 'con-sord': { power: 0.65, blend: 1 } },
    lessonRef: 'm05-l02',
  },
  // fiche m05-l02-violins §Rôles — « rôles inversés : contrechant/harmonie d'abord — jamais "I bis" »
  {
    id: 'violin-2', family: 'strings', range: [55, 95], sweetSpot: [55, 84],
    dynamicPower: { pp: 2, ff: 7 }, agility: 10, sustain: 'unlimited',
    blendsWith: ['violin-1', 'viola'],
    muteModifiers: { 'con-sord': { power: 0.65, blend: 1 } },
    lessonRef: 'm05-l02',
  },
  // fiche m05-l03-alto §Carte d'identité — « le liant du milieu ; l'aigu = intensité voulue »
  {
    id: 'viola', family: 'strings', range: [48, 88], sweetSpot: [48, 74],
    dynamicPower: { pp: 2, ff: 6 }, agility: 8, sustain: 'unlimited',
    registerZones: [
      { from: 48, to: 74, label: 'médium', powerFactor: 1 },
      { from: 75, to: 88, label: 'aigu tendu', powerFactor: 1.1, exposedRisk: true },
    ],
    blendsWith: ['violin-2', 'cello', 'english-horn', 'clarinet'],
    muteModifiers: { 'con-sord': { power: 0.65, blend: 1 } },
    lessonRef: 'm05-l03',
  },
  // fiche m05-l04-violoncelle §Carte d'identité — « le registre "ténor" G3–E4 est l'or pur »
  {
    id: 'cello', family: 'strings', range: [36, 81], sweetSpot: [36, 64],
    dynamicPower: { pp: 2, ff: 7 }, agility: 8, sustain: 'unlimited',
    registerZones: [
      { from: 36, to: 54, label: 'grave', powerFactor: 0.95 },
      { from: 55, to: 64, label: "ténor (l'or pur)", powerFactor: 1.1 },
      { from: 65, to: 81, label: 'aigu', powerFactor: 1, exposedRisk: true },
    ],
    blendsWith: ['french-horn', 'viola', 'bassoon'],
    muteModifiers: { 'con-sord': { power: 0.65, blend: 1 } },
    lessonRef: 'm05-l04',
  },
  // fiche m05-l05-contrebasse §Carte d'identité — « écrite +8va ; lignes seulement »
  {
    id: 'double-bass', family: 'strings', range: [28, 55], sweetSpot: [28, 50],
    dynamicPower: { pp: 3, ff: 7 }, agility: 4, sustain: 'unlimited', transposition: -12,
    blendsWith: ['cello', 'contrabassoon', 'tuba'],
    muteModifiers: { 'con-sord': { power: 0.65, blend: 1 } },
    lessonRef: 'm05-l05',
  },
  // fiche m05-l06-harpe §Carte d'identité — « machine diatonique » ; 9/10 dans un accordage, 3/10 dès qu'il faut changer de pédale
  {
    id: 'harp', family: 'harp', range: [24, 103], sweetSpot: [36, 84],
    dynamicPower: { pp: 1, ff: 4 }, agility: 9, sustain: 'decay',
    blendsWith: ['flute', 'celesta'],
    avoidWith: ['piano'], // « deux décroissances qui s'annulent, choisis »
    lessonRef: 'm05-l06',
  },
  // fiche m05-l07-flute §Couleur par registre — « la puissance croît avec la hauteur »
  {
    id: 'flute', family: 'woodwind', range: [60, 96], sweetSpot: [67, 91],
    dynamicPower: { pp: 2, ff: 5 }, agility: 10, sustain: 'breath',
    registerZones: [
      { from: 60, to: 66, label: 'grave (velouté et INAUDIBLE)', powerFactor: 0.4, exposedRisk: true },
      { from: 67, to: 91, label: 'médium/aigu — 90 % du rôle', powerFactor: 1 },
      { from: 92, to: 96, label: 'suraigu perçant', powerFactor: 1.6 },
    ],
    blendsWith: ['harp', 'violin-1', 'clarinet'],
    lessonRef: 'm05-l07',
  },
  // fiche m05-l08-piccolo §Carte d'identité — « ff 10/10 : à égalité avec la trompette » ; jamais discret
  {
    id: 'piccolo', family: 'woodwind', range: [74, 108], sweetSpot: [86, 105],
    dynamicPower: { pp: 1, ff: 10 }, agility: 10, sustain: 'breath', transposition: 12,
    lessonRef: 'm05-l08',
  },
  // fiche m05-l09-flute-alto §Carte d'identité — « le pupitre mélodique le plus faible de l'orchestre »
  {
    id: 'alto-flute', family: 'woodwind', range: [55, 91], sweetSpot: [55, 74],
    dynamicPower: { pp: 1, ff: 3 }, agility: 8, sustain: 'breath', transposition: -5,
    lessonRef: 'm05-l09',
  },
  // fiche m05-l10-hautbois §Carte d'identité — « pénétrance hors norme, fondu FAIBLE »
  {
    id: 'oboe', family: 'woodwind', range: [58, 93], sweetSpot: [60, 81],
    dynamicPower: { pp: 3, ff: 5 }, agility: 7, sustain: 'breath',
    avoidWith: ['trumpet'], // solos concurrents (annexe F)
    lessonRef: 'm05-l10',
  },
  // fiche m05-l11-cor-anglais §Carte d'identité — hautbois en fa
  {
    id: 'english-horn', family: 'woodwind', range: [52, 83], sweetSpot: [53, 74],
    dynamicPower: { pp: 2, ff: 4 }, agility: 6, sustain: 'breath', transposition: -7,
    blendsWith: ['viola', 'french-horn'],
    lessonRef: 'm05-l11',
  },
  // fiche m05-l12-clarinette §Carte d'identité — chalumeau / gorge (exposedRisk) / clairon ; « entrées invisibles »
  {
    id: 'clarinet', family: 'woodwind', range: [50, 94], sweetSpot: [50, 84],
    dynamicPower: { pp: 1, ff: 6 }, agility: 9, sustain: 'breath', transposition: -2,
    registerZones: [
      { from: 50, to: 65, label: 'chalumeau', powerFactor: 1 },
      { from: 66, to: 70, label: 'gorge (à traverser)', powerFactor: 0.75, exposedRisk: true },
      { from: 71, to: 94, label: 'clairon', powerFactor: 1.1 },
    ],
    blendsWith: ['flute', 'viola', 'french-horn'],
    lessonRef: 'm05-l12',
  },
  // fiche m05-l13-clarinette-basse §Carte d'identité — « le ppp le plus grave et le plus doux »
  {
    id: 'bass-clarinet', family: 'woodwind', range: [34, 79], sweetSpot: [34, 53],
    dynamicPower: { pp: 1, ff: 6 }, agility: 8, sustain: 'breath', transposition: -14,
    lessonRef: 'm05-l13',
  },
  // fiche m05-l14-basson §Carte d'identité — « remarquable en staccato »
  {
    id: 'bassoon', family: 'woodwind', range: [34, 75], sweetSpot: [43, 67],
    dynamicPower: { pp: 2, ff: 6 }, agility: 7, sustain: 'breath',
    blendsWith: ['cello', 'french-horn'],
    lessonRef: 'm05-l14',
  },
  // fiche m05-l15-contrebasson §Carte d'identité — « l'instrument le plus lent de l'orchestre à parler »
  {
    id: 'contrabassoon', family: 'woodwind', range: [22, 58], sweetSpot: [24, 43],
    dynamicPower: { pp: 2, ff: 5 }, agility: 2, sustain: 'breath', transposition: -12,
    blendsWith: ['double-bass', 'tuba'],
    lessonRef: 'm05-l15',
  },
  // fiche m05-l16-trompette §Carte d'identité + §La sourdine — « ff 10/10, le sommet de l'orchestre »
  {
    id: 'trumpet', family: 'brass', range: [52, 84], sweetSpot: [55, 79],
    dynamicPower: { pp: 3, ff: 10 }, agility: 7, sustain: 'lips', transposition: -2,
    registerZones: [
      { from: 52, to: 54, label: 'grave cuivré, voilé (rare)', powerFactor: 0.8 },
      { from: 55, to: 79, label: 'médium — le signal', powerFactor: 1 },
      { from: 80, to: 84, label: 'aigu triomphal, COÛTEUX', powerFactor: 1.15, exposedRisk: true },
    ],
    avoidWith: ['french-horn'], // unisson ff (annexe F)
    muteModifiers: {
      straight: { power: 0.5, blend: -1 }, // pincé, métallique, distant
      cup: { power: 0.55, blend: 1 }, // doux, voilé
      'con-sord': { power: 0.65, blend: 1 },
    },
    lessonRef: 'm05-l16',
  },
  // fiche m05-l17-french-horn §Carte d'identité — « le roi des notes longues » ; aigu exposedRisk
  {
    id: 'french-horn', family: 'brass', range: [34, 77], sweetSpot: [46, 70],
    dynamicPower: { pp: 2, ff: 9 }, agility: 4, sustain: 'lips', transposition: -7,
    registerZones: [
      { from: 34, to: 45, label: 'grave', powerFactor: 0.85 },
      { from: 46, to: 70, label: 'registre expressif', powerFactor: 1 },
      { from: 71, to: 77, label: 'aigu', powerFactor: 1.1, exposedRisk: true },
    ],
    blendsWith: ['cello', 'clarinet', 'bassoon', 'english-horn'],
    muteModifiers: { 'con-sord': { power: 0.65, blend: 1 } },
    lessonRef: 'm05-l17',
  },
  // fiche m05-l18-trombone-tenor §Carte d'identité — « ff 9/10 — le mur »
  {
    id: 'tenor-trombone', family: 'brass', range: [40, 70], sweetSpot: [46, 62],
    dynamicPower: { pp: 2, ff: 9 }, agility: 5, sustain: 'lips',
    muteModifiers: { straight: { power: 0.5, blend: -1 }, 'con-sord': { power: 0.65, blend: 1 } },
    lessonRef: 'm05-l18',
  },
  // fiche m05-l19-trombone-basse §Carte d'identité — « une masse que le ténor n'a pas »
  {
    id: 'bass-trombone', family: 'brass', range: [34, 65], sweetSpot: [34, 46],
    dynamicPower: { pp: 3, ff: 9 }, agility: 4, sustain: 'lips',
    lessonRef: 'm05-l19',
  },
  // fiche m05-l20-tuba §Carte d'identité — « une masse, pas un tranchant » ; le plus gros consommateur d'air
  {
    id: 'tuba', family: 'brass', range: [26, 65], sweetSpot: [29, 53],
    dynamicPower: { pp: 2, ff: 8 }, agility: 6, sustain: 'lips',
    blendsWith: ['double-bass', 'contrabassoon'],
    lessonRef: 'm05-l20',
  },
  // fiche m05-l21-piano §Carte d'identité — « l'instrument qui MENT » (aucune tenue vraie)
  {
    id: 'piano', family: 'keyboard', range: [21, 108], sweetSpot: [36, 96],
    dynamicPower: { pp: 1, ff: 9 }, agility: 10, sustain: 'decay',
    avoidWith: ['harp'],
    lessonRef: 'm05-l21',
  },
  // fiche m05-l22-celesta §Carte d'identité — « le plus faible instrument de l'orchestre »
  {
    id: 'celesta', family: 'keyboard', range: [60, 108], sweetSpot: [72, 96],
    dynamicPower: { pp: 1, ff: 2 }, agility: 9, sustain: 'decay', transposition: 12,
    blendsWith: ['harp'],
    lessonRef: 'm05-l22',
  },
  // fiche m05-l23-orgue §Carte d'identité — « le seul instrument sans aucune décroissance ni respiration »
  {
    id: 'organ', family: 'keyboard', range: [12, 96], sweetSpot: [24, 96],
    dynamicPower: { pp: 1, ff: 11 }, agility: 8, sustain: 'infinite',
    lessonRef: 'm05-l23',
  },
  // fiche m05-l24-timbales §Carte d'identité — deux mailloches : deux notes simultanées au plus
  {
    id: 'timpani', family: 'percussion', range: [38, 57], sweetSpot: [41, 50],
    dynamicPower: { pp: 1, ff: 9 }, agility: 7, sustain: 'resonant',
    lessonRef: 'm05-l24',
  },
  // fiche m05-l25-claviers-de-percussion — les quatre claviers d'une même fiche
  {
    id: 'glockenspiel', family: 'percussion', range: [79, 108], sweetSpot: [79, 108],
    dynamicPower: { pp: 2, ff: 8 }, agility: 8, sustain: 'resonant', transposition: 24,
    lessonRef: 'm05-l25',
  },
  {
    id: 'xylophone', family: 'percussion', range: [72, 108], sweetSpot: [72, 108],
    dynamicPower: { pp: 2, ff: 7 }, agility: 9, sustain: 'decay', transposition: 12,
    lessonRef: 'm05-l25',
  },
  {
    id: 'vibraphone', family: 'percussion', range: [53, 89], sweetSpot: [53, 89],
    dynamicPower: { pp: 1, ff: 5 }, agility: 8, sustain: 'resonant',
    lessonRef: 'm05-l25',
  },
  {
    id: 'marimba', family: 'percussion', range: [36, 96], sweetSpot: [48, 84],
    dynamicPower: { pp: 1, ff: 4 }, agility: 8, sustain: 'resonant',
    registerZones: [
      { from: 36, to: 47, label: 'grave chaud', powerFactor: 0.5 }, // « grave : 2/10 »
      { from: 48, to: 96, label: 'médium/aigu', powerFactor: 1 },
    ],
    lessonRef: 'm05-l25',
  },
];

const BY_ID = new Map(INSTRUMENTS.map(i => [i.id, i]));

export function instrument(id: string): Instrument | undefined {
  return BY_ID.get(id);
}

/**
 * Budget d'endurance en MESURES de jeu continu (annexe F). `unlimited`,
 * `decay`, `resonant` et `infinite` n'en ont pas : la question ne se pose pas.
 */
export const ENDURANCE_BUDGET: Record<'breath' | 'lips', { normal: number; high: number }> = {
  breath: { normal: 8, high: 6 },
  lips: { normal: 12, high: 4 },
};
