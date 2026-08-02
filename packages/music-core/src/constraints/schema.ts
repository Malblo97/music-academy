/**
 * `constraints/schema.ts` — le registre des CLÉS DE CONTRAINTES (annexe C).
 *
 * Deux services : (1) déclarer toutes les clés que les specs ont le droit
 * d'employer, avec leur forme attendue — une clé inconnue dans une spec est une
 * faute de frappe, pas une fonctionnalité ; (2) donner à chacune un checker,
 * via `checkers/index.ts`.
 *
 * **Choix de dépendance** : le tutoriel écrit « le Zod de l'annexe C ».
 * `music-core` n'a AUCUNE dépendance d'exécution — c'est ce qui le garde
 * isomorphe (D-T2) — et la validation dont on a besoin ici tient en une
 * douzaine de formes. On la fait à la main plutôt que d'ouvrir la porte aux
 * dépendances dans le moteur livré. Si Zod devient nécessaire ailleurs, ce
 * fichier est le seul à réécrire.
 */

export type ConstraintGroup = 'general' | 'melody' | 'harmony' | 'structure' | 'plans' | 'performance' | 'orchestration' | 'sd';

/** Formes acceptées, vérifiées à l'exécution. */
export type ConstraintShape =
  | 'number' | 'boolean' | 'string'
  | 'numbers' | 'strings'
  | 'range' // [min, max]
  | 'object' | 'array' | 'any';

export interface ConstraintSpec {
  group: ConstraintGroup;
  shape: ConstraintShape;
  /** Ce que la clé EXIGE, en une ligne — c'est ce que lira l'auteur de specs. */
  description: string;
}

function s(group: ConstraintGroup, shape: ConstraintShape, description: string): ConstraintSpec {
  return { group, shape, description };
}

/**
 * Les 162 clés employées par les specs de M1, M2, M5 et M9 — le périmètre du
 * verrou n°1. Les autres modules en ajoutent ~300 : elles s'ajouteront ici au
 * fur et à mesure que leur verrou s'ouvrira.
 */
export const CONSTRAINT_SCHEMA: Record<string, ConstraintSpec> = {
  // ---------------------------------------------------------------- général
  key: s('general', 'object', 'la tonalité imposée : { tonic, mode }'),
  keys: s('general', 'array', 'plusieurs tonalités successives (pièce à modulations)'),
  startKey: s('general', 'object', 'tonalité de départ d\'une modulation'),
  targetKey: s('general', 'object', 'tonalité d\'arrivée d\'une modulation'),
  lengthBars: s('general', 'range', 'longueur en mesures [min, max]'),
  noteRange: s('general', 'range', 'ambitus absolu autorisé, en MIDI [grave, aigu]'),
  register: s('general', 'any', 'registre visé, par nom ou par bornes'),
  segmentBars: s('general', 'any', 'découpage en segments, en mesures'),
  structure: s('general', 'any', 'plan formel attendu (A/A\', couplet-refrain…)'),
  voices: s('general', 'number', 'nombre de voix attendu'),
  minVoices: s('general', 'number', 'nombre minimal de voix simultanées'),
  maxVoices: s('general', 'number', 'nombre maximal de voix simultanées'),
  tempoRange: s('general', 'range', 'fourchette de tempo en BPM'),
  role: s('general', 'string', 'rôle assigné à la partie (mélodie, tapis, basse…)'),
  checkers: s('general', 'strings', 'checkers explicitement exigés par la consigne'),
  mustInclude: s('general', 'any', 'éléments dont la présence est obligatoire'),

  // ---------------------------------------------------------------- mélodie
  mustUseMotif: s('melody', 'boolean', 'une cellule doit revenir'),
  minMotifOccurrences: s('melody', 'number', 'nombre minimal d\'énoncés COMPLETS du motif (F-13)'),
  requireMotifVariation: s('melody', 'boolean', 'au moins un énoncé transformé'),
  requiredVariationTypes: s('melody', 'strings', 'types de variation exigés (transposed, rhythmic, inverted…)'),
  minMotifCoverage: s('melody', 'number', 'part minimale de la pièce couverte par le motif'),
  givenCellAsMotif: s('melody', 'boolean', 'la cellule fournie doit servir de motif'),
  motifType: s('melody', 'string', 'archétype de cellule attendu'),
  allowedTransformations: s('melody', 'strings', 'transformations autorisées, les autres sont refusées'),
  minTransformations: s('melody', 'number', 'nombre minimal de transformations distinctes'),
  requireFragmentation: s('melody', 'boolean', 'le motif doit être fragmenté (F-13 : dimensionne minMotifOccurrences)'),
  requireSequence: s('melody', 'boolean', 'au moins une séquence (le même dessin transposé)'),
  sequenceMaxRun: s('melody', 'number', 'longueur maximale d\'une marche avant rupture'),
  patternThenDeviation: s('melody', 'any', 'un motif installé puis brisé, à l\'endroit déclaré'),
  patternBars: s('melody', 'any', 'mesures où le motif doit être en place'),
  signalFigure: s('melody', 'any', 'figure-signal à exposer'),
  contourShape: s('melody', 'strings', 'silhouettes admises (arch, descent, ascent, wave, plateau)'),
  ascendingPhrasePeaks: s('melody', 'boolean', 'les sommets de phrase doivent croître'),
  climaxWindow: s('melody', 'range', 'fenêtre de position du climax, en fraction de la pièce'),
  climaxMinDuration: s('melody', 'number', 'durée minimale de la note de climax, en ticks'),
  climaxApproachLeap: s('melody', 'number', 'saut minimal d\'approche du climax'),
  climaxLeapDirection: s('melody', 'string', 'direction du saut d\'approche du climax'),
  requiredClimaxLeap: s('melody', 'any', 'saut exigé au climax'),
  ambitusMax: s('melody', 'number', 'ambitus maximal de la ligne, en demi-tons'),
  maxLeap: s('melody', 'number', 'saut mélodique maximal, en demi-tons'),
  minConjunctRatio: s('melody', 'number', 'part minimale de mouvements conjoints'),
  maxDistinctPitches: s('melody', 'number', 'nombre maximal de hauteurs distinctes'),
  melodyMaxDistinctPitches: s('melody', 'number', 'idem, restreint à la voix mélodique'),
  minAvgDuration: s('melody', 'number', 'durée moyenne minimale des notes, en ticks'),
  melodyMinAvgDuration: s('melody', 'any', 'idem, restreint à la voix mélodique — ticks ou lettre de durée'),
  minNoteDuration: s('melody', 'any', 'durée minimale d\'une note — en ticks, ou en lettre de durée (« h »)'),
  minRestRatio: s('melody', 'number', 'part minimale de silence'),
  maxPhraseNotes: s('melody', 'number', 'nombre maximal de notes par phrase'),
  minPerfectIntervalRatio: s('melody', 'number', 'part minimale d\'intervalles parfaits'),
  mustContainInterval: s('melody', 'numbers', 'intervalles dont au moins un doit figurer'),
  intervalDirection: s('melody', 'string', 'direction imposée à cet intervalle'),
  mustExposeDegrees: s('melody', 'numbers', 'degrés à exposer'),
  minExposureCount: s('melody', 'number', 'nombre minimal d\'expositions de ces degrés'),
  mustEndOnDegrees: s('melody', 'numbers', 'degrés admis pour la note finale'),
  strongBeatDegrees: s('melody', 'numbers', 'degrés admis sur les temps forts'),
  targetOnStrongBeat: s('melody', 'any', 'la cible doit tomber sur un temps fort'),
  requireLeadingToneBeforeFinal: s('melody', 'boolean', 'la sensible doit précéder la finale'),
  forbidLeadingTone: s('melody', 'boolean', 'la sensible est proscrite (écriture modale)'),
  minChromaticFigures: s('melody', 'number', 'nombre minimal de figures chromatiques'),
  chromaticResolutionRequired: s('melody', 'boolean', 'chaque chromatisme doit se résoudre'),
  requireChromaticDrift: s('melody', 'object', 'dérive chromatique { everyBars, semitones }'),
  flatTension: s('melody', 'boolean', 'la courbe de tension doit rester plate'),
  requireAmbiguousKey: s('melody', 'boolean', 'la tonalité doit rester ambiguë (F-11 : sur les 24 profils bruts)'),
  syncopationTarget: s('melody', 'range', 'fourchette de taux de syncope'),
  samePitchSequenceAsGiven: s('melody', 'any', 'la suite de hauteurs du donné doit être conservée (F-17 si transposed)'),
  prosodyPlan: s('melody', 'any', 'plan de déclamation par section'),
  requireAnacrusis: s('melody', 'boolean', 'la phrase doit commencer en anacrouse'),
  anacrusisPolicy: s('melody', 'string', 'politique d\'anacrouse (constante, variable…)'),
  phraseStructure: s('melody', 'string', 'structure de phrase attendue (period, sentence)'),
  antecedentEndDegrees: s('melody', 'numbers', 'degrés admis à la fin de l\'antécédent'),
  minElisions: s('melody', 'number', 'nombre minimal d\'élisions'),
  maxElisions: s('melody', 'number', 'nombre maximal d\'élisions'),
  phraseBarPlan: s('melody', 'any', 'découpage des phrases, en mesures'),
  requireRestAtBar: s('melody', 'any', 'silence obligatoire à ces mesures'),
  requireSilenceBeforeBar: s('melody', 'any', 'silence obligatoire avant cette mesure'),
  requireSilentStrongBeat: s('melody', 'any', 'un temps fort doit rester vide'),
  silenceBeats: s('melody', 'any', 'temps devant rester silencieux'),
  interruptionBeats: s('melody', 'any', 'temps d\'interruption imposés'),
  singleLeadVoice: s('melody', 'boolean', 'une seule voix porte la mélodie'),
  octaveUnison: s('melody', 'any', 'doublure à l\'octave ou à l\'unisson'),

  // -------------------------------------------------------------- harmonie
  requiredCadence: s('harmony', 'string', 'cadence exigée à la fin'),
  requiredCadences: s('harmony', 'any', 'cadences exigées, par emplacement'),
  finalCadence: s('harmony', 'string', 'nature de la cadence finale'),
  forbiddenCadences: s('harmony', 'strings', 'cadences proscrites'),
  forbiddenCadencesBefore: s('harmony', 'any', 'cadences proscrites avant un point donné'),
  forbiddenCadencesBeforeBar: s('harmony', 'number', 'aucune cadence avant cette mesure'),
  requireEstablishingCadence: s('harmony', 'boolean', 'une cadence doit établir le ton au début'),
  requireConfirmingCadence: s('harmony', 'any', 'une cadence doit confirmer l\'arrivée — `true`, ou la nature attendue'),
  penultimateDegrees: s('harmony', 'numbers', 'degrés admis pour l\'avant-dernier accord'),
  functionPlan: s('harmony', 'any', 'suite de fonctions T/S/D attendue'),
  requiredProgressionPattern: s('harmony', 'any', 'motif de progression imposé'),
  requirePlainTriadCount: s('harmony', 'range', 'nombre de triades nues [min, max]'),
  minEnrichedChords: s('harmony', 'number', 'nombre minimal d\'accords enrichis'),
  forbidEnrichmentOnDegrees: s('harmony', 'numbers', 'degrés qui restent nus'),
  forbidChordQualitiesOnDegrees: s('harmony', 'object', 'qualités proscrites, par degré'),
  allowedColors: s('harmony', 'strings', 'enrichissements autorisés'),
  allowedOnV: s('harmony', 'strings', 'ce qui est permis sur la dominante'),
  innerChromaticLine: s('harmony', 'numbers', 'ligne chromatique interne imposée, en degrés'),
  guideToneVoicing: s('harmony', 'any', 'voicing par guide tones (F-4 : les doublures ne consomment pas le quota)'),
  guideToneTargets: s('harmony', 'any', 'cibles de guide tones (seuil 0.6)'),
  harmonizationVariants: s('harmony', 'any', 'plusieurs harmonisations d\'une même ligne'),
  structuralNotesCovered: s('harmony', 'any', 'les notes structurelles doivent être harmonisées'),
  mustKeepOneNaturalDominant: s('harmony', 'boolean', 'au moins une dominante non substituée (le contraste porte/couloir)'),
  minSubstitutions: s('harmony', 'number', 'nombre minimal de substitutions'),
  maxBorrowedChords: s('harmony', 'number', 'nombre maximal d\'emprunts'),
  mustKeepChordFunctions: s('harmony', 'any', 'les fonctions doivent être préservées'),
  commonToneThread: s('harmony', 'boolean', 'un fil de note commune traverse la progression (F-7)'),
  allMediantsMajor: s('harmony', 'boolean', 'toutes les médiantes en majeur'),
  modulationType: s('harmony', 'string', 'type de modulation attendu'),
  seamChord: s('harmony', 'any', 'accord de couture d\'une boucle'),
  loopReturnChord: s('harmony', 'any', 'accord qui referme la boucle'),
  loopBarsLength: s('harmony', 'number', 'longueur de la boucle, en mesures'),
  loopTours: s('harmony', 'number', 'nombre de tours de boucle'),
  maxDistinctChordsPerTour: s('harmony', 'number', 'nombre maximal d\'accords distincts par tour'),
  maxLoopChords: s('harmony', 'number', 'nombre maximal d\'accords dans la boucle'),
  staticRootBars: s('harmony', 'any', 'mesures à fondamentale immobile'),
  staticRootPc: s('harmony', 'number', 'pitch-class de cette fondamentale'),
  endWithoutResolution: s('harmony', 'boolean', 'la pièce ne doit pas résoudre'),
  endType: s('harmony', 'strings', 'natures de fin admises'),
  finalMove: s('harmony', 'string', 'dernier mouvement harmonique imposé'),
  chordToneRatioMin: s('harmony', 'number', 'part minimale de notes d\'accord dans la ligne'),
  closedPositionRequired: s('harmony', 'boolean', 'position serrée obligatoire'),
  voicingSpread: s('harmony', 'any', 'étalement des voicings'),
  minDistinctVoicings: s('harmony', 'number', 'nombre minimal de voicings distincts'),
  intervalWithMelody: s('harmony', 'any', 'intervalle imposé avec la mélodie'),
  screwVoice: s('harmony', 'any', 'la voix qui visse (mouvement contraire tenu)'),

  // -------------------------------------------------------------- structure
  expositionPlan: s('structure', 'any', 'plan d\'exposition par sections'),
  codaBars: s('structure', 'number', 'longueur de la coda, en mesures'),
  codaMaxVoices: s('structure', 'number', 'voix maximales dans la coda'),
  codaVelocityDelta: s('structure', 'number', 'écart de vélocité imposé à la coda'),
  finalTextureDelta: s('structure', 'number', 'variation de texture à la fin'),
  restatementTransposition: s('structure', 'any', 'transposition de la reprise'),
  restatementMinVoicesDelta: s('structure', 'number', 'voix ajoutées à la reprise'),
  restatementVelocityDelta: s('structure', 'number', 'écart de vélocité à la reprise'),
  restatementBorrowedIv: s('structure', 'any', 'iv emprunté dans la reprise'),
  eventMaxBars: s('structure', 'number', 'durée maximale d\'un événement'),
  maxTextureEvents: s('structure', 'number', 'nombre maximal d\'événements de texture'),
  postEventTightening: s('structure', 'any', 'resserrement après l\'événement'),
  ostinatoRequired: s('structure', 'boolean', 'un ostinato doit être présent'),
  ostinatoBarsLength: s('structure', 'any', 'longueur de l\'ostinato, en mesures — valeur ou fourchette'),
  ostinatoInvariant: s('structure', 'any', 'ce qui ne doit pas changer dans l\'ostinato'),
  ostinatoMaxDistinctPitches: s('structure', 'number', 'hauteurs distinctes de l\'ostinato'),
  ostinatoRegisterMax: s('structure', 'number', 'registre maximal de l\'ostinato'),
  requireOstinatoInterruption: s('structure', 'any', 'l\'ostinato doit être interrompu'),
  tempoDriftBpmPer8Bars: s('structure', 'any', 'dérive de tempo tolérée par 8 mesures — plafond ou fourchette'),

  // ------------------------------------------------------------------ plans
  layerPlan: s('plans', 'any', 'plan de couches déclaré'),
  maxActiveLayers: s('plans', 'number', 'couches actives simultanées'),
  rolePlan: s('plans', 'any', 'répartition des rôles par section'),
  dynamicsPlan: s('plans', 'any', 'plan de nuances'),
  densityMapCheck: s('plans', 'boolean', 'la carte de densité doit être vérifiée'),

  // ------------------------------------------------------ orchestration / jeu
  instrumentRanges: s('orchestration', 'any', 'tessitures imposées par instrument'),
  noNotesBelowPitch: s('orchestration', 'number', 'aucune note sous cette hauteur'),
  lowIntervalLimitPc: s('orchestration', 'any', 'limite d\'intervalle dans le grave'),
  sweetSpot: s('orchestration', 'any', 'registre de prédilection à respecter'),
  highNotePolicy: s('orchestration', 'any', 'politique pour les notes aiguës'),
  divisiDeclarationRequired: s('orchestration', 'boolean', 'les divisi doivent être déclarés'),
  unisonMinPlayers: s('orchestration', 'number', 'effectif minimal à l\'unisson'),
  articulation: s('performance', 'string', 'articulation imposée'),
  forbidFastRuns: s('orchestration', 'object', 'traits rapides proscrits'),
  bassContour: s('melody', 'string', 'contour imposé à la basse'),
  bassMaxLeap: s('melody', 'number', 'saut maximal de la basse'),
  bassIntervalPreference: s('melody', 'numbers', 'intervalles préférés à la basse'),
  minBassConjunctRatio: s('melody', 'number', 'part minimale de conjoint à la basse'),
};

export interface SchemaError {
  key: string;
  message: string;
}

function shapeOk(shape: ConstraintShape, value: unknown): boolean {
  switch (shape) {
    case 'number': return typeof value === 'number';
    case 'boolean': return typeof value === 'boolean';
    case 'string': return typeof value === 'string';
    case 'numbers': return Array.isArray(value) && value.every(v => typeof v === 'number');
    case 'strings': return Array.isArray(value) && value.every(v => typeof v === 'string');
    case 'range': return Array.isArray(value) && value.length === 2 && value.every(v => typeof v === 'number');
    case 'array': return Array.isArray(value);
    case 'object': return typeof value === 'object' && value !== null && !Array.isArray(value);
    case 'any': return true;
  }
}

/**
 * Valide un bloc `constraints`. Une clé absente du registre est une ERREUR :
 * c'est presque toujours une faute de frappe, et une contrainte mal orthographiée
 * ne serait jamais vérifiée — le pire des silences.
 */
export function validateConstraints(constraints: Record<string, unknown>): SchemaError[] {
  const errors: SchemaError[] = [];
  for (const [key, value] of Object.entries(constraints)) {
    const spec = CONSTRAINT_SCHEMA[key];
    if (!spec) {
      errors.push({ key, message: `clé de contrainte inconnue « ${key} » — registre : constraints/schema.ts` });
      continue;
    }
    if (!shapeOk(spec.shape, value)) {
      errors.push({ key, message: `« ${key} » attend ${spec.shape}, reçu ${Array.isArray(value) ? 'array' : typeof value}` });
    }
  }
  return errors;
}

export function constraintKeys(): string[] {
  return Object.keys(CONSTRAINT_SCHEMA).sort();
}
