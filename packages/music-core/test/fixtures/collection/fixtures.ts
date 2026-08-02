import { expect } from 'vitest';
import { parseNotation } from '../../../src/notation/parse.js';
import { collectionCoverage, detectCollection, rotationOf, STRICT_COVERAGE } from '../../../src/analyzers/collection.js';

export interface Fixture { name: string; run: () => void }

/** m03-s09-world-and-arrow — LE MONDE (m1–9) : G7♯11 bouclé sur pédale de sol. */
const S09 =
  '[G2+F3+B3+D4]:h [G2+F3+B3+E4]:h | [G2+F3+B3+C#4]:h~[G2+F3+B3+C#4]:h | ' +
  '[G2+F3+B3+D4]:h [G2+F3+B3+F4]:h | [G2+F3+B3+E4]:h [G2+F3+B3+D4]:h | ' +
  '[G2+F3+B3+C#4]:w | [G2+F3+B3+D4]:h [G2+F3+B3+E4]:h | ' +
  '[G2+F3+B3+F4]:h [G2+F3+B3+E4]:h | [G2+F3+B3+D4]:w | [G2+F3+B3+C#4]:w';

/** m03-s11-weightless — LE SOL (m1–4, do majeur) puis L'APESANTEUR (m6–13, WT1). */
const S11 =
  '[C3+G3+E4+C5]:w | [F2+A3+F4+C5]:w | [G2+B3+F4+D5]:w | [C3+G3+E4+C5]:w | [G2+B3+F4+D#5]:w | ' +
  '[Db3~+F3~+A3~+B4]:h [Db3+F3+A3+A4]:h | [Eb3~+G3~+B3~+G4]:h [Eb3+G3+B3+F4]:h | ' +
  '[Db3~+F3~+A3~+A4]:h [Db3+F3+A3+B4]:h | [Eb3~+G3~+B3~+Db5]:h [Eb3+G3+B3+B4]:h | ' +
  '[Db3+F3+A3+Eb5]:w | [Eb3~+G3~+B3~+Db5]:h [Eb3+G3+B3+A4]:h | ' +
  '[Db3~+F3~+A3~+G4]:h [Db3+F3+A3+F4]:h | [Eb3+G3+B3+B4]:w | [G2+G3+B3+F4]:w | [C3+G3+C4+E4]:w';

/** m03-s12-the-lying-compass, variante « corruption » : le thème entre dans OCT(C). */
const S12A =
  '[Eb3+Bb3+G4]:h [F#3+Db4+A4]:h | [A3+E4+C5]:h [F#3+Db4+A4]:h | ' +
  '[C3+G3+E4]:h [Eb3+Bb3+F#4]:h | [C3+G3+Eb4+G4]:w | ' +
  '[Db4+E4+A4]:h [A3+E4+Db5]:h | [Eb3+G3+Bb4]:h [C3+G3+Eb4+C5]:h | ' +
  '[F#3+Db4+A4]:h [F#3+Bb3+Db4+F#4]:h | [Eb2+Bb3+G4]:w';

/** m03-s10-white-light : tout ∈ sol diatonique, le pôle par insistance. */
const S10 =
  '[G3+A3+B3+D4]:w | [G3+C4+D4+G4]:w | [A3+B3+E4+F#4]:w | [G3+A3+D4+E4]:w | ' +
  '[G3+B3+C4+D4]:w | [G3+C4+D4+A4]:w | [B3+C4+D4+E4]:w | [G2+D3+A3+E4]:w';

/** Bornes de la section « apesanteur » de s11 : mesures 6 à 13 incluses. */
const WT_WINDOW: [number, number] = [5 * 1920, 13 * 1920];

export const fixtures: Fixture[] = [
  {
    name: 'collection-lydian-b7-f20',
    run: () => {
      // F-20 : {D,E,F,G,A,B,C♯} n'est AUCUNE rotation diatonique — c'est ré mineur
      // mélodique, et le G7♯11 de s09 en est la 4e rotation (lydien ♭7). Sans la
      // famille melodic-minor, cette sonorité restait indétectable.
      const result = detectCollection(parseNotation(S09));
      expect(result).toEqual({ family: 'melodic-minor', transposition: 2, coverage: 1 });
      expect(rotationOf('melodic-minor', 2, 7)).toBe(4); // sol = IVe degré de ré mineur mélodique
    },
  },
  {
    name: 'lydian-b7-not-diatonic',
    run: () => {
      // Le garde-fou de F-20 : la meilleure lecture diatonique de la même fenêtre
      // n'atteint PAS le seuil strict (le fa naturel et le do♯ ne cohabitent
      // dans aucune gamme majeure) — voilà pourquoi la famille était nécessaire.
      const notes = parseNotation(S09);
      const best = Math.max(...Array.from({ length: 12 }, (_, t) => collectionCoverage(notes, 'diatonic', t)));
      expect(best).toBeLessThan(STRICT_COVERAGE);
    },
  },
  {
    name: 'wholetone-wt1',
    run: () => {
      // s11 m6–13 : WT1 {D♭,E♭,F,G,A,B} — aucun demi-ton nulle part.
      const result = detectCollection(parseNotation(S11), WT_WINDOW);
      expect(result).toEqual({ family: 'whole-tone', transposition: 1, coverage: 1 });
    },
  },
  {
    name: 'octatonic-c',
    run: () => {
      // s12a : les quatre nœuds C/E♭/F♯/A et le thème corrompu vivent dans OCT(C).
      const result = detectCollection(parseNotation(S12A));
      expect(result?.family).toBe('octatonic');
      expect(result?.transposition).toBe(0);
      expect(result?.coverage).toBe(1);
    },
  },
  {
    name: 'diatonic-white',
    run: () => {
      // s10 : sol diatonique, le fa♯ compris (voix interne non cadentielle).
      const result = detectCollection(parseNotation(S10));
      expect(result).toEqual({ family: 'diatonic', transposition: 7, coverage: 1 });
    },
  },
  {
    name: 'pentatonic-preferred-over-diatonic',
    run: () => {
      // La plus PETITE collection qui tienne gagne : une mélodie pentatonique est
      // aussi « diatonique à 100 % », et ce verdict-là n'apprendrait rien.
      const result = detectCollection(parseNotation('C4:q D4:q E4:q G4:q A4:q C5:h'));
      expect(result).toEqual({ family: 'pentatonic', transposition: 0, coverage: 1 });
    },
  },
  {
    name: 'chromatic-last-resort',
    run: () => {
      // Les douze pcs exposées : aucune collection plus étroite ne tient.
      const result = detectCollection(parseNotation(
        'C4:q C#4:q D4:q D#4:q E4:q F4:q F#4:q G4:q G#4:q A4:q A#4:q B4:q'));
      expect(result?.family).toBe('chromatic');
    },
  },
  {
    name: 'window-changes-the-verdict',
    run: () => {
      // Le même tableau de notes, deux fenêtres, deux mondes : c'est la pièce
      // entière de s11 (« trois états de gravité »), pas deux pièces.
      const notes = parseNotation(S11);
      expect(detectCollection(notes, [0, 4 * 1920])?.family).toBe('diatonic');
      expect(detectCollection(notes, WT_WINDOW)?.family).toBe('whole-tone');
    },
  },
  {
    name: 'coverage-strict-threshold',
    run: () => {
      // `collectionCoverage` répond à la question INVERSE (celle de
      // `requireCollection`) : la collection est imposée, on mesure ce qui en sort.
      const notes = parseNotation(S11);
      expect(collectionCoverage(notes, 'whole-tone', 1, WT_WINDOW)).toBe(1);
      // Sur la pièce entière, WT1 ne tient plus : le sol fonctionnel n'en est pas.
      expect(collectionCoverage(notes, 'whole-tone', 1)).toBeLessThan(STRICT_COVERAGE);
    },
  },
  {
    name: 'empty-window',
    run: () => {
      expect(detectCollection(parseNotation('C4:q D4:q'), [9600, 11520])).toBeNull();
    },
  },
];
