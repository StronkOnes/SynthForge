import { SynthPreset } from '../types/synth';
import { BASS_PRESETS } from './presets/bankBass';
import { LEAD_PRESETS } from './presets/bankLeads';
import { PAD_PRESETS } from './presets/bankPads';
import { KEY_PRESETS } from './presets/bankKeys';
import { PLUCK_PRESETS } from './presets/bankPlucks';
import { CHORD_PRESETS } from './presets/bankChords';
import { ARP_PRESETS } from './presets/bankArps';
import { FX_PRESETS } from './presets/bankFx';

export const FACTORY_PRESETS: SynthPreset[] = [
  ...BASS_PRESETS,
  ...LEAD_PRESETS,
  ...PAD_PRESETS,
  ...KEY_PRESETS,
  ...PLUCK_PRESETS,
  ...CHORD_PRESETS,
  ...ARP_PRESETS,
  ...FX_PRESETS
];

export const PRESET_CATEGORIES = [
  'All',
  'Bass',
  'Lead',
  'Pad',
  'Keys',
  'Pluck',
  'Chord',
  'Arp',
  'Texture',
  'FX'
] as const;

export const PRESET_GENRES = [
  'All',
  'Hip-Hop',
  'Trap',
  'Drill',
  'R&B',
  'Afrobeats',
  'House',
  'Tech House',
  'Techno',
  'EDM',
  'Future Bass',
  'Drum & Bass',
  'Pop',
  'Cinematic',
  'Ambient',
  'Experimental'
] as const;

export const PRESET_BANK_STATS = {
  total: FACTORY_PRESETS.length,
  bass: BASS_PRESETS.length,
  leads: LEAD_PRESETS.length,
  pads: PAD_PRESETS.length,
  keys: KEY_PRESETS.length,
  plucks: PLUCK_PRESETS.length,
  chords: CHORD_PRESETS.length,
  arps: ARP_PRESETS.length,
  fx: FX_PRESETS.length
};
