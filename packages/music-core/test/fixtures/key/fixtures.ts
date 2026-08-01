import { expect } from 'vitest';
import { parseNotation } from '../../../src/notation/parse.js';
import { estimateKey } from '../../../src/analyzers/key.js';

/**
 * S2.J1 — 8 fixtures pour `estimateKey`. Quatre lisent du contenu réel
 * (le format `[pédale+accord]:w × N mesures` de M3 est le meilleur test de
 * F-19 : la pédale EST la ligne de basse) : `d-dorian-bourdon`,
 * `mixo-cadence` et `phrygian-anchor` viennent de m03-e08-seven-worlds
 * (les trois variantes portent une note de production dédiée à F-19 dans
 * leurs `authorNotes`) ; `window` vient de m03-e04-four-faces, mes. 9-12.
 */
export interface Fixture { name: string; run: () => void }

const seven_worlds_dorien =
  '[D2+A3+D4+F4]:w | [D2+B3+D4+G4]:w | [D2+A3+D4+F4]:w | [D2+G3+D4+B4]:w | [D2+A3+F4+A4]:w | [D2+B3+G4+B4]:w | [D2+A3+F4+A4]:w | [D2+C4+E4+G4]:w | [D2+A3+D4+F4]:w | [D2+B3+D4+G4]:w | [D2+B3+D4+G4]:w | [D2+A3+D4+F4]:w';

const seven_worlds_mixolydien =
  '[G2+D4+G4+B4]:w | [G2+C4+F4+A4]:w | [G2+D4+G4+B4]:w | [G2+A3+C4+F4]:w | [G2+B3+D4+G4]:w | [G2+C4+E4+G4]:w | [G2+B3+D4+G4]:w | [G2+C4+F4+A4]:w | [G2+D4+G4+B4]:w | [G2+A3+C4+F4]:w | [G2+C4+F4+A4]:w | [G2+D4+G4+B4]:w';

const seven_worlds_phrygien =
  '[E2+B3+E4+G4]:w | [E2+A3+C4+F4]:w | [E2+B3+E4+G4]:w | [E2+A3+C4+F4]:w | [E2+G3+B3+E4]:w | [E2+C4+F4+A4]:w | [E2+B3+E4+G4]:w | [E2+A3+D4+F4]:w | [E2+B3+E4+G4]:w | [E2+A3+C4+F4]:w | [E2+A3+C4+F4]:w | [E2+G3+B3+E4]:w';

const four_faces =
  '[C3+G3+E4+C5]:w | [C#3+G3+E4+Bb4]:w | [D3+F3+F4+A4]:w | [B2+F3+D4+Ab4]:w | [C3+E3+E4+G4]:w | [A2+E3+C4+A4]:w | [D3+F3+B3+Ab4]:w | [Eb3+G3+Bb3+G4]:w | [Ab2+Ab3+Eb4+C5]:w | [Bb2+G3+Eb4+Bb4]:w | [Bb2+Ab3+Bb3+D5]:w | [Eb3+G3+Bb3+Eb5]:w';

// m01-l24-quiz (s29.2, §29.3) : "collection blanche pesée également sur D et A" — F-11 littéral.
const ambiguous_melody =
  'D4:q E4:q G4:q A4:q | A4:h E4:h | r:q D4:q E4:q G4:q | A4:h. G4:q | A4:q B4:q D5:h | r:h E4:q G4:q | D4:q E4:q G4:q E4:q | E4:w';

export const fixtures: Fixture[] = [
  {
    name: 'c-major-plain',
    run: () => {
      const notes = parseNotation('C4:q D4:q E4:q F4:q G4:q A4:q B4:q C5:h | B4:q A4:q G4:q F4:q E4:q D4:q C4:w');
      const est = estimateKey(notes);
      expect(est.tonic).toBe(0);
      expect(est.mode).toBe('major');
      expect(est.confidence).toBeGreaterThan(0.2);
    },
  },
  {
    name: 'a-minor-harmonic',
    run: () => {
      // mineur harmonique : sensible haussée (G#) exposée, la signature du mode (l06 M1).
      const notes = parseNotation('A4:h B4:q C5:q D5:q E5:q F5:q G#5:q A5:h | G#5:q A5:h.');
      const est = estimateKey(notes);
      expect(est.tonic).toBe(9);
      expect(est.mode).toBe('minor');
    },
  },
  {
    name: 'd-dorian-bourdon',
    run: () => {
      // Bourdon D2 sous collection blanche (le SI naturel = 6̂ majeure expose le dorien, pas l'éolien).
      const notes = parseNotation(seven_worlds_dorien);
      const est = estimateKey(notes);
      expect(est.tonic).toBe(2);
      expect(est.mode).toBe('dorian');
    },
  },
  {
    name: 'mixo-cadence',
    run: () => {
      const notes = parseNotation(seven_worlds_mixolydien);
      const est = estimateKey(notes);
      expect(est.tonic).toBe(7);
      expect(est.mode).toBe('mixolydian');
    },
  },
  {
    name: 'insistence-negative',
    run: () => {
      // Do majeur, pédale de dominante (sol) : la basse insiste sur SOL, mais
      // aucun FA (la note caractéristique du mixolydien de sol) n'est exposé
      // nulle part — le garde-fou F-19 doit refuser de basculer vers sol
      // mixolydien et laisser le verdict Krumhansl (do majeur) intact.
      const notes = parseNotation(
        '[G2+C4+E4+G4]:w [G2+E4+G4+C5]:w [G2+C4+E4+G4]:w [G2+B3+D4+G4]:w [G2+C4+E4+C5]:w',
      );
      const est = estimateKey(notes);
      expect(est.tonic).toBe(0);
      expect(est.mode).toBe('major');
    },
  },
  {
    name: 'ambiguous-f11',
    run: () => {
      const notes = parseNotation(ambiguous_melody);
      const est = estimateKey(notes);
      expect(est.ambiguous).toBe(true);
      expect(est.rawProfiles).toHaveLength(24);
    },
  },
  {
    name: 'phrygian-anchor',
    run: () => {
      const notes = parseNotation(seven_worlds_phrygien);
      const est = estimateKey(notes);
      expect(est.tonic).toBe(4);
      expect(est.mode).toBe('phrygian');
    },
  },
  {
    name: 'window',
    run: () => {
      const notes = parseNotation(four_faces);
      // mes. 8-12 (0-indexé : mesures 7..11 × 1920 ticks) — la sortie du pivot vers mi♭ (m8, I)
      // puis IV → I6/4 → V7 → I (authorNotes : « Confirmation m9–12 »). Le tutoriel cite
      // "mes. 9-14", au-delà des 12 mesures réelles de la pièce (§S2.J1) : fenêtre alignée
      // sur le texte de la solution plutôt que sur la référence de mesures, obsolète.
      const est = estimateKey(notes, { window: [7 * 1920, 12 * 1920] });
      expect(est.tonic).toBe(3);
      expect(est.mode).toBe('major');
    },
  },
];
