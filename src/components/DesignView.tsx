import React, { useState, useRef, useEffect } from 'react';
import { SynthPreset, EngineType, LayerSettings, MasterFXSettings } from '../types/synth';
import { Knob } from './Knob';
import { WAVETABLES } from '../constants/wavetables';
import {
  Layers,
  Activity,
  Sliders,
  Cpu,
  Waves,
  Zap,
  Radio,
  Flame,
  Volume2
} from 'lucide-react';

interface DesignViewProps {
  preset: SynthPreset;
  onLayerChange: (layerIndex: number, updatedLayer: LayerSettings) => void;
  onFXChange: (updatedFX: MasterFXSettings) => void;
}

export const DesignView: React.FC<DesignViewProps> = ({
  preset,
  onLayerChange,
  onFXChange
}) => {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'engine' | 'filter' | 'envelopes' | 'fx'>('engine');

  const layer = preset.layers[selectedLayerIndex];
  const fx = preset.masterFX;

  // Wavetable preview canvas
  const wtCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = wtCanvasRef.current;
    if (!canvas || layer.engine !== 'wavetable') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, width, height);

    const wtSpec = WAVETABLES.find(w => w.id === layer.wavetableId) || WAVETABLES[0];
    const { imag } = wtSpec.getHarmonics(layer.wavetablePos);

    // Draw synthesized single-cycle waveform from Fourier series
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ff7a3d';
    ctx.shadowColor = 'rgba(255, 122, 61, 0.7)';
    ctx.shadowBlur = 8;
    ctx.beginPath();

    const points = 256;
    for (let i = 0; i < points; i++) {
      const phase = (i / points) * Math.PI * 2;
      let sample = 0;
      for (let n = 1; n < 32; n++) {
        sample += (imag[n] || 0) * Math.sin(n * phase);
      }
      const x = (i / points) * width;
      const y = height / 2 - sample * (height * 0.35);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [layer.engine, layer.wavetableId, layer.wavetablePos]);

  // Filter curve canvas
  const filterCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = filterCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.fillStyle = '#0d1118';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#263040';
    ctx.lineWidth = 1;
    // Log grid lines: 100Hz, 1kHz, 10kHz
    ctx.beginPath();
    ctx.moveTo(width * 0.25, 0); ctx.lineTo(width * 0.25, height);
    ctx.moveTo(width * 0.55, 0); ctx.lineTo(width * 0.55, height);
    ctx.moveTo(width * 0.85, 0); ctx.lineTo(width * 0.85, height);
    ctx.stroke();

    // Draw filter response curve
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#fbbf24';
    ctx.beginPath();

    const cutoff = layer.filterA.cutoff;
    const normCutoff = Math.log10(cutoff / 20) / Math.log10(20000 / 20); // 0 to 1
    const cutoffPx = normCutoff * width;
    const resPeak = (layer.filterA.resonance / 12) * (height * 0.4);

    for (let x = 0; x < width; x++) {
      let y = height * 0.6;
      if (layer.filterA.type.startsWith('lp')) {
        if (x < cutoffPx) {
          y -= (resPeak * Math.exp(-Math.pow((x - cutoffPx) / 25, 2)));
        } else {
          const slope = (x - cutoffPx) * 0.8;
          y = Math.min(height - 2, y + slope - resPeak * Math.exp(-Math.pow((x - cutoffPx) / 20, 2)));
        }
      } else if (layer.filterA.type.startsWith('hp')) {
        if (x > cutoffPx) {
          y -= (resPeak * Math.exp(-Math.pow((x - cutoffPx) / 25, 2)));
        } else {
          const slope = (cutoffPx - x) * 0.8;
          y = Math.min(height - 2, y + slope);
        }
      } else {
        // Bandpass / Formant
        y = height * 0.85 - (resPeak * 2 * Math.exp(-Math.pow((x - cutoffPx) / 30, 2)));
      }

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [layer.filterA.cutoff, layer.filterA.resonance, layer.filterA.type]);

  const updateSelectedLayer = (partial: Partial<LayerSettings>) => {
    onLayerChange(selectedLayerIndex, { ...layer, ...partial });
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto bg-[#0a0d12]">
      {/* Layer Tabs Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121620] border border-neutral-800 p-2 rounded-xl">
        <div className="flex items-center gap-2">
          {preset.layers.map((l, idx) => (
            <button
              key={l.id}
              onClick={() => setSelectedLayerIndex(idx)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                selectedLayerIndex === idx
                  ? 'bg-amber-500 text-neutral-950 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <span>LAYER {l.id}</span>
              <span className={`text-[10px] uppercase px-1 rounded ${
                selectedLayerIndex === idx ? 'bg-neutral-950/30 text-neutral-950' : 'text-neutral-500'
              }`}>
                {l.role}
              </span>
            </button>
          ))}
        </div>

        {/* Section Tabs inside Layer */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab('engine')}
            className={`px-3 py-1 rounded transition-colors ${activeTab === 'engine' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-400 hover:text-white'}`}
          >
            Engine
          </button>
          <button
            onClick={() => setActiveTab('filter')}
            className={`px-3 py-1 rounded transition-colors ${activeTab === 'filter' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-400 hover:text-white'}`}
          >
            Dual Filter
          </button>
          <button
            onClick={() => setActiveTab('envelopes')}
            className={`px-3 py-1 rounded transition-colors ${activeTab === 'envelopes' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-400 hover:text-white'}`}
          >
            Envelopes & LFO
          </button>
          <button
            onClick={() => setActiveTab('fx')}
            className={`px-3 py-1 rounded transition-colors ${activeTab === 'fx' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-400 hover:text-white'}`}
          >
            Master FX Rack
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'engine' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Engine Selector & Tuning (4 cols) */}
          <div className="lg:col-span-4 bg-[#121620] border border-neutral-800 rounded-xl p-4 shadow-xl flex flex-col gap-4 font-mono text-xs">
            <div>
              <h3 className="font-bold text-white uppercase tracking-wider text-xs mb-1 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                Synthesis Engine Type
              </h3>
              <p className="text-[10px] text-neutral-400 font-sans">
                Select core audio oscillator architecture for Layer {layer.id}
              </p>
            </div>

            {/* Engine Type Pills */}
            <div className="grid grid-cols-2 gap-2">
              {(['analog', 'wavetable', 'spectral', 'fm', 'sample'] as EngineType[]).map((eng) => (
                <button
                  key={eng}
                  onClick={() => updateSelectedLayer({ engine: eng })}
                  className={`px-3 py-2 rounded-lg border font-bold uppercase tracking-wider transition-all ${
                    layer.engine === eng
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {eng}
                </button>
              ))}
            </div>

            {/* Tuning Knobs */}
            <div className="pt-3 border-t border-neutral-800">
              <span className="text-neutral-400 uppercase text-[10px] font-semibold block mb-2">
                Pitch Tuning & Panning
              </span>
              <div className="grid grid-cols-4 gap-2 justify-items-center">
                <Knob
                  label="OCT"
                  value={layer.octave}
                  min={-3}
                  max={3}
                  step={1}
                  defaultValue={0}
                  size="sm"
                  onChange={(v) => updateSelectedLayer({ octave: v })}
                />
                <Knob
                  label="SEMI"
                  value={layer.semitone}
                  min={-12}
                  max={12}
                  step={1}
                  defaultValue={0}
                  size="sm"
                  onChange={(v) => updateSelectedLayer({ semitone: v })}
                />
                <Knob
                  label="FINE"
                  value={layer.fine}
                  min={-50}
                  max={50}
                  step={1}
                  defaultValue={0}
                  size="sm"
                  unit="c"
                  onChange={(v) => updateSelectedLayer({ fine: v })}
                />
                <Knob
                  label="PAN"
                  value={layer.pan}
                  min={-1}
                  max={1}
                  defaultValue={0}
                  size="sm"
                  color="cyan"
                  onChange={(v) => updateSelectedLayer({ pan: v })}
                />
              </div>
            </div>
          </div>

          {/* Right: Engine Specific Parameters (8 cols) */}
          <div className="lg:col-span-8 bg-[#121620] border border-neutral-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
            {/* 1. ANALOG ENGINE */}
            {layer.engine === 'analog' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <h4 className="font-mono text-xs font-bold text-white uppercase flex items-center gap-1.5">
                    <Waves className="w-4 h-4 text-amber-400" />
                    Virtual Analog Oscillators
                  </h4>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Bandlimited anti-aliased oscillators with supersaw unison
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(['sine', 'triangle', 'saw', 'square', 'supersaw'] as any[]).map((wave) => (
                    <button
                      key={wave}
                      onClick={() => updateSelectedLayer({ analogWave: wave })}
                      className={`px-3 py-1.5 rounded font-mono text-xs font-bold uppercase transition-all ${
                        layer.analogWave === wave
                          ? 'bg-amber-500 text-neutral-950 shadow'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {wave}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center pt-3 border-t border-neutral-800">
                  <Knob
                    label="UNISON"
                    value={layer.unisonVoices}
                    min={1}
                    max={8}
                    step={1}
                    size="md"
                    onChange={(v) => updateSelectedLayer({ unisonVoices: v })}
                  />
                  <Knob
                    label="DETUNE"
                    value={layer.unisonDetune}
                    size="md"
                    onChange={(v) => updateSelectedLayer({ unisonDetune: v })}
                  />
                  <Knob
                    label="SPREAD"
                    value={layer.stereoSpread}
                    size="md"
                    color="cyan"
                    onChange={(v) => updateSelectedLayer({ stereoSpread: v })}
                  />
                  <Knob
                    label="PW"
                    value={layer.pulseWidth}
                    min={0.1}
                    max={0.9}
                    size="md"
                    onChange={(v) => updateSelectedLayer({ pulseWidth: v })}
                  />
                </div>
              </div>
            )}

            {/* 2. WAVETABLE ENGINE */}
            {layer.engine === 'wavetable' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800 font-mono text-xs">
                  <h4 className="font-bold text-white uppercase flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-orange-400" />
                    Wavetable Oscillator (64 Frames)
                  </h4>
                  <select
                    value={layer.wavetableId}
                    onChange={(e) => updateSelectedLayer({ wavetableId: e.target.value })}
                    className="bg-neutral-900 border border-neutral-800 text-amber-400 font-bold rounded px-2 py-1 outline-none text-xs"
                  >
                    {WAVETABLES.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Wavetable Visualizer Canvas */}
                <canvas
                  ref={wtCanvasRef}
                  width={480}
                  height={110}
                  className="w-full h-28 rounded-lg border border-neutral-800"
                />

                {/* Position Slider & Warp controls */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-neutral-400 text-[10px]">
                    <span>FRAME 01</span>
                    <span className="font-bold text-amber-400">
                      POSITION: {Math.round(layer.wavetablePos * 63) + 1} / 64
                    </span>
                    <span>FRAME 64</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={layer.wavetablePos}
                    onChange={(e) => updateSelectedLayer({ wavetablePos: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-neutral-900 rounded accent-amber-500 cursor-ew-resize"
                  />
                </div>
              </div>
            )}

            {/* 3. SPECTRAL ENGINE */}
            {layer.engine === 'spectral' && (
              <div className="flex flex-col gap-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <h4 className="font-bold text-white uppercase flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-sky-400" />
                    Spectral Harmonic Additive Engine
                  </h4>
                  <span className="text-[10px] text-neutral-400">
                    Direct mathematical manipulation of harmonic overtones
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                  <Knob
                    label="HARMONICS"
                    value={layer.harmonicCount}
                    min={4}
                    max={32}
                    step={1}
                    size="md"
                    color="cyan"
                    onChange={(v) => updateSelectedLayer({ harmonicCount: v })}
                  />
                  <Knob
                    label="TILT"
                    value={layer.harmonicTilt}
                    min={-1}
                    max={1}
                    size="md"
                    onChange={(v) => updateSelectedLayer({ harmonicTilt: v })}
                  />
                  <Knob
                    label="ODD/EVEN"
                    value={layer.oddEvenBalance}
                    min={-1}
                    max={1}
                    size="md"
                    color="amber"
                    onChange={(v) => updateSelectedLayer({ oddEvenBalance: v })}
                  />
                  <Knob
                    label="SHIFT"
                    value={layer.spectralShift}
                    min={-1}
                    max={1}
                    size="md"
                    onChange={(v) => updateSelectedLayer({ spectralShift: v })}
                  />
                </div>
              </div>
            )}

            {/* 4. FM ENGINE */}
            {layer.engine === 'fm' && (
              <div className="flex flex-col gap-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <h4 className="font-bold text-white uppercase flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    2-Operator FM / PM Synthesis Matrix
                  </h4>
                  <span className="text-[10px] text-neutral-400">
                    Carrier modulated at harmonic ratios with feedback
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                  <Knob
                    label="FM RATIO"
                    value={layer.fmRatio}
                    min={0.5}
                    max={12}
                    step={0.5}
                    size="md"
                    color="copper"
                    onChange={(v) => updateSelectedLayer({ fmRatio: v })}
                  />
                  <Knob
                    label="FM DEPTH"
                    value={layer.fmDepth}
                    size="md"
                    color="amber"
                    onChange={(v) => updateSelectedLayer({ fmDepth: v })}
                  />
                  <Knob
                    label="FEEDBACK"
                    value={layer.fmFeedback}
                    size="md"
                    onChange={(v) => updateSelectedLayer({ fmFeedback: v })}
                  />
                  <Knob
                    label="LEVEL"
                    value={layer.volume}
                    size="md"
                    onChange={(v) => updateSelectedLayer({ volume: v })}
                  />
                </div>
              </div>
            )}

            {/* 5. SAMPLE / NOISE ENGINE */}
            {layer.engine === 'sample' && (
              <div className="flex flex-col gap-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <h4 className="font-bold text-white uppercase flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    Sample / Noise & Transient Generator
                  </h4>
                  <span className="text-[10px] text-neutral-400">
                    Authentic organic textures, vinyl crackle, tape hiss, transient attacks
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {(['vinyl_crackle', 'tape_hiss', 'white', 'sub_transient', 'digital_grit'] as any[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => updateSelectedLayer({ noiseType: type })}
                      className={`px-3 py-2 rounded-lg border font-bold uppercase transition-all ${
                        layer.noiseType === type
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dual Filter Section */}
      {activeTab === 'filter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 bg-[#121620] border border-neutral-800 rounded-xl p-4 shadow-xl flex flex-col gap-3 font-mono text-xs">
            <h4 className="font-bold text-white uppercase flex items-center gap-1.5 pb-2 border-b border-neutral-800">
              <Flame className="w-4 h-4 text-amber-400" />
              Filter A Type & Response
            </h4>

            {/* Filter Type Pills */}
            <div className="grid grid-cols-3 gap-1.5">
              {(['lp12', 'lp24', 'hp12', 'hp24', 'bp', 'notch', 'comb', 'formant', 'ladder'] as any[]).map((ft) => (
                <button
                  key={ft}
                  onClick={() => updateSelectedLayer({
                    filterA: { ...layer.filterA, type: ft }
                  })}
                  className={`px-2 py-1.5 rounded border text-[10px] font-bold uppercase transition-all ${
                    layer.filterA.type === ft
                      ? 'bg-amber-500 text-neutral-950 border-amber-400'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {ft}
                </button>
              ))}
            </div>

            {/* Filter Knobs */}
            <div className="grid grid-cols-4 gap-2 justify-items-center pt-3 border-t border-neutral-800">
              <Knob
                label="CUTOFF"
                value={layer.filterA.cutoff}
                min={20}
                max={20000}
                defaultValue={4000}
                size="md"
                unit="Hz"
                onChange={(v) => updateSelectedLayer({
                  filterA: { ...layer.filterA, cutoff: v }
                })}
              />
              <Knob
                label="RES"
                value={layer.filterA.resonance}
                min={0.1}
                max={15}
                defaultValue={2}
                size="md"
                onChange={(v) => updateSelectedLayer({
                  filterA: { ...layer.filterA, resonance: v }
                })}
              />
              <Knob
                label="DRIVE"
                value={layer.filterA.drive}
                size="md"
                color="copper"
                onChange={(v) => updateSelectedLayer({
                  filterA: { ...layer.filterA, drive: v }
                })}
              />
              <Knob
                label="ENV"
                value={layer.filterA.envAmount}
                min={-1}
                max={1}
                size="md"
                onChange={(v) => updateSelectedLayer({
                  filterA: { ...layer.filterA, envAmount: v }
                })}
              />
            </div>
          </div>

          {/* Filter Visual Response Curve */}
          <div className="lg:col-span-7 bg-[#121620] border border-neutral-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800 font-mono text-xs">
              <span className="font-bold text-white uppercase">Frequency Response & Saturation</span>
              <span className="text-amber-400">{Math.round(layer.filterA.cutoff)} Hz</span>
            </div>
            <canvas
              ref={filterCanvasRef}
              width={480}
              height={150}
              className="w-full h-36 rounded-lg border border-neutral-800 my-2"
            />
          </div>
        </div>
      )}

      {/* Envelopes & LFO */}
      {activeTab === 'envelopes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amp Envelope */}
          <div className="bg-[#121620] border border-neutral-800 rounded-xl p-4 shadow-xl flex flex-col gap-3 font-mono text-xs">
            <h4 className="font-bold text-white uppercase pb-2 border-b border-neutral-800">
              Amp Envelope (ADSR)
            </h4>
            <div className="grid grid-cols-4 gap-2 justify-items-center">
              <Knob
                label="ATTACK"
                value={layer.ampEnv.attack}
                min={0.001}
                max={3.0}
                unit="s"
                size="md"
                onChange={(v) => updateSelectedLayer({ ampEnv: { ...layer.ampEnv, attack: v } })}
              />
              <Knob
                label="DECAY"
                value={layer.ampEnv.decay}
                min={0.01}
                max={4.0}
                unit="s"
                size="md"
                onChange={(v) => updateSelectedLayer({ ampEnv: { ...layer.ampEnv, decay: v } })}
              />
              <Knob
                label="SUSTAIN"
                value={layer.ampEnv.sustain}
                size="md"
                onChange={(v) => updateSelectedLayer({ ampEnv: { ...layer.ampEnv, sustain: v } })}
              />
              <Knob
                label="RELEASE"
                value={layer.ampEnv.release}
                min={0.01}
                max={6.0}
                unit="s"
                size="md"
                onChange={(v) => updateSelectedLayer({ ampEnv: { ...layer.ampEnv, release: v } })}
              />
            </div>
          </div>

          {/* LFO 1 */}
          <div className="bg-[#121620] border border-neutral-800 rounded-xl p-4 shadow-xl flex flex-col gap-3 font-mono text-xs">
            <h4 className="font-bold text-white uppercase pb-2 border-b border-neutral-800">
              LFO 1 Modulation Generator
            </h4>
            <div className="grid grid-cols-3 gap-2 justify-items-center">
              <Knob
                label="RATE"
                value={layer.lfo1.rate}
                min={0.1}
                max={20}
                unit="Hz"
                size="md"
                onChange={(v) => updateSelectedLayer({ lfo1: { ...layer.lfo1, rate: v } })}
              />
              <Knob
                label="DEPTH"
                value={layer.lfo1.depth}
                size="md"
                color="amber"
                onChange={(v) => updateSelectedLayer({ lfo1: { ...layer.lfo1, depth: v } })}
              />
              <Knob
                label="PHASE"
                value={layer.lfo1.phase}
                min={0}
                max={360}
                unit="°"
                size="md"
                onChange={(v) => updateSelectedLayer({ lfo1: { ...layer.lfo1, phase: v } })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Master FX Rack */}
      {activeTab === 'fx' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* Distortion */}
          <div className="bg-[#121620] border border-neutral-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="font-bold text-white uppercase">Distortion</span>
              <button
                onClick={() => onFXChange({
                  ...fx,
                  distortion: { ...fx.distortion, enabled: !fx.distortion.enabled }
                })}
                className={`px-2 py-0.5 rounded text-[10px] ${fx.distortion.enabled ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-500'}`}
              >
                {fx.distortion.enabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 justify-items-center">
              <Knob
                label="DRIVE"
                value={fx.distortion.drive}
                size="sm"
                color="copper"
                onChange={(v) => onFXChange({ ...fx, distortion: { ...fx.distortion, drive: v } })}
              />
              <Knob
                label="TONE"
                value={fx.distortion.tone}
                size="sm"
                onChange={(v) => onFXChange({ ...fx, distortion: { ...fx.distortion, tone: v } })}
              />
              <Knob
                label="MIX"
                value={fx.distortion.mix}
                size="sm"
                onChange={(v) => onFXChange({ ...fx, distortion: { ...fx.distortion, mix: v } })}
              />
            </div>
          </div>

          {/* Delay */}
          <div className="bg-[#121620] border border-neutral-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="font-bold text-white uppercase">Stereo Delay</span>
              <button
                onClick={() => onFXChange({
                  ...fx,
                  delay: { ...fx.delay, enabled: !fx.delay.enabled }
                })}
                className={`px-2 py-0.5 rounded text-[10px] ${fx.delay.enabled ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-500'}`}
              >
                {fx.delay.enabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 justify-items-center">
              <Knob
                label="TIME"
                value={fx.delay.timeL}
                min={0.05}
                max={1.0}
                unit="s"
                size="sm"
                onChange={(v) => onFXChange({ ...fx, delay: { ...fx.delay, timeL: v, timeR: v * 1.5 } })}
              />
              <Knob
                label="FDBK"
                value={fx.delay.feedback}
                min={0}
                max={0.9}
                size="sm"
                onChange={(v) => onFXChange({ ...fx, delay: { ...fx.delay, feedback: v } })}
              />
              <Knob
                label="MIX"
                value={fx.delay.mix}
                size="sm"
                onChange={(v) => onFXChange({ ...fx, delay: { ...fx.delay, mix: v } })}
              />
            </div>
          </div>

          {/* Reverb */}
          <div className="bg-[#121620] border border-neutral-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="font-bold text-white uppercase">Shimmer Reverb</span>
              <button
                onClick={() => onFXChange({
                  ...fx,
                  reverb: { ...fx.reverb, enabled: !fx.reverb.enabled }
                })}
                className={`px-2 py-0.5 rounded text-[10px] ${fx.reverb.enabled ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-500'}`}
              >
                {fx.reverb.enabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 justify-items-center">
              <Knob
                label="DECAY"
                value={fx.reverb.decay}
                min={0.5}
                max={8.0}
                unit="s"
                size="sm"
                onChange={(v) => onFXChange({ ...fx, reverb: { ...fx.reverb, decay: v } })}
              />
              <Knob
                label="SHIMMER"
                value={fx.reverb.shimmer}
                size="sm"
                color="cyan"
                onChange={(v) => onFXChange({ ...fx, reverb: { ...fx.reverb, shimmer: v } })}
              />
              <Knob
                label="MIX"
                value={fx.reverb.mix}
                size="sm"
                onChange={(v) => onFXChange({ ...fx, reverb: { ...fx.reverb, mix: v } })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
