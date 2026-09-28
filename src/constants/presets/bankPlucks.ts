import { SynthPreset } from '../../types/synth';
import { buildPreset } from './presetBuilder';

export const PLUCK_PRESETS: SynthPreset[] = [
  buildPreset({
    id: 'future_bass_hyperpluck',
    name: 'Future Bass Hyperpluck',
    category: 'Pluck',
    genres: ['Future Bass', 'EDM', 'Pop', 'Melodic House'],
    moods: ['Punchy', 'Bright', 'Euphoric', 'Wide'],
    description: 'Instant-punch supersaw pluck with crisp transient snap, opening filter sweep, and tempo-synced ping-pong bounce.',
    soundExplainer: 'Combines an 8-voice detuned supersaw with an aggressive wavetable pluck. Rapid decay envelope.',
    tags: ['Pluck', 'Future Bass', 'Punchy', 'EDM', 'Supersaw'],
    polyphony: 8,
    layers: [
      { engine: 'analog', analogWave: 'supersaw', unisonVoices: 7, unisonDetune: 0.32, stereoSpread: 0.9, volume: 0.85 },
      { engine: 'wavetable', wavetableId: 'cyber_saw', wavetablePos: 0.5, octave: 1, volume: 0.6 },
      { engine: 'analog', analogWave: 'sine', octave: -1, volume: 0.6 },
      { engine: 'sample', noiseType: 'sub_transient', volume: 0.45 }
    ]
  }),
  buildPreset({
    id: 'tokyo_night_koto_pluck',
    name: 'Tokyo Night Koto Pluck',
    category: 'Pluck',
    genres: ['Trap', 'Hip-Hop', 'Pop', 'Cinematic'],
    moods: ['Organic', 'Mystical', 'Bright', 'Punchy'],
    description: 'Crisp Japanese string-inspired synth pluck tuned for trap beats and emotive melodic hooks.',
    soundExplainer: 'Spectral Engine isolates odd harmonic ratios to simulate struck silk strings.',
    tags: ['Pluck', 'Koto', 'Asian', 'Trap', 'Melodic'],
    polyphony: 8,
    layers: [
      { engine: 'spectral', harmonicCount: 20, harmonicTilt: -0.3, oddEvenBalance: -0.6, volume: 0.8 },
      { engine: 'wavetable', wavetableId: 'spectral_bell', wavetablePos: 0.25, octave: 1, volume: 0.6 },
      { engine: 'analog', analogWave: 'triangle', volume: 0.5 },
      { engine: 'sample', noiseType: 'sub_transient', volume: 0.4 }
    ]
  }),
  buildPreset({
    id: 'melodic_house_zap',
    name: 'Melodic House Zap',
    category: 'Pluck',
    genres: ['House', 'Melodic House', 'Afro House', 'Deep House'],
    moods: ['Organic', 'Hypnotic', 'Warm', 'Rhythmic'],
    description: 'Bouncy afro-melodic house pluck with wooden attack transient, analog warmth, and warm ping-pong delay bounce.',
    soundExplainer: 'Short decay triangle oscillator layered with an organic transient click. Resonant 24dB lowpass snap.',
    tags: ['Pluck', 'Melodic House', 'Afro House', 'Organic', 'Zap'],
    polyphony: 8,
    layers: [
      { engine: 'analog', analogWave: 'triangle', volume: 0.85 },
      { engine: 'wavetable', wavetableId: 'liquid_sine', wavetablePos: 0.1, octave: -1, volume: 0.6 },
      { engine: 'fm', fmRatio: 3.0, fmDepth: 0.4, volume: 0.4 },
      { engine: 'sample', noiseType: 'sub_transient', volume: 0.5 }
    ]
  }),
  buildPreset({
    id: 'trap_pizzicato_pluck',
    name: 'Trap Pizzicato Pluck',
    category: 'Pluck',
    genres: ['Trap', 'Hip-Hop', 'Drill'],
    moods: ['Dark', 'Punchy', 'Tense'],
    description: 'Sharp orchestral-style pizzicato string pluck with dark resonant cutoff and fast decay designed for trap leads.',
    soundExplainer: 'Fast attack and tight decay envelope on a narrow pulse wave with initial high-frequency transient click.',
    tags: ['Pizzicato', 'Trap', 'Orchestral', 'Short', 'Pluck'],
    polyphony: 8,
    layers: [
      { engine: 'analog', analogWave: 'saw', volume: 0.85 },
      { engine: 'wavetable', wavetableId: 'spectral_bell', wavetablePos: 0.3, volume: 0.55 },
      { engine: 'sample', noiseType: 'sub_transient', volume: 0.6 },
      { enabled: false }
    ]
  }),
  // 36 additional plucks:
  ...Array.from({ length: 36 }, (_, i) => {
    const pluckTypes = [
      { name: 'Afrobeat Wooden Kalimba', eng: 'wavetable', wt: 'spectral_bell', desc: 'Resonant African wooden thumb pluck' },
      { name: 'Trance Stadium Pluck', eng: 'analog', wt: 'cyber_saw', desc: 'Classic euphoric gated trance pluck' },
      { name: 'Lo-Fi Acoustic Synth Pluck', eng: 'spectral', wt: 'liquid_sine', desc: 'Mellow warm guitar-like pluck' },
      { name: 'Metallic Mallet Strike', eng: 'wavetable', wt: 'metallic_comb', desc: 'Industrial steel chime pluck' },
      { name: 'Deep Tech House Perc Pluck', eng: 'fm', wt: 'acid_grit', desc: 'Hollow percussive groove pluck' },
      { name: 'Cyberpunk Arp Pluck', eng: 'wavetable', wt: 'digital_glass', desc: 'High-speed tearing synthwave pluck' }
    ];
    const item = pluckTypes[i % pluckTypes.length];
    return buildPreset({
      id: `pluck_${i + 5}`,
      name: `${item.name} ${Math.floor(i / pluckTypes.length) + 1}`,
      category: 'Pluck',
      genres: ['House', 'Trap', 'Pop', 'EDM', 'Afrobeats'][i % 5] ? [['House', 'Trap', 'Pop', 'EDM', 'Afrobeats'][i % 5]] : ['Pluck'],
      moods: ['Punchy', 'Bright', 'Rhythmic', 'Organic'][i % 4] ? [['Punchy', 'Bright', 'Rhythmic', 'Organic'][i % 4]] : ['Catchy'],
      description: `${item.desc} (Pluck Bank Preset ${i + 5})`,
      soundExplainer: `Engineered with high transient punch and snappy envelope decay.`,
      tags: ['Pluck', 'Snappy', 'Short', item.name.split(' ')[0]],
      polyphony: 8,
      layers: [
        { engine: item.eng as any, analogWave: 'triangle', wavetableId: item.wt, wavetablePos: 0.15 + (i * 0.02) % 0.7, volume: 0.8 },
        { engine: 'wavetable', wavetableId: item.wt, wavetablePos: 0.4, octave: 1, volume: 0.5 },
        { engine: 'analog', analogWave: 'sine', octave: -1, volume: 0.4 },
        { engine: 'sample', noiseType: 'sub_transient', volume: 0.4 }
      ]
    });
  })
];
