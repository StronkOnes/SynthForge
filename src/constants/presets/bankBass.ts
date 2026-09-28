import { SynthPreset } from '../../types/synth';
import { buildPreset } from './presetBuilder';

export const BASS_PRESETS: SynthPreset[] = [
  buildPreset({
    id: 'sub_gravity_808',
    name: 'Sub Gravity 808',
    category: 'Bass',
    genres: ['Trap', 'Hip-Hop', 'Drill'],
    moods: ['Aggressive', 'Deep', 'Punchy'],
    description: 'Crushing modern 808 with saturated upper mid presence and sub-35Hz rumble designed to rattle car subwoofers.',
    soundExplainer: 'Layer A provides a pure pitched sine sub with initial pitch drop envelope. Layer B introduces a dirty reese wavetable distorted through soft clipping for speaker audibility.',
    tags: ['808', 'Sub', 'Trap', 'Distorted', 'Mono Bass'],
    glide: 0.08,
    layers: [
      { engine: 'analog', analogWave: 'sine', octave: -2, volume: 0.95 },
      { engine: 'wavetable', wavetableId: 'dirty_reese', wavetablePos: 0.4, octave: -1, volume: 0.4 },
      { engine: 'sample', noiseType: 'sub_transient', volume: 0.35 },
      { enabled: false }
    ]
  }),
  buildPreset({
    id: 'cyber_reese_bass',
    name: 'Cyber Reese Bass',
    category: 'Bass',
    genres: ['Drum & Bass', 'Dubstep', 'Tech House', 'Drill'],
    moods: ['Aggressive', 'Evolving', 'Dark', 'Heavy'],
    description: 'Iconic moving neurohop reese bass with phasing harmonic teeth, multiband squish, and aggressive stereo motion.',
    soundExplainer: 'Two detuned wavetables generate rich chorused phase cancellations. A comb filter and wavefold distortion add ferocious midrange grit.',
    tags: ['Reese', 'Neuro', 'DnB', 'Heavy', 'Bass'],
    glide: 0.06,
    layers: [
      { engine: 'analog', analogWave: 'sine', octave: -2, volume: 0.9 },
      { engine: 'wavetable', wavetableId: 'dirty_reese', wavetablePos: 0.7, octave: -1, volume: 0.8, unisonVoices: 3 },
      { engine: 'wavetable', wavetableId: 'acid_grit', wavetablePos: 0.3, volume: 0.5 },
      { engine: 'sample', noiseType: 'digital_grit', volume: 0.2 }
    ]
  }),
  buildPreset({
    id: 'acid_303_screamer',
    name: 'Acid 303 Screamer',
    category: 'Bass',
    genres: ['Techno', 'Tech House', 'Acid', 'EDM'],
    moods: ['Aggressive', 'Punchy', 'Raw', 'High Energy'],
    description: 'Screaming resonant diode-filtered bassline with authentic accent decay, slide portamento, and analog grit.',
    soundExplainer: 'Recreates the legendary 303 diode ladder circuit. Layer A drives the Acid Grit wavetable into a high-resonance 24dB ladder filter.',
    tags: ['Acid', '303', 'Techno', 'Screamer', 'Resonant'],
    glide: 0.08,
    layers: [
      { engine: 'wavetable', wavetableId: 'acid_grit', wavetablePos: 0.6, octave: -1, volume: 0.9 },
      { engine: 'analog', analogWave: 'square', octave: -2, volume: 0.6 },
      { enabled: false },
      { engine: 'sample', noiseType: 'tape_hiss', volume: 0.15 }
    ]
  }),
  buildPreset({
    id: 'drill_sliding_808',
    name: 'UK Drill Sliding 808',
    category: 'Bass',
    genres: ['Drill', 'Trap', 'Hip-Hop'],
    moods: ['Dark', 'Aggressive', 'Gliding'],
    description: 'Long octave-gliding 808 engineered specifically for UK/NY drill bass slides with ferocious harmonic clip.',
    soundExplainer: 'Legato glide configured to 110ms with soft clipping saturation that highlights sliding upper harmonics on small headphones.',
    tags: ['Drill', 'Glide', '808', 'UK Drill', 'Distorted'],
    glide: 0.11,
    layers: [
      { engine: 'analog', analogWave: 'sine', octave: -2, volume: 0.95 },
      { engine: 'analog', analogWave: 'triangle', octave: -1, volume: 0.5 },
      { engine: 'sample', noiseType: 'sub_transient', volume: 0.4 },
      { enabled: false }
    ]
  }),
  buildPreset({
    id: 'deep_sub_clean_rumble',
    name: 'Deep Sub Clean Rumble',
    category: 'Bass',
    genres: ['Dubstep', 'Hip-Hop', 'Trap', 'Ambient'],
    moods: ['Deep', 'Subtle', 'Clean', 'Warm'],
    description: 'Pure 30Hz earth-shaking sub bass with zero upper clutter, ideal as a foundational layer under acoustic instruments.',
    soundExplainer: 'Single-cycle analog sine oscillator through a 24dB Butterworth filter at 140Hz with analog drive saturation.',
    tags: ['Sub', 'Clean', 'Pure', 'Low End', 'Rumble'],
    layers: [
      { engine: 'analog', analogWave: 'sine', octave: -2, volume: 1.0 },
      { engine: 'analog', analogWave: 'triangle', octave: -2, volume: 0.3 },
      { enabled: false },
      { enabled: false }
    ]
  }),
  buildPreset({
    id: 'moog_model_d_bass',
    name: 'Vintage Model D Bass',
    category: 'Bass',
    genres: ['Funk', 'Hip-Hop', 'R&B', 'Pop'],
    moods: ['Warm', 'Analog', 'Punchy', 'Classic'],
    description: 'Classic 3-oscillator ladder-filter analog mono bass with warm transistor saturation and snappy filter envelope punch.',
    soundExplainer: 'Emulates three slightly detuned analog oscillators (Saw + Square + Sub) routed through a 24dB ladder filter with 15% drive.',
    tags: ['Moog', 'Vintage', 'Analog', 'Ladder Filter', 'Funk'],
    layers: [
      { engine: 'analog', analogWave: 'saw', octave: -1, volume: 0.8 },
      { engine: 'analog', analogWave: 'square', octave: -1, fine: 8, volume: 0.7 },
      { engine: 'analog', analogWave: 'triangle', octave: -2, volume: 0.6 },
      { engine: 'sample', noiseType: 'tape_hiss', volume: 0.1 }
    ]
  }),
  buildPreset({
    id: 'west_coast_g_funk_bass',
    name: 'West Coast G-Funk Bass',
    category: 'Bass',
    genres: ['Hip-Hop', 'West Coast', 'Funk', 'R&B'],
    moods: ['Warm', 'Bouncy', 'Funky', 'Smooth'],
    description: 'Bouncy 90s West Coast synth bass with resonant lowpass filter envelope and distinct woody thumb attack.',
    soundExplainer: 'Combines a triangle sub with a narrow pulse oscillator. Fast envelope decay on the 24dB filter delivers the iconic Dre-era bounce.',
    tags: ['West Coast', 'G-Funk', 'Dr Dre', 'Hip-Hop', 'Bounce'],
    layers: [
      { engine: 'analog', analogWave: 'triangle', octave: -2, volume: 0.85 },
      { engine: 'analog', analogWave: 'square', pulseWidth: 0.25, octave: -1, volume: 0.6 },
      { engine: 'sample', noiseType: 'sub_transient', volume: 0.3 },
      { enabled: false }
    ]
  }),
  buildPreset({
    id: 'slap_house_brazilian_bass',
    name: 'Slap House Brazilian Punch',
    category: 'Bass',
    genres: ['House', 'Slap House', 'EDM', 'Pop'],
    moods: ['Punchy', 'Metallic', 'Aggressive', 'Bouncy'],
    description: 'Tight metallic slap house bass with sharp transient strike, short envelope decay, and aggressive multiband compression.',
    soundExplainer: 'Layer A holds a tight sine sub, while Layer B drives an FM operator at a 2.0x ratio into hard-clipped waveshaping.',
    tags: ['Slap House', 'Brazilian Bass', 'Punchy', 'EDM', 'FM Bass'],
    layers: [
      { engine: 'analog', analogWave: 'sine', octave: -2, volume: 0.9 },
      { engine: 'fm', fmRatio: 2.0, fmDepth: 0.45, octave: -1, volume: 0.75 },
      { engine: 'sample', noiseType: 'sub_transient', volume: 0.5 },
      { enabled: false }
    ]
  }),
  buildPreset({
    id: 'neuro_growl_monster',
    name: 'Neuro Growl Monster',
    category: 'Bass',
    genres: ['Dubstep', 'Drum & Bass', 'Bass House'],
    moods: ['Heavy', 'Aggressive', 'Dark', 'Metallic'],
    description: 'Ferocious vocal-like neuro growl bass utilizing morphing formants, comb filtering, and stereo wavefolding.',
    soundExplainer: 'Vocal formant wavetable scanned via an automated LFO through wavefold distortion and a stereo comb filter.',
    tags: ['Growl', 'Dubstep', 'Neuro', 'Formant', 'Heavy'],
    layers: [
      { engine: 'analog', analogWave: 'sine', octave: -2, volume: 0.9 },
      { engine: 'wavetable', wavetableId: 'vocal_formant', wavetablePos: 0.7, octave: -1, volume: 0.85 },
      { engine: 'wavetable', wavetableId: 'metallic_comb', wavetablePos: 0.4, volume: 0.6 },
      { engine: 'sample', noiseType: 'digital_grit', volume: 0.25 }
    ]
  }),
  buildPreset({
    id: 'sub_808_saturated_punch',
    name: 'Saturated 808 Punch',
    category: 'Bass',
    genres: ['Trap', 'Hip-Hop', 'Pop'],
    moods: ['Punchy', 'Warm', 'Heavy'],
    description: 'Warm analog-saturated 808 with punchy attack transient designed for modern metro-style trap production.',
    soundExplainer: 'Tape saturation combined with initial pitch decay envelope on sine oscillator.',
    tags: ['808', 'Metro', 'Trap', 'Punchy', 'Saturated'],
    layers: [
      { engine: 'analog', analogWave: 'sine', octave: -2, volume: 0.95 },
      { engine: 'wavetable', wavetableId: 'cyber_saw', wavetablePos: 0.2, octave: -1, volume: 0.35 },
      { engine: 'sample', noiseType: 'sub_transient', volume: 0.4 },
      { enabled: false }
    ]
  }),
  // Additional 40 bass presets dynamically spanning styles:
  ...Array.from({ length: 40 }, (_, i) => {
    const bassTypes = [
      { name: 'Future Wobble Bass', wt: 'dirty_reese', eng: 'wavetable', desc: 'Rhythmic LFO-wobbling modern bass' },
      { name: 'Dark Tech House Donk', wt: 'acid_grit', eng: 'fm', desc: 'Short punchy hollow FM bass donk' },
      { name: 'Afrobeat Sub Fatness', wt: 'liquid_sine', eng: 'analog', desc: 'Warm rounded foundational afrobeat bass' },
      { name: 'Distorted 808 Demon', wt: 'dirty_reese', eng: 'wavetable', desc: 'Maximum overdrive screaming trap 808' },
      { name: 'Industrial Techno Drone Bass', wt: 'metallic_comb', eng: 'wavetable', desc: 'Monolithic distorted Berlin techno bass' },
      { name: 'Juno 106 Sub Bass', wt: 'cyber_saw', eng: 'analog', desc: 'Warm lush chorus sub from classic 80s Roland' },
      { name: 'Detroit Techno Pluck Bass', wt: 'acid_grit', eng: 'analog', desc: 'Fast percussive syncopated analog saw bass' },
      { name: 'Vocal Reese Morph', wt: 'vocal_formant', eng: 'wavetable', desc: 'Evolving vowel-shifting dubstep bass' }
    ];
    const item = bassTypes[i % bassTypes.length];
    const variantId = `bass_${i + 11}`;
    return buildPreset({
      id: variantId,
      name: `${item.name} ${Math.floor(i / bassTypes.length) + 1}`,
      category: 'Bass',
      genres: ['Trap', 'House', 'Techno', 'Dubstep', 'Hip-Hop'][i % 5] ? [['Trap', 'House', 'Techno', 'Dubstep', 'Hip-Hop'][i % 5]] : ['Bass'],
      moods: ['Deep', 'Aggressive', 'Punchy', 'Warm'][i % 4] ? [['Deep', 'Aggressive', 'Punchy', 'Warm'][i % 4]] : ['Heavy'],
      description: `${item.desc} (Sound Bank Preset ${i + 11})`,
      soundExplainer: `Layered ${item.eng} engine tuned for maximum low-frequency definition and punch.`,
      tags: ['Bass', 'Sub', 'Flagship', item.name.split(' ')[0]],
      layers: [
        { engine: 'analog', analogWave: 'sine', octave: -2, volume: 0.9 },
        { engine: item.eng as any, wavetableId: item.wt, wavetablePos: 0.1 + (i * 0.02) % 0.8, octave: -1, volume: 0.7 },
        { engine: 'sample', noiseType: 'sub_transient', volume: 0.25 },
        { enabled: false }
      ]
    });
  })
];
