import { TICKS } from '../../types.js';
import type { Checker } from './types.js';
import { allJudged, asNumber, fail, line, ok } from './types.js';

const BAR = TICKS.w ?? 1920;

/** `checkers/structure.ts` — longueurs, phrases, segments, ostinato, coda. */
export const STRUCTURE_CHECKERS: Record<string, Checker> = {
  segmentBars: (_k, value, ctx) => {
    const size = asNumber(value);
    const notes = allJudged(ctx);
    if (size === null || notes.length === 0) return ok('rien à mesurer');
    const bars = notes.reduce((m, n) => Math.max(m, n.start + n.duration), 0) / BAR;
    return bars % size === 0
      ? ok(`${bars} mesures, divisible en segments de ${size}`)
      : fail(`${bars} mesures : le découpage en segments de ${size} ne tombe pas juste`);
  },

  codaBars: (_k, value, ctx) => {
    const size = asNumber(value);
    const notes = allJudged(ctx);
    if (size === null || notes.length === 0) return ok('rien à mesurer');
    const total = notes.reduce((m, n) => Math.max(m, n.start + n.duration), 0);
    return total > size * BAR
      ? ok(`la pièce laisse ${size} mesure(s) de coda`)
      : fail(`la pièce fait ${total / BAR} mesures : il n'y a pas la place pour une coda de ${size}`);
  },

  codaMaxVoices: (_k, value, ctx) => {
    const max = asNumber(value);
    const codaBars = asNumber(ctx.spec.constraints?.codaBars);
    const list = ctx.analysis.verticals ?? [];
    if (max === null || codaBars === null || list.length === 0) return ok('rien à mesurer');
    const end = Math.max(...list.map(v => v.to));
    const coda = list.filter(v => v.from >= end - codaBars * BAR);
    const worst = coda.length > 0 ? Math.max(...coda.map(v => new Set(v.notes.map(n => n.pitch)).size)) : 0;
    return worst <= max
      ? ok(`coda à ${worst} voix ≤ ${max}`)
      : fail(`coda à ${worst} voix, maximum ${max} — la fin doit se dépouiller`);
  },

  ostinatoRequired: (_k, value, ctx) => {
    if (value !== true) return ok('non exigé');
    const repeats = ctx.analysis.motifs?.maxExactRepetitions ?? 0;
    return repeats >= 3
      ? ok(`figure répétée ${repeats} fois à l'identique : l'ostinato est en place`)
      : fail('aucune figure répétée au moins 3 fois : il n\'y a pas d\'ostinato');
  },

  ostinatoMaxDistinctPitches: (_k, value, ctx) => {
    const max = asNumber(value);
    const notes = line(ctx);
    if (max === null || notes.length === 0) return ok('rien à mesurer');
    const distinct = new Set(notes.map(n => n.pitch)).size;
    return distinct <= max
      ? ok(`${distinct} hauteurs distinctes ≤ ${max}`)
      : fail(`${distinct} hauteurs distinctes dans l'ostinato, maximum ${max}`);
  },

  ostinatoRegisterMax: (_k, value, ctx) => {
    const max = asNumber(value);
    const notes = line(ctx);
    if (max === null || notes.length === 0) return ok('rien à mesurer');
    const highest = Math.max(...notes.map(n => n.pitch));
    return highest <= max
      ? ok(`ostinato sous ${max} (sommet ${highest})`)
      : fail(`l'ostinato monte à ${highest}, plafond ${max}`);
  },

  requireRestAtBar: (_k, value, ctx) => {
    const bars = Array.isArray(value) ? value.filter((v): v is number => typeof v === 'number') : [];
    if (bars.length === 0) return ok('rien à mesurer', 'declared');
    const notes = allJudged(ctx);
    const missing = bars.filter(bar => {
      const from = (bar - 1) * BAR;
      const to = bar * BAR;
      const sounding = notes.reduce((s, n) => s + Math.max(0, Math.min(n.start + n.duration, to) - Math.max(n.start, from)), 0);
      return sounding >= to - from;
    });
    return missing.length === 0
      ? ok(`silence présent aux mesures ${bars.join(', ')}`)
      : fail(`aucun silence à la/aux mesure(s) ${missing.join(', ')}`);
  },

  maxPhraseNotes: (_k, value, ctx) => {
    const max = asNumber(value);
    const phrases = ctx.analysis.phrases;
    if (max === null || !phrases) return ok('rien à mesurer');
    const worst = phrases.phrases.reduce((m, p) => Math.max(m, p.noteCount), 0);
    return worst <= max
      ? ok(`plus longue phrase ${worst} notes ≤ ${max}`)
      : fail(`une phrase porte ${worst} notes, maximum ${max}`);
  },

  voices: (_k, value, ctx) => {
    const count = asNumber(value);
    const list = ctx.analysis.voices;
    if (count === null || !list) return ok('rien à mesurer', 'declared');
    return list.length === count
      ? ok(`${count} voix, conforme`)
      : fail(`${list.length} voix, attendu ${count}`);
  },
};
