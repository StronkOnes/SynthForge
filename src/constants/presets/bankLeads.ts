import { SynthPreset } from '../../types/synth';
import { buildPreset } from './presetBuilder';

export const LEAD_PRESETS: SynthPreset[] = [
  buildPreset({
    id: 'neon_blade_lead',
    name: 'Neon Blade Lead',
    category: 'Lead',
    genres: ['Cinematic', 'Synthwave', 'EDM', 'Pop'],
    moods: ['Warm', 'Evolving', 'Epic', 'Wide'],
    description: 'Iconic cinematic polysynth lead with soaring unison detune, breathing filter modulation, and shimmering tail.',
    soundExplainer: 'Built from dual supersaw oscillators with 7 unison voices and subtle pitch drift. Ladder filter opens with velocity.',
    tags: ['Lead', 'Supersaw', 'Vangelis', 'Cinematic', 'Wide'],
    polyphony: 8,
    glide: 0.04,
    layers: [
      { engine: 'analog', analogWave: 'supersaw', unisonVoices: 5, unisonDetune: 0.28, stereoSpread: 0.8, volume: 0.75 },
      { engine: 'wavetable', wavetableId: 'cyber_saw', wavetablePos: 0.6, volume: 0.6, octave: 1 },
      { engine: 'fm', fmRatio: 3.0, fmDepth: 0.35, volume: 0.3, octave: 1 },
      { engine: 'sample', noiseType: 'tape_hiss', volume: 0.15 }
    ]
  }),
  buildPreset({
    id: 'formant_vocal_lead',
    name: 'Formant Vocal Talkbox',
    category: 'Lead',
    genres: ['Pop', 'R&B', 'Future Bass', 'Funk'],
    moods: ['Expressive', 'Bright', 'Organic', 'Funky'],
    description: 'Human-like talking vocal synthesizer lead with morphing vowels (A-E-I-O-U), pitch glide, and expressive vibrato.',
    soundExplainer: 'Layer B utilizes the Vocal Formant wavetable modulated via LFO 1 to scan vowel resonances. Portamento glide mimics human inflection.',
    tags: ['Vocal', 'Formant', 'Talkbox', 'Lead', 'Funk'],
    polyphony: 1,
    glide: 0.05,
    layers: [
      { engine: 'analog', analogWave: 'saw', volume: 0.7 },
      { engine: 'wavetable', wavetableId: 'vocal_formant', wavetablePos: 0.5, volume: 0.85 },
      { engine: 'analog', analogWave: 'sine', octave: -1, volume: 0.4 },
      { engine: 'sample', noiseType: 'tape_hiss', volume: 0.2 }
    ]
  }),
  buildPreset({
    id: 'hyper_saw_screamer',
    name: 'Hyper Saw Screamer',
    category: 'Lead',
    genres: ['EDM', 'Hardstyle', 'Trance', 'Future Bass'],
    moods: ['Aggressive', 'High Energy', 'Loud', 'Wide'],
    description: 'Massive multi-unison screamer lead engineered to cut through packed festival sound systems with maximum wall-of-sound energy.',
    soundExplainer: '8-voice unison supersaw running at max stereo spread paired with hard clipping distortion.',
    tags: ['Supersaw', 'Festival', 'EDM', 'Hardstyle', 'Lead'],
    polyphony: 6,
    layers: [
      { engine: 'analog', analogWave: 'supersaw', unisonVoices: 8, unisonDetune: 0.45, stereoSpread: 1.0, volume: 0.9 },
      { engine: 'wavetable', wavetableId: 'cyber_saw', wavetablePos: 0.75, octave: 1, volume: 0.7 },
      { engine: 'analog', analogWave: 'saw', octave: -1, volume: 0.6 },
      { enabled: false }
    ]
  }),
  buildPreset({
    id: 'west_coast_whine_lead',
    name: 'West Coast Whine Lead',
    category: 'Lead',
    genres: ['Hip-Hop', 'West Coast', 'Trap', 'Funk'],
    moods: ['High Energy', 'Piercing', 'Vintage'],
    description: 'Piercing high-sine theremin-like West Coast lead with rich vibrato, long portamento, and analog tape flutter.',
    soundExplainer: 'Single sine oscillator with LFO vibrato routed to pitch and portamento glide time at 120ms.',
    tags: ['Whine', 'West Coast', 'Dre', 'Sine Lead', 'Portamento'],
    polyphony: 1,
    glide: 0.12,
    layers: [
      { engine: 'analog', analogWave: 'sine', octave: 1, volume: 0.9 },
      { engine: 'analog', analogWave: 'triangle', octave: 1, volume: 0.4 },
      { engine: 'sample', noiseType: 'tape_hiss', volume: 0.15 },
      { enabled: false }
    ]
  }),
  buildPreset({
    id: 'cyberpunk_laser_lead',
    name: 'Cyberpunk Laser Solo',
    category: 'Lead',
    genres: ['Cyberpunk', 'Techno', 'Cinematic', 'EDM'],
    moods: ['Aggressive', 'Futuristic', 'Sharp'],
    description: 'High-speed tearing laser lead with sync modulation, resonant bandpass drive, and stereo ping-pong bounce.',
    soundExplainer: 'Oscillator sync coupled with metallic comb resonator and rapid envelope snap.',
    tags: ['Cyberpunk', 'Laser', 'Sync', 'Lead', 'Distorted'],
    polyphony: 1,
    glide: 0.04,
    layers: [
      { engine: 'wavetable', wavetableId: 'metallic_comb', wavetablePos: 0.6, volume: 0.85 },
      { engine: 'analog', analogWave: 'saw', octave: 1, volume: 0.7 },
      { engine: 'fm', fmRatio: 3.5, fmDepth: 0.4, volume: 0.5 },
      { engine: 'sample', noiseType: 'digital_grit', volume: 0.2 }
    ]
  }),
  // 40 additional leads:
  ...Array.from({ length: 40 }, (_, i) => {
    const leadTypes = [
      { name: 'Vintage Synthwave Brass Lead', wt: 'cyber_saw', eng: 'analog', desc: 'Warm 80s analog brass solo lead' },
      { name: 'Glass FM Soloist', wt: 'digital_glass', eng: 'fm', desc: 'Pristine crystalline FM solo lead' },
      { name: 'Trap Bell Whistle', wt: 'spectral_bell', eng: 'spectral', desc: 'High metallic flute-bell melody lead' },
      { name: 'Future Rave Screamer', wt: 'acid_grit', eng: 'wavetable', desc: 'Aggressive modern rave festival lead' },
      { name: 'Trance Euphoria Supersaw', wt: 'cyber_saw', eng: 'analog', desc: 'Uplifting stadium trance lead' },
      { name: 'Afrobeats Vocal Flute Lead', wt: 'vocal_formant', eng: 'wavetable', desc: 'Sweet melodious African lead sound' },
      { name: 'Dirty Saturated Monolead', wt: 'dirty_reese', eng: 'wavetable', desc: 'Gritty distorted trap melody lead' },
      { name: 'Liquid Sine Solitary', wt: 'liquid_sine', eng: 'wavetable', desc: 'Warm organic solo lead for R&B' }
    ];
    const item = leadTypes[i % leadTypes.length];
    return buildPreset({
      id: `lead_${i + 6}`,
      name: `${item.name} ${Math.floor(i / leadTypes.length) + 1}`,
      category: 'Lead',
      genres: ['EDM', 'Pop', 'Synthwave', 'Trap', 'Hip-Hop'][i % 5] ? [['EDM', 'Pop', 'Synthwave', 'Trap', 'Hip-Hop'][i % 5]] : ['Lead'],
      moods: ['Bright', 'Expressive', 'Aggressive', 'Warm'][i % 4] ? [['Bright', 'Expressive', 'Aggressive', 'Warm'][i % 4]] : ['Epic'],
      description: `${item.desc} (Lead Bank Preset ${i + 6})`,
      soundExplainer: `Engineered using ${item.eng} synthesis with expressive vibrato and filter tracking.`,
      tags: ['Lead', 'Solo', 'Melody', item.name.split(' ')[0]],
      polyphony: i % 2 === 0 ? 1 : 8,
      glide: i % 2 === 0 ? 0.05 : 0,
      layers: [
        { engine: item.eng as any, analogWave: 'saw', wavetableId: item.wt, wavetablePos: 0.2 + (i * 0.02) % 0.7, volume: 0.8 },
        { engine: 'wavetable', wavetableId: item.wt, wavetablePos: 0.4, octave: 1, volume: 0.6 },
        { engine: 'analog', analogWave: 'sine', octave: -1, volume: 0.35 },
        { engine: 'sample', noiseType: 'tape_hiss', volume: 0.15 }
      ]
    });
  })
];
