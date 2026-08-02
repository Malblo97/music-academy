import { expect } from 'vitest';
import { parseNotation } from '../../../src/notation/parse.js';
import { tagIdioms } from '../../../src/analyzers/idioms.js';
import type { IdiomTag, Vertical } from '../../../src/analyzers/idioms.js';
import type { KeyEstimate } from '../../../src/analyzers/key.js';

export interface Fixture { name: string; run: () => void }

function key(tonic: number, mode: KeyEstimate['mode']): KeyEstimate {
  return { tonic, mode, confidence: 1, ambiguous: false, alternates: [], rawProfiles: [] };
}

/**
 * Les verticalités d'un extrait : on segmente à chaque ATTAQUE. Une ronde liée
 * par-dessus la barre (s05) ne produit donc qu'une verticalité de deux mesures —
 * c'est exactement ce que l'oreille entend, et ce sur quoi la tenue des pivots
 * se mesure.
 */
function verticalsOf(notation: string): Vertical[] {
  const notes = parseNotation(notation);
  const end = notes.reduce((m, n) => Math.max(m, n.start + n.duration), 0);
  const bounds = [...new Set(notes.map(n => n.start))].sort((a, b) => a - b);
  bounds.push(end);
  const out: Vertical[] = [];
  for (let i = 0; i < bounds.length - 1; i++) {
    const from = bounds[i]!;
    const to = bounds[i + 1]!;
    out.push({ from, to, notes: notes.filter(n => n.start < to && n.start + n.duration > from) });
  }
  return out;
}

function tagsOf(notation: string, k: KeyEstimate): IdiomTag[] {
  return tagIdioms(verticalsOf(notation), k);
}

function ids(tags: readonly IdiomTag[]): string[] {
  return tags.map(t => t.id);
}

function at(tags: readonly IdiomTag[], id: string): IdiomTag {
  const found = tags.find(t => t.id === id);
  if (!found) throw new Error(`fixture idiomes : tag "${id}" absent (obtenu : ${ids(tags).join(', ') || 'rien'})`);
  return found;
}

export const fixtures: Fixture[] = [
  {
    name: 'neapolitan-s02-m5-7',
    run: () => {
      // m03-s02-solemn-shadow, mes. 5–7 : le ♭II⁶ prend la place du iv. Basse sur
      // 4̂ (G2, doublée G4 — jamais la ♭2̂), couleur au soprano (D5→E♭5), puis
      // E♭5→C♯5, la tierce diminuée. Sortie sur V (A) : le contexte S→D.
      const tags = tagsOf('[D3+A3+F4+D5]:w | [G2+Bb3+G4+Eb5]:w | [A2+A3+E4+C#5]:w', key(2, 'minor'));
      expect(ids(tags)).toEqual(['neapolitan']);
      expect(at(tags, 'neapolitan').from).toBe(1920);
    },
  },
  {
    name: 'neapolitan-then-aug6-s03-m3-6',
    run: () => {
      // m03-s03-the-wedge : l'escalade. ♭II⁶ (m3) → Ger⁶ (m4) → i6/4 (m5) → V7 (m6).
      // Le napolitain ne va pas *directement* au V : il passe par un autre
      // pré-dominant — un aug6 tagué compte donc comme la marche vers D.
      const tags = tagsOf(
        '[C3+C4+Eb4+Ab4]:w | [Eb3+Bb3+C#4+G4]:w | [D3+Bb3+D4+G4]:w | [D3+C4+D4+F#4]:w',
        key(7, 'minor'));
      expect(ids(tags)).toEqual(['neapolitan', 'aug6-ger']);
      expect(at(tags, 'aug6-ger').from).toBe(1920);
    },
  },
  {
    name: 'aug6-ger-direct-s03-m9-10',
    run: () => {
      // Le Ger⁶ DIRECT vers la demi-cadence monumentale. C'est ce tag que
      // `detectCadences` lit (F-16) pour refuser « parfaite en ré ».
      const tags = tagsOf('[Eb2+Bb3+C#4+G4]:w | [D2+A3+D4+F#4]:w', key(7, 'minor'));
      expect(ids(tags)).toEqual(['aug6-ger']);
      expect(at(tags, 'aug6-ger').family).toBe('aug6');
    },
  },
  {
    name: 'aug6-it',
    run: () => {
      // L'italienne : {♭6̂,1̂,♯4̂} et RIEN d'autre (le corpus M3 n'en contient pas —
      // fixture construite dans le sol mineur de s03, même sortie ♭6̂→5̂).
      const tags = tagsOf('[Eb3+G3+G4+C#5]:w | [D3+A3+D4+F#4]:w', key(7, 'minor'));
      expect(ids(tags)).toEqual(['aug6-it']);
    },
  },
  {
    name: 'aug6-fr',
    run: () => {
      // La française : la 2̂ (A) au lieu de la ♭3̂ (B♭) — un seul son sépare les
      // trois sœurs, et ce son décide du tag.
      const tags = tagsOf('[Eb3+G3+A3+C#4]:w | [D3+A3+D4+F#4]:w', key(7, 'minor'));
      expect(ids(tags)).toEqual(['aug6-fr']);
    },
  },
  {
    name: 'aug6-negative-no-resolution',
    run: () => {
      // Les mêmes notes, mais la basse ne descend pas sur 5̂ : par COMPORTEMENT,
      // ce n'est pas une sixte augmentée — c'est une verticalité en l'air.
      const tags = tagsOf('[Eb3+Bb3+C#4+G4]:w | [Eb3+G3+Bb3+Eb4]:w', key(7, 'minor'));
      expect(ids(tags)).not.toContain('aug6-ger');
    },
  },
  {
    name: 'ger6-v7-s05-m5-8',
    run: () => {
      // m03-s05-secret-passage, variante ger6-v7 : le F7 « on croit partir vers
      // si♭ », TENU une ronde liée (l'oreille lâche le monde de do), puis relu
      // Ger⁶ de LA — quatre demi-tons. Le tenu ≥ 2 mesures EST le pivot.
      const tags = tagsOf(
        '[F2+A3+F4+C5]:w | [F2~+A3~+Eb4~+C5~]:w | [F2+A3+Eb4+C5]:w | [E2+G#3+E4+B4]:w',
        key(9, 'minor'));
      expect(ids(tags)).toEqual(['aug6-ger', 'ger6-v7']);
      expect(at(tags, 'ger6-v7')).toMatchObject({ from: 1920, to: 5760, family: 'aug6' });
    },
  },
  {
    name: 'dim7-passing-s04-m2',
    run: () => {
      // m03-s04-four-faces, LE PASSANT : ♯i°7 {C♯,E,G,B♭}, escalier de basse
      // C→C♯→D, chaque voix conjointe ou commune. Il ne se tient pas : il passe.
      const tags = tagsOf('[C3+G3+E4+C5]:w | [C#3+G3+E4+Bb4]:w | [D3+F3+F4+A4]:w', key(0, 'major'));
      expect(ids(tags)).toEqual(['dim7-passing']);
      expect(at(tags, 'dim7-passing')).toMatchObject({ from: 1920, to: 3840 });
    },
  },
  {
    name: 'dim7-intensifier-not-pivot-s04-m4',
    run: () => {
      // L'INTENSIFICATEUR (m4) : vii°7 → I, sensibles résolues. Même famille,
      // aucun des deux métiers tagués — ni escalier de basse, ni sortie à
      // distance (l'arrivée EST la tonique courante).
      const tags = tagsOf('[B2+F3+D4+Ab4]:w | [C3+E3+E4+G4]:w', key(0, 'major'));
      expect(tags).toEqual([]);
    },
  },
  {
    name: 'dim7-pivot-s04-m6-8',
    run: () => {
      // LE PIVOT (m7) : le MÊME pitch-class set que la mes. 4, tenu une ronde,
      // puis la sortie m8 vers mi♭. Une gare, deux trains — et c'est la TENUE
      // plus la destination, pas les notes, qui font la différence.
      const tags = tagsOf('[A2+E3+C4+A4]:w | [D3+F3+B3+Ab4]:w | [Eb3+G3+Bb3+G4]:w', key(0, 'major'));
      expect(ids(tags)).toEqual(['dim7-pivot']);
      expect(at(tags, 'dim7-pivot')).toMatchObject({ from: 1920, to: 3840 });
    },
  },
  {
    name: 'dim7-pivot-s05-m5-8',
    run: () => {
      // m03-s05, variante dim7 : G♯°7 = vii°7 du vi, l'oreille attend LA MINEUR,
      // tenu deux mesures (le trémolo mental), sortie en LA MAJEUR.
      const tags = tagsOf(
        '[A2+A3+E4+C5]:w | [G#2~+B3~+F4~+D5~]:w | [G#2+B3+F4+D5]:w | [A2+A3+E4+C#5]:w',
        key(0, 'major'));
      expect(ids(tags)).toEqual(['dim7-pivot']);
      expect(at(tags, 'dim7-pivot')).toMatchObject({ from: 1920, to: 5760 });
    },
  },
  {
    name: 'subV-m09-s05',
    run: () => {
      // m09-s05-noir-progression, mes. 3–5 : D♭7♯11 = subV7/i, exactement là où
      // le G7 était attendu. `detectChord` rendrait `null` (le ♯11 n'est dans
      // aucune des 14 formes) — la détection travaille sur le NOYAU de dominante.
      const tags = tagsOf(
        '[D2+Ab3+C4+D4+F4]:w | [Db2+Ab3+B3+F4+G4]:w | [C2+Bb3+D4+Eb4+G4]:w',
        key(0, 'minor'));
      expect(ids(tags)).toEqual(['subV']);
      expect(at(tags, 'subV').from).toBe(1920);
    },
  },
  {
    name: 'subv-suppressed-by-aug6-f16',
    run: () => {
      // m01-s40-three-doors, mes. 5–6 : A♭7 → G. L'auteur l'appelle subV de G, et
      // en pitch-classes c'est AUSSI la sixte allemande de do. **F-16** tranche :
      // en tonalité établie, `aug6` est tagué AVANT `subV` — la même verticalité
      // ne peut pas ouvrir deux mondes à la fois, et c'est ce tag que la
      // classification cadentielle lira.
      const tags = tagsOf('[Ab2+C4+Gb4+Eb5]:w | [G2+B3+D4+G4]:w', key(0, 'major'));
      expect(ids(tags)).toEqual(['aug6-ger']);
      expect(ids(tags)).not.toContain('subV');
    },
  },
  {
    name: 'back-door',
    run: () => {
      // m08-s03-the-mother-cell, cellule « back-door » (m9–10 : Fm7–B♭7 → Cmaj7),
      // voicée à quatre voix : ♭VII7 → I, l'emprunt de m01-l21 devenu cadence,
      // SANS sensible.
      const tags = tagsOf('[F2+Ab3+C4+Eb4]:w | [Bb2+D4+F4+Ab4]:w | [C3+E4+G4+B4]:w', key(0, 'major'));
      expect(ids(tags)).toEqual(['back-door']);
      expect(at(tags, 'back-door').evidence).toContain('iv');
    },
  },
  {
    name: 'line-cliche-m01-s42',
    run: () => {
      // m01-s42-line-cliche : A4→G♯4→G4→F♯4 dans la MÊME voix (le ténor du
      // voicing), toutes les autres immobiles quatre mesures durant.
      const tags = tagsOf(
        '[A2+E4+A4+C5]:w | [A2+E4+G#4+C5]:w | [A2+E4+G4+C5]:w | [A2+E4+F#4+C5]:w',
        key(9, 'minor'));
      expect(ids(tags)).toEqual(['line-cliche']);
      expect(at(tags, 'line-cliche')).toMatchObject({ from: 0, to: 7680 });
    },
  },
  {
    name: 'line-cliche-negative-outer-voice',
    run: () => {
      // La même descente chromatique, mais au SOPRANO : ce n'est plus le cliché
      // (l'idiome tient à ce que la couleur bouge SOUS un accord immobile), c'est
      // une ligne de chant.
      const tags = tagsOf(
        '[A2+E4+A4+C5]:w | [A2+E4+A4+B4]:w | [A2+E4+A4+Bb4]:w | [A2+E4+A4+A4]:w',
        key(9, 'minor'));
      expect(ids(tags)).not.toContain('line-cliche');
    },
  },
  {
    name: 'planing-diatonic-s14-volet1',
    run: () => {
      // m03-s14-the-roller, VOLET 1 : triades de mi éolien peintes sous la ligne.
      // Les qualités varient (majeur, mineur, diminué) — le monde ondule sans
      // changer de gamme.
      const tags = tagsOf(
        '[A3+C4+E4]:q [B3+D4+F#4]:q [C4+E4+G4]:q [D4+F#4+A4]:q | ' +
        '[C4+E4+G4]:q [D4+F#4+A4]:q [E4+G4+B4]:q [F#4+A4+C5]:q | ' +
        '[G4+B4+D5]:q [E4+G4+B4]:q [D4+F#4+A4]:q [C4+E4+G4]:q | ' +
        '[B3+D4+F#4]:h [A3+C4+E4]:h',
        key(4, 'minor'));
      expect(ids(tags)).toEqual(['planing-diatonic']);
      expect(at(tags, 'planing-diatonic')).toMatchObject({ from: 0, to: 7680, family: 'planing' });
    },
  },
  {
    name: 'planing-real-s14-volet2',
    run: () => {
      // VOLET 2 : le même dessin, majeures EXACTES — sol♯, ré♯, fa bécarre
      // entrent. L'A/B des deux volets EST la leçon : mêmes parallèles, deux tags.
      const tags = tagsOf(
        '[A3+C#4+E4]:q [B3+D#4+F#4]:q [C4+E4+G4]:q [D4+F#4+A4]:q | ' +
        '[C4+E4+G4]:q [D4+F#4+A4]:q [E4+G#4+B4]:q [F4+A4+C5]:q | ' +
        '[G4+B4+D5]:q [E4+G#4+B4]:q [D4+F#4+A4]:q [C4+E4+G4]:q | ' +
        '[B3+D#4+F#4]:h [A3+C#4+E4]:h',
        key(4, 'minor'));
      expect(ids(tags)).toEqual(['planing-real']);
    },
  },
  {
    name: 'planing-quartal-s14-volet3',
    run: () => {
      // VOLET 3 : quartes parallèles sur pédale de mi déclarée (l13 × l07). La
      // pédale ne bouge pas — une voix immobile ne casse pas le planing, à
      // condition d'être LA MÊME tout du long.
      const tags = tagsOf(
        '[E2~+A3+D4+G4]:h [E2+B3+E4+A4]:h | [E2~+D4+G4+C5]:h [E2+B3+E4+A4]:h | ' +
        '[E2~+A3+D4+G4]:h [E2+G3+C4+F4]:h | [E2+A3+D4+G4]:w',
        key(4, 'minor'));
      expect(ids(tags)).toContain('planing-quartal');
      expect(ids(tags)).toContain('quartal');
      expect(ids(tags)).not.toContain('planing-real');
    },
  },
  {
    name: 'quartal-release-s13-m9-10',
    run: () => {
      // m03-s13-change-the-brick, LA BASCULE : depuis la pile la plus tendue
      // (C–F♯, le triton en réserve), l'ouverture tertienne — ré majeur étalé,
      // pris DANS les pitch-classes de la pile, F♯ tenu.
      const tags = tagsOf(
        '[A2+D3+G3+C4+F#4]:w | [D2+A2+F#3+A3+D4+F#4]:w | [A2+E3+A3+C4+E4]:w',
        key(2, 'dorian'));
      expect(ids(tags)).toContain('quartal');
      expect(ids(tags)).toContain('quartal-release');
      expect(at(tags, 'quartal-release')).toMatchObject({ from: 0, to: 3840 });
    },
  },
  {
    name: 'augmented-pivot-s05-m5-8',
    run: () => {
      // m03-s05, variante augmented : I → I+ par line cliché, l'augmenté TENU
      // (4+4+4 : l'accord n'a plus de monde), puis C+ ≡ E+ = V+ de LA.
      const tags = tagsOf(
        '[C3+G3+E4+C5]:w | [C3~+G#3~+E4~+C5~]:w | [C3+G#3+E4~+C5]:w | [C#3+A3+E4+A4]:w',
        key(0, 'major'));
      expect(ids(tags)).toEqual(['augmented-pivot']);
      expect(at(tags, 'augmented-pivot')).toMatchObject({ from: 1920, to: 5760 });
    },
  },
];
