import { SynthPreset } from '../../types/synth';
import { buildPreset } from './presetBuilder';

export const PAD_PRESETS: SynthPreset[] = [
  buildPreset({
    id: 'cosmic_aurora_pad',
    name: 'Cosmic Aurora Pad',
    category: 'Pad',
    genres: ['Ambient', 'Cinematic', 'Future Bass', 'R&B'],
    moods: ['Ethereal', 'Warm', 'Deep', 'Evolving'],
    description: 'Enormous ambient dreamscape pad with slow undulating spectral harmonics and a cathedral shimmer reverb.',
    soundExplainer: 'Layer B runs the Spectral Engine with odd/even harmonic balancing, while Layer C runs a slow-evolving vocal formant wavetable.',
    tags: ['Pad', 'Ambient', 'Lush', 'Slow Attack', 'Evolving'],
    polyphony: 8,
    layers: [
      { engine: 'analog', analogWave: 'sine', octave: -1, volume: 0.5 },
      { engine: 'spectral', harmonicCount: 24, harmonicTilt: -0.2, oddEvenBalance: 0.3, volume: 0.7 },
      { engine: 'wavetable', wavetableId: 'vocal_formant', wavetablePos: 0.35, octave: 1, volume: 0.55 },
      { engine: 'sample', noiseType: 'vinyl_crackle', volume: 0.2 }
    ]
  }),
  buildPreset({
    id: 'ethereal_glass_choir',
    name: 'Ethereal Glass Choir',
    category: 'Pad',
    genres: ['Cinematic', 'Ambient', 'Future Bass', 'Pop'],
    moods: ['Ethereal', 'Warm', 'Emotional', 'Majestic'],
    description: 'Angelic vocal choir pad layered with crystalline glass formants and infinite sustain.',
    soundExplainer: 'Layer A & B blend human vocal formants with crystalline spectral bell harmonics. Slow attack envelope.',
    tags: ['Choir', 'Vocal', 'Pad', 'Ambient', 'Cinematic'],
    polyphony: 8,
    layers: [
      { engine: 'wavetable', wavetableId: 'vocal_formant', wavetablePos: 0.4, volume: 0.8 },
      { engine: 'spectral', harmonicCount: 24, harmonicTilt: 0.1, volume: 0.6, octave: 1 },
      { engine: 'analog', analogWave: 'sine', octave: -1, volume: 0.45 },
      { engine: 'sample', noiseType: 'tape_hiss', volume: 0.2 }
    ]
  }),
  buildPreset({
    id: 'velvet_tape_drift',
    name: 'Velvet Tape Drift',
    category: 'Pad',
    genres: ['Lo-Fi', 'Hip-Hop', 'Neo-Soul', 'Ambient'],
    moods: ['Warm', 'Nostalgic', 'Drifting', 'Soft'],
    description: 'Drifting tape-worn synth pad with subtle wow & flutter pitch wobble, rolled-off warmth, and vinyl dust.',
    soundExplainer: 'Virtual analog saw and triangle oscillators gently detuned with LFO 1 applying subtle micro-pitch drift.',
    tags: ['Lo-Fi', 'Tape', 'Drift', 'Warm', 'Pad'],
    polyphony: 8,
    layers: [
      { engine: 'analog', analogWave: 'saw', volume: 0.75 },
      { engine: 'wavetable', wavetableId: 'liquid_sine', wavetablePos: 0.3, octave: 1, volume: 0.5 },
      { engine: 'analog', analogWave: 'sine', octave: -1, volume: 0.6 },
      { engine: 'sample', noiseType: 'vinyl_crackle', volume: 0.35 }
    ]
  }),
  buildPreset({
    id: 'celestial_horizon_pad',
    name: 'Celestial Horizon Pad',
    category: 'Pad',
    genres: ['Ambient', 'Cinematic', 'Trance'],
    moods: ['Ethereal', 'Wide', 'Bright', 'Majestic'],
    description: 'Expansive sci-fi pad with multi-octave supersaw breath and 10-second cathedral shimmer decay.',
    soundExplainer: 'Combines supersaw unison with digital glass bell overtones into stereo chorus and algorithmic reverb.',
    tags: ['Pad', 'Celestial', 'Horizon', 'Cathedral', 'Shimmer'],
    polyphony: 8,
    layers: [
      { engine: 'analog', analogWave: 'supersaw', unisonVoices: 6, unisonDetune: 0.3, volume: 0.8 },
      { engine: 'wavetable', wavetableId: 'digital_glass', wavetablePos: 0.4, octave: 1, volume: 0.6 },
      { engine: 'analog', analogWave: 'sine', octave: -1, volume: 0.5 },
      { engine: 'sample', noiseType: 'tape_hiss', volume: 0.15 }
    ]
  }),
  buildPreset({
    id: 'warm_analog_juno_pad',
    name: 'Warm Analog Juno Pad',
    category: 'Pad',
    genres: ['Synthwave', 'Pop', 'R&B', 'House'],
    moods: ['Warm', 'Vintage', 'Nostalgic', 'Wide'],
    description: 'Classic 80s chorus pad modeled after the Roland Juno-60 with lush stereo chorus swirl and rich sub.',
    soundExplainer: 'Dual saw and sub-square oscillators through warm 24dB lowpass with authentic stereo bucket-brigade chorus.',
    tags: ['Juno', 'Analog', 'Chorus', 'Vintage', 'Warm'],
    polyphony: 8,
    layers: [
      { engine: 'analog', analogWave: 'saw', volume: 0.8 },
      { engine: 'analog', analogWave: 'square', octave: -1, volume: 0.6 },
      { engine: 'wavetable', wavetableId: 'liquid_sine', wavetablePos: 0.2, volume: 0.4 },
      { engine: 'sample', noiseType: 'tape_hiss', volume: 0.1 }
    ]
  }),
  // 40 additional pads:
  ...Array.from({ length: 40 }, (_, i) => {
    const padTypes = [
      { name: 'Deep Space Drone Pad', wt: 'metallic_comb', eng: 'wavetable', desc: 'Hypnotic interstellar evolving drone pad' },
      { name: 'Neo-Soul Warm Velvet', wt: 'liquid_sine', eng: 'analog', desc: 'Lush chord pad for R&B and lo-fi' },
      { name: 'Shimmering Dream Choir', wt: 'vocal_formant', eng: 'wavetable', desc: 'Heavenly vocal shimmer pad' },
      { name: 'Crystalline Glass Horizon', wt: 'digital_glass', eng: 'spectral', desc: 'Pristine digital bell atmosphere' },
      { name: 'Dark Cinematic Ambient', wt: 'dirty_reese', eng: 'wavetable', desc: 'Heavy ominous cinematic drone pad' },
      { name: 'Blade Runner Nostalgia', wt: 'cyber_saw', eng: 'analog', desc: 'Emotional CS-80 style brassy pad' },
      { name: 'Underwater Oceanic Pad', wt: 'liquid_sine', eng: 'wavetable', desc: 'Muffled aquatic ambient texture' },
      { name: 'Evolving Solar Flare', wt: 'spectral_bell', eng: 'spectral', desc: 'Warm solar wind harmonic pad' }
    ];
    const item = padTypes[i % padTypes.length];
    return buildPreset({
      id: `pad_${i + 6}`,
      name: `${item.name} ${Math.floor(i / padTypes.length) + 1}`,
      category: 'Pad',
      genres: ['Ambient', 'Cinematic', 'Lo-Fi', 'R&B', 'Pop'][i % 5] ? [['Ambient', 'Cinematic', 'Lo-Fi', 'R&B', 'Pop'][i % 5]] : ['Ambient'],
      moods: ['Ethereal', 'Warm', 'Dark', 'Emotional'][i % 4] ? [['Ethereal', 'Warm', 'Dark', 'Emotional'][i % 4]] : ['Lush'],
      description: `${item.desc} (Pad Bank Preset ${i + 6})`,
      soundExplainer: `Richly textured multi-layer pad with slow ADSR envelopes and lush master spatial processing.`,
      tags: ['Pad', 'Atmosphere', 'Lush', item.name.split(' ')[0]],
      polyphony: 8,
      layers: [
        { engine: item.eng as any, analogWave: 'saw', wavetableId: item.wt, wavetablePos: 0.15 + (i * 0.02) % 0.7, volume: 0.75 },
        { engine: 'wavetable', wavetableId: item.wt, wavetablePos: 0.35, octave: 1, volume: 0.55 },
        { engine: 'analog', analogWave: 'sine', octave: -1, volume: 0.45 },
        { engine: 'sample', noiseType: 'vinyl_crackle', volume: 0.2 }
      ]
    });
  })
];
