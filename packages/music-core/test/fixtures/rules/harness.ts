import { parseNotation } from '../../../src/notation/parse.js';
import { estimateKey } from '../../../src/analyzers/key.js';
import { detectChord } from '../../../src/analyzers/chord.js';
import { detectCadences } from '../../../src/analyzers/cadence.js';
import type { TimedChord } from '../../../src/analyzers/cadence.js';
import { tagIdioms } from '../../../src/analyzers/idioms.js';
import type { Vertical } from '../../../src/analyzers/idioms.js';
import { detectCollection } from '../../../src/analyzers/collection.js';
import { findMotifs } from '../../../src/analyzers/motifs.js';
import { contour } from '../../../src/analyzers/contour.js';
import { phraseAnalysis } from '../../../src/analyzers/phrase.js';
import { rhythmProfile } from '../../../src/analyzers/rhythm.js';
import { tensionCurve } from '../../../src/analyzers/tension.js';
import { markGivenTicks } from '../../../src/constraints/window.js';
import type { AnalysisBundle, ExerciseSpec, RuleCtx, StyleProfileRef } from '../../../src/rules/types.js';
import type { Meter, Note, Part, Submission } from '../../../src/types.js';

/**
 * Le harnais des fixtures de règles : il fabrique le `RuleCtx` complet à partir
 * d'une notation, en passant par TOUS les analyseurs — c'est l'esquisse du
 * pipeline de la semaine 5, réduite à ce dont les règles ont besoin.
 */

const METER: Meter = [4, 4];

export interface CaseInput {
  /** Une notation monodique, ou plusieurs voix. */
  notation?: string;
  voices?: string[];
  /**
   * L'ACCOMPAGNEMENT, quand il doit être chiffré à part. `detectChord` échoue
   * bruyamment (F-3) sur une verticalité qui contient une note étrangère : si
   * la mélodie est mêlée à l'accord, aucun chiffrage ne sort. Le pipeline réel
   * sépare les parties ; ce champ le fait ici.
   */
  harmony?: string[];
  parts?: Part[];
  /** Le kind de l'exercice simulé — défaut MELODY_COMPOSE (cf. `buildCtx`). */
  kind?: string;
  submission?: Submission;
  constraints?: Record<string, unknown>;
  styleProfile?: StyleProfileRef;
  given?: ExerciseSpec['given'];
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
    const inside = notes.filter(n => n.start < to && n.start + n.duration > from);
    out.push({ from, to, notes: inside, chord: detectChord(notes, { from, to }) });
  }
  return out;
}

export function buildCtx(input: CaseInput): RuleCtx {
  const voices = input.voices?.map(v => parseNotation(v));
  const parts = input.parts;
  const melody: Note[] = input.notation
    ? parseNotation(input.notation)
    : voices
      ? voices.flat()
      : parts
        ? parts.flatMap(p => [...p.notes])
        : [];
  const notes: Note[] = input.harmony
    ? [...melody, ...input.harmony.flatMap(v => parseNotation(v))]
    : melody;

  // Comme le pipeline (S5–S6) : la tonalité vient de la consigne quand elle la
  // déclare. Sans cela, une fixture chromatique se fait lire dans une tonalité
  // arbitraire et ne teste plus la règle qu'elle vise.
  const estimated = estimateKey(notes);
  const declaredKey = input.given?.key as { tonic?: number; mode?: string } | undefined;
  const key = typeof declaredKey?.tonic === 'number'
    ? { ...estimated, tonic: declaredKey.tonic, mode: (declaredKey.mode ?? 'major') as typeof estimated.mode }
    : estimated;
  const harmonyNotes = input.harmony ? input.harmony.flatMap(v => parseNotation(v)) : notes;
  const verticals = verticalsOf(harmonyNotes);
  const idioms = tagIdioms(verticals, key);
  const chords: TimedChord[] = verticals
    .filter((v): v is Vertical & { chord: NonNullable<Vertical['chord']> } => v.chord != null)
    .map(v => ({ chord: v.chord, from: v.from, to: v.to, notes: v.notes }));
  const total = notes.reduce((m, n) => Math.max(m, n.start + n.duration), 0);

  const analysis: AnalysisBundle = {
    notes,
    key,
    verticals,
    chords,
    idioms,
    cadences: detectCadences(chords, key, { segmentEnd: total }),
    collection: detectCollection(notes),
    motifs: findMotifs(notes),
    contour: contour(notes),
    phrases: phraseAnalysis(notes, METER),
    rhythm: rhythmProfile(notes, METER),
    tension: tensionCurve(notes),
  };
  analysis.estimatedKey = estimated;
  if (voices) analysis.voices = voices;
  if (parts) analysis.parts = parts;

  const submission: Submission = input.submission
    ?? (parts ? { kind: 'parts', parts }
      : voices ? { kind: 'voices', voices }
        : { kind: 'mono', notes });

  /**
   * Le contexte par défaut d'une fixture est un exercice de COMPOSITION
   * MÉLODIQUE avec une ambiance visée. Sans cela, les règles de mélodie ne
   * s'appliquent pas (`judgesMelody` / `hasShapeIntent`, S5–S6) et les fixtures
   * de détection ne testeraient plus rien. Le champ `kind` permet de choisir un
   * autre contexte — et les fixtures d'applicabilité s'en servent pour vérifier
   * que la règle se TAIT sur une grille d'accords.
   */
  const spec: ExerciseSpec = {
    id: 'fixture',
    kind: input.kind ?? 'MELODY_COMPOSE',
    styleProfile: input.styleProfile ?? { id: 'classical-common', targetMood: 'default' },
  };
  if (input.constraints) spec.constraints = input.constraints;
  if (input.given) spec.given = input.given;

  return { submission, analysis, spec, window: markGivenTicks(spec, { meter: METER, totalTicks: total }) };
}
