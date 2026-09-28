import React from 'react';
import { SynthPreset } from '../types/synth';
import { Sparkles, HelpCircle, Layers, Cpu, Music } from 'lucide-react';

interface SoundExplainerModalProps {
  preset: SynthPreset;
  onClose: () => void;
}

export const SoundExplainerModal: React.FC<SoundExplainerModalProps> = ({ preset, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-[#12161f] border border-neutral-700/80 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto text-neutral-200 p-6 flex flex-col gap-5 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                Why does &quot;{preset.name}&quot; sound like this?
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Deterministic DSP & Acoustic Architecture Breakdown
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Core Summary */}
        <div className="p-4 rounded-lg bg-neutral-900/80 border border-neutral-800">
          <h3 className="text-xs font-mono font-semibold uppercase text-amber-400 tracking-wider mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Sonic Identity Overview
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            {preset.soundExplainer}
          </p>
        </div>

        {/* Layer-by-Layer Forensic Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-semibold uppercase text-neutral-400 tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-copper-400" />
            4-Layer Role Architecture
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {preset.layers.map((layer) => (
              <div
                key={layer.id}
                className={`p-3 rounded-lg border ${
                  layer.enabled
                    ? 'bg-neutral-900/60 border-neutral-800'
                    : 'bg-neutral-950/40 border-neutral-900 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between font-mono mb-1.5">
                  <span className="font-bold text-white">
                    Layer {layer.id}: {layer.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {layer.role}
                  </span>
                </div>
                <div className="space-y-1 text-neutral-400 font-mono text-[11px]">
                  <div>
                    Engine: <span className="text-neutral-200 capitalize">{layer.engine}</span>
                    {layer.engine === 'analog' && ` (${layer.analogWave})`}
                    {layer.engine === 'wavetable' && ` (${layer.wavetableId})`}
                    {layer.engine === 'fm' && ` (Ratio: ${layer.fmRatio}x)`}
                  </div>
                  <div>
                    Filter: <span className="text-neutral-200">{layer.filterA.type.toUpperCase()} @ {Math.round(layer.filterA.cutoff)}Hz</span>
                  </div>
                  <div>
                    Volume: <span className="text-neutral-200">{Math.round(layer.volume * 100)}%</span> | Pan: <span className="text-neutral-200">{Math.round(layer.pan * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Master FX & Performance Best Practices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800">
            <div className="font-semibold text-neutral-300 mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              Master FX Rack Contribution
            </div>
            <ul className="space-y-1 text-neutral-400 text-[11px]">
              <li>
                • Distortion: <span className="text-neutral-200">{preset.masterFX.distortion.enabled ? `${preset.masterFX.distortion.type} (${Math.round(preset.masterFX.distortion.drive * 100)}% drive)` : 'Bypassed'}</span>
              </li>
              <li>
                • Reverb Tail: <span className="text-neutral-200">{preset.masterFX.reverb.enabled ? `${preset.masterFX.reverb.decay}s algorithmic decay` : 'Off'}</span>
              </li>
              <li>
                • Stereo Ping-Pong: <span className="text-neutral-200">{preset.masterFX.delay.enabled ? `${preset.masterFX.delay.division} synced` : 'Off'}</span>
              </li>
              <li>
                • Multiband Comp: <span className="text-neutral-200">{preset.masterFX.compressor.enabled ? `Active (-18dB thresh, 4:1)` : 'Off'}</span>
              </li>
            </ul>
          </div>

          <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800">
            <div className="font-semibold text-neutral-300 mb-2 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-emerald-400" />
              Producer Musical Context
            </div>
            <ul className="space-y-1 text-neutral-400 text-[11px]">
              <li>
                • Ideal Genres: <span className="text-emerald-400">{preset.genres.join(', ')}</span>
              </li>
              <li>
                • Recommended Scale: <span className="text-neutral-200">{preset.musicalContext.key} {preset.musicalContext.scale}</span>
              </li>
              <li>
                • Voice Mode: <span className="text-neutral-200">{preset.polyphony === 1 ? `Monophonic Legato (${Math.round(preset.glide * 1000)}ms glide)` : `Polyphonic (${preset.polyphony} voices)`}</span>
              </li>
              <li>
                • CPU Footprint: <span className="text-neutral-200">{preset.cpuRating}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs font-mono transition-colors"
          >
            Close Explainer
          </button>
        </div>
      </div>
    </div>
  );
};
