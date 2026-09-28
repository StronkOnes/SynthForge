import { SynthPreset } from '../../types/synth';
import { buildPreset } from './presetBuilder';

export const KEY_PRESETS: SynthPreset[] = [
  buildPreset({
    id: 'neo_soul_lofi_rhodes',
    name: 'Neo-Soul Lo-Fi Rhodes',
    category: 'Keys',
    genres: ['R&B', 'Hip-Hop', 'Neo-Soul', 'Pop'],
    moods: ['Warm', 'Vintage', 'Organic', 'Nostalgic'],
    description: 'Velvety electric piano with FM tines, subtle pitch flutter, tape saturation, and authentic mechanical release noise.',
    soundExplainer: 'Uses FM synthesis with 1:1 ratio for warm bell tines, coupled with Liquid Sine wavetable for fundamental warmth.',
    tags: ['Rhodes', 'Electric Piano', 'Lo-Fi', 'Warm', 'Neo-Soul'],
    polyphony: 8,
    layers: [
      { engine: 'fm', fmRatio: 1.0, fmDepth: 0.45, fmFeedback: 0.15, volume: 0.8 },
      { engine: 'wavetable', wavetableId: 'liquid_sine', wavetablePos: 0.2, volume: 0.7 },
      { engine: 'analog', analogWave: 'triangle', octave: -1, volume: 0.35 },
      { engine: 'sample', noiseType: 'vinyl_crackle', volume: 0.25 }
    ]
  }),
  buildPreset({
    id: 'crystal_fm_tines',
    name: 'Crystal FM Tines',
    category: 'Keys',
    genres: ['Pop', 'R&B', 'Ballad', 'Ambient'],
    moods: ['Bright', 'Nostalgic', 'Pristine', 'Emotional'],
    description: 'Iconic 80s glass electric piano with shimmering metallic tines and lush chorus spread.',
    soundExplainer: 'Dual operator FM synthesis with 3.5x harmonic ratio for high metallic ring. Stereo chorus adds depth.',
    tags: ['FM', 'Tines', '80s', 'Electric Piano', 'DX7'],
    polyphony: 8,
    layers: [
      { engine: 'fm', fmRatio: 3.5, fmDepth: 0.5, fmFeedback: 0.2, volume: 0.85 },
      { engine: 'wavetable', wavetableId: 'liquid_sine', wavetablePos: 0.3, volume: 0.7 },
      { engine: 'spectral', harmonicCount: 16, harmonicTilt: 0.2, volume: 0.4, octave: 1 },
      { enabled: false }
    ]
  }),
  buildPreset({
    id: 'm1_house_organ_keys',
    name: '90s M1 House Organ',
    category: 'Keys',
    genres: ['House', 'Garage', 'Pop', 'Dance'],
    moods: ['Punchy', 'Bright', 'Funky', 'Classic'],
    description: 'The definitive 90s deep house organ key with hollow percussive harmonic click and short decay bounce.',
    soundExplainer: 'Tonewheel drawbar harmonic series with instant attack click envelope through parallel bandpass EQ.',
    tags: ['Organ', 'House', 'M1', '90s', 'Punchy'],
    polyphony: 8,
    layers: [
      { engine: 'wavetable', wavetableId: 'liquid_sine', wavetablePos: 0.7, volume: 0.85 },
      { engine: 'analog', analogWave: 'square', volume: 0.6 },
      { engine: 'sample', noiseType: 'sub_transient', volume: 0.45 },
      { enabled: false }
    ]
  }),
  buildPreset({
    id: 'lofi_tape_felt_piano',
    name: 'Lo-Fi Felt Tape Piano',
    category: 'Keys',
    genres: ['Lo-Fi', 'Hip-Hop', 'Chillhop', 'Ambient'],
    moods: ['Warm', 'Intimate', 'Nostalgic', 'Soft'],
    description: 'Muffled intimate felt piano with acoustic hammer release, wow/flutter pitch drift, and vinyl crackle warmth.',
    soundExplainer: 'Softened triangular fundamental filtered at 1800Hz with subtle pitch drift and authentic mechanical noise.',
    tags: ['Felt Piano', 'Lo-Fi', 'Intimate', 'Tape', 'Chillhop'],
    polyphony: 8,
    layers: [
      { engine: 'analog', analogWave: 'triangle', volume: 0.9 },
      { engine: 'wavetable', wavetableId: 'liquid_sine', wavetablePos: 0.1, volume: 0.6 },
      { engine: 'sample', noiseType: 'sub_transient', volume: 0.3 },
      { engine: 'sample', noiseType: 'vinyl_crackle', volume: 0.3 }
    ]
  }),
  // 36 additional keys:
  ...Array.from({ length: 36 }, (_, i) => {
    const keyTypes = [
      { name: 'Vintage Wurlitzer Suitcase', eng: 'fm', wt: 'liquid_sine', desc: 'Barking reed electric piano' },
      { name: 'Glass Harpsichord Tines', eng: 'wavetable', wt: 'digital_glass', desc: 'Plucked digital glass keyboard' },
      { name: 'Dark Trap Bell Piano', eng: 'spectral', wt: 'spectral_bell', desc: 'Minor ominous trap melody keys' },
      { name: 'Cyber Clavinet Funk', eng: 'analog', wt: 'cyber_saw', desc: 'Funky percussive synth clavinet' },
      { name: 'Lo-Fi Electric Tines', eng: 'fm', wt: 'liquid_sine', desc: 'Mellow chorus R&B electric keys' },
      { name: 'Afrobeats Marimba Keys', eng: 'wavetable', wt: 'spectral_bell', desc: 'Warm woody melodic percussion keys' }
    ];
    const item = keyTypes[i % keyTypes.length];
    return buildPreset({
      id: `key_${i + 5}`,
      name: `${item.name} ${Math.floor(i / keyTypes.length) + 1}`,
      category: 'Keys',
      genres: ['R&B', 'Hip-Hop', 'Pop', 'House', 'Lo-Fi'][i % 5] ? [['R&B', 'Hip-Hop', 'Pop', 'House', 'Lo-Fi'][i % 5]] : ['Keys'],
      moods: ['Warm', 'Vintage', 'Bright', 'Organic'][i % 4] ? [['Warm', 'Vintage', 'Bright', 'Organic'][i % 4]] : ['Melodic'],
      description: `${item.desc} (Keys Bank Preset ${i + 5})`,
      soundExplainer: `Acoustic and FM hybrid synthesis optimized for dynamic chord progressions and melodic leads.`,
      tags: ['Keys', 'Electric Piano', 'Chords', item.name.split(' ')[0]],
      polyphony: 8,
      layers: [
        { engine: item.eng as any, analogWave: 'triangle', wavetableId: item.wt, wavetablePos: 0.2 + (i * 0.02) % 0.6, volume: 0.8 },
        { engine: 'wavetable', wavetableId: item.wt, wavetablePos: 0.3, octave: 1, volume: 0.5 },
        { engine: 'analog', analogWave: 'sine', octave: -1, volume: 0.4 },
        { engine: 'sample', noiseType: 'vinyl_crackle', volume: 0.2 }
      ]
    });
  })
];
