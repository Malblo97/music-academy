import type { Meter, Note } from '../types.js';
import { metricWeight } from './rhythm.js';

/**
 * `suspension.ts` — **F-29**, le retard GÉNÉRALISÉ. La 4e espèce ne sait
 * reconnaître le retard que couplé à un cantus firmus en rondes ; or le retard
 * vit partout (m04-s08 le prouve à trois voix, hors espèces). Ce détecteur est
 * donc découplé : toute paire de voix, toute valeur, tout style — il servira
 * M7/M8 tel quel.
 *
 * Le motif est invariable : PRÉPARATION (consonance) → LIAISON (la note tient)
 * → DISSONANCE sur l'appui → RÉSOLUTION descendante par degré.
 */

export type SuspensionType = '4-3' | '7-6' | '9-8' | 'other';

export interface Suspension {
  /** Tick de l'appui dissonant. */
  at: number;
  /** Index de la voix qui retarde et de celle contre laquelle elle frotte. */
  upper: number;
  lower: number;
  type: SuspensionType;
  preparedAt: number;
  resolvedAt: number;
}

export interface SuspensionReport {
  suspensions: Suspension[];
  /** Chaînes : la résolution de l'un prépare le suivant (le moteur du lamento). */
  chains: Suspension[][];
}

/** Consonances en classes d'intervalle (la quarte est dissonante à deux voix). */
const CONSONANT = new Set([0, 3, 4, 7, 8, 9]);

function pc(n: number): number {
  return ((n % 12) + 12) % 12;
}

function soundingAt(voice: readonly Note[], tick: number): Note | undefined {
  return voice.find(n => n.start <= tick && n.start + n.duration > tick);
}

function typeOf(dissonance: number, resolution: number): SuspensionType {
  if (dissonance === 5 && (resolution === 3 || resolution === 4)) return '4-3';
  if ((dissonance === 10 || dissonance === 11) && (resolution === 8 || resolution === 9)) return '7-6';
  if ((dissonance === 1 || dissonance === 2) && resolution === 0) return '9-8';
  return 'other';
}

/**
 * `suspensionCheck(voices, opts)` — les retards de toutes les paires de voix.
 * Une note ne compte que si elle est TENUE à travers l'appui (elle n'attaque
 * pas dessus : c'est ce qui sépare le retard de l'appoggiature).
 */
export function suspensionCheck(
  voices: readonly (readonly Note[])[],
  opts: { meter?: Meter } = {},
): SuspensionReport {
  const meter = opts.meter ?? ([4, 4] as Meter);
  const suspensions: Suspension[] = [];

  for (let u = 0; u < voices.length; u++) {
    for (let l = 0; l < voices.length; l++) {
      if (u === l) continue;
      const upper = [...voices[u]!].sort((a, b) => a.start - b.start);
      const lower = [...voices[l]!].sort((a, b) => a.start - b.start);

      for (let i = 0; i < upper.length - 1; i++) {
        const held = upper[i]!;
        const resolution = upper[i + 1]!;

        // La résolution descend par degré, immédiatement après la tenue.
        const step = held.pitch - resolution.pitch;
        if (step < 1 || step > 2) continue;
        if (resolution.start !== held.start + held.duration) continue;

        // L'appui : une attaque de la voix basse À L'INTÉRIEUR de la tenue.
        for (const attack of lower) {
          if (attack.start <= held.start || attack.start >= held.start + held.duration) continue;
          // Le retard est la voix du DESSUS : sans cette garde, la classe
          // d'intervalle se lirait à l'envers (une quinte passerait pour une
          // quarte) et la basse tenue passerait pour une suspension.
          if (held.pitch <= attack.pitch) continue;
          if (metricWeight(attack.start, meter) === 0) continue; // le retard tombe sur un appui

          const dissonance = pc(held.pitch - attack.pitch);
          if (CONSONANT.has(dissonance)) continue;

          const under = soundingAt(lower, resolution.start);
          if (!under) continue;
          const resolved = pc(resolution.pitch - under.pitch);
          if (!CONSONANT.has(resolved)) continue;

          // La préparation : à l'attaque de la note tenue, l'intervalle consonait.
          const prepared = soundingAt(lower, held.start);
          if (!prepared || !CONSONANT.has(pc(held.pitch - prepared.pitch))) continue;

          suspensions.push({
            at: attack.start,
            upper: u,
            lower: l,
            type: typeOf(dissonance, resolved),
            preparedAt: held.start,
            resolvedAt: resolution.start,
          });
          break;
        }
      }
    }
  }

  suspensions.sort((a, b) => a.at - b.at);

  // Chaînes : la résolution de l'un est la préparation du suivant, même paire.
  const chains: Suspension[][] = [];
  let current: Suspension[] = [];
  for (const s of suspensions) {
    const last = current[current.length - 1];
    if (last && last.upper === s.upper && last.lower === s.lower && last.resolvedAt === s.preparedAt) {
      current.push(s);
    } else {
      if (current.length >= 2) chains.push(current);
      current = [s];
    }
  }
  if (current.length >= 2) chains.push(current);

  return { suspensions, chains };
}
