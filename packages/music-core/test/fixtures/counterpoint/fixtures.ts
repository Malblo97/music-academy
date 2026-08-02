import { expect } from 'vitest';
import { parseNotation } from '../../../src/notation/parse.js';
import { checkSpecies } from '../../../src/analyzers/species.js';
import { suspensionCheck } from '../../../src/analyzers/suspension.js';
import { canonCheck, detectEntries, invertibleCheck, stretteCheck } from '../../../src/analyzers/imitation.js';
import type { KeyEstimate } from '../../../src/analyzers/key.js';
import type { Issue } from '../../../src/types.js';

export interface Fixture { name: string; run: () => void }

const DORIAN: KeyEstimate = { tonic: 2, mode: 'dorian', confidence: 1, ambiguous: false, alternates: [], rawProfiles: [] };

/**
 * `m04-cf-dorian-01` — reconstitué depuis les intervalles déclarés par les
 * `authorNotes` de m04-s02 (« 5·3·6·8·6·6·3·3·6·8 » contre le contrepoint) :
 * ré · fa · mi · ré · sol · fa · la · sol · mi · ré.
 */
const CF_DORIAN = 'D4:w | F4:w | E4:w | D4:w | G4:w | F4:w | A4:w | G4:w | E4:w | D4:w';

/** m04-s05-fourth-species, volet « chain » : le cantus en marches descendantes. */
const CF_MARCHES = 'A3:w | G3:w | F3:w | E3:w | D3:w';

function errors(issues: readonly Issue[]): Issue[] {
  return issues.filter(i => i.severity === 'error');
}

export const fixtures: Fixture[] = [
  {
    name: 'species1-s02-clean',
    run: () => {
      // m04-s02-first-species, volet above-dorian. Étalon POSITIF : aucune
      // erreur, et les intervalles mesurés sont exactement ceux que les
      // `authorNotes` annoncent — 5·3·6·8·6·6·3·3·6·8.
      const report = checkSpecies(1, parseNotation(CF_DORIAN),
        parseNotation('A4:w | A4:w | C5:w | D5:w | E5:w | D5:w | C5:w | B4:w | C#5:w | D5:w'),
        { cpPosition: 'above', key: DORIAN });
      expect(errors(report.issues)).toEqual([]);
      expect(report.intervals).toEqual([7, 4, 8, 0, 9, 9, 3, 4, 9, 0]);
    },
  },
  {
    name: 'ficta-clausule-ok-f25',
    run: () => {
      // **F-25.** Le do♯ de la mesure 9 n'appartient pas au ré dorien : c'est la
      // ficta de clausule. Dans la fenêtre, elle est ACCEPTÉE et taguée.
      const report = checkSpecies(1, parseNotation(CF_DORIAN),
        parseNotation('A4:w | A4:w | C5:w | D5:w | E5:w | D5:w | C5:w | B4:w | C#5:w | D5:w'),
        { cpPosition: 'above', key: DORIAN });
      expect(report.ficta).toEqual([15360]); // mesure 9
      expect(report.issues.some(i => i.ruleId === 'cpt.ficta')).toBe(false);
    },
  },
  {
    name: 'ficta-midline-error',
    run: () => {
      // La MÊME altération en milieu de ligne : erreur. La ficta ne se justifie
      // qu'à la cadence — hors fenêtre, c'est une note fausse.
      const report = checkSpecies(1, parseNotation(CF_DORIAN),
        parseNotation('A4:w | A4:w | C#5:w | D5:w | E5:w | D5:w | C5:w | B4:w | C#5:w | D5:w'),
        { cpPosition: 'above', key: DORIAN });
      const ficta = report.issues.filter(i => i.ruleId === 'cpt.ficta');
      expect(ficta).toHaveLength(1);
      expect(ficta[0]!.atTick).toBe(3840); // mesure 3
    },
  },
  {
    name: 'species1-parallel-fifths-error',
    run: () => {
      // Négatif fabriqué : deux quintes d'appui à appui, même direction.
      const report = checkSpecies(1, parseNotation('D4:w | E4:w'), parseNotation('A4:w | B4:w'),
        { cpPosition: 'above' });
      expect(errors(report.issues).map(i => i.ruleId)).toEqual(['cpt.parallel-perfects']);
    },
  },
  {
    name: 'species2-s03-passing',
    run: () => {
      // m04-s03-second-species. Les quatre dissonances de passage annoncées —
      // si (m2), do (m4), do (m5), ré (m7) — et rien d'autre.
      const report = checkSpecies(2, parseNotation(CF_DORIAN),
        parseNotation('r:h A4:h | A4:h B4:h | C5:h B4:h | D5:h C5:h | B4:h C5:h | ' +
          'D5:h A4:h | C5:h D5:h | E5:h D5:h | B4:h C#5:h | D5:w'),
        { cpPosition: 'above', key: DORIAN });
      expect(errors(report.issues)).toEqual([]);
      expect(report.figures.filter(f => f.kind === 'passing').map(f => f.at))
        .toEqual([2880, 6720, 8640, 12480]);
    },
  },
  {
    name: 'species2-dissonance-on-beat-error',
    run: () => {
      // La dissonance sur l'APPUI : interdite en 2e espèce, quelle que soit sa
      // conduite — seuls les temps faibles peuvent dissoner.
      const report = checkSpecies(2, parseNotation('D4:w | E4:w'),
        parseNotation('r:h A4:h | A4:h C5:h'), { cpPosition: 'above' });
      expect(errors(report.issues).map(i => i.ruleId)).toContain('species2.dissonance');
    },
  },
  {
    name: 'species3-s04-cambiata',
    run: () => {
      // m04-s04-third-species. La **cambiata** de la mesure 6 (F5–E5–C5–D5 :
      // 8-7-5-6) est reconnue au dessin EXACT — l'à-peu-près est refusé.
      const report = checkSpecies(3, parseNotation(CF_DORIAN),
        parseNotation('r:q F4:q G4:q A4:q | C5:q D5:q C5:q A4:q | B4:q C5:q D5:q C5:q | ' +
          'D5:q C5:q B4:q A4:q | B4:q C5:q D5:q E5:q | F5:q E5:q C5:q D5:q | ' +
          'E5:q D5:q C5:q A4:q | B4:q C5:q D5:q B4:q | G4:q A4:q B4:q C#5:q | D5:w'),
        { cpPosition: 'above', key: DORIAN });
      expect(errors(report.issues)).toEqual([]);
      expect(report.figures.filter(f => f.kind === 'cambiata').map(f => f.at)).toContain(10080);
    },
  },
  {
    name: 'cambiata-approximate-refused',
    run: () => {
      // Le même geste, la tierce descendante remplacée par une quarte : ce n'est
      // plus une cambiata, et la dissonance n'est plus couverte.
      const report = checkSpecies(3, parseNotation('D4:w | E4:w'),
        parseNotation('A4:q G4:q D4:q E4:q | B4:q A4:q E4:q F4:q'), { cpPosition: 'above' });
      expect(report.figures.some(f => f.kind === 'cambiata')).toBe(false);
    },
  },
  {
    name: 'species4-s05-chain-7-6',
    run: () => {
      // m04-s05, volet « chain » : 7-6 · 7-6 · 7-6 sur les marches descendantes.
      // « Ton lamento est réglementaire. »
      const report = checkSpecies(4, parseNotation(CF_MARCHES),
        parseNotation('r:h F4:h~ | F4:h E4:h~ | E4:h D4:h~ | D4:h C#4:h | D4:w'),
        { cpPosition: 'above', key: DORIAN });
      expect(errors(report.issues)).toEqual([]);
      expect(report.figures.filter(f => f.kind === 'suspension')).toHaveLength(3);

      const { suspensions, chains } = suspensionCheck([
        parseNotation('r:h F4:h~ | F4:h E4:h~ | E4:h D4:h~ | D4:h C#4:h | D4:w'),
        parseNotation(CF_MARCHES),
      ]);
      expect(suspensions.map(s => s.type)).toEqual(['7-6', '7-6', '7-6']);
      expect(chains).toHaveLength(1);
      expect(chains[0]).toHaveLength(3);
    },
  },
  {
    name: 'syncope-two-breaks-error',
    run: () => {
      // **F-27.** Une rupture de syncope est tolérée (l'écriture respire) ;
      // deux, non — la 4e espèce cesse alors d'être une 4e espèce.
      const report = checkSpecies(4, parseNotation('A3:w | G3:w | F3:w | E3:w | D3:w'),
        parseNotation('r:h F4:h~ | F4:h E4:h | C4:h A3:h | D4:h C#4:h | D4:w'),
        { cpPosition: 'above', key: DORIAN });
      expect(errors(report.issues).map(i => i.ruleId)).toContain('species4.syncope-break');
    },
  },
  {
    name: 'contour-below-mirrored-f26',
    run: () => {
      // **F-26.** Sous le cantus, l'extremum est le CREUX. La même ligne jugée
      // « au-dessus » désignerait son sommet et raterait le geste.
      const cf = parseNotation('D4:w | E4:w | F4:w | E4:w | D4:w');
      const cp = parseNotation('D3:w | C3:w | A2:w | B2:w | D3:w');
      const below = checkSpecies(1, cf, cp, { cpPosition: 'below' });
      const above = checkSpecies(1, cf, cp, { cpPosition: 'above' });
      expect(below.climaxAt).toBe(3840); // le creux, mesure 3
      expect(above.climaxAt).toBe(0); // le « sommet » — hors sujet pour une voix grave
      expect(below.climaxPosition).toBeCloseTo(0.4, 5);
    },
  },
  {
    name: 'free-suspension-f29',
    run: () => {
      // **F-29.** m04-s08-three-voices, mes. 12–13 : le fa5 préparé sur ré
      // mineur, LIÉ, suspendu sur l'accord de do (une quarte contre le do3 de
      // basse), résolu sur mi5. Hors espèces, hors cantus en rondes — le
      // détecteur est découplé, c'est tout l'objet du finding.
      const S = parseNotation('F5:h~ F5:h~ | F5:h E5:h');
      const M = parseNotation('A4:h B4:h | G4:h~ G4:h');
      const B = parseNotation('D3:w | C3:w');
      const { suspensions } = suspensionCheck([S, M, B]);
      const againstBass = suspensions.find(s => s.upper === 0 && s.lower === 2);
      expect(againstBass?.type).toBe('4-3');
      expect(againstBass?.at).toBe(1920);
      expect(againstBass?.preparedAt).toBe(0);
      expect(againstBass?.resolvedAt).toBe(2880);
    },
  },
  {
    name: 'suspension-negative-attacked',
    run: () => {
      // La même dissonance ATTAQUÉE au lieu d'être tenue : c'est une
      // appoggiature, pas un retard — le motif exige la liaison.
      const S = parseNotation('F5:h A5:h | F5:h E5:h');
      const B = parseNotation('D3:w | C3:w');
      expect(suspensionCheck([S, B]).suspensions).toEqual([]);
    },
  },
  {
    name: 'tonal-answer-f28',
    run: () => {
      // **F-28.** Le sujet de m04-s10 (tête) : 1̂→5̂ répondu 5̂→1̂ — la mutation
      // porte sur le PREMIER intervalle seulement, la suite est exacte, contour
      // et rythme conservés. Accepté `tonal`, refusé en lecture `real`.
      const head = parseNotation('G3:q D4:e C4:e Bb3:q A3:q');
      const answer = parseNotation('D4:q G4:e F4:e Eb4:q D4:q');
      expect(detectEntries([answer], head, { answer: 'tonal' }))
        .toEqual([{ voice: 0, at: 0, transposition: 7, kind: 'tonal' }]);
      expect(detectEntries([answer], head, { answer: 'real' })).toEqual([]);
    },
  },
  {
    name: 'tonal-answer-mutation-out-of-zone-refused',
    run: () => {
      // La restriction qui empêche F-12 de tout avaler : muté au TROISIÈME
      // intervalle, hors zone de tête, l'énoncé n'est plus une réponse.
      const head = parseNotation('G3:q D4:e C4:e Bb3:q A3:q');
      const muted = parseNotation('D4:q G4:e F4:e E4:q D4:q');
      expect(detectEntries([muted], head, { answer: 'tonal' })).toEqual([]);
    },
  },
  {
    name: 'real-answer-exact',
    run: () => {
      // La réponse RÉELLE : intervalles identiques, ancrage libre.
      const head = parseNotation('G3:q D4:e C4:e Bb3:q A3:q');
      const real = parseNotation('D4:q A4:e G4:e F4:q E4:q');
      expect(detectEntries([real], head, { answer: 'real' })[0]).toMatchObject({ kind: 'real', transposition: 7 });
    },
  },
  {
    name: 'two-heads-strette-f32',
    run: () => {
      // **F-32.** m04-s09, volet « stretto » : quatre énoncés de la tête aux
      // délais 2 → 1 → 0.5, répartis sur DEUX voix. Fusionnés sur une seule
      // timeline, ils dessinent l'arche de compression — et le dernier
      // CHEVAUCHE le précédent : c'est la strette au sens strict.
      const V1 = parseNotation('C4:e D4:e E4:q G4:q r:q | A4:q G4:h F4:q | E4:h r:h | ' +
        'C5:e D5:e E5:q G5:q r:q | F5:q E5:q D5:q C5:q | D5:h~ D5:h | D5:h C5:h');
      const V2 = parseNotation('r:w | r:w | G4:e A4:e B4:q D5:q r:q | r:h G3:e A3:e B3:q | ' +
        'D4:q E4:q F4:h | G4:h~ G4:q A4:q | G3:h C4:h');
      const head = parseNotation('C4:e D4:e E4:q G4:q');
      const entries = detectEntries([V1, V2], head, { answer: 'real' });
      expect(entries.map(e => e.at)).toEqual([0, 3840, 5760, 6720]);

      const strette = stretteCheck(entries, 1440);
      expect(strette.delays.map(d => d / 1920)).toEqual([2, 1, 0.5]);
      expect(strette.compresses).toBe(true);
      expect(strette.overlaps).toBe(true);
    },
  },
  {
    name: 'canon-identity-and-break',
    run: () => {
      // m04-s09, volet « canon » : identité décalée d'une mesure à l'octave
      // inférieure, m2→m7 EXACTE, puis la mesure 8 libre — « la machine
      // s'arrête, les humains concluent ». La rupture est RAPPORTÉE, pas
      // condamnée : c'est à l'appelant de vérifier qu'elle est taguée.
      const V1 = parseNotation('C5:q B4:q C5:q D5:q | E5:q D5:q C5:q A4:q | G4:q F4:q E4:q C5:q | ' +
        'B4:q A4:q C5:q E5:q | D5:q C5:q E5:q C5:q | F4:q E4:q G4:q A4:q | ' +
        'A4:q G4:q F4:q G4:q | D5:h C5:h');
      const V2 = parseNotation('r:w | C4:q B3:q C4:q D4:q | E4:q D4:q C4:q A3:q | G3:q F3:q E3:q C4:q | ' +
        'B3:q A3:q C4:q E4:q | D4:q C4:q E4:q C4:q | F3:q E3:q G3:q A3:q | B3:h C4:h');
      const report = canonCheck(V1, V2, { delay: 1920, interval: -12 });
      expect(report.identical).toBe(false);
      expect(report.breaks).toEqual([13440, 14400]); // la seule mesure libre : la 8e
    },
  },
  {
    name: 'invertible-counter-subject',
    run: () => {
      // Un contre-sujet invertible à l'octave n'a droit qu'aux tierces et aux
      // sixtes : la quinte deviendrait une quarte à l'inversion. Les deux
      // positions sont MESURÉES, pas déduites.
      const subject = parseNotation('G3:q A3:q B3:q C4:q');
      const good = parseNotation('B3:q C4:q D4:q E4:q'); // tierces
      const bad = parseNotation('D4:q E4:q F#4:q G4:q'); // quintes
      expect(invertibleCheck(subject, good).ok).toBe(true);
      expect(invertibleCheck(subject, bad).ok).toBe(false);
      expect(invertibleCheck(subject, bad).inverted.every(i => i === 5)).toBe(true); // des quartes
    },
  },
];
