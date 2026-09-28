import {
  SynthPreset,
  LayerSettings,
  MasterFXSettings,
  MacroSettings,
  ArpeggiatorSettings,
  MotionEngineSettings,
  MusicalContext
} from '../types/synth';
import { WAVETABLES } from '../constants/wavetables';
import { midiToFreq, quantizeToScale } from '../constants/musicalScales';

interface ActiveVoice {
  note: number;
  freq: number;
  velocity: number;
  startTime: number;
  gainNodes: GainNode[];
  sourceNodes: AudioNode[];
  filterNodes: BiquadFilterNode[];
  pannerNodes: StereoPannerNode[];
}

export class SynthForgeAudioEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;

  // Master buses
  private masterInNode: GainNode | null = null;
  private masterOutNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;

  // Master FX nodes
  private distortionNode: WaveShaperNode | null = null;
  private eqLowNode: BiquadFilterNode | null = null;
  private eqMid1Node: BiquadFilterNode | null = null;
  private eqMid2Node: BiquadFilterNode | null = null;
  private eqHighNode: BiquadFilterNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;
  private delayNodeL: DelayNode | null = null;
  private delayNodeR: DelayNode | null = null;
  private delayFeedbackL: GainNode | null = null;
  private delayFeedbackR: GainNode | null = null;
  private delayFilterL: BiquadFilterNode | null = null;
  private delayFilterR: BiquadFilterNode | null = null;
  private delayMixNode: GainNode | null = null;
  private reverbConvolver: ConvolverNode | null = null;
  private reverbMixNode: GainNode | null = null;
  private chorusDelayNode: DelayNode | null = null;
  private chorusLfoNode: OscillatorNode | null = null;
  private chorusMixNode: GainNode | null = null;

  // Active voices tracking (Max 16 voices)
  private activeVoices = new Map<number, ActiveVoice>();
  private lastPlayedNote: number | null = null;
  private pitchBendSemitones = 0;
  private modWheelAmount = 0;

  // Current active synth state
  private currentPreset: SynthPreset | null = null;
  private activeMacros: MacroSettings = {
    motion: 0.5,
    space: 0.5,
    drive: 0.3,
    bright: 0.5,
    dark: 0.3,
    body: 0.6,
    width: 0.5,
    energy: 0.5
  };
  private morphProgress = 0; // 0 (Preset A) to 1 (Preset B)
  private transformWow = 0;  // 0 to 1

  // Arp & Sequencer scheduler
  private isArpRunning = false;
  private arpTimerId: number | null = null;
  private arpStepIndex = 0;
  private arpHeldNotes: number[] = [];

  // Motion engine ticker
  private motionPhase = 0;
  private motionTimerId: number | null = null;

  // Web MIDI
  private midiAccess: any = null;
  private onMidiNoteCallback: ((note: number, velocity: number, isNoteOn: boolean) => void) | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  public async initAudio(): Promise<boolean> {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return true;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx({ latencyHint: 'interactive' });
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.buildMasterFXChain();
      this.initWebMidi();
      this.startMotionLoop();

      this.isInitialized = true;
      return true;
    } catch (err) {
      console.error('Audio initialization failed:', err);
      return false;
    }
  }

  private buildMasterFXChain() {
    if (!this.ctx) return;

    this.masterInNode = this.ctx.createGain();
    this.masterOutNode = this.ctx.createGain();
    this.analyserNode = this.ctx.createAnalyser();
    this.analyserNode.fftSize = 2048;
    this.analyserNode.smoothingTimeConstant = 0.85;

    // 1. Distortion / Saturator
    this.distortionNode = this.ctx.createWaveShaper();
    this.distortionNode.oversample = '4x';
    this.updateDistortionCurve('tape', 0.25);

    // 2. 4-Band Parametric EQ
    this.eqLowNode = this.ctx.createBiquadFilter();
    this.eqLowNode.type = 'lowshelf';
    this.eqLowNode.frequency.value = 120;
    this.eqLowNode.gain.value = 2.0;

    this.eqMid1Node = this.ctx.createBiquadFilter();
    this.eqMid1Node.type = 'peaking';
    this.eqMid1Node.frequency.value = 450;
    this.eqMid1Node.Q.value = 1.2;
    this.eqMid1Node.gain.value = -1.5;

    this.eqMid2Node = this.ctx.createBiquadFilter();
    this.eqMid2Node.type = 'peaking';
    this.eqMid2Node.frequency.value = 3200;
    this.eqMid2Node.Q.value = 1.4;
    this.eqMid2Node.gain.value = 2.0;

    this.eqHighNode = this.ctx.createBiquadFilter();
    this.eqHighNode.type = 'highshelf';
    this.eqHighNode.frequency.value = 8500;
    this.eqHighNode.gain.value = 1.0;

    // 3. Stereo Chorus
    this.chorusDelayNode = this.ctx.createDelay();
    this.chorusDelayNode.delayTime.value = 0.025;
    this.chorusMixNode = this.ctx.createGain();
    this.chorusMixNode.gain.value = 0.3;

    this.chorusLfoNode = this.ctx.createOscillator();
    this.chorusLfoNode.frequency.value = 1.2;
    const chorusLfoGain = this.ctx.createGain();
    chorusLfoGain.gain.value = 0.003;
    this.chorusLfoNode.connect(chorusLfoGain);
    chorusLfoGain.connect(this.chorusDelayNode.delayTime);
    this.chorusLfoNode.start();

    // 4. Stereo Ping-Pong Delay
    this.delayNodeL = this.ctx.createDelay(2.0);
    this.delayNodeR = this.ctx.createDelay(2.0);
    this.delayNodeL.delayTime.value = 0.25;
    this.delayNodeR.delayTime.value = 0.375;
    this.delayFeedbackL = this.ctx.createGain();
    this.delayFeedbackR = this.ctx.createGain();
    this.delayFeedbackL.gain.value = 0.35;
    this.delayFeedbackR.gain.value = 0.35;
    this.delayFilterL = this.ctx.createBiquadFilter();
    this.delayFilterR = this.ctx.createBiquadFilter();
    this.delayFilterL.type = 'lowpass';
    this.delayFilterR.type = 'lowpass';
    this.delayFilterL.frequency.value = 3500;
    this.delayFilterR.frequency.value = 3500;
    this.delayMixNode = this.ctx.createGain();
    this.delayMixNode.gain.value = 0.25;

    // Delay cross feedback loop
    this.delayNodeL.connect(this.delayFilterL);
    this.delayFilterL.connect(this.delayFeedbackL);
    this.delayFeedbackL.connect(this.delayNodeR); // Ping-pong cross
    this.delayFilterL.connect(this.delayMixNode);

    this.delayNodeR.connect(this.delayFilterR);
    this.delayFilterR.connect(this.delayFeedbackR);
    this.delayFeedbackR.connect(this.delayNodeL); // Ping-pong cross
    this.delayFilterR.connect(this.delayMixNode);

    // 5. Algorithmic Reverb Simulation
    this.reverbConvolver = this.ctx.createConvolver();
    this.reverbConvolver.buffer = this.buildImpulseResponse(2.5, 0.4, false);
    this.reverbMixNode = this.ctx.createGain();
    this.reverbMixNode.gain.value = 0.28;

    // 6. Multiband Compressor & Limiter
    this.compressorNode = this.ctx.createDynamicsCompressor();
    this.compressorNode.threshold.value = -18;
    this.compressorNode.ratio.value = 4;
    this.compressorNode.attack.value = 0.015;
    this.compressorNode.release.value = 0.15;

    // Route series audio path
    // masterIn -> distortion -> eqLow -> eqMid1 -> eqMid2 -> eqHigh -> compressor -> analyser -> masterOut
    this.masterInNode.connect(this.distortionNode);
    this.distortionNode.connect(this.eqLowNode);
    this.eqLowNode.connect(this.eqMid1Node);
    this.eqMid1Node.connect(this.eqMid2Node);
    this.eqMid2Node.connect(this.eqHighNode);

    // Parallel sends for chorus, delay, reverb
    this.eqHighNode.connect(this.chorusDelayNode);
    this.chorusDelayNode.connect(this.chorusMixNode);

    this.eqHighNode.connect(this.delayNodeL);
    this.eqHighNode.connect(this.delayNodeR);

    this.eqHighNode.connect(this.reverbConvolver);
    this.reverbConvolver.connect(this.reverbMixNode);

    // Sum dry + wet
    const dryWetMixer = this.ctx.createGain();
    this.eqHighNode.connect(dryWetMixer);
    this.chorusMixNode.connect(dryWetMixer);
    this.delayMixNode.connect(dryWetMixer);
    this.reverbMixNode.connect(dryWetMixer);

    dryWetMixer.connect(this.compressorNode);
    this.compressorNode.connect(this.analyserNode);
    this.analyserNode.connect(this.masterOutNode);
    this.masterOutNode.connect(this.ctx.destination);
    this.masterOutNode.gain.value = 0.85;
  }

  private buildImpulseResponse(duration: number, decay: number, reverse: boolean): AudioBuffer {
    if (!this.ctx) return {} as any;
    const sampleRate = this.ctx.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = reverse ? length - i : i;
      const env = Math.pow(1 - n / length, decay * 3);
      left[i] = (Math.random() * 2 - 1) * env;
      right[i] = (Math.random() * 2 - 1) * env;
    }
    return impulse;
  }

  private updateDistortionCurve(type: string, drive: number) {
    if (!this.distortionNode) return;
    const nSamples = 1024;
    const curve = new Float32Array(nSamples);
    const k = drive * 50;

    for (let i = 0; i < nSamples; i++) {
      const x = (i * 2) / nSamples - 1;
      if (type === 'hard_clip') {
        curve[i] = Math.max(-0.8, Math.min(0.8, x * (1 + k * 0.1)));
      } else if (type === 'wavefold') {
        const folded = Math.sin(x * (1 + k * 0.1) * Math.PI * 0.5);
        curve[i] = Math.sin(folded * Math.PI);
      } else if (type === 'bitcrush') {
        const steps = Math.max(4, 32 - Math.floor(drive * 28));
        curve[i] = Math.round(x * steps) / steps;
      } else {
        // Soft clip / Tape warmth (tanh saturation)
        curve[i] = (Math.PI + k) * x / (Math.PI + k * Math.abs(x));
      }
    }
    this.distortionNode.curve = curve;
  }

  // Preset loading & applying
  public loadPreset(preset: SynthPreset) {
    this.currentPreset = JSON.parse(JSON.stringify(preset));
    this.activeMacros = { ...preset.macros };
    this.applyMasterFX(preset.masterFX);
    this.updateArpSettings(preset.arpeggiator);
  }

  public applyMasterFX(fx: MasterFXSettings) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    // Distortion
    if (this.distortionNode) {
      this.updateDistortionCurve(fx.distortion.type, fx.distortion.drive * (0.5 + this.activeMacros.drive * 0.5));
    }

    // EQ
    if (this.eqLowNode) this.eqLowNode.gain.setValueAtTime(fx.eq.lowGain + (this.activeMacros.body - 0.5) * 6, t);
    if (this.eqMid1Node) {
      this.eqMid1Node.frequency.setValueAtTime(fx.eq.mid1Freq, t);
      this.eqMid1Node.gain.setValueAtTime(fx.eq.mid1Gain, t);
    }
    if (this.eqMid2Node) {
      this.eqMid2Node.frequency.setValueAtTime(fx.eq.mid2Freq, t);
      this.eqMid2Node.gain.setValueAtTime(fx.eq.mid2Gain + (this.activeMacros.bright - 0.5) * 6, t);
    }
    if (this.eqHighNode) this.eqHighNode.gain.setValueAtTime(fx.eq.highGain, t);

    // Delay
    if (this.delayNodeL && this.delayNodeR && this.delayFeedbackL && this.delayFeedbackR && this.delayMixNode) {
      this.delayNodeL.delayTime.setValueAtTime(fx.delay.timeL, t);
      this.delayNodeR.delayTime.setValueAtTime(fx.delay.timeR, t);
      this.delayFeedbackL.gain.setValueAtTime(fx.delay.feedback, t);
      this.delayFeedbackR.gain.setValueAtTime(fx.delay.feedback, t);
      this.delayMixNode.gain.setValueAtTime(fx.delay.enabled ? fx.delay.mix * this.activeMacros.space : 0, t);
    }

    // Reverb
    if (this.reverbMixNode) {
      this.reverbMixNode.gain.setValueAtTime(fx.reverb.enabled ? fx.reverb.mix * this.activeMacros.space : 0, t);
    }

    // Compressor
    if (this.compressorNode) {
      this.compressorNode.threshold.setValueAtTime(fx.compressor.threshold, t);
      this.compressorNode.ratio.setValueAtTime(fx.compressor.ratio, t);
      this.compressorNode.attack.setValueAtTime(fx.compressor.attack, t);
      this.compressorNode.release.setValueAtTime(fx.compressor.release, t);
    }
  }

  // Live Sound Morphing between Preset A and Preset B
  public setSoundMorph(presetA: SynthPreset, presetB: SynthPreset, amount: number) {
    this.morphProgress = amount;
    if (!this.currentPreset) return;

    // Interpolate 4 layers smoothly
    for (let i = 0; i < 4; i++) {
      const layerA = presetA.layers[i];
      const layerB = presetB.layers[i];
      const targetLayer = this.currentPreset.layers[i];
      if (!layerA || !layerB || !targetLayer) continue;

      targetLayer.volume = layerA.volume * (1 - amount) + layerB.volume * amount;
      targetLayer.pan = layerA.pan * (1 - amount) + layerB.pan * amount;
      targetLayer.wavetablePos = layerA.wavetablePos * (1 - amount) + layerB.wavetablePos * amount;
      targetLayer.fmRatio = layerA.fmRatio * (1 - amount) + layerB.fmRatio * amount;
      targetLayer.fmDepth = layerA.fmDepth * (1 - amount) + layerB.fmDepth * amount;
      targetLayer.harmonicTilt = layerA.harmonicTilt * (1 - amount) + layerB.harmonicTilt * amount;

      // Filter cutoff interpolation
      targetLayer.filterA.cutoff = Math.exp(
        Math.log(layerA.filterA.cutoff) * (1 - amount) + Math.log(layerB.filterA.cutoff) * amount
      );
      targetLayer.filterA.resonance = layerA.filterA.resonance * (1 - amount) + layerB.filterA.resonance * amount;
    }

    // Interpolate macros
    this.activeMacros.motion = presetA.macros.motion * (1 - amount) + presetB.macros.motion * amount;
    this.activeMacros.space = presetA.macros.space * (1 - amount) + presetB.macros.space * amount;
    this.activeMacros.drive = presetA.macros.drive * (1 - amount) + presetB.macros.drive * amount;
    this.activeMacros.bright = presetA.macros.bright * (1 - amount) + presetB.macros.bright * amount;
    this.activeMacros.body = presetA.macros.body * (1 - amount) + presetB.macros.body * amount;
    this.activeMacros.width = presetA.macros.width * (1 - amount) + presetB.macros.width * amount;

    this.applyMasterFX(this.currentPreset.masterFX);
  }

  // Wow control: Transform
  public setTransformWow(value: number) {
    this.transformWow = Math.max(0, Math.min(1, value));
    if (!this.currentPreset) return;

    // Transform progressively enhances harmonics, increases drive, opens filters, and widens stereo field
    this.activeMacros.bright = 0.3 + this.transformWow * 0.6;
    this.activeMacros.drive = 0.2 + this.transformWow * 0.65;
    this.activeMacros.energy = 0.4 + this.transformWow * 0.6;
    this.activeMacros.space = 0.3 + this.transformWow * 0.5;

    this.applyMasterFX(this.currentPreset.masterFX);
  }

  public setMacro(name: keyof MacroSettings, val: number) {
    this.activeMacros[name] = Math.max(0, Math.min(1, val));
    if (this.currentPreset) {
      this.applyMasterFX(this.currentPreset.masterFX);
    }
  }

  public getMacro(name: keyof MacroSettings): number {
    return this.activeMacros[name];
  }

  // Voice note generation
  public noteOn(midiNote: number, velocity = 0.8) {
    if (!this.ctx || !this.currentPreset) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    // Scale-aware quantize if outside notes mode is Safe
    let targetNote = midiNote;
    const musicalCtx = this.currentPreset.musicalContext;
    if (musicalCtx && musicalCtx.outsideNotes === 'safe') {
      targetNote = quantizeToScale(midiNote, musicalCtx.key, musicalCtx.scale);
    }

    // If arpeggiator is enabled, pass note to arp scheduler
    if (this.currentPreset.arpeggiator.enabled) {
      if (!this.arpHeldNotes.includes(targetNote)) {
        this.arpHeldNotes.push(targetNote);
      }
      this.startArp();
      if (this.onMidiNoteCallback) {
        this.onMidiNoteCallback(targetNote, velocity, true);
      }
      return;
    }

    this.playVoice(targetNote, velocity);
    if (this.onMidiNoteCallback) {
      this.onMidiNoteCallback(targetNote, velocity, true);
    }
  }

  public noteOff(midiNote: number) {
    if (!this.ctx || !this.currentPreset) return;

    if (this.currentPreset.arpeggiator.enabled) {
      this.arpHeldNotes = this.arpHeldNotes.filter(n => n !== midiNote);
      if (this.arpHeldNotes.length === 0) {
        this.stopArp();
      }
      if (this.onMidiNoteCallback) {
        this.onMidiNoteCallback(midiNote, 0, false);
      }
      return;
    }

    this.releaseVoice(midiNote);
    if (this.onMidiNoteCallback) {
      this.onMidiNoteCallback(midiNote, 0, false);
    }
  }

  private playVoice(midiNote: number, velocity: number) {
    if (!this.ctx || !this.currentPreset || !this.masterInNode) return;
    const now = this.ctx.currentTime;
    const baseFreq = midiToFreq(midiNote + this.pitchBendSemitones);

    // Steal oldest voice if max polyphony exceeded
    if (this.activeVoices.size >= (this.currentPreset.polyphony || 8)) {
      const oldestKey = this.activeVoices.keys().next().value;
      if (oldestKey !== undefined) {
        this.releaseVoice(oldestKey, 0.02);
      }
    }

    const voice: ActiveVoice = {
      note: midiNote,
      freq: baseFreq,
      velocity,
      startTime: now,
      gainNodes: [],
      sourceNodes: [],
      filterNodes: [],
      pannerNodes: []
    };

    // Synthesize active layers (Layer A, B, C, D)
    this.currentPreset.layers.forEach((layer: LayerSettings) => {
      if (!layer.enabled || layer.volume <= 0.001) return;

      const layerFreq = baseFreq * Math.pow(2, layer.octave + (layer.semitone / 12) + (layer.fine / 1200));

      // 1. Layer Panner & Volume
      const panner = this.ctx!.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, layer.pan)), now);

      const ampGain = this.ctx!.createGain();
      const initialVol = 0.0001;
      ampGain.gain.setValueAtTime(initialVol, now);

      // ADSR Envelope
      const a = Math.max(0.002, layer.ampEnv.attack);
      const d = Math.max(0.01, layer.ampEnv.decay);
      const s = Math.max(0.001, layer.ampEnv.sustain * layer.volume * velocity);
      ampGain.gain.linearRampToValueAtTime(layer.volume * velocity, now + a);
      ampGain.gain.exponentialRampToValueAtTime(s, now + a + d);

      // 2. Dual Filter Unit
      const filter = this.ctx!.createBiquadFilter();
      filter.type = this.mapFilterType(layer.filterA.type);
      const baseCutoff = Math.max(20, Math.min(20000, layer.filterA.cutoff * (0.6 + this.activeMacros.bright * 0.8)));
      filter.frequency.setValueAtTime(baseCutoff, now);
      filter.Q.setValueAtTime(Math.max(0.1, layer.filterA.resonance), now);

      // Filter Envelope snap
      if (layer.filterA.envAmount !== 0) {
        const targetCutoff = Math.max(20, Math.min(20000, baseCutoff * Math.pow(2, layer.filterA.envAmount * 3)));
        filter.frequency.exponentialRampToValueAtTime(targetCutoff, now + a * 0.8);
        filter.frequency.exponentialRampToValueAtTime(baseCutoff, now + a + d);
      }

      // Connect filter -> amp -> panner -> masterIn
      filter.connect(ampGain);
      ampGain.connect(panner);
      panner.connect(this.masterInNode!);

      voice.gainNodes.push(ampGain);
      voice.filterNodes.push(filter);
      voice.pannerNodes.push(panner);

      // 3. Sound Engine Generator
      if (layer.engine === 'analog') {
        const osc = this.ctx!.createOscillator();
        if (layer.analogWave === 'supersaw') {
          osc.type = 'sawtooth';
          // Additional detuned sub-oscillator for supersaw richness
          const osc2 = this.ctx!.createOscillator();
          osc2.type = 'sawtooth';
          osc2.frequency.setValueAtTime(layerFreq * (1 + (layer.unisonDetune || 0.15) * 0.02), now);
          osc2.connect(filter);
          osc2.start(now);
          voice.sourceNodes.push(osc2);
        } else {
          osc.type = layer.analogWave as OscillatorType;
        }
        osc.frequency.setValueAtTime(layerFreq, now);
        osc.connect(filter);
        osc.start(now);
        voice.sourceNodes.push(osc);

      } else if (layer.engine === 'wavetable') {
        // Wavetable oscillator with Fourier PeriodicWave
        const wtSpec = WAVETABLES.find(w => w.id === layer.wavetableId) || WAVETABLES[0];
        const { real, imag } = wtSpec.getHarmonics(layer.wavetablePos);
        const wave = this.ctx!.createPeriodicWave(real, imag, { disableNormalization: false });
        const wtOsc = this.ctx!.createOscillator();
        wtOsc.setPeriodicWave(wave);
        wtOsc.frequency.setValueAtTime(layerFreq, now);
        wtOsc.connect(filter);
        wtOsc.start(now);
        voice.sourceNodes.push(wtOsc);

      } else if (layer.engine === 'fm') {
        // 2-Operator FM synthesis: Carrier + Modulator
        const carrier = this.ctx!.createOscillator();
        carrier.type = (layer.fmWave || 'sine') as OscillatorType;
        carrier.frequency.setValueAtTime(layerFreq, now);

        const modulator = this.ctx!.createOscillator();
        modulator.type = 'sine';
        modulator.frequency.setValueAtTime(layerFreq * (layer.fmRatio || 2.0), now);

        const modGain = this.ctx!.createGain();
        const modDepthFreq = layerFreq * (layer.fmDepth || 0.4) * 5;
        modGain.gain.setValueAtTime(modDepthFreq, now);

        modulator.connect(modGain);
        modGain.connect(carrier.frequency);

        carrier.connect(filter);
        modulator.start(now);
        carrier.start(now);

        voice.sourceNodes.push(carrier);
        voice.sourceNodes.push(modulator);

      } else if (layer.engine === 'spectral') {
        // Spectral Additive Engine
        const hCount = Math.max(4, Math.min(32, layer.harmonicCount || 16));
        const real = new Float32Array(hCount + 1);
        const imag = new Float32Array(hCount + 1);
        for (let h = 1; h <= hCount; h++) {
          const tilt = Math.pow(h, layer.harmonicTilt || 0);
          const oddEven = (h % 2 === 1) ? (1 - (layer.oddEvenBalance || 0)) : (1 + (layer.oddEvenBalance || 0));
          imag[h] = (1 / h) * tilt * Math.max(0.01, oddEven);
        }
        const spectralWave = this.ctx!.createPeriodicWave(real, imag, { disableNormalization: false });
        const specOsc = this.ctx!.createOscillator();
        specOsc.setPeriodicWave(spectralWave);
        specOsc.frequency.setValueAtTime(layerFreq, now);
        specOsc.connect(filter);
        specOsc.start(now);
        voice.sourceNodes.push(specOsc);

      } else if (layer.engine === 'sample') {
        // Noise / Texture generator
        const bufferSize = this.ctx!.sampleRate * 2;
        const noiseBuffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (layer.noiseType === 'vinyl_crackle') {
            output[i] = Math.random() > 0.992 ? (Math.random() * 2 - 1) * 0.7 : white * 0.03;
          } else if (layer.noiseType === 'tape_hiss') {
            b0 = 0.95 * b0 + white * 0.05;
            output[i] = (white - b0) * 0.3;
          } else {
            // White or sub transient
            output[i] = white * 0.4;
          }
        }
        const noiseSource = this.ctx!.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;
        noiseSource.connect(filter);
        noiseSource.start(now);
        voice.sourceNodes.push(noiseSource);
      }
    });

    this.activeVoices.set(midiNote, voice);
    this.lastPlayedNote = midiNote;
  }

  private releaseVoice(midiNote: number, releaseOverride?: number) {
    const voice = this.activeVoices.get(midiNote);
    if (!voice || !this.ctx) return;

    const now = this.ctx.currentTime;
    const releaseTime = releaseOverride ?? 0.3;

    voice.gainNodes.forEach(g => {
      try {
        g.gain.cancelScheduledValues(now);
        g.gain.setValueAtTime(Math.max(0.0001, g.gain.value), now);
        g.gain.exponentialRampToValueAtTime(0.00001, now + releaseTime);
      } catch (e) {
        // ignore ramp on disposed node
      }
    });

    setTimeout(() => {
      voice.sourceNodes.forEach(s => {
        try {
          if ('stop' in s) (s as any).stop();
          s.disconnect();
        } catch (e) {}
      });
      voice.filterNodes.forEach(f => f.disconnect());
      voice.pannerNodes.forEach(p => p.disconnect());
      voice.gainNodes.forEach(g => g.disconnect());
    }, releaseTime * 1000 + 50);

    this.activeVoices.delete(midiNote);
  }

  public releaseAllVoices() {
    for (const [note] of this.activeVoices) {
      this.releaseVoice(note, 0.05);
    }
  }

  private mapFilterType(type: string): BiquadFilterType {
    switch (type) {
      case 'lp12':
      case 'lp24':
      case 'ladder':
        return 'lowpass';
      case 'hp12':
      case 'hp24':
        return 'highpass';
      case 'bp':
      case 'formant':
        return 'bandpass';
      case 'notch':
      case 'comb':
        return 'notch';
      default:
        return 'lowpass';
    }
  }

  // Pitch bend and Mod wheel
  public setPitchBend(semitones: number) {
    this.pitchBendSemitones = semitones;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (const [, voice] of this.activeVoices) {
      const newFreq = midiToFreq(voice.note + this.pitchBendSemitones);
      voice.sourceNodes.forEach(src => {
        if ('frequency' in src) {
          (src as any).frequency.setValueAtTime(newFreq, now);
        }
      });
    }
  }

  public setModWheel(amount: number) {
    this.modWheelAmount = Math.max(0, Math.min(1, amount));
    this.setMacro('motion', 0.2 + this.modWheelAmount * 0.7);
  }

  // Arpeggiator & 16-Step Sequencer
  private updateArpSettings(arp: ArpeggiatorSettings) {
    if (!arp.enabled && this.isArpRunning) {
      this.stopArp();
    }
  }

  private startArp() {
    if (this.isArpRunning) return;
    this.isArpRunning = true;
    this.arpStepIndex = 0;
    this.runArpStep();
  }

  private stopArp() {
    this.isArpRunning = false;
    if (this.arpTimerId !== null) {
      clearTimeout(this.arpTimerId);
      this.arpTimerId = null;
    }
    this.releaseAllVoices();
  }

  private runArpStep() {
    if (!this.isArpRunning || this.arpHeldNotes.length === 0 || !this.currentPreset) {
      this.stopArp();
      return;
    }

    const arp = this.currentPreset.arpeggiator;
    const bpm = arp.bpm || 128;
    const msPerQuarter = (60 / bpm) * 1000;
    const stepDurationMs = msPerQuarter / 4; // 16th note default

    const step = arp.steps[this.arpStepIndex % arp.steps.length];
    if (step.active && Math.random() <= step.probability) {
      // Pick pitch from held notes
      let baseMidi = this.arpHeldNotes[0];
      if (arp.mode === 'up') {
        baseMidi = this.arpHeldNotes[this.arpStepIndex % this.arpHeldNotes.length];
      } else if (arp.mode === 'down') {
        const rev = [...this.arpHeldNotes].reverse();
        baseMidi = rev[this.arpStepIndex % rev.length];
      } else if (arp.mode === 'random') {
        baseMidi = this.arpHeldNotes[Math.floor(Math.random() * this.arpHeldNotes.length)];
      }

      const octShift = (Math.floor(this.arpStepIndex / this.arpHeldNotes.length) % arp.octaves) * 12;
      const playNote = baseMidi + octShift + step.pitchOffset;

      this.playVoice(playNote, step.velocity * 0.85);
      const gateTime = (stepDurationMs * arp.gate) / 1000;
      setTimeout(() => {
        this.releaseVoice(playNote, 0.05);
      }, gateTime * 1000);
    }

    this.arpStepIndex++;
    this.arpTimerId = window.setTimeout(() => this.runArpStep(), stepDurationMs);
  }

  // Motion Engine update loop
  private startMotionLoop() {
    const tick = () => {
      this.motionPhase = (this.motionPhase + 0.03) % (Math.PI * 2);
      if (this.currentPreset && this.currentPreset.motion.enabled && this.ctx) {
        const motion = this.currentPreset.motion;
        let lfoVal = 0;
        if (motion.mode === 'pulse') {
          lfoVal = Math.sin(this.motionPhase);
        } else if (motion.mode === 'drift') {
          lfoVal = Math.sin(this.motionPhase * 0.7) * 0.6 + Math.cos(this.motionPhase * 1.3) * 0.4;
        } else if (motion.mode === 'bounce') {
          lfoVal = Math.abs(Math.sin(this.motionPhase));
        } else {
          lfoVal = Math.sin(this.motionPhase * 2);
        }

        // Apply subtle motion depth to active voice filters
        const modOffset = lfoVal * motion.intensity * 400;
        const now = this.ctx.currentTime;
        for (const [, voice] of this.activeVoices) {
          voice.filterNodes.forEach(f => {
            try {
              f.frequency.setValueAtTime(Math.max(40, f.frequency.value + modOffset * 0.05), now);
            } catch (e) {}
          });
        }
      }
      this.motionTimerId = window.setTimeout(tick, 30);
    };
    tick();
  }

  // Web MIDI API support
  private async initWebMidi() {
    if (navigator.requestMIDIAccess) {
      try {
        this.midiAccess = await navigator.requestMIDIAccess();
        for (const input of this.midiAccess.inputs.values()) {
          input.onmidimessage = this.handleMidiMessage.bind(this);
        }
        this.midiAccess.onstatechange = (e: any) => {
          if (e.port.type === 'input' && e.port.state === 'connected') {
            e.port.onmidimessage = this.handleMidiMessage.bind(this);
          }
        };
      } catch (err) {
        console.warn('Web MIDI not supported or permission denied');
      }
    }
  }

  private handleMidiMessage(event: any) {
    const [status, note, velocity] = event.data;
    const command = status >> 4;

    if (command === 9 && velocity > 0) {
      // Note On
      this.noteOn(note, velocity / 127);
    } else if (command === 8 || (command === 9 && velocity === 0)) {
      // Note Off
      this.noteOff(note);
    } else if (command === 14) {
      // Pitch Bend (14-bit: LSB + MSB)
      const bendVal = ((velocity << 7) + note) - 8192;
      const semitones = (bendVal / 8192) * (this.currentPreset?.pitchBendRange || 2);
      this.setPitchBend(semitones);
    } else if (command === 11 && note === 1) {
      // Mod Wheel (CC 1)
      this.setModWheel(velocity / 127);
    }
  }

  public setOnMidiCallback(cb: (note: number, velocity: number, isNoteOn: boolean) => void) {
    this.onMidiNoteCallback = cb;
  }

  // Visualizer data streams
  public getWaveformData(array: Float32Array) {
    if (this.analyserNode) {
      this.analyserNode.getFloatTimeDomainData(array as any);
    }
  }

  public getFrequencyData(array: Uint8Array) {
    if (this.analyserNode) {
      this.analyserNode.getByteFrequencyData(array as any);
    }
  }

  public getActiveVoiceCount(): number {
    return this.activeVoices.size;
  }

  public getAudioContext(): AudioContext | null {
    return this.ctx;
  }
}

export const audioEngine = new SynthForgeAudioEngine();
