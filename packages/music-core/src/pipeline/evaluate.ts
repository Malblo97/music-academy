import { ENGINE_VER } from '../version.js';
import type { Meter, Mode, Note, Part, Submission } from '../types.js';
import type { AnalysisBundle, EvalWindow, ExerciseSpec, RuleCtx } from '../rules/types.js';
import { melodicLine } from '../rules/types.js';
import { estimateKey } from '../analyzers/key.js';
import type { KeyEstimate } from '../analyzers/key.js';
import { detectCollection } from '../analyzers/collection.js';
import { detectChord } from '../analyzers/chord.js';
import { tagIdioms } from '../analyzers/idioms.js';
import type { Vertical } from '../analyzers/idioms.js';
import { detectCadences } from '../analyzers/cadence.js';
import type { TimedChord } from '../analyzers/cadence.js';
import { findMotifs } from '../analyzers/motifs.js';
import { contour } from '../analyzers/contour.js';
import { phraseAnalysis } from '../analyzers/phrase.js';
import { rhythmProfile, barTicks } from '../analyzers/rhythm.js';
import { climaxSalience, tensionCurve } from '../analyzers/tension.js';
import { markGivenTicks } from '../constraints/window.js';
import { checkConstraints } from '../constraints/checkers/index.js';
import type { ConstraintReport } from '../constraints/checkers/index.js';
import { runRules } from '../rules/registry.js';
import { REGISTRY } from '../rules/registry.js';
import { profileFlag } from '../rules/profiles.js';
import { computeCraft } from './craft.js';
import type { CraftResult } from './craft.js';
import { computeScore, rubricOf } from './scoring.js';
import type { Rubric, ScoredConstraint, WeightedIssue } from './scoring.js';
import { buildFeedback } from './feedback.js';
import type { FeedbackReport } from './feedback.js';

/**
 * `pipeline/evaluate.ts` — LA FONCTION-PRODUIT.
 *
 * Tout le moteur converge ici : les analyseurs des semaines 2–3 produisent les
 * FAITS, les checkers de la semaine 4 disent la CONFORMITÉ, les règles portent
 * le JUGEMENT, le craft porte la RÉCOMPENSE, et le rapport porte la PAROLE.
 *
 * L'ordre des huit étapes est contraint, pas décoratif :
 *  - **F-41** : la fenêtre est calculée AVANT toute analyse, sinon on juge le
 *    matériau fourni comme s'il était de l'élève ;
 *  - **F-16** : le tagueur d'idiomes tourne AVANT la classification cadentielle
 *    et avant la conduite des voix — les mêmes notes sont fautives ou nommées
 *    selon qu'un idiome les couvre. Les fixtures `mozart-tagged-info` /
 *    `mozart-untagged-error` verrouillent exactement cette dépendance d'ordre.
 */

export interface EvaluateOpts {
  profileOverride?: string;
  /**
   * **F-35** : sur une solution de référence — une partition, pas une
   * exécution — les clés de performance ne sont pas jugées. Le verrou n°2 pose
   * ce drapeau ; une soumission réelle ne le pose jamais.
   */
  skipPerformance?: boolean;
  /** Métrique de la pièce, si la spec ne la déclare pas. */
  meter?: Meter;
}

// ---------------------------------------------------------------------------
// 1. Validation
// ---------------------------------------------------------------------------

/**
 * Le tutoriel écrit « validation Zod ». `music-core` n'a **aucune dépendance
 * d'exécution** — c'est ce qui le garde isomorphe (D-T2, cf. l'en-tête de
 * `constraints/schema.ts`) — et la validation utile ici tient en vingt lignes.
 * Ce qui compte n'est pas l'outil, c'est l'ÉCHEC BRUYANT : une soumission qui
 * ne correspond pas à son kind doit s'arrêter net, pas produire un 0 muet que
 * l'élève interpréterait comme un jugement musical.
 */
export function validateSubmission(submission: Submission, spec: ExerciseSpec): void {
  const where = `exercice ${spec.id}`;
  const notesOk = (ns: unknown): boolean =>
    Array.isArray(ns) && ns.every(n => n && typeof n === 'object'
      && typeof (n as Note).pitch === 'number'
      && typeof (n as Note).start === 'number'
      && typeof (n as Note).duration === 'number');

  switch (submission.kind) {
    case 'mono':
    case 'harmony':
      if (!notesOk(submission.notes)) throw new Error(`${where} : soumission « ${submission.kind} » sans Note[] valide`);
      return;
    case 'voices':
      if (!Array.isArray(submission.voices) || !submission.voices.every(notesOk)) {
        throw new Error(`${where} : soumission « voices » sans Note[][] valide`);
      }
      if (submission.voices.length < 2) throw new Error(`${where} : « voices » exige au moins deux voix`);
      return;
    case 'parts':
    case 'midi':
      if (!Array.isArray(submission.parts) || !submission.parts.every(p => p && notesOk((p as Part).notes))) {
        throw new Error(`${where} : soumission « ${submission.kind} » sans Part[] valide`);
      }
      return;
    case 'layers':
      if (!submission.stack || !Array.isArray(submission.stack.layers)) {
        throw new Error(`${where} : soumission « layers » sans LayerStack valide`);
      }
      return;
    case 'annotations':
      if (submission.annotations === undefined || submission.annotations === null) {
        throw new Error(`${where} : soumission « annotations » vide`);
      }
      return;
    default: {
      const bad = submission as { kind?: unknown };
      throw new Error(`${where} : kind de soumission inconnu « ${String(bad.kind)} »`);
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Analyseurs
// ---------------------------------------------------------------------------

export function meterOf(spec: ExerciseSpec, fallback: Meter = [4, 4]): Meter {
  const raw = spec.meter;
  if (typeof raw === 'string' && /^\d+\/\d+$/.test(raw)) {
    const [n, d] = raw.split('/').map(Number);
    return [n!, d!];
  }
  if (Array.isArray(raw) && raw.length === 2 && typeof raw[0] === 'number' && typeof raw[1] === 'number') {
    return [raw[0], raw[1]];
  }
  return fallback;
}

/** Les notes d'une soumission, toutes voix/parties confondues. */
export function notesOf(submission: Submission): Note[] {
  switch (submission.kind) {
    case 'mono':
    case 'harmony': return [...submission.notes];
    case 'voices': return submission.voices.flat();
    case 'parts':
    case 'midi': return submission.parts.flatMap(p => [...p.notes]);
    case 'layers': return submission.stack.layers.flatMap(l => [...(l.notes ?? [])]);
    default: return [];
  }
}

/** Découpe en verticalités : une par attaque, toutes voix confondues. */
function verticalsOf(notes: readonly Note[]): Vertical[] {
  if (notes.length === 0) return [];
  const end = notes.reduce((m, n) => Math.max(m, n.start + n.duration), 0);
  const bounds = [...new Set(notes.map(n => n.start))].sort((a, b) => a - b);
  bounds.push(end);
  const out: Vertical[] = [];
  for (let i = 0; i < bounds.length - 1; i++) {
    const from = bounds[i]!;
    const to = bounds[i + 1]!;
    if (to <= from) continue;
    const inside = notes.filter(n => n.start < to && n.start + n.duration > from);
    out.push({ from, to, notes: inside, chord: detectChord(notes, { from, to }) });
  }
  return out;
}

/**
 * **La tonalité DÉCLARÉE par la consigne**, si elle en déclare une.
 *
 * 91 des 97 specs de M1–M3 fixent la tonalité, dans `given.key` ou dans
 * `constraints.key`. C'est un fait de la consigne, pas une inconnue à
 * retrouver : `estimateKey` n'a aucune raison de la redécouvrir, et il s'y
 * trompe précisément là où c'est le plus coûteux — six solutions du corpus,
 * toutes à confiance faible (0,01 à 0,17), dont trois confusions de relatif
 * (ré dorien lu la mineur, do majeur lu la mineur : la bonne collection, le
 * mauvais centre).
 *
 * L'enjeu dépasse la clé elle-même : tonique fausse, TOUT ce qui raisonne en
 * degrés devient faux — les notes hors gamme, la finale attendue, les degrés
 * exposés, la fonction des accords, donc les cadences. Une seule erreur en
 * amont en produisait cinq en aval.
 */
export function declaredKeyOf(spec: ExerciseSpec): { tonic: number; mode: Mode } | null {
  const raw = (spec.given?.key ?? spec.constraints?.key) as { tonic?: unknown; mode?: unknown } | undefined;
  if (!raw || typeof raw.tonic !== 'number') return null;
  const mode = typeof raw.mode === 'string' ? raw.mode as Mode : 'major';
  return { tonic: ((raw.tonic % 12) + 12) % 12, mode };
}

/**
 * **La tonalité d'ARRIVÉE, quand la consigne déclare une modulation.**
 *
 * Une pièce qui module a deux maisons, et la consigne dit laquelle est la
 * seconde — sous deux noms selon le module : `constraints.modulation.to` en M3,
 * `constraints.targetKey` en M1. Ne lire que la première coûtait deux fois sur
 * `m03-e04` (« do majeur → mi♭ majeur », c'est le titre même de l'exercice) :
 * le checker `key` y comptait 18 notes « hors collection » sur 48 — la seconde
 * moitié de la pièce — et `requiredCadence` ne trouvait aucune parfaite, parce
 * qu'il cherchait un sol-do dans une pièce qui finit si♭-mi♭.
 */
export function arrivalKeyOf(spec: ExerciseSpec): { tonic: number; mode: Mode } | null {
  const c = (spec.constraints ?? {}) as Record<string, unknown>;
  const modulation = c.modulation as { to?: unknown } | undefined;
  const raw = (modulation?.to ?? c.targetKey) as { tonic?: unknown; mode?: unknown } | undefined;
  if (!raw || typeof raw.tonic !== 'number') return null;
  const mode = typeof raw.mode === 'string' ? raw.mode as Mode : 'major';
  return { tonic: ((raw.tonic % 12) + 12) % 12, mode };
}

/**
 * **Les frontières de segment**, en ticks — ce que F-5 appelle « la fin d'un
 * segment ».
 *
 * Une cadence ponctue une forme : elle a besoin d'un poids structurel, soit une
 * mesure tenue, soit une frontière. Quand la consigne découpe la pièce
 * (`segmentBars`), chaque frontière est un point de ponctuation légitime — et
 * l'ignorer rend invisibles toutes les cadences internes. Sans découpage
 * déclaré, la seule frontière est la fin de la pièce.
 */
export function segmentEndsOf(spec: ExerciseSpec, meter: Meter, total: number): number[] {
  const declared = spec.constraints?.segmentBars;
  const bars = typeof declared === 'number' && declared > 0 ? declared : null;
  if (bars === null || total === 0) return [total];
  const step = bars * barTicks(meter);
  const ends: number[] = [];
  for (let t = step; t <= total; t += step) ends.push(t);
  if (!ends.includes(total)) ends.push(total);
  return ends;
}

/**
 * L'ORDRE OBLIGATOIRE, et la raison de chaque flèche :
 *
 *   key → collection → verticalités → **idiomes** → accords → cadences → le reste
 *
 * `estimateKey` d'abord parce que tout le reste raisonne en degrés.
 * `detectCollection` ensuite parce qu'une pièce octatonique ne se juge pas dans
 * une tonalité. Puis les verticalités, puis **F-16** : les idiomes sont tagués
 * avant que les cadences ne soient classées et avant que la conduite ne soit
 * jugée — un ♭II⁶ tagué napolitain n'est pas une « quinte à vide fautive ».
 */
export function runAnalyzers(submission: Submission, spec: ExerciseSpec, window: EvalWindow): AnalysisBundle {
  const meter = meterOf(spec);
  const notes = notesOf(submission);

  // 1. La tonalité — tout le reste en dépend, alors on la prend où elle est
  //    SÛRE : dans la consigne quand elle la déclare, dans l'estimation sinon.
  //    L'estimation reste calculée et conservée dans `estimatedKey` : c'est
  //    elle que le checker `key` compare au déclaré pour dire si l'élève a
  //    réellement écrit dans la tonalité demandée.
  const estimated = estimateKey(notes);
  const declared = declaredKeyOf(spec);
  const key: KeyEstimate = declared
    ? { ...estimated, tonic: declared.tonic, mode: declared.mode }
    : estimated;

  // 2. La collection — la grille de lecture quand la tonalité ne suffit pas.
  const collection = detectCollection(notes);

  // 3. Les verticalités, puis 4. LES IDIOMES (F-16 : avant cadences et conduite).
  const verticals = verticalsOf(notes);
  const idioms = tagIdioms(verticals, key);

  // 5. Les accords chiffrés, 6. les cadences — qui LISENT les tags.
  const chords: TimedChord[] = verticals
    .filter((v): v is Vertical & { chord: NonNullable<Vertical['chord']> } => v.chord != null)
    .map(v => ({ chord: v.chord, from: v.from, to: v.to, notes: v.notes }));
  const total = notes.reduce((m, n) => Math.max(m, n.start + n.duration), 0);
  const line = melodicLine(notes);
  // **F-2** — le repli monophonique. Une mélodie seule n'a pas de verticalités
  // à chiffrer : sans lui, `detectCadences` reçoit une liste d'accords vide et
  // ne trouve JAMAIS de cadence, si bien que `requiredCadence: "perfect"`
  // échouait sur toutes les mélodies du corpus. Le repli lit la conclusion dans
  // la ligne : sensible ou sus-tonique menant à la tonique, longue, sur un
  // appui. Il était écrit dans `cadence.ts` et n'était appelé par personne.
  const segmentEnds = segmentEndsOf(spec, meter, total);
  const cadences = chords.length === 0 && line.length >= 2
    ? detectCadences([], key, { melodyOnly: line, meter })
    : detectCadences(chords, key, { segmentEnds });
  // Une pièce qui MODULE ponctue aussi dans sa tonalité d'arrivée : sa cadence
  // finale ne se lit pas depuis le point de départ. On repasse donc la
  // détection dans la seconde maison, quand la consigne en déclare une, et on
  // fusionne — jamais sur une pièce qui ne module pas.
  const arrival = arrivalKeyOf(spec);
  if (arrival && chords.length > 0) {
    const seen = new Set(cadences.map(c => `${c.at}/${c.kind}`));
    for (const c of detectCadences(chords, { ...key, ...arrival }, { segmentEnds })) {
      if (!seen.has(`${c.at}/${c.kind}`)) cadences.push(c);
    }
    cadences.sort((a, b) => a.at - b.at);
  }

  // 7. Le reste. Les analyses MÉLODIQUES — motif, contour, phrase — lisent la
  //    LIGNE, pas la texture : sur un choral, le contour de toutes les voix
  //    entremêlées ne décrit aucune mélodie. La tension, elle, se mesure sur la
  //    texture entière : sa dissonance et sa densité SONT le tout.
  const inverted = profileFlag('invertedProsody', spec.styleProfile);
  const analysis: AnalysisBundle = {
    notes,
    key,
    estimatedKey: estimated,
    verticals,
    chords,
    idioms,
    cadences,
    collection,
    motifs: findMotifs(line),
    contour: contour(line),
    phrases: phraseAnalysis(line, meter),
    rhythm: rhythmProfile(line, meter, inverted ? { inverted: true } : {}),
    tension: tensionCurve(notes),
    // Deux courbes, deux questions. La tension dit la FORME et l'AMPLITUDE ;
    // la saillance dit OÙ. Elles partagent leurs fenêtres et leur z-score, pas
    // leurs termes — décision n°38.
    climax: climaxSalience(notes),
  };

  if (submission.kind === 'voices') analysis.voices = submission.voices;
  if (submission.kind === 'parts' || submission.kind === 'midi') analysis.parts = submission.parts;

  void window;
  return analysis;
}

// ---------------------------------------------------------------------------
// evaluate
// ---------------------------------------------------------------------------

export interface EvaluationDetail {
  report: FeedbackReport;
  analysis: AnalysisBundle;
  window: EvalWindow;
  craft: CraftResult | null;
  /** La rubric EFFECTIVEMENT appliquée (craft redistribué si non mesurable). */
  rubric: Rubric;
}

/**
 * Quand le craft n'est pas mesurable pour ce kind, son poids ne disparaît pas
 * dans le vide : il est REDISTRIBUÉ au prorata sur correctness et constraints.
 * L'alternative — noter le craft 0 — punirait l'élève d'une limite du moteur ;
 * l'autre alternative — le noter 1 — lui offrirait des points gratuits.
 */
export function redistributeCraft(rubric: Rubric): Rubric {
  const rest = rubric.correctness + rubric.constraints;
  if (rest === 0) return { correctness: 50, constraints: 50, craft: 0 };
  const factor = (rest + rubric.craft) / rest;
  return { correctness: rubric.correctness * factor, constraints: rubric.constraints * factor, craft: 0 };
}

export function evaluateDetailed(submission: Submission, spec: ExerciseSpec, opts: EvaluateOpts = {}): EvaluationDetail {
  // 1. Validation — échec bruyant.
  validateSubmission(submission, spec);

  // Le profil de la spec, éventuellement surchargé par l'appelant.
  const effectiveSpec: ExerciseSpec = opts.profileOverride
    ? { ...spec, styleProfile: { ...(spec.styleProfile ?? {}), id: opts.profileOverride } }
    : spec;

  // 2. La fenêtre (F-41) — avant toute analyse.
  const meter = opts.meter ?? meterOf(effectiveSpec);
  const notes = notesOf(submission);
  const totalTicks = notes.reduce((m, n) => Math.max(m, n.start + n.duration), 0);
  const window = markGivenTicks(effectiveSpec, { meter, totalTicks });

  // 3. Les analyseurs, dans l'ordre imposé.
  const analysis = runAnalyzers(submission, effectiveSpec, window);

  const ctx: RuleCtx = { submission, analysis, spec: effectiveSpec, window };

  // 4. Les checkers de contraintes. Les `performanceOnly` sont évaluées puis
  //    MARQUÉES : elles restent dans le rapport (transparence) et sortent du
  //    score si le rendu n'a pas pu être jugé (F-35).
  const constraints: ConstraintReport[] = checkConstraints(ctx, { skipPerformance: opts.skipPerformance ?? false });

  // 5. Les règles, pondérées par le profil.
  const run = runRules(ctx);
  const issues: WeightedIssue[] = run.issues.map(i => {
    const owner = i.ownerRuleId ?? i.ruleId;
    return { ...i, weight: run.weights[owner] ?? REGISTRY.get(owner)?.weight ?? 1 };
  });

  // 6. Le craft.
  const craft = computeCraft(effectiveSpec.kind, analysis, effectiveSpec, {
    issueIds: issues.map(i => i.ruleId),
    submission,
  });

  // 7. Le score.
  const declared = rubricOf(effectiveSpec.rubric);
  const rubric = craft === null ? redistributeCraft(declared) : declared;
  const scored: ScoredConstraint[] = constraints.map(c => {
    const out: ScoredConstraint = { key: c.key, pass: c.result.pass };
    if (c.result.performanceOnly) {
      out.performanceOnly = true;
      // Une clé de performance ne compte que si elle a réellement MESURÉ.
      out.evaluated = c.result.mode === 'measured' && !opts.skipPerformance;
    }
    return out;
  });
  const score = computeScore(rubric, { issues, constraints: scored, craft: craft?.value ?? 0 });

  // 8. Le rapport.
  const report = buildFeedback({
    engineVer: ENGINE_VER,
    score,
    issues,
    constraints,
    craft,
    silencedRules: run.silenced,
  });

  return { report, analysis, window, craft, rubric };
}

/** La fonction-produit : `evaluate(submission, spec) → FeedbackReport`. */
export function evaluate(submission: Submission, spec: ExerciseSpec, opts: EvaluateOpts = {}): FeedbackReport {
  return evaluateDetailed(submission, spec, opts).report;
}
