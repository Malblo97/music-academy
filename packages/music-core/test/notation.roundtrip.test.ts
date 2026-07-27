import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { parseNotation } from '../src/notation/parse.js';
import { printNotation } from '../src/notation/print.js';
import { applySwing } from '../src/notation/swing.js';
import { TICKS } from '../src/types.js';
import type { Meter, Note } from '../src/types.js';

/**
 * F-52 — verrou n°3 reformulé. `printNotation(parseNotation(x)) === x` est faux
 * par construction (la syntaxe de surface est plus riche que le modèle : un
 * `E5:h~ E5:q` et un `E5:h.` sont la même musique). Les 3 propriétés ci-dessous
 * remplacent ce test.
 *
 * Les niveaux métriques (`METERS`) sont réécrits À LA MAIN ici, indépendamment
 * de `metricalLevels()` dans print.ts : un test qui recalculerait les niveaux
 * via print.ts validerait l'implémentation contre elle-même.
 */

const METERS: { meter: Meter; levels: number[] }[] = [
  { meter: [4, 4], levels: [1920, 960, 480, 240, 120] },
  { meter: [3, 4], levels: [1440, 480, 240, 120] },
  { meter: [2, 4], levels: [960, 480, 240, 120] },
  { meter: [6, 8], levels: [1440, 720, 240, 120] },
  { meter: [12, 8], levels: [2880, 1440, 720, 240, 120] },
];

/** Même définition mathématique de la légalité que print.ts (c'est la table des niveaux, pas la formule, qui doit être indépendante). */
function independentIsLegal(offset: number, len: number, levels: number[]): boolean {
  for (const lv of levels) {
    if (lv < len) break;
    const boundary = Math.ceil((offset + 1) / lv) * lv;
    if (boundary < offset + len) return false;
  }
  return true;
}

/**
 * Jetons utilisés pour générer des partitions bien formées. `180` (s., double
 * croche pointée) est délibérément exclu : c'est le seul jeton qui n'est PAS
 * multiple de 120 (la plus petite grille), et le combiner avec une autre voix
 * peut créer un point de coupure qui force, pour cette autre voix, un reste de
 * 60 ticks — non représentable (il faudrait une triple croche, hors vocabulaire
 * w/h/q/e/s). Une double croche pointée seule s'imprime très bien (voir plus
 * bas) ; ce n'est qu'en présence d'une voix simultanée non alignée que la
 * combinaison sort du domaine exprimable — donc hors du périmètre F-52.
 */
const TOKENS = [2880, 1920, 1440, 960, 720, 480, 360, 240, 120];

const project = (ns: readonly Note[]) =>
  ns.map(n => ({ pitch: n.pitch, start: n.start, duration: n.duration }))
    .sort((a, b) => a.start - b.start || a.pitch - b.pitch);

/**
 * Relit les jetons de durée d'une sortie imprimée. `offset` est dérivé du tick
 * ABSOLU (`tick % bar`), pas de la position des `|` émis dans le texte : si
 * les barres sont mal placées, P3 ne doit pas se retrouver à mesurer la
 * légalité contre une grille fictive et passer à vide. `barMarks` (les ticks
 * absolus où un `|` apparaît) sert séparément à P4 pour vérifier l'émission
 * des barres elle-même.
 */
function scanDurationTokens(printed: string, bar: number): { tokens: { offset: number; len: number }[]; barMarks: number[]; total: number } {
  const DUR: Record<string, number> = { w: TICKS.w!, h: TICKS.h!, q: TICKS.q!, e: TICKS.e!, s: TICKS.s! };
  const tokens: { offset: number; len: number }[] = [];
  const barMarks: number[] = [];
  if (!printed) return { tokens, barMarks, total: 0 };
  let tick = 0;
  for (const tok of printed.split(' ')) {
    if (tok === '|') { barMarks.push(tick); continue; }
    const m = /:([whqes])(\.)?/.exec(tok);
    if (!m) continue;
    const letter = m[1]!;
    const len = m[2] ? DUR[letter]! * 1.5 : DUR[letter]!;
    tokens.push({ offset: tick % bar, len });
    tick += len;
  }
  return { tokens, barMarks, total: tick };
}

function barTicksOf(meter: Meter): number {
  return meter[0] * (TICKS.w! / meter[1]);
}

function arbDurationTicks(maxTokens: number) {
  return fc.array(fc.constantFrom(...TOKENS), { minLength: 1, maxLength: maxTokens })
    .map(arr => arr.reduce((a, b) => a + b, 0));
}

/** Voix monophonique à hauteur fixe (donc jamais de chevauchement de même hauteur entre voix). */
function arbVoice(pitch: number, maxEvents: number) {
  return fc.array(arbDurationTicks(3), { minLength: 1, maxLength: maxEvents }).map(durations => {
    let t = 0;
    const notes: Note[] = [];
    for (const d of durations) { notes.push({ pitch, start: t, duration: d }); t += d; }
    return notes;
  });
}

function arbScore() {
  return fc.integer({ min: 0, max: METERS.length - 1 }).chain(meterIdx =>
    fc.integer({ min: 1, max: 3 }).chain(voiceCount =>
      fc.tuple(...Array.from({ length: voiceCount }, (_, i) => arbVoice(60 + i * 7, 4)))
        .map(voices => ({ meterIdx, notes: voices.flat() })),
    ),
  );
}

const RUNS = 2000;

describe('F-52 : propriétés du verrou n°3 reformulé', () => {
  it('P1 — aller-retour sur le modèle : parse(print(score)) ≡ notes', () => {
    fc.assert(
      fc.property(arbScore(), ({ meterIdx, notes }) => {
        const { meter } = METERS[meterIdx]!;
        const printed = printNotation({ notes, meter });
        const back = parseNotation(printed);
        expect(project(back)).toEqual(project(notes));
      }),
      { numRuns: RUNS },
    );
  });

  it('P2 — idempotence : print(parse(print(score))) === print(score)', () => {
    fc.assert(
      fc.property(arbScore(), ({ meterIdx, notes }) => {
        const { meter } = METERS[meterIdx]!;
        const once = printNotation({ notes, meter });
        const twice = printNotation({ notes: parseNotation(once), meter });
        expect(twice).toBe(once);
      }),
      { numRuns: RUNS },
    );
  });

  it('P3 — légalité métrique : aucun jeton ne franchit une frontière au moins aussi forte que lui', () => {
    fc.assert(
      fc.property(arbScore(), ({ meterIdx, notes }) => {
        const { meter, levels } = METERS[meterIdx]!;
        const bar = barTicksOf(meter);
        const printed = printNotation({ notes, meter });
        for (const { offset, len } of scanDurationTokens(printed, bar).tokens) {
          expect(independentIsLegal(offset, len, levels)).toBe(true);
        }
      }),
      { numRuns: RUNS },
    );
  });

  it("P4 — l'aller-retour survit au contrôle de mesure (strictBars)", () => {
    fc.assert(
      fc.property(arbScore(), ({ meterIdx, notes }) => {
        const { meter } = METERS[meterIdx]!;
        const bar = barTicksOf(meter);
        const maxEnd = notes.reduce((a, n) => Math.max(a, n.start + n.duration), 0);
        const lengthTicks = Math.max(bar, Math.ceil(maxEnd / bar) * bar);
        const printed = printNotation({ notes, meter, lengthTicks });
        const { barMarks } = scanDurationTokens(printed, bar);
        expect(barMarks.every(t => t % bar === 0)).toBe(true);
        expect(barMarks).toHaveLength(lengthTicks / bar - 1);
        expect(project(parseNotation(printed, { strictBars: true, meter }))).toEqual(project(notes));
      }),
      { numRuns: RUNS },
    );
  });
});

describe('F-52 : fixtures', () => {
  it('tenue sur deux mesures → E5:w~ | E5:w (jamais w.~h)', () => {
    const notes: Note[] = [{ pitch: 76, start: 0, duration: 3840 }];
    expect(printNotation({ notes, meter: [4, 4] })).toBe('E5:w~ | E5:w');
  });

  it('h. légal au temps 1 de 4/4', () => {
    const notes: Note[] = [{ pitch: 60, start: 0, duration: 1440 }];
    expect(printNotation({ notes, meter: [4, 4] })).toBe('C4:h.');
  });

  it('blanche syncopée au temps 2 → q~q', () => {
    const notes: Note[] = [{ pitch: 60, start: 480, duration: 960 }];
    expect(printNotation({ notes, meter: [4, 4] })).toBe('r:q C4:q~ C4:q');
  });

  it('w. émis en 12/8 uniquement (ingravable ailleurs → découpé)', () => {
    const notes: Note[] = [{ pitch: 60, start: 0, duration: 2880 }];
    expect(printNotation({ notes, meter: [12, 8] })).toBe('C4:w.');

    const out44 = printNotation({ notes, meter: [4, 4] });
    expect(out44).not.toContain('w.');
    expect(out44).toContain('|');
  });

  it('h. légal en 3/4 et en 6/8 (une mesure pleine)', () => {
    const notes: Note[] = [{ pitch: 60, start: 0, duration: 1440 }];
    expect(printNotation({ notes, meter: [3, 4] })).toBe('C4:h.');
    expect(printNotation({ notes, meter: [6, 8] })).toBe('C4:h.');
  });

  it('silence franchissant une barre est découpé', () => {
    const notes: Note[] = [{ pitch: 60, start: 2400, duration: 480 }];
    expect(printNotation({ notes, meter: [4, 4] })).toBe('r:w | r:q C4:q');
  });

  it('accord à liaisons partielles relu à l\'identique', () => {
    const src = '[E4~+F4]:q [E4+G4]:q';
    const notes = parseNotation(src);
    const printed = printNotation({ notes, meter: [4, 4] });
    expect(project(parseNotation(printed))).toEqual(project(notes));
  });

  it('double croche pointée (180 ticks) seule : un seul jeton s.', () => {
    const notes: Note[] = [{ pitch: 60, start: 0, duration: 180 }];
    expect(printNotation({ notes, meter: [4, 4] })).toBe('C4:s.');
  });

  it('orthographe bémol préservée (Bb4, jamais A#4)', () => {
    const notes = parseNotation('Bb4:q');
    expect(printNotation({ notes, meter: [4, 4] })).toBe('Bb4:q');
  });

  it('idempotence sur cinq sources non canoniques', () => {
    const sources = [
      'C4:q C4:q C4:q C4:q',
      '[C3+E4+G4]:h [C3+E4+G4]:h',
      'r:e C4:e D4:q E4:q F4:q',
      'G4:e~ G4:e A4:q A4:h',
      '[D3+F3+A3]:q~ [D3+F3+A3]:q [D3+F3+A3]:h',
    ];
    for (const src of sources) {
      const once = printNotation({ notes: parseNotation(src), meter: [4, 4] });
      const twice = printNotation({ notes: parseNotation(once), meter: [4, 4] });
      expect(twice).toBe(once);
    }
  });
});

describe('F-52 : échecs bruyants', () => {
  it('durée nulle : la note ne peut pas disparaître silencieusement', () => {
    const notes: Note[] = [{ pitch: 60, start: 0, duration: 0 }];
    expect(() => printNotation({ notes, meter: [4, 4] })).toThrow(/disparaître silencieusement/);
  });

  it('deux notes de même hauteur qui se chevauchent sont inexprimables', () => {
    const notes: Note[] = [
      { pitch: 60, start: 0, duration: 480 },
      { pitch: 60, start: 240, duration: 480 },
    ];
    expect(() => printNotation({ notes, meter: [4, 4] })).toThrow(/chevauchent/);
  });

  it('lengthTicks plus court que la dernière note', () => {
    const notes: Note[] = [{ pitch: 60, start: 0, duration: 960 }];
    expect(() => printNotation({ notes, meter: [4, 4], lengthTicks: 480 })).toThrow(/lengthTicks/);
  });

  it('attaque hors grille après swing : non imprimable (F-52)', () => {
    const swung = applySwing(parseNotation('C4:e D4:e C4:e D4:e'), 2.0);
    expect(() => printNotation({ notes: swung, meter: [4, 4] })).toThrow(/F-52/);
  });

  it('180 ticks + voix non alignée : reste de 60 ticks, hors vocabulaire', () => {
    expect(() => printNotation({
      notes: [{ pitch: 60, start: 0, duration: 180 }, { pitch: 67, start: 0, duration: 480 }],
      meter: [4, 4],
    })).toThrow(/non représentable/);
  });
});
