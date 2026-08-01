import { readdirSync, readFileSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { parseNotation, midiToName } from '../src/notation/parse.js';
import { printNotation } from '../src/notation/print.js';
import { TICKS } from '../src/types.js';
import type { Meter, Note } from '../src/types.js';

const CONTENT_ROOT = join(import.meta.dirname, '..', '..', 'content');
const SOLUTIONS_ROOT = join(CONTENT_ROOT, 'solutions');
const MODULES_ROOT = join(CONTENT_ROOT, 'modules');
const DENOM_LETTER: Record<number, string> = { 1: 'w', 2: 'h', 4: 'q', 8: 'e', 16: 's' };

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (f.endsWith('.json')) out.push(p);
  }
  return out;
}

// Index exercise meter by id, scanning every module's exercises dir once.
const meterById = new Map<string, string>();
for (const modDir of readdirSync(MODULES_ROOT)) {
  const exDir = join(MODULES_ROOT, modDir, 'exercises');
  try { statSync(exDir); } catch { continue; }
  for (const f of readdirSync(exDir)) {
    if (!f.endsWith('.json')) continue;
    const spec = JSON.parse(readFileSync(join(exDir, f), 'utf8'));
    if (spec.id) meterById.set(spec.id, spec.meter ?? '4/4');
  }
}

function parseMeter(s: string): Meter {
  const [n, d] = s.split('/').map(Number);
  return [n!, d!];
}

function barTicks([num, den]: Meter): number {
  const letter = DENOM_LETTER[den];
  const unit = letter === undefined ? undefined : TICKS[letter];
  if (unit === undefined) throw new Error(`analyze: dénominateur de métrique non supporté (${den})`);
  return num * unit;
}

// Recursively collect every string found under a key named "notation".
function collectNotations(obj: unknown, path: string, out: { path: string; notation: string }[]): void {
  if (obj === null || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => collectNotations(v, `${path}[${i}]`, out));
    return;
  }
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (k === 'notation' && typeof v === 'string') {
      out.push({ path: `${path}.${k}`, notation: v });
    } else {
      collectNotations(v, `${path}.${k}`, out);
    }
  }
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function project(ns: readonly Note[]) {
  return ns.map(n => ({ pitch: n.pitch, start: n.start, duration: n.duration }))
    .sort((a, b) => a.start - b.start || a.pitch - b.pitch);
}

interface HardError { file: string; path: string; notation: string; error: string }
interface Divergence { file: string; path: string; notation: string; reason: string; detail?: string }

/**
 * Mode batch (décision n°17) : scanne tout `packages/content/solutions/` et
 * rapporte les erreurs de parse dures et les divergences de round-trip
 * (contenu audible modifié par print→parse). Outil de triage du corpus,
 * indépendant du verrou n°3 (`test/locks/roundtrip.test.ts`).
 */
function scanCorpus(): void {
  const hardErrors: HardError[] = [];
  const divergences: Divergence[] = [];
  let totalNotations = 0;

  for (const file of walk(SOLUTIONS_ROOT)) {
    const rel = file.slice(CONTENT_ROOT.length + 1).replace(/\\/g, '/');
    let json: Record<string, unknown>;
    try { json = JSON.parse(readFileSync(file, 'utf8')); } catch { continue; }
    const exerciseId = typeof json.exerciseId === 'string' ? json.exerciseId : undefined;
    const meterStr = (exerciseId && meterById.get(exerciseId)) || '4/4';
    const meter = parseMeter(meterStr);

    const found: { path: string; notation: string }[] = [];
    collectNotations(json, '$', found);

    for (const { path, notation } of found) {
      totalNotations++;
      let notes: Note[];
      try {
        notes = parseNotation(notation);
      } catch (e) {
        hardErrors.push({ file: rel, path, notation, error: errMsg(e) });
        continue;
      }
      // Round-trip: print(notes) then re-parse; compare the audible content.
      try {
        const printed = printNotation({ notes, meter });
        const reparsed = parseNotation(printed);
        const a = project(notes);
        const b = project(reparsed);
        if (JSON.stringify(a) !== JSON.stringify(b)) {
          divergences.push({ file: rel, path, notation, reason: 'round-trip mismatch (contenu audible modifié)', detail: printed });
        }
      } catch (e) {
        divergences.push({ file: rel, path, notation, reason: 'printNotation a échoué', detail: errMsg(e) });
      }
    }
  }

  console.log(`Notations scannées : ${totalNotations}`);
  console.log(`\n=== ERREURS DURES (parse échoue) : ${hardErrors.length} ===`);
  for (const h of hardErrors) {
    console.log(`\n- ${h.file}  [${h.path}]`);
    console.log(`  ${h.error}`);
  }
  console.log(`\n=== DIVERGENCES D'IMPRESSION (round-trip change le contenu ou échoue) : ${divergences.length} ===`);
  for (const d of divergences) {
    console.log(`\n- ${d.file}  [${d.path}]  — ${d.reason}`);
    if (d.detail) console.log(`  ${d.detail.slice(0, 200)}`);
  }
}

/**
 * Mode fichier unique (S1.J5, v0 — « ton stéthoscope ») :
 * `pnpm analyze <chemin-solution.json>` : parse chaque `notation` trouvée
 * dans le fichier et imprime nb de notes, ambitus, durée en mesures, et la
 * notation régénérée. S'enrichira semaine après semaine (`--spec`, `--live`,
 * `--midi`, `--recipe` — cf. S8.J4-J5) ; cette version couvre juste la
 * notation, seule brique qui existe en semaine 1.
 */
function analyzeFile(rawPath: string): void {
  const path = resolve(process.cwd(), rawPath);
  let json: Record<string, unknown>;
  try {
    json = JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    console.error(`analyze: impossible de lire/parser ${rawPath} (résolu en ${path}) : ${errMsg(e)}`);
    process.exitCode = 1;
    return;
  }
  const exerciseId = typeof json.exerciseId === 'string' ? json.exerciseId : undefined;
  const meterStr = (exerciseId && meterById.get(exerciseId)) || '4/4';
  const meter = parseMeter(meterStr);
  const bar = barTicks(meter);

  const found: { path: string; notation: string }[] = [];
  collectNotations(json, '$', found);

  console.log(`Fichier : ${rawPath}`);
  if (exerciseId) console.log(`Exercice : ${exerciseId} (métrique ${meterStr})`);
  if (found.length === 0) {
    console.log('Aucun champ "notation" trouvé dans ce fichier.');
    return;
  }

  for (const { path: fieldPath, notation } of found) {
    console.log(`\n--- ${fieldPath} ---`);
    let notes: Note[];
    try {
      notes = parseNotation(notation);
    } catch (e) {
      console.log(`ERREUR DE PARSE : ${errMsg(e)}`);
      continue;
    }

    const pitches = notes.map(n => n.pitch);
    const lowest = Math.min(...pitches);
    const highest = Math.max(...pitches);
    const totalTicks = notes.reduce((acc, n) => Math.max(acc, n.start + n.duration), 0);
    const bars = totalTicks / bar;

    console.log(`Notes : ${notes.length}`);
    console.log(
      pitches.length > 0
        ? `Ambitus : ${midiToName(lowest)}–${midiToName(highest)} (${highest - lowest} demi-tons)`
        : 'Ambitus : — (aucune note, silences seulement)',
    );
    console.log(`Durée : ${bars} mesure(s)${Number.isInteger(bars) ? '' : ' (mesure incomplète)'}`);

    try {
      console.log(`Notation régénérée : ${printNotation({ notes, meter })}`);
    } catch (e) {
      console.log(`ÉCHEC DE RÉGÉNÉRATION : ${errMsg(e)}`);
    }
  }
}

const target = process.argv[2];
if (target) {
  analyzeFile(target);
} else {
  scanCorpus();
}
