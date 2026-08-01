import { expect } from 'vitest';
import { parseNotation } from '../../../src/notation/parse.js';
import { detectChord, classifyNonChordTone } from '../../../src/analyzers/chord.js';
import type { PedalPlan } from '../../../src/analyzers/chord.js';
import { CHORD_FORMS } from '../../../src/data/chordForms.js';

export interface Fixture { name: string; run: () => void }

/** Fenêtre couvrant toute la durée des notes (les fixtures ne posent qu'un seul événement). */
function fullWindow(notes: { start: number; duration: number }[]) {
  return { from: 0, to: Math.max(...notes.map(n => n.start + n.duration)) };
}

const formFixtures: Fixture[] = CHORD_FORMS.flatMap(form => {
  const rootMidi = 60; // C4
  const voicingClose = `[${['C4', ...form.intervals.slice(1).map(iv => midiName(rootMidi + iv))].join('+')}]:w`;
  const voicingSpread = `[${['C3', ...form.intervals.slice(1).map(iv => midiName(rootMidi + 12 + iv))].join('+')}]:w`;

  return [
    {
      name: `form-${form.name}-close`,
      run: () => {
        const notes = parseNotation(voicingClose);
        const result = detectChord(notes, fullWindow(notes));
        expect(result?.form).toBe(form.name);
        expect(result?.root).toBe(0); // C
      },
    },
    {
      name: `form-${form.name}-spread`,
      run: () => {
        const notes = parseNotation(voicingSpread);
        const result = detectChord(notes, fullWindow(notes));
        expect(result?.form).toBe(form.name);
        expect(result?.root).toBe(0);
      },
    },
  ];
});

/** Nom MIDI minimal (pas d'orthographe — seul le pitch compte pour ces fixtures). */
function midiName(midi: number): string {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const oct = Math.floor(midi / 12) - 1;
  return `${names[((midi % 12) + 12) % 12]}${oct}`;
}

export const fixtures: Fixture[] = [
  ...formFixtures,
  {
    name: 'enharmonic-ger6',
    run: () => {
      // Eb-G-Bb-C# : Ger6 de sol mineur, épelé enharmoniquement (C# = Db, F-6) — se lit "7" sur Eb.
      const notes = parseNotation('[Eb3+G3+Bb3+C#4]:w');
      const result = detectChord(notes, fullWindow(notes));
      expect(result?.form).toBe('7');
      expect(result?.root).toBe(3); // Eb
    },
  },
  {
    name: 'incomplete-rejected',
    run: () => {
      // D3+F3 (+ D doublé) : tierce mineure sans quinte — 'min' n'est pas fifthOptional (F-3).
      const notes = parseNotation('[D3+F3+D4+D4]:w');
      const result = detectChord(notes, fullWindow(notes));
      expect(result).toBeNull();
    },
  },
  {
    name: 'seventh-no-fifth-ok',
    run: () => {
      // G-B-F : dominante 7e sans quinte — '7' EST fifthOptional (F-3).
      const notes = parseNotation('[G2+B3+F4]:w');
      const result = detectChord(notes, fullWindow(notes));
      expect(result?.form).toBe('7');
      expect(result?.root).toBe(7); // G
    },
  },
  {
    name: 'pedal-excluded-f18',
    run: () => {
      // m03-s07-the-stubborn-ground-pedale-gagne, mes. 7 : [G2+F4+A4+C5] sur pédale de sol
      // frottée — sans le patch F-18, ça se lit "G9(no3)" ; avec, F majeur (F-A-C).
      const notes = parseNotation('[G2+F4+A4+C5]:w');
      const pedalPlan: PedalPlan = { pc: 7, ranges: [{ from: 0, to: 1920, state: 'frottee' }] };
      const result = detectChord(notes, { from: 0, to: 1920 }, { pedalPlan });
      expect(result?.form).toBe('maj');
      expect(result?.root).toBe(5); // F
      expect(result?.pcs).not.toContain(7); // la pédale (sol) a été retirée avant le matching
    },
  },
  {
    name: 'nct-passing',
    run: () => {
      // Do (accord) - Ré (passante, temps faible) - Mi (accord) : conjoint, même direction.
      const kind = classifyNonChordTone({ pitch: 62, tied: false }, 60, 64, 'weak');
      expect(kind).toBe('passing');
    },
  },
  {
    name: 'nct-appoggiatura',
    run: () => {
      // Saut vers Fa sur temps fort, résolution conjointe descendante vers Mi (pas de préparation).
      const kind = classifyNonChordTone({ pitch: 65, tied: false }, 60, 64, 'strong');
      expect(kind).toBe('appoggiatura');
    },
  },
  {
    name: 'nct-suspension',
    run: () => {
      // Ré tenu (préparé, même hauteur que la voix précédente) sur temps fort, résolution
      // conjointe descendante vers Do — le retard classique de la 4e espèce (M4).
      const kind = classifyNonChordTone({ pitch: 62, tied: true }, 62, 60, 'strong');
      expect(kind).toBe('suspension');
    },
  },
];
