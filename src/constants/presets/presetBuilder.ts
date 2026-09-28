import {
  SynthPreset,
  LayerSettings,
  MacroSettings,
  MasterFXSettings,
  ArpeggiatorSettings,
  MotionEngineSettings,
  MusicalContext
} from '../../types/synth';

export function createDefaultLayer(id: 'A' | 'B' | 'C' | 'D', name: string, role: any, engine: any): LayerSettings {
  return {
    id,
    name,
    role,
    enabled: true,
    engine,
    volume: 0.8,
    pan: 0,
    octave: 0,
    semitone: 0,
    fine: 0,
    analogWave: 'saw',
    unisonVoices: 1,
    unisonDetune: 0.15,
    stereoSpread: 0.5,
    pulseWidth: 0.5,
    wavetableId: 'cyber_saw',
    wavetablePos: 0.2,
    warpMode: 'none',
    warpAmount: 0,
    harmonicCount: 16,
    harmonicTilt: 0,
    oddEvenBalance: 0,
    spectralShift: 0,
    fmRatio: 2.0,
    fmDepth: 0.3,
    fmFeedback: 0.1,
    fmWave: 'sine',
    noiseType: 'vinyl_crackle',
    noiseColor: 0.5,
    filterA: {
      enabled: true,
      type: 'lp24',
      cutoff: 4000,
      resonance: 2.5,
      drive: 0.2,
      keyTrack: 0.5,
      envAmount: 0.3
    },
    filterB: {
      enabled: false,
      type: 'hp12',
      cutoff: 100,
      resonance: 1,
      drive: 0,
      keyTrack: 0,
      envAmount: 0
    },
    filterRouting: 'serial',
    filterBalance: -1,
    ampEnv: {
      attack: 0.01,
      decay: 0.4,
      sustain: 0.7,
      release: 0.3,
      curve: 0
    },
    modEnv: {
      attack: 0.02,
      decay: 0.5,
      sustain: 0.2,
      release: 0.4,
      curve: 0
    },
    lfo1: {
      enabled: true,
      wave: 'sine',
      rate: 2,
      sync: true,
      depth: 0.3,
      phase: 0
    },
    lfo2: {
      enabled: false,
      wave: 'triangle',
      rate: 0.5,
      sync: false,
      depth: 0.2,
      phase: 0
    }
  };
}

export function createDefaultMacros(): MacroSettings {
  return {
    motion: 0.35,
    space: 0.4,
    drive: 0.3,
    bright: 0.5,
    dark: 0.2,
    body: 0.6,
    width: 0.5,
    energy: 0.45
  };
}

export function createDefaultMasterFX(): MasterFXSettings {
  return {
    distortion: {
      enabled: true,
      type: 'tape',
      drive: 0.25,
      tone: 0.5,
      mix: 0.4
    },
    eq: {
      enabled: true,
      lowGain: 2.0,
      mid1Freq: 450,
      mid1Gain: -1.5,
      mid2Freq: 3200,
      mid2Gain: 2.0,
      highGain: 1.0
    },
    compressor: {
      enabled: true,
      threshold: -18,
      ratio: 4,
      attack: 0.02,
      release: 0.15,
      makeup: 2.5
    },
    chorus: {
      enabled: false,
      rate: 1.2,
      depth: 0.4,
      feedback: 0.2,
      mix: 0.35
    },
    delay: {
      enabled: true,
      timeL: 0.25,
      timeR: 0.375,
      sync: true,
      division: '1/8d',
      feedback: 0.35,
      damping: 0.4,
      pingPong: true,
      mix: 0.25
    },
    reverb: {
      enabled: true,
      decay: 2.4,
      size: 0.65,
      damping: 0.3,
      shimmer: 0.15,
      preDelay: 0.02,
      mix: 0.28
    },
    limiter: true,
    levelMatch: true
  };
}

export function createDefaultArp(): ArpeggiatorSettings {
  return {
    enabled: false,
    mode: 'up',
    rate: '1/16',
    bpm: 128,
    octaves: 2,
    swing: 0.15,
    gate: 0.75,
    steps: Array.from({ length: 16 }, (_, i) => ({
      active: true,
      pitchOffset: [0, 0, 7, 0, 3, 0, 10, 0, 0, 12, 7, 0, 5, 0, 3, 2][i] || 0,
      velocity: i % 4 === 0 ? 1.0 : 0.75,
      ratchet: i === 14 ? 2 : 1,
      probability: 1.0,
      tie: false
    }))
  };
}

export function createDefaultMotion(): MotionEngineSettings {
  return {
    enabled: true,
    mode: 'pulse',
    rate: '1/4',
    intensity: 0.4,
    depthToFilter: 0.4,
    depthToWavetable: 0.3,
    depthToFM: 0.2,
    depthToPan: 0.25,
    depthToSpace: 0.3
  };
}

export function createDefaultMusicalContext(): MusicalContext {
  return {
    key: 'C',
    scale: 'Minor',
    rootFreq: 261.63,
    chordRoot: 'C',
    chordQuality: 'Minor 7th',
    progression: ['i', 'VI', 'III', 'VII'],
    outsideNotes: 'musical',
    chordAwarePlay: true
  };
}

export function buildPreset(spec: {
  id: string;
  name: string;
  author?: string;
  category: SynthPreset['category'];
  genres: string[];
  moods: string[];
  description: string;
  soundExplainer: string;
  cpuRating?: 'Low' | 'Medium' | 'High';
  tags: string[];
  polyphony?: number;
  glide?: number;
  monoLegato?: boolean;
  pitchBendRange?: number;
  macros?: Partial<MacroSettings>;
  masterFX?: Partial<MasterFXSettings>;
  arpeggiator?: Partial<ArpeggiatorSettings>;
  motion?: Partial<MotionEngineSettings>;
  musicalContext?: Partial<MusicalContext>;
  layers: [Partial<LayerSettings>, Partial<LayerSettings>, Partial<LayerSettings>, Partial<LayerSettings>];
}): SynthPreset {
  const layerA = { ...createDefaultLayer('A', 'Sub/Fundamental', 'sub', 'analog'), ...spec.layers[0] };
  const layerB = { ...createDefaultLayer('B', 'Body/Harmonics', 'body', 'analog'), ...spec.layers[1] };
  const layerC = { ...createDefaultLayer('C', 'Character/Timbre', 'character', 'wavetable'), ...spec.layers[2] };
  const layerD = { ...createDefaultLayer('D', 'Texture/Noise', 'texture', 'sample'), ...spec.layers[3] };

  return {
    id: spec.id,
    name: spec.name,
    author: spec.author || 'SynthForge Sound Foundry',
    category: spec.category,
    genres: spec.genres,
    moods: spec.moods,
    description: spec.description,
    soundExplainer: spec.soundExplainer,
    cpuRating: spec.cpuRating || 'Low',
    tags: spec.tags,
    polyphony: spec.polyphony !== undefined ? spec.polyphony : (spec.category === 'Bass' ? 1 : 8),
    glide: spec.glide !== undefined ? spec.glide : (spec.category === 'Bass' ? 0.05 : 0),
    monoLegato: spec.monoLegato !== undefined ? spec.monoLegato : (spec.category === 'Bass'),
    pitchBendRange: spec.pitchBendRange || 12,
    macros: { ...createDefaultMacros(), ...(spec.macros || {}) },
    masterFX: { ...createDefaultMasterFX(), ...(spec.masterFX || {}) } as MasterFXSettings,
    arpeggiator: { ...createDefaultArp(), ...(spec.arpeggiator || {}) } as ArpeggiatorSettings,
    motion: { ...createDefaultMotion(), ...(spec.motion || {}) } as MotionEngineSettings,
    musicalContext: { ...createDefaultMusicalContext(), ...(spec.musicalContext || {}) } as MusicalContext,
    modulationRoutes: [],
    layers: [layerA, layerB, layerC, layerD]
  };
}
