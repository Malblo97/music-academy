/**
 * Les 14 formes d'accord du MVP (PHASE1 TUTORIEL_ULTRADETAILLE §S2.J2).
 * Intervalles en demi-tons depuis la fondamentale. `fifthOptional` (F-3) :
 * la quinte peut être omise dans un voicing sans invalider la forme — les
 * accords de 7e (hors m7♭5/dim7, où la quinte altérée EST l'identité) et le
 * mineur-majeur 7.
 */
export interface ChordForm {
  name: string;
  intervals: number[];
  fifthOptional?: boolean;
}

export const CHORD_FORMS: ChordForm[] = [
  { name: 'maj', intervals: [0, 4, 7] },
  { name: 'min', intervals: [0, 3, 7] },
  { name: 'dim', intervals: [0, 3, 6] },
  { name: 'aug', intervals: [0, 4, 8] },
  { name: 'sus2', intervals: [0, 2, 7] },
  { name: 'sus4', intervals: [0, 5, 7] },
  { name: 'maj7', intervals: [0, 4, 7, 11], fifthOptional: true },
  { name: '7', intervals: [0, 4, 7, 10], fifthOptional: true },
  { name: 'm7', intervals: [0, 3, 7, 10], fifthOptional: true },
  { name: 'm7b5', intervals: [0, 3, 6, 10] },
  { name: 'dim7', intervals: [0, 3, 6, 9] },
  { name: 'mMaj7', intervals: [0, 3, 7, 11], fifthOptional: true },
  { name: '6', intervals: [0, 4, 7, 9] },
  { name: 'm6', intervals: [0, 3, 7, 9] },
];
