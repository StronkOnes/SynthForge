import { SynthPreset } from '../../types/synth';
import { buildPreset } from './presetBuilder';

export const CHORD_PRESETS: SynthPreset[] = [
  buildPreset({
    id: 'lush_90s_house_stab',
    name: 'Lush 90s House Stabs',
    category: 'Chord',
    genres: ['House', 'Tech House', 'Afrobeats', 'Pop'],
    moods: ['Warm', 'Rhythmic', 'Punchy', 'Wide'],
    description: 'Authentic 90s classic garage house chord stab with rich minor 9th harmonic stacking and warm plate reverb.',
    soundExplainer: 'Harmonic spectral engine stacks minor 9th chord intervals directly within the voice architecture.',
    tags: ['House', 'Chord Stab', '90s', 'Garage', 'Warm'],
    polyphony: 8,
    layers: [
      { engine: 'analog', analogWave: 'square', volume: 0.8 },
      { engine: 'spectral', harmonicCount: 16, harmonicTilt: -0.15, volume: 0.65 },
      { engine: 'fm', fmRatio: 2.0, fmDepth: 0.3, volume: 0.35 },
      { engine: 'sample', noiseType: 'vinyl_crackle', volume: 0.2 }
    ]
  }),
  buildPreset({
    id: 'dark_cinematic_void',
    name: 'Dark Cinematic Void',
    category: 'Chord',
    genres: ['Cinematic', 'Ambient', 'Experimental', 'Drill'],
    moods: ['Dark', 'Ominous', 'Wide', 'Epic'],
    description: 'Terrifying subterranean minor cluster chord pad with slow pitch modulation, comb resonance, and massive reverb tail.',
    soundExplainer: 'Odd harmonic intervals with comb filtering create inharmonic dissonances characteristic of modern psychological thrillers.',
    tags: ['Cinematic', 'Dark', 'Minor Chord', 'Cluster', 'Atmospheric'],
    polyphony: 6,
    layers: [
      { engine: 'analog', analogWave: 'saw', unisonVoices: 3, unisonDetune: 0.2, volume: 0.75 },
      { engine: 'wavetable', wavetableId: 'metallic_comb', wavetablePos: 0.5, volume: 0.6 },
      { engine: 'analog', analogWave: 'sine', octave: -1, volume: 0.8 },
      { engine: 'sample', noiseType: 'vinyl_crackle', volume: 0.25 }
    ]
  }),
  buildPreset({
    id: 'dub_techno_echo_chord',
    name: 'Dub Techno Echo Chord',
    category: 'Chord',
    genres: ['Techno', 'Dub Techno', 'Deep House', 'Ambient'],
    moods: ['Deep', 'Hypnotic', 'Dark', 'Warm'],
    description: 'Classic Basic Channel style filtered minor chord stab drenched in tape delay feedback loops and plate reverb.',
    soundExplainer: 'Minor triad generated from detuned saw oscillators, heavily filtered through tape distortion and ping-pong delay.',
    tags: ['Dub Techno', 'Basic Channel', 'Chord', 'Delay', 'Echo'],
    polyphony: 8,
    layers: [
      { engine: 'analog', analogWave: 'saw', volume: 0.85 },
      { engine: 'analog', analogWave: 'square', octave: -1, volume: 0.6 },
      { engine: 'sample', noiseType: 'tape_hiss', volume: 0.3 },
      { enabled: false }
    ]
  }),
  // 32 additional chord presets:
  ...Array.from({ length: 32 }, (_, i) => {
    const chordTypes = [
      { name: 'Neo-Soul Minor 9th Cluster', eng: 'spectral', wt: 'liquid_sine', desc: 'Silky smooth jazz-r&b chord stab' },
      { name: 'Detroit Techno Prophet Chord', eng: 'analog', wt: 'cyber_saw', desc: 'Raw analog filtered minor techno stab' },
      { name: 'Future Bass Super Chord', eng: 'analog', wt: 'cyber_saw', desc: 'Huge wide detuned supersaw chord stack' },
      { name: 'R&B Velvet Minor Stab', eng: 'fm', wt: 'liquid_sine', desc: 'Mellow warm filtered 7th chord' },
      { name: 'Afro House Melodic Chord', eng: 'wavetable', wt: 'spectral_bell', desc: 'Spiritual uplifting afro melodic chord' },
      { name: 'Trap Dark Cluster Stab', eng: 'wavetable', wt: 'acid_grit', desc: 'Aggressive eerie minor trap stab' }
    ];
    const item = chordTypes[i % chordTypes.length];
    return buildPreset({
      id: `chord_${i + 4}`,
      name: `${item.name} ${Math.floor(i / chordTypes.length) + 1}`,
      category: 'Chord',
      genres: ['House', 'Techno', 'R&B', 'Future Bass', 'Trap'][i % 5] ? [['House', 'Techno', 'R&B', 'Future Bass', 'Trap'][i % 5]] : ['Chord'],
      moods: ['Warm', 'Punchy', 'Deep', 'Wide'][i % 4] ? [['Warm', 'Punchy', 'Deep', 'Wide'][i % 4]] : ['Harmonic'],
      description: `${item.desc} (Chord Bank Preset ${i + 4})`,
      soundExplainer: `Multi-harmonic voicing engineered to sit perfectly in rhythmic grooves and progressions.`,
      tags: ['Chord', 'Stab', 'Harmony', item.name.split(' ')[0]],
      polyphony: 8,
      layers: [
        { engine: item.eng as any, analogWave: 'saw', wavetableId: item.wt, wavetablePos: 0.2 + (i * 0.02) % 0.6, volume: 0.8 },
        { engine: 'wavetable', wavetableId: item.wt, wavetablePos: 0.35, octave: 1, volume: 0.55 },
        { engine: 'analog', analogWave: 'sine', octave: -1, volume: 0.5 },
        { engine: 'sample', noiseType: 'vinyl_crackle', volume: 0.2 }
      ]
    });
  })
];
