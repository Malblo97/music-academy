import type { Note } from '../types.js';

/**
 * humanize.ts (F-35) — décale légèrement les attaques pour un rendu moins mécanique.
 * PRNG déterministe (mulberry32) : mêmes seed + notes => toujours le même résultat.
 * Offset borné à [-offsetRange, +offsetRange] sur `start`, jamais appliqué à la
 * première note (elle ancre le début du rendu).
 * `printNotation` n'est PAS censé survivre au humanize : humanize s'applique au
 * RENDU (audio/MIDI), pas à la notation source. Conséquence pour les tests :
 * le round-trip (`printNotation(parseNotation(x)) === normalize(x)`) se teste
 * AVANT humanize, tandis que `measureSwingRatio` (qui, lui, fait partie de la
 * notation) se mesure APRÈS swing.
 */

export interface HumanizeOpts { seed: number; offsetRange: number }

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function applyHumanize(notes: Note[], opts: HumanizeOpts): Note[] {
  const rand = mulberry32(opts.seed);
  return notes.map((n, i) => {
    if (i === 0) return n;
    const offset = Math.round((rand() * 2 - 1) * opts.offsetRange);
    return { ...n, start: Math.max(0, n.start + offset) };
  });
}
