import type { Note, Submission } from '../types.js';
import type { AnalysisBundle, ExerciseSpec } from '../rules/types.js';
import { archFit } from '../analyzers/tension.js';
import { clamp01, avg } from './scoring.js';

/**
 * `pipeline/craft.ts` — LES MÉTRIQUES POSITIVES, par kind.
 *
 * Les règles disent ce qui est fautif ; les checkers disent ce qui est conforme.
 * Ni les unes ni les autres ne savent dire qu'une pièce est BONNE — une pièce
 * sans faute et conforme peut être parfaitement plate. Le craft est le seul
 * terme qui récompense, et c'est ici que « bien » devient un chiffre.
 *
 * Chaque kind a ses composantes, chacune ramenée en 0–1, moyennées avec des
 * poids explicites. Une composante ≥ 0.8 devient une PHRASE du rapport
 * (`feedback.ts`) : c'est la raison d'être des `label`/`evidence`.
 *
 * **Quand on ne sait pas mesurer, on renvoie `null`** — pas 1, pas 0.5. Le
 * craft des kinds DAW/ANALYSIS vit dans leurs checkers de preuve et dans la
 * concordance ; leur inventer une note ici gonflerait le score d'un chiffre
 * sans contenu. `computeScore` redistribue alors le poids sur les deux autres
 * termes.
 */

export interface CraftComponent {
  id: string;
  /** Ce que la composante récompense, à la première personne du rapport. */
  label: string;
  value: number;
  /** Le chiffre observé, pour que le rapport puisse le CITER. */
  evidence: string;
}

export interface CraftResult {
  value: number;
  components: CraftComponent[];
}

function comp(id: string, label: string, value: number, evidence: string): CraftComponent {
  return { id, label, value: clamp01(value), evidence };
}

function result(components: CraftComponent[]): CraftResult {
  return { value: clamp01(avg(components.map(c => c.value))), components };
}

/**
 * Une valeur jugée dans une FOURCHETTE : pleine à l'intérieur, dégradée
 * linéairement au-dehors sur la largeur de tolérance. Un ratio conjoint de 0.72
 * ne vaut pas mieux que 0.78 — les deux sont « dans la norme », et prétendre le
 * contraire serait de la fausse précision.
 */
function inBand(x: number, [lo, hi]: [number, number], tolerance = 0.25): number {
  if (x >= lo && x <= hi) return 1;
  const distance = x < lo ? lo - x : x - hi;
  return clamp01(1 - distance / tolerance);
}

/** Pearson vit dans [-1, 1], la platitude dans [0, 1] : on les ramène au même axe. */
function normalizedArchFit(curve: readonly number[], moodId: string): { value: number; raw: number; regime: string } {
  const { fit, regime } = archFit(curve, moodId);
  return { value: regime === 'pearson' ? (fit + 1) / 2 : fit, raw: fit, regime };
}

function targetMoodOf(spec: ExerciseSpec): string {
  return spec.styleProfile?.targetMood ?? 'default';
}

/** La ligne réelle : une note par attaque, la plus aiguë (le chant). */
function topLine(notes: readonly Note[]): Note[] {
  const top = new Map<number, Note>();
  for (const n of notes) {
    const cur = top.get(n.start);
    if (!cur || n.pitch > cur.pitch) top.set(n.start, n);
  }
  return [...top.values()].sort((a, b) => a.start - b.start);
}

/** La ligne de basse : une note par attaque, la plus grave. */
function bassLine(notes: readonly Note[]): Note[] {
  const low = new Map<number, Note>();
  for (const n of notes) {
    const cur = low.get(n.start);
    if (!cur || n.pitch < cur.pitch) low.set(n.start, n);
  }
  return [...low.values()].sort((a, b) => a.start - b.start);
}

/** Part des intervalles conjoints (≤ 2 demi-tons) d'une ligne. */
function conjunctRatio(line: readonly Note[]): number {
  if (line.length < 2) return 0;
  let steps = 0;
  for (let i = 1; i < line.length; i++) {
    if (Math.abs(line[i]!.pitch - line[i - 1]!.pitch) <= 2) steps++;
  }
  return steps / (line.length - 1);
}

// ---------------------------------------------------------------------------
// MELODY_COMPOSE
// ---------------------------------------------------------------------------

/**
 * La norme conjoint/disjoint dépend du style : une ligne de chant vit autour de
 * 70 % de degrés conjoints, un thème héroïque assume ses sauts. Les fourchettes
 * sont larges à dessein — c'est une récompense, pas un couperet.
 */
const STEP_BAND: Record<string, [number, number]> = {
  default: [0.55, 0.85],
  heroic: [0.35, 0.75],
  epic: [0.35, 0.75],
  lullaby: [0.70, 1.0],
  sad: [0.60, 0.90],
  romantic: [0.50, 0.85],
};

/**
 * **La consigne fixe-t-elle elle-même le profil d'intervalles ?**
 *
 * `step-leap-balance` récompense une ligne « dans la norme du style ». Encore
 * faut-il que la norme vienne du style. Trois cas où elle vient d'ailleurs, et
 * où la composante notait l'élève sur le contraire de ce qu'on lui demandait :
 *
 *  - `minPerfectIntervalRatio` (m02-e26, « weightless ») : la consigne EXIGE au
 *    moins la moitié d'intervalles justes. Une quarte est un saut. La pièce,
 *    conforme à 67 %, était notée 0,00 pour « pas assez de degrés conjoints » ;
 *  - `minConjunctRatio`/`maxConjunctRatio` (m02-e16) : le checker MESURE déjà le
 *    ratio, avec le seuil de la consigne. Le craft le rejugeait par-dessus avec
 *    une fourchette différente — deux verdicts pour un fait ;
 *  - `givenCellAsMotif` (m02-e05, m02-e07) : la cellule est FOURNIE. Ses sauts
 *    ne sont pas ceux de l'élève, et F-41 dit qu'on ne reproche pas à l'élève
 *    ce qu'il n'a pas écrit.
 */
function pinsIntervalProfile(spec: ExerciseSpec): boolean {
  const c = (spec.constraints ?? {}) as Record<string, unknown>;
  return c.minPerfectIntervalRatio !== undefined
    || c.minConjunctRatio !== undefined
    || c.maxConjunctRatio !== undefined
    || c.givenCellAsMotif === true;
}

function melodyCraft(analysis: AnalysisBundle, spec: ExerciseSpec): CraftResult {
  const mood = targetMoodOf(spec);
  const line = topLine(analysis.notes);
  const components: CraftComponent[] = [];

  // 1. Le motif DÉVELOPPÉ : couverture ET variété des types d'occurrence.
  //    Les deux s'ADDITIONNENT au lieu de se multiplier : un thème qui énonce
  //    sa cellule quatre fois à l'identique EST construit, même s'il ne la
  //    transforme pas — la multiplication le plafonnait à 0,33 et notait 0,31
  //    en moyenne un corpus de thèmes vérifiés un par un.
  const best = analysis.motifs?.bestMotif ?? null;
  if (best && line.length > 0) {
    const covered = Math.min(line.length, best.occurrences.length * best.length);
    const coverage = covered / line.length;
    const kinds = new Set(best.occurrences.map(o => o.sub ?? o.kind));
    const variety = Math.min(1, kinds.size / 2);
    components.push(comp(
      'motif-development',
      'le motif est développé, pas répété',
      0.6 * coverage + 0.4 * variety,
      `${best.occurrences.length} occurrence(s) couvrant ${Math.round(coverage * 100)} % de la ligne, ${kinds.size} type(s) de transformation`,
    ));
  }
  // Aucun motif : ce n'est pas une composante à zéro, c'est `melody.no-motif`
  // qui parle — sanctionner deux fois la même chose est une double peine.

  // 2. L'arche PROMISE par l'ambiance, tenue par la courbe. Seulement si une
  //    ambiance est visée : sans promesse, il n'y a rien à tenir.
  if (analysis.tension && analysis.tension.length > 0 && spec.styleProfile?.targetMood !== undefined) {
    const fit = normalizedArchFit(analysis.tension, mood);
    components.push(comp(
      'arch-fit',
      `la courbe tient la promesse de l'ambiance « ${mood} »`,
      fit.value,
      `archFit ${fit.raw.toFixed(2)} (régime ${fit.regime})`,
    ));
  }

  // 3. Conjoint/disjoint dans la norme du style — quand c'est bien le STYLE
  //    qui fixe la norme, et pas la consigne.
  if (!pinsIntervalProfile(spec)) {
    const steps = conjunctRatio(line);
    const band = STEP_BAND[mood] ?? STEP_BAND.default!;
    components.push(comp(
      'step-leap-balance',
      'la ligne alterne degrés et sauts dans la norme du style',
      inBand(steps, band),
      `${Math.round(steps * 100)} % de degrés conjoints (norme ${Math.round(band[0] * 100)}–${Math.round(band[1] * 100)} %)`,
    ));
  }

  // 4. La prosodie : les valeurs longues tombent-elles sur les appuis ?
  if (analysis.rhythm) {
    const prosody = (analysis.rhythm.prosodyCorrelation + 1) / 2;
    components.push(comp(
      'prosody',
      'les valeurs longues tombent sur les appuis',
      prosody,
      `corrélation prosodique ${analysis.rhythm.prosodyCorrelation.toFixed(2)}`,
    ));
  }

  return result(components);
}

// ---------------------------------------------------------------------------
// HARMONY_PROGRESSION / HARMONIZE_MELODY
// ---------------------------------------------------------------------------

/**
 * **`vl.smoothness` — la métrique que le corpus nomme et que rien ne mesurait.**
 *
 * Treize specs la citent (`craftMultipliersOverride: {"vl.smoothness": 1.8}`,
 * `smoothnessMaxPerVoice`, listes de `checkers`) et elle n'existait nulle part
 * dans le moteur. Sur `m01-e26` et `m01-e36`, la consigne va jusqu'à écrire
 * « Objectif mesuré : le voice leading des guide tones — mouvement minimal,
 * notes communes tenues », et les `authorNotes` de `m01-s36` donnent le chiffre
 * attendu : « smoothness ≈ 0.5 dt/voix/transition (hors basse) ✓ ».
 *
 * Hors basse, précisément : dans un voicing de guide tones, la basse SAUTE par
 * quintes — c'est sa fonction, et c'est même la consigne. Ce qui doit glisser,
 * ce sont les voix qui portent la tierce et la septième.
 */
function caresAboutSmoothness(spec: ExerciseSpec): boolean {
  const c = (spec.constraints ?? {}) as Record<string, unknown>;
  const overrides = (spec.craftMultipliersOverride ?? {}) as Record<string, unknown>;
  return c.guideToneVoicing === true
    || c.smoothnessMaxPerVoice !== undefined
    || overrides['vl.smoothness'] !== undefined;
}

/**
 * Le déplacement moyen, en demi-tons, d'une voix supérieure d'un accord au
 * suivant. La basse est exclue : elle ne conduit pas, elle fonde.
 */
function upperVoiceSmoothness(voices: readonly (readonly Note[])[]): number | null {
  if (voices.length < 2) return null;
  // La basse = la voix dont la hauteur moyenne est la plus grave.
  const ranked = [...voices]
    .filter(v => v.length >= 2)
    .sort((a, b) => avg(a.map(n => n.pitch)) - avg(b.map(n => n.pitch)));
  const upper = ranked.slice(1);
  if (upper.length === 0) return null;
  const steps: number[] = [];
  for (const voice of upper) {
    const line = [...voice].sort((a, b) => a.start - b.start);
    for (let i = 1; i < line.length; i++) steps.push(Math.abs(line[i]!.pitch - line[i - 1]!.pitch));
  }
  return steps.length === 0 ? null : avg(steps);
}

/**
 * La consigne CLOUE-t-elle la basse ? Un voicing de guide tones met la
 * fondamentale seule à gauche ; une basse obstinée, un lamento, une pédale sont
 * écrits d'avance. Récompenser une « basse chantante » là où la consigne
 * interdit qu'elle chante, ce serait noter l'exercice qu'on aurait aimé donner
 * — la même faute que `caresAboutIdioms` évite dans l'autre sens.
 */
function bassIsPinned(spec: ExerciseSpec): boolean {
  const c = (spec.constraints ?? {}) as Record<string, unknown>;
  return c.guideToneVoicing === true
    || c.groundBass !== undefined
    || c.lamentBass !== undefined
    || c.staticBassBars !== undefined;
}

/** La consigne parle-t-elle d'idiomes, d'enrichissement, de chromatisme ? */
function caresAboutIdioms(spec: ExerciseSpec): boolean {
  const c = (spec.constraints ?? {}) as Record<string, unknown>;
  return c.requireIdiom !== undefined
    || c.minEnrichedChords !== undefined
    || c.requiredIdioms !== undefined
    || c.minSubstitutions !== undefined
    || c.borrowedChords !== undefined
    || c.innerChromaticLine !== undefined;
}

function harmonyCraft(analysis: AnalysisBundle, spec: ExerciseSpec, issueIds: readonly string[], tracksVoices: boolean): CraftResult {
  const components: CraftComponent[] = [];
  const chords = analysis.chords ?? [];

  // 1. La conduite propre — bonus ZÉRO-PARALLÈLE : c'est tout ou presque rien,
  //    parce qu'une seule quinte parallèle s'entend, et qu'on l'entend.
  //
  //    Sur une texture à densité variable (décision n°32), aucune ligne n'est
  //    tracée : les familles `vl.*` ne tournent pas. Un « zéro parallélisme »
  //    y serait un point gratuit — récompenser une propreté qu'on n'a pas
  //    regardée. On ne mesure pas, donc on ne note pas.
  if (tracksVoices) {
    const parallels = issueIds.filter(id => id === 'vl.parallel-perfects' || id === 'vl.direct-perfect').length;
    components.push(comp(
      'clean-voice-leading',
      'la conduite est propre de bout en bout',
      parallels === 0 ? 1 : clamp01(1 - parallels / Math.max(4, chords.length)),
      parallels === 0 ? 'aucun parallélisme de quinte ou d\'octave' : `${parallels} parallélisme(s)`,
    ));
  }

  // 2. La variété des POSITIONS. On compte les positions DISTINCTES employées,
  //    pas une part d'accords renversés : un laboratoire de cadences écrit en
  //    fondamentale avec un seul I⁶ à l'endroit voulu fait exactement ce qu'on
  //    lui demande, et un ratio l'aurait noté 0,1.
  if (chords.length >= 3) {
    const positions = new Set(chords.map(c => c.chord.inversion));
    components.push(comp(
      'inversion-variety',
      'les renversements font respirer la basse',
      Math.min(1, positions.size / 2),
      `${positions.size} position(s) distincte(s) employée(s) sur ${chords.length} accords`,
    ));
  }

  // 3. Les IDIOMES tagués — mais SEULEMENT si la consigne en demande. Une
  //    progression diatonique n'a aucun idiome à exploiter ; lui en réclamer,
  //    c'est noter l'exercice qu'on aurait aimé donner.
  if (caresAboutIdioms(spec)) {
    const families = new Set((analysis.idioms ?? []).map(t => t.id));
    components.push(comp(
      'idioms-used',
      'le vocabulaire idiomatique est exploité',
      families.size === 0 ? 0 : 1,
      families.size === 0 ? 'aucun idiome tagué' : `${families.size} idiome(s) : ${[...families].join(', ')}`,
    ));
  }

  // 4. Le MOUVEMENT MINIMAL, quand la consigne en fait l'objet de l'exercice.
  if (caresAboutSmoothness(spec)) {
    const moved = analysis.voices ? upperVoiceSmoothness(analysis.voices) : null;
    if (moved !== null) {
      components.push(comp(
        'voice-smoothness',
        'les voix supérieures glissent au lieu de sauter',
        inBand(moved, [0, 1.5], 2.5),
        `${moved.toFixed(2)} demi-ton(s) par voix et par transition, basse exclue`,
      ));
    }
  }

  // 5. La BASSE CHANTANTE (F-26 réutilisé) : le contour de la voix grave. La
  //    fourchette est large — une basse de choral saute par quartes et quintes
  //    aux cadences, c'est sa fonction, pas un défaut de ligne.
  const bass = bassLine(analysis.notes);
  if (!bassIsPinned(spec) && bass.length >= 2) {
    const steps = conjunctRatio(bass);
    components.push(comp(
      'singing-bass',
      'la basse est une ligne, pas une suite de fondamentales',
      inBand(steps, [0.20, 0.90], 0.3),
      `${Math.round(steps * 100)} % de mouvements conjoints à la basse`,
    ));
  }

  return result(components);
}

// ---------------------------------------------------------------------------
// COUNTERPOINT
// ---------------------------------------------------------------------------

function counterpointCraft(analysis: AnalysisBundle): CraftResult | null {
  const voices = analysis.voices;
  if (!voices || voices.length < 2) return null;
  const components: CraftComponent[] = [];

  // 1. L'INDÉPENDANCE : part des mouvements contraires ou obliques.
  const a = [...voices[0]!].sort((x, y) => x.start - y.start);
  const b = [...voices[1]!].sort((x, y) => x.start - y.start);
  const pairs = Math.min(a.length, b.length);
  let independent = 0;
  let motions = 0;
  const imperfect: boolean[] = [];
  for (let i = 1; i < pairs; i++) {
    const da = a[i]!.pitch - a[i - 1]!.pitch;
    const db = b[i]!.pitch - b[i - 1]!.pitch;
    motions++;
    if (da === 0 || db === 0 || da * db < 0) independent++;
  }
  for (let i = 0; i < pairs; i++) {
    const iv = ((Math.abs(a[i]!.pitch - b[i]!.pitch) % 12) + 12) % 12;
    imperfect.push(iv === 3 || iv === 4 || iv === 8 || iv === 9);
  }
  components.push(comp(
    'independence',
    'les deux voix restent deux voix',
    motions === 0 ? 0 : independent / motions,
    `${independent}/${motions} mouvements contraires ou obliques`,
  ));

  // 2. Les grappes d'imparfaites : au-delà de trois, les voix se doublent.
  let run = 0;
  let worst = 0;
  for (const isImperfect of imperfect) {
    run = isImperfect ? run + 1 : 0;
    worst = Math.max(worst, run);
  }
  components.push(comp(
    'imperfect-clusters',
    'aucune grappe de tierces ou de sixtes ne dépasse trois',
    worst <= 3 ? 1 : clamp01(1 - (worst - 3) / 4),
    `plus longue grappe d'imparfaites : ${worst}`,
  ));

  return result(components);
}

// ---------------------------------------------------------------------------
// LAYERING / ORCHESTRATE
// ---------------------------------------------------------------------------

const LAYER_ROLES = ['sub', 'body', 'top', 'texture', 'movement'] as const;

function layeringCraft(submission: Submission | undefined): CraftResult | null {
  if (submission?.kind !== 'layers') return null;
  const layers = submission.stack.layers as unknown as Record<string, unknown>[];
  const components: CraftComponent[] = [];

  const roles = new Set(layers.map(l => String(l.role)));
  const covered = LAYER_ROLES.filter(r => roles.has(r)).length;
  components.push(comp(
    'role-coverage',
    'les rôles du tableau sont tous pourvus',
    covered / LAYER_ROLES.length,
    `${covered}/${LAYER_ROLES.length} rôles présents`,
  ));

  const banded = layers.filter(l => l.band && typeof l.band === 'object').length;
  components.push(comp(
    'band-discipline',
    'chaque couche déclare sa bande',
    layers.length === 0 ? 0 : banded / layers.length,
    `${banded}/${layers.length} couches avec bande déclarée`,
  ));

  // `removed` ARGUMENTÉ : la couche retirée doit dire pourquoi, en une phrase
  // — un `removed: "trop"` ne vaut rien, c'est le raisonnement qui s'apprend.
  const removed = layers.filter(l => typeof l.removed === 'string');
  const argued = removed.filter(l => (l.removed as string).length >= 40).length;
  components.push(comp(
    'removed-argued',
    'ce qui a été retiré est argumenté',
    removed.length === 0 ? 0 : argued / removed.length,
    removed.length === 0 ? 'aucune couche retirée' : `${argued}/${removed.length} retraits argumentés`,
  ));

  return result(components);
}

function orchestrateCraft(analysis: AnalysisBundle): CraftResult | null {
  const parts = analysis.parts;
  if (!parts || parts.length === 0) return null;
  const components: CraftComponent[] = [];

  const named = parts.filter(p => p.instrumentId && p.instrumentId !== 'unknown').length;
  components.push(comp(
    'role-plan',
    'chaque partie porte son instrument',
    named / parts.length,
    `${named}/${parts.length} parties instrumentées`,
  ));

  // dyn[] VIVANTE : une nuance plate est une nuance absente. On mesure la
  // variance des points, pas leur présence.
  const withDyn = parts.filter(p => (p.dyn?.length ?? 0) >= 2);
  const lively = withDyn.filter(p => {
    const values = p.dyn!.map(d => d.value);
    return Math.max(...values) - Math.min(...values) >= 8;
  }).length;
  components.push(comp(
    'dynamics-alive',
    'les nuances bougent',
    parts.length === 0 ? 0 : lively / parts.length,
    `${lively}/${parts.length} parties à nuance vivante`,
  ));

  // La densité ÉTAGÉE : les parties ne se superposent pas toutes au même endroit.
  const centers = parts
    .filter(p => p.notes.length > 0)
    .map(p => avg(p.notes.map(n => n.pitch)));
  const spread = centers.length < 2 ? 0 : Math.max(...centers) - Math.min(...centers);
  components.push(comp(
    'density-tiered',
    'les registres sont étagés',
    inBand(spread / 12, [1, 4], 1),
    `${spread.toFixed(1)} demi-tons entre le centre le plus grave et le plus aigu`,
  ));

  return result(components);
}

// ---------------------------------------------------------------------------

/**
 * Le craft d'une soumission. `null` = ce kind ne se juge pas positivement ici
 * (DAW_MISSION, ANALYSIS, THEORY_QUIZ) : le poids sera redistribué.
 */
export function computeCraft(
  kind: string | undefined,
  analysis: AnalysisBundle,
  spec: ExerciseSpec,
  opts: { issueIds?: readonly string[]; submission?: Submission } = {},
): CraftResult | null {
  switch (kind) {
    case 'MELODY_COMPOSE':
      return melodyCraft(analysis, spec);
    case 'HARMONY_PROGRESSION':
    case 'CHORD_PROGRESSION':
    case 'HARMONIZE_MELODY':
      return harmonyCraft(analysis, spec, opts.issueIds ?? [], opts.submission?.kind !== 'harmony');
    case 'COUNTERPOINT':
      return counterpointCraft(analysis);
    case 'LAYERING':
      return layeringCraft(opts.submission);
    case 'ORCHESTRATE':
    case 'ARRANGEMENT':
      return orchestrateCraft(analysis);
    default:
      // DAW_MISSION, ANALYSIS, THEORY_QUIZ, EAR_QUIZ : le craft vit dans leurs
      // checkers de preuve et dans la concordance, pas dans une note inventée.
      return null;
  }
}
