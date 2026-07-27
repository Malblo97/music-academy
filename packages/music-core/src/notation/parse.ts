import { TICKS } from '../types.js';
import type { Note, Meter } from '../types.js';
import { applySwing } from './swing.js';
import { applyHumanize } from './humanize.js';
import type { HumanizeOpts } from './humanize.js';

/**
 * Grammaire (annexe A) :
 *   score   := event (WS event)*        (les '|' sont des séparateurs ignorés MAIS comptés
 *                                        pour le contrôle de mesure : option strictBars)
 *   event   := (rest | note | chord) ':' dur tie?
 *   rest    := 'r'
 *   note    := PITCH tie?               (le tie POST-hauteur ne vaut que dans un accord, F-21)
 *   chord   := '[' note ('+' note)* ']'
 *   PITCH   := /[A-G](#|b)?-?\d/         (C4=60 ; Cb4=59 ; B#3=60 — enharmonie assumée, F-6)
 *   dur     := [whqes] '.'?
 *   tie     := '~'
 *
 * Sémantique des liaisons (le point délicat) :
 *  - `X:d~` (mono) : la note fusionne avec la PROCHAINE occurrence de la même hauteur —
 *    cette occurrence est obligatoirement dans l'événement qui suit immédiatement.
 *  - Dans un accord, `[E4~+F4]:q` : E4 est lié individuellement ; F4 attaque (F-21).
 *  - Une liaison dont la cible est absente de l'événement suivant est une erreur de
 *    compilation : « liaison F-21 sans cible : <note> lié mais absent de l'événement
 *    suivant (tick N) ».
 *  - `printNotation` régénère des liaisons équivalentes (le round-trip exige la
 *    conservation des positions/durées ; voir print.ts pour les limites d'orthographe).
 */

export interface ParseOpts {
  /** Si vrai, vérifie que chaque mesure délimitée par '|' totalise exactement les ticks de `meter`. */
  strictBars?: boolean;
  /** Requis si strictBars. */
  meter?: Meter;
  /** Appliqué après résolution des liaisons (avant humanize). */
  swingRatio?: number;
  /** Appliqué en dernier, après le swing. */
  humanize?: HumanizeOpts;
}

type TokenType = 'lbracket' | 'rbracket' | 'plus' | 'bar' | 'tie' | 'rest' | 'pitch' | 'dur' | 'ws';
interface Token { type: TokenType; value: string; pos: number }

const TOKEN_RE = /\[|\]|\+|\||~|r|[A-G](?:#|b)?-?\d|:[whqes]\.?|\s+/g;

function classify(v: string): TokenType {
  if (v === '[') return 'lbracket';
  if (v === ']') return 'rbracket';
  if (v === '+') return 'plus';
  if (v === '|') return 'bar';
  if (v === '~') return 'tie';
  if (v === 'r') return 'rest';
  if (v[0] === ':') return 'dur';
  if (/^\s+$/.test(v)) return 'ws';
  return 'pitch';
}

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let expected = 0;
  TOKEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TOKEN_RE.exec(src))) {
    if (m.index !== expected) {
      throw new Error(`notation: token inconnu à la position ${expected} : "${src.slice(expected, m.index)}"`);
    }
    const value = m[0];
    tokens.push({ type: classify(value), value, pos: m.index });
    expected = m.index + value.length;
  }
  if (expected !== src.length) {
    throw new Error(`notation: token inconnu à la position ${expected} : "${src.slice(expected)}"`);
  }
  return tokens.filter(t => t.type !== 'ws');
}

const PC_BASE: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

export function pitchToMidi(token: string): number {
  const m = /^([A-G])(#|b)?(-?\d)$/.exec(token);
  if (!m) throw new Error(`notation: hauteur invalide "${token}"`);
  const letter = m[1];
  const acc = m[2];
  const oct = m[3];
  if (!letter || !oct) throw new Error(`notation: hauteur invalide "${token}"`);
  const base = PC_BASE[letter];
  if (base === undefined) throw new Error(`notation: hauteur invalide "${token}"`);
  const pc = base + (acc === '#' ? 1 : acc === 'b' ? -1 : 0);
  return (parseInt(oct, 10) + 1) * 12 + pc;
}

const PC_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function midiToName(midi: number): string {
  const oct = Math.floor(midi / 12) - 1;
  const pc = ((midi % 12) + 12) % 12;
  return `${PC_NAMES[pc]}${oct}`;
}

function tickFor(letter: string): number {
  const v = TICKS[letter];
  if (v === undefined) throw new Error(`notation: durée inconnue "${letter}"`);
  return v;
}

function durToTicks(token: string): number {
  const m = /^:([whqes])(\.)?$/.exec(token);
  if (!m) throw new Error(`notation: durée invalide "${token}"`);
  const letter = m[1];
  if (!letter) throw new Error(`notation: durée invalide "${token}"`);
  const base = tickFor(letter);
  return m[2] ? base * 1.5 : base;
}

function meterUnitTicks(denominator: number): number {
  const map: Record<number, string> = { 1: 'w', 2: 'h', 4: 'q', 8: 'e', 16: 's' };
  const letter = map[denominator];
  if (letter === undefined) throw new Error(`notation: dénominateur de métrique non supporté : ${denominator}`);
  return tickFor(letter);
}

interface RawItem { pitch: number | null; tie: boolean; spelling?: string }
interface RawEvent { tick: number; items: RawItem[]; durTicks: number }

class TokenStream {
  private i = 0;
  constructor(private tokens: Token[]) {}
  peek(offset = 0): Token | undefined { return this.tokens[this.i + offset]; }
  next(): Token | undefined { return this.tokens[this.i++]; }
  get done(): boolean { return this.i >= this.tokens.length; }
}

function parseEvents(tokens: Token[], opts: ParseOpts): RawEvent[] {
  const events: RawEvent[] = [];
  let tick = 0;
  let barStart = 0;
  let barTicks: number | null = null;
  if (opts.strictBars) {
    if (!opts.meter) throw new Error('notation: strictBars requiert opts.meter');
    barTicks = opts.meter[0] * meterUnitTicks(opts.meter[1]);
  }

  const ts = new TokenStream(tokens);
  while (!ts.done) {
    const t = ts.peek();
    if (!t) break;

    if (t.type === 'bar') {
      ts.next();
      if (barTicks !== null) {
        const elapsed = tick - barStart;
        if (elapsed !== barTicks) {
          throw new Error(`notation: erreur de mesure : ${elapsed} ticks avant la barre, attendu ${barTicks} (tick ${barStart})`);
        }
      }
      barStart = tick;
      continue;
    }

    let items: RawItem[];
    if (t.type === 'rest') {
      ts.next();
      items = [{ pitch: null, tie: false }];
    } else if (t.type === 'lbracket') {
      ts.next();
      items = [];
      for (;;) {
        const pt = ts.peek();
        if (!pt) throw new Error('notation: accord non fermé (\']\' attendu)');
        if (pt.type === 'rbracket') break;
        if (pt.type === 'plus') { ts.next(); continue; }
        if (pt.type !== 'pitch') throw new Error(`notation: jeton inattendu "${pt.value}" dans l'accord (position ${pt.pos})`);
        const pitch = pitchToMidi(pt.value);
        const spelling = pt.value;
        ts.next();
        let tie = false;
        if (ts.peek()?.type === 'tie') { ts.next(); tie = true; }
        items.push({ pitch, tie, spelling });
      }
      ts.next(); // consomme ']'
    } else if (t.type === 'pitch') {
      const pitch = pitchToMidi(t.value);
      const spelling = t.value;
      ts.next();
      if (ts.peek()?.type === 'tie') ts.next(); // tie post-hauteur hors accord : sans effet (F-21)
      items = [{ pitch, tie: false, spelling }];
    } else {
      throw new Error(`notation: jeton inattendu "${t.value}" à la position ${t.pos}`);
    }

    const durTok = ts.next();
    if (!durTok || durTok.type !== 'dur') {
      throw new Error(`notation: durée manquante après l'événement (position ${t.pos})`);
    }
    const durTicks = durToTicks(durTok.value);

    if (ts.peek()?.type === 'tie') {
      ts.next();
      items = items.map(it => it.pitch === null ? it : { ...it, tie: true });
    }

    events.push({ tick, items, durTicks });
    tick += durTicks;
  }

  if (barTicks !== null) {
    const elapsed = tick - barStart;
    if (elapsed !== barTicks) {
      throw new Error(`notation: erreur de mesure : ${elapsed} ticks en fin de score, attendu ${barTicks} (tick ${barStart})`);
    }
  }

  return events;
}

/** Résolution des liaisons (2e passe) : fusionne les RawEvent en Note[]. */
function resolveTies(events: RawEvent[]): Note[] {
  const notes: Note[] = [];
  let pending = new Map<number, Note>();

  for (const ev of events) {
    const matched = new Set<number>();
    const nextPending = new Map<number, Note>();

    for (const item of ev.items) {
      if (item.pitch === null) continue;
      const open = pending.get(item.pitch);
      if (open) {
        matched.add(item.pitch);
        open.duration += ev.durTicks;
        if (item.tie) nextPending.set(item.pitch, open);
      } else {
        const note: Note = { pitch: item.pitch, start: ev.tick, duration: ev.durTicks };
        if (item.spelling !== undefined) note.spelling = item.spelling;
        notes.push(note);
        if (item.tie) nextPending.set(item.pitch, note);
      }
    }

    for (const [pitch, note] of pending) {
      if (!matched.has(pitch)) {
        throw new Error(`liaison F-21 sans cible : ${midiToName(pitch)} lié mais absent de l'événement suivant (tick ${note.start})`);
      }
    }

    pending = nextPending;
  }

  if (pending.size > 0) {
    const first = pending.entries().next().value as [number, Note];
    const [pitch, note] = first;
    throw new Error(`liaison F-21 sans cible : ${midiToName(pitch)} lié mais absent de l'événement suivant (tick ${note.start})`);
  }

  return notes;
}

export function parseNotation(src: string, opts: ParseOpts = {}): Note[] {
  const tokens = tokenize(src);
  const events = parseEvents(tokens, opts);
  let notes = resolveTies(events);
  if (opts.swingRatio !== undefined) notes = applySwing(notes, opts.swingRatio);
  if (opts.humanize) notes = applyHumanize(notes, opts.humanize);
  return notes;
}
