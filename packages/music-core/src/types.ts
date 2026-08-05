export const PPQ = 480;
export const TICKS: Record<string, number> = { w: 1920, h: 960, q: 480, e: 240, s: 120 };

/** Représentation unique du mètre côté moteur : [numérateur, dénominateur] (F-52 §5). */
export type Meter = [number, number];

/**
 * Ionien = major, éolien = minor (les deux noms usuels du cursus, l07 M1) —
 * pas de doublon 'ionian'/'aeolian' : `estimateKey` ne les produit jamais,
 * seuls les 5 modes exotiques sont ré-étiquetés par F-19 (§S2.J1).
 */
export type Mode = 'major' | 'minor' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'locrian';

export interface Note {
  pitch: number; start: number; duration: number; velocity?: number;
  /**
   * Orthographe de surface ("Eb4"), remplie par le parseur et respectée par
   * l'impression/le rendu. IGNORÉE par toutes les règles : F-6 tient, les
   * règles travaillent en degrés (F-52 §4).
   */
  spelling?: string;
}
export interface DynPoint { tick: number; value: number }                     // F-39 (0–127)
export type Mute = 'con-sord' | 'straight' | 'cup';                           // F-40
export type Articulation = { tick: number; kind: 'staccato'|'legato'|'accent'|'tenuto' };

export interface Part {
  instrumentId: string; notes: Note[];
  /** Durée totale si elle excède la dernière note : silences finaux (F-52 §3). */
  lengthTicks?: number;
  dyn?: DynPoint[]; mute?: Mute; articulations?: Articulation[];
  swingTarget?: [number, number];                                             // F-44
}

export type LayerRole = 'sub'|'body'|'top'|'texture'|'movement'|'fx'|'melodic';
export interface Layer {
  id: string; role: LayerRole;
  source?: 'sine'|'saw'|'square'|'wavetable'|'granular'|'sample';
  band?: { low: number; high: number };
  adsr?: { a: number; d: number; s: number; r: number };                      // ms / 0–1
  motion?: { type: 'lfo'|'automation'|'lfo-random'; dst: string; [k: string]: unknown };
  sidechainedBy?: string; trigger?: boolean;                                  // F-38
  removed?: string; level?: number; width?: number; notes?: Note[];
}
export interface LayerStack { layers: Layer[]; bus?: { glue?: string }; space?: unknown }

export type Submission =
  | { kind: 'mono'; notes: Note[] }
  | { kind: 'voices'; voices: Note[][] }                                       // M4
  /**
   * **La texture HARMONIQUE à densité variable** (décision n°32). Une suite de
   * verticalités dont on lit les accords sans pouvoir en tracer les lignes :
   * l'effectif change — un cluster à huit, une attaque seule, une pédale qui
   * s'épaissit. `voices` supposerait un effectif qui n'existe pas et ferait
   * naître des lignes fausses ; `mono` tairait toute l'harmonie. Ce kind dit
   * exactement ce qu'on sait : les accords, oui ; la conduite, non.
   */
  | { kind: 'harmony'; notes: Note[] }                                         // M3
  | { kind: 'parts'; parts: Part[] }                                           // M7+
  | { kind: 'layers'; stack: LayerStack; }                                     // M6
  | { kind: 'annotations'; annotations: unknown }                              // M11
  | { kind: 'midi'; parts: Part[]; cc: DynPoint[]; tempoEvents: TempoEvent[]; quantizeInfo: number };

export interface TempoEvent { tick: number; bpm: number; ramp?: boolean }
export type Severity = 'error' | 'warning' | 'suggestion' | 'info';
export interface Issue {
  /**
   * Le diagnostic PRÉCIS. Les analyseurs en produisent de plus fins que les
   * règles enregistrées : `vl.direct-perfect` et `vl.mozart-fifths` sont des
   * cas de `vl.parallel-perfects`. On garde le détail, parce que « octave
   * directe » et « quintes parallèles » ne se corrigent pas pareil.
   */
  ruleId: string;
  /**
   * La règle du registre qui PORTE ce diagnostic — celle dont on tire le poids
   * et la `pedagogy`. Absent quand `ruleId` est lui-même enregistré.
   */
  ownerRuleId?: string;
  severity: Severity; atTick?: number;
  message: string; lessonRef?: string }