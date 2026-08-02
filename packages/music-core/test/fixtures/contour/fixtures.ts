import { expect } from 'vitest';
import { parseNotation } from '../../../src/notation/parse.js';
import { climaxPosition, contour } from '../../../src/analyzers/contour.js';

export interface Fixture { name: string; run: () => void }

/** m02-s21-hero-theme : climax F5 à 62,5 %, tenu (blanche pointée). */
const S21 =
  'r:h. F4:e Bb4:e~ | Bb4:q C5:e D5:e~ D5:e Bb4:e~ Bb4:e C5:e~ | ' +
  'C5:e A4:e~ A4:e F4:e~ F4:q F4:e Bb4:e~ | Bb4:q C5:e D5:e~ D5:e C5:e~ C5:e Eb5:e~ | ' +
  'Eb5:e D5:e~ D5:e Bb4:e~ Bb4:q Bb4:e F5:e~ | F5:h~ F5:e r:e Bb4:e Bb4:e~ | ' +
  'Bb4:q C5:e D5:e~ D5:e Bb4:e~ Bb4:e C5:e~ | C5:e A4:e~ A4:e Bb4:e~ Bb4:q.';

/** m02-s22-epic-plateau : 6 hauteurs, valeurs larges — `contourShape: ["plateau"]`. */
const S22 = 'A4:h C5:h | B4:h A4:h | A4:h G4:h | A4:w | C5:h D5:h | C5:h B4:h | A4:h G4:h | A4:w';

export const fixtures: Fixture[] = [
  {
    name: 'silhouette-arch',
    run: () => {
      // Item 1 du quiz m02-e09, réponse déclarée « arche » : montée-sommet-descente,
      // « effort, accomplissement, repos — le gabarit par défaut ».
      const r = contour(parseNotation('E4:q G4:q B4:q D5:h C5:q A4:q F4:q E4:h'));
      expect(r.silhouette).toBe('arch');
      expect(r.shape).toBe('UD');
      expect(r.peaks.filter(p => p.isGlobal)).toHaveLength(1);
    },
  },
  {
    name: 'silhouette-descent',
    run: () => {
      // Item 2 du même quiz, réponse « chute (lament) » : « la ligne qui descend
      // sans remonter — la plainte, la fatalité ».
      const r = contour(parseNotation('D5:h C5:q Bb4:q A4:h G4:q F4:q E4:h D4:w'));
      expect(r.silhouette).toBe('descent');
      expect(r.shape).toBe('D');
    },
  },
  {
    name: 'silhouette-ascent',
    run: () => {
      const r = contour(parseNotation('C4:q E4:q G4:q B4:q D5:h'));
      expect(r.silhouette).toBe('ascent');
      expect(r.shape).toBe('U');
    },
  },
  {
    name: 'silhouette-plateau',
    run: () => {
      // Item 3 du quiz, réponse « plateau » : « statisme + micro-mouvements —
      // la tension retenue (le thriller y vit) ». Ambitus 3 demi-tons.
      const r = contour(parseNotation('E4:q F4:q E4:q F4:e E4:e | E4:q G4:q E4:q F4:q'));
      expect(r.silhouette).toBe('plateau');
      expect(r.ambitus).toBe(3);
    },
  },
  {
    name: 'silhouette-wave',
    run: () => {
      // m02-s19-joyful, mes. 1–2 : le rebond — au moins deux alternances.
      const r = contour(parseNotation('D4:e r:s D4:s G4:e A4:e B4:q. G4:e | A4:e B4:e A4:e G4:e A4:q r:q'));
      expect(r.silhouette).toBe('wave');
      expect(r.ambitus).toBeGreaterThan(4);
    },
  },
  {
    name: 'plateau-wins-over-wave',
    run: () => {
      // Le plateau se juge à l'ambitus AVANT toute alternance : la même ligne,
      // élargie d'un ton de trop, bascule en vague.
      expect(contour(parseNotation('E4:q F4:q E4:q F4:q E4:q G4:q')).silhouette).toBe('plateau');
      expect(contour(parseNotation('E4:q F4:q E4:q F4:q E4:q A4:q')).silhouette).toBe('wave');
    },
  },
  {
    name: 'climax-hero-s21',
    run: () => {
      // Le climax F5 du thème héroïque tombe à 62,5 % — exactement ce que les
      // `authorNotes` annoncent, et ce que `climaxWindow: [0.6, 0.85]` exige.
      const position = climaxPosition(parseNotation(S21));
      expect(position).toBeCloseTo(0.62, 2);
      expect(position!).toBeGreaterThanOrEqual(0.6);
      expect(position!).toBeLessThanOrEqual(0.85);
    },
  },
  {
    name: 'peaks-are-strict',
    run: () => {
      // Un sommet est STRICTEMENT plus haut que ses deux voisins : un palier
      // (deux notes égales au sommet) n'en fabrique pas deux.
      const r = contour(parseNotation('C4:q G4:q G4:q C4:q'));
      expect(r.peaks).toHaveLength(0);
      expect(contour(parseNotation('C4:q G4:q E4:q')).peaks.map(p => p.pitch)).toEqual([67]);
    },
  },
  {
    name: 'plateau-divergence-s22',
    run: () => {
      // ÉCART CONNU. `m02-e22` contraint `contourShape: ["plateau"]` et les
      // `authorNotes` de la solution écrivent « plateau (ambitus 7) ✓ » — mais
      // le seuil du tutoriel (« plateau : ambitus ≤ 4 dt ») ne peut pas
      // l'accepter. L'analyseur applique le seuil normatif et lit `wave` ; le
      // désaccord est ici, visible, plutôt que noyé dans un seuil élargi pour
      // faire passer une pièce. À trancher : élargir le seuil ou requalifier
      // la contrainte de e22.
      const r = contour(parseNotation(S22));
      expect(r.ambitus).toBe(7);
      expect(r.silhouette).toBe('wave');
    },
  },
  {
    name: 'empty-line',
    run: () => {
      expect(contour([])).toEqual({ raw: '', shape: '', silhouette: null, peaks: [], ambitus: 0 });
      expect(climaxPosition([])).toBeNull();
    },
  },
];
