import type { Issue, Note } from '../types.js';
import type { KeyEstimate } from './key.js';
import type { CadenceEvent, TimedChord } from './cadence.js';
import { functionOf } from './cadence.js';
import type { IdiomTag } from './idioms.js';

/**
 * `voiceleading.ts` — les quatre familles de la conduite, et surtout leurs
 * EXCEPTIONS CODÉES. Une règle sans ses exceptions ne fait pas un professeur :
 * elle fait un correcteur orthographique. Chaque exception rend ici un message
 * dédié — l'élève doit apprendre POURQUOI c'est permis ici et défendu là.
 */

export interface VoiceLeadingCtx {
  /** Les idiomes tagués EN AMONT (F-15/F-16 : dépendance d'ordre du pipeline). */
  idioms?: readonly IdiomTag[];
  /** Les cadences détectées : la zone cadentielle ouvre l'exception de l'octave directe. */
  cadences?: readonly CadenceEvent[];
  /** Ticks où un échange de voix est déclaré : la 7e peut y monter. */
  voiceExchanges?: readonly number[];
  /**
   * Les accords chiffrés. **F-66** : la sensible ne se juge qu'en CONTEXTE
   * FONCTIONNEL. Sans eux, tout 7e degré de la tonalité globale est pris pour
   * une sensible — y compris la septième d'un Fmaj7 dans une grille jazz qui
   * module toutes les deux mesures.
   */
  chords?: readonly TimedChord[];
}

/** Écart maximal entre deux voix supérieures adjacentes (la basse est libre). */
const MAX_UPPER_SPACING = 12;

/** Fenêtre autour d'une cadence où l'octave directe est excusée. */
const CADENCE_WINDOW = 1920;

function pc(n: number): number {
  return ((n % 12) + 12) % 12;
}

function isStep(a: number, b: number): boolean {
  const d = Math.abs(a - b);
  return d >= 1 && d <= 2;
}

interface Slice {
  at: number;
  /** Hauteur sonnant dans chaque voix (null = la voix se tait). */
  pitches: (number | null)[];
}

/** Découpe les voix en verticalités : une par attaque, toutes voix confondues. */
function slicesOf(voices: readonly (readonly Note[])[]): Slice[] {
  const onsets = [...new Set(voices.flatMap(v => v.map(n => n.start)))].sort((a, b) => a - b);
  return onsets.map(at => ({
    at,
    pitches: voices.map(voice => {
      const sounding = voice.find(n => n.start <= at && n.start + n.duration > at);
      return sounding ? sounding.pitch : null;
    }),
  }));
}

/** Index des voix extrêmes (la plus grave, la plus aiguë) sur une verticalité. */
function outerVoices(slice: Slice): { bass: number; soprano: number } | null {
  const present = slice.pitches.map((p, i) => ({ p, i })).filter((x): x is { p: number; i: number } => x.p !== null);
  if (present.length < 2) return null;
  const bass = present.reduce((lo, x) => (x.p < lo.p ? x : lo));
  const soprano = present.reduce((hi, x) => (x.p > hi.p ? x : hi));
  return { bass: bass.i, soprano: soprano.i };
}

function tagsAt(ctx: VoiceLeadingCtx, tick: number): IdiomTag[] {
  return (ctx.idioms ?? []).filter(t => tick >= t.from && tick < t.to);
}

function nearCadence(ctx: VoiceLeadingCtx, tick: number): boolean {
  const cadences = ctx.cadences ?? [];
  if (cadences.length === 0) return true; // sans information cadentielle, on n'invente pas de faute de zone
  return cadences.some(c => Math.abs(c.at - tick) <= CADENCE_WINDOW);
}

/**
 * F-15 — les « quintes de Mozart » : la paire ♭6̂→5̂ // ♭3̂→2̂ sous une sixte
 * augmentée allemande. Ces quintes-là sont dans la littérature depuis deux
 * siècles ; sous le tag `aug6`, elles descendent en `info`, JAMAIS en erreur.
 */
function isMozartFifths(key: KeyEstimate, from: [number, number], to: [number, number]): boolean {
  const degrees = [pc(from[0] - key.tonic), pc(from[1] - key.tonic)].sort((a, b) => a - b);
  const resolved = [pc(to[0] - key.tonic), pc(to[1] - key.tonic)].sort((a, b) => a - b);
  const fromOk = degrees[0] === 3 && degrees[1] === 8; // ♭3̂ et ♭6̂
  const toOk = resolved[0] === 2 && resolved[1] === 7; // 2̂ et 5̂
  return fromOk && toOk;
}

function parallelIssues(
  slices: readonly Slice[],
  key: KeyEstimate,
  ctx: VoiceLeadingCtx,
  voiceCount: number,
): Issue[] {
  const issues: Issue[] = [];
  for (let s = 0; s < slices.length - 1; s++) {
    const a = slices[s]!;
    const b = slices[s + 1]!;
    const outer = outerVoices(b);

    for (let i = 0; i < voiceCount; i++) {
      for (let j = i + 1; j < voiceCount; j++) {
        const a1 = a.pitches[i];
        const a2 = a.pitches[j];
        const b1 = b.pitches[i];
        const b2 = b.pitches[j];
        if (a1 === null || a2 === null || b1 === null || b2 === null) continue;
        if (a1 === undefined || a2 === undefined || b1 === undefined || b2 === undefined) continue;

        // La classe d'intervalle se mesure du grave vers l'aigu : `pc(a - b)`
        // rendrait 5 pour une quinte lue à l'envers, et la parallèle échapperait.
        const before = pc(Math.abs(a1 - a2));
        const after = pc(Math.abs(b1 - b2));
        const perfect = after === 0 || after === 7;
        if (!perfect) continue;

        const d1 = b1 - a1;
        const d2 = b2 - a2;
        const similar = d1 !== 0 && d2 !== 0 && Math.sign(d1) === Math.sign(d2);
        if (!similar) continue; // arrivée par mouvement contraire ou oblique : légal, silencieux

        const label = after === 0 ? 'octaves' : 'quintes';
        const planing = tagsAt(ctx, a.at).some(t => t.family === 'planing');

        if (before === after) {
          // Parallèles vraies.
          if (planing) {
            issues.push({
              ruleId: 'vl.parallel-perfects',
              severity: 'info',
              atTick: b.at,
              message: `${label} parallèles créditées : le planing EST le procédé (tag posé)`,
              lessonRef: 'm03-l14',
            });
            continue;
          }
          const aug6 = tagsAt(ctx, a.at).some(t => t.family === 'aug6');
          if (after === 7 && aug6 && isMozartFifths(key, [a1, a2], [b1, b2])) {
            issues.push({
              ruleId: 'vl.mozart-fifths',
              severity: 'info',
              atTick: b.at,
              message: 'quintes de Mozart (♭6̂→5̂ // ♭3̂→2̂ sous sixte augmentée) — F-15 : nommées, jamais fautives',
              lessonRef: 'm03-l03',
            });
            continue;
          }
          issues.push({
            ruleId: 'vl.parallel-perfects',
            severity: 'error',
            atTick: b.at,
            message: `${label} parallèles entre les voix ${i + 1} et ${j + 1}`,
            lessonRef: 'm01-l12',
          });
          continue;
        }

        // Directes (mouvement semblable VERS une parfaite) : seules les voix
        // extrêmes sont jugées, et le soprano par degré en zone cadentielle
        // couvre le cas — l'exception « soprano par degré ».
        if (!outer || !((i === outer.bass && j === outer.soprano) || (j === outer.bass && i === outer.soprano))) continue;
        const sopranoIndex = outer.soprano;
        const sopranoStep = isStep(a.pitches[sopranoIndex]!, b.pitches[sopranoIndex]!);
        if (sopranoStep && nearCadence(ctx, b.at)) continue;
        issues.push({
          ruleId: 'vl.direct-perfect',
          severity: 'warning',
          atTick: b.at,
          message: `${label} directes aux voix extrêmes (mouvement semblable, soprano par saut)`,
          lessonRef: 'm01-l12',
        });
      }
    }
  }
  return issues;
}

function leadingToneIssues(
  voices: readonly (readonly Note[])[],
  key: KeyEstimate,
  ctx: VoiceLeadingCtx,
): Issue[] {
  const issues: Issue[] = [];
  const averages = voices.map(v => (v.length === 0 ? 0 : v.reduce((s, n) => s + n.pitch, 0) / v.length));
  const highest = averages.indexOf(Math.max(...averages));
  const lowest = averages.indexOf(Math.min(...averages));

  voices.forEach((voice, vi) => {
    const line = [...voice].sort((a, b) => a.start - b.start);
    for (let i = 0; i < line.length - 1; i++) {
      const note = line[i]!;
      if (pc(note.pitch - key.tonic) !== 11) continue; // pas le 7e degré
      // **F-66** : le 7e degré n'est une SENSIBLE que sous une fonction de
      // dominante. Ailleurs c'est la septième d'un accord, la tierce d'un III,
      // une note de passage — et rien n'oblige une septième à monter. Sur
      // m01-s26 (guide-tones jazz, trois tonalités en six mesures), la
      // tonalité globale faisait passer chaque septième majeure pour une
      // sensible non résolue.
      if (!underDominant(ctx, key, note.start)) continue;

      // Une sensible RÉÉNONCÉE est la même sensible. Elle se juge sur son
      // DÉPART, pas sur chacune de ses répétitions : le si tenu sous quatre
      // voicings de dominante puis résolu sur do est résolu une fois, pas
      // fautif trois fois (m01-s34 : « B3→C4, sensible ✓ » — le moteur y
      // voyait deux erreurs).
      let j = i + 1;
      while (j < line.length && line[j]!.pitch === note.pitch) j++;
      const next = line[j];
      if (!next) break;
      if (next.pitch - note.pitch === 1) continue; // résolue : 7̂ → 1̂

      const prev = line[i - 1];
      const after = line[j + 1];
      const isInner = vi !== highest && vi !== lowest;

      // Sensible FRUSTRÉE en voix interne : elle descend chercher la quinte.
      if (isInner && pc(next.pitch - key.tonic) === 7) continue;

      // L'idiome « la sensible de V/V devient la 7e de V » : trajet chromatique
      // descendant — trois notes qui glissent d'un demi-ton vers le bas.
      if (prev && prev.pitch - note.pitch === 1 && note.pitch - next.pitch === 1) continue;

      // F-1 : la sensible DE PASSAGE. Approchée par le degré supérieur, quittée
      // par l'inférieur, dans une ligne conjointe d'au moins trois notes et hors
      // cadence : ce n'est pas une faute, c'est un chemin — suggestion.
      const approachedFromAbove = prev !== undefined && prev.pitch > note.pitch && isStep(prev.pitch, note.pitch);
      const leftBelow = next.pitch < note.pitch && isStep(note.pitch, next.pitch);
      const conjunctRun = approachedFromAbove && leftBelow &&
        (after === undefined || isStep(next.pitch, after.pitch));
      if (conjunctRun && !nearCadenceStrict(ctx, note.start)) {
        issues.push({
          ruleId: 'vl.leading-tone-resolution',
          severity: 'suggestion',
          atTick: note.start,
          message: 'sensible de passage (F-1) : descendante dans une ligne conjointe hors cadence — licite, mais sache que tu la traverses',
          lessonRef: 'm01-l15',
        });
        continue;
      }

      issues.push({
        ruleId: 'vl.leading-tone-resolution',
        severity: 'error',
        atTick: note.start,
        message: `sensible non résolue à la voix ${vi + 1} : 7̂ doit monter à 1̂`,
        lessonRef: 'm01-l15',
      });
    }
  });
  return issues;
}

/**
 * Le tick sonne-t-il sous une fonction de DOMINANTE ? **F-66**.
 *
 * Sans chiffrage transmis, on ne peut pas trancher : on garde alors l'ancien
 * comportement (tout 7e degré est traité comme sensible), pour ne pas
 * silencieusement désactiver la règle chez les appelants qui ne fournissent pas
 * les accords.
 */
function underDominant(ctx: VoiceLeadingCtx, key: KeyEstimate, tick: number): boolean {
  const chords = ctx.chords;
  // L'appelant ne fournit aucune analyse harmonique : on ne peut pas trancher,
  // et désactiver la règle en silence serait pire. Ancien comportement.
  if (!chords) return true;
  const sounding = chords.filter(c => c.from <= tick && tick < c.to);
  // Un chiffrage EXISTE mais rien ne se chiffre ici : la verticalité n'est pas
  // un accord (agrégat par tons entiers, quinte à vide, cluster). Il n'y a donc
  // aucune dominante — et pas de sensible non plus. C'est le cas de toute la
  // section « apesanteur » de m03-s11, où chaque 7e degré était pris pour une
  // sensible d'un accord qui n'existe pas.
  if (sounding.length === 0) return false;
  return sounding.some(c => functionOf(c.chord, key) === 'D');
}

/** Zone cadentielle stricte : sans information, on considère qu'on n'y est PAS. */
function nearCadenceStrict(ctx: VoiceLeadingCtx, tick: number): boolean {
  return (ctx.cadences ?? []).some(c => Math.abs(c.at - tick) <= CADENCE_WINDOW);
}

function seventhIssues(slices: readonly Slice[], voices: readonly (readonly Note[])[], ctx: VoiceLeadingCtx): Issue[] {
  const issues: Issue[] = [];
  const exchanges = new Set(ctx.voiceExchanges ?? []);

  for (let s = 0; s < slices.length - 1; s++) {
    const a = slices[s]!;
    const b = slices[s + 1]!;
    const present = a.pitches.filter((p): p is number => p !== null);
    if (present.length < 2) continue;
    const bass = Math.min(...present);
    if (exchanges.has(b.at)) continue;
    // F-6/F-16 : sous un tag `aug6`, la « 7e » n'en est pas une — c'est la sixte
    // augmentée, lue 7e faute d'orthographe, et elle DOIT monter. La règle des
    // 7es ne s'applique donc pas à cette verticalité.
    if (tagsAt(ctx, a.at).some(t => t.family === 'aug6')) continue;

    a.pitches.forEach((p, vi) => {
      if (p === null || p === bass) return;
      const interval = pc(p - bass);
      if (interval !== 10 && interval !== 11) return;
      const next = b.pitches[vi];
      if (next === null || next === undefined) return;
      if (next === p) return; // tenue : la 7e attend, elle n'est pas encore partie
      const descendsByStep = p - next >= 1 && p - next <= 2;
      if (descendsByStep) return;
      issues.push({
        ruleId: 'vl.seventh-resolution',
        severity: 'error',
        atTick: b.at,
        message: `la 7e monte (voix ${vi + 1}) : elle descend par degré, sauf échange de voix déclaré`,
        lessonRef: 'm01-l13',
      });
    });
  }
  return issues;
}

function spacingAndDoublingIssues(slices: readonly Slice[], key: KeyEstimate): Issue[] {
  const issues: Issue[] = [];
  for (const slice of slices) {
    const present = slice.pitches.filter((p): p is number => p !== null).sort((a, b) => a - b);
    // Espacement : entre voix SUPÉRIEURES adjacentes seulement (la basse respire).
    for (let i = 1; i < present.length - 1; i++) {
      const gap = present[i + 1]! - present[i]!;
      if (gap > MAX_UPPER_SPACING) {
        issues.push({
          ruleId: 'vl.spacing',
          severity: 'warning',
          atTick: slice.at,
          message: `écart de ${gap} demi-tons entre deux voix supérieures (l'octave est la limite)`,
          lessonRef: 'm01-l12',
        });
      }
    }
    // Doublure de sensible.
    const leadingTones = present.filter(p => pc(p - key.tonic) === 11);
    if (leadingTones.length > 1) {
      issues.push({
        ruleId: 'vl.doubled-leading-tone',
        severity: 'error',
        atTick: slice.at,
        message: 'sensible doublée : deux voix ne peuvent pas monter sur la même tonique',
        lessonRef: 'm01-l15',
      });
    }
  }
  return issues;
}

/**
 * `voiceLeadingIssues(voices, key, ctx)` — l'ordre du pipeline compte : les
 * idiomes sont tagués AVANT (F-15/F-16), les cadences aussi, et cette fonction
 * les LIT. Sans le tag, les mêmes notes sont fautives : c'est exactement ce que
 * les fixtures `mozart-tagged-info` / `mozart-untagged-error` verrouillent.
 */
export function voiceLeadingIssues(
  voices: readonly (readonly Note[])[],
  key: KeyEstimate,
  ctx: VoiceLeadingCtx = {},
): Issue[] {
  if (voices.length < 2) return [];
  const slices = slicesOf(voices);
  return [
    ...parallelIssues(slices, key, ctx, voices.length),
    ...leadingToneIssues(voices, key, ctx),
    ...seventhIssues(slices, voices, ctx),
    ...spacingAndDoublingIssues(slices, key),
  ].sort((a, b) => (a.atTick ?? 0) - (b.atTick ?? 0));
}
