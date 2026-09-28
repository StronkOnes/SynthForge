/**
 * Wavetable definitions and Fourier coefficients generator for Web Audio PeriodicWave.
 * Supports 64 discrete frames with smooth morphing and harmonic shaping.
 */

export interface WavetableSpec {
  id: string;
  name: string;
  category: 'Analog' | 'Digital' | 'Vocal' | 'Aggressive' | 'Metallic' | 'Harmonic';
  description: string;
  getHarmonics: (frame: number, maxHarmonics?: number) => { real: Float32Array; imag: Float32Array };
}

export const WAVETABLES: WavetableSpec[] = [
  {
    id: 'cyber_saw',
    name: 'Cyber Saw & Pulse',
    category: 'Analog',
    description: 'Smooth morph from bandlimited fat saw through hyper-pulse to hollow square.',
    getHarmonics: (frame: number, maxH = 64) => {
      // frame: 0.0 to 1.0
      const real = new Float32Array(maxH);
      const imag = new Float32Array(maxH);
      for (let n = 1; n < maxH; n++) {
        // Saw harmonic: (-1)^n / n
        const saw = (2 / (Math.PI * n)) * (n % 2 === 1 ? 1 : -1);
        // Square harmonic: 4 / (pi * n) for odd n
        const square = n % 2 === 1 ? 4 / (Math.PI * n) : 0;
        // Pulse duty factor
        const pulse = (2 / (Math.PI * n)) * Math.sin(Math.PI * n * (0.1 + 0.8 * frame));
        
        imag[n] = (1 - frame) * saw + frame * pulse * 0.7 + (frame > 0.5 ? square * 0.3 : 0);
      }
      return { real, imag };
    }
  },
  {
    id: 'digital_glass',
    name: 'Digital Glass Morph',
    category: 'Digital',
    description: 'Crystalline inharmonic bells shifting into sharp glassy digital timbres.',
    getHarmonics: (frame: number, maxH = 64) => {
      const real = new Float32Array(maxH);
      const imag = new Float32Array(maxH);
      for (let n = 1; n < maxH; n++) {
        const bellPeak = Math.exp(-Math.pow(n - (2 + frame * 18), 2) / 4);
        const shimmer = Math.sin(n * frame * 3.5) / Math.sqrt(n);
        imag[n] = (1 / (n * 0.7)) * 0.4 + bellPeak * 0.6 + shimmer * 0.2;
      }
      return { real, imag };
    }
  },
  {
    id: 'vocal_formant',
    name: 'Vocal Formant A-E-I-O-U',
    category: 'Vocal',
    description: 'Morphing human vocal tract formants producing rich talkbox & vowel sounds.',
    getHarmonics: (frame: number, maxH = 64) => {
      const real = new Float32Array(maxH);
      const imag = new Float32Array(maxH);
      // Formant centers shift from A (f1=700, f2=1200) to U (f1=300, f2=800)
      const f1 = 2 + (1 - frame) * 6;
      const f2 = 8 + Math.sin(frame * Math.PI) * 14;
      for (let n = 1; n < maxH; n++) {
        const peak1 = Math.exp(-Math.pow(n - f1, 2) / 3.0);
        const peak2 = Math.exp(-Math.pow(n - f2, 2) / 5.0) * 0.7;
        imag[n] = (peak1 + peak2 + 0.05 / n) * 0.8;
      }
      return { real, imag };
    }
  },
  {
    id: 'dirty_reese',
    name: 'Dirty Reese & Growl',
    category: 'Aggressive',
    description: 'Heavy bass wavetable with detuned harmonic spikes for DnB and Dubstep growls.',
    getHarmonics: (frame: number, maxH = 64) => {
      const real = new Float32Array(maxH);
      const imag = new Float32Array(maxH);
      for (let n = 1; n < maxH; n++) {
        const sub = n === 1 ? 1.0 : 0;
        const lowSaw = n < 8 ? (1 / n) * 0.9 : 0;
        const growlSpike = Math.sin(n * 0.8 + frame * 6) > 0.4 ? (0.6 / Math.sqrt(n)) : 0;
        imag[n] = sub * 0.8 + lowSaw * 0.6 + growlSpike * (0.3 + frame * 0.5);
      }
      return { real, imag };
    }
  },
  {
    id: 'liquid_sine',
    name: 'Liquid Sine to Organ',
    category: 'Harmonic',
    description: 'Deep warm fundamental morphing smoothly into drawbar tonewheel harmonics.',
    getHarmonics: (frame: number, maxH = 64) => {
      const real = new Float32Array(maxH);
      const imag = new Float32Array(maxH);
      // Tonewheel drawbar harmonic series: 1, 2, 3, 4, 6, 8, 10, 12
      const drawbars = [1, 2, 3, 4, 6, 8, 10, 12];
      for (let n = 1; n < maxH; n++) {
        if (n === 1) {
          imag[n] = 1.0;
        } else if (drawbars.includes(n)) {
          imag[n] = frame * (0.8 / Math.sqrt(n));
        } else {
          imag[n] = frame * 0.08 / n;
        }
      }
      return { real, imag };
    }
  },
  {
    id: 'metallic_comb',
    name: 'Metallic Comb Resonator',
    category: 'Metallic',
    description: 'Comb-filtered resonant spikes that produce industrial metallic ring and edge.',
    getHarmonics: (frame: number, maxH = 64) => {
      const real = new Float32Array(maxH);
      const imag = new Float32Array(maxH);
      const spacing = 2 + Math.floor(frame * 6);
      for (let n = 1; n < maxH; n++) {
        const isCombNode = (n % spacing === 0);
        imag[n] = isCombNode ? (0.9 / Math.sqrt(n)) : (0.1 / n);
      }
      return { real, imag };
    }
  },
  {
    id: 'spectral_bell',
    name: 'Spectral Bell & Chime',
    category: 'Harmonic',
    description: 'Inharmonic frequencies modeled after Tibetan singing bowls and struck quartz.',
    getHarmonics: (frame: number, maxH = 64) => {
      const real = new Float32Array(maxH);
      const imag = new Float32Array(maxH);
      // Inharmonic ratios ~ 1, 2.76, 5.4, 8.9
      for (let n = 1; n < maxH; n++) {
        const fund = n === 1 ? 1.0 : 0;
        const part2 = Math.exp(-Math.pow(n - (3 + frame * 2), 2) / 1.5) * 0.7;
        const part3 = Math.exp(-Math.pow(n - (6 + frame * 4), 2) / 2.0) * 0.5;
        const part4 = Math.exp(-Math.pow(n - (11 + frame * 6), 2) / 3.0) * 0.3;
        imag[n] = fund * (1 - frame * 0.3) + part2 + part3 + part4;
      }
      return { real, imag };
    }
  },
  {
    id: 'acid_grit',
    name: 'Acid 303 Grit',
    category: 'Aggressive',
    description: 'Saturated square-saw hybrid with rich odd harmonics designed for screaming filter sweeps.',
    getHarmonics: (frame: number, maxH = 64) => {
      const real = new Float32Array(maxH);
      const imag = new Float32Array(maxH);
      for (let n = 1; n < maxH; n++) {
        const saw = (2 / (Math.PI * n));
        const sq = n % 2 === 1 ? (3 / (Math.PI * n)) : 0;
        const grit = (Math.sin(n * (1 + frame * 3)) * 0.3) / n;
        imag[n] = ((1 - frame) * saw + frame * sq + grit) * 0.85;
      }
      return { real, imag };
    }
  }
];
