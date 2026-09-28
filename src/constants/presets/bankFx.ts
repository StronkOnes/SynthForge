import { SynthPreset } from '../../types/synth';
import { buildPreset } from './presetBuilder';

export const FX_PRESETS: SynthPreset[] = [
  buildPreset({
    id: 'industrial_impact_riser',
    name: 'Industrial Impact Riser',
    category: 'FX',
    genres: ['Cinematic', 'EDM', 'Dubstep', 'Trap'],
    moods: ['Aggressive', 'Tense', 'Epic', 'Industrial'],
    description: 'Catastrophic cinematic drop riser with accelerating pitch bend, white noise sweep, and metallic sub impact.',
    soundExplainer: 'Modulation envelope continuously sweeps oscillator pitch upward over 4 bars while filter cutoff opens.',
    tags: ['FX', 'Riser', 'Impact', 'Cinematic', 'Build'],
    polyphony: 4,
    layers: [
      { engine: 'sample', noiseType: 'white', volume: 0.85 },
      { engine: 'wavetable', wavetableId: 'cyber_saw', wavetablePos: 0.8, volume: 0.75 },
      { engine: 'wavetable', wavetableId: 'metallic_comb', wavetablePos: 0.6, octave: 1, volume: 0.6 },
      { engine: 'analog', analogWave: 'sine', octave: -2, volume: 0.7 }
    ]
  }),
  buildPreset({
    id: 'deep_sub_drop_boom',
    name: 'Sub Zero Drop Boom',
    category: 'FX',
    genres: ['Trap', 'Dubstep', 'Cinematic', 'Hip-Hop'],
    moods: ['Deep', 'Heavy', 'Epic'],
    description: 'Chest-caving sub boom down-sweep designed for transition drops and cinematic impacts.',
    soundExplainer: 'Fast downward exponential pitch envelope from 180Hz down to 28Hz through soft clipping saturation.',
    tags: ['Sub Drop', 'Boom', 'Impact', 'Transition', '808 Drop'],
    polyphony: 1,
    layers: [
      { engine: 'analog', analogWave: 'sine', octave: -2, volume: 1.0 },
      { engine: 'analog', analogWave: 'triangle', octave: -2, volume: 0.5 },
      { engine: 'sample', noiseType: 'sub_transient', volume: 0.6 },
      { enabled: false }
    ]
  }),
  // 28 additional texture and FX presets:
  ...Array.from({ length: 28 }, (_, i) => {
    const fxTypes = [
      { name: 'White Noise Filter Sweep', eng: 'sample', wt: 'cyber_saw', desc: '4-bar tension-building riser noise' },
      { name: 'Stargate Warp Glitch', eng: 'wavetable', wt: 'metallic_comb', desc: 'Sci-fi hyperdrive transition effect' },
      { name: 'Dark Subterranean Impact', eng: 'analog', wt: 'dirty_reese', desc: 'Heavy cinematic trailer thud' },
      { name: 'Analog Tape Wind Down', eng: 'wavetable', wt: 'liquid_sine', desc: 'Vinyl stop pitch-drop slowdown' },
      { name: 'Metallic Cyber Alarm', eng: 'fm', wt: 'metallic_comb', desc: 'Dystopian futuristic warning siren' },
      { name: 'Cosmic Radio Dust', eng: 'sample', wt: 'digital_glass', desc: 'Atmospheric satellite transmission hiss' }
    ];
    const item = fxTypes[i % fxTypes.length];
    return buildPreset({
      id: `fx_${i + 3}`,
      name: `${item.name} ${Math.floor(i / fxTypes.length) + 1}`,
      category: i % 2 === 0 ? 'FX' : 'Texture',
      genres: ['Cinematic', 'EDM', 'Trap', 'Dubstep', 'Ambient'][i % 5] ? [['Cinematic', 'EDM', 'Trap', 'Dubstep', 'Ambient'][i % 5]] : ['FX'],
      moods: ['Tense', 'Epic', 'Aggressive', 'Atmospheric'][i % 4] ? [['Tense', 'Epic', 'Aggressive', 'Atmospheric'][i % 4]] : ['Futuristic'],
      description: `${item.desc} (FX Bank Preset ${i + 3})`,
      soundExplainer: `Custom non-harmonic sound design engineered for cinematic transitions, build-ups, and atmospheric depth.`,
      tags: ['FX', 'Transition', 'Atmosphere', item.name.split(' ')[0]],
      polyphony: 4,
      layers: [
        { engine: item.eng as any, analogWave: 'saw', wavetableId: item.wt, wavetablePos: 0.3 + (i * 0.02) % 0.6, volume: 0.8 },
        { engine: 'wavetable', wavetableId: item.wt, wavetablePos: 0.5, octave: 1, volume: 0.6 },
        { engine: 'analog', analogWave: 'sine', octave: -2, volume: 0.5 },
        { engine: 'sample', noiseType: 'vinyl_crackle', volume: 0.3 }
      ]
    });
  })
];
