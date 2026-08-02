import { expect } from 'vitest';
import { parseNotation } from '../../../src/notation/parse.js';
import { findMotifs } from '../../../src/analyzers/motifs.js';
import type { Motif, MotifReport, Occurrence } from '../../../src/analyzers/motifs.js';

export interface Fixture { name: string; run: () => void }

function report(notation: string): MotifReport {
  return findMotifs(parseNotation(notation));
}

/** Le motif ancré au tick `anchor` et long de `length` notes. */
function motif(r: MotifReport, anchor: number, length: number): Motif {
  const found = r.motifs.find(m => m.anchor === anchor && m.length === length);
  if (!found) {
    const seen = r.motifs.map(m => `@${m.anchor}×${m.length}`).join(' ');
    throw new Error(`fixture motifs : aucun motif @${anchor} de ${length} notes (obtenus : ${seen || 'aucun'})`);
  }
  return found;
}

function kinds(occurrences: readonly Occurrence[]): string[] {
  return occurrences.map(o => (o.sub ? `${o.kind}/${o.sub}` : o.kind));
}

/**
 * m02-s07-transform-lab : ancrage ×2, augmentation exacte b3–4 (F-10),
 * fragmentation de la tête b5–6, occurrence finale b7.
 */
const S07 =
  'A4:q. E4:e F4:q D4:q | A4:q. E4:e F4:q D4:q | A4:h. E4:q | F4:h D4:h | ' +
  'A4:q. E4:e A4:q. E4:e | A4:e E4:e A4:e E4:e G4:e E4:e F4:q | ' +
  'A4:q. E4:e F4:q D4:q | C4:q B3:q A3:h';

/** m02-s08-fragment-drive : 2 occurrences complètes (F-13), fragments martelés. */
const S08 =
  'D4:q A4:q~ A4:e G4:e F4:q | D4:q A4:q~ A4:e G4:e F4:q | ' +
  'D4:e A4:e G4:e r:e D4:e A4:e G4:e r:e | E4:e B4:e A4:e r:e E4:e B4:e A4:e r:e | ' +
  'F4:e C5:e Bb4:e F4:e C5:e Bb4:e A4:e C5:e | D5:h. C5:q | ' +
  'Bb4:q A4:q G4:q E4:q | E4:q C#4:q D4:h';

/**
 * Banc de fragmentation : une tête au saut de sixte (+9) suivie d'un remplissage
 * conjoint (−2,−2), énoncée deux fois, puis la tête martelée seule (3 fois) et
 * le remplissage martelé seul (3 fois).
 */
const FRAGMENT_BENCH =
  'C4:q A4:q G4:q F4:q | C4:q A4:q G4:q F4:q | ' +
  'C4:e A4:e G4:e r:e D4:e B4:e A4:e r:e E4:e C#5:e B4:e r:e r:e | ' +
  'C5:e Bb4:e Ab4:e r:e B4:e A4:e G4:e r:e A4:e G4:e F4:e r:e r:e';

export const fixtures: Fixture[] = [
  {
    name: 'exact-x3',
    run: () => {
      const r = report('C4:q E4:q G4:h | C4:q E4:q G4:h | C4:q E4:q G4:h');
      expect(kinds(motif(r, 0, 3).occurrences)).toEqual(['exact', 'exact', 'exact']);
      expect(r.maxExactRepetitions).toBe(3);
      expect(r.hasVariedRepetition).toBe(false);
      expect(r.bestMotif?.anchor).toBe(0);
      expect(r.bestMotif?.intervalShape).toEqual([4, 3]);
      expect(r.bestMotif?.rhythmShape).toEqual([1, 1, 2]);
    },
  },
  {
    name: 'transposed-real',
    run: () => {
      // +5 exact : les intervalles sont identiques, l'ancrage est libre. Ce n'est
      // PAS « exact » — sinon la fixture précédente et celle-ci se confondraient.
      const r = report('C4:q E4:q G4:h | F4:q A4:q C5:h');
      expect(kinds(motif(r, 0, 3).occurrences)).toEqual(['exact', 'transposed/real']);
      expect(r.hasVariedRepetition).toBe(true);
    },
  },
  {
    name: 'tonal-f12',
    run: () => {
      // F-12 : la réponse TONALE reste dans la gamme, donc les intervalles
      // bougent de ±1 dt (G–A–B–C : +2,+2,+1 ; E–F–G–A : +1,+2,+2). Contour et
      // rythme intacts → acceptée comme transposition, sous-type tonal.
      const r = report('G4:q A4:q B4:q C5:q | E4:q F4:q G4:q A4:q');
      expect(kinds(motif(r, 0, 4).occurrences)).toEqual(['exact', 'transposed/tonal']);
    },
  },
  {
    name: 'tonal-vs-real-answer',
    run: () => {
      // La réponse RÉELLE du même sujet (E–F♯–G♯–A : +2,+2,+1, intervalles
      // identiques) est classée `real`, pas `tonal` — c'est précisément la
      // distinction que F-12 sert à rendre visible.
      const r = report('G4:q A4:q B4:q C5:q | E4:q F#4:q G#4:q A4:q');
      expect(kinds(motif(r, 0, 4).occurrences)).toEqual(['exact', 'transposed/real']);
    },
  },
  {
    name: 'tonal-negative-contour',
    run: () => {
      // Le garde-fou du CONTOUR. Rester à ±1 dt tout en changeant de signe n'est
      // possible que par l'immobilité : la dernière note répétée (0) là où le
      // sujet montait (+1). Le sujet complet n'a donc plus d'occurrence.
      const r = report('G4:q A4:q B4:q C5:q | E4:q F#4:q G#4:q G#4:q');
      expect(r.motifs.filter(m => m.length === 4)).toEqual([]);
    },
  },
  {
    name: 'tonal-negative-rhythm',
    run: () => {
      // Le garde-fou du RYTHME : intervalles tonalement proches mais durées
      // changées → aucune transposition n'est reconnue.
      const r = report('G4:q A4:q B4:q C5:q | E4:q F4:q G4:e A4:e r:q');
      expect(r.motifs.filter(m => m.length === 4)).toEqual([]);
      expect(r.motifs.every(m => m.occurrences.every(o => o.sub !== 'tonal'))).toBe(true);
    },
  },
  {
    name: 'augmentation-f10',
    run: () => {
      // F-10 : doubler toutes les durées ne change AUCUN ratio — `rhythmShape`
      // est identique de part et d'autre. Seul le facteur d'échelle ABSOLU (×2)
      // révèle l'augmentation.
      const r = report('C4:q D4:q E4:h | C4:h D4:h E4:w');
      const m = motif(r, 0, 3);
      expect(kinds(m.occurrences)).toEqual(['exact', 'rhythmic/augmentation']);
      expect(m.rhythmShape).toEqual([1, 1, 2]);
    },
  },
  {
    name: 'diminution-f10',
    run: () => {
      // Le miroir : ×0.5 ≤ 0.67 → diminution.
      const r = report('C4:h D4:h E4:w | C4:q D4:q E4:h');
      expect(kinds(motif(r, 0, 3).occurrences)).toEqual(['exact', 'rhythmic/diminution']);
    },
  },
  {
    name: 'augmentation-f10-s07',
    run: () => {
      // Le cas réel : m02-s07-transform-lab, l'ancrage ×2 puis l'augmentation
      // exacte des mes. 3–4 (facteur 2), puis l'occurrence finale mes. 7.
      const r = report(S07);
      const m = motif(r, 0, 4);
      expect(kinds(m.occurrences)).toEqual(['exact', 'exact', 'rhythmic/augmentation', 'exact']);
      expect(r.maxExactRepetitions).toBe(3);
      expect(r.hasVariedRepetition).toBe(true);
    },
  },
  {
    name: 'inverted',
    run: () => {
      // Le miroir exact : +4,+3,+5 → −4,−3,−5, rythme conservé.
      const r = report('C4:q E4:q G4:q C5:q | C4:q Ab3:q F3:q C3:q');
      expect(kinds(motif(r, 0, 4).occurrences)).toEqual(['exact', 'inverted']);
    },
  },
  {
    name: 'inverted-too-short',
    run: () => {
      // Le garde-fou : 2 intervalles seulement. Deux notes descendantes après
      // deux notes montantes, ce n'est pas une inversion, c'est un hasard.
      const r = report('C4:q E4:q G4:q | C4:q Ab3:q F3:q');
      expect(r.motifs.every(m => m.occurrences.every(o => o.kind !== 'inverted'))).toBe(true);
    },
  },
  {
    name: 'inverted-negative-rhythm-changed',
    run: () => {
      // Miroir intervallique correct, mais le rythme ne tient plus : refusé.
      const r = report('C4:q E4:q G4:q C5:q | C4:e Ab3:e F3:q C3:h');
      expect(r.motifs.every(m => m.occurrences.every(o => o.kind !== 'inverted'))).toBe(true);
    },
  },
  {
    name: 'fragment-distinctive',
    run: () => {
      // La tête au saut de sixte, fragmentée SUR le saut : elle porte l'aspérité
      // du parent (son intervalle maximal) → `isDistinctive`.
      const r = report(FRAGMENT_BENCH);
      const head = r.fragments.find(f => f.anchor === 0);
      expect(head?.intervalShape).toEqual([9, -2]);
      expect(head?.isDistinctive).toBe(true);
      expect(head?.occurrences.length).toBe(3);
    },
  },
  {
    name: 'fragment-filler',
    run: () => {
      // Le fragment conjoint du remplissage : martelé autant de fois, mais il ne
      // porte rien du parent — « tu fragmentes le remplissage » (le feedback les
      // distingue, donc l'analyseur doit les distinguer).
      const r = report(FRAGMENT_BENCH);
      const filler = r.fragments.find(f => f.anchor === 480);
      expect(filler?.intervalShape).toEqual([-2, -2]);
      expect(filler?.isDistinctive).toBe(false);
      expect(filler?.occurrences.length).toBe(3);
    },
  },
  {
    name: 'covered-set',
    run: () => {
      // Les occurrences COMPLÈTES du parent n'alimentent pas le compte des
      // fragments : la tête et le remplissage apparaissent 2 fois de plus dans
      // les deux énoncés complets, et ces 2 fois-là ne comptent pas — sinon
      // « fragmenter » ne voudrait plus rien dire.
      const r = report(FRAGMENT_BENCH);
      const parent = motif(r, 0, 4);
      expect(kinds(parent.occurrences)).toEqual(['exact', 'exact']);
      for (const anchor of [0, 480]) {
        const fragment = r.fragments.find(f => f.anchor === anchor);
        expect(fragment?.parentAnchor).toBe(0);
        expect(fragment?.occurrences.length).toBe(3); // 5 apparitions − 2 couvertes
      }
    },
  },
  {
    name: 'fragment-drive-s08',
    run: () => {
      // Le cas réel : m02-s08-fragment-drive. 2 occurrences complètes seulement
      // (F-13 : `minMotifOccurrences` dimensionné sur les occurrences complètes
      // quand `requireFragmentation` est actif), et le fragment de 3 notes
      // (+7,−2) — l'aspérité — martelé puis transposé.
      const r = report(S08);
      expect(kinds(motif(r, 0, 4).occurrences)).toEqual(['exact', 'exact']);
      const head = r.fragments.find(f => f.anchor === 0 && f.length === 3);
      expect(head?.intervalShape).toEqual([7, -2]);
      expect(head?.isDistinctive).toBe(true);
      expect(head?.occurrences.length).toBeGreaterThanOrEqual(3);
    },
  },
  {
    name: 'best-motif-coverage-times-distinctiveness',
    run: () => {
      // Deux motifs répétés autant l'un que l'autre : celui qui porte un saut et
      // une durée longue l'emporte sur la marche conjointe en valeurs égales.
      const r = report(
        'C4:q D4:q E4:q | C4:q D4:q E4:q | C4:q D4:q E4:q | ' +
        'G4:e C5:e G4:h | G4:e C5:e G4:h | G4:e C5:e G4:h');
      expect(r.bestMotif?.intervalShape).toEqual([5, -5]);
    },
  },
  {
    name: 'no-motif-below-min-length',
    run: () => {
      const r = report('C4:q D4:h');
      expect(r).toEqual({ motifs: [], bestMotif: null, hasVariedRepetition: false, maxExactRepetitions: 0, fragments: [] });
    },
  },
  {
    name: 'overlapping-occurrences-counted-once',
    run: () => {
      // Une gamme chromatique contient « sa » cellule à chaque note : les
      // occurrences retenues ne se CHEVAUCHENT pas, sinon la couverture
      // dépasserait la pièce.
      const r = report('C4:q C#4:q D4:q D#4:q E4:q F4:q F#4:q G4:q G#4:q');
      const m = motif(r, 0, 3);
      expect(m.occurrences.map(o => o.at)).toEqual([0, 1440, 2880]);
    },
  },
];
