export type LayerRole = 'sub' | 'body' | 'character' | 'texture';
export type EngineType = 'analog' | 'wavetable' | 'spectral' | 'fm' | 'sample';
export type AnalogWave = 'sine' | 'triangle' | 'saw' | 'square' | 'supersaw';
export type NoiseType = 'white' | 'pink' | 'vinyl_crackle' | 'tape_hiss' | 'sub_transient' | 'digital_grit';
export type WarpMode = 'none' | 'bend' | 'sync' | 'mirror' | 'asym' | 'formant' | 'pwm';
export type FilterType = 'lp12' | 'lp24' | 'hp12' | 'hp24' | 'bp' | 'notch' | 'comb' | 'formant' | 'ladder';
export type FilterRouting = 'serial' | 'parallel' | 'split';
export type LFOWave = 'sine' | 'triangle' | 'saw' | 'ramp' | 'square' | 'sample_hold' | 'smooth_drift';
export type MotionMode = 'pulse' | 'drift' | 'evolve' | 'bounce' | 'spiral' | 'rhythmic';
export type ArpMode = 'up' | 'down' | 'up_down' | 'random' | 'chord' | 'as_played';
export type OutsideNotesMode = 'safe' | 'musical' | 'adventurous';
export type DistType = 'soft_clip' | 'hard_clip' | 'wavefold' | 'tape' | 'tube' | 'bitcrush';
export type ActiveView = 'play' | 'design' | 'performance' | 'browser';

export interface EnvelopeSettings {
  attack: number; // 0.001 - 5.0s
  decay: number;  // 0.01 - 5.0s
  sustain: number; // 0.0 - 1.0
  release: number; // 0.01 - 8.0s
  curve?: number;  // -1 to 1 (linear is 0)
}

export interface LFOSettings {
  enabled: boolean;
  wave: LFOWave;
  rate: number; // 0.1 - 20 Hz or tempo synced
  sync: boolean;
  depth: number; // 0 - 1
  phase: number;
}

export interface FilterUnitSettings {
  enabled: boolean;
  type: FilterType;
  cutoff: number; // 20 - 20000 Hz
  resonance: number; // 0.1 - 18
  drive: number; // 0 - 1
  keyTrack: number; // 0 - 1
  envAmount: number; // -1 to 1
}

export interface LayerSettings {
  id: 'A' | 'B' | 'C' | 'D';
  name: string;
  role: LayerRole;
  enabled: boolean;
  engine: EngineType;
  volume: number; // 0 - 1
  pan: number; // -1 to 1
  octave: number; // -3 to +3
  semitone: number; // -12 to +12
  fine: number; // -50 to +50 cents
  
  // Analog Engine
  analogWave: AnalogWave;
  unisonVoices: number; // 1 - 8
  unisonDetune: number; // 0 - 1
  stereoSpread: number; // 0 - 1
  pulseWidth: number; // 0.1 - 0.9

  // Wavetable Engine
  wavetableId: string;
  wavetablePos: number; // 0 - 1 (frame index 0-63)
  warpMode: WarpMode;
  warpAmount: number; // 0 - 1

  // Spectral Engine
  harmonicCount: number; // 1 - 32
  harmonicTilt: number; // -1 to 1
  oddEvenBalance: number; // -1 (odd) to 1 (even), 0 balanced
  spectralShift: number; // -1 to 1

  // FM Engine
  fmRatio: number; // 0.25, 0.5, 1, 1.5, 2, 3, etc.
  fmDepth: number; // 0 - 1
  fmFeedback: number; // 0 - 1
  fmWave: AnalogWave;

  // Sample / Noise Engine
  noiseType: NoiseType;
  noiseColor: number; // 0 - 1 (dark to bright)

  // Dual Filter per layer
  filterA: FilterUnitSettings;
  filterB: FilterUnitSettings;
  filterRouting: FilterRouting;
  filterBalance: number; // -1 (A) to 1 (B)

  // Envelopes
  ampEnv: EnvelopeSettings;
  modEnv: EnvelopeSettings;

  // Dedicated LFOs
  lfo1: LFOSettings;
  lfo2: LFOSettings;
}

export interface ModulationRoute {
  id: string;
  source: 'lfo1' | 'lfo2' | 'modEnv' | 'velocity' | 'key' | 'modWheel' | 'aftertouch' | 'motion' | 'macro1' | 'macro2';
  target: string; // e.g. 'layerA.filterA.cutoff', 'layerB.wavetablePos', 'master.drive'
  amount: number; // -1 to +1
  enabled: boolean;
}

export interface MacroSettings {
  motion: number;   // 0 - 1
  space: number;    // 0 - 1
  drive: number;    // 0 - 1
  bright: number;   // 0 - 1
  dark: number;     // 0 - 1
  body: number;     // 0 - 1
  width: number;    // 0 - 1
  energy: number;   // 0 - 1
}

export interface MasterFXSettings {
  distortion: {
    enabled: boolean;
    type: DistType;
    drive: number; // 0 - 1
    tone: number;  // 0 - 1
    mix: number;   // 0 - 1
  };
  eq: {
    enabled: boolean;
    lowGain: number;   // -12 to +12 dB
    mid1Freq: number;  // 200 - 3000 Hz
    mid1Gain: number;  // -12 to +12 dB
    mid2Freq: number;  // 1000 - 8000 Hz
    mid2Gain: number;  // -12 to +12 dB
    highGain: number;  // -12 to +12 dB
  };
  compressor: {
    enabled: boolean;
    threshold: number; // -40 to 0 dB
    ratio: number;     // 1 to 20
    attack: number;    // 0.001 - 0.2s
    release: number;   // 0.05 - 1.0s
    makeup: number;    // 0 - 12 dB
  };
  chorus: {
    enabled: boolean;
    rate: number;      // 0.1 - 5 Hz
    depth: number;     // 0 - 1
    feedback: number;  // 0 - 0.8
    mix: number;       // 0 - 1
  };
  delay: {
    enabled: boolean;
    timeL: number;     // seconds or division
    timeR: number;     // seconds
    sync: boolean;
    division: string;  // '1/4', '1/8d', etc.
    feedback: number;  // 0 - 0.95
    damping: number;   // 0 - 1
    pingPong: boolean;
    mix: number;       // 0 - 1
  };
  reverb: {
    enabled: boolean;
    decay: number;     // 0.2 - 10s
    size: number;      // 0 - 1
    damping: number;   // 0 - 1
    shimmer: number;   // 0 - 1
    preDelay: number;  // 0 - 0.1s
    mix: number;       // 0 - 1
  };
  limiter: boolean;
  levelMatch: boolean;
}

export interface ArpStep {
  active: boolean;
  pitchOffset: number; // -12 to +12
  velocity: number;    // 0.1 to 1.0
  ratchet: number;     // 1, 2, 3, 4
  probability: number; // 0 to 1
  tie: boolean;
}

export interface ArpeggiatorSettings {
  enabled: boolean;
  mode: ArpMode;
  rate: string;        // '1/4', '1/8', '1/16', '1/32', '1/8t', '1/16t'
  bpm: number;         // 60 - 180
  octaves: number;     // 1 - 4
  swing: number;       // 0 - 1
  gate: number;        // 0.1 - 1.0
  steps: ArpStep[];
}

export interface MotionEngineSettings {
  enabled: boolean;
  mode: MotionMode;
  rate: string;        // '1/1', '1/2', '1/4', '1/8', '1/16'
  intensity: number;   // 0 - 1
  depthToFilter: number;
  depthToWavetable: number;
  depthToFM: number;
  depthToPan: number;
  depthToSpace: number;
}

export interface MusicalContext {
  key: string;         // 'C', 'C#', etc.
  scale: string;       // 'Major', 'Minor', 'Dorian', etc.
  rootFreq: number;
  chordRoot: string;
  chordQuality: string;
  progression: string[];
  outsideNotes: OutsideNotesMode;
  chordAwarePlay: boolean;
}

export interface SoundMorphState {
  morphAmount: number; // 0 - 1 (interpolates between Preset A & Preset B)
  transformWow: number; // 0 - 1 (progressive musical transformation)
  presetAId: string;
  presetBId: string;
}

export interface SynthPreset {
  id: string;
  name: string;
  author: string;
  category: 'Bass' | 'Lead' | 'Pad' | 'Keys' | 'Pluck' | 'Chord' | 'Arp' | 'Texture' | 'FX';
  genres: string[];
  moods: string[];
  description: string;
  soundExplainer: string;
  cpuRating: 'Low' | 'Medium' | 'High';
  tags: string[];

  // Sonic balance & architecture
  layers: [LayerSettings, LayerSettings, LayerSettings, LayerSettings];
  macros: MacroSettings;
  masterFX: MasterFXSettings;
  arpeggiator: ArpeggiatorSettings;
  motion: MotionEngineSettings;
  musicalContext: MusicalContext;
  modulationRoutes: ModulationRoute[];
  
  // Voice engine
  polyphony: number;
  glide: number; // 0 - 1s
  monoLegato: boolean;
  pitchBendRange: number; // semitones (2, 7, 12, 24)
}

export interface ActiveVoice {
  note: number;
  freq: number;
  velocity: number;
  startTime: number;
  sourceNodes: any[];
}
