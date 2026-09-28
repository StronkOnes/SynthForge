# SynthForge — Flagship Hybrid Software Synthesizer

SynthForge is an original, production-grade hybrid software synthesizer built around the deep relationship between sound, movement, and musical context. It merges four distinct synthesis layers (Virtual-Analog, Wavetable, Spectral, and FM/PM/Sample) with a multi-dimensional Sound Morph engine, an expressive Motion system, an intelligent scale/chord context engine, and a tactile, dual-personality Play/Design/Performance interface.

***

## User Review & Critical Decisions

> [!IMPORTANT]
> **Architecture & Execution Strategy**: In accordance with the SynthForge specification and web application runtime, the synthesizer is engineered as a high-performance, zero-latency Web Audio / AudioWorklet hybrid DSP engine with pure client-side deterministic state, full MIDI/MPE capability, hardware-accelerated Canvas visualizers, and a modular architecture ready for desktop VST3/JUCE parity.

- **Dual-Personality UI Workflow**: Users can toggle between **Play View** (immediate performance, Sound Morph, Transform, 8 macro controls, layer balance, scale-aware chord/arp triggers), **Design View** (deep 4-layer oscillator editing, wavetable frame inspector, dual multi-mode filter routing, drag-and-drop 16-slot modulation matrix, FX rack), and **Performance View** (XY vector pads, 16-step polyphonic motion sequencer, MIDI/MPE lane monitor).
- **Core DSP & Synthesis Engines**:
  - *Layer A (Virtual Analog / Sub)*: Band-limited PolyBLEP oscillators (Sine, Triangle, Saw, Variable Pulse/PWM, Supersaw, Noise), hard sync, drift, and 16-voice unison detune.
  - *Layer B (Wavetable)*: 64-frame morphing wavetables with spectral warp, phase bend, sync, and real-time 3D/2D frame position interpolation.
  - *Layer C (FM / PM & Spectral)*: 2-operator carrier/modulator phase modulation with harmonic tilt, odd/even balance, and ratio control.
  - *Layer D (Sample & Texture / Noise)*: Multi-sample playback with loop points, pitch tracking, reverse, filter envelope, and ambient texture layering.
- **Sound Morph & Transform Innovations**: True multi-dimensional parameter interpolation (morphing spectral weight, filter states, modulation depths, and FX spaces across Patch A and Patch B) rather than simple audio crossfading.
- **Musical Context & ChordForge Engine**: Built-in harmonic intelligence supporting Key, Scale, Chord Quality, and Scale-Aware Arp/Sequencing with "Safe", "Musical", and "Adventurous" constraint modes.
- **Visual Identity**: Tailored *Deep Graphite (`#0F1115`)* canvas accented with *Electric Copper (`#D97736`)*, *Warm Amber (`#F59E0B`)*, and crisp technical hairline geometry adhering strictly to scientific telemetry design principles (zero AI slop, no pills, 60-30-10 palette discipline).

***

## 1. Overview & Core Concept

### What It Does
SynthForge delivers an end-to-end flagship software instrument directly in the browser with desktop DAW fidelity:
1. **Play & Perform**: Instant auditioning with an interactive 61-key musical keyboard (mouse, QWERTY, and Web MIDI API input with MPE support), preset browser with 30+ meticulously engineered factory patches across Hip-Hop, Trap, R&B, House, Techno, EDM, and Cinematic genres.
2. **Transform & Morph**: Continuous, musically tuned exploration via the signature **TRANSFORM** macro (0% original timbre to 100% altered persona) and the **SOUND MORPH** continuous vector blending between distinct sound identities.
3. **Sculpt & Modulate**: Deep parameter access across 4 independent sound layers, dual serial/parallel multi-mode filters (LP12/24, HP12/24, BP, Formant, Comb), 4 ADSR envelopes, 4 synced LFOs, a 16-step motion sequencer, and a visual drag-and-drop modulation matrix.
4. **Master & Polish**: Integrated 6-stage studio effects rack (Analog Saturation/Wavefold Distortion, Parametric 4-band EQ, Stereo Chorus/Flanger, Ping-Pong Delay, Algorithmic Reverb with Shimmer, and Transparent Limiter with Mono Sub Control).

### Target Audience & Persona
- **Beatmakers & Producers** (Hip-Hop, Trap, Afrobeats, R&B) who require massive 808s, punchy sub-basses, gliding synth leads, and lush neo-soul keys within seconds.
- **Electronic & Club Music Artists** (House, Tech House, Techno, Future Bass) who need surgical stereo unison, cutting supersaws, FM plucks, and tempo-synced rhythmic modulation.
- **Sound Designers & Composers** (Cinematic, Ambient, Game Audio) who build evolving soundscapes, textural drones, and organic hybrid patches.

### Key Value
Eliminates the compromise between instant musical gratification and deep synthesis architecture. Producers make music in seconds via the Play View; sound designers sculpt every harmonic nuance in the Design View.

***

## 2. User Experience & Visual Design

### Key User Flows
```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Zero-State Load ──> Loads "Dark Matter Sub" preset into Play View   │
│ 2. Audition & Tweak ──> Plays MIDI/Keys; twists TRANSFORM & MOTION     │
│ 3. Sound Morph     ──> Morphs vector from Patch A (Analog) to Patch B   │
│ 4. Preset Search   ──> Filters by Category / Genre / Character         │
│ 5. Deep Design     ──> Switches to DESIGN view; edits Osc/Filter/Matrix │
│ 6. Patch Mutate    ──> Clicks "MUTATE" (Subtle/Moderate) for new patch │
│ 7. Preset Export   ──> Saves custom preset to LocalStorage / JSON      │
└────────────────────────────────────────────────────────────────────────┘
```

### Visual Identity & Theme
- **Aesthetic Direction**: Professional audio hardware meets aerospace telemetry console. Tactile brushed graphite surfaces, high-contrast rotary dials with precision travel arcs, responsive multi-point envelopes, and active oscilloscope/FFT spectrum displays.
- **Color Palette & Discipline (60-30-10 Rule)**:
  - *60% Dominant Canvas*: Deep Graphite / Obsidian (`#0B0D11`, `#11141B`) with subtle grid guidelines.
  - *30% Structural Panels*: Flat slate & cold iron structural cards (`#181C24`, `#202530`) bounded by crisp 1px hairline borders (`#2A3140`).
  - *10% Functional Accents*:
    - **Electric Copper** (`#D97736`, `#E58A4E`): Primary branding, active oscillators, and filter drive.
    - **Warm Amber** (`#F59E0B`): Modulation routes, LFO waveforms, and Motion vectors.
    - **Phosphor Cyan** (`#06B6D4`): Wavetable 3D mesh, filter frequency cutoffs, and pitch tracking.
    - **Laser Emerald** (`#10B981`): Audio-rate activity, stereo level meters, and key tracking.
- **Typography & Precision Hierarchy**:
  - *Interface & Section Labels*: `Plus Jakarta Sans` or clean geometric sans (`font-semibold`, uppercase tracking `tracking-wider`, `text-[11px]`).
  - *Data, Frequency & Values*: Dedicated tabular monospace (`font-mono tabular-nums text-xs`).
  - *Zero-Pill Discipline*: No decorative candy capsules or mock status tickers. Metadata uses clean unboxed typography separated by `·` and `/`.
- **Layout Zones**:
  1. **Top Bar Header (44px)**: SynthForge title, Preset selector with Quick-Switch arrows, Save/Mutate/Compare buttons, Musical Context (Key/Scale selector), Global Volume & Output Limiter meter, View Mode Switcher (`PLAY` / `DESIGN` / `PERFORM`).
  2. **Upper Stage**:
     - *In Play Mode*: Sound Morph 2D Vector Surface, Master Transform & Motion Knobs, 4-Layer Balance (Sub, Body, Character, Texture), and Real-Time Oscilloscope / FFT Spectrum.
     - *In Design Mode*: 4-Layer Engine Tabs (A: Analog, B: Wavetable, C: FM/Spectral, D: Sample), Wavetable 2D/3D visualizer, Dual Multi-Mode Filter Panel with interactive frequency curve.
     - *In Perform Mode*: Dual XY Vector Controllers, 16-Step Polyphonic Arp/Step Sequencer, and MPE Gesture Pad.
  3. **Middle Stage**:
     - *In Design Mode*: 4 Modulation Generators (Env 1-4, LFO 1-4), 16-Slot Interactive Drag-and-Drop Modulation Matrix, and 6-Slot Effects Rack.
     - *In Play Mode*: 8 Macro Rotary Dials (Motion, Space, Drive, Brightness, Attack, Decay, Width, Energy) with numeric readouts.
  4. **Bottom Stage**:
     - 61-Key Interactive Piano Keyboard with octave shift (`-2` to `+2`), chord display, velocity sensitivity, hold/sustain latch, and live note highlight.

***

## 3. Key Product Decisions & Trade-Offs

### Decision 1: High-Performance Web Audio DSP Architecture
- **Chosen Approach**: Built-in multi-oscillator polyphonic voice engine utilizing Web Audio API nodes (`OscillatorNode`, `PeriodicWave` for wavetable morphing, custom band-limited wavetable tables, `BiquadFilterNode` cascades for 24dB slopes, and `ConvolverNode` / waveshaping curves) with zero audio-thread blocking and smooth parameter ramping via `setTargetAtTime`.
- **Why**: Provides instantaneous, glitch-free audio playback across all desktop browsers without external binary dependencies, enabling 64-voice polyphony and sub-5ms input latency.
- **Alternatives Considered**: WebAssembly C++ build (heavier initial download, complex cross-compilation pipeline for rapid UI iteration) vs. Web Audio native nodes (selected for maximum stability, responsive visual synchronization, and clean TypeScript integration).

### Decision 2: True Sound Morphing vs. Audio Crossfading
- **Chosen Approach**: Multi-dimensional parameter interpolation engine. When moving the Morph vector between Patch A and Patch B, the engine calculates intermediate harmonic coefficients, wavetable frame coordinates, envelope attack/decay slopes, filter cutoffs, and modulation matrix amounts in real time.
- **Why**: Delivers genuine timbral evolution and acoustic richness as specified in Section 4 of the product vision, avoiding the phase cancellation and muddy volume drops typical of simple audio crossfading.
- **Alternatives Considered**: Simple 2-track audio crossfade (rejected as superficial and uninspiring).

### Decision 3: Musical Context & ChordForge Harmony Integration
- **Chosen Approach**: Standalone musical context module that operates deterministically without external dependencies. Users choose Root Key (C through B) and Scale (Minor, Major, Dorian, Phrygian, Lydian, Mixolydian, Harmonic Minor, Minor Pentatonic, Blues). The arpeggiator, sequence randomizer, and chord-builder lock into valid scale degrees with 3 selectable modes: *Safe* (diatonic only), *Musical* (diatonic + harmonic extensions), and *Adventurous* (chromatic passing notes).
- **Why**: Allows producers of any musical background to play complex chords and arpeggios that always fit the track, while retaining full compatibility with the ChordForge specification.

***

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram
```
┌────────────────────────────────────────────────────────────────────────┐
│                              SynthForge UI                             │
├─────────────────┬───────────────────┬──────────────────┬───────────────┤
│    Play View    │    Design View    │   Perform View   │Preset Browser │
│ (Morph/Macros)  │ (Osc/Filters/Mod) │ (XY/Arp/Seq/MPE) │(Tags/Search)  │
└────────┬────────┴─────────┬─────────┴────────┬─────────┴───────┬───────┘
         │                  │                  │                 │
         ▼                  ▼                  ▼                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   SynthForge State Manager & Store                     │
│  - Active Preset & Patches A/B      - 8 Performance Macros             │
│  - 4 Layer Configs (A, B, C, D)    - Modulation Matrix (16 routes)    │
│  - Dual Filter States & Routing     - Effects Rack Parameters          │
│  - Musical Context (Key, Scale)     - Arp & 16-Step Sequencer State    │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Real-time param dispatch
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Web Audio DSP Engine (Polyphonic)                  │
├────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Voice Allocator (64 Voices, Dynamic Stealing, Retrigger, Glide)   │  │
│  └───────┬──────────────────────────┬────────────────────────┬──────┘  │
│          ▼                          ▼                        ▼         │
│  ┌───────────────┐          ┌───────────────┐        ┌───────────────┐ │
│  │ Layer A (VA)  │          │ Layer B (WT)  │        │ Layer C (FM)  │ │
│  │ PolyBLEP Saw/ │          │ Morphing 64   │        │ 2-Op Phase    │ │
│  │ Pulse/Sub/PWM │          │ Frame Tables  │        │ Modulation    │ │
│  └───────┬───────┘          └───────┬───────┘        └───────┬───────┘ │
│          │                          │                        │         │
│          └────────────────────┬─────┴────────────────────────┘         │
│                               ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Dual Multi-Mode Filters (LP12/24, HP12/24, BP, Formant, Comb)    │  │
│  │ Serial / Parallel / Split Routing with Drive & Key Tracking      │  │
│  └────────────────────────────┬─────────────────────────────────────┘  │
│                               ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Studio Effects Rack (Distortion -> EQ -> Chorus -> Delay -> Reverb)│
│  └────────────────────────────┬─────────────────────────────────────┘  │
│                               ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Master Stage (Stereo Width -> Brickwall Limiter -> Visualizer FFT)│  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Models & State Structure

```typescript
export interface SynthLayerConfig {
  id: 'A' | 'B' | 'C' | 'D';
  name: string;
  enabled: boolean;
  engineType: 'analog' | 'wavetable' | 'fm' | 'sample';
  role: 'sub' | 'body' | 'character' | 'texture';
  volume: number; // 0..1
  pan: number;    // -1..1
  octave: number; // -3..+3
  semi: number;   // -12..+12
  fine: number;   // -100..+100 cents
  unisonVoices: number; // 1..8
  unisonDetune: number; // 0..100
  unisonSpread: number; // 0..100
  // Engine specific params
  analogWaveform?: 'sawtooth' | 'square' | 'triangle' | 'sine' | 'supersaw';
  pulseWidth?: number;
  wavetableId?: string;
  wavetablePos?: number; // 0..1
  wavetableWarp?: 'bend' | 'sync' | 'mirror' | 'none';
  fmRatio?: number;
  fmDepth?: number;
  sampleId?: string;
}

export interface ModulationRoute {
  id: string;
  source: 'lfo1' | 'lfo2' | 'lfo3' | 'lfo4' | 'env1' | 'env2' | 'env3' | 'env4' | 'velocity' | 'modwheel' | 'macro1' | 'macro2' | 'motion' | 'random';
  destination: 'filter1Cutoff' | 'filter2Cutoff' | 'wtPos' | 'fmDepth' | 'pitch' | 'distortionDrive' | 'reverbMix' | 'pan';
  amount: number; // -1.0 .. +1.0
  enabled: boolean;
}

export interface PresetData {
  id: string;
  name: string;
  author: string;
  category: 'Bass' | 'Lead' | 'Pad' | 'Keys' | 'Pluck' | 'Arp' | 'Texture' | 'FX';
  genre: 'Trap' | 'Hip-Hop' | 'R&B' | 'House' | 'Techno' | 'EDM' | 'Cinematic' | 'Ambient';
  character: string[];
  description: string;
  layers: Record<'A' | 'B' | 'C' | 'D', SynthLayerConfig>;
  filters: FilterSystemConfig;
  envelopes: ADSRConfig[];
  lfos: LFOConfig[];
  modulation: ModulationRoute[];
  fx: EffectsRackConfig;
  macros: Record<string, number>;
  transformStateB?: Partial<PresetData>;
}
```

### Interactive Component & State Mapping

| UI Component | User Action | State Mutation & Audio Engine Event |
| :--- | :--- | :--- |
| **Piano Key / MIDI Note** | Click or NoteOn | Allocates voice, triggers ADSR envelopes, tracks key frequency and velocity. |
| **TRANSFORM Dial** | Rotary drag (0-100%) | Interpolates between default patch state and alternate timbre state B. |
| **SOUND MORPH Pad** | 2D vector drag (X/Y) | Smoothly interpolates weights between Sub, Body, Character, and Texture layers. |
| **Filter Cutoff/Res** | Drag node on SVG curve | Updates `BiquadFilterNode` frequency and Q with exponential smoothing. |
| **Mod Matrix Slot** | Select source & target | Binds AudioRate/ControlRate modulation routing with live bipolar depth. |
| **MUTATE Button** | Click (Subtle/Wild) | Deterministically varies wavetable pos, filter resonance, and LFO rates safely. |
| **Preset Card** | Click in Browser | Restores complete engine state, updates UI sliders, and loads sound definition. |
| **Key/Scale Selector** | Change dropdown | Updates Arp note quantization and highlights active scale notes on keyboard. |

***

## 5. Verification & Quality Plan

1. **Audio Engine Verification**:
   - Zero audible clicks or pops during voice allocation and voice stealing.
   - Band-limited oscillators tested across 20 Hz to 20,000 Hz.
   - Filter stability verified with maximum resonance and high drive.
2. **Interactive Controls & Web MIDI**:
   - Mouse click, QWERTY keyboard triggers, and hardware Web MIDI keyboard tested.
   - Real-time oscilloscope canvas rendering smoothly at 60 FPS without UI jank.
3. **Preset & State Integrity**:
   - 30+ built-in presets load reliably with verified sound output across all categories.
   - Custom presets exportable and importable via JSON with LocalStorage persistence.
4. **Build & Lint Verification**:
   - TypeScript compilation check (`compile_applet`) and ESLint validation (`lint_applet`).
