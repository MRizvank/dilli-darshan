export type RadioStationId =
  | 'qawwali-sufi'
  | 'classical-sitar'
  | 'indie-retro'
  | 'punjabi-electronic'
  | 'yamuna-chill';

export interface DelhiRadioStation {
  id: RadioStationId;
  frequency: string;
  name: string;
  genre: string;
  program: string;
  description: string;
  accentColor: string;
  zoneIds: string[];
  areaSummary: string;
}

export const DELHI_RADIO_STATIONS: DelhiRadioStation[] = [
  {
    id: 'indie-retro',
    frequency: '93.5 FM',
    name: 'Connaught Beats',
    genre: 'Hindi Indie & Retro Filmi',
    program: 'Colonnade Acoustic Groove',
    description: 'Breezy acoustic grooves and golden-era Hindi melodies echoing under CP colonnades.',
    accentColor: '#2563EB',
    zoneIds: ['connaught-place', 'rajouri-west', 'majnu-ka-tila', 'rohini-pitampura'],
    areaSummary: 'Connaught Place · North & West Delhi',
  },
  {
    id: 'qawwali-sufi',
    frequency: '98.3 FM',
    name: 'Shahjahanabad Air',
    genre: 'Sufi Qawwali & Harmonium',
    program: 'Old Delhi Evening Mehfil',
    description: 'Soulful harmonium reeds and rhythmic clapping grooves inspired by Chandni Chowk & Nizamuddin.',
    accentColor: '#C84B31',
    zoneIds: ['chandni-chowk', 'red-fort-jama', 'nizamuddin'],
    areaSummary: 'Chandni Chowk · Red Fort · Nizamuddin',
  },
  {
    id: 'classical-sitar',
    frequency: '101.4 FM',
    name: 'Raag Darbar',
    genre: 'Hindustani Classical Sitar',
    program: 'Raag Yaman · Dusk Session',
    description: 'Meditative tanpura resonance and plucked sitar improvisations for heritage walks.',
    accentColor: '#B45309',
    zoneIds: ['india-gate', 'lodhi-district', 'hauz-khas', 'qutub-mehrauli'],
    areaSummary: 'India Gate · Lodhi · Hauz Khas · Qutub',
  },
  {
    id: 'punjabi-electronic',
    frequency: '104.8 FM',
    name: 'NCR Bassline',
    genre: 'Punjabi Pop & Electronic Dhol',
    program: 'CyberHub & Noida Night Drive',
    description: 'Crisp tumbi plucks layered over upbeat dhol basslines for NCR expressways & plazas.',
    accentColor: '#0F766E',
    zoneIds: [
      'gurugram-cyberhub',
      'noida-sector-18',
      'aerocity-igi',
      'kalkaji-nehru',
      'dwarka-subcity',
      'akshardham-yamuna',
      'shahdara-ghaziabad',
    ],
    areaSummary: 'Gurugram · Noida · Aerocity · South-East NCR',
  },
  {
    id: 'yamuna-chill',
    frequency: '89.7 FM',
    name: 'Yamuna Chill',
    genre: 'Desi Lo-Fi & Bansuri Flute',
    program: 'Monsoon Rooftop Breeze',
    description: 'Gentle bamboo bansuri flute phrases drifting over warm rooftop lo-fi chords.',
    accentColor: '#7C3AED',
    zoneIds: [],
    areaSummary: 'All-NCR Bonus Station',
  },
];

export function getRadioStationById(id: RadioStationId): DelhiRadioStation {
  return DELHI_RADIO_STATIONS.find((s) => s.id === id) ?? DELHI_RADIO_STATIONS[0];
}

export function getRecommendedStationForZone(zoneId: string): RadioStationId {
  const match = DELHI_RADIO_STATIONS.find((s) => s.zoneIds.includes(zoneId));
  return match ? match.id : 'indie-retro';
}
