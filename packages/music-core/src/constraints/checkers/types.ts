import type { Note } from '../../types.js';
import type { RuleCtx } from '../../rules/types.js';

/**
 * Signature commune des checkers (S4.J3) : `check(key, value, ctx)`.
 *
 * `mode` dit ce qui a été vérifié, et c'est la partie honnête du contrat :
 *  - `measured` : le moteur a JUGÉ la musique (il a compté, mesuré, comparé) ;
 *  - `declared` : le moteur a vérifié que la consigne est bien FORMÉE et que la
 *    soumission porte la déclaration attendue, sans pouvoir juger le rendu.
 *
 * Un checker `declared` n'est pas un stub : il valide ce qui est validable et
 * le dit. Confondre les deux ferait un verrou vert et creux.
 */
export type CheckMode = 'measured' | 'declared';

export interface CheckResult {
  pass: boolean;
  detail: string;
  mode: CheckMode;
  /** F-35 : sauté par le verrou n°2 (solutions), exigé des soumissions réelles. */
  performanceOnly?: boolean;
}

export type Checker = (key: string, value: unknown, ctx: RuleCtx) => CheckResult;

export function ok(detail: string, mode: CheckMode = 'measured'): CheckResult {
  return { pass: true, detail, mode };
}

export function fail(detail: string, mode: CheckMode = 'measured'): CheckResult {
  return { pass: false, detail, mode };
}

/** La ligne jugée : une note par attaque (la plus aiguë), fenêtre F-41 appliquée. */
export function line(ctx: RuleCtx): Note[] {
  const top = new Map<number, Note>();
  for (const n of ctx.analysis.notes) {
    if (!ctx.window.judges(n.start)) continue;
    const cur = top.get(n.start);
    if (!cur || n.pitch > cur.pitch) top.set(n.start, n);
  }
  return [...top.values()].sort((a, b) => a.start - b.start);
}

/** Toutes les notes jugées, voix confondues. */
export function allJudged(ctx: RuleCtx): Note[] {
  return ctx.analysis.notes.filter(n => ctx.window.judges(n.start)).sort((a, b) => a.start - b.start);
}

export function pc(n: number): number {
  return ((n % 12) + 12) % 12;
}

/** Le degré d'une hauteur dans la tonalité analysée. */
export function degreeOf(ctx: RuleCtx, pitch: number): number {
  return pc(pitch - ctx.analysis.key.tonic);
}

/**
 * Les degrés des specs sont écrits en chiffres de SOLFÈGE (1̂ = 1, 5̂ = 5), pas
 * en demi-tons. La conversion se fait ici, une fois pour toutes.
 */
const DEGREE_SEMITONES: Record<number, number> = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11 };

export function degreeToSemitone(degree: number, minor: boolean): number {
  const base = DEGREE_SEMITONES[((degree - 1) % 7 + 7) % 7 + 1] ?? 0;
  if (!minor) return base;
  if (degree === 3) return 3;
  if (degree === 6) return 8;
  return base;
}

export function matchesDegree(ctx: RuleCtx, pitch: number, degree: number): boolean {
  const minor = ctx.analysis.key.mode !== 'major' && ctx.analysis.key.mode !== 'lydian' && ctx.analysis.key.mode !== 'mixolydian';
  const semitone = degreeToSemitone(degree, minor);
  const actual = degreeOf(ctx, pitch);
  // La sensible haussée d'un mode mineur reste « le 7e degré ».
  return actual === semitone || (degree === 7 && minor && actual === 11);
}

export function asNumber(value: unknown): number | null {
  return typeof value === 'number' ? value : null;
}

export function asRange(value: unknown): [number, number] | null {
  return Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number'
    ? [value[0], value[1]]
    : null;
}

export function asNumbers(value: unknown): number[] | null {
  return Array.isArray(value) && value.every(v => typeof v === 'number') ? (value as number[]) : null;
}

export function asStrings(value: unknown): string[] | null {
  return Array.isArray(value) && value.every(v => typeof v === 'string') ? (value as string[]) : null;
}
