import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { audioEngine } from '../audio/AudioEngine';
import { isNoteInScale, NOTES } from '../constants/musicalScales';
import { MusicalContext } from '../types/synth';
import { Keyboard as KeyboardIcon } from 'lucide-react';

interface VirtualKeyboardProps {
  musicalContext: MusicalContext;
  onNoteTrigger?: (note: number, on: boolean) => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  musicalContext,
  onNoteTrigger
}) => {
  const [octaveShift, setOctaveShift] = useState(0); // -2 to +2
  const [activeMidiNotes, setActiveMidiNotes] = useState<Set<number>>(new Set());
  const [pitchBend, setPitchBend] = useState(0); // -1 to 1
  const [modWheel, setModWheel] = useState(0); // 0 to 1
  const [showKeyLabels, setShowKeyLabels] = useState(true);

  // 3 octaves starting from C3 (MIDI 48) base + octaveShift * 12
  const startMidi = 48 + octaveShift * 12;
  const numKeys = 37; // 3 full octaves + top C

  // Computer keyboard mapping to MIDI notes
  const computerKeyMap: Record<string, number> = useMemo(() => ({
    'a': 0,  // C
    'w': 1,  // C#
    's': 2,  // D
    'e': 3,  // D#
    'd': 4,  // E
    'f': 5,  // F
    't': 6,  // F#
    'g': 7,  // G
    'y': 8,  // G#
    'h': 9,  // A
    'u': 10, // A#
    'j': 11, // B
    'k': 12, // C+1
    'o': 13, // C#+1
    'l': 14, // D+1
    'p': 15, // D#+1
    ';': 16  // E+1
  }), []);

  const triggerNoteOn = useCallback((note: number, velocity = 0.85) => {
    audioEngine.noteOn(note, velocity);
    setActiveMidiNotes(prev => new Set(prev).add(note));
    onNoteTrigger?.(note, true);
  }, [onNoteTrigger]);

  const triggerNoteOff = useCallback((note: number) => {
    audioEngine.noteOff(note);
    setActiveMidiNotes(prev => {
      const next = new Set(prev);
      next.delete(note);
      return next;
    });
    onNoteTrigger?.(note, false);
  }, [onNoteTrigger]);

  // Hook into Web MIDI callbacks
  useEffect(() => {
    audioEngine.setOnMidiCallback((note, vel, isNoteOn) => {
      if (isNoteOn) {
        setActiveMidiNotes(prev => new Set(prev).add(note));
      } else {
        setActiveMidiNotes(prev => {
          const next = new Set(prev);
          next.delete(note);
          return next;
        });
      }
    });
  }, []);

  // Computer keyboard listeners
  useEffect(() => {
    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      if (computerKeyMap[key] !== undefined && !pressedKeys.has(key)) {
        pressedKeys.add(key);
        const midi = startMidi + computerKeyMap[key];
        triggerNoteOn(midi);
      }
      if (e.key === 'z') setOctaveShift(prev => Math.max(-2, prev - 1));
      if (e.key === 'x') setOctaveShift(prev => Math.min(2, prev + 1));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (computerKeyMap[key] !== undefined) {
        pressedKeys.delete(key);
        const midi = startMidi + computerKeyMap[key];
        triggerNoteOff(midi);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startMidi, computerKeyMap, triggerNoteOn, triggerNoteOff]);

  // Handle wheels
  const handlePitchBendChange = (val: number) => {
    setPitchBend(val);
    audioEngine.setPitchBend(val * 2);
  };

  const handlePitchBendRelease = () => {
    // Spring back to 0
    setPitchBend(0);
    audioEngine.setPitchBend(0);
  };

  const handleModWheelChange = (val: number) => {
    setModWheel(val);
    audioEngine.setModWheel(val);
  };

  // Generate piano keys
  const keys = useMemo(() => {
    const list = [];
    for (let i = 0; i < numKeys; i++) {
      const midi = startMidi + i;
      const semitone = midi % 12;
      const isBlack = [1, 3, 6, 8, 10].includes(semitone);
      const noteName = NOTES[semitone];
      const inScale = isNoteInScale(midi, musicalContext.key, musicalContext.scale);
      list.push({ midi, isBlack, noteName, inScale });
    }
    return list;
  }, [startMidi, numKeys, musicalContext.key, musicalContext.scale]);

  return (
    <div className="bg-[#0f1217] border-t border-neutral-800 px-4 py-2 flex items-center justify-between gap-4 select-none">
      {/* Left controls: Pitch/Mod Wheels & Octave buttons */}
      <div className="flex items-center gap-3">
        {/* Wheels */}
        <div className="flex gap-2">
          {/* Pitch Bend Wheel (Spring-loaded) */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-tighter mb-0.5">Pitch</span>
            <div
              className="w-5 h-16 bg-[#161a22] rounded border border-neutral-800 relative flex items-center justify-center cursor-ns-resize"
              onMouseDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const update = (clientY: number) => {
                  const rel = (clientY - rect.top) / rect.height;
                  const v = Math.max(-1, Math.min(1, (0.5 - rel) * 2));
                  handlePitchBendChange(v);
                };
                update(e.clientY);
                const onMove = (ev: MouseEvent) => update(ev.clientY);
                const onUp = () => {
                  handlePitchBendRelease();
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
            >
              {/* Center detent mark */}
              <div className="absolute w-full h-[1px] bg-neutral-700 pointer-events-none" />
              {/* Wheel slider tab */}
              <div
                className="w-4 h-3 bg-neutral-400 rounded-sm shadow absolute pointer-events-none transition-all duration-75"
                style={{ top: `${(0.5 - pitchBend * 0.45) * 100}%`, transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {/* Mod Wheel */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-tighter mb-0.5">Mod</span>
            <div
              className="w-5 h-16 bg-[#161a22] rounded border border-neutral-800 relative flex items-center justify-center cursor-ns-resize"
              onMouseDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const update = (clientY: number) => {
                  const rel = (clientY - rect.top) / rect.height;
                  const v = Math.max(0, Math.min(1, 1 - rel));
                  handleModWheelChange(v);
                };
                update(e.clientY);
                const onMove = (ev: MouseEvent) => update(ev.clientY);
                const onUp = () => {
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
            >
              <div
                className="w-4 h-3 bg-amber-500 rounded-sm shadow absolute pointer-events-none transition-all duration-75"
                style={{ top: `${(1 - modWheel * 0.9) * 100}%`, transform: 'translateY(-50%)' }}
              />
            </div>
          </div>
        </div>

        {/* Octave Shift */}
        <div className="flex flex-col gap-1 font-mono text-[10px]">
          <span className="text-neutral-500 uppercase tracking-tighter">Octave</span>
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded p-0.5">
            <button
              onClick={() => setOctaveShift(prev => Math.max(-2, prev - 1))}
              className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded font-bold transition-colors"
              title="Down 1 Octave (Key Z)"
            >
              -
            </button>
            <span className="px-1.5 font-bold text-amber-400">
              {octaveShift > 0 ? `+${octaveShift}` : octaveShift}
            </span>
            <button
              onClick={() => setOctaveShift(prev => Math.min(2, prev + 1))}
              className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded font-bold transition-colors"
              title="Up 1 Octave (Key X)"
            >
              +
            </button>
          </div>
          <button
            onClick={() => setShowKeyLabels(!showKeyLabels)}
            className="flex items-center gap-1 text-[9px] text-neutral-500 hover:text-neutral-300 transition-colors"
            title="Toggle Computer Keyboard Labels (A-W-S-E-D...)"
          >
            <KeyboardIcon className="w-2.5 h-2.5" />
            {showKeyLabels ? 'Keys On' : 'Keys Off'}
          </button>
        </div>
      </div>

      {/* Main Piano Keyboard Area */}
      <div className="relative flex h-20 flex-1 max-w-4xl justify-center overflow-x-auto py-1">
        <div className="relative flex">
          {/* White keys */}
          {keys.filter(k => !k.isBlack).map((k) => {
            const isActive = activeMidiNotes.has(k.midi);
            return (
              <button
                key={k.midi}
                onMouseDown={() => triggerNoteOn(k.midi)}
                onMouseUp={() => triggerNoteOff(k.midi)}
                onMouseLeave={() => {
                  if (activeMidiNotes.has(k.midi)) triggerNoteOff(k.midi);
                }}
                className={`relative w-8 h-full rounded-b border border-neutral-700/80 transition-all flex flex-col justify-end items-center pb-1 text-[9px] font-mono font-semibold ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 shadow-[0_0_12px_rgba(251,191,36,0.8)] z-10 translate-y-0.5'
                    : k.inScale
                    ? 'bg-neutral-200 text-neutral-800 hover:bg-amber-100 shadow'
                    : 'bg-neutral-400 text-neutral-600 opacity-60'
                }`}
                title={`Note: ${k.noteName} (MIDI ${k.midi})${k.inScale ? ' - In Scale' : ' - Outside Scale'}`}
              >
                {/* Scale dot indicator */}
                {k.inScale && (
                  <span className={`w-1.5 h-1.5 rounded-full mb-1 ${isActive ? 'bg-neutral-900' : 'bg-amber-500'}`} />
                )}
                {showKeyLabels && (
                  <span className="opacity-75">{k.noteName}</span>
                )}
              </button>
            );
          })}

          {/* Black keys overlaid positioned absolutely */}
          {keys.map((k, index) => {
            if (!k.isBlack) return null;
            const isActive = activeMidiNotes.has(k.midi);
            // Count number of white keys prior to this black key
            const priorWhites = keys.slice(0, index).filter(item => !item.isBlack).length;
            // Left offset based on prior white keys
            const leftOffset = priorWhites * 32 - 10;

            return (
              <button
                key={k.midi}
                onMouseDown={() => triggerNoteOn(k.midi)}
                onMouseUp={() => triggerNoteOff(k.midi)}
                onMouseLeave={() => {
                  if (activeMidiNotes.has(k.midi)) triggerNoteOff(k.midi);
                }}
                style={{ left: `${leftOffset}px` }}
                className={`absolute top-0 w-5 h-12 rounded-b z-20 transition-all flex flex-col justify-end items-center pb-1 text-[8px] font-mono font-medium ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 shadow-[0_0_12px_rgba(251,191,36,0.9)] translate-y-0.5'
                    : k.inScale
                    ? 'bg-[#181b22] text-amber-300 border-x border-b border-amber-500/40 hover:bg-neutral-800'
                    : 'bg-neutral-900 text-neutral-600 border-x border-b border-neutral-800'
                }`}
                title={`Note: ${k.noteName} (MIDI ${k.midi})${k.inScale ? ' - In Scale' : ' - Outside Scale'}`}
              >
                {k.inScale && (
                  <span className={`w-1 h-1 rounded-full mb-0.5 ${isActive ? 'bg-neutral-950' : 'bg-amber-400'}`} />
                )}
                {showKeyLabels && (
                  <span className="opacity-60">{k.noteName}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Musical scale badge indicator */}
      <div className="flex flex-col items-end font-mono text-[10px] text-neutral-400">
        <span className="text-neutral-500 uppercase tracking-tighter">Scale Lock</span>
        <span className="font-bold text-amber-400 text-xs">
          {musicalContext.key} {musicalContext.scale}
        </span>
        <span className="text-[9px] text-neutral-500">
          Outside: <span className="text-neutral-300 capitalize">{musicalContext.outsideNotes}</span>
        </span>
      </div>
    </div>
  );
};
