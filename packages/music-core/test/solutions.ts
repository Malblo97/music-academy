import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseNotation } from '../src/notation/parse.js';
import { applySwing } from '../src/notation/swing.js';
import { applyHumanize } from '../src/notation/humanize.js';
import type { Note, Part, Submission } from '../src/types.js';
import type { ExerciseSpec } from '../src/rules/types.js';

/**
 * `test/solutions.ts` — le chargeur du CORPUS DE RÉFÉRENCE.
 *
 * Les solutions de `packages/content/solutions/` sont la vérité terrain du
 * verrou n°2 : ce sont des pièces écrites à la main, vérifiées une par une dans
 * les sections §26–§77 de la production. Si le moteur les note mal, c'est le
 * moteur qui a tort — c'est tout l'intérêt d'avoir un corpus antérieur au code.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT = join(__dirname, '../../content');
const CONTENT_SOLUTIONS = join(CONTENT, 'solutions');
const CONTENT_MODULES = join(CONTENT, 'modules');

export interface Solution {
  module: string;
  file: string;
  exerciseId?: string;
  notation?: string;
  /** Variante ou partie de la soumission : plusieurs solutions par exercice. */
  variantId?: string;
  partId?: string;
  submissionPartId?: string;
  payload?: Record<string, unknown>;
  /** F-43 : le swing est un fait de RENDU, appliqué à la compilation. */
  swing?: unknown;
  /** F-35 : l'humanisation aussi — une partition n'est pas une exécution. */
  humanize?: unknown;
}

export type SolutionFile = Solution;

function str(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

export function loadSolutions(modules?: readonly string[]): Solution[] {
  const out: Solution[] = [];
  for (const mod of readdirSync(CONTENT_SOLUTIONS).sort()) {
    if (modules && !modules.includes(mod)) continue;
    const dir = join(CONTENT_SOLUTIONS, mod);
    for (const file of readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
      const raw = JSON.parse(readFileSync(join(dir, file), 'utf8')) as Record<string, unknown>;
      const solution: Solution = { module: mod, file };
      const id = str(raw.exerciseId); if (id) solution.exerciseId = id;
      const notation = str(raw.notation); if (notation) solution.notation = notation;
      const variantId = str(raw.variantId); if (variantId) solution.variantId = variantId;
      const partId = str(raw.partId); if (partId) solution.partId = partId;
      const subPart = str(raw.submissionPartId); if (subPart) solution.submissionPartId = subPart;
      if (raw.payload && typeof raw.payload === 'object') solution.payload = raw.payload as Record<string, unknown>;
      if (raw.swing !== undefined) solution.swing = raw.swing;
      if (raw.humanize !== undefined) solution.humanize = raw.humanize;
      out.push(solution);
    }
  }
  return out;
}

/** Le nom lisible d'une solution : l'exercice, plus sa variante s'il y en a. */
export function labelOf(s: Solution): string {
  const suffix = s.variantId ?? s.partId ?? s.submissionPartId;
  return suffix ? `${s.exerciseId} [${suffix}]` : (s.exerciseId ?? s.file);
}

// ---------------------------------------------------------------------------
// Les specs
// ---------------------------------------------------------------------------

/**
 * Les specs d'exercice ne sont pas écrites uniformément : M1–M3 rangent
 * `styleProfile`/`rubric` DANS `spec`, M9 les met à la racine. On aplatit les
 * deux dispositions en une seule `ExerciseSpec` — le moteur ne doit pas
 * connaître l'histoire éditoriale du corpus.
 */
function flattenSpec(raw: Record<string, unknown>): ExerciseSpec {
  const nested = (raw.spec && typeof raw.spec === 'object' ? raw.spec : {}) as Record<string, unknown>;
  return { ...raw, ...nested, id: String(raw.id) } as ExerciseSpec;
}

let SPEC_INDEX: Map<string, ExerciseSpec> | null = null;

export function loadSpecs(): Map<string, ExerciseSpec> {
  if (SPEC_INDEX) return SPEC_INDEX;
  const map = new Map<string, ExerciseSpec>();
  for (const dir of readdirSync(CONTENT_MODULES)) {
    const exercises = join(CONTENT_MODULES, dir, 'exercises');
    if (!existsSync(exercises)) continue;
    for (const file of readdirSync(exercises).filter(f => f.endsWith('.json'))) {
      const raw = JSON.parse(readFileSync(join(exercises, file), 'utf8')) as Record<string, unknown>;
      if (typeof raw.id === 'string') map.set(raw.id, flattenSpec(raw));
    }
  }
  SPEC_INDEX = map;
  return map;
}

/** La spec d'un exercice. LANCE si elle manque — une solution orpheline est un bug de contenu. */
export function specOf(exerciseId: string | undefined): ExerciseSpec {
  if (!exerciseId) throw new Error('solution sans exerciseId');
  const spec = loadSpecs().get(exerciseId);
  if (!spec) throw new Error(`aucune spec pour « ${exerciseId} » — solution orpheline`);
  return spec;
}

// ---------------------------------------------------------------------------
// Le verrou POLYMORPHE (F-48)
// ---------------------------------------------------------------------------

export type LockKind = 'score' | 'proof' | 'checklist' | 'analysis';

/**
 * **F-48** : toutes les solutions ne se vérifient pas de la même façon. Une
 * progression harmonique se NOTE ; une mission DAW se PROUVE (le fichier
 * porte-t-il les preuves attendues ?) ; une annotation se compare à la vérité
 * terrain. Leur imposer à toutes le score serait un verrou vert et creux.
 */
export function lockKindOf(kind: string | undefined): LockKind {
  switch (kind) {
    case 'DAW_MISSION': return 'proof';
    case 'ANALYSIS': return 'analysis';
    case 'THEORY_QUIZ':
    case 'EAR_QUIZ': return 'checklist';
    default: return 'score';
  }
}

// ---------------------------------------------------------------------------
// La compilation
// ---------------------------------------------------------------------------

/** Vrai si la notation empile des hauteurs simultanées — donc si elle est verticale. */
function hasStacks(notation: string): boolean {
  return /\[[^\]]*\+[^\]]*\]/.test(notation);
}

const HARMONIC_KINDS = new Set(['HARMONY_PROGRESSION', 'CHORD_PROGRESSION', 'HARMONIZE_MELODY', 'COUNTERPOINT']);

// ---------------------------------------------------------------------------
// L'EFFECTIF : quelles pièces se lisent en voix (décision n°31)
// ---------------------------------------------------------------------------

/**
 * Un effectif CONSTANT l'est — au milieu de la pièce, une verticalité plus
 * mince décale d'un rang toutes les voix sous la manquante, et les quatre
 * lignes deviennent fausses ensemble. La DERNIÈRE fait exception : finir à
 * moins de voix qu'on n'en tenait est un geste de composition, pas une
 * instabilité, et rien ne vient après qu'elle puisse décaler. Le corpus en
 * porte deux, revendiqués en `authorNotes` — « l'atterrissage EST le fil resté
 * seul » (m03-s06 boucle), « le pôle resté seul » (m03-s10).
 */
const MAX_THIN_ONSETS = 0;

/** Ce que la pièce TIENT verticalement, indépendamment de ce que la spec déclare. */
interface StackProfile {
  /** La largeur de la verticalité dominante — l'effectif présumé. */
  width: number;
  /** La plus épaisse rencontrée. Au-dessus de `width`, une voix apparaît de nulle part. */
  maxWidth: number;
  /** Combien de verticalités NON FINALES sont plus minces que l'effectif. */
  thinOnsets: number;
  onsets: number;
}

/**
 * La largeur d'une verticalité se compte en sons qui SONNENT, pas en sons qui
 * attaquent : une ronde liée par-dessus la barre tient sa voix sans réattaquer.
 * Compter les attaques faisait passer `m01-s34` (dont la 9e est liée dans
 * l'accord final) pour une pièce à largeur variable — et pire, décalait la
 * répartition sur cet accord-là.
 */
function soundingWidths(notes: readonly Note[]): number[] {
  const onsets = [...new Set(notes.map(n => n.start))].sort((a, b) => a - b);
  return onsets.map(at => notes.filter(n => n.start <= at && n.start + n.duration > at).length);
}

function profileOf(notes: readonly Note[]): StackProfile {
  const observed = soundingWidths(notes);
  const tally = new Map<number, number>();
  for (const w of observed) tally.set(w, (tally.get(w) ?? 0) + 1);
  // La largeur dominante ; à égalité, la plus épaisse — on ne suppose pas
  // qu'une pièce est plus mince qu'elle n'est.
  let width = 0, best = -1;
  for (const [w, count] of tally) if (count > best || (count === best && w > width)) { width = w; best = count; }
  return {
    width,
    maxWidth: observed.length > 0 ? Math.max(...observed) : 0,
    thinOnsets: observed.slice(0, -1).filter(w => w < width).length,
    onsets: observed.length,
  };
}

export type VoiceTexture =
  | { kind: 'constant-choir'; width: number }
  | { kind: 'variable-density'; reason: string };

function declaredVoices(spec: ExerciseSpec): { min?: number; max?: number } {
  const c = (spec.constraints ?? {}) as Record<string, unknown>;
  const out: { min?: number; max?: number } = {};
  if (typeof c.minVoices === 'number') out.min = c.minVoices;
  if (typeof c.maxVoices === 'number') out.max = c.maxVoices;
  return out;
}

/**
 * **Le déclencheur de `unstackVoices` (décision n°31).**
 *
 * La décision n°29(2) reste entière : un choral écrit en accords EST à quatre
 * voix, et le compiler ainsi c'est le LIRE. Ce qui manquait, c'est de vérifier
 * que la pièce est bien un choral avant de le faire — le déclencheur d'origine
 * était « la notation empile des hauteurs », ce qui embarquait aussi les
 * textures à densité ouverte. `m03-e15` déclare `minVoices: 1, maxVoices: 8`,
 * `styleProfile: impressionist`, et sa leçon porte sur le cluster : ses neuf
 * attaques à une note et ses grappes à huit étaient jugées par des règles
 * écrites pour quatre voix indépendantes.
 *
 * Deux témoins, et il faut les deux. La spec parle EN PREMIER : c'est elle qui
 * dit de quoi l'exercice traite, et une plage ouverte (1–8, 2–7) annonce un
 * travail de densité même si cette solution-là s'avère stable.
 */
export function voiceTextureOf(notes: readonly Note[], spec: ExerciseSpec): VoiceTexture {
  const p = profileOf(notes);
  const { min, max } = declaredVoices(spec);

  // Ce que la spec DÉCLARE.
  if (min !== undefined && min <= 1) {
    return { kind: 'variable-density', reason: `la spec déclare minVoices ${min} : l'exercice porte sur la densité, pas sur un effectif` };
  }
  if (min !== undefined && max !== undefined && max - min >= 2) {
    return { kind: 'variable-density', reason: `la spec déclare une plage ouverte (${min}–${max}) : l'exercice porte sur la densité, pas sur un effectif` };
  }
  if ((min !== undefined && p.width < min) || (max !== undefined && p.width > max)) {
    return { kind: 'variable-density', reason: `la pièce tient ${p.width} voix, la spec en déclare ${min ?? '—'}–${max ?? '—'}` };
  }

  // Ce que la pièce TIENT.
  if (p.width < 2) {
    return { kind: 'variable-density', reason: `la verticalité dominante n'a qu'une note (${p.onsets} verticalités, jusqu'à ${p.maxWidth}) — c'est une ligne, pas un effectif` };
  }
  if (p.maxWidth > p.width) {
    return { kind: 'variable-density', reason: `l'effectif dominant est de ${p.width} voix mais des verticalités montent à ${p.maxWidth} — une voix apparaîtrait de nulle part` };
  }
  if (p.thinOnsets > MAX_THIN_ONSETS) {
    return { kind: 'variable-density', reason: `${p.thinOnsets} verticalités sur ${p.onsets} sont plus minces que l'effectif de ${p.width}, ailleurs qu'à la fin — l'attribution registrale décalerait les voix` };
  }
  return { kind: 'constant-choir', width: p.width };
}

/**
 * **Ce que le moteur SAIT en dire** — décision n°32.
 *
 * Une texture à densité variable n'a pas d'effectif : `voices` en inventerait
 * un et ferait naître des lignes fausses (la basse d'une attaque à trois notes
 * atterrit au rang 3, celle des attaques à quatre au rang 4). `mono` la ferait
 * passer sans qu'aucune règle d'harmonie ne lui soit posée — vert et creux, ce
 * que la décision n°29(2) refusait. Le premier temps de la décision échouait
 * donc bruyamment, faute de troisième forme.
 *
 * `{kind:'harmony'}` EST cette troisième forme : elle dit exactement ce qu'on
 * sait lire. Les verticalités se chiffrent, donc `harmony.*`, `jazz.*` et
 * `orch.low-interval-limit` s'appliquent ; la ligne supérieure se lit, donc
 * `melody.*` et `rhythm.*` aussi. Les lignes intérieures, non — `vl.*` et
 * `cp.*` restent muettes, et le craft n'en tire aucun point (cf. `craft.ts`,
 * composante `clean-voice-leading`).
 */

/**
 * Défait un empilement vertical en VOIX, par registre : la plus aiguë de chaque
 * attaque va au soprano, et ainsi de suite.
 *
 * **Pourquoi ce n'est pas `{kind:'mono'}`** : le tutoriel écrit
 * « notation → mono », mais les familles `harmony.*` et `vl.*` ne s'appliquent
 * qu'aux soumissions à voix (`appliesTo`). Compiler un choral SATB en `mono`
 * ferait taire les quatorze règles qui ont un sens sur lui : le verrou serait
 * vert parce qu'on n'aurait rien demandé. Un choral écrit en accords EST à
 * quatre voix — le compiler ainsi, c'est lire la solution, pas la contourner.
 *
 * Limite assumée : l'attribution est registrale, pas contrapuntique. Sur un
 * texte où une voix interne se tait puis rentre, la répartition décale d'un
 * rang — la basse d'une attaque à trois notes atterrit au rang 3 quand celle
 * des attaques à quatre est au rang 4, et les quatre lignes deviennent fausses
 * ensemble. C'est `voiceTextureOf` qui garantit la précondition : on n'appelle
 * cette fonction que sur des chorals à effectif constant.
 */
export function unstackVoices(notes: readonly Note[]): Note[][] {
  const onsets = [...new Set(notes.map(n => n.start))].sort((a, b) => a - b);
  const widths = soundingWidths(notes);
  const voices: Note[][] = Array.from({ length: Math.max(1, ...widths) }, () => []);
  for (const onset of onsets) {
    // Le rang se calcule sur la verticalité qui SONNE — liaisons comprises —
    // sinon la note tenue laisse un trou et tout ce qui est en dessous d'elle
    // remonte d'un rang le temps d'un accord. Seules les notes qui ATTAQUENT
    // ici sont poussées : une tenue appartient déjà à sa voix.
    const sounding = notes.filter(n => n.start <= onset && n.start + n.duration > onset)
      .sort((a, b) => b.pitch - a.pitch);
    sounding.forEach((n, i) => { if (n.start === onset) voices[i]!.push(n); });
  }
  return voices.filter(v => v.length > 0);
}

function partsOf(payload: Record<string, unknown>): Part[] | null {
  const raw = payload.parts;
  if (!Array.isArray(raw)) return null;
  const parts: Part[] = [];
  for (const p of raw as Record<string, unknown>[]) {
    const notation = str(p.notation);
    if (!notation) continue;
    parts.push({ instrumentId: str(p.instrumentId) ?? str(p.role) ?? str(p.id) ?? 'unknown', notes: parseNotation(notation) });
  }
  return parts.length > 0 ? parts : null;
}

/** Les « plans » simultanés de M3 (`payload.parts.plans`) : deux couches qui coexistent. */
function plansOf(payload: Record<string, unknown>): Note[][] | null {
  const parts = payload.parts;
  if (!parts || typeof parts !== 'object' || Array.isArray(parts)) return null;
  const plans = (parts as { plans?: unknown }).plans;
  if (!Array.isArray(plans)) return null;
  const voices = (plans as Record<string, unknown>[])
    .map(p => str(p.notation))
    .filter((n): n is string => Boolean(n))
    .map(n => parseNotation(n));
  return voices.length >= 2 ? voices : null;
}

/**
 * `compileSolution` — de la solution ÉCRITE à la soumission ÉVALUABLE.
 *
 * F-43/F-35 : `swing` et `humanize` sont des faits de RENDU. S'ils sont
 * déclarés, ils s'appliquent ici, à la compilation — pas dans les analyseurs,
 * qui doivent voir ce qui sonne, pas ce qui est écrit.
 */
export function compileSolution(s: Solution, spec: ExerciseSpec): Submission {
  const payload = s.payload ?? {};

  // Les formes explicites du payload passent avant tout.
  const layers = payload.layers;
  if (Array.isArray(layers)) {
    return { kind: 'layers', stack: { layers: layers as never } };
  }
  if (payload.annotations !== undefined) {
    return { kind: 'annotations', annotations: payload.annotations };
  }
  const payloadVoices = payload.voices;
  if (Array.isArray(payloadVoices)) {
    return { kind: 'voices', voices: (payloadVoices as string[]).map(v => render(parseNotation(v), s)) };
  }
  const plans = plansOf(payload);
  if (plans) return { kind: 'voices', voices: plans.map(v => render(v, s)) };
  const parts = partsOf(payload);
  if (parts) {
    return { kind: 'parts', parts: parts.map(p => ({ ...p, notes: render(p.notes, s) })) };
  }

  if (!s.notation) {
    throw new Error(`${labelOf(s)} : ni notation ni payload exploitable — rien à compiler`);
  }

  const notes = render(parseNotation(s.notation), s);
  const kind = typeof spec.kind === 'string' ? spec.kind : undefined;
  const harmonic = kind !== undefined && HARMONIC_KINDS.has(kind);
  if (harmonic || hasStacks(s.notation)) {
    const texture = voiceTextureOf(notes, spec);
    if (texture.kind === 'constant-choir') {
      const voices = unstackVoices(notes);
      if (voices.length >= 2) return { kind: 'voices', voices };
    } else if (harmonic) {
      // Une pièce HARMONIQUE dont on ne sait pas lire l'effectif ne retombe pas
      // en `mono` : elle serait notée sans une seule règle d'harmonie. Elle se
      // lit en verticalités — les accords sans les lignes (décision n°32).
      return { kind: 'harmony', notes };
    }
  }
  return { kind: 'mono', notes };
}

/** Applique au RENDU ce que la solution déclare de son exécution (F-43/F-35). */
function render(notes: Note[], s: Solution): Note[] {
  let out = notes;
  if (typeof s.swing === 'number') out = applySwing(out, s.swing);
  else if (s.swing && typeof s.swing === 'object') {
    const { ratio } = s.swing as { ratio?: number };
    if (typeof ratio === 'number') out = applySwing(out, ratio);
  }
  if (s.humanize && typeof s.humanize === 'object') {
    const { seed, offsetRange } = s.humanize as { seed?: number; offsetRange?: number };
    if (typeof seed === 'number' && typeof offsetRange === 'number') out = applyHumanize(out, { seed, offsetRange });
  }
  return out;
}
