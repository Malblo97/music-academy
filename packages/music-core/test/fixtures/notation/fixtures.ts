import { expect } from 'vitest';
import { parseNotation } from '../../../src/notation/parse.js';
import { applySwing, measureSwingRatio } from '../../../src/notation/swing.js';
import { applyHumanize } from '../../../src/notation/humanize.js';

/**
 * S1.J4 — les 16 cas auto-portés du parseur/swing/humanize (sur 18 : les deux
 * derniers, `solution-m03-s02` et `roundtrip-batch`, lisent du contenu réel et
 * vivent dans `solutions.test.ts` à côté).
 *
 * Chaque cas est un thunk plutôt qu'un `{input, expect}` générique : les formes
 * sont trop hétérogènes (tableaux de notes, erreurs, ratios, bornes) pour un
 * comparateur unique sans perdre en précision sur les valeurs vérifiées.
 */
export interface Fixture { name: string; run: () => void }

export const fixtures: Fixture[] = [
  {
    name: 'basic-melody',
    run: () => {
      const notes = parseNotation('C4:q D4:e E4:e F4:h');
      expect(notes).toHaveLength(4);
      expect(notes.map(n => n.start)).toEqual([0, 480, 720, 960]);
      expect(notes.map(n => n.duration)).toEqual([480, 240, 240, 960]);
      expect(notes.map(n => n.pitch)).toEqual([60, 62, 64, 65]);
    },
  },
  {
    name: 'dotted',
    run: () => {
      const notes = parseNotation('G4:q.');
      expect(notes).toHaveLength(1);
      expect(notes[0]!.duration).toBe(720);
    },
  },
  {
    name: 'tie-mono',
    run: () => {
      const notes = parseNotation('E5:h~ E5:q');
      expect(notes).toHaveLength(1);
      expect(notes[0]!.start).toBe(0);
      expect(notes[0]!.duration).toBe(1440);
    },
  },
  {
    name: 'tie-mono-broken',
    run: () => {
      expect(() => parseNotation('E5:h~ F5:q')).toThrow(/liaison.*sans cible/);
    },
  },
  {
    name: 'chords',
    run: () => {
      const notes = parseNotation('[C3+E4+G4]:w');
      expect(notes).toHaveLength(3);
      expect(notes.every(n => n.start === 0 && n.duration === 1920)).toBe(true);
      expect([...notes.map(n => n.pitch)].sort((a, b) => a - b)).toEqual([48, 64, 67]);
    },
  },
  {
    name: 'inner-tie-f21',
    run: () => {
      const notes = parseNotation('[E4~+F4]:q [E4+G4]:q');
      expect(notes).toHaveLength(3);
      const e4 = notes.find(n => n.pitch === 64);
      const f4 = notes.find(n => n.pitch === 65);
      const g4 = notes.find(n => n.pitch === 67);
      expect(e4).toMatchObject({ start: 0, duration: 960 });
      expect(f4).toMatchObject({ start: 0, duration: 480 });
      expect(g4).toMatchObject({ start: 480, duration: 480 });
    },
  },
  {
    name: 'inner-tie-invalid',
    run: () => {
      expect(() => parseNotation('[E4~+F4]:q [G4+A4]:q')).toThrow(/liaison.*sans cible/);
    },
  },
  {
    name: 'rests',
    run: () => {
      const notes = parseNotation('r:q C4:q r:h');
      expect(notes).toHaveLength(1);
      expect(notes[0]!.start).toBe(480);
      expect(notes[0]!.duration).toBe(480);
    },
  },
  {
    name: 'accidentals',
    run: () => {
      const notes = parseNotation('F#3:q Bb4:q B#3:q');
      expect(notes.map(n => n.pitch)).toEqual([54, 70, 60]);
      expect(notes.map(n => n.spelling)).toEqual(['F#3', 'Bb4', 'B#3']);
    },
  },
  {
    name: 'bars-ignored',
    run: () => {
      const notes = parseNotation('C4:h D4:h | E4:w');
      expect(notes).toHaveLength(3);
    },
  },
  {
    name: 'bars-strict',
    run: () => {
      expect(() => parseNotation('C4:h D4:h | E4:w', { strictBars: true, meter: [3, 4] }))
        .toThrow(/erreur de mesure/);
    },
  },
  {
    name: 'swing-2.0',
    run: () => {
      const swung = applySwing(parseNotation('C4:e D4:e C4:e D4:e'), 2);
      expect(swung.map(n => n.start)).toEqual([0, 320, 480, 800]);
      expect(swung.map(n => n.duration)).toEqual([240, 160, 240, 160]);
    },
  },
  {
    name: 'swing-quarters-noop',
    run: () => {
      const original = parseNotation('C4:q D4:q');
      const swung = applySwing(original, 2);
      expect(swung.map(n => n.start)).toEqual(original.map(n => n.start));
      expect(swung.map(n => n.duration)).toEqual(original.map(n => n.duration));
      expect(swung.map(n => n.start)).toEqual([0, 480]);
      expect(swung.map(n => n.duration)).toEqual([480, 480]);
    },
  },
  {
    name: 'swing-measure',
    run: () => {
      const swung = applySwing(parseNotation('C4:e D4:e C4:e D4:e'), 2);
      const ratio = measureSwingRatio(swung);
      expect(ratio).not.toBeNull();
      expect(Math.abs(ratio! - 2.0)).toBeLessThan(1e-9);
      expect(measureSwingRatio(parseNotation('C4:q D4:q'))).toBeNull();
    },
  },
  {
    name: 'humanize-deterministic',
    run: () => {
      const notes = parseNotation('C4:q D4:q E4:q F4:q');
      const a = applyHumanize(notes, { seed: 42, offsetRange: 10 });
      const b = applyHumanize(notes, { seed: 42, offsetRange: 10 });
      expect(a).toEqual(b);
    },
  },
  {
    name: 'humanize-bounds',
    run: () => {
      const notes = parseNotation('C4:q D4:q E4:q F4:q');
      const humanized = applyHumanize(notes, { seed: 7, offsetRange: 18 });
      expect(humanized[0]).toEqual(notes[0]);
      for (let i = 1; i < notes.length; i++) {
        expect(Math.abs(humanized[i]!.start - notes[i]!.start)).toBeLessThanOrEqual(18);
      }
    },
  },
];
