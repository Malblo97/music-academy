import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseNotation } from '../../../src/notation/parse.js';
import { printNotation } from '../../../src/notation/print.js';
import type { Meter, Note } from '../../../src/types.js';

/**
 * Les deux fixtures de S1.J4 qui lisent du contenu réel (`packages/content`).
 * L'ANCIEN énoncé du verrou n°3 (`print(parse(x)) === normalize(x)`) est faux
 * par construction et a été retiré par F-52 (voir notation.roundtrip.test.ts) :
 * ici, l'aller-retour se vérifie sur le MODÈLE, pas sur la chaîne.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_SOLUTIONS = join(__dirname, '../../../../content/solutions');

interface Solution { file: string; notation: string }

function loadSolutions(moduleDir: string): Solution[] {
  const dir = join(CONTENT_SOLUTIONS, moduleDir);
  return readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .sort()
    .map(file => {
      const raw = JSON.parse(readFileSync(join(dir, file), 'utf8')) as Record<string, unknown>;
      if (typeof raw.notation !== 'string') {
        throw new Error(`solutions/${moduleDir}/${file} : champ "notation" absent ou invalide`);
      }
      return { file, notation: raw.notation };
    });
}

/** mulberry32 (même PRNG que humanize.ts) — tirage déterministe à seed fixe. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ROUNDTRIP_BATCH_SEED = 20260101;

function pickN<T>(items: readonly T[], n: number, seed: number): T[] {
  const rand = mulberry32(seed);
  const pool = [...items];
  const picked: T[] = [];
  for (let i = 0; i < n && pool.length > 0; i++) {
    const idx = Math.floor(rand() * pool.length);
    picked.push(pool.splice(idx, 1)[0]!);
  }
  return picked;
}

const project = (ns: readonly Note[]) =>
  ns.map(n => ({ pitch: n.pitch, start: n.start, duration: n.duration }))
    .sort((a, b) => a.start - b.start || a.pitch - b.pitch);

/** Aller-retour F-52 sur du contenu réel : modèle + point fixe + orthographe. */
function assertRoundtrip(notation: string, meter: Meter): void {
  const notes = parseNotation(notation);
  const bar = meter[0] * (1920 / meter[1]);
  const maxEnd = notes.reduce((a, n) => Math.max(a, n.start + n.duration), 0);
  const lengthTicks = Math.max(bar, Math.ceil(maxEnd / bar) * bar);
  const printed = printNotation({ notes, meter, lengthTicks });

  // 1. le modèle survit à l'aller-retour
  expect(project(parseNotation(printed))).toEqual(project(notes));
  // 2. la sortie est un point fixe
  expect(printNotation({ notes: parseNotation(printed), meter, lengthTicks })).toBe(printed);
  // 3. l'orthographe d'origine est préservée
  for (const n of notes) expect(printed).toContain(n.spelling!);
}

describe('notation fixtures (S1.J4) : contenu réel', () => {
  it('roundtrip-batch : 10 solutions M1 (seed fixe) survivent à l\'aller-retour F-52', () => {
    const solutions = loadSolutions('m01');
    expect(solutions.length).toBeGreaterThanOrEqual(10);

    // Aucune des 27 solutions M1 ne déclare de mètre (vérifié : `grep -rl meter`
    // sur solutions/m01 et solutions/m02 ne retourne rien, et module.json de M1
    // n'en porte pas non plus) — fallback [4, 4] pour toutes, pas seulement pour
    // un sous-ensemble monophonique. Signalé au rapport.
    const meter: Meter = [4, 4];
    const batch = pickN(solutions, 10, ROUNDTRIP_BATCH_SEED);

    for (const { file, notation } of batch) {
      try {
        assertRoundtrip(notation, meter);
      } catch (err) {
        throw new Error(`roundtrip-batch : échec sur ${file} — ${(err as Error).message}`);
      }
    }
  });

  it('solution-m03-s02 : 32 notes (8 accords × 4), aller-retour', () => {
    // Nom de fixture hérité du tutoriel (`m03-e02*`) ; le fichier réel porte le
    // nom post-renommage (décision n°20, DECISIONS_LOCALES) : `sXX` = numéro
    // d'exercice, pas un compteur positionnel — m03-e02-solemn-shadow reste
    // donc bien `m03-s02-*`.
    const raw = JSON.parse(
      readFileSync(join(CONTENT_SOLUTIONS, 'm03', 'm03-s02-solemn-shadow.json'), 'utf8'),
    ) as Record<string, unknown>;
    if (typeof raw.notation !== 'string') throw new Error('solutions/m03/m03-s02-solemn-shadow.json : champ "notation" absent ou invalide');

    const notes = parseNotation(raw.notation);
    expect(notes).toHaveLength(32); // 8 accords de 4 notes

    const meter: Meter = [4, 4]; // aucune solution M1-M3 ne déclare de mètre : fallback [4,4] (cf. roundtrip-batch)
    assertRoundtrip(raw.notation, meter);
  });
});
