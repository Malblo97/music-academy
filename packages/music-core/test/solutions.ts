import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Charge toutes les solutions de `packages/content/solutions/<module>/*.json`.
 * `notation` est `undefined` pour les soumissions qui ne sont pas de la
 * notation textuelle (ex. `payload` pour les modules à couches) — filtrer sur
 * `s.notation` avant usage, comme le fait `loadSolutions().filter(s => s.notation)`.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_SOLUTIONS = join(__dirname, '../../content/solutions');

export interface Solution {
  module: string;
  file: string;
  exerciseId?: string;
  notation?: string;
}

export function loadSolutions(): Solution[] {
  const out: Solution[] = [];
  for (const mod of readdirSync(CONTENT_SOLUTIONS).sort()) {
    const dir = join(CONTENT_SOLUTIONS, mod);
    for (const file of readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
      const raw = JSON.parse(readFileSync(join(dir, file), 'utf8')) as Record<string, unknown>;
      const solution: Solution = { module: mod, file };
      if (typeof raw.exerciseId === 'string') solution.exerciseId = raw.exerciseId;
      if (typeof raw.notation === 'string') solution.notation = raw.notation;
      out.push(solution);
    }
  }
  return out;
}
