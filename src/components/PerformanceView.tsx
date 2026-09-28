import React, { useState, useRef } from 'react';
import { SynthPreset, ArpeggiatorSettings, MotionMode } from '../types/synth';
import { Knob } from './Knob';
import { audioEngine } from '../audio/AudioEngine';
import { getScaleMidiNotes, NOTES, SCALES } from '../constants/musicalScales';
import {
  Compass,
  Play,
  Square,
  Sparkles,
  Repeat
} from 'lucide-react';

interface PerformanceViewProps {
  preset: SynthPreset;
  onArpChange: (arp: ArpeggiatorSettings) => void;
  onMotionChange: (mode: MotionMode, intensity: number) => void;
  onMacroChange: (macro: any, val: number) => void;
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({
  preset,
  onArpChange,
  onMotionChange,
  onMacroChange
}) => {
  const arp = preset.arpeggiator;

  // XY Pad 1 state (Bright vs Motion)
  const [xy1, setXy1] = useState({ x: preset.macros.bright, y: preset.macros.motion });
  const [xy2, setXy2] = useState({ x: preset.macros.space, y: preset.macros.drive });

  const isDraggingXY1 = useRef(false);
  const isDraggingXY2 = useRef(false);

  const handleXY1 = (clientX: number, clientY: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
    setXy1({ x, y });
    onMacroChange('bright', x);
    onMacroChange('motion', y);
  };

  const handleXY2 = (clientX: number, clientY: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
    setXy2({ x, y });
    onMacroChange('space', x);
    onMacroChange('drive', y);
  };

  // Diatonic scale chord trigger pads
  const rootIndex = NOTES.indexOf(preset.musicalContext.key as any) || 0;
  const scale = SCALES[preset.musicalContext.scale] || SCALES['Minor'];
  const baseMidi = 48 + rootIndex; // C3

  const diatonicChords = [
    { degree: 'I', label: 'Tonic Root', semitone: scale.intervals[0] || 0 },
    { degree: 'ii', label: 'Supertonic', semitone: scale.intervals[1] || 2 },
    { degree: 'iii', label: 'Mediant', semitone: scale.intervals[2] || 3 },
    { degree: 'IV', label: 'Subdominant', semitone: scale.intervals[3] || 5 },
    { degree: 'V', label: 'Dominant', semitone: scale.intervals[4] || 7 },
    { degree: 'vi', label: 'Submediant', semitone: scale.intervals[5] || 8 },
    { degree: 'vii°', label: 'Leading', semitone: scale.intervals[6] || 10 },
    { degree: 'VIII', label: 'Octave', semitone: 12 + (scale.intervals[0] || 0) }
  ];

  const playDiatonicChord = (chordRootSemitone: number) => {
    const root = baseMidi + chordRootSemitone;
    const third = root + (preset.musicalContext.scale.includes('Minor') ? 3 : 4);
    const fifth = root + 7;
    const seventh = root + (preset.musicalContext.scale.includes('Minor') ? 10 : 11);

    audioEngine.noteOn(root, 0.9);
    audioEngine.noteOn(third, 0.85);
    audioEngine.noteOn(fifth, 0.85);
    audioEngine.noteOn(seventh, 0.8);

    setTimeout(() => {
      audioEngine.noteOff(root);
      audioEngine.noteOff(third);
      audioEngine.noteOff(fifth);
      audioEngine.noteOff(seventh);
    }, 700);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto bg-[#0a0d12]">
      {/* Top Section: Dual XY Vector Controllers & Motion Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* XY Pad 1: Timbre vs Motion */}
        <div className="lg:col-span-4 bg-[#121620] border border-neutral-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800 font-mono text-xs">
            <span className="font-bold text-white uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" />
              XY 1: Bright vs Motion
            </span>
            <span className="text-[10px] text-neutral-400">
              X: {Math.round(xy1.x * 100)}% | Y: {Math.round(xy1.y * 100)}%
            </span>
          </div>

          <div
            className="relative w-full h-44 bg-[#0a0d14] rounded-lg border border-neutral-800 my-2 cursor-crosshair overflow-hidden"
            onMouseDown={(e) => {
              isDraggingXY1.current = true;
              const rect = e.currentTarget.getBoundingClientRect();
              handleXY1(e.clientX, e.clientY, rect);
              const onMove = (ev: MouseEvent) => {
                if (isDraggingXY1.current) handleXY1(ev.clientX, ev.clientY, rect);
              };
              const onUp = () => {
                isDraggingXY1.current = false;
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
              };
              window.addEventListener('mousemove', onMove);
              window.addEventListener('mouseup', onUp);
            }}
          >
            {/* Grid crosshair */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-20">
              <div className="border-r border-b border-neutral-600" />
              <div className="border-r border-b border-neutral-600" />
              <div className="border-r border-b border-neutral-600" />
              <div className="border-b border-neutral-600" />
            </div>

            {/* Glowing puck indicator */}
            <div
              className="absolute w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] pointer-events-none transition-all duration-75 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${xy1.x * 100}%`, top: `${(1 - xy1.y) * 100}%` }}
            />
          </div>

          <div className="flex justify-between font-mono text-[9px] text-neutral-500 uppercase">
            <span>← Darker</span>
            <span>Brighter →</span>
          </div>
        </div>

        {/* XY Pad 2: Space vs Drive */}
        <div className="lg:col-span-4 bg-[#121620] border border-neutral-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800 font-mono text-xs">
            <span className="font-bold text-white uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-orange-400" />
              XY 2: Space vs Drive
            </span>
            <span className="text-[10px] text-neutral-400">
              X: {Math.round(xy2.x * 100)}% | Y: {Math.round(xy2.y * 100)}%
            </span>
          </div>

          <div
            className="relative w-full h-44 bg-[#0a0d14] rounded-lg border border-neutral-800 my-2 cursor-crosshair overflow-hidden"
            onMouseDown={(e) => {
              isDraggingXY2.current = true;
              const rect = e.currentTarget.getBoundingClientRect();
              handleXY2(e.clientX, e.clientY, rect);
              const onMove = (ev: MouseEvent) => {
                if (isDraggingXY2.current) handleXY2(ev.clientX, ev.clientY, rect);
              };
              const onUp = () => {
                isDraggingXY2.current = false;
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
              };
              window.addEventListener('mousemove', onMove);
              window.addEventListener('mouseup', onUp);
            }}
          >
            <div
              className="absolute w-5 h-5 rounded-full bg-gradient-to-r from-orange-400 to-rose-500 shadow-[0_0_15px_rgba(234,88,12,0.8)] pointer-events-none transition-all duration-75 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${xy2.x * 100}%`, top: `${(1 - xy2.y) * 100}%` }}
            />
          </div>

          <div className="flex justify-between font-mono text-[9px] text-neutral-500 uppercase">
            <span>← Dry</span>
            <span>Ambient Space →</span>
          </div>
        </div>

        {/* Motion Engine Modes */}
        <div className="lg:col-span-4 bg-[#121620] border border-neutral-800 rounded-xl p-4 shadow-xl flex flex-col justify-between font-mono text-xs">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="font-bold text-white uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-400" />
                Motion Engine Trajectory
              </span>
              <button
                onClick={() => onMotionChange(preset.motion.mode, preset.motion.intensity > 0 ? 0 : 0.5)}
                className={`px-2 py-0.5 rounded text-[10px] ${preset.motion.enabled ? 'bg-sky-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-500'}`}
              >
                {preset.motion.enabled ? 'RUNNING' : 'OFF'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 my-3">
              {(['pulse', 'drift', 'evolve', 'bounce', 'spiral', 'rhythmic'] as MotionMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onMotionChange(mode, preset.motion.intensity)}
                  className={`px-3 py-1.5 rounded-lg border font-bold uppercase transition-all ${
                    preset.motion.mode === mode
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-around pt-2 border-t border-neutral-800">
            <Knob
              label="INTENSITY"
              value={preset.motion.intensity}
              size="md"
              color="cyan"
              onChange={(v) => onMotionChange(preset.motion.mode, v)}
            />
            <Knob
              label="FILTER MOD"
              value={preset.motion.depthToFilter}
              size="md"
              onChange={(v) => onArpChange({ ...arp })}
            />
          </div>
        </div>
      </div>

      {/* 16-Step Arpeggiator & Musical Sequencer Grid */}
      <div className="bg-[#121620] border border-neutral-800 rounded-xl p-4 shadow-xl flex flex-col gap-3 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between pb-2 border-b border-neutral-800 gap-2">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white uppercase flex items-center gap-1.5">
              <Repeat className="w-4 h-4 text-amber-400" />
              16-Step Polyphonic Arpeggiator & Sequencer
            </span>
            <button
              onClick={() => onArpChange({ ...arp, enabled: !arp.enabled })}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all ${
                arp.enabled
                  ? 'bg-amber-500 text-neutral-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {arp.enabled ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {arp.enabled ? 'STOP' : 'START'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Arp Mode */}
            <select
              value={arp.mode}
              onChange={(e) => onArpChange({ ...arp, mode: e.target.value as any })}
              className="bg-neutral-900 border border-neutral-800 text-amber-400 font-bold rounded px-2 py-1 outline-none text-xs"
            >
              <option value="up">UP</option>
              <option value="down">DOWN</option>
              <option value="up_down">UP/DOWN</option>
              <option value="random">RANDOM</option>
              <option value="chord">CHORD</option>
            </select>

            {/* Rate */}
            <select
              value={arp.rate}
              onChange={(e) => onArpChange({ ...arp, rate: e.target.value })}
              className="bg-neutral-900 border border-neutral-800 text-neutral-200 rounded px-2 py-1 outline-none text-xs"
            >
              <option value="1/4">1/4 Note</option>
              <option value="1/8">1/8 Note</option>
              <option value="1/16">1/16 Note</option>
              <option value="1/32">1/32 Note</option>
            </select>

            <span className="text-neutral-400">
              BPM: <strong className="text-amber-400">{arp.bpm}</strong>
            </span>
          </div>
        </div>

        {/* 16 Step Buttons & Velocity Strips */}
        <div className="grid grid-cols-8 md:grid-cols-16 gap-1.5">
          {arp.steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-1.5 rounded border flex flex-col items-center justify-between gap-1 transition-all ${
                step.active
                  ? idx % 4 === 0
                    ? 'bg-amber-500/20 border-amber-500/50'
                    : 'bg-neutral-900 border-neutral-700'
                  : 'bg-neutral-950 border-neutral-900 opacity-40'
              }`}
            >
              <button
                onClick={() => {
                  const updated = [...arp.steps];
                  updated[idx] = { ...step, active: !step.active };
                  onArpChange({ ...arp, steps: updated });
                }}
                className={`w-full py-0.5 rounded text-[10px] font-bold ${
                  step.active ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-500'
                }`}
              >
                {idx + 1}
              </button>

              {/* Pitch Offset */}
              <select
                value={step.pitchOffset}
                onChange={(e) => {
                  const updated = [...arp.steps];
                  updated[idx] = { ...step, pitchOffset: parseInt(e.target.value) };
                  onArpChange({ ...arp, steps: updated });
                }}
                className="w-full bg-neutral-950 text-[9px] text-center text-amber-400 border border-neutral-800 rounded outline-none"
              >
                {[-12, -7, -5, 0, 3, 5, 7, 10, 12].map(p => (
                  <option key={p} value={p}>{p > 0 ? `+${p}` : p}</option>
                ))}
              </select>

              {/* Step Velocity Bar */}
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={step.velocity}
                onChange={(e) => {
                  const updated = [...arp.steps];
                  updated[idx] = { ...step, velocity: parseFloat(e.target.value) };
                  onArpChange({ ...arp, steps: updated });
                }}
                className="w-full accent-amber-500 h-1 bg-neutral-800 rounded cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scale Diatonic Chord Trigger Pads */}
      <div className="bg-[#121620] border border-neutral-800 rounded-xl p-4 shadow-xl flex flex-col gap-2 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <span className="font-bold text-white uppercase">
            Musical Context Chord Trigger Pads ({preset.musicalContext.key} {preset.musicalContext.scale})
          </span>
          <span className="text-[10px] text-neutral-400">
            Instant harmonic triggers locked to your musical context
          </span>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 pt-1">
          {diatonicChords.map((chord) => (
            <button
              key={chord.degree}
              onClick={() => playDiatonicChord(chord.semitone)}
              className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500/60 hover:bg-neutral-800 active:scale-95 transition-all text-center flex flex-col items-center justify-center gap-1 group cursor-pointer"
            >
              <span className="font-bold text-sm text-white group-hover:text-amber-400">
                {chord.degree}
              </span>
              <span className="text-[9px] text-neutral-400 uppercase">
                {chord.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
