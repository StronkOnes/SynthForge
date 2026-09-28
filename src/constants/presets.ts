import { SynthPreset, LayerSettings, MacroSettings, MasterFXSettings, ArpeggiatorSettings, MotionEngineSettings, MusicalContext } from '../types/synth';

function defaultLayer(id: 'A' | 'B' | 'C' | 'D', name: string, role: any, engine: any): LayerSettings {
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

function defaultMacros(): MacroSettings {
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

function defaultMasterFX(): MasterFXSettings {
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

function defaultArp(): ArpeggiatorSettings {
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

function defaultMotion(): MotionEngineSettings {
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

function defaultMusicalContext(): MusicalContext {
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

export const FACTORY_PRESETS: SynthPreset[] = [
  // 1. SUB GRAVITY 808
  {
    id: 'sub_gravity_808',
    name: 'Sub Gravity 808',
    author: 'SynthForge Labs',
    category: 'Bass',
    genres: ['Trap', 'Hip-Hop', 'Drill'],
    moods: ['Aggressive', 'Deep', 'Punchy'],
    description: 'Crushing modern 808 with saturated upper mid presence and sub-35Hz rumble designed to rattle car subwoofers.',
    soundExplainer: 'Layer A provides a pure pitched sine sub with initial pitch drop envelope. Layer B introduces a dirty reese wavetable distorted through soft clipping for speaker audibility on mobile phones. Tape warmth glues the punch together.',
    cpuRating: 'Low',
    tags: ['808', 'Sub', 'Trap', 'Distorted', 'Mono Bass'],
    polyphony: 1,
    glide: 0.08,
    monoLegato: true,
    pitchBendRange: 12,
    macros: { ...defaultMacros(), drive: 0.65, body: 0.9, bright: 0.25, width: 0.1 },
    masterFX: {
      ...defaultMasterFX(),
      distortion: { enabled: true, type: 'tape', drive: 0.55, tone: 0.4, mix: 0.6 },
      reverb: { ...defaultMasterFX().reverb, enabled: false },
      delay: { ...defaultMasterFX().delay, enabled: false }
    },
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), intensity: 0.1 },
    musicalContext: defaultMusicalContext(),
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Sub 808 Core', 'sub', 'analog'),
        analogWave: 'sine',
        octave: -2,
        volume: 0.95,
        filterA: { enabled: true, type: 'lp24', cutoff: 280, resonance: 1.2, drive: 0.4, keyTrack: 0.8, envAmount: 0.4 },
        ampEnv: { attack: 0.005, decay: 1.2, sustain: 0.3, release: 0.4, curve: -0.3 }
      },
      {
        ...defaultLayer('B', 'Mid Harmonics', 'body', 'wavetable'),
        wavetableId: 'dirty_reese',
        wavetablePos: 0.4,
        octave: -1,
        volume: 0.4,
        filterA: { enabled: true, type: 'lp12', cutoff: 1400, resonance: 2.0, drive: 0.5, keyTrack: 0.5, envAmount: 0.2 },
        ampEnv: { attack: 0.008, decay: 0.6, sustain: 0.15, release: 0.25, curve: 0 }
      },
      {
        ...defaultLayer('C', 'Transient Strike', 'character', 'sample'),
        noiseType: 'sub_transient',
        volume: 0.35,
        ampEnv: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
      },
      {
        ...defaultLayer('D', 'Sub Rumble Off', 'texture', 'analog'),
        enabled: false,
        volume: 0
      }
    ]
  },

  // 2. NEON BLADE LEAD
  {
    id: 'neon_blade_lead',
    name: 'Neon Blade Lead',
    author: 'Vangelis & Future',
    category: 'Lead',
    genres: ['Cinematic', 'Synthwave', 'EDM', 'Pop'],
    moods: ['Warm', 'Evolving', 'Epic', 'Wide'],
    description: 'Iconic cinematic polysynth lead with soaring unison detune, breathing filter modulation, and shimmering tail.',
    soundExplainer: 'Built from dual supersaw oscillators (Layer A + B) with 7 unison voices and subtle pitch drift. The 24dB ladder lowpass filter opens progressively with velocity, and a ping-pong stereo delay provides stereo space.',
    cpuRating: 'Medium',
    tags: ['Lead', 'Supersaw', 'Vangelis', 'Cinematic', 'Wide'],
    polyphony: 8,
    glide: 0.04,
    monoLegato: false,
    pitchBendRange: 7,
    macros: { ...defaultMacros(), bright: 0.7, space: 0.65, motion: 0.5, width: 0.8 },
    masterFX: {
      ...defaultMasterFX(),
      chorus: { enabled: true, rate: 0.8, depth: 0.5, feedback: 0.2, mix: 0.45 },
      reverb: { enabled: true, decay: 3.5, size: 0.8, damping: 0.2, shimmer: 0.3, preDelay: 0.03, mix: 0.4 }
    },
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), mode: 'drift', intensity: 0.45 },
    musicalContext: defaultMusicalContext(),
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Supersaw Core', 'body', 'analog'),
        analogWave: 'supersaw',
        unisonVoices: 5,
        unisonDetune: 0.28,
        stereoSpread: 0.8,
        volume: 0.75,
        filterA: { enabled: true, type: 'lp24', cutoff: 5200, resonance: 3.0, drive: 0.25, keyTrack: 0.6, envAmount: 0.45 },
        ampEnv: { attack: 0.04, decay: 0.8, sustain: 0.65, release: 0.6 }
      },
      {
        ...defaultLayer('B', 'Cyber Morph', 'character', 'wavetable'),
        wavetableId: 'cyber_saw',
        wavetablePos: 0.6,
        volume: 0.6,
        octave: 1,
        filterA: { enabled: true, type: 'lp12', cutoff: 6800, resonance: 2.0, drive: 0.15, keyTrack: 0.7, envAmount: 0.3 },
        ampEnv: { attack: 0.05, decay: 0.9, sustain: 0.6, release: 0.7 }
      },
      {
        ...defaultLayer('C', 'FM Bell Shimmer', 'character', 'fm'),
        fmRatio: 3.0,
        fmDepth: 0.35,
        volume: 0.3,
        octave: 1,
        ampEnv: { attack: 0.02, decay: 0.4, sustain: 0.1, release: 0.3 }
      },
      {
        ...defaultLayer('D', 'Tape Air', 'texture', 'sample'),
        noiseType: 'tape_hiss',
        volume: 0.15,
        ampEnv: { attack: 0.05, decay: 1.0, sustain: 0.3, release: 0.5 }
      }
    ]
  },

  // 3. COSMIC AURORA PAD
  {
    id: 'cosmic_aurora_pad',
    name: 'Cosmic Aurora Pad',
    author: 'Celestial Sounds',
    category: 'Pad',
    genres: ['Ambient', 'Cinematic', 'Future Bass', 'R&B'],
    moods: ['Ethereal', 'Warm', 'Deep', 'Evolving'],
    description: 'Enormous ambient dreamscape pad with slow undulating spectral harmonics and a cathedral shimmer reverb.',
    soundExplainer: 'Layer B runs the Spectral Engine with odd/even harmonic balancing, while Layer C runs a slow-evolving vocal formant wavetable. The Motion Engine gently cycles filter cutoff in an organic spiral trajectory.',
    cpuRating: 'Medium',
    tags: ['Pad', 'Ambient', 'Lush', 'Slow Attack', 'Evolving'],
    polyphony: 8,
    glide: 0,
    monoLegato: false,
    pitchBendRange: 2,
    macros: { ...defaultMacros(), space: 0.85, motion: 0.6, bright: 0.4, dark: 0.6, width: 0.9 },
    masterFX: {
      ...defaultMasterFX(),
      reverb: { enabled: true, decay: 6.0, size: 0.95, damping: 0.15, shimmer: 0.5, preDelay: 0.05, mix: 0.55 },
      delay: { enabled: true, timeL: 0.5, timeR: 0.75, sync: true, division: '1/4', feedback: 0.5, damping: 0.3, pingPong: true, mix: 0.35 }
    },
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), mode: 'evolve', rate: '1/1', intensity: 0.6 },
    musicalContext: defaultMusicalContext(),
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Warm Sub Base', 'sub', 'analog'),
        analogWave: 'sine',
        octave: -1,
        volume: 0.5,
        filterA: { enabled: true, type: 'lp12', cutoff: 350, resonance: 1.0, drive: 0.1, keyTrack: 0.3, envAmount: 0 },
        ampEnv: { attack: 0.8, decay: 1.5, sustain: 0.8, release: 2.0 }
      },
      {
        ...defaultLayer('B', 'Spectral Chords', 'body', 'spectral'),
        harmonicCount: 24,
        harmonicTilt: -0.2,
        oddEvenBalance: 0.3,
        volume: 0.7,
        ampEnv: { attack: 1.2, decay: 2.0, sustain: 0.85, release: 2.5 },
        filterA: { enabled: true, type: 'lp24', cutoff: 2400, resonance: 2.2, drive: 0.1, keyTrack: 0.5, envAmount: 0.4 }
      },
      {
        ...defaultLayer('C', 'Vocal Formant Shimmer', 'character', 'wavetable'),
        wavetableId: 'vocal_formant',
        wavetablePos: 0.35,
        octave: 1,
        volume: 0.55,
        ampEnv: { attack: 1.5, decay: 2.5, sustain: 0.7, release: 2.8 }
      },
      {
        ...defaultLayer('D', 'Vinyl Atmospheric Dust', 'texture', 'sample'),
        noiseType: 'vinyl_crackle',
        volume: 0.2,
        ampEnv: { attack: 0.5, decay: 2.0, sustain: 0.5, release: 2.0 }
      }
    ]
  },

  // 4. NEO-SOUL LO-FI RHODES
  {
    id: 'neo_soul_lofi_rhodes',
    name: 'Neo-Soul Lo-Fi Rhodes',
    author: 'J Dilla Tribute',
    category: 'Keys',
    genres: ['R&B', 'Hip-Hop', 'Neo-Soul', 'Pop'],
    moods: ['Warm', 'Vintage', 'Organic', 'Nostalgic'],
    description: 'Velvety electric piano with FM tines, subtle pitch flutter, tape saturation, and authentic mechanical release noise.',
    soundExplainer: 'Uses FM synthesis (Layer A) with a 1:1 ratio for warm bell tines, coupled with Liquid Sine wavetable (Layer B) for fundamental warmth. Tape saturation rolls off the high end while chorus adds authentic stereo chorus vibrato.',
    cpuRating: 'Low',
    tags: ['Rhodes', 'Electric Piano', 'Lo-Fi', 'Warm', 'Neo-Soul'],
    polyphony: 8,
    glide: 0,
    monoLegato: false,
    pitchBendRange: 2,
    macros: { ...defaultMacros(), drive: 0.45, bright: 0.35, dark: 0.65, space: 0.45 },
    masterFX: {
      ...defaultMasterFX(),
      distortion: { enabled: true, type: 'tape', drive: 0.35, tone: 0.3, mix: 0.5 },
      chorus: { enabled: true, rate: 0.9, depth: 0.6, feedback: 0.1, mix: 0.4 },
      reverb: { enabled: true, decay: 1.8, size: 0.5, damping: 0.6, shimmer: 0, preDelay: 0.01, mix: 0.25 }
    },
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), mode: 'drift', intensity: 0.3 },
    musicalContext: { ...defaultMusicalContext(), scale: 'Dorian', chordQuality: 'Minor 9th' },
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'FM Tine Bell', 'body', 'fm'),
        fmRatio: 1.0,
        fmDepth: 0.45,
        fmFeedback: 0.15,
        volume: 0.8,
        filterA: { enabled: true, type: 'lp24', cutoff: 3200, resonance: 1.5, drive: 0.2, keyTrack: 0.8, envAmount: 0.35 },
        ampEnv: { attack: 0.005, decay: 1.4, sustain: 0.3, release: 0.4 }
      },
      {
        ...defaultLayer('B', 'Liquid Sine Body', 'sub', 'wavetable'),
        wavetableId: 'liquid_sine',
        wavetablePos: 0.2,
        volume: 0.7,
        ampEnv: { attack: 0.01, decay: 1.6, sustain: 0.4, release: 0.5 }
      },
      {
        ...defaultLayer('C', 'Sub Bass Support', 'character', 'analog'),
        analogWave: 'triangle',
        octave: -1,
        volume: 0.35,
        ampEnv: { attack: 0.01, decay: 0.8, sustain: 0.2, release: 0.3 }
      },
      {
        ...defaultLayer('D', 'Mechanical Noise', 'texture', 'sample'),
        noiseType: 'vinyl_crackle',
        volume: 0.25,
        ampEnv: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.2 }
      }
    ]
  },

  // 5. FUTURE BASS HYPERPLUCK
  {
    id: 'future_bass_hyperpluck',
    name: 'Future Bass Hyperpluck',
    author: 'Illenium & Flume',
    category: 'Pluck',
    genres: ['Future Bass', 'EDM', 'Pop', 'Melodic House'],
    moods: ['Punchy', 'Bright', 'Euphoric', 'Wide'],
    description: 'Instant-punch supersaw pluck with crisp transient snap, opening filter sweep, and tempo-synced ping-pong bounce.',
    soundExplainer: 'Combines an 8-voice detuned supersaw (Layer A) with an aggressive wavetable pluck (Layer B). Filter A features a rapid decay envelope with 12dB resonance drive for intense attack bite.',
    cpuRating: 'Medium',
    tags: ['Pluck', 'Future Bass', 'Punchy', 'EDM', 'Supersaw'],
    polyphony: 8,
    glide: 0,
    monoLegato: false,
    pitchBendRange: 12,
    macros: { ...defaultMacros(), bright: 0.8, space: 0.5, energy: 0.85, width: 0.75 },
    masterFX: {
      ...defaultMasterFX(),
      delay: { enabled: true, timeL: 0.25, timeR: 0.375, sync: true, division: '1/8d', feedback: 0.4, damping: 0.2, pingPong: true, mix: 0.35 },
      reverb: { enabled: true, decay: 2.2, size: 0.7, damping: 0.2, shimmer: 0.3, preDelay: 0.01, mix: 0.3 }
    },
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), mode: 'bounce', rate: '1/8', intensity: 0.5 },
    musicalContext: { ...defaultMusicalContext(), scale: 'Major' },
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Hyper Supersaw', 'body', 'analog'),
        analogWave: 'supersaw',
        unisonVoices: 7,
        unisonDetune: 0.32,
        stereoSpread: 0.9,
        volume: 0.85,
        filterA: { enabled: true, type: 'lp24', cutoff: 1800, resonance: 3.5, drive: 0.35, keyTrack: 0.7, envAmount: 0.8 },
        ampEnv: { attack: 0.002, decay: 0.38, sustain: 0.05, release: 0.3 }
      },
      {
        ...defaultLayer('B', 'Cyber Wavetable Pluck', 'character', 'wavetable'),
        wavetableId: 'cyber_saw',
        wavetablePos: 0.5,
        octave: 1,
        volume: 0.6,
        filterA: { enabled: true, type: 'lp12', cutoff: 3500, resonance: 2.5, drive: 0.2, keyTrack: 0.6, envAmount: 0.6 },
        ampEnv: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.25 }
      },
      {
        ...defaultLayer('C', 'Sub Pluck', 'sub', 'analog'),
        analogWave: 'sine',
        octave: -1,
        volume: 0.6,
        ampEnv: { attack: 0.005, decay: 0.3, sustain: 0.1, release: 0.2 }
      },
      {
        ...defaultLayer('D', 'Click Transient', 'texture', 'sample'),
        noiseType: 'sub_transient',
        volume: 0.45,
        ampEnv: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.03 }
      }
    ]
  },

  // 6. CYBER REESE BASS
  {
    id: 'cyber_reese_bass',
    name: 'Cyber Reese Bass',
    author: 'Noisia & Neurohop',
    category: 'Bass',
    genres: ['Drum & Bass', 'Dubstep', 'Tech House', 'Drill'],
    moods: ['Aggressive', 'Evolving', 'Dark', 'Heavy'],
    description: 'Iconic moving neurohop reese bass with phasing harmonic teeth, multiband squish, and aggressive stereo motion.',
    soundExplainer: 'Two detuned wavetables (Dirty Reese + Cyber Saw) generate rich chorused phase cancellations. A comb filter and wavefold distortion add ferocious midrange grit while the sub fundamental stays strictly mono.',
    cpuRating: 'Medium',
    tags: ['Reese', 'Neuro', 'DnB', 'Heavy', 'Bass'],
    polyphony: 1,
    glide: 0.06,
    monoLegato: true,
    pitchBendRange: 12,
    macros: { ...defaultMacros(), drive: 0.75, motion: 0.7, dark: 0.4, body: 0.8 },
    masterFX: {
      ...defaultMasterFX(),
      distortion: { enabled: true, type: 'wavefold', drive: 0.6, tone: 0.6, mix: 0.7 },
      chorus: { enabled: true, rate: 0.5, depth: 0.7, feedback: 0.3, mix: 0.4 }
    },
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), mode: 'spiral', rate: '1/2', intensity: 0.65 },
    musicalContext: defaultMusicalContext(),
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Solid Sub Mono', 'sub', 'analog'),
        analogWave: 'sine',
        octave: -2,
        volume: 0.9,
        ampEnv: { attack: 0.01, decay: 0.6, sustain: 0.9, release: 0.3 }
      },
      {
        ...defaultLayer('B', 'Neuro Reese', 'body', 'wavetable'),
        wavetableId: 'dirty_reese',
        wavetablePos: 0.7,
        octave: -1,
        volume: 0.8,
        unisonVoices: 3,
        unisonDetune: 0.25,
        stereoSpread: 0.75,
        filterA: { enabled: true, type: 'comb', cutoff: 1800, resonance: 4.0, drive: 0.4, keyTrack: 0.5, envAmount: 0.3 },
        ampEnv: { attack: 0.02, decay: 0.8, sustain: 0.85, release: 0.4 }
      },
      {
        ...defaultLayer('C', 'Acid Scream', 'character', 'wavetable'),
        wavetableId: 'acid_grit',
        wavetablePos: 0.3,
        volume: 0.5,
        filterA: { enabled: true, type: 'bp', cutoff: 2200, resonance: 3.0, drive: 0.5, keyTrack: 0.7, envAmount: 0.4 },
        ampEnv: { attack: 0.03, decay: 0.7, sustain: 0.7, release: 0.35 }
      },
      {
        ...defaultLayer('D', 'Digital Dirt', 'texture', 'sample'),
        noiseType: 'digital_grit',
        volume: 0.2,
        ampEnv: { attack: 0.01, decay: 0.5, sustain: 0.3, release: 0.3 }
      }
    ]
  },

  // 7. DRIVING CYBERPUNK PULSE ARP
  {
    id: 'driving_cyberpunk_arp',
    name: 'Driving Cyberpunk Pulse',
    author: 'Cyber Matrix',
    category: 'Arp',
    genres: ['Tech House', 'Techno', 'Cinematic', 'EDM'],
    moods: ['Rhythmic', 'Driving', 'Dark', 'Aggressive'],
    description: 'Hypnotic 16th-note driving sequencer bassline with ratchets, opening comb filter, and industrial punch.',
    soundExplainer: 'The 16-step sequencer triggers accented 16th notes with step ratchets on beat 4. Layer A provides tight analog saw stabs while Layer C contributes metallic FM percussion.',
    cpuRating: 'Low',
    tags: ['Arp', 'Sequencer', 'Cyberpunk', 'Techno', '16th Notes'],
    polyphony: 4,
    glide: 0,
    monoLegato: false,
    pitchBendRange: 2,
    macros: { ...defaultMacros(), motion: 0.8, drive: 0.5, bright: 0.65, energy: 0.9 },
    masterFX: {
      ...defaultMasterFX(),
      delay: { enabled: true, timeL: 0.125, timeR: 0.25, sync: true, division: '1/16', feedback: 0.3, damping: 0.4, pingPong: true, mix: 0.3 }
    },
    arpeggiator: {
      ...defaultArp(),
      enabled: true,
      mode: 'up_down',
      rate: '1/16',
      bpm: 128
    },
    motion: { ...defaultMotion(), mode: 'rhythmic', rate: '1/8', intensity: 0.7 },
    musicalContext: defaultMusicalContext(),
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Punchy Saw Stab', 'body', 'analog'),
        analogWave: 'saw',
        octave: -1,
        volume: 0.85,
        filterA: { enabled: true, type: 'lp24', cutoff: 2200, resonance: 3.2, drive: 0.35, keyTrack: 0.7, envAmount: 0.6 },
        ampEnv: { attack: 0.003, decay: 0.18, sustain: 0.1, release: 0.12 }
      },
      {
        ...defaultLayer('B', 'Sub Thump', 'sub', 'analog'),
        analogWave: 'triangle',
        octave: -2,
        volume: 0.8,
        ampEnv: { attack: 0.005, decay: 0.2, sustain: 0.1, release: 0.1 }
      },
      {
        ...defaultLayer('C', 'Metallic FM Accent', 'character', 'fm'),
        fmRatio: 4.0,
        fmDepth: 0.5,
        volume: 0.45,
        ampEnv: { attack: 0.002, decay: 0.12, sustain: 0, release: 0.08 }
      },
      {
        ...defaultLayer('D', 'Off', 'texture', 'analog'),
        enabled: false,
        volume: 0
      }
    ]
  },

  // 8. LUSH 90s HOUSE STAB
  {
    id: 'lush_90s_house_stab',
    name: 'Lush 90s House Stabs',
    author: 'Chicago & NYC Garage',
    category: 'Chord',
    genres: ['House', 'Tech House', 'Afrobeats', 'Pop'],
    moods: ['Warm', 'Rhythmic', 'Punchy', 'Wide'],
    description: 'Authentic 90s classic garage house chord stab with rich minor 9th harmonic stacking and warm plate reverb.',
    soundExplainer: 'Harmonic spectral engine stacks minor 9th chord intervals directly within the voice architecture. Bandpass and lowpass filters in parallel create the nostalgic M1 / Juno punch.',
    cpuRating: 'Low',
    tags: ['House', 'Chord Stab', '90s', 'Garage', 'Warm'],
    polyphony: 8,
    glide: 0,
    monoLegato: false,
    pitchBendRange: 2,
    macros: { ...defaultMacros(), bright: 0.6, space: 0.55, body: 0.7, energy: 0.6 },
    masterFX: {
      ...defaultMasterFX(),
      delay: { enabled: true, timeL: 0.25, timeR: 0.375, sync: true, division: '1/8d', feedback: 0.35, damping: 0.3, pingPong: true, mix: 0.25 },
      reverb: { enabled: true, decay: 2.0, size: 0.6, damping: 0.4, shimmer: 0.1, preDelay: 0.02, mix: 0.35 }
    },
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), mode: 'pulse', rate: '1/4', intensity: 0.3 },
    musicalContext: { ...defaultMusicalContext(), chordQuality: 'Minor 9th' },
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Square-Saw Blend', 'body', 'analog'),
        analogWave: 'square',
        volume: 0.8,
        filterA: { enabled: true, type: 'lp24', cutoff: 3400, resonance: 2.5, drive: 0.3, keyTrack: 0.6, envAmount: 0.5 },
        ampEnv: { attack: 0.005, decay: 0.45, sustain: 0.15, release: 0.3 }
      },
      {
        ...defaultLayer('B', 'Spectral Organ', 'character', 'spectral'),
        harmonicCount: 16,
        harmonicTilt: -0.15,
        volume: 0.65,
        ampEnv: { attack: 0.008, decay: 0.5, sustain: 0.2, release: 0.35 }
      },
      {
        ...defaultLayer('C', 'Tine Click', 'character', 'fm'),
        fmRatio: 2.0,
        fmDepth: 0.3,
        volume: 0.35,
        ampEnv: { attack: 0.002, decay: 0.08, sustain: 0, release: 0.05 }
      },
      {
        ...defaultLayer('D', 'Vinyl Texture', 'texture', 'sample'),
        noiseType: 'vinyl_crackle',
        volume: 0.2,
        ampEnv: { attack: 0.01, decay: 0.5, sustain: 0.2, release: 0.3 }
      }
    ]
  },

  // 9. FORMANT VOCAL TALKBOX LEAD
  {
    id: 'formant_vocal_lead',
    name: 'Formant Vocal Talkbox',
    author: 'Daft Vocals',
    category: 'Lead',
    genres: ['Pop', 'R&B', 'Future Bass', 'Funk'],
    moods: ['Expressive', 'Bright', 'Organic', 'Funky'],
    description: 'Human-like talking vocal synthesizer lead with morphing vowels (A-E-I-O-U), pitch glide, and expressive vibrato.',
    soundExplainer: 'Layer B utilizes the Vocal Formant wavetable modulated via LFO 1 to scan vowel resonances. Portamento glide mimics human vocal pitch inflection with tape saturation adding chest resonance.',
    cpuRating: 'Medium',
    tags: ['Vocal', 'Formant', 'Talkbox', 'Lead', 'Funk'],
    polyphony: 1,
    glide: 0.05,
    monoLegato: true,
    pitchBendRange: 7,
    macros: { ...defaultMacros(), motion: 0.6, drive: 0.4, bright: 0.7, space: 0.5 },
    masterFX: defaultMasterFX(),
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), mode: 'evolve', rate: '1/4', intensity: 0.6 },
    musicalContext: defaultMusicalContext(),
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Vocal Saw Core', 'body', 'analog'),
        analogWave: 'saw',
        volume: 0.7,
        filterA: { enabled: true, type: 'formant', cutoff: 2400, resonance: 4.5, drive: 0.3, keyTrack: 0.8, envAmount: 0.4 },
        ampEnv: { attack: 0.02, decay: 0.6, sustain: 0.7, release: 0.3 }
      },
      {
        ...defaultLayer('B', 'Vocal Wavetable Morph', 'character', 'wavetable'),
        wavetableId: 'vocal_formant',
        wavetablePos: 0.5,
        volume: 0.85,
        ampEnv: { attack: 0.02, decay: 0.7, sustain: 0.75, release: 0.35 }
      },
      {
        ...defaultLayer('C', 'Sub Support', 'sub', 'analog'),
        analogWave: 'sine',
        octave: -1,
        volume: 0.4,
        ampEnv: { attack: 0.01, decay: 0.5, sustain: 0.5, release: 0.3 }
      },
      {
        ...defaultLayer('D', 'Breath Air', 'texture', 'sample'),
        noiseType: 'tape_hiss',
        volume: 0.2,
        ampEnv: { attack: 0.03, decay: 0.4, sustain: 0.2, release: 0.2 }
      }
    ]
  },

  // 10. DARK MATTER DRONE & VOID
  {
    id: 'dark_matter_drone',
    name: 'Dark Matter Drone',
    author: 'Hans & Dune',
    category: 'Texture',
    genres: ['Cinematic', 'Ambient', 'Experimental', 'Drill'],
    moods: ['Dark', 'Ominous', 'Deep', 'Cinematic'],
    description: 'Deep subterranean cinematic drone with shifting tectonic sub frequencies, metallic comb resonance, and ominous space.',
    soundExplainer: 'Layer A holds a sub-30Hz sine tone. Layer B runs the Metallic Comb Resonator wavetable with slow random S&H modulation. Layer D injects digital grit and tape flutter into a 8-second hall reverb.',
    cpuRating: 'Low',
    tags: ['Drone', 'Cinematic', 'Dark', 'Subterranean', 'Atmosphere'],
    polyphony: 4,
    glide: 0.2,
    monoLegato: false,
    pitchBendRange: 12,
    macros: { ...defaultMacros(), dark: 0.9, space: 0.8, drive: 0.5, motion: 0.65, bright: 0.2 },
    masterFX: {
      ...defaultMasterFX(),
      reverb: { enabled: true, decay: 8.0, size: 1.0, damping: 0.3, shimmer: 0.1, preDelay: 0.08, mix: 0.6 },
      distortion: { enabled: true, type: 'soft_clip', drive: 0.4, tone: 0.3, mix: 0.5 }
    },
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), mode: 'drift', rate: '1/1', intensity: 0.7 },
    musicalContext: defaultMusicalContext(),
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Tectonic Sub', 'sub', 'analog'),
        analogWave: 'sine',
        octave: -2,
        volume: 0.9,
        ampEnv: { attack: 1.5, decay: 3.0, sustain: 0.9, release: 3.0 }
      },
      {
        ...defaultLayer('B', 'Metallic Drone', 'body', 'wavetable'),
        wavetableId: 'metallic_comb',
        wavetablePos: 0.4,
        volume: 0.65,
        filterA: { enabled: true, type: 'comb', cutoff: 800, resonance: 6.0, drive: 0.3, keyTrack: 0.2, envAmount: 0.3 },
        ampEnv: { attack: 2.0, decay: 4.0, sustain: 0.85, release: 4.0 }
      },
      {
        ...defaultLayer('C', 'Ominous FM Low', 'character', 'fm'),
        fmRatio: 0.5,
        fmDepth: 0.6,
        volume: 0.5,
        octave: -1,
        ampEnv: { attack: 1.8, decay: 3.0, sustain: 0.7, release: 3.5 }
      },
      {
        ...defaultLayer('D', 'Subterranean Static', 'texture', 'sample'),
        noiseType: 'digital_grit',
        volume: 0.3,
        ampEnv: { attack: 1.0, decay: 2.0, sustain: 0.5, release: 3.0 }
      }
    ]
  },

  // 11. TOKYO NIGHT KOTO-PLUCK
  {
    id: 'tokyo_night_koto_pluck',
    name: 'Tokyo Night Koto Pluck',
    author: 'Eastern Cyber',
    category: 'Pluck',
    genres: ['Trap', 'Hip-Hop', 'Pop', 'Cinematic'],
    moods: ['Organic', 'Mystical', 'Bright', 'Punchy'],
    description: 'Crisp Japanese string-inspired synth pluck tuned for trap beats and emotive melodic hooks.',
    soundExplainer: 'Spectral Engine isolates odd harmonic ratios to simulate struck silk strings. A quick pitch envelope delivers string bite while the ping-pong delay adds neon spatial dimension.',
    cpuRating: 'Low',
    tags: ['Pluck', 'Koto', 'Asian', 'Trap', 'Melodic'],
    polyphony: 8,
    glide: 0,
    monoLegato: false,
    pitchBendRange: 2,
    macros: { ...defaultMacros(), bright: 0.75, space: 0.45, drive: 0.25, width: 0.6 },
    masterFX: defaultMasterFX(),
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), intensity: 0.3 },
    musicalContext: { ...defaultMusicalContext(), scale: 'Japanese Insen' },
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Struck String Body', 'body', 'spectral'),
        harmonicCount: 20,
        harmonicTilt: -0.3,
        oddEvenBalance: -0.6,
        volume: 0.8,
        filterA: { enabled: true, type: 'lp24', cutoff: 5500, resonance: 2.8, drive: 0.2, keyTrack: 0.8, envAmount: 0.6 },
        ampEnv: { attack: 0.002, decay: 0.6, sustain: 0.05, release: 0.4 }
      },
      {
        ...defaultLayer('B', 'Inharmonic Bell', 'character', 'wavetable'),
        wavetableId: 'spectral_bell',
        wavetablePos: 0.25,
        volume: 0.6,
        octave: 1,
        ampEnv: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.3 }
      },
      {
        ...defaultLayer('C', 'Warm Fundamental', 'sub', 'analog'),
        analogWave: 'triangle',
        volume: 0.5,
        ampEnv: { attack: 0.005, decay: 0.5, sustain: 0.05, release: 0.3 }
      },
      {
        ...defaultLayer('D', 'Plectrum Pick Strike', 'texture', 'sample'),
        noiseType: 'sub_transient',
        volume: 0.4,
        ampEnv: { attack: 0.001, decay: 0.02, sustain: 0, release: 0.02 }
      }
    ]
  },

  // 12. ACID 303 SCREAMER
  {
    id: 'acid_303_screamer',
    name: 'Acid 303 Screamer',
    author: 'Roland Transistor',
    category: 'Bass',
    genres: ['Techno', 'Tech House', 'Acid', 'EDM'],
    moods: ['Aggressive', 'Punchy', 'Raw', 'High Energy'],
    description: 'Screaming resonant diode-filtered bassline with authentic accent decay, slide portamento, and analog grit.',
    soundExplainer: 'Recreates the legendary 303 diode ladder circuit. Layer A drives the Acid Grit wavetable into a high-resonance 24dB ladder filter with strong envelope snap. Portamento glide allows slippery legato slides.',
    cpuRating: 'Low',
    tags: ['Acid', '303', 'Techno', 'Screamer', 'Resonant'],
    polyphony: 1,
    glide: 0.08,
    monoLegato: true,
    pitchBendRange: 12,
    macros: { ...defaultMacros(), drive: 0.8, bright: 0.9, motion: 0.7, energy: 0.95 },
    masterFX: {
      ...defaultMasterFX(),
      distortion: { enabled: true, type: 'hard_clip', drive: 0.75, tone: 0.7, mix: 0.8 },
      delay: { enabled: true, timeL: 0.187, timeR: 0.375, sync: true, division: '1/16', feedback: 0.4, damping: 0.3, pingPong: true, mix: 0.35 }
    },
    arpeggiator: { ...defaultArp(), enabled: true, mode: 'up', rate: '1/16', bpm: 132 },
    motion: { ...defaultMotion(), mode: 'rhythmic', rate: '1/8', intensity: 0.8 },
    musicalContext: defaultMusicalContext(),
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', '303 Acid Wave', 'body', 'wavetable'),
        wavetableId: 'acid_grit',
        wavetablePos: 0.6,
        octave: -1,
        volume: 0.9,
        filterA: { enabled: true, type: 'ladder', cutoff: 1400, resonance: 7.5, drive: 0.6, keyTrack: 0.8, envAmount: 0.9 },
        ampEnv: { attack: 0.002, decay: 0.22, sustain: 0.1, release: 0.1 }
      },
      {
        ...defaultLayer('B', 'Sub Octave Square', 'sub', 'analog'),
        analogWave: 'square',
        octave: -2,
        volume: 0.6,
        ampEnv: { attack: 0.005, decay: 0.2, sustain: 0.1, release: 0.1 }
      },
      {
        ...defaultLayer('C', 'Off', 'character', 'analog'),
        enabled: false,
        volume: 0
      },
      {
        ...defaultLayer('D', 'Analog Transistor Noise', 'texture', 'sample'),
        noiseType: 'tape_hiss',
        volume: 0.15,
        ampEnv: { attack: 0.005, decay: 0.2, sustain: 0.05, release: 0.1 }
      }
    ]
  },

  // 13. CRYSTAL FM TINES
  {
    id: 'crystal_fm_tines',
    name: 'Crystal FM Tines',
    author: 'Yamaha 80s',
    category: 'Keys',
    genres: ['Pop', 'R&B', 'Ballad', 'Ambient'],
    moods: ['Bright', 'Nostalgic', 'Pristine', 'Emotional'],
    description: 'Iconic 80s glass electric piano with shimmering metallic tines and lush chorus spread.',
    soundExplainer: 'Dual operator FM synthesis with 3.5x harmonic ratio for high metallic ring. Stereo chorus and shimmer reverb enhance spatial depth while preserving clean transient clarity.',
    cpuRating: 'Low',
    tags: ['FM', 'Tines', '80s', 'Electric Piano', 'DX7'],
    polyphony: 8,
    glide: 0,
    monoLegato: false,
    pitchBendRange: 2,
    macros: { ...defaultMacros(), bright: 0.7, space: 0.6, drive: 0.2, width: 0.75 },
    masterFX: {
      ...defaultMasterFX(),
      chorus: { enabled: true, rate: 1.5, depth: 0.6, feedback: 0.15, mix: 0.45 },
      reverb: { enabled: true, decay: 3.0, size: 0.7, damping: 0.2, shimmer: 0.3, preDelay: 0.02, mix: 0.35 }
    },
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), intensity: 0.25 },
    musicalContext: { ...defaultMusicalContext(), scale: 'Major' },
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'FM Glass Tine', 'body', 'fm'),
        fmRatio: 3.5,
        fmDepth: 0.5,
        fmFeedback: 0.2,
        volume: 0.85,
        ampEnv: { attack: 0.003, decay: 1.8, sustain: 0.2, release: 0.6 }
      },
      {
        ...defaultLayer('B', 'Liquid Sine Fundamental', 'sub', 'wavetable'),
        wavetableId: 'liquid_sine',
        wavetablePos: 0.3,
        volume: 0.7,
        ampEnv: { attack: 0.005, decay: 2.0, sustain: 0.3, release: 0.7 }
      },
      {
        ...defaultLayer('C', 'Spectral Shimmer', 'character', 'spectral'),
        harmonicCount: 16,
        harmonicTilt: 0.2,
        volume: 0.4,
        octave: 1,
        ampEnv: { attack: 0.01, decay: 1.2, sustain: 0.1, release: 0.5 }
      },
      {
        ...defaultLayer('D', 'Off', 'texture', 'analog'),
        enabled: false,
        volume: 0
      }
    ]
  },

  // 14. ETHEREAL GLASS CHOIR
  {
    id: 'ethereal_glass_choir',
    name: 'Ethereal Glass Choir',
    author: 'Vocal Foundry',
    category: 'Pad',
    genres: ['Cinematic', 'Ambient', 'Future Bass', 'Pop'],
    moods: ['Ethereal', 'Warm', 'Emotional', 'Majestic'],
    description: 'Angelic vocal choir pad layered with crystalline glass formants and infinite sustain.',
    soundExplainer: 'Layer A & B blend human vocal formants with crystalline spectral bell harmonics. A slow attack envelope and shimmer reverb evoke an expansive acoustic cathedral.',
    cpuRating: 'Medium',
    tags: ['Choir', 'Vocal', 'Pad', 'Ambient', 'Cinematic'],
    polyphony: 8,
    glide: 0,
    monoLegato: false,
    pitchBendRange: 2,
    macros: { ...defaultMacros(), space: 0.9, bright: 0.5, motion: 0.4, width: 0.9 },
    masterFX: {
      ...defaultMasterFX(),
      reverb: { enabled: true, decay: 5.5, size: 0.9, damping: 0.2, shimmer: 0.4, preDelay: 0.04, mix: 0.5 }
    },
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), mode: 'evolve', rate: '1/2', intensity: 0.4 },
    musicalContext: defaultMusicalContext(),
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Vocal Choir Formants', 'body', 'wavetable'),
        wavetableId: 'vocal_formant',
        wavetablePos: 0.4,
        volume: 0.8,
        filterA: { enabled: true, type: 'lp12', cutoff: 4200, resonance: 1.5, drive: 0.1, keyTrack: 0.5, envAmount: 0.2 },
        ampEnv: { attack: 0.8, decay: 2.0, sustain: 0.8, release: 1.8 }
      },
      {
        ...defaultLayer('B', 'Glass Harmonics', 'character', 'spectral'),
        harmonicCount: 24,
        harmonicTilt: 0.1,
        volume: 0.6,
        octave: 1,
        ampEnv: { attack: 1.0, decay: 2.2, sustain: 0.7, release: 2.0 }
      },
      {
        ...defaultLayer('C', 'Warm Sub Pad', 'sub', 'analog'),
        analogWave: 'sine',
        octave: -1,
        volume: 0.45,
        ampEnv: { attack: 0.9, decay: 1.8, sustain: 0.7, release: 1.5 }
      },
      {
        ...defaultLayer('D', 'Breath Whisper', 'texture', 'sample'),
        noiseType: 'tape_hiss',
        volume: 0.2,
        ampEnv: { attack: 0.6, decay: 1.5, sustain: 0.4, release: 1.5 }
      }
    ]
  },

  // 15. INDUSTRIAL IMPACT RISER
  {
    id: 'industrial_impact_riser',
    name: 'Industrial Impact Riser',
    author: 'Trailer Soundworks',
    category: 'FX',
    genres: ['Cinematic', 'EDM', 'Dubstep', 'Trap'],
    moods: ['Aggressive', 'Tense', 'Epic', 'Industrial'],
    description: 'Catastrophic cinematic drop riser with accelerating pitch bend, white noise sweep, and metallic sub impact.',
    soundExplainer: 'Modulation envelope continuously sweeps oscillator pitch upward over 4 bars while filter cutoff opens and distortion drive intensifies, culminating in an explosive impact.',
    cpuRating: 'Medium',
    tags: ['FX', 'Riser', 'Impact', 'Cinematic', 'Build'],
    polyphony: 4,
    glide: 0.5,
    monoLegato: false,
    pitchBendRange: 24,
    macros: { ...defaultMacros(), drive: 0.8, bright: 0.85, motion: 0.9, energy: 1.0 },
    masterFX: {
      ...defaultMasterFX(),
      distortion: { enabled: true, type: 'wavefold', drive: 0.7, tone: 0.7, mix: 0.75 },
      reverb: { enabled: true, decay: 4.0, size: 0.85, damping: 0.2, shimmer: 0.3, preDelay: 0.05, mix: 0.45 }
    },
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), mode: 'pulse', rate: '1/16', intensity: 0.85 },
    musicalContext: defaultMusicalContext(),
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Noise Sweep Jet', 'texture', 'sample'),
        noiseType: 'white',
        volume: 0.85,
        filterA: { enabled: true, type: 'bp', cutoff: 3500, resonance: 6.0, drive: 0.5, keyTrack: 0, envAmount: 0.8 },
        ampEnv: { attack: 0.5, decay: 2.0, sustain: 0.9, release: 2.0 }
      },
      {
        ...defaultLayer('B', 'Rising Cyber Wavetable', 'body', 'wavetable'),
        wavetableId: 'cyber_saw',
        wavetablePos: 0.8,
        volume: 0.75,
        ampEnv: { attack: 0.8, decay: 2.5, sustain: 0.85, release: 2.2 }
      },
      {
        ...defaultLayer('C', 'Metallic Alarm', 'character', 'wavetable'),
        wavetableId: 'metallic_comb',
        wavetablePos: 0.6,
        volume: 0.6,
        octave: 1,
        ampEnv: { attack: 0.4, decay: 2.0, sustain: 0.8, release: 1.8 }
      },
      {
        ...defaultLayer('D', 'Sub Impact Stomp', 'sub', 'analog'),
        analogWave: 'sine',
        octave: -2,
        volume: 0.7,
        ampEnv: { attack: 0.01, decay: 1.5, sustain: 0.2, release: 1.5 }
      }
    ]
  },

  // 16. VELVET TAPE DRIFT
  {
    id: 'velvet_tape_drift',
    name: 'Velvet Tape Drift',
    author: 'Analog Heritage',
    category: 'Pad',
    genres: ['Lo-Fi', 'Hip-Hop', 'Neo-Soul', 'Ambient'],
    moods: ['Warm', 'Nostalgic', 'Drifting', 'Soft'],
    description: 'Drifting tape-worn synth pad with subtle wow & flutter pitch wobble, rolled-off warmth, and vinyl dust.',
    soundExplainer: 'Virtual analog saw and triangle oscillators gently detuned with LFO 1 applying subtle micro-pitch drift (wow/flutter). Lowpass 12dB filter and vinyl dust create genuine vintage tape nostalgia.',
    cpuRating: 'Low',
    tags: ['Lo-Fi', 'Tape', 'Drift', 'Warm', 'Pad'],
    polyphony: 8,
    glide: 0,
    monoLegato: false,
    pitchBendRange: 2,
    macros: { ...defaultMacros(), dark: 0.75, bright: 0.25, space: 0.5, motion: 0.45 },
    masterFX: {
      ...defaultMasterFX(),
      distortion: { enabled: true, type: 'tape', drive: 0.45, tone: 0.25, mix: 0.6 },
      reverb: { enabled: true, decay: 2.5, size: 0.6, damping: 0.7, shimmer: 0, preDelay: 0.02, mix: 0.3 }
    },
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), mode: 'drift', rate: '1/2', intensity: 0.4 },
    musicalContext: defaultMusicalContext(),
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Warm Saw Pad', 'body', 'analog'),
        analogWave: 'saw',
        volume: 0.75,
        filterA: { enabled: true, type: 'lp12', cutoff: 1800, resonance: 1.2, drive: 0.3, keyTrack: 0.4, envAmount: 0.2 },
        ampEnv: { attack: 0.4, decay: 1.2, sustain: 0.75, release: 1.2 }
      },
      {
        ...defaultLayer('B', 'Liquid Sine Octave', 'character', 'wavetable'),
        wavetableId: 'liquid_sine',
        wavetablePos: 0.3,
        octave: 1,
        volume: 0.5,
        ampEnv: { attack: 0.5, decay: 1.5, sustain: 0.6, release: 1.3 }
      },
      {
        ...defaultLayer('C', 'Deep Sub', 'sub', 'analog'),
        analogWave: 'sine',
        octave: -1,
        volume: 0.6,
        ampEnv: { attack: 0.3, decay: 1.0, sustain: 0.7, release: 1.0 }
      },
      {
        ...defaultLayer('D', 'Vinyl Dust & Crackle', 'texture', 'sample'),
        noiseType: 'vinyl_crackle',
        volume: 0.35,
        ampEnv: { attack: 0.1, decay: 1.5, sustain: 0.5, release: 1.0 }
      }
    ]
  },

  // 17. HYPER SAW SCREAMER
  {
    id: 'hyper_saw_screamer',
    name: 'Hyper Saw Screamer',
    author: 'Hardstyle & EDM',
    category: 'Lead',
    genres: ['EDM', 'Hardstyle', 'Trance', 'Future Bass'],
    moods: ['Aggressive', 'High Energy', 'Loud', 'Wide'],
    description: 'Massive multi-unison screamer lead engineered to cut through packed festival sound systems with maximum wall-of-sound energy.',
    soundExplainer: '8-voice unison supersaw running at max stereo spread paired with hard clipping distortion. Parametric EQ boosts 3.2kHz presence for extreme upfront aggression.',
    cpuRating: 'Medium',
    tags: ['Supersaw', 'Festival', 'EDM', 'Hardstyle', 'Lead'],
    polyphony: 6,
    glide: 0.03,
    monoLegato: false,
    pitchBendRange: 12,
    macros: { ...defaultMacros(), bright: 0.9, drive: 0.85, energy: 1.0, width: 0.95 },
    masterFX: {
      ...defaultMasterFX(),
      distortion: { enabled: true, type: 'hard_clip', drive: 0.7, tone: 0.8, mix: 0.7 },
      reverb: { enabled: true, decay: 2.8, size: 0.75, damping: 0.2, shimmer: 0.35, preDelay: 0.02, mix: 0.35 }
    },
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), intensity: 0.3 },
    musicalContext: { ...defaultMusicalContext(), scale: 'Major' },
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Wall of Supersaws', 'body', 'analog'),
        analogWave: 'supersaw',
        unisonVoices: 8,
        unisonDetune: 0.45,
        stereoSpread: 1.0,
        volume: 0.9,
        filterA: { enabled: true, type: 'lp24', cutoff: 8000, resonance: 2.0, drive: 0.5, keyTrack: 0.5, envAmount: 0.3 },
        ampEnv: { attack: 0.005, decay: 0.6, sustain: 0.85, release: 0.3 }
      },
      {
        ...defaultLayer('B', 'Cyber Grit Sync', 'character', 'wavetable'),
        wavetableId: 'cyber_saw',
        wavetablePos: 0.75,
        octave: 1,
        volume: 0.7,
        ampEnv: { attack: 0.005, decay: 0.5, sustain: 0.8, release: 0.3 }
      },
      {
        ...defaultLayer('C', 'Sub Center Punch', 'sub', 'analog'),
        analogWave: 'saw',
        octave: -1,
        volume: 0.6,
        ampEnv: { attack: 0.005, decay: 0.4, sustain: 0.7, release: 0.25 }
      },
      {
        ...defaultLayer('D', 'Off', 'texture', 'analog'),
        enabled: false,
        volume: 0
      }
    ]
  },

  // 18. MELODIC HOUSE ZAP PLUCK
  {
    id: 'melodic_house_zap',
    name: 'Melodic House Zap',
    author: 'Anjunadeep & Keinemusik',
    category: 'Pluck',
    genres: ['House', 'Melodic House', 'Afro House', 'Deep House'],
    moods: ['Organic', 'Hypnotic', 'Warm', 'Rhythmic'],
    description: 'Bouncy afro-melodic house pluck with wooden attack transient, analog warmth, and warm ping-pong delay bounce.',
    soundExplainer: 'Short decay triangle oscillator layered with an organic transient click. The resonant lowpass filter snaps open for 15ms creating an acoustic wooden mallet character.',
    cpuRating: 'Low',
    tags: ['Pluck', 'Melodic House', 'Afro House', 'Organic', 'Zap'],
    polyphony: 8,
    glide: 0,
    monoLegato: false,
    pitchBendRange: 2,
    macros: { ...defaultMacros(), bright: 0.65, space: 0.5, motion: 0.4, body: 0.65 },
    masterFX: {
      ...defaultMasterFX(),
      delay: { enabled: true, timeL: 0.25, timeR: 0.375, sync: true, division: '1/8d', feedback: 0.4, damping: 0.35, pingPong: true, mix: 0.35 },
      reverb: { enabled: true, decay: 2.0, size: 0.55, damping: 0.4, shimmer: 0.1, preDelay: 0.01, mix: 0.25 }
    },
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), mode: 'bounce', rate: '1/8', intensity: 0.45 },
    musicalContext: { ...defaultMusicalContext(), scale: 'Dorian' },
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Analog Woody Core', 'body', 'analog'),
        analogWave: 'triangle',
        volume: 0.85,
        filterA: { enabled: true, type: 'lp24', cutoff: 2400, resonance: 3.8, drive: 0.3, keyTrack: 0.8, envAmount: 0.7 },
        ampEnv: { attack: 0.002, decay: 0.28, sustain: 0.02, release: 0.2 }
      },
      {
        ...defaultLayer('B', 'Liquid Sine Sub', 'sub', 'wavetable'),
        wavetableId: 'liquid_sine',
        wavetablePos: 0.1,
        volume: 0.6,
        octave: -1,
        ampEnv: { attack: 0.005, decay: 0.22, sustain: 0, release: 0.15 }
      },
      {
        ...defaultLayer('C', 'FM Attack Strike', 'character', 'fm'),
        fmRatio: 3.0,
        fmDepth: 0.4,
        volume: 0.4,
        ampEnv: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.04 }
      },
      {
        ...defaultLayer('D', 'Wood Click', 'texture', 'sample'),
        noiseType: 'sub_transient',
        volume: 0.5,
        ampEnv: { attack: 0.001, decay: 0.015, sustain: 0, release: 0.015 }
      }
    ]
  },

  // 19. DARK CINEMATIC VOID
  {
    id: 'dark_cinematic_void',
    name: 'Dark Cinematic Void',
    author: 'Trailer Labs',
    category: 'Chord',
    genres: ['Cinematic', 'Ambient', 'Experimental', 'Drill'],
    moods: ['Dark', 'Ominous', 'Wide', 'Epic'],
    description: 'Terrifying subterranean minor cluster chord pad with slow pitch modulation, comb resonance, and massive reverb tail.',
    soundExplainer: 'Odd harmonic intervals with comb filtering create inharmonic dissonances characteristic of modern psychological thriller soundtracks.',
    cpuRating: 'Medium',
    tags: ['Cinematic', 'Dark', 'Minor Chord', 'Cluster', 'Atmospheric'],
    polyphony: 6,
    glide: 0.1,
    monoLegato: false,
    pitchBendRange: 7,
    macros: { ...defaultMacros(), dark: 0.85, space: 0.8, drive: 0.45, bright: 0.25 },
    masterFX: defaultMasterFX(),
    arpeggiator: defaultArp(),
    motion: { ...defaultMotion(), mode: 'spiral', intensity: 0.55 },
    musicalContext: { ...defaultMusicalContext(), scale: 'Harmonic Minor', chordQuality: 'Diminished' },
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Saw Cluster', 'body', 'analog'),
        analogWave: 'saw',
        unisonVoices: 3,
        unisonDetune: 0.2,
        volume: 0.75,
        filterA: { enabled: true, type: 'lp24', cutoff: 1600, resonance: 3.0, drive: 0.35, keyTrack: 0.6, envAmount: 0.4 },
        ampEnv: { attack: 0.6, decay: 2.0, sustain: 0.7, release: 2.5 }
      },
      {
        ...defaultLayer('B', 'Metallic Comb Voice', 'character', 'wavetable'),
        wavetableId: 'metallic_comb',
        wavetablePos: 0.5,
        volume: 0.6,
        ampEnv: { attack: 0.8, decay: 2.5, sustain: 0.65, release: 2.8 }
      },
      {
        ...defaultLayer('C', 'Sub Undercurrent', 'sub', 'analog'),
        analogWave: 'sine',
        octave: -1,
        volume: 0.8,
        ampEnv: { attack: 0.4, decay: 1.8, sustain: 0.8, release: 2.0 }
      },
      {
        ...defaultLayer('D', 'Dust Texture', 'texture', 'sample'),
        noiseType: 'vinyl_crackle',
        volume: 0.25,
        ampEnv: { attack: 0.2, decay: 1.5, sustain: 0.4, release: 1.5 }
      }
    ]
  },

  // 20. EUCLIDEAN STARLIGHT ARP
  {
    id: 'euclidean_starlight_arp',
    name: 'Euclidean Starlight Arp',
    author: 'Stellar Pulse',
    category: 'Arp',
    genres: ['Ambient', 'Future Bass', 'Pop', 'Melodic House'],
    moods: ['Bright', 'Ethereal', 'Rhythmic', 'Hypnotic'],
    description: 'Polyrhythmic sparkling arpeggios bouncing across octave registers with crystalline bell shimmer.',
    soundExplainer: 'Spectral Bell wavetable arpeggiated across 3 octaves with dynamic velocity accents. A ping-pong delay timed to dotted 8ths creates intricate polyrhythmic counterpoints.',
    cpuRating: 'Low',
    tags: ['Arp', 'Euclidean', 'Starlight', 'Polyrhythm', 'Sparkling'],
    polyphony: 8,
    glide: 0,
    monoLegato: false,
    pitchBendRange: 2,
    macros: { ...defaultMacros(), bright: 0.8, space: 0.65, motion: 0.75, width: 0.7 },
    masterFX: {
      ...defaultMasterFX(),
      delay: { enabled: true, timeL: 0.25, timeR: 0.375, sync: true, division: '1/8d', feedback: 0.45, damping: 0.2, pingPong: true, mix: 0.4 },
      reverb: { enabled: true, decay: 3.2, size: 0.75, damping: 0.25, shimmer: 0.4, preDelay: 0.02, mix: 0.35 }
    },
    arpeggiator: {
      ...defaultArp(),
      enabled: true,
      mode: 'random',
      rate: '1/16',
      octaves: 3,
      bpm: 124
    },
    motion: { ...defaultMotion(), mode: 'pulse', rate: '1/8', intensity: 0.6 },
    musicalContext: { ...defaultMusicalContext(), scale: 'Major Pentatonic' },
    modulationRoutes: [],
    layers: [
      {
        ...defaultLayer('A', 'Digital Bell Core', 'body', 'wavetable'),
        wavetableId: 'digital_glass',
        wavetablePos: 0.35,
        volume: 0.8,
        filterA: { enabled: true, type: 'lp24', cutoff: 4500, resonance: 2.2, drive: 0.15, keyTrack: 0.7, envAmount: 0.5 },
        ampEnv: { attack: 0.003, decay: 0.35, sustain: 0.05, release: 0.25 }
      },
      {
        ...defaultLayer('B', 'Spectral Sparkle', 'character', 'spectral'),
        harmonicCount: 16,
        harmonicTilt: 0.3,
        volume: 0.55,
        octave: 1,
        ampEnv: { attack: 0.005, decay: 0.28, sustain: 0.02, release: 0.2 }
      },
      {
        ...defaultLayer('C', 'Analog Pluck Body', 'sub', 'analog'),
        analogWave: 'triangle',
        volume: 0.5,
        ampEnv: { attack: 0.005, decay: 0.3, sustain: 0.05, release: 0.2 }
      },
      {
        ...defaultLayer('D', 'Off', 'texture', 'analog'),
        enabled: false,
        volume: 0
      }
    ]
  }
];

export const PRESET_CATEGORIES = ['All', 'Bass', 'Lead', 'Pad', 'Keys', 'Pluck', 'Chord', 'Arp', 'Texture', 'FX'] as const;

export const PRESET_GENRES = [
  'All',
  'Hip-Hop',
  'Trap',
  'Drill',
  'R&B',
  'Afrobeats',
  'House',
  'Tech House',
  'Techno',
  'EDM',
  'Future Bass',
  'Drum & Bass',
  'Pop',
  'Cinematic',
  'Ambient',
  'Experimental'
] as const;
