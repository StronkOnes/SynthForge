export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export interface ScaleDefinition {
  name: string;
  intervals: number[]; // semitone intervals from root
  description: string;
}

export const SCALES: Record<string, ScaleDefinition> = {
  'Minor': {
    name: 'Natural Minor (Aeolian)',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    description: 'Dark, emotional, essential for Hip-hop, Trap, and Melodic House.'
  },
  'Major': {
    name: 'Major (Ionian)',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    description: 'Bright, uplifting, euphoric EDM, Pop, and Future Bass.'
  },
  'Harmonic Minor': {
    name: 'Harmonic Minor',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    description: 'Exotic, dramatic, leading-tone tension popular in Trap, Drill, and Dark Synthwave.'
  },
  'Dorian': {
    name: 'Dorian',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    description: 'Sophisticated minor with raised 6th, staples of Deep House, Neo-Soul, and R&B.'
  },
  'Phrygian': {
    name: 'Phrygian',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    description: 'Aggressive Spanish/Middle-Eastern flavor with minor 2nd, great for Drill and Dark Techno.'
  },
  'Lydian': {
    name: 'Lydian',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    description: 'Dreamy, ethereal, raised 4th ideal for Cinematic atmospheres and Ambient.'
  },
  'Mixolydian': {
    name: 'Mixolydian',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    description: 'Dominant bluesy vibe, classic Funk, Nu-Disco, and Afro House.'
  },
  'Minor Pentatonic': {
    name: 'Minor Pentatonic',
    intervals: [0, 3, 5, 7, 10],
    description: 'Safe, instantly melodic 5-note scale that never clashes.'
  },
  'Major Pentatonic': {
    name: 'Major Pentatonic',
    intervals: [0, 2, 4, 7, 9],
    description: 'Pure, sweet 5-note scale for sparkling arpeggios and plucks.'
  },
  'Blues': {
    name: 'Blues Scale',
    intervals: [0, 3, 5, 6, 7, 10],
    description: 'Gritty blue note, perfect for expressive synth solos and dirty leads.'
  },
  'Japanese Insen': {
    name: 'Japanese (Insen)',
    intervals: [0, 1, 5, 7, 10],
    description: 'Mystical Asian tonality for cinematic plucks and lo-fi textures.'
  }
};

export const CHORD_QUALITIES: Record<string, { intervals: number[]; label: string }> = {
  'Minor': { intervals: [0, 3, 7], label: 'm (Minor Triad)' },
  'Major': { intervals: [0, 4, 7], label: 'M (Major Triad)' },
  'Minor 7th': { intervals: [0, 3, 7, 10], label: 'm7 (Minor 7th)' },
  'Major 7th': { intervals: [0, 4, 7, 11], label: 'maj7 (Major 7th)' },
  'Dominant 7th': { intervals: [0, 4, 7, 10], label: '7 (Dominant 7th)' },
  'Sus4': { intervals: [0, 5, 7], label: 'sus4 (Suspended 4th)' },
  'Diminished': { intervals: [0, 3, 6], label: 'dim (Diminished)' },
  'Minor 9th': { intervals: [0, 3, 7, 10, 14], label: 'm9 (Lush Minor 9th)' },
};

export function midiToFreq(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

export function freqToMidi(freq: number): number {
  return Math.round(69 + 12 * Math.log2(freq / 440));
}

export function getScaleMidiNotes(rootKey: string, scaleName: string, startOctave = 1, octaves = 6): Set<number> {
  const rootIndex = NOTES.indexOf(rootKey as any);
  if (rootIndex === -1) return new Set();
  const scale = SCALES[scaleName] || SCALES['Minor'];
  const result = new Set<number>();

  for (let oct = startOctave; oct < startOctave + octaves; oct++) {
    const baseMidi = 12 * (oct + 1) + rootIndex;
    for (const interval of scale.intervals) {
      const note = baseMidi + interval;
      if (note >= 0 && note <= 127) {
        result.add(note);
      }
    }
  }
  return result;
}

export function isNoteInScale(midiNote: number, rootKey: string, scaleName: string): boolean {
  const rootIndex = NOTES.indexOf(rootKey as any);
  if (rootIndex === -1) return true;
  const scale = SCALES[scaleName] || SCALES['Minor'];
  const semitone = (midiNote % 12 - rootIndex + 12) % 12;
  return scale.intervals.includes(semitone);
}

export function quantizeToScale(midiNote: number, rootKey: string, scaleName: string): number {
  if (isNoteInScale(midiNote, rootKey, scaleName)) return midiNote;
  // Snap to nearest scale note
  const rootIndex = NOTES.indexOf(rootKey as any);
  const scale = SCALES[scaleName] || SCALES['Minor'];
  const semitone = (midiNote % 12 - rootIndex + 12) % 12;
  
  let closestInterval = scale.intervals[0];
  let minDiff = 99;
  for (const interval of scale.intervals) {
    const diff = Math.abs(interval - semitone);
    if (diff < minDiff) {
      minDiff = diff;
      closestInterval = interval;
    }
  }
  const octave = Math.floor(midiNote / 12);
  return octave * 12 + rootIndex + closestInterval;
}
