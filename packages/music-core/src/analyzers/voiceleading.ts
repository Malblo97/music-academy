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
  /** Vrai pour les voix qui ATTAQUENT ici — les autres tiennent depuis avant. */
  attacks: boolean[];
}

/** Découpe les voix en verticalités : une par attaque, toutes voix confondues. */
function slicesOf(voices: readonly (readonly Note[])[]): Slice[] {
  const onsets = [...new Set(voices.flatMap(v => v.map(n => n.start)))].sort((a, b) => a - b);
  return onsets.map(at => {
    const sounding = voices.map(voice => voice.find(n => n.start <= at && n.start + n.duration > at));
    return {
      at,
      pitches: sounding.map(n => (n ? n.pitch : null)),
      attacks: sounding.map(n => n !== undefined && n.start === at),
    };
  });
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
          // **La substitution tritonique glisse.** Son geste entier est le
          // demi-ton descendant de tout le voicing vers la cible — « c'est le
          // glissement qui fait le couloir », dit la pédagogie de
          // `harmony.tritone-sub-resolution`, et la consigne de m01-e38 le
          // vérifie « sans pitié ». Reprocher les quintes que ce glissement
          // produit, c'est reprocher l'idiome que l'exercice enseigne — la
          // même doctrine que F-15 pour la sixte augmentée, et que le planing
          // trois lignes plus haut. Condition serrée : le tag doit couvrir
          // l'accord de DÉPART et les deux voix descendre d'exactement un
          // demi-ton. Une quinte parallèle ailleurs dans la pièce reste une
          // erreur — sur m01-s38, celle du Gm7→A7 (ton entier, hors tag) est
          // conservée.
          const slidingSubV = tagsAt(ctx, a.at).some(t => t.family === 'subV') && d1 === -1 && d2 === -1;
          if (slidingSubV) {
            issues.push({
              ruleId: 'vl.parallel-perfects',
              severity: 'info',
              atTick: b.at,
              message: `${label} parallèles portées par la substitution tritonique : le voicing entier glisse d'un demi-ton sur sa cible — c'est le geste, pas une faute`,
              lessonRef: 'm01-l20',
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
      // dominante, ET qu'à la place de la sensible dans cet accord. Ailleurs
      // c'est la septième d'un accord, la tierce d'un III, la fondamentale
      // d'un emprunt, une note de passage — et rien ne l'oblige à monter.
      if (!actsAsLeadingTone(ctx, key, note.pitch, note.start)) continue;

      // Une sensible RÉÉNONCÉE est la même sensible : on la juge sur son
      // DÉPART. Le si tenu sous trois voicings de dominante est une sensible,
      // pas trois — qu'il résolve ou non. Le saut en avant ci-dessous cherchait
      // bien sa cible par-delà les répétitions, mais chaque répétition rouvrait
      // le procès : m03-s18 récoltait trois erreurs pour un seul sol♯.
      if (i > 0 && line[i - 1]!.pitch === note.pitch) continue;

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

/** Les accords DE SENSIBLE, où la sensible est la fondamentale : vii°, vii°7, viiø7. */
const LEADING_TONE_CHORDS = new Set(['dim', 'dim7', 'm7b5']);

/**
 * Le 7e degré joue-t-il vraiment le RÔLE de sensible ici ? **F-66, resserré.**
 *
 * Deux conditions, et la seconde manquait. L'accord doit être de fonction
 * dominante — c'était déjà là. Mais il faut aussi que la note y TIENNE la place
 * de la sensible : la tierce majeure d'une dominante (V, V7), ou la
 * fondamentale d'un accord de sensible (vii°, vii°7, viiø7).
 *
 * Sans cette seconde condition, toute note qui tombe sur le 7e degré de la
 * tonalité GLOBALE devenait une sensible dès que son accord était rangé en « D »
 * — et `functionOf` range en « D » tout accord fondé sur le 7e degré, quelle que
 * soit sa qualité. La basse mi du Em7 de m01-s26 (ii d'un ii–V–I en ré, dans une
 * pièce dont la tonalité globale est fa), la fondamentale du Mi majeur V/vi de
 * m01-s35, celle du si mineur de m03-s05 : trois FONDAMENTALES prises pour des
 * sensibles, dans trois pièces dont les `authorNotes` déclarent la conduite
 * vérifiée.
 *
 * Sans chiffrage transmis, on ne peut pas trancher : on garde alors l'ancien
 * comportement, pour ne pas silencieusement désactiver la règle chez les
 * appelants qui ne fournissent pas les accords.
 */
function actsAsLeadingTone(ctx: VoiceLeadingCtx, key: KeyEstimate, pitch: number, tick: number): boolean {
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
  return sounding.some(c => {
    if (functionOf(c.chord, key) !== 'D') return false;
    const role = pc(pitch - c.chord.root);
    if (role === 4) return true; // la tierce majeure de la dominante
    return role === 0 && LEADING_TONE_CHORDS.has(c.chord.form);
  });
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

/**
 * **Tapis et arabesque** — la texture que le `when` de `vl.spacing` s'exclut
 * lui-même sans que le code l'ait jamais implémenté : « les textures
 * orchestrales larges et les voicings de piano ouverts ont leurs propres lois ».
 *
 * Le témoin est dans la notation, pas dans une exception à déclarer : quand
 * TOUTES les voix sauf la plus aiguë TIENNENT depuis avant et que seule la voix
 * du dessus réattaque, on n'a pas un accord à quatre voix qui se déchire, on a
 * deux strates — une nappe tenue et une ligne au-dessus. La faute que la règle
 * enseigne est un accident local (« l'accord ne suit pas, la mélodie se
 * retrouve toute seule au-dessus du vide ») ; ici, rien n'était censé suivre.
 *
 * `m03-s11` (« l'apesanteur ») l'écrit noir sur blanc, liaisons comprises :
 * `[Db3~+F3~+A3~+B4]` — « le balancement des deux augmentés en tapis TENUS
 * (liaisons par note, F-21), l'arabesque au-dessus ».
 */
function isStratified(slice: Slice): boolean {
  const voices = slice.pitches
    .map((p, i) => ({ p, held: !slice.attacks[i] }))
    .filter((v): v is { p: number; held: boolean } => v.p !== null)
    .sort((a, b) => a.p - b.p);
  if (voices.length < 3) return false;
  const top = voices[voices.length - 1]!;
  return !top.held && voices.slice(0, -1).every(v => v.held);
}

function spacingAndDoublingIssues(slices: readonly Slice[], key: KeyEstimate, ctx: VoiceLeadingCtx): Issue[] {
  const issues: Issue[] = [];
  for (const slice of slices) {
    const present = slice.pitches.filter((p): p is number => p !== null).sort((a, b) => a - b);
    // Espacement : entre voix SUPÉRIEURES adjacentes seulement (la basse respire).
    for (let i = 1; i < present.length - 1; i++) {
      const gap = present[i + 1]! - present[i]!;
      if (gap > MAX_UPPER_SPACING && !isStratified(slice)) {
        issues.push({
          ruleId: 'vl.spacing',
          severity: 'warning',
          atTick: slice.at,
          message: `écart de ${gap} demi-tons entre deux voix supérieures (l'octave est la limite)`,
          lessonRef: 'm01-l12',
        });
      }
    }
    // Doublure de sensible. Même garde F-66 que la non-résolution : deux notes
    // sur le 7e degré ne sont deux SENSIBLES que si elles en jouent le rôle.
    // Dans l'apesanteur de m03-s11, le si du tapis E♭+ et celui de l'arabesque
    // appartiennent à un agrégat par tons entiers — aucune dominante, donc
    // aucune sensible, donc rien à doubler.
    const leadingTones = present.filter(p => pc(p - key.tonic) === 11 && actsAsLeadingTone(ctx, key, p, slice.at));
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
    ...spacingAndDoublingIssues(slices, key, ctx),
  ].sort((a, b) => (a.atTick ?? 0) - (b.atTick ?? 0));
}
