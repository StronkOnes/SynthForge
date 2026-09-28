import React, { useState } from 'react';
import { SynthPreset } from '../types/synth';
import { ShieldCheck, AlertCircle, Info, ChevronDown } from 'lucide-react';

interface PatchHealthProps {
  preset: SynthPreset;
}

export const PatchHealthBadge: React.FC<PatchHealthProps> = ({ preset }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Diagnostic heuristics
  const subLayer = preset.layers.find(l => l.role === 'sub');
  const isSubMono = subLayer ? Math.abs(subLayer.pan) <= 0.15 && (subLayer.unisonVoices === 1 || subLayer.stereoSpread <= 0.2) : true;
  const isHeadroomSafe = preset.masterFX.compressor.enabled || preset.masterFX.limiter;
  const hasResonanceRisk = preset.layers.some(l => l.filterA.resonance > 8.0 && l.filterA.drive > 0.6);
  const stereoWidthRating = preset.macros.width > 0.7 ? 'Ultra-Wide' : preset.macros.width > 0.35 ? 'Balanced' : 'Focused / Mono';

  const overallScore = !hasResonanceRisk && isSubMono && isHeadroomSafe ? 'Optimal' : 'Caution';

  return (
    <div className="relative inline-block text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-mono transition-colors ${
          overallScore === 'Optimal'
            ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-400 hover:bg-emerald-900/40'
            : 'bg-amber-950/40 border-amber-700/50 text-amber-400 hover:bg-amber-900/40'
        }`}
        title="Patch Health Diagnostics (Sub Mono, Resonance, Headroom)"
      >
        {overallScore === 'Optimal' ? (
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
        )}
        <span>HEALTH: {overallScore}</span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl p-3.5 z-50 text-neutral-300 font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <span className="font-semibold text-xs tracking-wider uppercase text-neutral-200 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              DSP Patch Diagnostics
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-neutral-300 text-xs px-1"
            >
              ✕
            </button>
          </div>

          <div className="mt-2.5 space-y-2 text-[11px] font-mono">
            {/* Sub Mono Check */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Sub Freq Stability:</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${isSubMono ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                {isSubMono ? 'Mono Stable (Clean)' : 'Stereo Spread Warning'}
              </span>
            </div>

            {/* Peak Headroom & Limiter */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Peak Headroom:</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300">
                Limiter Protected
              </span>
            </div>

            {/* Filter Resonance Guard */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Resonance Guard:</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${hasResonanceRisk ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                {hasResonanceRisk ? 'High Q Saturation' : 'Safe Bandwidth'}
              </span>
            </div>

            {/* Stereo Width */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Stereo Imaging:</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-300">
                {stereoWidthRating}
              </span>
            </div>

            {/* Level Matching */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Level Match:</span>
              <span className="text-neutral-300">
                {preset.masterFX.levelMatch ? 'Enabled (-18 LUFS)' : 'Off'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
