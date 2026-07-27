import { describe, it, expect } from 'vitest';
import { loadSolutions } from '../solutions.js';
import { parseNotation } from '../../src/notation/parse.js';
import { printNotation } from '../../src/notation/print.js';
import { TICKS } from '../../src/types.js';
import type { Meter } from '../../src/types.js';

/**
 * Verrou n°3 — round-trip sur TOUT le contenu réel (S1.J4 : « vert en CI sur
 * M1+M2 entiers »). `normalize` ne fait QUE nettoyer les espaces et
 * régénérer les barres selon le mètre : elle ne fusionne aucune liaison ni
 * ne change l'orthographe — elle opère sur les événements de surface tels
 * qu'écrits, pas sur le modèle résolu (`Note[]`). C'est délibérément plus
 * faible que la canonisation de `printNotation` (F-52) : si le contenu a été
 * écrit avec des jetons déjà légaux pour le mètre déclaré, l'aller-retour
 * doit passer sans qu'on ait besoin de re-choisir les durées.
 *
 * ⚠ Si une solution casse ce test, c'est presque toujours un accident de
 * copie de la Phase 0 (guillemets, tilde décollé, etc.) → corrige le CONTENU
 * et note-le au commit, ne relâche pas cette assertion.
 *
 * Aucune solution ne déclare de mètre (vérifié : ni `meter` dans les JSON de
 * solutions, ni dans les `module.json`) → 4/4 pour toutes, comme pour
 * `roundtrip-batch` dans test/fixtures/notation/solutions.test.ts.
 */
const METER: Meter = [4, 4];

function eventTicks(ev: string): number {
  const m = /:([whqes])(\.)?/.exec(ev);
  if (!m) throw new Error(`normalize: événement sans durée reconnaissable : "${ev}"`);
  const letter = m[1]!;
  const base = TICKS[letter]!;
  return m[2] ? base * 1.5 : base;
}

/**
 * Isole les événements de surface tels qu'écrits. La grammaire (parse.ts)
 * n'exige AUCUN espace entre deux événements — seuls les tokens `|` et les
 * espaces sont de purs séparateurs — donc `split(/\s+/)` casse dès qu'un
 * fichier réel colle deux événements sans espace (rencontré sur du contenu
 * réel : `A4:e~A4:q`, valide pour le parseur, illisible pour un split naïf).
 * On rejoue plutôt la même grammaire : accord `[...]`, repos `r`, ou hauteur
 * (+ liaison interne optionnelle), suivi de ':' durée (+ point optionnel)
 * (+ liaison finale optionnelle).
 */
const EVENT_RE = /(?:\[[^\]]*\]|r|[A-G](?:#|b)?-?\d~?):[whqes]\.?~?/g;

function normalize(src: string, meter: Meter): string {
  const bar = meter[0] * (TICKS.w! / meter[1]);
  const events = src.match(EVENT_RE) ?? [];
  let tick = 0;
  let barIndex = 0;
  const parts: string[] = [];
  for (const ev of events) {
    const evBar = Math.floor(tick / bar);
    while (barIndex < evBar) { parts.push('|'); barIndex++; }
    parts.push(ev);
    tick += eventTicks(ev);
  }
  return parts.join(' ');
}

/**
 * Somme de toutes les durées de surface, silences finaux compris. `Note[]`
 * ne peut pas représenter un silence final (F-52) : sans ce total, `printNotation`
 * s'arrête à la fin de la dernière note sonnante et un silence explicite en
 * fin d'écriture disparaît de la sortie.
 */
function totalTicks(src: string): number {
  const events = src.match(EVENT_RE) ?? [];
  return events.reduce((acc, ev) => acc + eventTicks(ev), 0);
}

const withNotation = loadSolutions().filter((s): s is typeof s & { notation: string } => typeof s.notation === 'string');

describe('verrou n°3 : round-trip sur le contenu réel', () => {
  it('charge au moins une solution avec notation', () => {
    expect(withNotation.length).toBeGreaterThan(0);
  });

  it.each(withNotation.map(s => [`${s.module}/${s.file}`, s.notation] as const))('roundtrip %s', (_label, notation) => {
    const notes = parseNotation(notation);
    const lengthTicks = totalTicks(notation);
    const printed = printNotation({ notes, meter: METER, lengthTicks });
    expect(printed).toBe(normalize(notation, METER));
  });
});
