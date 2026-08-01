import { expect } from 'vitest';
import { parseNotation } from '../../../src/notation/parse.js';
import { detectChord } from '../../../src/analyzers/chord.js';
import { detectCadences } from '../../../src/analyzers/cadence.js';
import type { TimedChord } from '../../../src/analyzers/cadence.js';
import type { KeyEstimate } from '../../../src/analyzers/key.js';
import type { Note } from '../../../src/types.js';

export interface Fixture { name: string; run: () => void }

function key(tonic: number, mode: KeyEstimate['mode']): KeyEstimate {
  return { tonic, mode, confidence: 1, ambiguous: false, alternates: [], rawProfiles: [] };
}

/** Construit un TimedChord pour la fenêtre [from,to) d'une séquence déjà parsée. */
function chordAt(notes: readonly Note[], from: number, to: number, idiomTags?: string[]): TimedChord {
  const windowNotes = notes.filter(n => n.start < to && n.start + n.duration > from);
  const chord = detectChord(notes, { from, to });
  if (!chord) throw new Error(`fixture cadence : aucun accord détecté sur [${from},${to})`);
  return idiomTags ? { chord, from, to, notes: windowNotes, idiomTags } : { chord, from, to, notes: windowNotes };
}

/** Découpe une séquence de N accords-mesures (chacun `:w`, 1920 ticks) en TimedChord[]. */
function barChords(notation: string, tagsByBar: Record<number, string[]> = {}): TimedChord[] {
  const notes = parseNotation(notation);
  const bars = notation.split('|').length;
  return Array.from({ length: bars }, (_, i) => chordAt(notes, i * 1920, (i + 1) * 1920, tagsByBar[i]));
}

export const fixtures: Fixture[] = [
  {
    name: 'perfect-basic',
    run: () => {
      // G7 (fondamentale à la basse) → C (fondamentale à la basse, soprano 1̂).
      const chords = barChords('[G2+B3+D4+F4]:w | [C3+E4+G4+C5]:w');
      const events = detectCadences(chords, key(0, 'major'), { segmentEnd: 3840 });
      expect(events).toEqual([{ kind: 'perfect', at: 1920 }]);
    },
  },
  {
    name: 'imperfect-soprano-3',
    run: () => {
      // Même V7→I, mais soprano sur 3̂ (E) au lieu de 1̂ : une des quatre conditions manque (l16 M1).
      const chords = barChords('[G2+B3+D4+F4]:w | [C3+G3+C4+E5]:w');
      const events = detectCadences(chords, key(0, 'major'), { segmentEnd: 3840 });
      expect(events).toEqual([{ kind: 'imperfect', at: 1920 }]);
    },
  },
  {
    name: 'half-hold',
    run: () => {
      // I → V, l'accord d'arrivée tient une mesure entière (F-5) : demi-cadence.
      const chords = barChords('[C3+E4+G4+C5]:w | [G2+B3+D4+G4]:w');
      const events = detectCadences(chords, key(0, 'major'), { segmentEnd: 3840 });
      expect(events).toEqual([{ kind: 'half', at: 1920 }]);
    },
  },
  {
    name: 'deceptive',
    run: () => {
      // V7 → vi (la) : la maison promise arrive... dans le mauvais monde (l16 M1).
      const chords = barChords('[G2+B3+D4+F4]:w | [A3+C4+E4+A4]:w');
      const events = detectCadences(chords, key(0, 'major'), { segmentEnd: 3840 });
      expect(events).toEqual([{ kind: 'deceptive', at: 1920 }]);
    },
  },
  {
    name: 'plagal',
    run: () => {
      // IV → I : la cadence "amen" (l16 M1).
      const chords = barChords('[F3+A3+C4+F4]:w | [C3+E4+G4+C5]:w');
      const events = detectCadences(chords, key(0, 'major'), { segmentEnd: 3840 });
      expect(events).toEqual([{ kind: 'plagal', at: 1920 }]);
    },
  },
  {
    name: 'passing-not-cadence-f5',
    run: () => {
      // m03-s04-four-faces, mes. 4-5 : vii°7 (B-D-F-Ab) → I. Un vrai vii°7→I fonctionne comme
      // un authentique "resserré", mais N'EST PAS la cadence parfaite au sens strict (l16 M1
      // exige V7, pas vii°) — et ce n'est de toute façon qu'un geste médian (l'INTENSIFICATEUR
      // des "trois métiers" de la pièce), pas une fin de phrase.
      const chords = barChords('[B2+F3+D4+Ab4]:w | [C3+E3+E4+G4]:w');
      const events = detectCadences(chords, key(0, 'major'), {}); // pas segmentEnd : au milieu de la pièce
      expect(events).toEqual([]);
    },
  },
  {
    name: 'mono-perfect-f2',
    run: () => {
      // Repli monophonique (F-2) : pénultième 7̂ (B), finale 1̂ (C) longue sur temps fort.
      // "|" est un séparateur visuel ignoré par le parseur : B4 doit remplir toute la
      // mesure (:w) pour que C5 démarre bien au tick 1920 (temps fort).
      const notes = parseNotation('B4:w | C5:w');
      const events = detectCadences([], key(0, 'major'), { melodyOnly: notes });
      expect(events).toEqual([{ kind: 'perfect', at: 1920 }]);
    },
  },
  {
    name: 'mono-half-f2',
    run: () => {
      // Finale sur 2̂ (D), "suspendue" — demi-cadence même sans harmonie.
      const notes = parseNotation('C4:q D4:q E4:q D4:h');
      const events = detectCadences([], key(0, 'major'), { melodyOnly: notes });
      expect(events).toEqual([{ kind: 'half', at: notes[notes.length - 1]!.start }]);
    },
  },
  {
    name: 'ger6-half-not-subv-f16',
    run: () => {
      // L'exemple du format de fixture (S1, plus haut) : Ger6 de sol mineur (Eb-Bb-C#-G,
      // lu "7" sur Eb — F-6) → V (D-F#-A). Sans le tag aug6, un moteur naïf pourrait lire
      // "Eb7 → D" comme un authentique resserré par sous-dominante substituée (le monde du
      // subV) ; avec le tag, la paire reste jugée DANS sol mineur : demi-cadence, jamais
      // "parfaite" vers un ailleurs.
      const notes = parseNotation('[Eb2+Bb3+C#4+G4]:w | [D2+A3+D4+F#4]:w');
      const chords: TimedChord[] = [
        chordAt(notes, 0, 1920, ['aug6']),
        chordAt(notes, 1920, 3840),
      ];
      const events = detectCadences(chords, key(7, 'minor'), { segmentEnd: 3840 });
      expect(events).toEqual([{ kind: 'half', at: 1920 }]);
      expect(events.some(e => e.kind === 'perfect')).toBe(false);
    },
  },
];
