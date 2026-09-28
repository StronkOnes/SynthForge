import React from 'react';
import { SynthPreset, LayerRole } from '../types/synth';
import { Knob } from './Knob';
import { Visualizer } from './Visualizer';
import { audioEngine } from '../audio/AudioEngine';
import {
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Play,
  RotateCcw
} from 'lucide-react';

interface PlayViewProps {
  preset: SynthPreset;
  presetA: SynthPreset;
  presetB: SynthPreset;
  morphAmount: number;
  onMorphChange: (amount: number) => void;
  transformWow: number;
  onTransformChange: (wow: number) => void;
  onMacroChange: (macro: any, val: number) => void;
  onLayerVolumeChange: (layerIndex: number, vol: number) => void;
  onLayerToggle: (layerIndex: number) => void;
  onQuickFilterCutoff: (cutoff: number) => void;
  onQuickFilterRes: (res: number) => void;
  onArpToggle: (enabled: boolean) => void;
  onOpenBrowser: () => void;
}

export const PlayView: React.FC<PlayViewProps> = ({
  preset,
  presetA,
  presetB,
  morphAmount,
  onMorphChange,
  transformWow,
  onTransformChange,
  onMacroChange,
  onLayerVolumeChange,
  onLayerToggle,
  onQuickFilterCutoff,
  onQuickFilterRes,
  onArpToggle,
  onOpenBrowser
}) => {
  const roleColors: Record<LayerRole, { bg: string; text: string; bar: string }> = {
    sub: { bg: 'bg-emerald-950/40 border-emerald-800/40', text: 'text-emerald-400', bar: 'bg-emerald-500' },
    body: { bg: 'bg-amber-950/40 border-amber-800/40', text: 'text-amber-400', bar: 'bg-amber-500' },
    character: { bg: 'bg-orange-950/40 border-orange-800/40', text: 'text-orange-400', bar: 'bg-orange-500' },
    texture: { bg: 'bg-sky-950/40 border-sky-800/40', text: 'text-sky-400', bar: 'bg-sky-500' }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto bg-[#0a0d12]">
      {/* Top Banner: SOUND MORPH & TRANSFORM INNOVATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* The Sound Morph System (6 cols) */}
        <div className="lg:col-span-7 bg-[#121620] border border-neutral-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                  SOUND MORPH • FULL SONIC IDENTITY INTERPOLATION
                </h3>
                <p className="text-[10px] font-mono text-neutral-400">
                  Smoothly transforms timbre, wavetable position, harmonics, filters, and space between Patch A & B
                </p>
              </div>
            </div>
            <button
              onClick={() => onMorphChange(0.5)}
              className="text-neutral-500 hover:text-amber-400 p-1"
              title="Reset to 50% Center Balance"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Morph A & B Target Indicators */}
          <div className="grid grid-cols-2 gap-3 my-3 font-mono text-xs">
            <div className={`p-2.5 rounded-lg border flex flex-col gap-1 transition-all ${
              morphAmount < 0.5 ? 'bg-amber-950/30 border-amber-600/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]' : 'bg-neutral-900/60 border-neutral-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 text-xs">PATCH A (0%)</span>
                <span className="text-[10px] text-neutral-400">{presetA.category}</span>
              </div>
              <span className="font-semibold text-white truncate">{presetA.name}</span>
              <span className="text-[10px] text-neutral-400 truncate">{presetA.genres[0]}</span>
            </div>

            <div className={`p-2.5 rounded-lg border flex flex-col gap-1 transition-all ${
              morphAmount >= 0.5 ? 'bg-orange-950/30 border-orange-600/50 shadow-[0_0_12px_rgba(234,88,12,0.2)]' : 'bg-neutral-900/60 border-neutral-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-orange-400 text-xs">PATCH B (100%)</span>
                <span className="text-[10px] text-neutral-400">{presetB.category}</span>
              </div>
              <span className="font-semibold text-white truncate">{presetB.name}</span>
              <span className="text-[10px] text-neutral-400 truncate">{presetB.genres[0]}</span>
            </div>
          </div>

          {/* Morph Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between font-mono text-[10px] text-neutral-400">
              <span>PATCH A: {Math.round((1 - morphAmount) * 100)}%</span>
              <span className="font-bold text-amber-400">MORPH: {Math.round(morphAmount * 100)}%</span>
              <span>PATCH B: {Math.round(morphAmount * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.005"
              value={morphAmount}
              onChange={(e) => onMorphChange(parseFloat(e.target.value))}
              className="w-full h-3 bg-neutral-900 rounded-lg appearance-none cursor-ew-resize accent-amber-500 shadow-inner"
            />
          </div>
        </div>

        {/* The TRANSFORM Wow Control (5 cols) */}
        <div className="lg:col-span-5 bg-[#121620] border border-neutral-800 rounded-xl p-4 shadow-xl flex items-center justify-between gap-4">
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                  TRANSFORM
                </h3>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                Controlled, musical transformation. Progressive shift across harmonics, filter overdrive, and stereo energy.
              </p>
            </div>
            <div className="font-mono text-[10px] text-neutral-500 space-y-0.5 mt-2">
              <div>0%: Original Patch</div>
              <div>50%: Enhanced Movement</div>
              <div>100%: Alternate Identity</div>
            </div>
          </div>

          {/* Giant Transform Dial */}
          <div className="flex flex-col items-center">
            <Knob
              label="TRANSFORM"
              value={transformWow}
              min={0}
              max={1}
              defaultValue={0}
              size="giant"
              color="copper"
              onChange={onTransformChange}
            />
          </div>
        </div>
      </div>

      {/* Middle Section: 4-Layer Role Balancer & Real-time Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Layer Role Balancer (7 cols) */}
        <div className="lg:col-span-7 bg-[#121620] border border-neutral-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
            <div>
              <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                4-LAYER ROLE BALANCER
              </h3>
              <p className="text-[10px] font-mono text-neutral-400">
                Balance sound by musical responsibility: Sub, Body, Character, Texture
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              Active Voices: {audioEngine.getActiveVoiceCount()}
            </span>
          </div>

          {/* 4 Layer Strips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-3">
            {preset.layers.map((layer, idx) => {
              const roleStyle = roleColors[layer.role];
              return (
                <div
                  key={layer.id}
                  className={`p-3 rounded-lg border flex flex-col justify-between gap-2 transition-all ${
                    layer.enabled
                      ? `${roleStyle.bg}`
                      : 'bg-neutral-950/60 border-neutral-800/50 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-white">
                      {layer.id}
                    </span>
                    <button
                      onClick={() => onLayerToggle(idx)}
                      className={`p-1 rounded ${layer.enabled ? 'text-amber-400 hover:text-amber-300' : 'text-neutral-600 hover:text-neutral-400'}`}
                      title={layer.enabled ? 'Mute Layer' : 'Unmute Layer'}
                    >
                      {layer.enabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${roleStyle.text}`}>
                      {layer.role}
                    </span>
                    <div className="text-[10px] font-mono text-neutral-300 truncate">
                      {layer.name}
                    </div>
                    <div className="text-[9px] font-mono text-neutral-500 capitalize">
                      {layer.engine}
                    </div>
                  </div>

                  {/* Vertical volume fader */}
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={layer.volume}
                      disabled={!layer.enabled}
                      onChange={(e) => onLayerVolumeChange(idx, parseFloat(e.target.value))}
                      className="w-full accent-amber-500 h-1.5 bg-neutral-900 rounded cursor-pointer"
                    />
                    <span className="font-mono text-[9px] text-neutral-400">
                      {Math.round(layer.volume * 100)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Filter & Arp Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800/60 font-mono text-xs">
            <div className="flex items-center gap-4">
              <Knob
                label="CUTOFF"
                value={preset.layers[0].filterA.cutoff}
                min={40}
                max={18000}
                defaultValue={4000}
                size="sm"
                unit="Hz"
                onChange={onQuickFilterCutoff}
              />
              <Knob
                label="RESONANCE"
                value={preset.layers[0].filterA.resonance}
                min={0.5}
                max={12}
                defaultValue={2.5}
                size="sm"
                onChange={onQuickFilterRes}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onArpToggle(!preset.arpeggiator.enabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-xs transition-all ${
                  preset.arpeggiator.enabled
                    ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>ARP {preset.arpeggiator.enabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-Time Phosphor Stream Visualizer (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <Visualizer className="h-full min-h-[220px]" />
        </div>
      </div>

      {/* Bottom Section: 8 Sound-Design & Performance Macros */}
      <div className="bg-[#121620] border border-neutral-800 rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-800/80">
          <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            8 SIGNATURE PERFORMANCE MACROS
          </h3>
          <span className="text-[10px] font-mono text-neutral-400">
            Multi-destination modulation assigned per patch
          </span>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 justify-items-center">
          <Knob
            label="MOTION"
            value={preset.macros.motion}
            size="md"
            color="copper"
            onChange={(v) => onMacroChange('motion', v)}
          />
          <Knob
            label="SPACE"
            value={preset.macros.space}
            size="md"
            color="amber"
            onChange={(v) => onMacroChange('space', v)}
          />
          <Knob
            label="DRIVE"
            value={preset.macros.drive}
            size="md"
            color="copper"
            onChange={(v) => onMacroChange('drive', v)}
          />
          <Knob
            label="BRIGHT"
            value={preset.macros.bright}
            size="md"
            color="amber"
            onChange={(v) => onMacroChange('bright', v)}
          />
          <Knob
            label="DARK"
            value={preset.macros.dark}
            size="md"
            color="slate"
            onChange={(v) => onMacroChange('dark', v)}
          />
          <Knob
            label="BODY"
            value={preset.macros.body}
            size="md"
            color="amber"
            onChange={(v) => onMacroChange('body', v)}
          />
          <Knob
            label="WIDTH"
            value={preset.macros.width}
            size="md"
            color="cyan"
            onChange={(v) => onMacroChange('width', v)}
          />
          <Knob
            label="ENERGY"
            value={preset.macros.energy}
            size="md"
            color="copper"
            onChange={(v) => onMacroChange('energy', v)}
          />
        </div>
      </div>
    </div>
  );
};
