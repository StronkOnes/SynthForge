import { SynthPreset } from '../../types/synth';
import { buildPreset } from './presetBuilder';

export const ARP_PRESETS: SynthPreset[] = [
  buildPreset({
    id: 'driving_cyberpunk_arp',
    name: 'Driving Cyberpunk Pulse',
    category: 'Arp',
    genres: ['Tech House', 'Techno', 'Cinematic', 'EDM'],
    moods: ['Rhythmic', 'Driving', 'Dark', 'Aggressive'],
    description: 'Hypnotic 16th-note driving sequencer bassline with ratchets, opening comb filter, and industrial punch.',
    soundExplainer: 'The 16-step sequencer triggers accented 16th notes with step ratchets on beat 4.',
    tags: ['Arp', 'Sequencer', 'Cyberpunk', 'Techno', '16th Notes'],
    polyphony: 4,
    arpeggiator: {
      enabled: true,
      mode: 'up_down',
      rate: '1/16',
      bpm: 128
    },
    layers: [
      { engine: 'analog', analogWave: 'saw', octave: -1, volume: 0.85 },
      { engine: 'analog', analogWave: 'triangle', octave: -2, volume: 0.8 },
      { engine: 'fm', fmRatio: 4.0, fmDepth: 0.5, volume: 0.45 },
      { enabled: false }
    ]
  }),
  buildPreset({
    id: 'euclidean_starlight_arp',
    name: 'Euclidean Starlight Arp',
    category: 'Arp',
    genres: ['Ambient', 'Future Bass', 'Pop', 'Melodic House'],
    moods: ['Bright', 'Ethereal', 'Rhythmic', 'Hypnotic'],
    description: 'Polyrhythmic sparkling arpeggios bouncing across octave registers with crystalline bell shimmer.',
    soundExplainer: 'Spectral Bell wavetable arpeggiated across 3 octaves with dynamic velocity accents.',
    tags: ['Arp', 'Euclidean', 'Starlight', 'Polyrhythm', 'Sparkling'],
    polyphony: 8,
    arpeggiator: {
      enabled: true,
      mode: 'random',
      rate: '1/16',
      octaves: 3,
      bpm: 124
    },
    layers: [
      { engine: 'wavetable', wavetableId: 'digital_glass', wavetablePos: 0.35, volume: 0.8 },
      { engine: 'spectral', harmonicCount: 16, harmonicTilt: 0.3, volume: 0.55, octave: 1 },
      { engine: 'analog', analogWave: 'triangle', volume: 0.5 },
      { enabled: false }
    ]
  }),
  // 33 additional arp presets:
  ...Array.from({ length: 33 }, (_, i) => {
    const arpTypes = [
      { name: 'Hypnotic Acid Sequence', eng: 'wavetable', wt: 'acid_grit', desc: 'Resonant 303 acid sequence pattern' },
      { name: 'Berlin Minimal Techno Arp', eng: 'analog', wt: 'cyber_saw', desc: 'Dark repetitive industrial techno pulse' },
      { name: 'Neo-Trance Anthem Sequence', eng: 'analog', wt: 'cyber_saw', desc: 'Uplifting octave-jumping festival sequence' },
      { name: 'Afro Melodic Kalimba Arp', eng: 'wavetable', wt: 'spectral_bell', desc: 'Rhythmic organic melodic house arp' },
      { name: 'Retro 80s Stranger Sequence', eng: 'analog', wt: 'cyber_saw', desc: 'Synthwave rolling bass sequencer' },
      { name: 'Glass Bells Polyrhythm', eng: 'spectral', wt: 'digital_glass', desc: 'Sparkling inharmonic bell arpeggio' }
    ];
    const item = arpTypes[i % arpTypes.length];
    return buildPreset({
      id: `arp_${i + 3}`,
      name: `${item.name} ${Math.floor(i / arpTypes.length) + 1}`,
      category: 'Arp',
      genres: ['Techno', 'House', 'Synthwave', 'EDM', 'Ambient'][i % 5] ? [['Techno', 'House', 'Synthwave', 'EDM', 'Ambient'][i % 5]] : ['Arp'],
      moods: ['Rhythmic', 'Driving', 'Hypnotic', 'Bright'][i % 4] ? [['Rhythmic', 'Driving', 'Hypnotic', 'Bright'][i % 4]] : ['Sequenced'],
      description: `${item.desc} (Arp Bank Preset ${i + 3})`,
      soundExplainer: `Pre-configured 16-step rhythmic pattern with dynamic velocities and filter automation.`,
      tags: ['Arp', 'Sequencer', 'Rhythm', item.name.split(' ')[0]],
      polyphony: 4,
      arpeggiator: {
        enabled: true,
        mode: ['up', 'down', 'up_down', 'random'][i % 4] as any,
        rate: '1/16',
        bpm: 124 + (i % 8) * 2,
        octaves: (i % 3) + 1
      },
      layers: [
        { engine: item.eng as any, analogWave: 'saw', wavetableId: item.wt, wavetablePos: 0.2 + (i * 0.02) % 0.6, volume: 0.8 },
        { engine: 'wavetable', wavetableId: item.wt, wavetablePos: 0.35, octave: 1, volume: 0.5 },
        { engine: 'analog', analogWave: 'sine', octave: -1, volume: 0.5 },
        { engine: 'sample', noiseType: 'sub_transient', volume: 0.3 }
      ]
    });
  })
];
