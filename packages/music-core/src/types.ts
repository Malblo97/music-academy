export const PPQ = 480;
export const TICKS: Record<string, number> = { w: 1920, h: 960, q: 480, e: 240, s: 120 };

/** Représentation unique du mètre côté moteur : [numérateur, dénominateur] (F-52 §5). */
export type Meter = [number, number];

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
  | { kind: 'parts'; parts: Part[] }                                           // M7+
  | { kind: 'layers'; stack: LayerStack; }                                     // M6
  | { kind: 'annotations'; annotations: unknown }                              // M11
  | { kind: 'midi'; parts: Part[]; cc: DynPoint[]; tempoEvents: TempoEvent[]; quantizeInfo: number };

export interface TempoEvent { tick: number; bpm: number; ramp?: boolean }
export type Severity = 'error' | 'warning' | 'suggestion' | 'info';
export interface Issue { ruleId: string; severity: Severity; atTick?: number;
  message: string; lessonRef?: string }