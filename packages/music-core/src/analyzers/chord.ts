import type { Note } from '../types.js';
import { CHORD_FORMS } from '../data/chordForms.js';

/**
 * Plan de pédale (F-18) : la/les plages où une pitch-class est tenue en
 * bourdon pendant que l'harmonie change au-dessus. `ranges` en TICKS (mêmes
 * unités que `Note.start`/`at.from`/`at.to`) — la conversion mesure→ticks est
 * à la charge de l'appelant, qui connaît le mètre. `state` documente le
 * rapport pédale/accord pour un jugement séparé (`harmony.*`) ; `detectChord`
 * ne s'en sert pas pour décider — toute plage couvrante suffit à exclure la pc.
 */
export interface PedalPlan {
  pc: number;
  ranges: { from: number; to: number; state: 'compatible' | 'frottee' | 'contredite' | 'resolution' }[];
}

export interface ChordResult {
  root: number; // pitch-class de la fondamentale
  form: string; // nom de la forme (data/chordForms.ts)
  bass: number; // pitch-class réellement à la basse (hors pédale exclue)
  inversion: number; // 0 = fondamentale à la basse, 1/2/3 = renversements
  pcs: number[]; // pitch-classes de la verticalité jugée (pédale exclue)
  /**
   * Les TENSIONS ajoutées, en demi-tons depuis la fondamentale : 1 (♭9),
   * 2 (9), 5 (11), 6 (♯11), 8 (♭13), 9 (13). Vide sur un accord nu.
   * L'identité de l'accord reste sa FORME — un Cadd9 est un `maj` de do qui
   * porte une neuvième, pas une quinzième forme à inventer.
   */
  tensions: number[];
}

/**
 * **Les tensions que la table des 14 formes ne nomme pas** (décision n°33).
 *
 * Le tutoriel fixe 14 formes et un « match exact » : aucune pitch-class
 * étrangère. Le CONTENU, lui, enseigne les tensions — `m01-l17` enrichissements,
 * `m01-l18` tensions (« au moins 3 voicings distincts : V7 → V9 → V13 → V7♭9 »),
 * tout M3 impressionniste. Sur ce corpus, un `Cadd9` ne se chiffrait pas du
 * tout : ni accord, ni cadence, ni enrichissement compté. Le moteur ne disait
 * pas « c'est faux », il ne disait RIEN.
 *
 * Une tension n'est pas une forme de plus, c'est une couleur POSÉE SUR une
 * forme : G13 reste un G7. On garde donc la table intacte et on autorise les
 * degrés ci-dessous par-dessus, en les nommant. La tierce (3/4) et la septième
 * (10/11) n'y sont pas : elles changent l'accord, elles ne le colorent pas.
 */
const TENSION_DEGREES = new Set([1, 2, 5, 6, 8, 9]);

/**
 * **Le garde-fou F-3.** Au plus deux tensions : au-delà, on ne lit plus un
 * accord coloré mais un agrégat, et le chiffrer serait inventer une
 * fondamentale. Les clusters de M3 restent non chiffrés — c'est correct, ce
 * sont des clusters.
 */
const MAX_TENSIONS = 2;

function pc(pitch: number): number {
  return ((pitch % 12) + 12) % 12;
}

function overlaps(aFrom: number, aTo: number, bFrom: number, bTo: number): boolean {
  return aFrom < bTo && bFrom < aTo;
}

/** F-18 : la pédale est couverte par le plan si une de ses plages recouvre la fenêtre jugée. */
function pedalCoversWindow(plan: PedalPlan | undefined, from: number, to: number): boolean {
  return plan !== undefined && plan.ranges.some(r => overlaps(r.from, r.to, from, to));
}

export function detectChord(
  notes: readonly Note[],
  at: { from: number; to: number },
  ctx?: { pedalPlan?: PedalPlan },
): ChordResult | null {
  const sounding = notes.filter(n => overlaps(n.start, n.start + n.duration, at.from, at.to));
  if (sounding.length === 0) return null;

  // 1. Verticalité = pitch-classes sonnant sur la fenêtre.
  const pcs = new Set(sounding.map(n => pc(n.pitch)));

  // 2. F-18 : si le plan de pédale couvre la fenêtre, retire sa pc AVANT le matching.
  if (ctx?.pedalPlan && pedalCoversWindow(ctx.pedalPlan, at.from, at.to)) {
    pcs.delete(ctx.pedalPlan.pc);
  }
  if (pcs.size === 0) return null;

  // Basse réelle = pc la plus grave restante (la pédale exclue est jugée à part).
  const lowestNote = sounding
    .filter(n => pcs.has(pc(n.pitch)))
    .reduce((min, n) => (n.pitch < min.pitch ? n : min));
  const bass = pc(lowestNote.pitch);

  // 3. Essaie chaque forme × 12 fondamentales — match exact des pcs requises,
  //    les tensions nommées mises à part.
  interface Candidate { root: number; formName: string; richness: number; rootPosition: boolean; tensions: number[] }
  const candidates: Candidate[] = [];
  for (const form of CHORD_FORMS) {
    for (let root = 0; root < 12; root++) {
      const formPcs = form.intervals.map(iv => pc(root + iv));
      const formPcSet = new Set(formPcs);
      // Les pcs étrangères à la forme : elles ne sont admises que si ce sont
      // des TENSIONS de cette fondamentale, et pas plus de deux.
      const strangers = [...pcs].filter(p => !formPcSet.has(p));
      const tensions = strangers.map(p => pc(p - root));
      if (tensions.length > MAX_TENSIONS) continue;
      if (!tensions.every(t => TENSION_DEGREES.has(t))) continue;

      // Toutes les pcs requises présentes. La quinte s'omet dans deux cas : sur
      // les formes qui le déclarent (F-3, `fifthOptional`), et sur toute forme
      // qu'une NEUVIÈME colore — c'est elle, et elle seule, qui prend la place
      // de la quinte dans le voicing d'add9 le plus courant qui soit
      // (`[C3+C4+E4+D5]`, m01-s34). Une onzième ou une treizième ne remplacent
      // rien : les admettre laissait `{mi, si, ré}` — un accord sans tierce —
      // se faire lire « si mineur avec onzième, quinte absente », c'est-à-dire
      // inventer une fondamentale pour ne pas avoir à dire « je ne sais pas ».
      // Un simple dyade reste rejeté de la même façon : {ré, fa} ne porte aucune
      // tension, sa quinte MANQUE (fixture `incomplete-rejected`).
      const fifthPc = pc(root + 7);
      const fifthMayGo = form.fifthOptional === true || tensions.some(t => t === 1 || t === 2);
      const required = fifthMayGo ? formPcs.filter(p => p !== fifthPc) : formPcs;
      if (!required.every(p => pcs.has(p))) continue;

      candidates.push({ root, formName: form.name, richness: form.intervals.length, rootPosition: bass === pc(root), tensions: tensions.sort((a, b) => a - b) });
    }
  }
  if (candidates.length === 0) return null;

  // 4. Départage : d'abord l'accord qui s'explique SANS tension — une lecture
  //    qui n'invoque aucune couleur ajoutée est toujours la plus sûre. Puis
  //    **la BASSE, qui nomme l'accord**, et seulement ensuite la richesse.
  //
  //    L'ordre richesse-puis-basse était juste tant que la richesse ne
  //    s'ACHETAIT pas : depuis que les tensions existent, une forme plus riche
  //    peut toujours se fabriquer en relisant un son de l'accord comme une
  //    couleur d'un autre. `[G3+B3+D4+A4]` — un sol add9, basse sol, que les
  //    `authorNotes` de m01-s32 nomment « Gadd9 » — ressortait ainsi en
  //    « si mineur septième avec treizième bémol », un si mineur dont le si
  //    n'est pas à la basse. Une verticalité dont la basse est un sol et qui
  //    épelle sol-si-ré-la est un accord de SOL.
  //
  //    La basse ne prend le pas QUE sur les lectures à tension : là où aucune
  //    couleur n'est invoquée, l'ordre du tutoriel (richesse d'abord) est
  //    conservé tel quel. Élargir le départage à tous les cas rendait
  //    systématiquement l'état fondamental et aplatissait `inversion-variety`
  //    sur tout le corpus — m03-s17 y perdait neuf points sans qu'une seule
  //    note ait changé.
  candidates.sort((a, b) =>
    a.tensions.length - b.tensions.length
    || (a.tensions.length > 0 ? Number(b.rootPosition) - Number(a.rootPosition) : 0)
    || b.richness - a.richness
    || Number(b.rootPosition) - Number(a.rootPosition));
  const winner = candidates[0]!;

  const form = CHORD_FORMS.find(f => f.name === winner.formName)!;
  const inversion = form.intervals.findIndex(iv => pc(winner.root + iv) === bass);

  return { root: winner.root, form: winner.formName, bass, inversion: Math.max(0, inversion), pcs: [...pcs].sort((a, b) => a - b), tensions: winner.tensions };
}

// ---------------------------------------------------------------------------
// Notes étrangères — la table des six (m02-l08, §3 : "la table générale... que
// detectChord utilise pour qualifier"). Un seul critère distingue Appoggiature
// de Retard alors qu'ils partagent temps fort + départ conjoint descendant :
// l'arrivée par TENUE (préparée) contre l'arrivée par SAUT/directe.
// ---------------------------------------------------------------------------

export type NonChordToneKind = 'passing' | 'neighbor' | 'appoggiatura' | 'suspension' | 'anticipation' | 'escape';

export interface NCTNote {
  pitch: number;
  /** Vrai si la note est la continuation (même hauteur, pas de nouvelle attaque) de la précédente — Retard. */
  tied: boolean;
}

function isStep(a: number, b: number): boolean {
  const d = Math.abs(a - b);
  return d >= 1 && d <= 2;
}

export function classifyNonChordTone(
  note: NCTNote,
  prevPitch: number | null,
  nextPitch: number | null,
  beatWeight: 'strong' | 'weak',
): NonChordToneKind | null {
  const arrivedByStep = prevPitch !== null && isStep(prevPitch, note.pitch);
  const leavesByStep = nextPitch !== null && isStep(note.pitch, nextPitch);
  const leavesDescendingStep = leavesByStep && nextPitch! < note.pitch;

  if (beatWeight === 'strong') {
    if (leavesDescendingStep && note.tied) return 'suspension'; // Retard : arrivée tenue, départ conjoint descendant
    if (leavesDescendingStep && !note.tied) return 'appoggiatura'; // Appoggiature : arrivée par saut/directe, départ conjoint descendant
    return null;
  }

  // Temps faible (Passage / Broderie / Anticipation / Échappée) : arrivée toujours conjointe.
  if (!arrivedByStep) return null;
  if (nextPitch !== null && nextPitch === note.pitch) return 'anticipation'; // départ = tenue dans l'accord suivant (même hauteur)
  if (prevPitch !== null && nextPitch !== null && nextPitch === prevPitch) return 'neighbor'; // Broderie : retour à la note de départ
  if (leavesByStep) {
    const arriveDir = Math.sign(note.pitch - prevPitch!);
    const leaveDir = Math.sign(nextPitch! - note.pitch);
    if (arriveDir === leaveDir) return 'passing'; // Passage : conjoint, même direction
  }
  if (nextPitch !== null && !leavesByStep) {
    const arriveDir = Math.sign(note.pitch - prevPitch!);
    const leaveDir = Math.sign(nextPitch - note.pitch);
    if (arriveDir !== 0 && leaveDir !== 0 && arriveDir !== leaveDir) return 'escape'; // Échappée : saut en direction opposée
  }
  return null;
}
