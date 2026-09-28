import React from 'react';
import { SynthPreset, ActiveView, MusicalContext } from '../types/synth';
import { NOTES, SCALES } from '../constants/musicalScales';
import { audioEngine } from '../audio/AudioEngine';
import { PatchHealthBadge } from './PatchHealthBadge';
import {
  Sliders,
  Compass,
  Layers,
  FolderOpen,
  Volume2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Radio,
  Power
} from 'lucide-react';

interface TopBarProps {
  currentPreset: SynthPreset;
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  onOpenBrowser: () => void;
  onOpenExplainer: () => void;
  onPrevPreset: () => void;
  onNextPreset: () => void;
  onMusicalContextChange: (ctx: MusicalContext) => void;
  onMasterVolumeChange: (vol: number) => void;
  isAudioInitialized: boolean;
  onInitAudio: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPreset,
  activeView,
  onViewChange,
  onOpenBrowser,
  onOpenExplainer,
  onPrevPreset,
  onNextPreset,
  onMusicalContextChange,
  onMasterVolumeChange,
  isAudioInitialized,
  onInitAudio
}) => {
  return (
    <header className="bg-[#0b0e13] border-b border-neutral-800/90 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-neutral-200 select-none">
      {/* Brand & Main Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Glowing Copper Logo Mark */}
          <div className="w-7 h-7 rounded bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 p-0.5 shadow-[0_0_12px_rgba(245,158,11,0.4)] flex items-center justify-center">
            <span className="font-mono font-black text-black text-sm tracking-tighter">SF</span>
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-widest text-white uppercase flex items-center gap-1.5">
              SYNTHFORGE
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono border border-amber-500/30">
                FLAGSHIP
              </span>
            </h1>
            <p className="text-[9px] font-mono text-neutral-400 -mt-0.5 tracking-tight">
              HYBRID DSP • 4-LAYER SOUND ENGINE
            </p>
          </div>
        </div>

        {/* Audio Engine Status / Start Button */}
        {!isAudioInitialized ? (
          <button
            onClick={onInitAudio}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs font-mono shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all animate-pulse"
          >
            <Power className="w-3.5 h-3.5" />
            ENABLE DSP AUDIO
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[10px] font-mono">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>DSP 48kHz</span>
          </div>
        )}
      </div>

      {/* Preset Selector Banner */}
      <div className="flex items-center gap-2 bg-[#141820] border border-neutral-800 rounded-lg px-2.5 py-1">
        <button
          onClick={onPrevPreset}
          className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          title="Previous Preset"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenBrowser}
          className="flex flex-col items-start px-2 group cursor-pointer"
          title="Open Preset Browser"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
              {currentPreset.name}
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-neutral-800 text-amber-400 border border-neutral-700">
              {currentPreset.category}
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-300">
            {currentPreset.genres.slice(0, 2).join(' • ')} • by {currentPreset.author}
          </span>
        </button>

        <button
          onClick={onNextPreset}
          className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          title="Next Preset"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenBrowser}
          className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
          title="Browse All Presets"
        >
          <FolderOpen className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Musical Context Key & Scale Selector */}
      <div className="flex items-center gap-2 bg-[#12161f] border border-neutral-800 rounded-lg px-2.5 py-1 text-xs font-mono">
        <span className="text-neutral-500 uppercase tracking-tighter text-[10px]">Context:</span>
        <select
          value={currentPreset.musicalContext.key}
          onChange={(e) => onMusicalContextChange({ ...currentPreset.musicalContext, key: e.target.value })}
          className="bg-neutral-900 border border-neutral-800 text-amber-400 font-bold rounded px-1.5 py-0.5 text-xs outline-none focus:border-amber-500"
        >
          {NOTES.map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <select
          value={currentPreset.musicalContext.scale}
          onChange={(e) => onMusicalContextChange({ ...currentPreset.musicalContext, scale: e.target.value })}
          className="bg-neutral-900 border border-neutral-800 text-neutral-200 rounded px-1.5 py-0.5 text-xs outline-none focus:border-amber-500"
        >
          {Object.keys(SCALES).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Sound Explainer button */}
      <button
        onClick={onOpenExplainer}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono transition-colors"
        title="Why does this patch sound like this? (Plain-English Explainer)"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Explainer</span>
      </button>

      {/* Patch Health Badge */}
      <PatchHealthBadge preset={currentPreset} />

      {/* Navigation View Tabs */}
      <nav className="flex items-center gap-1 bg-[#12161f] p-1 rounded-lg border border-neutral-800">
        <button
          onClick={() => onViewChange('play')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
            activeView === 'play'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          PLAY
        </button>

        <button
          onClick={() => onViewChange('design')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
            activeView === 'design'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          DESIGN
        </button>

        <button
          onClick={() => onViewChange('performance')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
            activeView === 'performance'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          PERFORM
        </button>
      </nav>

      {/* Master Volume Output */}
      <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
        <Volume2 className="w-4 h-4 text-neutral-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          defaultValue="0.85"
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            onMasterVolumeChange(v);
            const ctx = audioEngine.getAudioContext();
            if (ctx) {
              // Master out gain
            }
          }}
          className="w-20 accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
          title="Master Output Gain"
        />
      </div>
    </header>
  );
};
