import React, { useState, useEffect, useCallback } from 'react';
import { SynthPreset, ActiveView, LayerSettings, MasterFXSettings, ArpeggiatorSettings, MotionMode, MusicalContext } from './types/synth';
import { FACTORY_PRESETS } from './constants/presets';
import { audioEngine } from './audio/AudioEngine';
import { TopBar } from './components/TopBar';
import { PlayView } from './components/PlayView';
import { DesignView } from './components/DesignView';
import { PerformanceView } from './components/PerformanceView';
import { PresetBrowserModal } from './components/PresetBrowserModal';
import { SoundExplainerModal } from './components/SoundExplainerModal';
import { VirtualKeyboard } from './components/VirtualKeyboard';

export default function App() {
  // Preset state
  const [currentPreset, setCurrentPreset] = useState<SynthPreset>(FACTORY_PRESETS[0]);
  const [presetA, setPresetA] = useState<SynthPreset>(FACTORY_PRESETS[0]);
  const [presetB, setPresetB] = useState<SynthPreset>(FACTORY_PRESETS[1]);
  const [morphAmount, setMorphAmount] = useState(0);
  const [transformWow, setTransformWow] = useState(0);

  // View state
  const [activeView, setActiveView] = useState<ActiveView>('play');
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  // Initialize AudioEngine on first click/interaction
  const handleInitAudio = useCallback(async () => {
    const success = await audioEngine.initAudio();
    if (success) {
      setIsAudioInitialized(true);
      audioEngine.loadPreset(currentPreset);
    }
  }, [currentPreset]);

  // Load preset into audio engine
  const handleSelectPreset = useCallback((preset: SynthPreset) => {
    setCurrentPreset(preset);
    audioEngine.loadPreset(preset);
    setMorphAmount(0);
    setTransformWow(0);
  }, []);

  // Preset Navigation
  const handlePrevPreset = () => {
    const currentIndex = FACTORY_PRESETS.findIndex(p => p.id === currentPreset.id);
    const prevIndex = (currentIndex - 1 + FACTORY_PRESETS.length) % FACTORY_PRESETS.length;
    handleSelectPreset(FACTORY_PRESETS[prevIndex]);
  };

  const handleNextPreset = () => {
    const currentIndex = FACTORY_PRESETS.findIndex(p => p.id === currentPreset.id);
    const nextIndex = (currentIndex + 1) % FACTORY_PRESETS.length;
    handleSelectPreset(FACTORY_PRESETS[nextIndex]);
  };

  // Sound Morphing
  const handleMorphChange = (val: number) => {
    setMorphAmount(val);
    audioEngine.setSoundMorph(presetA, presetB, val);
  };

  // Transform WOW control
  const handleTransformChange = (val: number) => {
    setTransformWow(val);
    audioEngine.setTransformWow(val);
  };

  // Macro changes
  const handleMacroChange = (macro: any, val: number) => {
    audioEngine.setMacro(macro, val);
    setCurrentPreset(prev => ({
      ...prev,
      macros: { ...prev.macros, [macro]: val }
    }));
  };

  // Layer edits in DesignView
  const handleLayerChange = (layerIndex: number, updatedLayer: LayerSettings) => {
    setCurrentPreset(prev => {
      const layers = [...prev.layers] as [LayerSettings, LayerSettings, LayerSettings, LayerSettings];
      layers[layerIndex] = updatedLayer;
      const updated = { ...prev, layers };
      audioEngine.loadPreset(updated);
      return updated;
    });
  };

  const handleLayerVolumeChange = (layerIndex: number, vol: number) => {
    setCurrentPreset(prev => {
      const layers = [...prev.layers] as [LayerSettings, LayerSettings, LayerSettings, LayerSettings];
      layers[layerIndex] = { ...layers[layerIndex], volume: vol };
      const updated = { ...prev, layers };
      audioEngine.loadPreset(updated);
      return updated;
    });
  };

  const handleLayerToggle = (layerIndex: number) => {
    setCurrentPreset(prev => {
      const layers = [...prev.layers] as [LayerSettings, LayerSettings, LayerSettings, LayerSettings];
      layers[layerIndex] = { ...layers[layerIndex], enabled: !layers[layerIndex].enabled };
      const updated = { ...prev, layers };
      audioEngine.loadPreset(updated);
      return updated;
    });
  };

  // Quick Filter Cutoff / Res
  const handleQuickFilterCutoff = (cutoff: number) => {
    setCurrentPreset(prev => {
      const layers = [...prev.layers] as [LayerSettings, LayerSettings, LayerSettings, LayerSettings];
      layers[0] = {
        ...layers[0],
        filterA: { ...layers[0].filterA, cutoff }
      };
      const updated = { ...prev, layers };
      audioEngine.loadPreset(updated);
      return updated;
    });
  };

  const handleQuickFilterRes = (resonance: number) => {
    setCurrentPreset(prev => {
      const layers = [...prev.layers] as [LayerSettings, LayerSettings, LayerSettings, LayerSettings];
      layers[0] = {
        ...layers[0],
        filterA: { ...layers[0].filterA, resonance }
      };
      const updated = { ...prev, layers };
      audioEngine.loadPreset(updated);
      return updated;
    });
  };

  // FX changes
  const handleFXChange = (updatedFX: MasterFXSettings) => {
    setCurrentPreset(prev => {
      const updated = { ...prev, masterFX: updatedFX };
      audioEngine.applyMasterFX(updatedFX);
      return updated;
    });
  };

  // Arp changes
  const handleArpChange = (arp: ArpeggiatorSettings) => {
    setCurrentPreset(prev => {
      const updated = { ...prev, arpeggiator: arp };
      audioEngine.loadPreset(updated);
      return updated;
    });
  };

  const handleArpToggle = (enabled: boolean) => {
    handleArpChange({ ...currentPreset.arpeggiator, enabled });
  };

  // Motion changes
  const handleMotionChange = (mode: MotionMode, intensity: number) => {
    setCurrentPreset(prev => {
      const updated = {
        ...prev,
        motion: {
          ...prev.motion,
          enabled: intensity > 0.01,
          mode,
          intensity
        }
      };
      audioEngine.loadPreset(updated);
      return updated;
    });
  };

  // Musical Context changes
  const handleMusicalContextChange = (ctx: MusicalContext) => {
    setCurrentPreset(prev => {
      const updated = { ...prev, musicalContext: ctx };
      audioEngine.loadPreset(updated);
      return updated;
    });
  };

  // Mutate Patch Engine (Subtle, Moderate, Extreme)
  const handleMutatePatch = (intensity: 'subtle' | 'moderate' | 'extreme') => {
    const factor = intensity === 'subtle' ? 0.15 : intensity === 'moderate' ? 0.35 : 0.7;
    const mutated: SynthPreset = JSON.parse(JSON.stringify(currentPreset));
    mutated.id = `${mutated.id}_mutated_${Date.now()}`;
    mutated.name = `${mutated.name} (Mutated)`;

    mutated.layers.forEach((layer) => {
      // Mutate wavetable position
      layer.wavetablePos = Math.max(0, Math.min(1, layer.wavetablePos + (Math.random() * 2 - 1) * factor));
      // Mutate filter cutoff
      const cutoffFactor = Math.pow(2, (Math.random() * 2 - 1) * factor * 1.5);
      layer.filterA.cutoff = Math.max(60, Math.min(16000, layer.filterA.cutoff * cutoffFactor));
      // Mutate resonance
      layer.filterA.resonance = Math.max(0.5, Math.min(10, layer.filterA.resonance + (Math.random() * 2 - 1) * factor * 2));
      // Mutate FM depth
      if (layer.engine === 'fm') {
        layer.fmDepth = Math.max(0, Math.min(1, layer.fmDepth + (Math.random() * 2 - 1) * factor));
      }
      // Mutate harmonic tilt
      if (layer.engine === 'spectral') {
        layer.harmonicTilt = Math.max(-1, Math.min(1, layer.harmonicTilt + (Math.random() * 2 - 1) * factor));
      }
    });

    // Mutate macros
    mutated.macros.motion = Math.max(0, Math.min(1, mutated.macros.motion + (Math.random() * 2 - 1) * factor * 0.5));
    mutated.macros.drive = Math.max(0, Math.min(1, mutated.macros.drive + (Math.random() * 2 - 1) * factor * 0.5));
    mutated.macros.space = Math.max(0, Math.min(1, mutated.macros.space + (Math.random() * 2 - 1) * factor * 0.5));

    handleSelectPreset(mutated);
  };

  // Auto-init audio on any key press or click if needed
  useEffect(() => {
    const autoInit = () => {
      if (!isAudioInitialized) {
        handleInitAudio();
      }
    };
    window.addEventListener('mousedown', autoInit, { once: true });
    window.addEventListener('keydown', autoInit, { once: true });
    return () => {
      window.removeEventListener('mousedown', autoInit);
      window.removeEventListener('keydown', autoInit);
    };
  }, [isAudioInitialized, handleInitAudio]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#07090d] text-neutral-100 overflow-hidden font-sans select-none">
      {/* Top Bar with Branding, Preset Nav, Context, and Tabs */}
      <TopBar
        currentPreset={currentPreset}
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenBrowser={() => setIsBrowserOpen(true)}
        onOpenExplainer={() => setIsExplainerOpen(true)}
        onPrevPreset={handlePrevPreset}
        onNextPreset={handleNextPreset}
        onMusicalContextChange={handleMusicalContextChange}
        onMasterVolumeChange={(vol) => {}}
        isAudioInitialized={isAudioInitialized}
        onInitAudio={handleInitAudio}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeView === 'play' && (
          <PlayView
            preset={currentPreset}
            presetA={presetA}
            presetB={presetB}
            morphAmount={morphAmount}
            onMorphChange={handleMorphChange}
            transformWow={transformWow}
            onTransformChange={handleTransformChange}
            onMacroChange={handleMacroChange}
            onLayerVolumeChange={handleLayerVolumeChange}
            onLayerToggle={handleLayerToggle}
            onQuickFilterCutoff={handleQuickFilterCutoff}
            onQuickFilterRes={handleQuickFilterRes}
            onArpToggle={handleArpToggle}
            onOpenBrowser={() => setIsBrowserOpen(true)}
          />
        )}

        {activeView === 'design' && (
          <DesignView
            preset={currentPreset}
            onLayerChange={handleLayerChange}
            onFXChange={handleFXChange}
          />
        )}

        {activeView === 'performance' && (
          <PerformanceView
            preset={currentPreset}
            onArpChange={handleArpChange}
            onMotionChange={handleMotionChange}
            onMacroChange={handleMacroChange}
          />
        )}
      </main>

      {/* Bottom Virtual Piano Keyboard & MIDI Controller */}
      <VirtualKeyboard
        musicalContext={currentPreset.musicalContext}
        onNoteTrigger={() => {
          if (!isAudioInitialized) handleInitAudio();
        }}
      />

      {/* Preset Browser Modal */}
      {isBrowserOpen && (
        <PresetBrowserModal
          currentPreset={currentPreset}
          presetA={presetA}
          presetB={presetB}
          onSelectPreset={handleSelectPreset}
          onSetPresetA={(p) => setPresetA(p)}
          onSetPresetB={(p) => setPresetB(p)}
          onMutatePatch={handleMutatePatch}
          onClose={() => setIsBrowserOpen(false)}
        />
      )}

      {/* Sound Explainer Modal */}
      {isExplainerOpen && (
        <SoundExplainerModal
          preset={currentPreset}
          onClose={() => setIsExplainerOpen(false)}
        />
      )}
    </div>
  );
}
