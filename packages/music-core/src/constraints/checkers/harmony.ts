import type { Checker } from './types.js';
import { asNumber, asNumbers, asRange, asStrings, fail, ok, pc } from './types.js';
import type { RuleCtx } from '../../rules/types.js';
import { functionOf } from '../../analyzers/cadence.js';

/** Seuil des guide tones (annexe C) : sous 0.6, la grille ne se raconte plus. */
const GUIDE_TONE_THRESHOLD = 0.6;

function cadences(ctx: RuleCtx) {
  return (ctx.analysis.cadences ?? []).filter(c => ctx.window.judges(c.at));
}

function chords(ctx: RuleCtx) {
  return (ctx.analysis.chords ?? []).filter(c => ctx.window.judges(c.from));
}

/**
 * Les degrés en chiffres romains, tels que les specs modales les écrivent :
 * `modal:♭VII-I`, `modal:IV-i`, `modal:bII-i`. La casse ne porte que la
 * qualité (majeur/mineur), pas le degré — `IV` et `iv` sont le même degré.
 */
const ROMAN_DEGREE: Record<string, number> = {
  i: 0, bii: 1, ii: 2, biii: 3, iii: 4, iv: 5, bv: 6, v: 7, bvi: 8, vi: 9, bvii: 10, vii: 11,
};

function romanToDegree(raw: string): number | null {
  const key = raw.trim().toLowerCase().replace(/♭/g, 'b').replace(/♯/g, '#');
  return ROMAN_DEGREE[key] ?? null;
}

/** `modal:♭VII-I` → [10, 0]. Rend `null` si l'étiquette n'est pas de cette famille. */
function parseModalLabel(label: string): [number, number] | null {
  const match = /^modal\s*:\s*([#b♭♯]?[ivIV]+)\s*-\s*([#b♭♯]?[ivIV]+)$/.exec(label);
  if (!match) return null;
  const from = romanToDegree(match[1]!);
  const to = romanToDegree(match[2]!);
  return from === null || to === null ? null : [from, to];
}

export const HARMONY_CHECKERS: Record<string, Checker> = {
  /**
   * **La cadence EXIGÉE — présente, pas forcément finale.**
   *
   * Le checker comparait la dernière cadence de la pièce, ce qui faisait
   * doublon avec `finalCadence` (qui existe, et qui est employée par quatre
   * specs). Les deux clés doivent dire deux choses différentes, sinon l'auteur
   * de specs n'a aucun moyen d'exprimer « la pièce contient une cadence
   * parfaite » — ce que demande exactement `m03-e11-weightless`, dont la
   * parfaite ANCRE les quatre premières mesures (« l'auditeur doit avoir un
   * monde à perdre ») avant que la pièce ne parte en apesanteur.
   *
   * Deux vocabulaires cohabitent : les catégories fonctionnelles (`perfect`,
   * `half`…) et les formules MODALES (`modal:IV-i`), que M3 nomme par leur
   * chemin exact — en modal il n'y a pas de dominante pour porter la fonction,
   * donc c'est le chemin QUI EST la cadence.
   */
  requiredCadence: (_k, value, ctx) => {
    const wanted = typeof value === 'string' ? value : null;
    if (!wanted) return ok('rien à mesurer');
    const found = cadences(ctx);
    if (found.length === 0) return fail(`aucune cadence détectée, « ${wanted} » attendue`);

    const modal = parseModalLabel(wanted);
    if (modal) {
      const hit = found.find(c => c.degrees && c.degrees[0] === modal[0] && c.degrees[1] === modal[1]);
      return hit
        ? ok(`cadence modale « ${wanted} » à la mesure ${Math.floor(hit.at / 1920) + 1}`)
        : fail(`aucune cadence modale ${modal[0]}→${modal[1]} (demi-tons) ; trouvé : ${found.map(c => c.degrees ? `${c.degrees[0]}→${c.degrees[1]}` : c.kind).join(', ')}`);
    }

    const hit = found.find(c => c.kind === wanted);
    return hit
      ? ok(`cadence « ${wanted} » à la mesure ${Math.floor(hit.at / 1920) + 1}`)
      : fail(`aucune cadence « ${wanted} » ; trouvé : ${found.map(c => c.kind).join(', ')}`);
  },

  /** **F-14** : plusieurs cadences peuvent conclure légitimement. */
  requiredCadences: (_k, value, ctx) => {
    const wanted = asStrings(value);
    if (!wanted) return ok('rien à mesurer', 'declared');
    const kinds = new Set(cadences(ctx).map(c => c.kind));
    const missing = wanted.filter(w => !kinds.has(w as never));
    return missing.length === 0
      ? ok(`cadences présentes : ${wanted.join(', ')}`)
      : fail(`cadence(s) manquante(s) : ${missing.join(', ')}`);
  },

  finalCadence: (_k, value, ctx) => {
    const wanted = typeof value === 'string' ? value : null;
    if (!wanted) return ok('rien à mesurer');
    const found = cadences(ctx);
    const last = found[found.length - 1];
    // Les libellés composés (« plagal-borrowed ») portent la nature en tête.
    const head = wanted.split('-')[0];
    if (!last) return fail(`aucune cadence finale, « ${wanted} » attendue`);
    return last.kind === head
      ? ok(`cadence finale de nature « ${head} » (déclarée « ${wanted} »)`)
      : fail(`cadence finale « ${last.kind} », attendue « ${wanted} »`);
  },

  forbiddenCadences: (_k, value, ctx) => {
    const banned = asStrings(value);
    if (!banned) return ok('rien à mesurer');
    const guilty = cadences(ctx).filter(c => banned.includes(c.kind));
    return guilty.length === 0
      ? ok(`aucune cadence proscrite (${banned.join(', ')})`)
      : fail(`cadence « ${guilty[0]!.kind} » interdite, au tick ${guilty[0]!.at}`);
  },

  forbiddenCadencesBeforeBar: (_k, value, ctx) => {
    const bar = asNumber(value);
    if (bar === null) return ok('rien à mesurer');
    const limit = (bar - 1) * 1920;
    const early = cadences(ctx).filter(c => c.at < limit);
    return early.length === 0
      ? ok(`aucune cadence avant la mesure ${bar}`)
      : fail(`cadence « ${early[0]!.kind} » au tick ${early[0]!.at}, avant la mesure ${bar}`);
  },

  requireEstablishingCadence: (_k, value, ctx) => {
    if (value !== true) return ok('non exigé');
    const found = cadences(ctx);
    const early = found.filter(c => c.at <= 8 * 1920);
    return early.length > 0
      ? ok(`cadence d'établissement au tick ${early[0]!.at}`)
      : fail('rien n\'établit le ton au début : l\'auditeur n\'a pas de maison à perdre');
  },

  requireConfirmingCadence: (_k, value, ctx) => {
    if (value !== true) return ok('non exigé');
    const found = cadences(ctx);
    return found.length >= 2
      ? ok(`${found.length} cadences : l'arrivée est confirmée`)
      : fail('une seule cadence : l\'arrivée n\'est pas confirmée');
  },

  penultimateDegrees: (_k, value, ctx) => {
    const degrees = asNumbers(value);
    const list = chords(ctx);
    if (!degrees || list.length < 2) return ok('rien à mesurer');
    const penult = list[list.length - 2]!;
    const degree = pc(penult.chord.root - ctx.analysis.key.tonic);
    const semitones = degrees.map(d => [0, 0, 2, 4, 5, 7, 9, 11][d] ?? 0);
    return semitones.includes(degree)
      ? ok(`avant-dernier accord sur un degré admis`)
      : fail(`avant-dernier accord au degré ${degree} (demi-tons), admis : ${degrees.join(', ')}`);
  },

  functionPlan: (_k, value, ctx) => {
    const plan = asStrings(value);
    const list = chords(ctx);
    if (!plan || list.length === 0) return ok('rien à mesurer', 'declared');
    const found = list.map(c => functionOf(c.chord, ctx.analysis.key));
    const matches = plan.every((f, i) => found[i] === undefined || found[i] === f);
    return matches
      ? ok(`suite de fonctions conforme (${found.join('–')})`)
      : fail(`fonctions mesurées ${found.join('–')}, plan ${plan.join('–')}`);
  },

  requirePlainTriadCount: (_k, value, ctx) => {
    const range = asRange(value);
    const list = chords(ctx);
    if (!range) return ok('rien à mesurer');
    const plain = list.filter(c => c.chord.form === 'maj' || c.chord.form === 'min' || c.chord.form === 'dim' || c.chord.form === 'aug');
    return plain.length >= range[0] && plain.length <= range[1]
      ? ok(`${plain.length} triades nues, dans ${range[0]}–${range[1]}`)
      : fail(`${plain.length} triades nues, attendu ${range[0]}–${range[1]}`);
  },

  minEnrichedChords: (_k, value, ctx) => {
    const min = asNumber(value);
    const list = chords(ctx);
    if (min === null) return ok('rien à mesurer');
    const enriched = list.filter(c => !['maj', 'min', 'dim', 'aug'].includes(c.chord.form));
    return enriched.length >= min
      ? ok(`${enriched.length} accords enrichis ≥ ${min}`)
      : fail(`${enriched.length} accords enrichis, minimum ${min}`);
  },

  forbidEnrichmentOnDegrees: (_k, value, ctx) => {
    const degrees = asNumbers(value);
    const list = chords(ctx);
    if (!degrees) return ok('rien à mesurer');
    const semitones = degrees.map(d => [0, 0, 2, 4, 5, 7, 9, 11][d] ?? 0);
    const guilty = list.filter(c =>
      semitones.includes(pc(c.chord.root - ctx.analysis.key.tonic)) &&
      !['maj', 'min', 'dim', 'aug'].includes(c.chord.form));
    return guilty.length === 0
      ? ok(`les degrés ${degrees.join('/')} restent nus`)
      : fail(`accord enrichi sur un degré qui doit rester nu, au tick ${guilty[0]!.from}`);
  },

  maxBorrowedChords: (_k, value, ctx) => {
    const max = asNumber(value);
    const list = chords(ctx);
    if (max === null) return ok('rien à mesurer');
    const key = ctx.analysis.key;
    const diatonic = new Set([0, 2, 4, 5, 7, 9, 11].map(d => pc(d + key.tonic)));
    const borrowed = list.filter(c => !diatonic.has(pc(c.chord.root)));
    return borrowed.length <= max
      ? ok(`${borrowed.length} emprunt(s) ≤ ${max}`)
      : fail(`${borrowed.length} emprunts, maximum ${max}`);
  },

  mustKeepOneNaturalDominant: (_k, value, ctx) => {
    if (value !== true) return ok('non exigé');
    const list = chords(ctx);
    const tagged = ctx.analysis.idioms ?? [];
    const natural = list.filter(c =>
      pc(c.chord.root - ctx.analysis.key.tonic) === 7 &&
      !tagged.some(t => c.from >= t.from && c.from < t.to));
    return natural.length > 0
      ? ok('une dominante naturelle subsiste : le contraste porte/couloir tient')
      : fail('toutes les dominantes sont substituées : sans porte, le couloir ne veut plus rien dire');
  },

  minSubstitutions: (_k, value, ctx) => {
    const min = asNumber(value);
    if (min === null) return ok('rien à mesurer');
    const subs = (ctx.analysis.idioms ?? []).filter(t => t.family === 'subV' && ctx.window.judges(t.from));
    return subs.length >= min
      ? ok(`${subs.length} substitution(s) ≥ ${min}`)
      : fail(`${subs.length} substitution(s) détectée(s), minimum ${min}`);
  },

  commonToneThread: (_k, value, ctx) => {
    if (value !== true) return ok('non exigé');
    // **F-7** : le fil d'OCTAVE compte pour moitié — c'est la même note, à un
    // autre étage ; elle tient le fil sans le tenir tout à fait.
    const list = chords(ctx);
    if (list.length < 2) return ok('rien à mesurer');
    let held = 0;
    for (let i = 1; i < list.length; i++) {
      const before = new Set(list[i - 1]!.notes.map(n => n.pitch));
      const now = list[i]!.notes.map(n => n.pitch);
      if (now.some(p => before.has(p))) { held += 1; continue; }
      const beforePc = new Set([...before].map(pc));
      if (now.some(p => beforePc.has(pc(p)))) held += 0.5;
    }
    const ratio = held / (list.length - 1);
    return ratio >= 0.5
      ? ok(`fil de note commune sur ${Math.round(ratio * 100)} % des liaisons (octaves créditées 0.5, F-7)`)
      : fail(`le fil casse : seulement ${Math.round(ratio * 100)} % des liaisons gardent une note`);
  },

  guideToneTargets: (_k, value, ctx) => {
    const list = chords(ctx);
    if (list.length === 0) return ok('rien à mesurer');
    const jazz = ctx.spec.styleProfile?.id === 'jazz';
    const targets = jazz ? [4, 3, 10, 11, 2, 9] : [4, 3, 10, 11]; // 3 et 7, + 9 et 13 en jazz
    let hits = 0;
    for (const chord of list) {
      const top = chord.notes.reduce((best, n) => (n.pitch > best.pitch ? n : best), chord.notes[0]!);
      if (top && targets.includes(pc(top.pitch - chord.chord.root))) hits++;
    }
    const ratio = hits / list.length;
    return ratio >= GUIDE_TONE_THRESHOLD
      ? ok(`guide tones sur ${Math.round(ratio * 100)} % des accords ≥ ${GUIDE_TONE_THRESHOLD * 100} %`)
      : fail(`guide tones sur ${Math.round(ratio * 100)} % des accords, seuil ${GUIDE_TONE_THRESHOLD * 100} %`);
  },

  chordToneRatioMin: (_k, value, ctx) => {
    const min = asNumber(value);
    const list = chords(ctx);
    if (min === null || list.length === 0) return ok('rien à mesurer');
    const notes = ctx.analysis.notes.filter(n => ctx.window.judges(n.start));
    let inside = 0;
    for (const note of notes) {
      const chord = list.find(c => note.start >= c.from && note.start < c.to);
      if (!chord) continue;
      if (chord.chord.pcs.includes(pc(note.pitch))) inside++;
    }
    const ratio = notes.length > 0 ? inside / notes.length : 1;
    return ratio >= min
      ? ok(`notes d'accord ${ratio.toFixed(2)} ≥ ${min}`)
      : fail(`notes d'accord ${ratio.toFixed(2)}, minimum ${min}`);
  },

  closedPositionRequired: (_k, value, ctx) => {
    if (value !== true) return ok('non exigé');
    const list = (ctx.analysis.verticals ?? []).filter(v => ctx.window.judges(v.from));
    for (const v of list) {
      const upper = [...new Set(v.notes.map(n => n.pitch))].sort((a, b) => a - b).slice(1);
      for (let i = 1; i < upper.length; i++) {
        if (upper[i]! - upper[i - 1]! > 12) {
          return fail(`position ouverte au tick ${v.from} : ${upper[i]! - upper[i - 1]!} demi-tons entre deux voix supérieures`);
        }
      }
    }
    return ok('toutes les verticalités en position serrée');
  },

  maxDistinctChordsPerTour: (_k, value, ctx) => {
    const max = asNumber(value);
    const list = chords(ctx);
    if (max === null || list.length === 0) return ok('rien à mesurer');
    const distinct = new Set(list.map(c => `${c.chord.root}:${c.chord.form}`)).size;
    return distinct <= max
      ? ok(`${distinct} accords distincts ≤ ${max}`)
      : fail(`${distinct} accords distincts, maximum ${max}`);
  },

  minVoices: (_k, value, ctx) => {
    const min = asNumber(value);
    const list = ctx.analysis.verticals ?? [];
    if (min === null || list.length === 0) return ok('rien à mesurer');
    const worst = Math.min(...list.map(v => new Set(v.notes.map(n => n.pitch)).size));
    return worst >= min ? ok(`au moins ${worst} voix partout ≥ ${min}`) : fail(`${worst} voix seulement à un endroit, minimum ${min}`);
  },

  maxVoices: (_k, value, ctx) => {
    const max = asNumber(value);
    const list = ctx.analysis.verticals ?? [];
    if (max === null || list.length === 0) return ok('rien à mesurer');
    const worst = Math.max(...list.map(v => new Set(v.notes.map(n => n.pitch)).size));
    return worst <= max ? ok(`au plus ${worst} voix ≤ ${max}`) : fail(`${worst} voix à un endroit, maximum ${max}`);
  },

  innerChromaticLine: (_k, value, ctx) => {
    const degrees = asNumbers(value);
    if (!degrees || degrees.length < 2) return ok('rien à mesurer', 'declared');
    const voices = ctx.analysis.voices;
    if (!voices) return ok('ligne interne non séparable sans voix déclarées', 'declared');
    const wanted = degrees.map(d => pc(d + ctx.analysis.key.tonic));
    for (let vi = 1; vi < voices.length - 1; vi++) {
      const pcs = voices[vi]!.map(n => pc(n.pitch));
      for (let s = 0; s + wanted.length <= pcs.length; s++) {
        if (wanted.every((w, i) => pcs[s + i] === w)) {
          return ok(`ligne chromatique interne trouvée à la voix ${vi + 1}`);
        }
      }
    }
    return fail(`la ligne ${degrees.join('–')} n'apparaît dans aucune voix interne`);
  },
};
