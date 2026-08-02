/**
 * Déclaration des idiomes (S2.J4). Ce fichier ne DÉTECTE rien : il déclare ce
 * qu'on cherche — degrés obligatoires, degré de basse, comportement de sortie,
 * tenue minimale — et `analyzers/idioms.ts` vérifie le COMPORTEMENT dans la
 * pièce (Manuel §3 : « ~10 idiomes tagués PAR COMPORTEMENT »). Un idiome dont
 * les notes sont là mais dont le geste ne l'est pas n'est pas tagué : c'est
 * toute la différence entre le vii°7 passant (s04 m2) et le vii°7 pivot
 * (s04 m7) — mêmes pitch-classes, deux métiers.
 */

export type IdiomId =
  | 'neapolitan'
  | 'aug6-it'
  | 'aug6-fr'
  | 'aug6-ger'
  | 'ger6-v7'
  | 'dim7-passing'
  | 'dim7-pivot'
  | 'subV'
  | 'back-door'
  | 'line-cliche'
  | 'planing-real'
  | 'planing-diatonic'
  | 'planing-quartal'
  | 'quartal'
  | 'quartal-release'
  | 'augmented-pivot';

/**
 * Famille lue par les RÈGLES (le tag neutralise la règle concernée) :
 *  - `aug6` couvre F-15 (quintes de Mozart rétrogradées en `info`) et F-16
 *    (la verticalité n'est JAMAIS relue `subV` en tonalité établie) ;
 *  - `planing` crédite les parallèles (la dette de §7.4) ;
 *  - `quartal` désactive la lecture tertienne ;
 *  - `dim7` / `subV` / `back-door` / `neapolitan` / `line-cliche` / `augmented`
 *    sont lues par le rapport et par les checkers d'idiomes.
 */
export type IdiomFamily =
  | 'neapolitan'
  | 'aug6'
  | 'dim7'
  | 'subV'
  | 'back-door'
  | 'line-cliche'
  | 'planing'
  | 'quartal'
  | 'augmented';

export interface IdiomPattern {
  id: IdiomId;
  family: IdiomFamily;
  /** Libellé de rapport (fr) — le vocabulaire du cursus, pas du jargon d'analyseur. */
  label: string;
  /** Leçon qui l'enseigne (`Issue.lessonRef`). */
  lessonRef: string;
  /**
   * Degrés (demi-tons depuis la tonique) que la verticalité doit contenir.
   * `exactDegrees` : elle ne doit RIEN contenir d'autre — l'italienne se
   * distingue de la française et de l'allemande par ce qu'elle N'A PAS.
   */
  requiredDegrees?: readonly number[];
  exactDegrees?: boolean;
  /** Degré obligatoire à la basse (le napolitain EST une position de sixte). */
  bassDegree?: number;
  /** Degré de basse de la verticalité de sortie — le comportement, pas le contenu. */
  resolvesToBassDegree?: number;
  /** Mouvement de basse (demi-tons) vers la sortie, quand la cible est relative. */
  bassMotion?: number;
  /** Tenue minimale (en mesures) : les pivots se reconnaissent à ce qu'ils DURENT. */
  minHeldBars?: number;
  /** Nombre minimal de verticalités du geste (planing, line cliché). */
  minSpan?: number;
}

/**
 * Degrés utilisés ci-dessous, pour se relire : 0 = 1̂ · 1 = ♭2̂ · 2 = 2̂ ·
 * 3 = ♭3̂ · 5 = 4̂ · 6 = ♯4̂ · 7 = 5̂ · 8 = ♭6̂ · 10 = ♭7̂ · 11 = 7̂.
 */
export const IDIOM_PATTERNS: readonly IdiomPattern[] = [
  {
    id: 'neapolitan',
    family: 'neapolitan',
    label: 'napolitain (♭II⁶)',
    lessonRef: 'm03-l02',
    requiredDegrees: [1, 5, 8], // la triade majeure sur ♭2̂ : ♭2̂ + 4̂ + ♭6̂
    exactDegrees: true,
    bassDegree: 5, // position de sixte : 4̂ à la basse
  },
  {
    id: 'aug6-it',
    family: 'aug6',
    label: 'sixte augmentée italienne',
    lessonRef: 'm03-l03',
    requiredDegrees: [8, 0, 6],
    exactDegrees: true,
    bassDegree: 8,
    resolvesToBassDegree: 7, // ♭6̂ → 5̂
  },
  {
    id: 'aug6-fr',
    family: 'aug6',
    label: 'sixte augmentée française',
    lessonRef: 'm03-l03',
    requiredDegrees: [8, 0, 6, 2],
    exactDegrees: true,
    bassDegree: 8,
    resolvesToBassDegree: 7,
  },
  {
    id: 'aug6-ger',
    family: 'aug6',
    label: 'sixte augmentée allemande (Ger⁶)',
    lessonRef: 'm03-l03',
    requiredDegrees: [8, 0, 6, 3],
    exactDegrees: true,
    bassDegree: 8,
    resolvesToBassDegree: 7,
  },
  {
    id: 'ger6-v7',
    family: 'aug6',
    label: 'Ger⁶ ≡ V7 (le pivot enharmonique)',
    lessonRef: 'm03-l05',
    requiredDegrees: [8, 0, 6, 3],
    exactDegrees: true,
    bassDegree: 8,
    resolvesToBassDegree: 7,
    minHeldBars: 2, // le TENU qui fait lâcher le monde de départ (s05, variante ger6-v7)
  },
  {
    id: 'dim7-passing',
    family: 'dim7',
    label: "dim7 passant (l'escalier de basse)",
    lessonRef: 'm03-l04',
  },
  {
    id: 'dim7-pivot',
    family: 'dim7',
    label: 'dim7 pivot (la gare aux quatre sensibles)',
    lessonRef: 'm03-l04',
    minHeldBars: 1,
  },
  {
    id: 'subV',
    family: 'subV',
    label: 'dominante substituée (subV)',
    lessonRef: 'm01-l20',
    bassMotion: -1, // basse ½ ton descendant vers la cible
  },
  {
    id: 'back-door',
    family: 'back-door',
    label: 'back-door (♭VII7 → I)',
    lessonRef: 'm08-l09',
    requiredDegrees: [10, 2, 5, 8],
    bassDegree: 10,
    resolvesToBassDegree: 0,
  },
  {
    id: 'line-cliche',
    family: 'line-cliche',
    label: 'line cliché (voix interne chromatique)',
    lessonRef: 'm01-l22',
    minSpan: 3,
  },
  {
    id: 'planing-real',
    family: 'planing',
    label: 'planing réel (la structure exacte transposée)',
    lessonRef: 'm03-l14',
    minSpan: 3,
  },
  {
    id: 'planing-diatonic',
    family: 'planing',
    label: 'planing diatonique (les qualités varient)',
    lessonRef: 'm03-l14',
    minSpan: 3,
  },
  {
    id: 'planing-quartal',
    family: 'planing',
    label: 'planing quartal',
    lessonRef: 'm03-l14',
    minSpan: 3,
  },
  {
    id: 'quartal',
    family: 'quartal',
    label: 'empilement quartal',
    lessonRef: 'm03-l13',
  },
  {
    id: 'quartal-release',
    family: 'quartal',
    label: 'ouverture tertienne de la pile quartale',
    lessonRef: 'm03-l13',
  },
  {
    id: 'augmented-pivot',
    family: 'augmented',
    label: 'augmenté pivot (4+4+4 : plus de monde)',
    lessonRef: 'm03-l05',
    minHeldBars: 1,
  },
];

const BY_ID = new Map<IdiomId, IdiomPattern>(IDIOM_PATTERNS.map(p => [p.id, p]));

export function idiomPattern(id: IdiomId): IdiomPattern {
  const p = BY_ID.get(id);
  if (!p) throw new Error(`idiomes : motif inconnu "${id}"`);
  return p;
}
