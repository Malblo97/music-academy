import type { DynPoint, Issue, Meter, Mute, Note, Part } from '../types.js';
import { ENDURANCE_BUDGET, instrument } from '../data/instruments.js';
import { barTicks } from './rhythm.js';

/**
 * `orchestration.ts` — ce qui SORT vraiment des instruments, par opposition à
 * ce qui est écrit. Trois questions : quelle puissance réelle (registre et
 * sourdine comprises), quelles bandes du spectre sont encombrées, et à quel
 * moment l'instrumentiste n'a plus d'air ni de lèvres.
 */

/** Velocity MIDI par défaut quand la partie ne porte ni `dyn[]` ni vélocité. */
const DEFAULT_VELOCITY = 64;

/** Au-delà de cette hauteur, un cuivre/bois travaille « dans l'aigu » (budget réduit). */
const HIGH_REGISTER_FRACTION = 0.75;

/** Un silence au moins égal à une mesure rend le souffle et les lèvres. */
const RECOVERY_BARS = 1;

/**
 * `effectivePower(id, pitch, dynOrVelocity, mute)` → puissance 0–10.
 *
 * Interpolation pp→ff par la dynamique, PUIS correction par zone de registre
 * (la flûte ×0.4 dans le grave, ×1.6 dans le suraigu : « la puissance croît
 * avec la hauteur »), PUIS le facteur de sourdine (F-40). Rend 0 hors
 * tessiture : l'instrument ne joue pas cette note, il ne la joue pas faiblement.
 */
export function effectivePower(
  instrumentId: string,
  pitch: number,
  dynOrVelocity: number = DEFAULT_VELOCITY,
  mute?: Mute,
): number {
  const inst = instrument(instrumentId);
  if (!inst) throw new Error(`orchestration : instrument inconnu "${instrumentId}"`);
  if (pitch < inst.range[0] || pitch > inst.range[1]) return 0;

  const level = Math.min(1, Math.max(0, dynOrVelocity / 127));
  const base = inst.dynamicPower.pp + (inst.dynamicPower.ff - inst.dynamicPower.pp) * level;

  const zone = inst.registerZones?.find(z => pitch >= z.from && pitch <= z.to);
  const zoneFactor = zone?.powerFactor ?? 1;
  const muteFactor = mute ? inst.muteModifiers?.[mute]?.power ?? 1 : 1;

  return base * zoneFactor * muteFactor;
}

/** La dynamique en vigueur au tick donné (F-39 : `dyn[]` prime sur la vélocité). */
export function dynamicAt(part: Part, tick: number, note?: Note): number {
  const points = part.dyn ?? [];
  let value: number | undefined;
  for (const p of points as readonly DynPoint[]) {
    if (p.tick <= tick) value = p.value;
  }
  return value ?? note?.velocity ?? DEFAULT_VELOCITY;
}

export interface BandOccupancy {
  label: string;
  from: number;
  to: number;
  /** Nombre de parties distinctes présentes dans la bande sur la fenêtre. */
  voices: number;
  /** Somme des puissances effectives — ce que l'auditeur encaisse dans cette bande. */
  power: number;
  /** « Le tas » : trop de monde dans la même bande (m07-l03). */
  overloaded: boolean;
}

/** Les six bandes du spectre orchestral, en MIDI. */
const BANDS: readonly { label: string; from: number; to: number }[] = [
  { label: 'sub', from: 0, to: 35 },
  { label: 'grave', from: 36, to: 47 },
  { label: 'bas-médium', from: 48, to: 59 },
  { label: 'médium', from: 60, to: 71 },
  { label: 'haut-médium', from: 72, to: 83 },
  { label: 'aigu', from: 84, to: 127 },
];

/** Au-delà, la bande sature : les timbres ne se distinguent plus (« le tas »). */
const MAX_VOICES_PER_BAND = 3;

/**
 * `densityMap(parts, window)` — qui occupe quelle bande, et où ça s'entasse.
 * C'est l'outil du contraste « le tas » (tout le monde au médium) contre
 * « l'immeuble » (chaque étage habité par un seul).
 */
export function densityMap(parts: readonly Part[], window: { from: number; to: number }): BandOccupancy[] {
  return BANDS.map(band => {
    let voices = 0;
    let power = 0;
    for (const part of parts) {
      const inside = part.notes.filter(n =>
        n.start < window.to && n.start + n.duration > window.from &&
        n.pitch >= band.from && n.pitch <= band.to);
      if (inside.length === 0) continue;
      voices++;
      for (const note of inside) {
        const dyn = dynamicAt(part, note.start, note);
        power += instrument(part.instrumentId)
          ? effectivePower(part.instrumentId, note.pitch, dyn, part.mute)
          : 0;
      }
    }
    return { ...band, voices, power, overloaded: voices > MAX_VOICES_PER_BAND };
  });
}

/**
 * `enduranceIssues(part)` (annexe F) — le souffle et les lèvres ne sont pas
 * infinis. On mesure les plages de jeu CONTINU (un silence d'au moins une
 * mesure rend le budget) et on les compare au budget de la famille de tenue,
 * réduit dans l'aigu : une trompette qui reste en haut tient 4 mesures, pas 12.
 */
export function enduranceIssues(part: Part, opts: { meter?: Meter } = {}): Issue[] {
  const inst = instrument(part.instrumentId);
  if (!inst) return [];
  if (inst.sustain !== 'breath' && inst.sustain !== 'lips') return [];

  const bar = barTicks(opts.meter ?? ([4, 4] as Meter));
  const budget = ENDURANCE_BUDGET[inst.sustain];
  const highFrom = inst.range[0] + (inst.range[1] - inst.range[0]) * HIGH_REGISTER_FRACTION;

  const notes = [...part.notes].sort((a, b) => a.start - b.start);
  const issues: Issue[] = [];
  let spanStart: number | null = null;
  let spanEnd = 0;
  let spanHigh = true;

  const close = (): void => {
    if (spanStart === null) return;
    const bars = (spanEnd - spanStart) / bar;
    const allowed = spanHigh ? budget.high : budget.normal;
    if (bars > allowed) {
      issues.push({
        ruleId: `orch.endurance-${inst.sustain}`,
        severity: 'warning',
        atTick: spanStart + allowed * bar,
        message: `${bars} mesures de jeu continu ${spanHigh ? "dans l'aigu " : ''}pour un budget de ${allowed} (${inst.sustain}) — place une respiration`,
        lessonRef: inst.lessonRef,
      });
    }
    spanStart = null;
  };

  for (const note of notes) {
    if (spanStart === null) {
      spanStart = note.start;
      spanEnd = note.start + note.duration;
      spanHigh = note.pitch >= highFrom;
      continue;
    }
    if (note.start - spanEnd >= RECOVERY_BARS * bar) {
      close();
      spanStart = note.start;
      spanEnd = note.start + note.duration;
      spanHigh = note.pitch >= highFrom;
      continue;
    }
    spanEnd = Math.max(spanEnd, note.start + note.duration);
    spanHigh = spanHigh && note.pitch >= highFrom;
  }
  close();
  return issues;
}

/** Les notes hors tessiture — la faute qu'aucune interprétation ne rattrape. */
export function rangeIssues(part: Part): Issue[] {
  const inst = instrument(part.instrumentId);
  if (!inst) return [];
  return part.notes
    .filter(n => n.pitch < inst.range[0] || n.pitch > inst.range[1])
    .map(n => ({
      ruleId: 'orch.range',
      severity: 'error' as const,
      atTick: n.start,
      message: `hors tessiture de ${inst.id} (${inst.range[0]}–${inst.range[1]}) : ${n.pitch}`,
      lessonRef: inst.lessonRef,
    }));
}
