import React, { useState, useMemo } from 'react';
import { SynthPreset } from '../types/synth';
import { FACTORY_PRESETS, PRESET_CATEGORIES, PRESET_GENRES } from '../constants/presets';
import {
  Search,
  Sparkles,
  Layers,
  FolderOpen,
  ArrowRight,
  Shuffle,
  Download
} from 'lucide-react';

interface PresetBrowserModalProps {
  currentPreset: SynthPreset;
  presetA: SynthPreset;
  presetB: SynthPreset;
  onSelectPreset: (preset: SynthPreset) => void;
  onSetPresetA: (preset: SynthPreset) => void;
  onSetPresetB: (preset: SynthPreset) => void;
  onMutatePatch: (intensity: 'subtle' | 'moderate' | 'extreme') => void;
  onClose: () => void;
}

export const PresetBrowserModal: React.FC<PresetBrowserModalProps> = ({
  currentPreset,
  presetA,
  presetB,
  onSelectPreset,
  onSetPresetA,
  onSetPresetB,
  onMutatePatch,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [activePreviewPreset, setActivePreviewPreset] = useState<SynthPreset>(currentPreset);

  const filteredPresets = useMemo(() => {
    return FACTORY_PRESETS.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesGenre = selectedGenre === 'All' || p.genres.includes(selectedGenre);

      return matchesSearch && matchesCat && matchesGenre;
    });
  }, [searchQuery, selectedCategory, selectedGenre]);

  const exportPresetJson = (preset: SynthPreset) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(preset, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${preset.id}_synthforge.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-[#10141c] border border-neutral-700/80 rounded-xl shadow-2xl max-w-5xl w-full h-[85vh] flex flex-col text-neutral-200 overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-[#0d1017]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2 font-mono">
                SYNTHFORGE PRESET FOUNDRY
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                {FACTORY_PRESETS.length} Flagship Handcrafted Patches
              </p>
            </div>
          </div>

          {/* Mutate Controls */}
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1 rounded-lg font-mono text-xs">
            <span className="text-neutral-500 text-[10px] uppercase px-1 flex items-center gap-1">
              <Shuffle className="w-3 h-3 text-amber-400" />
              MUTATE:
            </span>
            <button
              onClick={() => onMutatePatch('subtle')}
              className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              title="Controlled subtle timbral variation"
            >
              Subtle
            </button>
            <button
              onClick={() => onMutatePatch('moderate')}
              className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              title="Moderate timbral variation"
            >
              Moderate
            </button>
            <button
              onClick={() => onMutatePatch('extreme')}
              className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 transition-colors"
              title="Wild experimental metamorphosis"
            >
              Extreme
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-3 bg-[#131722] border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by preset name, genre, mood..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
            {PRESET_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Genre Dropdown */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-2.5 py-1.5 text-xs outline-none"
          >
            {PRESET_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Main Body: List on Left, Preview Card on Right */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Preset List (7 cols) */}
          <div className="md:col-span-7 overflow-y-auto p-3 space-y-2 border-r border-neutral-800">
            {filteredPresets.map((p) => {
              const isCurrent = currentPreset.id === p.id;
              const isPreview = activePreviewPreset.id === p.id;
              const isA = presetA.id === p.id;
              const isB = presetB.id === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => setActivePreviewPreset(p)}
                  onDoubleClick={() => {
                    onSelectPreset(p);
                    onClose();
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isPreview
                      ? 'bg-neutral-800/90 border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-neutral-900/50 border-neutral-800 hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white truncate">
                        {p.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded uppercase bg-neutral-800 text-amber-400 border border-neutral-700">
                        {p.category}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Active
                        </span>
                      )}
                      {isA && (
                        <span className="text-[9px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Morph A
                        </span>
                      )}
                      {isB && (
                        <span className="text-[9px] font-mono px-1 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          Morph B
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-neutral-400 font-sans truncate">
                      {p.description}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500">
                      <span>{p.genres.join(', ')}</span>
                      <span>•</span>
                      <span>by {p.author}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPreset(p);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 font-mono text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Preset Detail & Morph Assigner (5 cols) */}
          <div className="md:col-span-5 bg-[#0e1219] p-4 flex flex-col justify-between overflow-y-auto font-mono text-xs">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-amber-400 font-bold">
                    PRESET INSPECTOR
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    CPU: <strong className="text-neutral-300">{activePreviewPreset.cpuRating}</strong>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {activePreviewPreset.name}
                </h3>
                <p className="text-xs text-neutral-300 font-sans mt-1 leading-relaxed">
                  {activePreviewPreset.description}
                </p>
              </div>

              {/* Sound Explainer Snippet */}
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Sound Explainer Insight
                </span>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                  {activePreviewPreset.soundExplainer}
                </p>
              </div>

              {/* Layer Summary */}
              <div>
                <span className="text-[10px] uppercase text-neutral-400 font-bold block mb-1.5">
                  Layer Architecture
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {activePreviewPreset.layers.map(l => (
                    <div key={l.id} className="p-2 rounded bg-neutral-900/60 border border-neutral-800">
                      <div className="font-bold text-white">L{l.id}: {l.name}</div>
                      <div className="text-neutral-500 uppercase">{l.role} • {l.engine}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {activePreviewPreset.tags.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions: Set as A, Set as B, Load, Export */}
            <div className="pt-4 border-t border-neutral-800 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSetPresetA(activePreviewPreset)}
                  className="px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs transition-colors"
                >
                  Set as Morph A
                </button>
                <button
                  onClick={() => onSetPresetB(activePreviewPreset)}
                  className="px-3 py-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold text-xs transition-colors"
                >
                  Set as Morph B
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectPreset(activePreviewPreset);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
                >
                  LOAD PRESET NOW
                </button>
                <button
                  onClick={() => exportPresetJson(activePreviewPreset)}
                  className="p-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                  title="Export Preset JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
