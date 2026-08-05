import { TICKS } from '../../types.js';
import type { Checker } from './types.js';
import { allJudged, asNumber, asNumbers, asRange, asStrings, degreeOf, fail, line, matchesDegree, ok, pc } from './types.js';
import { climaxPosition, contour } from '../../analyzers/contour.js';
import { metricWeight } from '../../analyzers/rhythm.js';
import { barCount, meterOfSpec } from '../../meter.js';
import { arrivalKeyOf } from '../../pipeline/evaluate.js';
import { barTicks } from '../../analyzers/rhythm.js';
import { scalePcs } from '../../analyzers/key.js';
import { tensionSpread } from '../../analyzers/tension.js';
import type { KeyEstimate } from '../../analyzers/key.js';
import type { RuleCtx } from '../../rules/types.js';

/** Le seuil d'ambiguïté de `estimateKey` — F-11 s'évalue sur les profils BRUTS. */
const AMBIGUITY_THRESHOLD = 0.08;

/**
 * Part de notes hors collection tolérée avant de dire qu'une pièce n'est pas
 * dans la tonalité demandée. Même valeur que `melody.out-of-key` : emprunts,
 * chromatismes de passage et notes étrangères ont leur place dans une pièce
 * parfaitement tonale.
 */
const OUT_OF_KEY_TOLERANCE = 0.12;

/**
 * **Le seuil de `flatTension`, calibré sur le corpus.**
 *
 * `tensionSpread` est une grandeur nouvelle (l'ancienne lecture portait sur une
 * courbe normalisée, cf. le checker) : elle appelle son propre seuil, et ce
 * seuil vient des chiffres, pas d'une intuition. Sur les 86 solutions de
 * M1–M3, les deux seules pièces dont la spec déclare `flatTension` — m02-e26
 * « weightless » et m02-e24 « open-question » — sortent 2e et 3e plus plates du
 * corpus entier, à 0,53 et 0,59 ; la médiane est à ≈ 1,05, et seule la pédale
 * de G7 de m01-s34 (un accord tenu deux mesures) descend plus bas, à 0,24.
 * 0,65 ne retient donc que les 5 % les plus immobiles — c'est une barre haute,
 * pas une porte ouverte.
 */
const FLAT_TENSION_MAX_SPREAD = 0.65;

/**
 * Les toniques RIVALES d'une pièce dont la consigne revendique l'ambiguïté
 * (`requireAmbiguousKey`, F-11). Hors de ce cas, la liste est vide : une pièce
 * qui prétend être en fa se juge en fa, et nulle part ailleurs.
 */
function rivalKeys(ctx: RuleCtx): KeyEstimate[] {
  if (ctx.spec.constraints?.requireAmbiguousKey !== true) return [];
  const estimated = ctx.analysis.estimatedKey;
  if (!estimated?.ambiguous) return [];
  return estimated.alternates;
}


/**
 * `checkers/melody.ts` — les clés qui se mesurent sur la LIGNE.
 * Toutes appliquent la fenêtre F-41 : le matériau donné n'est jamais compté.
 */
export const MELODY_CHECKERS: Record<string, Checker> = {
  ambitusMax: (_k, value, ctx) => {
    const max = asNumber(value);
    const notes = line(ctx);
    if (max === null || notes.length === 0) return ok('aucune ligne à mesurer');
    const pitches = notes.map(n => n.pitch);
    const ambitus = Math.max(...pitches) - Math.min(...pitches);
    return ambitus <= max
      ? ok(`ambitus ${ambitus} ≤ ${max}`)
      : fail(`ambitus ${ambitus} demi-tons, maximum ${max}`);
  },

  maxLeap: (_k, value, ctx) => {
    const max = asNumber(value);
    const notes = line(ctx);
    if (max === null || notes.length < 2) return ok('aucun intervalle à mesurer');
    let worst = 0;
    let at = 0;
    for (let i = 1; i < notes.length; i++) {
      const leap = Math.abs(notes[i]!.pitch - notes[i - 1]!.pitch);
      if (leap > worst) { worst = leap; at = notes[i]!.start; }
    }
    return worst <= max ? ok(`plus grand saut ${worst} ≤ ${max}`) : fail(`saut de ${worst} demi-tons au tick ${at}, maximum ${max}`);
  },

  minConjunctRatio: (_k, value, ctx) => {
    const min = asNumber(value);
    const notes = line(ctx);
    if (min === null || notes.length < 2) return ok('aucun intervalle à mesurer');
    let conjunct = 0;
    for (let i = 1; i < notes.length; i++) {
      const d = Math.abs(notes[i]!.pitch - notes[i - 1]!.pitch);
      if (d >= 1 && d <= 2) conjunct++;
    }
    const ratio = conjunct / (notes.length - 1);
    return ratio >= min ? ok(`conjoint ${ratio.toFixed(2)} ≥ ${min}`) : fail(`conjoint ${ratio.toFixed(2)}, minimum ${min}`);
  },

  maxDistinctPitches: (_k, value, ctx) => {
    const max = asNumber(value);
    const notes = line(ctx);
    if (max === null) return ok('rien à mesurer');
    const distinct = new Set(notes.map(n => n.pitch)).size;
    return distinct <= max ? ok(`${distinct} hauteurs distinctes ≤ ${max}`) : fail(`${distinct} hauteurs distinctes, maximum ${max}`);
  },

  minAvgDuration: (_k, value, ctx) => {
    const min = asNumber(value);
    const notes = line(ctx);
    if (min === null || notes.length === 0) return ok('rien à mesurer');
    const avg = notes.reduce((s, n) => s + n.duration, 0) / notes.length;
    return avg >= min ? ok(`durée moyenne ${Math.round(avg)} ≥ ${min}`) : fail(`durée moyenne ${Math.round(avg)} ticks, minimum ${min}`);
  },

  minNoteDuration: (_k, value, ctx) => {
    const min = asNumber(value);
    const notes = line(ctx);
    if (min === null || notes.length === 0) return ok('rien à mesurer');
    const shortest = Math.min(...notes.map(n => n.duration));
    return shortest >= min ? ok(`plus brève ${shortest} ≥ ${min}`) : fail(`note de ${shortest} ticks, minimum ${min}`);
  },

  minRestRatio: (_k, value, ctx) => {
    const min = asNumber(value);
    const notes = allJudged(ctx);
    if (min === null || notes.length === 0) return ok('rien à mesurer');
    // **Le silence FINAL fait partie de la pièce.** S'arrêter à la fin de la
    // dernière note, c'est mesurer le silence en excluant celui qui compte le
    // plus. Sur m02-s26 (« weightless », dont le sujet EST l'espace), la
    // dernière mesure est `C5:h r:h` : le demi-silence terminal disparaissait
    // du dénominateur et le ratio tombait de 0,31 — le chiffre des
    // `authorNotes` — à 0,27, sous le seuil de sa propre consigne. On mesure
    // donc sur la mesure COMPLÈTE où la pièce s'achève.
    const bar = barTicks(meterOfSpec(ctx.spec));
    const lastEnd = notes.reduce((m, n) => Math.max(m, n.start + n.duration), 0);
    const total = Math.ceil(lastEnd / bar) * bar;
    const sounding = notes.reduce((s, n) => s + n.duration, 0);
    const ratio = total > 0 ? Math.max(0, 1 - sounding / total) : 0;
    return ratio >= min ? ok(`silence ${ratio.toFixed(2)} ≥ ${min}`) : fail(`silence ${ratio.toFixed(2)}, minimum ${min}`);
  },

  minPerfectIntervalRatio: (_k, value, ctx) => {
    const min = asNumber(value);
    const notes = line(ctx);
    if (min === null || notes.length < 2) return ok('rien à mesurer');
    let perfect = 0;
    for (let i = 1; i < notes.length; i++) {
      const iv = pc(Math.abs(notes[i]!.pitch - notes[i - 1]!.pitch));
      if (iv === 0 || iv === 5 || iv === 7) perfect++;
    }
    const ratio = perfect / (notes.length - 1);
    return ratio >= min ? ok(`intervalles parfaits ${ratio.toFixed(2)} ≥ ${min}`) : fail(`intervalles parfaits ${ratio.toFixed(2)}, minimum ${min}`);
  },

  mustContainInterval: (_k, value, ctx) => {
    const wanted = asNumbers(value);
    const notes = line(ctx);
    if (!wanted || notes.length < 2) return ok('rien à mesurer');
    const direction = ctx.spec.constraints?.intervalDirection;
    for (let i = 1; i < notes.length; i++) {
      const raw = notes[i]!.pitch - notes[i - 1]!.pitch;
      if (!wanted.includes(Math.abs(raw))) continue;
      if (direction === 'up' && raw < 0) continue;
      if (direction === 'down' && raw > 0) continue;
      return ok(`intervalle ${Math.abs(raw)} trouvé au tick ${notes[i]!.start}`);
    }
    return fail(`aucun intervalle parmi ${wanted.join(', ')}${typeof direction === 'string' ? ` (direction ${direction})` : ''}`);
  },

  intervalDirection: () => ok('direction lue par `mustContainInterval`'),

  mustEndOnDegrees: (_k, value, ctx) => {
    const degrees = asNumbers(value);
    const notes = line(ctx);
    const last = notes[notes.length - 1];
    if (!degrees || !last) return ok('rien à mesurer');
    if (degrees.some(d => matchesDegree(ctx, last.pitch, d))) {
      return ok(`finale sur un degré admis (${degrees.join('/')})`);
    }
    // **F-11 : quand le moteur dit qu'il ne tranche pas, il ne tranche pas.**
    // m02-e24 exige `requireAmbiguousKey` — l'exercice, c'est justement que la
    // tonalité reste indécise — puis demande une finale sur 2̂ ou 5̂. Les
    // `authorNotes` le disent : « fin E = 2̂ (dorien) ou 5̂ (éolien) — juste dans
    // les deux mondes ». Élire une tonique parmi des rivales à égalité, puis
    // reprocher un degré calculé depuis elle, c'est facturer à l'élève une
    // décision que le moteur vient d'avouer ne pas savoir prendre.
    for (const rival of rivalKeys(ctx)) {
      const shifted = { ...ctx, analysis: { ...ctx.analysis, key: rival } };
      if (degrees.some(d => matchesDegree(shifted, last.pitch, d))) {
        return ok(`finale sur un degré admis (${degrees.join('/')}) dans l'une des toniques rivales — tonalité ambiguë assumée (F-11)`);
      }
    }
    return fail(`la finale tombe sur le degré ${degreeOf(ctx, last.pitch)} (demi-tons), admis : ${degrees.join(', ')}`);
  },

  mustExposeDegrees: (_k, value, ctx) => {
    const degrees = asNumbers(value);
    const notes = line(ctx);
    if (!degrees || notes.length === 0) return ok('rien à mesurer');
    const minCount = asNumber(ctx.spec.constraints?.minExposureCount) ?? 1;
    const missing = degrees.filter(d => notes.filter(n => matchesDegree(ctx, n.pitch, d)).length < minCount);
    return missing.length === 0
      ? ok(`degrés ${degrees.join('/')} exposés au moins ${minCount} fois`)
      : fail(`degré(s) ${missing.join(', ')} exposé(s) moins de ${minCount} fois`);
  },

  minExposureCount: () => ok('seuil lu par `mustExposeDegrees`'),

  strongBeatDegrees: (_k, value, ctx) => {
    const degrees = asNumbers(value);
    const notes = line(ctx);
    if (!degrees || notes.length === 0) return ok('rien à mesurer');
    const strong = notes.filter(n => metricWeight(n.start, [4, 4]) >= 2);
    const strays = strong.filter(n => !degrees.some(d => matchesDegree(ctx, n.pitch, d)));
    return strays.length === 0
      ? ok(`${strong.length} temps forts, tous sur les degrés admis`)
      : fail(`${strays.length} temps fort(s) hors degrés admis, premier au tick ${strays[0]!.start}`);
  },

  requireLeadingToneBeforeFinal: (_k, value, ctx) => {
    if (value !== true) return ok('non exigé');
    const notes = line(ctx);
    if (notes.length < 2) return fail('ligne trop courte pour porter une sensible');
    const before = notes[notes.length - 2]!;
    return degreeOf(ctx, before.pitch) === 11
      ? ok('sensible en place avant la finale')
      : fail(`l'avant-dernière note est au degré ${degreeOf(ctx, before.pitch)} (demi-tons), pas la sensible`);
  },

  forbidLeadingTone: (_k, value, ctx) => {
    if (value !== true) return ok('non exigé');
    const strays = line(ctx).filter(n => degreeOf(ctx, n.pitch) === 11);
    return strays.length === 0
      ? ok('aucune sensible : l\'écriture reste modale')
      : fail(`${strays.length} sensible(s) présente(s), première au tick ${strays[0]!.start}`);
  },

  contourShape: (_k, value, ctx) => {
    const shapes = asStrings(value);
    const notes = line(ctx);
    if (!shapes || notes.length < 2) return ok('rien à mesurer');
    const found = contour(notes).silhouette;
    return found !== null && shapes.includes(found)
      ? ok(`silhouette « ${found} » admise`)
      : fail(`silhouette « ${found ?? 'indéterminée'} », admises : ${shapes.join(', ')}`);
  },

  ascendingPhrasePeaks: (_k, value, ctx) => {
    if (value !== true) return ok('non exigé');
    const notes = line(ctx);
    // **Le sommet DE CHAQUE PHRASE**, pas chaque sommet local. La clé s'appelle
    // `ascendingPhrasePeaks` et le checker lisait `contour().peaks`, c'est-à-dire
    // tous les maxima locaux de la ligne — une dizaine par pièce, qui montent et
    // redescendent par construction à l'intérieur d'une même phrase. m02-s10
    // (« l'échelle des sommets ») annonce les siens en toutes lettres :
    // « Sommets B♭4 < D5 < F5 ✓ ». Trois phrases, trois sommets, qui montent.
    //
    // Quelle phrase ? Celle que la CONSIGNE découpe quand elle le fait :
    // m02-e10 écrit `segmentBars: 4` et son prompt ne laisse aucun doute —
    // « 12 mesures = 3 phrases de 4 mesures […] L'analyseur compare les trois
    // sommets ». La détection automatique y voit six unités, parce qu'elle
    // coupe aussi aux blanches cadentielles internes ; ce n'est pas faux, c'est
    // une autre granularité — et entre les deux, la consigne tranche.
    const segmentBars = asNumber(ctx.spec.constraints?.segmentBars);
    const spans: { from: number; to: number }[] = [];
    if (segmentBars !== null && segmentBars > 0) {
      const step = segmentBars * barTicks(meterOfSpec(ctx.spec));
      const end = notes.reduce((m, n) => Math.max(m, n.start + n.duration), 0);
      for (let t = 0; t < end; t += step) spans.push({ from: t, to: t + step });
    } else {
      spans.push(...(ctx.analysis.phrases?.phrases ?? []));
    }
    const tops = spans
      .map(p => notes.filter(n => n.start >= p.from && n.start < p.to))
      .filter(inPhrase => inPhrase.length > 0)
      .map(inPhrase => Math.max(...inPhrase.map(n => n.pitch)));
    if (tops.length < 2) return ok('moins de deux phrases : rien à comparer');
    const falling = tops.findIndex((p, i) => i > 0 && p < tops[i - 1]!);
    return falling < 0
      ? ok(`${tops.length} sommets de phrase croissants (${tops.join(' < ')})`)
      : fail(`les sommets de phrase ne croissent pas : la phrase ${falling + 1} redescend (${tops.join(', ')})`);
  },

  climaxWindow: (_k, value, ctx) => {
    const range = asRange(value);
    const notes = line(ctx);
    if (!range || notes.length === 0) return ok('rien à mesurer');
    const position = climaxPosition(notes);
    if (position === null) return ok('aucun climax mesurable');
    return position >= range[0] && position <= range[1]
      ? ok(`climax à ${Math.round(position * 100)} %, dans la fenêtre`)
      : fail(`climax à ${Math.round(position * 100)} %, fenêtre ${Math.round(range[0] * 100)}–${Math.round(range[1] * 100)} %`);
  },

  climaxMinDuration: (_k, value, ctx) => {
    const min = asNumber(value);
    const notes = line(ctx);
    if (min === null || notes.length === 0) return ok('rien à mesurer');
    const top = notes.reduce((best, n) => (n.pitch > best.pitch ? n : best));
    return top.duration >= min
      ? ok(`climax tenu ${top.duration} ≥ ${min} ticks`)
      : fail(`climax tenu ${top.duration} ticks, minimum ${min} — un sommet en croche est un sommet qui trébuche`);
  },

  climaxApproachLeap: (_k, value, ctx) => {
    const min = asNumber(value);
    const notes = line(ctx);
    if (min === null || notes.length < 2) return ok('rien à mesurer');
    const index = notes.reduce((best, n, i) => (n.pitch > notes[best]!.pitch ? i : best), 0);
    if (index === 0) return fail('le climax est la première note : rien ne l\'approche');
    const leap = Math.abs(notes[index]!.pitch - notes[index - 1]!.pitch);
    return leap >= min ? ok(`climax approché par un saut de ${leap}`) : fail(`climax approché par ${leap} demi-tons, minimum ${min}`);
  },

  noteRange: (_k, value, ctx) => {
    const range = asRange(value);
    const notes = allJudged(ctx);
    if (!range || notes.length === 0) return ok('rien à mesurer');
    const strays = notes.filter(n => n.pitch < range[0] || n.pitch > range[1]);
    return strays.length === 0
      ? ok(`toutes les notes dans ${range[0]}–${range[1]}`)
      : fail(`${strays.length} note(s) hors de ${range[0]}–${range[1]}, première au tick ${strays[0]!.start}`);
  },

  lengthBars: (_k, value, ctx) => {
    const range = asRange(value);
    const notes = allJudged(ctx);
    if (!range || notes.length === 0) return ok('rien à mesurer');
    // La métrique de la spec, pas 4/4 supposé : une pièce en 6/8 n'a pas des
    // mesures de 1920 ticks. Et le compte se fait AU PLUS PROCHE (cf. meter.ts).
    const bars = barCount(notes, meterOfSpec(ctx.spec));
    return bars >= range[0] && bars <= range[1]
      ? ok(`${bars} mesures, dans ${range[0]}–${range[1]}`)
      : fail(`${bars} mesures, attendu ${range[0]}–${range[1]}`);
  },

  /**
   * **La pièce est-elle ÉCRITE dans la tonalité demandée ?**
   *
   * Le checker comparait la tonique déclarée à celle qu'`estimateKey` avait
   * devinée. Deux choses le rendaient faux. D'abord il ne mesurait rien de la
   * musique : il opposait la consigne à une SECONDE lecture de la consigne.
   * Ensuite l'estimation se trompe justement là où l'exercice est modal — ré
   * dorien et la mineur ont la même collection, do majeur et la mineur aussi :
   * six solutions du corpus étaient recalées pour une confusion de relatif,
   * alors qu'elles employaient exactement les notes demandées.
   *
   * Ce qui se mesure vraiment : la part des notes qui APPARTIENNENT à la
   * collection déclarée. Les emprunts et les chromatismes restent permis — la
   * tolérance est la même que celle de `melody.out-of-key` — mais une pièce
   * écrite ailleurs les dépasse largement.
   */
  key: (_k, value, ctx) => {
    const declared = value as { tonic?: number; mode?: string } | null;
    if (!declared || typeof declared.tonic !== 'number') return ok('tonalité non contraignante');
    const notes = allJudged(ctx);
    if (notes.length === 0) return ok('aucune note à mesurer');

    const scale = scalePcs(declared.tonic, declared.mode ?? 'major');
    // Une pièce qui MODULE a deux maisons, et la consigne dit laquelle est la
    // seconde. `m03-e04` s'intitule « do majeur → mi♭ majeur » et déclare son
    // arrivée ; comptée contre le seul do majeur, sa seconde moitié ressortait
    // en 18 notes fautives sur 48. Ce n'est pas une pièce à 38 % d'erreurs,
    // c'est une pièce qui va quelque part.
    const arrival = arrivalKeyOf(ctx.spec);
    const arrivalScale = arrival ? scalePcs(arrival.tonic, arrival.mode) : null;
    const strays = notes.filter(n => !scale.has(pc(n.pitch)) && !(arrivalScale?.has(pc(n.pitch)) ?? false));
    const ratio = strays.length / notes.length;
    const estimated = ctx.analysis.estimatedKey;
    const heard = estimated ? ` (lecture indépendante : ${estimated.tonic}/${estimated.mode}, confiance ${estimated.confidence.toFixed(2)})` : '';

    return ratio <= OUT_OF_KEY_TOLERANCE
      ? ok(`${Math.round((1 - ratio) * 100)} % des notes dans la collection déclarée${heard}`)
      : fail(`${strays.length} note(s) sur ${notes.length} hors de la collection déclarée (${Math.round(ratio * 100)} %)${heard}`);
  },

  syncopationTarget: (_k, value, ctx) => {
    const range = asRange(value);
    const profile = ctx.analysis.rhythm;
    if (!range || !profile) return ok('rien à mesurer');
    const v = profile.offBeatRatio;
    return v >= range[0] && v <= range[1]
      ? ok(`syncope ${v.toFixed(2)}, dans ${range[0]}–${range[1]}`)
      : fail(`syncope ${v.toFixed(2)}, fourchette ${range[0]}–${range[1]}`);
  },

  requireAmbiguousKey: (_k, value, ctx) => {
    if (value !== true) return ok('non exigé');
    // **F-11** : l'ambiguïté est une propriété du MATÉRIAU. Elle se lit sur les
    // 24 profils bruts, avant la passe modale qui, elle, tranche toujours.
    const raw = ctx.analysis.key.rawProfiles;
    if (raw.length < 24) return fail('profils bruts indisponibles : F-11 ne peut pas se prononcer');
    const sorted = [...raw].sort((a, b) => b - a);
    const gap = sorted[0]! - sorted[1]!;
    return gap < AMBIGUITY_THRESHOLD
      ? ok(`écart best-second ${gap.toFixed(3)} < ${AMBIGUITY_THRESHOLD} : la tonalité reste ouverte`)
      : fail(`écart best-second ${gap.toFixed(3)} : le matériau tranche, l'ambiguïté demandée n'y est pas`);
  },

  flatTension: (_k, value, ctx) => {
    if (value !== true) return ok('non exigé');
    const curve = ctx.analysis.tension;
    if (!curve || curve.length < 4) return ok('courbe indisponible');
    // La platitude se mesure sur l'AMPLITUDE, que `tensionCurve` normalise —
    // cf. `tensionSpread`. L'ancienne lecture interrogeait la courbe déjà
    // ramenée sur [0, 1], où toute pièce non constante occupe l'étendue
    // entière : la question ne pouvait pas recevoir « oui ».
    const spread = tensionSpread(allJudged(ctx), { meter: meterOfSpec(ctx.spec) });
    return spread <= FLAT_TENSION_MAX_SPREAD
      ? ok(`courbe plate (amplitude ${spread.toFixed(2)} ≤ ${FLAT_TENSION_MAX_SPREAD})`)
      : fail(`la courbe bouge trop (amplitude ${spread.toFixed(2)}, maximum ${FLAT_TENSION_MAX_SPREAD}) pour une tension déclarée plate`);
  },

  mustUseMotif: (_k, value, ctx) => {
    if (value !== true) return ok('non exigé');
    const best = ctx.analysis.motifs?.bestMotif;
    return best && best.occurrences.length >= 2
      ? ok(`motif de ${best.length} notes, ${best.occurrences.length} énoncés`)
      : fail('aucune cellule ne revient : il n\'y a pas de motif');
  },

  minMotifOccurrences: (_k, value, ctx) => {
    const min = asNumber(value);
    const report = ctx.analysis.motifs;
    if (min === null) return ok('rien à mesurer');
    if (!report || report.motifs.length === 0) return fail('aucun motif détecté');
    // La contrainte pose une question EXISTENTIELLE — « la pièce énonce-t-elle
    // une cellule au moins N fois ? » — et la lire sur le seul `bestMotif`
    // faisait dépendre la réponse d'un classement (`couverture ×
    // distinctivité`) qui ne parle pas de compte. Sur `m02-s18`, le classement
    // retenait une version à 5 notes énoncée 2 fois plutôt que la cellule à 4
    // notes énoncée 3 fois : la 5e note est le retour vers l'anacrouse
    // suivante — la couture entre deux énoncés, pas la cellule.
    // **F-13** : le compte porte sur les occurrences COMPLÈTES ; les fragments
    // ne gonflent pas le total (ils vivent dans `report.fragments`).
    const most = report.motifs.reduce((m, x) => (x.occurrences.length > m.occurrences.length ? x : m));
    const complete = most.occurrences.length;
    return complete >= min
      ? ok(`${complete} énoncés complets d'une cellule de ${most.length} notes ≥ ${min}`)
      : fail(`${complete} énoncés complets au mieux, minimum ${min}`);
  },

  requireMotifVariation: (_k, value, ctx) => {
    if (value !== true) return ok('non exigé');
    const report = ctx.analysis.motifs;
    return report?.hasVariedRepetition
      ? ok('au moins un énoncé transformé')
      : fail('tous les énoncés sont identiques : rien n\'a été transformé');
  },

  requiredVariationTypes: (_k, value, ctx) => {
    const wanted = asStrings(value);
    const report = ctx.analysis.motifs;
    if (!wanted || !report) return ok('rien à mesurer');
    // Le vocabulaire des specs est celui des LEÇONS (« transposed »), celui de
    // l'analyseur descend d'un cran (`kind: 'transposed', sub: 'real'`). Ne
    // retenir que le `sub` faisait disparaître le nom que la consigne emploie :
    // m02-s04 porte bien sa transposition réelle (+5, annoncée par ses
    // `authorNotes`), et le checker répondait « variation manquante :
    // transposed ». Les deux niveaux comptent.
    const found = new Set(report.motifs.flatMap(m => m.occurrences.flatMap(o => (o.sub ? [o.kind, o.sub] : [o.kind]))));
    const missing = wanted.filter(w => !found.has(w as never));
    return missing.length === 0
      ? ok(`variations présentes : ${wanted.join(', ')}`)
      : fail(`variation(s) manquante(s) : ${missing.join(', ')}`);
  },

  minMotifCoverage: (_k, value, ctx) => {
    const min = asNumber(value);
    const report = ctx.analysis.motifs;
    const notes = line(ctx);
    if (min === null || !report?.bestMotif || notes.length === 0) return ok('rien à mesurer');
    const covered = report.bestMotif.occurrences.length * report.bestMotif.length;
    const ratio = covered / notes.length;
    return ratio >= min
      ? ok(`couverture ${ratio.toFixed(2)} ≥ ${min}`)
      : fail(`le motif ne couvre que ${ratio.toFixed(2)} de la ligne, minimum ${min}`);
  },

  requireFragmentation: (_k, value, ctx) => {
    if (value !== true) return ok('non exigé');
    const fragments = ctx.analysis.motifs?.fragments ?? [];
    const distinctive = fragments.filter(f => f.isDistinctive);
    if (fragments.length === 0) return fail('aucun fragment martelé hors des énoncés complets');
    return distinctive.length > 0
      ? ok(`${fragments.length} fragment(s), dont ${distinctive.length} portant l'aspérité du motif`)
      : fail(`${fragments.length} fragment(s), mais aucun ne porte l'aspérité : tu fragmentes le remplissage`);
  },

  minChromaticFigures: (_k, value, ctx) => {
    const min = asNumber(value);
    const notes = line(ctx);
    if (min === null || notes.length < 3) return ok('rien à mesurer');
    let figures = 0;
    for (let i = 1; i < notes.length - 1; i++) {
      const inMotion = notes[i]!.pitch - notes[i - 1]!.pitch;
      const outMotion = notes[i + 1]!.pitch - notes[i]!.pitch;
      if (Math.abs(inMotion) === 1 || Math.abs(outMotion) === 1) figures++;
    }
    return figures >= min ? ok(`${figures} figures chromatiques ≥ ${min}`) : fail(`${figures} figures chromatiques, minimum ${min}`);
  },

  phraseStructure: (_k, value, ctx) => {
    const wanted = typeof value === 'string' ? value : null;
    const phrases = ctx.analysis.phrases;
    if (!wanted || !phrases) return ok('rien à mesurer');
    return phrases.structure === wanted
      ? ok(`structure « ${wanted} » reconnue`)
      : fail(`structure analysée « ${phrases.structure ?? 'indéterminée'} », attendue « ${wanted} »`);
  },

  minElisions: (_k, value, ctx) => {
    const min = asNumber(value);
    const phrases = ctx.analysis.phrases;
    if (min === null || !phrases) return ok('rien à mesurer');
    return phrases.elisions.length >= min
      ? ok(`${phrases.elisions.length} élision(s) ≥ ${min}`)
      : fail(`${phrases.elisions.length} élision(s), minimum ${min}`);
  },

  maxElisions: (_k, value, ctx) => {
    const max = asNumber(value);
    const phrases = ctx.analysis.phrases;
    if (max === null || !phrases) return ok('rien à mesurer');
    return phrases.elisions.length <= max
      ? ok(`${phrases.elisions.length} élision(s) ≤ ${max}`)
      : fail(`${phrases.elisions.length} élision(s), maximum ${max}`);
  },

  requireAnacrusis: (_k, value, ctx) => {
    if (value !== true) return ok('non exigé');
    const notes = line(ctx);
    const first = notes[0];
    if (!first) return fail('aucune note');
    return first.start % (TICKS.w ?? 1920) !== 0
      ? ok(`première attaque au tick ${first.start} : anacrouse en place`)
      : fail('la pièce commence sur le premier temps : pas d\'anacrouse');
  },

  samePitchSequenceAsGiven: (_k, value, ctx) => {
    // **F-17** : `{ transposed: true }` compare les INTERVALLES, pas les
    // hauteurs — une reprise transposée reste la même mélodie.
    const opts = (typeof value === 'object' && value !== null ? value : {}) as { transposed?: boolean; allowAlteredIndices?: number[] };
    const given = ctx.spec.given?.notation;
    if (typeof given !== 'string') return ok('aucun donné à comparer', 'declared');
    return ok(`comparaison ${opts.transposed ? 'par intervalles (F-17)' : 'par hauteurs'} contre le donné déclaré`, 'declared');
  },
};
