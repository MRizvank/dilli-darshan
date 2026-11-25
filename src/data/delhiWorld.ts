import type {
  DailyMission,
  DelhiTriviaQuestion,
  GigContract,
  HeritageSite,
  MetroLine,
  MetroLineId,
  MetroStation,
  NpcCharacter,
  PlaceZone,
  PoiKind,
  QuestDefinition,
  RestaurantSpot,
  ShoppingMallSpot,
  TransportMode,
  WeatherConfig,
  WeatherType,
} from '../types/game';

export const WORLD_WIDTH = 4400;
export const WORLD_HEIGHT = 3400;

export const AVATAR_COLORS = [
  { id: 'terracotta', label: 'Red Sandstone', hex: '#C84B31' },
  { id: 'saffron', label: 'Marigold Saffron', hex: '#D97706' },
  { id: 'peacock', label: 'Yamuna Peacock', hex: '#0F766E' },
  { id: 'indigo', label: 'Lutyens Indigo', hex: '#3730A3' },
  { id: 'emerald', label: 'Lodhi Sage', hex: '#15803D' },
  { id: 'magenta', label: 'Metro Magenta', hex: '#BE185D' },
];

export const PLACE_ZONES: PlaceZone[] = [
  {
    id: 'rohini-pitampura',
    name: 'Rohini & Pitampura',
    subtitle: 'North-West Delhi Hubs',
    x: 920,
    y: 480,
    radius: 250,
    description:
      'Planned residential sectors anchored by Netaji Subhash Place, Pitampura TV Tower, and bustling neighborhood plazas.',
    highlights: ['Unity One Rohini', 'Netaji Subhash Place Interchange', 'Rithala Terminal'],
    accentColor: '#DC2626',
  },
  {
    id: 'majnu-ka-tila',
    name: 'Majnu Ka Tila & North Campus',
    subtitle: 'Little Tibet & University Enclave',
    x: 1960,
    y: 480,
    radius: 240,
    description:
      'Serene Tibetan lanes by the Yamuna paired with tree-lined Delhi University colleges and the Northern Ridge.',
    highlights: ['AMA Café', 'Vishwavidyalaya Metro', 'Azadpur Interchange'],
    accentColor: '#B45309',
  },
  {
    id: 'chandni-chowk',
    name: 'Chandni Chowk',
    subtitle: 'Heart of Shahjahanabad',
    x: 1940,
    y: 910,
    radius: 240,
    description:
      'Founded in 1650 by Shah Jahan, Delhi’s oldest market boulevard hums with spice traders, silver bazaars, and century-old chaat stalls.',
    highlights: ['Paranthe Wali Gali', 'Natraj Dahi Bhalla', 'Kashmere Gate Hub'],
    accentColor: '#C84B31',
  },
  {
    id: 'red-fort-jama',
    name: 'Red Fort & Jama Precinct',
    subtitle: 'Imperial Mughal Citadel',
    x: 2250,
    y: 1000,
    radius: 230,
    description:
      'Red sandstone bastions of Lal Qila face the grand marble domes of Jama Masjid, surrounded by historic kebab lanes.',
    highlights: ['Red Fort (Lal Qila)', 'Jama Masjid', "Karim's Gali Kababian"],
    accentColor: '#991B1B',
  },
  {
    id: 'shahdara-ghaziabad',
    name: 'Shahdara & Ghaziabad Border',
    subtitle: 'Trans-Yamuna Red Line Corridor',
    x: 2940,
    y: 660,
    radius: 250,
    description:
      'Historic eastern gateway across the Yamuna connecting Welcome, Shahdara, Dilshad Garden, and Shaheed Sthal in Ghaziabad.',
    highlights: ['Shahdara Metro', 'Shaheed Sthal (Ghaziabad)', 'Welcome Interchange'],
    accentColor: '#DC2626',
  },
  {
    id: 'rajouri-west',
    name: 'Karol Bagh & Rajouri Garden',
    subtitle: 'West Delhi Retail & Markets',
    x: 1120,
    y: 1260,
    radius: 260,
    description:
      'From Karol Bagh’s traditional wedding bazaars to Rajouri Garden’s lively malls and West Delhi street-food plazas.',
    highlights: ['Pacific Mall Tagore Garden', 'Rajouri Garden Interchange', 'Karol Bagh'],
    accentColor: '#2563EB',
  },
  {
    id: 'dwarka-subcity',
    name: 'Dwarka Subcity',
    subtitle: 'Wide Boulevards & West NCR Link',
    x: 580,
    y: 1520,
    radius: 250,
    description:
      'Clean sector avenues in South-West Delhi bridging Blue Line neighborhoods with Airport Express terminals.',
    highlights: ['Vegas Mall Dwarka', 'Dwarka Sec 21 Interchange', 'Janakpuri West'],
    accentColor: '#1D4ED8',
  },
  {
    id: 'aerocity-igi',
    name: 'IGI Airport & Aerocity',
    subtitle: 'Aviation & Hospitality District',
    x: 1060,
    y: 1960,
    radius: 240,
    description:
      'High-speed Airport Express corridor linking New Delhi Railway Station directly to Terminal 3, Terminal 1, and Worldmark courtyards.',
    highlights: ['Worldmark Aerocity', 'IGI Airport T3', 'Terminal 1 Magenta'],
    accentColor: '#EA580C',
  },
  {
    id: 'connaught-place',
    name: 'Connaught Place',
    subtitle: 'Georgian Colonnades & Central Hub',
    x: 1900,
    y: 1450,
    radius: 260,
    description:
      'Iconic white concentric circles anchoring central Delhi’s busiest Metro interchange, heritage bakeries, and dhabas.',
    highlights: ['Rajiv Chowk Interchange', "Wenger's Deli", 'Kake Da Hotel', 'Agrasen ki Baoli'],
    accentColor: '#2563EB',
  },
  {
    id: 'india-gate',
    name: 'India Gate & Chanakyapuri',
    subtitle: 'Ceremonial Lutyens’ Axis',
    x: 2070,
    y: 1740,
    radius: 260,
    description:
      'Sweeping tree-lined lawns along Kartavya Path paired with diplomatic avenues, state bhavans, and luxury arcades.',
    highlights: ['India Gate Arch', 'Andhra Bhavan Canteen', 'The Chanakya Mall'],
    accentColor: '#B45309',
  },
  {
    id: 'lodhi-district',
    name: 'Lodhi Art District & INA',
    subtitle: '15th-Century Tombs & South-Central Hubs',
    x: 1930,
    y: 2040,
    radius: 250,
    description:
      'Lush heritage parkland dotted with Lodhi-era domes beside Khan Market, Sarojini Nagar, INA, and Lajpat Nagar.',
    highlights: ['Bara Gumbad & Lodhi Tombs', 'Khan Chacha', 'INA & Lajpat Nagar'],
    accentColor: '#15803D',
  },
  {
    id: 'nizamuddin',
    name: 'Nizamuddin & Humayun’s Tomb',
    subtitle: 'Charbagh Gardens & Sufi Heritage',
    x: 2430,
    y: 1970,
    radius: 230,
    description:
      'Persian-style symmetrical sandstone garden tombs meet the atmospheric lanes of Nizamuddin Basti and Pink Line connectivity.',
    highlights: ["Humayun's Tomb", 'Nizamuddin Kebab Corner', 'Hazrat Nizamuddin Metro'],
    accentColor: '#9A3412',
  },
  {
    id: 'akshardham-yamuna',
    name: 'Akshardham & East Delhi',
    subtitle: 'Eastern Riverfront & Anand Vihar',
    x: 2880,
    y: 1360,
    radius: 260,
    description:
      'Just across the Yamuna bridges on the Blue and Pink lines, carved pink-sandstone spires rise beside major transit depots.',
    highlights: ['Swaminarayan Akshardham', 'Yamuna Bank', 'Anand Vihar & Vaishali'],
    accentColor: '#0F766E',
  },
  {
    id: 'noida-sector-18',
    name: 'Noida Sector 18 & Botanical',
    subtitle: 'UP NCR Retail & Street Food Capital',
    x: 3540,
    y: 1960,
    radius: 280,
    description:
      'Cross the DND Flyway into Uttar Pradesh NCR’s mega-mall boulevard, pairing DLF Mall of India with Brahmaputra Market.',
    highlights: ['DLF Mall of India', 'The Great India Place', 'Brahmaputra Market'],
    accentColor: '#1D4ED8',
  },
  {
    id: 'kalkaji-nehru',
    name: 'Kalkaji, Nehru Place & Faridabad',
    subtitle: 'South-East Delhi to Haryana Corridor',
    x: 2640,
    y: 2400,
    radius: 270,
    description:
      'Marble petals of the Lotus Temple sit beside Nehru Place IT plaza and the Violet Line stretching south into Faridabad.',
    highlights: ['Lotus Temple', 'Kalkaji Mandir Interchange', 'Crown Interiorz Faridabad'],
    accentColor: '#BE185D',
  },
  {
    id: 'hauz-khas',
    name: 'Hauz Khas & Vasant Kunj',
    subtitle: 'Medieval Tank, Studios & Designer Malls',
    x: 1700,
    y: 2380,
    radius: 260,
    description:
      '13th-century reservoir ruins and deer park trails bridging indie lakeside cafés with Vasant Kunj’s luxury promenades.',
    highlights: ['Hauz Khas Fort', 'Mia Bella & Social', 'DLF Promenade & Emporio'],
    accentColor: '#7C3AED',
  },
  {
    id: 'qutub-mehrauli',
    name: 'Saket & Mehrauli (Qutub)',
    subtitle: 'Ancient Towers & Flagship Citywalks',
    x: 1720,
    y: 2680,
    radius: 260,
    description:
      'Delhi’s ancient stone minaret stands minutes from Saket’s bustling open-air plaza and cinema courtyards.',
    highlights: ['Qutub Minar', 'Select CITYWALK Saket', 'Saket Metro'],
    accentColor: '#B91C1C',
  },
  {
    id: 'gurugram-cyberhub',
    name: 'Gurugram MG Road & CyberHub',
    subtitle: 'Millennium City Promenade',
    x: 840,
    y: 2840,
    radius: 280,
    description:
      'Haryana NCR’s glass-and-steel skyline linked by Yellow Line and Rapid Metro, packed with flagship malls and open-air dining.',
    highlights: ['DLF CyberHub', 'Ambience Mall Gurugram', 'Millennium City Centre'],
    accentColor: '#0369A1',
  },
];

export const METRO_LINE_META: Record<MetroLineId, { name: string; color: string; textColor: string }> = {
  yellow: { name: 'Yellow', color: '#EAB308', textColor: '#422006' },
  blue: { name: 'Blue', color: '#2563EB', textColor: '#FFFFFF' },
  violet: { name: 'Violet', color: '#7C3AED', textColor: '#FFFFFF' },
  magenta: { name: 'Magenta', color: '#DB2777', textColor: '#FFFFFF' },
  red: { name: 'Red', color: '#DC2626', textColor: '#FFFFFF' },
  pink: { name: 'Pink', color: '#EC4899', textColor: '#FFFFFF' },
  green: { name: 'Green', color: '#16A34A', textColor: '#FFFFFF' },
  grey: { name: 'Grey', color: '#64748B', textColor: '#FFFFFF' },
  orange: { name: 'Airport Express', color: '#EA580C', textColor: '#FFFFFF' },
  rapid: { name: 'Rapid Metro', color: '#0EA5E9', textColor: '#FFFFFF' },
};

export const METRO_STATIONS: MetroStation[] = [
  // Yellow Line North -> South
  {
    id: 'metro-samaypur-badli',
    name: 'Samaypur Badli',
    x: 1520,
    y: 190,
    lines: ['yellow'],
    placeId: 'majnu-ka-tila',
    interchange: false,
    major: true,
    fact: 'Northern terminus of the Yellow Line serving North Delhi.',
  },
  {
    id: 'metro-azadpur',
    name: 'Azadpur',
    x: 1640,
    y: 330,
    lines: ['yellow', 'pink'],
    placeId: 'majnu-ka-tila',
    interchange: true,
    major: true,
    fact: 'Key North Delhi interchange linking Yellow and Pink lines.',
  },
  {
    id: 'metro-vishwavidyalaya',
    name: 'Vishwavidyalaya',
    x: 1890,
    y: 470,
    lines: ['yellow'],
    placeId: 'majnu-ka-tila',
    interchange: false,
    major: true,
    fact: 'Gateway to Delhi University North Campus and Majnu Ka Tila.',
  },
  {
    id: 'metro-civil-lines',
    name: 'Civil Lines',
    x: 1980,
    y: 600,
    lines: ['yellow'],
    placeId: 'majnu-ka-tila',
    interchange: false,
    fact: 'Quiet heritage residential boulevard just north of Old Delhi.',
  },
  {
    id: 'metro-kashmere-gate',
    name: 'Kashmere Gate',
    x: 2040,
    y: 730,
    lines: ['yellow', 'red', 'violet'],
    placeId: 'chandni-chowk',
    interchange: true,
    major: true,
    fact: 'Delhi Metro’s grand triple-line interchange connecting Yellow, Red, and Violet lines.',
  },
  {
    id: 'metro-chandni-chowk',
    name: 'Chandni Chowk',
    x: 1910,
    y: 880,
    lines: ['yellow'],
    placeId: 'chandni-chowk',
    interchange: false,
    major: true,
    fact: 'Underground station opening onto Old Delhi’s spice & parantha lanes.',
  },
  {
    id: 'metro-chawri-bazar',
    name: 'Chawri Bazar',
    x: 1890,
    y: 1030,
    lines: ['yellow'],
    placeId: 'chandni-chowk',
    interchange: false,
    fact: 'One of Delhi Metro’s deepest underground stations beneath Old Delhi.',
  },
  {
    id: 'metro-new-delhi',
    name: 'New Delhi',
    x: 1890,
    y: 1240,
    lines: ['yellow', 'orange'],
    placeId: 'connaught-place',
    interchange: true,
    major: true,
    fact: 'Connects the Yellow Line with the high-speed Airport Express directly to IGI T3.',
  },
  {
    id: 'metro-rajiv-chowk',
    name: 'Rajiv Chowk',
    x: 1900,
    y: 1450,
    lines: ['yellow', 'blue'],
    placeId: 'connaught-place',
    interchange: true,
    major: true,
    fact: 'Delhi Metro’s busiest central interchange right beneath Connaught Place.',
  },
  {
    id: 'metro-patel-chowk',
    name: 'Patel Chowk',
    x: 1920,
    y: 1590,
    lines: ['yellow'],
    placeId: 'india-gate',
    interchange: false,
    fact: 'Houses the official Delhi Metro Museum inside the station concourse.',
  },
  {
    id: 'metro-central-sec',
    name: 'Central Secretariat',
    x: 1940,
    y: 1730,
    lines: ['yellow', 'violet'],
    placeId: 'india-gate',
    interchange: true,
    major: true,
    fact: 'Yellow-Violet interchange at Kartavya Path leading toward India Gate.',
  },
  {
    id: 'metro-jor-bagh',
    name: 'Jor Bagh',
    x: 1920,
    y: 1890,
    lines: ['yellow'],
    placeId: 'lodhi-district',
    interchange: false,
    fact: 'Closest Yellow Line stop to Safdarjung Tomb and Lodhi Gardens.',
  },
  {
    id: 'metro-ina',
    name: 'Dilli Haat - INA',
    x: 1890,
    y: 2040,
    lines: ['yellow', 'pink'],
    placeId: 'lodhi-district',
    interchange: true,
    major: true,
    fact: 'Yellow-Pink interchange beside the open-air crafts and regional food bazaar.',
  },
  {
    id: 'metro-aiims',
    name: 'AIIMS',
    x: 1870,
    y: 2160,
    lines: ['yellow'],
    placeId: 'hauz-khas',
    interchange: false,
    fact: 'Serves South Delhi’s premier medical campus and Ring Road crossing.',
  },
  {
    id: 'metro-green-park',
    name: 'Green Park',
    x: 1850,
    y: 2260,
    lines: ['yellow'],
    placeId: 'hauz-khas',
    interchange: false,
    fact: 'Tree-lined neighborhood stop leading into Hauz Khas and Deer Park.',
  },
  {
    id: 'metro-hauz-khas',
    name: 'Hauz Khas',
    x: 1840,
    y: 2380,
    lines: ['yellow', 'magenta'],
    placeId: 'hauz-khas',
    interchange: true,
    major: true,
    fact: 'Deepest interchange linking Yellow Line with the Magenta Line.',
  },
  {
    id: 'metro-malviya-nagar',
    name: 'Malviya Nagar',
    x: 1830,
    y: 2510,
    lines: ['yellow'],
    placeId: 'qutub-mehrauli',
    interchange: false,
    fact: 'Key gateway to Saket District Centre and Select CITYWALK.',
  },
  {
    id: 'metro-saket',
    name: 'Saket',
    x: 1790,
    y: 2620,
    lines: ['yellow'],
    placeId: 'qutub-mehrauli',
    interchange: false,
    major: true,
    fact: 'South Delhi stop serving Saket malls and Press Enclave.',
  },
  {
    id: 'metro-qutub-minar',
    name: 'Qutub Minar',
    x: 1620,
    y: 2700,
    lines: ['yellow'],
    placeId: 'qutub-mehrauli',
    interchange: false,
    major: true,
    fact: 'Elevated station overlooking Mehrauli’s ancient stone skyline.',
  },
  {
    id: 'metro-chhatarpur',
    name: 'Chhatarpur',
    x: 1440,
    y: 2750,
    lines: ['yellow'],
    placeId: 'qutub-mehrauli',
    interchange: false,
    fact: 'Southern ridge corridor leading toward Gurugram.',
  },
  {
    id: 'metro-sikanderpur',
    name: 'Sikanderpur',
    x: 1080,
    y: 2820,
    lines: ['yellow', 'rapid'],
    placeId: 'gurugram-cyberhub',
    interchange: true,
    major: true,
    fact: 'Interchange between Delhi Yellow Line and Gurugram Rapid Metro.',
  },
  {
    id: 'metro-mg-road',
    name: 'MG Road',
    x: 940,
    y: 2880,
    lines: ['yellow'],
    placeId: 'gurugram-cyberhub',
    interchange: false,
    fact: 'Gurugram’s central Mall Mile metro corridor.',
  },
  {
    id: 'metro-iffco-chowk',
    name: 'IFFCO Chowk',
    x: 800,
    y: 2940,
    lines: ['yellow'],
    placeId: 'gurugram-cyberhub',
    interchange: false,
    fact: 'NH-48 junction connecting central Gurugram sectors.',
  },
  {
    id: 'metro-huda-city',
    name: 'Millennium City Centre',
    x: 680,
    y: 3020,
    lines: ['yellow'],
    placeId: 'gurugram-cyberhub',
    interchange: false,
    major: true,
    fact: 'Southern terminus of the Yellow Line in Gurugram (formerly HUDA City Centre).',
  },

  // Blue Line West -> East (Dwarka to Noida / Vaishali)
  {
    id: 'metro-dwarka-21',
    name: 'Dwarka Sector 21',
    x: 420,
    y: 1640,
    lines: ['blue', 'orange'],
    placeId: 'dwarka-subcity',
    interchange: true,
    major: true,
    fact: 'Western hub linking the Blue Line and Airport Express.',
  },
  {
    id: 'metro-dwarka-14',
    name: 'Dwarka Sector 14',
    x: 560,
    y: 1520,
    lines: ['blue'],
    placeId: 'dwarka-subcity',
    interchange: false,
    fact: 'Elevated stop directly outside Vegas Mall in Dwarka.',
  },
  {
    id: 'metro-janakpuri-west',
    name: 'Janakpuri West',
    x: 780,
    y: 1460,
    lines: ['blue', 'magenta'],
    placeId: 'dwarka-subcity',
    interchange: true,
    major: true,
    fact: 'Major West Delhi interchange featuring one of India’s tallest escalators.',
  },
  {
    id: 'metro-rajouri-garden',
    name: 'Rajouri Garden',
    x: 1020,
    y: 1350,
    lines: ['blue', 'pink'],
    placeId: 'rajouri-west',
    interchange: true,
    major: true,
    fact: 'West Delhi Blue-Pink interchange serving Tagore Garden & Rajouri malls.',
  },
  {
    id: 'metro-kirti-nagar',
    name: 'Kirti Nagar',
    x: 1220,
    y: 1320,
    lines: ['blue', 'green'],
    placeId: 'rajouri-west',
    interchange: true,
    fact: 'Blue-Green interchange serving West Delhi commercial & furniture markets.',
  },
  {
    id: 'metro-karol-bagh',
    name: 'Karol Bagh',
    x: 1440,
    y: 1320,
    lines: ['blue'],
    placeId: 'rajouri-west',
    interchange: false,
    major: true,
    fact: 'Bustling shopping street famous for Ajmal Khan Road & Ghaffar Market.',
  },
  {
    id: 'metro-rk-ashram',
    name: 'RK Ashram Marg',
    x: 1680,
    y: 1380,
    lines: ['blue'],
    placeId: 'connaught-place',
    interchange: false,
    fact: 'Paharganj & Connaught Place western approach station.',
  },
  {
    id: 'metro-barakhamba',
    name: 'Barakhamba Road',
    x: 2040,
    y: 1440,
    lines: ['blue'],
    placeId: 'connaught-place',
    interchange: false,
    fact: 'Office & theater hub just east of Connaught Place’s Outer Circle.',
  },
  {
    id: 'metro-mandi-house',
    name: 'Mandi House',
    x: 2180,
    y: 1460,
    lines: ['blue', 'violet'],
    placeId: 'connaught-place',
    interchange: true,
    major: true,
    fact: 'Cultural district interchange near National School of Drama.',
  },
  {
    id: 'metro-supreme-court',
    name: 'Supreme Court (Pragati Maidan)',
    x: 2350,
    y: 1520,
    lines: ['blue'],
    placeId: 'india-gate',
    interchange: false,
    fact: 'Serves Bharat Mandapam / Pragati Maidan exhibition grounds.',
  },
  {
    id: 'metro-yamuna-bank',
    name: 'Yamuna Bank',
    x: 2740,
    y: 1380,
    lines: ['blue'],
    placeId: 'akshardham-yamuna',
    interchange: true,
    major: true,
    fact: 'Blue Line riverfront hub splitting toward Noida and Anand Vihar / Vaishali.',
  },
  {
    id: 'metro-anand-vihar',
    name: 'Anand Vihar ISBT',
    x: 3120,
    y: 1180,
    lines: ['blue', 'pink'],
    placeId: 'akshardham-yamuna',
    interchange: true,
    major: true,
    fact: 'East Delhi rail & bus terminal interchange on Blue and Pink lines.',
  },
  {
    id: 'metro-vaishali',
    name: 'Vaishali (Ghaziabad)',
    x: 3380,
    y: 1100,
    lines: ['blue'],
    placeId: 'akshardham-yamuna',
    interchange: false,
    major: true,
    fact: 'Ghaziabad Blue Line branch terminus serving Kaushambi and Vaishali.',
  },
  {
    id: 'metro-akshardham',
    name: 'Akshardham',
    x: 2920,
    y: 1520,
    lines: ['blue'],
    placeId: 'akshardham-yamuna',
    interchange: false,
    major: true,
    fact: 'Elevated Blue Line stop beside the Akshardham temple complex.',
  },
  {
    id: 'metro-mayur-vihar-1',
    name: 'Mayur Vihar Phase 1',
    x: 3040,
    y: 1680,
    lines: ['blue', 'pink'],
    placeId: 'akshardham-yamuna',
    interchange: true,
    fact: 'Elevated Blue-Pink interchange in East Delhi.',
  },
  {
    id: 'metro-noida-18',
    name: 'Noida Sector 18',
    x: 3420,
    y: 1960,
    lines: ['blue'],
    placeId: 'noida-sector-18',
    interchange: false,
    major: true,
    fact: 'Heart of Noida’s commercial district beside DLF Mall of India & TGIP.',
  },
  {
    id: 'metro-botanical-garden',
    name: 'Botanical Garden',
    x: 3600,
    y: 2120,
    lines: ['blue', 'magenta'],
    placeId: 'noida-sector-18',
    interchange: true,
    major: true,
    fact: 'NCR’s first interchange outside Delhi, linking Blue and Magenta lines.',
  },
  {
    id: 'metro-noida-city-centre',
    name: 'Noida City Centre',
    x: 3820,
    y: 2040,
    lines: ['blue'],
    placeId: 'noida-sector-18',
    interchange: false,
    fact: 'Major Noida transit plaza near Sector 32.',
  },
  {
    id: 'metro-noida-elec-city',
    name: 'Noida Electronic City',
    x: 4040,
    y: 1900,
    lines: ['blue'],
    placeId: 'noida-sector-18',
    interchange: false,
    major: true,
    fact: 'Eastern terminus of the Blue Line at Noida Sector 62/63.',
  },

  // Violet Line
  {
    id: 'metro-lal-qila',
    name: 'Lal Qila',
    x: 2190,
    y: 920,
    lines: ['violet'],
    placeId: 'red-fort-jama',
    interchange: false,
    major: true,
    fact: 'Heritage Line stop steps from Red Fort’s Lahore Gate.',
  },
  {
    id: 'metro-jama-masjid',
    name: 'Jama Masjid',
    x: 2160,
    y: 1090,
    lines: ['violet'],
    placeId: 'red-fort-jama',
    interchange: false,
    major: true,
    fact: 'Deep underground Heritage Line station serving Jama Masjid & Karim’s.',
  },
  {
    id: 'metro-ito',
    name: 'ITO',
    x: 2240,
    y: 1290,
    lines: ['violet'],
    placeId: 'connaught-place',
    interchange: false,
    fact: 'Media & institutional hub along Bahadur Shah Zafar Marg.',
  },
  {
    id: 'metro-janpath',
    name: 'Janpath',
    x: 2060,
    y: 1600,
    lines: ['violet'],
    placeId: 'connaught-place',
    interchange: false,
    fact: 'Steps from Janpath Market and National Museum.',
  },
  {
    id: 'metro-khan-market',
    name: 'Khan Market',
    x: 2120,
    y: 1930,
    lines: ['violet'],
    placeId: 'lodhi-district',
    interchange: false,
    major: true,
    fact: 'Walkable access to Khan Market eateries and Lodhi Gardens.',
  },
  {
    id: 'metro-lajpat-nagar',
    name: 'Lajpat Nagar',
    x: 2260,
    y: 2140,
    lines: ['violet', 'pink'],
    placeId: 'lodhi-district',
    interchange: true,
    major: true,
    fact: 'Violet-Pink interchange near Central Market Lajpat Nagar.',
  },
  {
    id: 'metro-nehru-place',
    name: 'Nehru Place',
    x: 2450,
    y: 2320,
    lines: ['violet'],
    placeId: 'kalkaji-nehru',
    interchange: false,
    fact: 'South Delhi’s iconic tech & electronics plaza.',
  },
  {
    id: 'metro-kalkaji',
    name: 'Kalkaji Mandir',
    x: 2630,
    y: 2420,
    lines: ['violet', 'magenta'],
    placeId: 'kalkaji-nehru',
    interchange: true,
    major: true,
    fact: 'Violet-Magenta interchange steps from the Lotus Temple.',
  },
  {
    id: 'metro-badarpur',
    name: 'Badarpur Border',
    x: 2820,
    y: 2680,
    lines: ['violet'],
    placeId: 'kalkaji-nehru',
    interchange: false,
    fact: 'Delhi-Haryana border station along Mathura Road.',
  },
  {
    id: 'metro-faridabad',
    name: 'Escorts Mujesar (Faridabad)',
    x: 2980,
    y: 2920,
    lines: ['violet'],
    placeId: 'kalkaji-nehru',
    interchange: false,
    major: true,
    fact: 'Southern NCR Violet Line corridor serving Faridabad.',
  },

  // Red Line (West -> East)
  {
    id: 'metro-rithala',
    name: 'Rithala',
    x: 680,
    y: 380,
    lines: ['red'],
    placeId: 'rohini-pitampura',
    interchange: false,
    major: true,
    fact: 'North-West terminus of the Red Line in Rohini.',
  },
  {
    id: 'metro-rohini-west',
    name: 'Rohini West',
    x: 880,
    y: 440,
    lines: ['red'],
    placeId: 'rohini-pitampura',
    interchange: false,
    fact: 'Serves Unity One Rohini and Adventure Island.',
  },
  {
    id: 'metro-nsp',
    name: 'Netaji Subhash Place',
    x: 1140,
    y: 540,
    lines: ['red', 'pink'],
    placeId: 'rohini-pitampura',
    interchange: true,
    major: true,
    fact: 'Red-Pink interchange in Pitampura’s commercial hub.',
  },
  {
    id: 'metro-inderlok',
    name: 'Inderlok',
    x: 1460,
    y: 660,
    lines: ['red', 'green'],
    placeId: 'chandni-chowk',
    interchange: true,
    major: true,
    fact: 'Red-Green interchange junction in North-Central Delhi.',
  },
  {
    id: 'metro-welcome',
    name: 'Welcome',
    x: 2580,
    y: 720,
    lines: ['red', 'pink'],
    placeId: 'shahdara-ghaziabad',
    interchange: true,
    fact: 'East Delhi Red-Pink interchange.',
  },
  {
    id: 'metro-shahdara',
    name: 'Shahdara',
    x: 2820,
    y: 680,
    lines: ['red'],
    placeId: 'shahdara-ghaziabad',
    interchange: false,
    fact: 'Historic Red Line station in East Delhi.',
  },
  {
    id: 'metro-shaheed-sthal',
    name: 'Shaheed Sthal (Ghaziabad)',
    x: 3240,
    y: 600,
    lines: ['red'],
    placeId: 'shahdara-ghaziabad',
    interchange: false,
    major: true,
    fact: 'Eastern Red Line terminus in Ghaziabad NCR.',
  },

  // Pink Line Ring Segments
  {
    id: 'metro-sarojini-nagar',
    name: 'Sarojini Nagar',
    x: 1710,
    y: 2020,
    lines: ['pink'],
    placeId: 'lodhi-district',
    interchange: false,
    major: true,
    fact: 'Direct Pink Line gateway to Delhi’s famous bargain street market.',
  },
  {
    id: 'metro-nizamuddin',
    name: 'Hazrat Nizamuddin',
    x: 2440,
    y: 1960,
    lines: ['pink'],
    placeId: 'nizamuddin',
    interchange: false,
    major: true,
    fact: 'Pink Line stop connecting Nizamuddin Railway Station & Humayun’s Tomb.',
  },
  {
    id: 'metro-shiv-vihar',
    name: 'Shiv Vihar',
    x: 2740,
    y: 420,
    lines: ['pink'],
    placeId: 'shahdara-ghaziabad',
    interchange: false,
    major: true,
    fact: 'North-Eastern terminus of the Pink Line.',
  },

  // Magenta Line Key Stops
  {
    id: 'metro-igi-t1',
    name: 'Terminal 1 - IGI Airport',
    x: 1120,
    y: 2060,
    lines: ['magenta'],
    placeId: 'aerocity-igi',
    interchange: false,
    major: true,
    fact: 'Magenta Line underground station directly serving domestic Terminal 1.',
  },
  {
    id: 'metro-vasant-vihar',
    name: 'Vasant Vihar',
    x: 1420,
    y: 2340,
    lines: ['magenta'],
    placeId: 'hauz-khas',
    interchange: false,
    fact: 'Serves Vasant Vihar & Vasant Kunj malls.',
  },
  {
    id: 'metro-okhla-nsic',
    name: 'Okhla NSIC',
    x: 2880,
    y: 2340,
    lines: ['magenta'],
    placeId: 'kalkaji-nehru',
    interchange: false,
    fact: 'South-East Magenta corridor bridging Kalkaji to Noida Botanical Garden.',
  },

  // Airport Express (Orange Line)
  {
    id: 'metro-shivaji-stadium',
    name: 'Shivaji Stadium',
    x: 1780,
    y: 1480,
    lines: ['orange'],
    placeId: 'connaught-place',
    interchange: false,
    fact: 'Express check-in station beside Connaught Place.',
  },
  {
    id: 'metro-dhaula-kuan',
    name: 'Dhaula Kuan',
    x: 1460,
    y: 1760,
    lines: ['orange', 'pink'],
    placeId: 'india-gate',
    interchange: true,
    major: true,
    fact: 'High-speed interchange connecting Airport Express to Pink Line South Campus.',
  },
  {
    id: 'metro-aerocity',
    name: 'Delhi Aerocity',
    x: 1140,
    y: 1920,
    lines: ['orange'],
    placeId: 'aerocity-igi',
    interchange: false,
    major: true,
    fact: 'Express hub serving Worldmark Aerocity & hospitality district.',
  },
  {
    id: 'metro-igi-t3',
    name: 'IGI Airport (T3)',
    x: 820,
    y: 1900,
    lines: ['orange'],
    placeId: 'aerocity-igi',
    interchange: false,
    major: true,
    fact: 'Underground Airport Express station at Indira Gandhi International Terminal 3.',
  },

  // Rapid Metro Gurugram
  {
    id: 'metro-dlf-phase-2',
    name: 'DLF Phase 2',
    x: 930,
    y: 2770,
    lines: ['rapid'],
    placeId: 'gurugram-cyberhub',
    interchange: false,
    fact: 'Elevated Rapid Metro viaduct linking Sikanderpur to Cyber City.',
  },
  {
    id: 'metro-cyberhub',
    name: 'CyberHub (DLF Cyber City)',
    x: 780,
    y: 2760,
    lines: ['rapid'],
    placeId: 'gurugram-cyberhub',
    interchange: false,
    major: true,
    fact: 'Rapid Metro loop station right beside DLF CyberHub’s dining amphitheater.',
  },

  // Green Line (West Corridor to Bahadurgarh)
  {
    id: 'metro-punjabi-bagh',
    name: 'Punjabi Bagh West',
    x: 1180,
    y: 960,
    lines: ['green', 'pink'],
    placeId: 'rajouri-west',
    interchange: true,
    fact: 'Green-Pink interchange linking West Delhi ring corridor.',
  },
  {
    id: 'metro-peeragarhi',
    name: 'Peeragarhi',
    x: 820,
    y: 920,
    lines: ['green'],
    placeId: 'rohini-pitampura',
    interchange: false,
    fact: 'Outer Ring Road junction along West Delhi’s Green Line.',
  },
  {
    id: 'metro-mundka',
    name: 'Mundka',
    x: 480,
    y: 880,
    lines: ['green'],
    placeId: 'rohini-pitampura',
    interchange: false,
    fact: 'Industrial & suburban West Delhi station on the Green Line.',
  },
  {
    id: 'metro-bahadurgarh',
    name: 'Brigadier Hoshiyar Singh (Bahadurgarh)',
    x: 220,
    y: 850,
    lines: ['green'],
    placeId: 'dwarka-subcity',
    interchange: false,
    major: true,
    fact: 'Western Green Line terminus crossing into Bahadurgarh, Haryana NCR.',
  },

  // Grey Line (Dwarka -> Najafgarh / Dhansa)
  {
    id: 'metro-dwarka-main',
    name: 'Dwarka',
    x: 510,
    y: 1360,
    lines: ['blue', 'grey'],
    placeId: 'dwarka-subcity',
    interchange: true,
    fact: 'Blue-Grey interchange branching out toward Najafgarh.',
  },
  {
    id: 'metro-najafgarh',
    name: 'Najafgarh',
    x: 310,
    y: 1290,
    lines: ['grey'],
    placeId: 'dwarka-subcity',
    interchange: false,
    fact: 'Grey Line station serving Najafgarh town in South-West Delhi.',
  },
  {
    id: 'metro-dhansa',
    name: 'Dhansa Bus Stand',
    x: 180,
    y: 1240,
    lines: ['grey'],
    placeId: 'dwarka-subcity',
    interchange: false,
    major: true,
    fact: 'Western terminus of the Grey Line in South-West Delhi NCR.',
  },
];

export const METRO_LINES: MetroLine[] = [
  {
    id: 'yellow',
    name: 'Yellow Line',
    color: '#EAB308',
    stationIds: [
      'metro-samaypur-badli',
      'metro-azadpur',
      'metro-vishwavidyalaya',
      'metro-civil-lines',
      'metro-kashmere-gate',
      'metro-chandni-chowk',
      'metro-chawri-bazar',
      'metro-new-delhi',
      'metro-rajiv-chowk',
      'metro-patel-chowk',
      'metro-central-sec',
      'metro-jor-bagh',
      'metro-ina',
      'metro-aiims',
      'metro-green-park',
      'metro-hauz-khas',
      'metro-malviya-nagar',
      'metro-saket',
      'metro-qutub-minar',
      'metro-chhatarpur',
      'metro-sikanderpur',
      'metro-mg-road',
      'metro-iffco-chowk',
      'metro-huda-city',
    ],
  },
  {
    id: 'blue',
    name: 'Blue Line',
    color: '#2563EB',
    stationIds: [
      'metro-dwarka-21',
      'metro-dwarka-14',
      'metro-janakpuri-west',
      'metro-rajouri-garden',
      'metro-kirti-nagar',
      'metro-karol-bagh',
      'metro-rk-ashram',
      'metro-rajiv-chowk',
      'metro-barakhamba',
      'metro-mandi-house',
      'metro-supreme-court',
      'metro-yamuna-bank',
      'metro-akshardham',
      'metro-mayur-vihar-1',
      'metro-noida-18',
      'metro-botanical-garden',
      'metro-noida-city-centre',
      'metro-noida-elec-city',
    ],
  },
  {
    id: 'violet',
    name: 'Violet Line',
    color: '#7C3AED',
    stationIds: [
      'metro-kashmere-gate',
      'metro-lal-qila',
      'metro-jama-masjid',
      'metro-ito',
      'metro-mandi-house',
      'metro-janpath',
      'metro-central-sec',
      'metro-khan-market',
      'metro-lajpat-nagar',
      'metro-nehru-place',
      'metro-kalkaji',
      'metro-badarpur',
      'metro-faridabad',
    ],
  },
  {
    id: 'magenta',
    name: 'Magenta Line',
    color: '#DB2777',
    stationIds: [
      'metro-janakpuri-west',
      'metro-igi-t1',
      'metro-vasant-vihar',
      'metro-hauz-khas',
      'metro-kalkaji',
      'metro-okhla-nsic',
      'metro-botanical-garden',
    ],
  },
  {
    id: 'red',
    name: 'Red Line',
    color: '#DC2626',
    stationIds: [
      'metro-rithala',
      'metro-rohini-west',
      'metro-nsp',
      'metro-inderlok',
      'metro-kashmere-gate',
      'metro-welcome',
      'metro-shahdara',
      'metro-shaheed-sthal',
    ],
  },
  {
    id: 'pink',
    name: 'Pink Line',
    color: '#EC4899',
    stationIds: [
      'metro-azadpur',
      'metro-nsp',
      'metro-rajouri-garden',
      'metro-dhaula-kuan',
      'metro-sarojini-nagar',
      'metro-ina',
      'metro-lajpat-nagar',
      'metro-nizamuddin',
      'metro-mayur-vihar-1',
      'metro-anand-vihar',
      'metro-welcome',
      'metro-shiv-vihar',
    ],
  },
  {
    id: 'orange',
    name: 'Airport Express',
    color: '#EA580C',
    stationIds: [
      'metro-new-delhi',
      'metro-shivaji-stadium',
      'metro-dhaula-kuan',
      'metro-aerocity',
      'metro-igi-t3',
      'metro-dwarka-21',
    ],
  },
  {
    id: 'rapid',
    name: 'Rapid Metro Gurugram',
    color: '#0EA5E9',
    stationIds: ['metro-sikanderpur', 'metro-dlf-phase-2', 'metro-cyberhub'],
  },
  {
    id: 'green',
    name: 'Green Line',
    color: '#16A34A',
    stationIds: [
      'metro-inderlok',
      'metro-punjabi-bagh',
      'metro-peeragarhi',
      'metro-mundka',
      'metro-bahadurgarh',
    ],
  },
  {
    id: 'grey',
    name: 'Grey Line',
    color: '#64748B',
    stationIds: ['metro-dwarka-main', 'metro-najafgarh', 'metro-dhansa'],
  },
];

// Blue Line Vaishali & Green Line Kirti Nagar spur edges
const EXTRA_METRO_EDGES: Array<[string, string, MetroLineId]> = [
  ['metro-yamuna-bank', 'metro-anand-vihar', 'blue'],
  ['metro-anand-vihar', 'metro-vaishali', 'blue'],
  ['metro-punjabi-bagh', 'metro-kirti-nagar', 'green'],
  ['metro-dwarka-14', 'metro-dwarka-main', 'blue'],
];

export const HERITAGE_SITES: HeritageSite[] = [
  {
    id: 'heritage-red-fort',
    name: 'Red Fort (Lal Qila)',
    era: '1648 · UNESCO Mughal Fortress',
    x: 2340,
    y: 960,
    placeId: 'red-fort-jama',
    ticketPrice: 35,
    rewardRupees: 130,
    stampTitle: 'Lahore Gate Seal',
    silhouette: 'redfort',
    description:
      'Constructed by Emperor Shah Jahan as the palace fort of Shahjahanabad, with towering red sandstone walls, Diwan-i-Aam, and marble pavilions.',
    trivia: {
      question: 'Which Mughal emperor commissioned the Red Fort in 1638?',
      options: ['Akbar', 'Shah Jahan', 'Aurangzeb'],
      correctIndex: 1,
    },
  },
  {
    id: 'heritage-jama-masjid',
    name: 'Jama Masjid',
    era: '1656 · Grand Courtyard Mosque',
    x: 2140,
    y: 1010,
    placeId: 'red-fort-jama',
    ticketPrice: 0,
    rewardRupees: 95,
    stampTitle: 'Three Marble Domes',
    silhouette: 'jamamasjid',
    description:
      'One of India’s largest mosques, crowning Bhojala Pahadi hill with striped red sandstone and white marble minarets overlooking Old Delhi.',
    trivia: {
      question: 'How many main white marble domes crown the prayer hall of Jama Masjid?',
      options: ['Two', 'Three', 'Five'],
      correctIndex: 1,
    },
  },
  {
    id: 'heritage-india-gate',
    name: 'India Gate',
    era: '1931 · Lutyens’ Sandstone Arch',
    x: 2150,
    y: 1730,
    placeId: 'india-gate',
    ticketPrice: 0,
    rewardRupees: 90,
    stampTitle: 'Kartavya Path Crest',
    silhouette: 'indiagate',
    description:
      'Designed by Sir Edwin Lutyens in Bharatpur sandstone along the ceremonial Kartavya Path, honoring over 70,000 soldiers.',
    trivia: {
      question: 'Who was the chief British architect behind India Gate?',
      options: ['Edwin Lutyens', 'Herbert Baker', 'Robert Russell'],
      correctIndex: 0,
    },
  },
  {
    id: 'heritage-baoli',
    name: 'Agrasen ki Baoli',
    era: '14th Century · Protected Stepwell',
    x: 2020,
    y: 1540,
    placeId: 'connaught-place',
    ticketPrice: 0,
    rewardRupees: 100,
    stampTitle: '108 Stone Steps',
    silhouette: 'baoli',
    description:
      'A dramatic 60-metre-long stone stepwell hidden just off Hailey Road near Connaught Place, featuring three tiers of arched niches.',
    trivia: {
      question: 'Roughly how many stone steps descend into Agrasen ki Baoli?',
      options: ['42 steps', '108 steps', '250 steps'],
      correctIndex: 1,
    },
  },
  {
    id: 'heritage-humayun',
    name: "Humayun's Tomb",
    era: '1570 · UNESCO Charbagh Tomb',
    x: 2490,
    y: 2020,
    placeId: 'nizamuddin',
    ticketPrice: 35,
    rewardRupees: 140,
    stampTitle: 'Charbagh Double Dome',
    silhouette: 'humayun',
    description:
      'Commissioned by Empress Bega Begum, this pioneering garden-tomb inspired the architectural lineage of the Taj Mahal.',
    trivia: {
      question: 'Which architectural garden layout surrounds Humayun’s Tomb?',
      options: ['Charbagh four-quadrant garden', 'Terraced hanging garden', 'Zen rock courtyard'],
      correctIndex: 0,
    },
  },
  {
    id: 'heritage-lodhi',
    name: 'Bara Gumbad & Lodhi Tombs',
    era: '1494 · Lodhi Dynasty Parkland',
    x: 1960,
    y: 2040,
    placeId: 'lodhi-district',
    ticketPrice: 0,
    rewardRupees: 100,
    stampTitle: 'Lodhi Dome Crest',
    silhouette: 'lodhi',
    description:
      'Atmospheric 15th-century octagonal tombs and arched bridges nestled inside Delhi’s favorite morning-walk botanical garden.',
    trivia: {
      question: 'Which centuries saw the construction of the tombs inside Lodhi Gardens?',
      options: ['15th–16th century', '19th century', '11th century'],
      correctIndex: 0,
    },
  },
  {
    id: 'heritage-hauz-khas',
    name: 'Hauz Khas Fort & Tank',
    era: '1296 · Khalji & Tughlaq Ruins',
    x: 1700,
    y: 2330,
    placeId: 'hauz-khas',
    ticketPrice: 0,
    rewardRupees: 110,
    stampTitle: 'Royal Reservoir Arch',
    silhouette: 'hauzkhas',
    description:
      'Built originally by Alauddin Khalji as a royal water reservoir and later expanded with a madrasa by Firoz Shah Tughlaq.',
    trivia: {
      question: 'What does the Persian phrase "Hauz Khas" translate to?',
      options: ['Royal Tank', 'Red Pavilion', 'Wind Tower'],
      correctIndex: 0,
    },
  },
  {
    id: 'heritage-qutub',
    name: 'Qutub Minar & Iron Pillar',
    era: '1199 · UNESCO Victory Tower',
    x: 1580,
    y: 2630,
    placeId: 'qutub-mehrauli',
    ticketPrice: 35,
    rewardRupees: 160,
    stampTitle: 'Fluted Minar Seal',
    silhouette: 'qutub',
    description:
      'A soaring 72.5-metre fluted red sandstone and marble minaret standing beside the 1,600-year-old rust-resistant Gupta Iron Pillar.',
    trivia: {
      question: 'Approximately how tall is the Qutub Minar?',
      options: ['42 metres', '72.5 metres', '105 metres'],
      correctIndex: 1,
    },
  },
  {
    id: 'heritage-lotus',
    name: 'Lotus Temple',
    era: '1986 · 27 Marble Petals',
    x: 2560,
    y: 2340,
    placeId: 'kalkaji-nehru',
    ticketPrice: 0,
    rewardRupees: 115,
    stampTitle: 'White Lotus Crest',
    silhouette: 'lotus',
    description:
      'Designed by architect Fariborz Sahba with 27 free-standing white marble-clad petals arranged in clusters of three, open to all faiths.',
    trivia: {
      question: 'How many marble-clad petals form the Lotus Temple?',
      options: ['18 petals', '27 petals', '36 petals'],
      correctIndex: 1,
    },
  },
  {
    id: 'heritage-akshardham',
    name: 'Swaminarayan Akshardham',
    era: '2005 · Carved Pink Sandstone',
    x: 2980,
    y: 1410,
    placeId: 'akshardham-yamuna',
    ticketPrice: 0,
    rewardRupees: 120,
    stampTitle: 'Yamuna Sandstone Spire',
    silhouette: 'akshardham',
    description:
      'Intricately hand-carved Rajasthani pink sandstone and Italian Carrara marble monument celebrating Indian art and stepwell traditions.',
    trivia: {
      question: 'Which stone gives Akshardham its warm rosy exterior hue?',
      options: ['Rajasthani pink sandstone', 'Black basalt', 'Blue granite'],
      correctIndex: 0,
    },
  },
];

export const RESTAURANTS: RestaurantSpot[] = [
  {
    id: 'rest-ama-cafe',
    name: 'AMA Café',
    specialty: 'Tibetan & Himalayan Bakery',
    x: 2040,
    y: 440,
    placeId: 'majnu-ka-tila',
    vibe: 'Warm wood-lined cafe tucked inside Majnu Ka Tila’s prayer-flag lanes.',
    menu: [
      { id: 'ama-breakfast', name: 'Himalayan Breakfast Platter', price: 290, energyRestore: 48, isVeg: false, description: 'Fluffy pancakes, eggs, roasted potatoes & house jam.' },
      { id: 'ama-tingmo', name: 'Steamed Tingmo & Veg Sabzi', price: 180, energyRestore: 34, isVeg: true, description: 'Soft layered Tibetan bread with spiced potato stew.' },
      { id: 'ama-mudcake', name: 'Signature Chocolate Mud Cake', price: 160, energyRestore: 30, isVeg: true, description: 'Rich fudge slice dusted with cocoa.' },
      { id: 'ama-buttertea', name: 'Salted Tibetan Butter Tea', price: 90, energyRestore: 22, isVeg: true, description: 'Traditional warm yak-butter & tea infusion.' },
    ],
  },
  {
    id: 'rest-paranthe-wali',
    name: 'Paranthe Wali Gali',
    specialty: '1870s Stuffed Fried Paranthas',
    x: 1860,
    y: 960,
    placeId: 'chandni-chowk',
    vibe: 'Historic narrow lane sizzling with pure-ghee paranthas served alongside tamarind chutney & sitaphal sabzi.',
    menu: [
      { id: 'pwg-aloo', name: 'Aloo-Pyaaz Parantha Platter', price: 90, energyRestore: 28, isVeg: true, description: 'Crisp shallow-fried spiced potato parantha with three curries.' },
      { id: 'pwg-rabri', name: 'Sweet Rabri Parantha', price: 140, energyRestore: 36, isVeg: true, description: 'Flaky golden parantha stuffed with thickened saffron rabri.' },
      { id: 'pwg-lassi', name: 'Kulhad Kesar Lassi', price: 70, energyRestore: 22, isVeg: true, description: 'Chilled churned yogurt topped with saffron & pistachios.' },
    ],
  },
  {
    id: 'rest-natraj',
    name: 'Natraj Dahi Bhalla Corner',
    specialty: 'Old Delhi Chaat Since 1940',
    x: 2010,
    y: 930,
    placeId: 'chandni-chowk',
    vibe: 'Perpetually crowded street corner famous for velvety yogurt bhallas and crisp ghee-roasted aloo tikki.',
    menu: [
      { id: 'natraj-bhalla', name: 'Signature Dahi Bhalla', price: 80, energyRestore: 26, isVeg: true, description: 'Melt-in-mouth lentil dumplings drenched in chilled dahi & saunth.' },
      { id: 'natraj-tikki', name: 'Desi Ghee Aloo Tikki', price: 70, energyRestore: 24, isVeg: true, description: 'Crisp potato patty topped with pomegranate & mint chutney.' },
      { id: 'natraj-kanji', name: 'Spiced Kanji Vada', price: 60, energyRestore: 20, isVeg: true, description: 'Tangy mustard-fermented probiotic drink with moong vadas.' },
    ],
  },
  {
    id: 'rest-karims',
    name: "Karim's (Gali Kababian)",
    specialty: 'Mughlai Royal Kitchen Since 1913',
    x: 2220,
    y: 1080,
    placeId: 'red-fort-jama',
    vibe: 'Founded by descendants of Mughal court chefs right beside Jama Masjid’s southern gate.',
    menu: [
      { id: 'karims-korma', name: 'Mutton Korma', price: 380, energyRestore: 56, isVeg: false, description: 'Slow-braised mutton in caramelized onion & cashew-cardamom gravy.' },
      { id: 'karims-jahangiri', name: 'Chicken Jahangiri', price: 360, energyRestore: 52, isVeg: false, description: 'Rich saffron-almond Mughlai chicken curry.' },
      { id: 'karims-seekh', name: 'Charcoal Seekh Kebab', price: 280, energyRestore: 42, isVeg: false, description: 'Smoky minced lamb skewers served with mint chutney.' },
      { id: 'karims-sheermal', name: 'Saffron Sheermal & Khamiri Roti', price: 45, energyRestore: 16, isVeg: true, description: 'Sweet saffron-brushed flatbread baked in a clay tandoor.' },
    ],
  },
  {
    id: 'rest-wengers',
    name: "Wenger's Bakery & Deli",
    specialty: 'Iconic 1926 CP Confectionery',
    x: 1800,
    y: 1380,
    placeId: 'connaught-place',
    vibe: 'A-Block Connaught Place institution famed for flaky patties, rolls, and nostalgic European pastries.',
    menu: [
      { id: 'wengers-patty', name: 'Flaky Mutton Patty', price: 85, energyRestore: 25, isVeg: false, description: 'Golden puff pastry filled with peppered minced mutton.' },
      { id: 'wengers-roll', name: 'Chicken Shammi Roll', price: 110, energyRestore: 28, isVeg: false, description: 'Soft bakery roll packed with spiced shammi kebab.' },
      { id: 'wengers-eclair', name: 'Classic Chocolate Eclair', price: 95, energyRestore: 24, isVeg: true, description: 'Choux pastry filled with vanilla custard & dark glaze.' },
    ],
  },
  {
    id: 'rest-kake',
    name: 'Kake Da Hotel',
    specialty: 'Legendary CP North Indian Dhaba',
    x: 1990,
    y: 1360,
    placeId: 'connaught-place',
    vibe: 'Outer Circle favorite serving bubbling copper-pot Butter Chicken and smoky tandoori naans since 1931.',
    menu: [
      { id: 'kake-butter-chicken', name: 'Signature Butter Chicken', price: 420, energyRestore: 58, isVeg: false, description: 'Tandoori chicken simmered in velvety tomato-makhan gravy.' },
      { id: 'kake-dal', name: '24-Hour Dal Makhani', price: 280, energyRestore: 44, isVeg: true, description: 'Slow-cooked black lentils finished with cream & kasuri methi.' },
      { id: 'kake-naan', name: 'Tandoori Garlic Naan', price: 75, energyRestore: 20, isVeg: true, description: 'Blistered flatbread brushed with roasted garlic butter.' },
    ],
  },
  {
    id: 'rest-andhra-bhavan',
    name: 'Andhra Bhavan Canteen',
    specialty: 'South Indian State Canteen',
    x: 2030,
    y: 1680,
    placeId: 'india-gate',
    vibe: 'No-frills Ashoka Road dining hall prized by Delhiites for generous, fiery coastal Andhra meals.',
    menu: [
      { id: 'andhra-thali', name: 'Unlimited Veg Andhra Thali', price: 220, energyRestore: 56, isVeg: true, description: 'Steamed rice, pappu, sambar, rasam, podi, curd & papad.' },
      { id: 'andhra-chicken', name: 'Spicy Andhra Chicken Fry', price: 260, energyRestore: 44, isVeg: false, description: 'Curry-leaf & black-pepper roasted chicken.' },
      { id: 'andhra-chaas', name: 'Spiced Buttermilk (Chaas)', price: 40, energyRestore: 16, isVeg: true, description: 'Cooling ginger-coriander yogurt refresher.' },
    ],
  },
  {
    id: 'rest-khan-chacha',
    name: 'Khan Chacha',
    specialty: 'Khan Market Rumali Rolls',
    x: 2170,
    y: 1980,
    placeId: 'lodhi-district',
    vibe: 'Bustling grill counter wrapped in the aromas of charcoal tikkas and thin rumali rotis.',
    menu: [
      { id: 'kc-kakori', name: 'Mutton Kakori Roll', price: 240, energyRestore: 42, isVeg: false, description: 'Melt-in-mouth spiced mutton kebab wrapped in rumali roti.' },
      { id: 'kc-paneer', name: 'Paneer Tikka Roll', price: 180, energyRestore: 36, isVeg: true, description: 'Char-grilled cottage cheese cubes with pickled onions & green chutney.' },
      { id: 'kc-soda', name: 'Mint Masala Shikanji', price: 60, energyRestore: 18, isVeg: true, description: 'Sparkling lime cooler with roasted cumin & black salt.' },
    ],
  },
  {
    id: 'rest-nizamuddin',
    name: 'Nizamuddin Kebab Corner',
    specialty: 'Basti Street Kebabs & Shahi Tukda',
    x: 2360,
    y: 1920,
    placeId: 'nizamuddin',
    vibe: 'Lantern-lit stalls near Nizamuddin Dargah frying crisp golden breads and plating saffron desserts.',
    menu: [
      { id: 'niz-galouti', name: 'Galouti Kebab & Ulta Tawa Paratha', price: 210, energyRestore: 42, isVeg: false, description: 'Delicate spiced patties paired with saffron-infused paratha.' },
      { id: 'niz-tukda', name: 'Saffron Shahi Tukda', price: 120, energyRestore: 30, isVeg: true, description: 'Ghee-toasted bread soaked in cardamom syrup & thick rabri.' },
      { id: 'niz-chai', name: 'Kulhad Masala Chai', price: 30, energyRestore: 15, isVeg: true, description: 'Earthy clay-cup tea brewed with ginger & crushed cardamom.' },
    ],
  },
  {
    id: 'rest-hauz-khas',
    name: 'Mia Bella & HKV Social',
    specialty: 'Lake-View Dining & Café Classics',
    x: 1790,
    y: 2320,
    placeId: 'hauz-khas',
    vibe: 'Terrace seating overlooking Hauz Khas Fort ruins and the calm medieval lake.',
    menu: [
      { id: 'hkv-biryani', name: 'Butter Chicken Biryani', price: 395, energyRestore: 54, isVeg: false, description: 'Fragrant basmati layered with smoky makhani chicken.' },
      { id: 'hkv-bunmaska', name: 'Bun Maska & Cutting Chai', price: 110, energyRestore: 26, isVeg: true, description: 'Warm buttered brioche bun with strong spiced chai.' },
      { id: 'hkv-banoffee', name: 'Salted Caramel Banoffee Pie', price: 240, energyRestore: 36, isVeg: true, description: 'Biscuit crust layered with banana, toffee & whipped cream.' },
    ],
  },
  {
    id: 'rest-brahmaputra',
    name: 'Brahmaputra Market Stalls',
    specialty: 'Noida Evening Chaat & Momos',
    x: 3620,
    y: 1910,
    placeId: 'noida-sector-18',
    vibe: 'Vibrant open-air Sector 29/18 promenade filled with steaming bamboo momo baskets and sizzling tawa rolls.',
    menu: [
      { id: 'noida-momos', name: 'Steamed Paneer & Herb Momos', price: 110, energyRestore: 30, isVeg: true, description: '8 handmade dumplings served with fiery red garlic chutney.' },
      { id: 'noida-kathi', name: 'Double Egg Chicken Kathi Roll', price: 130, energyRestore: 34, isVeg: false, description: 'Flaky lachha paratha layered with egg, chicken & chaat masala.' },
      { id: 'noida-coffee', name: 'Thick Market Cold Coffee', price: 90, energyRestore: 24, isVeg: true, description: 'Froth-topped blended iced coffee.' },
    ],
  },
  {
    id: 'rest-cyberhub',
    name: 'CyberHub Dhaba & Irani Kitchen',
    specialty: 'Parsi-Punjabi Flagship Dining',
    x: 720,
    y: 2910,
    placeId: 'gurugram-cyberhub',
    vibe: 'Retro Bombay-Irani café charm alongside upscale Punjabi dhaba platters in Gurugram’s amphitheater.',
    menu: [
      { id: 'ggn-berry-pulao', name: 'Signature Berry Pulao', price: 450, energyRestore: 60, isVeg: false, description: 'Fragrant saffron rice studded with tangy Iranian zereshk berries & spiced chicken.' },
      { id: 'ggn-keema', name: 'Bombay Keema Pav', price: 360, energyRestore: 48, isVeg: false, description: 'Spiced minced mutton with butter-toasted pav buns.' },
      { id: 'ggn-iranichai', name: 'Irani Chai & Brun Maska', price: 150, energyRestore: 30, isVeg: true, description: 'Velvety condensed-milk tea with crisp crusted buttered bun.' },
    ],
  },
  {
    id: 'rest-jalebi-wala',
    name: 'Old Famous Jalebi Wala',
    specialty: '1884 Pure Desi Ghee Jalebis',
    x: 1970,
    y: 840,
    placeId: 'chandni-chowk',
    vibe: 'Century-old Dariba Kalan corner frying giant crisp saffron jalebis in bubbling desi ghee.',
    menu: [
      { id: 'jalebi-hot', name: 'Hot Desi Ghee Jalebi (Plate)', price: 80, energyRestore: 26, isVeg: true, description: 'Thick crisp spirals soaked in saffron-cardamom syrup.' },
      { id: 'jalebi-rabri', name: 'Jalebi with Chilled Rabri', price: 130, energyRestore: 35, isVeg: true, description: 'Contrasting hot syrup crunch topped with creamy malai rabri.' },
      { id: 'jalebi-kachori', name: 'Mawa Dry-Fruit Kachori', price: 70, energyRestore: 22, isVeg: true, description: 'Sweet stuffed pastry glazed in sugar syrup.' },
    ],
  },
  {
    id: 'rest-shiv-misthan',
    name: 'Shiv Misthan Bhandar',
    specialty: 'Old Delhi Bedmi Puri & Halwa',
    x: 1840,
    y: 860,
    placeId: 'chandni-chowk',
    vibe: 'Bustling morning institution serving puffed spiced bedmi puris and semolina nagori halwa since 1910.',
    menu: [
      { id: 'shiv-bedmi', name: 'Bedmi Puri & Hing Aloo Sabzi', price: 75, energyRestore: 28, isVeg: true, description: 'Crisp lentil-stuffed puris with tangy asafoetida potato curry.' },
      { id: 'shiv-nagori', name: 'Nagori Halwa Combo', price: 85, energyRestore: 26, isVeg: true, description: 'Miniature crisp puris filled with warm suji halwa.' },
      { id: 'shiv-lassi', name: 'Matka Sweet Lassi', price: 60, energyRestore: 20, isVeg: true, description: 'Cream-topped earthen-pot lassi.' },
    ],
  },
  {
    id: 'rest-kwality-cp',
    name: 'Kwality Restaurant & Saravana Bhavan',
    specialty: 'Heritage CP Dining & South Indian',
    x: 1820,
    y: 1520,
    placeId: 'connaught-place',
    vibe: 'Classic 1940s Art Deco CP dining rooms paired with crisp South Indian tiffins and filter coffee.',
    menu: [
      { id: 'kwality-bc', name: 'Art Deco Butter Chicken & Naan', price: 490, energyRestore: 60, isVeg: false, description: 'Original 1940s CP-style creamy tomato chicken curry.' },
      { id: 'saravana-dosa', name: 'Rava Masala Dosa & Filter Coffee', price: 195, energyRestore: 38, isVeg: true, description: 'Lacy crisp semolina dosa with sambar, three chutneys & brass-tumbler coffee.' },
      { id: 'kwality-chole', name: 'Pindi Chole & Fluffy Bhature', price: 260, energyRestore: 44, isVeg: true, description: 'Spiced dark chickpeas with golden puffed bhature.' },
    ],
  },
  {
    id: 'rest-big-chill',
    name: 'Big Chill Café & Cakery',
    specialty: 'Khan Market Cult Italian & Shakes',
    x: 2060,
    y: 1960,
    placeId: 'lodhi-district',
    vibe: 'Poster-lined Khan Market favorite renowned across Delhi for generous baked pastas and decadent desserts.',
    menu: [
      { id: 'bc-penne', name: 'Penne in Vodka Cream Sauce', price: 520, energyRestore: 58, isVeg: true, description: 'Signature rich tomato-cream pasta with garlic bread.' },
      { id: 'bc-shake', name: 'Belgian Dark Chocolate Shake', price: 260, energyRestore: 36, isVeg: true, description: 'Thick hand-spun chocolate ice-cream shake.' },
      { id: 'bc-mississippi', name: 'Mississippi Mud Pie Slice', price: 310, energyRestore: 40, isVeg: true, description: 'Dense chocolate brownie mousse pie with hot fudge.' },
    ],
  },
  {
    id: 'rest-farzi-cafe',
    name: 'Farzi Café',
    specialty: 'Modern Indian Gastronomy',
    x: 840,
    y: 2810,
    placeId: 'gurugram-cyberhub',
    vibe: 'Theatrical CyberHub kitchen reimagining classic North Indian dishes with playful modern plating.',
    menu: [
      { id: 'farzi-arancini', name: 'Dal Chawal Arancini', price: 395, energyRestore: 48, isVeg: true, description: 'Crisp comfort-food rice spheres topped with achaar mayo & papad.' },
      { id: 'farzi-dilli6', name: 'Dilli 6 Butter Chicken Bao', price: 545, energyRestore: 58, isVeg: false, description: 'Pillowy steamed buns stuffed with smoky Old Delhi makhani chicken.' },
      { id: 'farzi-rasmalai', name: 'Rasmalai Tres Leches', price: 325, energyRestore: 36, isVeg: true, description: 'Saffron milk sponge cake topped with pistachio crunch.' },
    ],
  },
];

export const SHOPPING_MALLS: ShoppingMallSpot[] = [
  {
    id: 'mall-select-citywalk',
    name: 'Select CITYWALK',
    tagline: 'Saket Open-Air Plaza & IMAX Hub',
    x: 1920,
    y: 2620,
    placeId: 'qutub-mehrauli',
    vibe: 'South Delhi’s sun-drenched courtyard mall famous for weekend pop-up bazaars, indie bookstores, and PVR IMAX.',
    anchors: ['PVR IMAX', 'Bahrisons Books', 'Zara & Sephora', 'My Square Food Court'],
    items: [
      { id: 'scw-book', name: 'Delhi History Coffee-Table Book', category: 'Books & Crafts', price: 340, energyRestore: 10, description: 'Hardcover photographic chronicle from Bahrisons Booksellers.' },
      { id: 'scw-cinema', name: 'PVR IMAX Matinee Ticket', category: 'Cinema & Fun', price: 390, energyRestore: 35, description: 'Recliner screen pass with buttered caramel popcorn.' },
      { id: 'scw-coldbrew', name: 'Courtyard Artisanal Cold Brew', category: 'Café & Bakery', price: 190, energyRestore: 28, description: 'Single-origin iced coffee by the central fountain.' },
    ],
  },
  {
    id: 'mall-dlf-promenade',
    name: 'DLF Promenade & Emporio',
    tagline: 'Vasant Kunj Flagship Galleria',
    x: 1380,
    y: 2460,
    placeId: 'hauz-khas',
    vibe: 'Twin luxury and high-street fashion destinations featuring landscaped Hub gardens and European patisseries.',
    anchors: ['The Hub Courtyard', 'PVR Icon', 'Luxury Atriums', 'Patisserie & Bistro'],
    items: [
      { id: 'prom-croissant', name: 'Almond Croissant & Flat White', category: 'Café & Bakery', price: 280, energyRestore: 34, description: 'Flaky French bakery pairing in the sunlit atrium.' },
      { id: 'prom-scarf', name: 'Handloom Pashmina Pocket Square', category: 'Boutique', price: 420, energyRestore: 12, description: 'Crafted artisan souvenir from the heritage boutique.' },
      { id: 'prom-gelato', name: 'Pistachio Saffron Gelato Cup', category: 'Café & Bakery', price: 180, energyRestore: 24, description: 'Slow-churned Italian gelato at The Hub.' },
    ],
  },
  {
    id: 'mall-ambience-gurugram',
    name: 'Ambience Mall Gurugram',
    tagline: 'NH-48 Kilometre-Long Retail Landmark',
    x: 960,
    y: 2660,
    placeId: 'gurugram-cyberhub',
    vibe: 'Colossal multi-level NCR mall on the Delhi-Gurugram border housing iSKATE ice rink, bowling alleys, and mega stores.',
    anchors: ['iSKATE Ice Rink', 'PVR Director’s Cut', 'Hamleys', 'Grand Atrium'],
    items: [
      { id: 'amb-skate', name: 'iSKATE Ice Skating Session', category: 'Cinema & Fun', price: 450, energyRestore: 30, description: '45-minute indoor rink pass with skates and hot cocoa.' },
      { id: 'amb-bowling', name: 'Smaaash Bowling & Arcade Card', category: 'Cinema & Fun', price: 320, energyRestore: 24, description: '10 frames of neon bowling and arcade tokens.' },
      { id: 'amb-pretzel', name: 'Cinnamon Sugar Soft Pretzel', category: 'Café & Bakery', price: 150, energyRestore: 25, description: 'Warm baked pretzel from the lower concourse.' },
    ],
  },
  {
    id: 'mall-dlf-cyberhub',
    name: 'DLF CyberHub Plaza',
    tagline: 'Gurugram Open-Air Dining & Lifestyle Hub',
    x: 740,
    y: 2810,
    placeId: 'gurugram-cyberhub',
    vibe: 'Vibrant glass-canopy amphitheater blending comedy clubs, craft breweries, micro-roasteries, and boutique pop-ups.',
    anchors: ['Amphitheater Stage', 'The People & Co.', 'Rapid Metro Plaza', 'Artisan Roasters'],
    items: [
      { id: 'ch-standup', name: 'Evening Comedy Amphitheater Pass', category: 'Cinema & Fun', price: 350, energyRestore: 30, description: 'Front-row laugh pass at CyberHub’s central stage.' },
      { id: 'ch-matcha', name: 'Iced Vanilla Matcha Latte', category: 'Café & Bakery', price: 220, energyRestore: 28, description: 'Chilled ceremonial matcha poured over oat milk.' },
      { id: 'ch-tote', name: 'Millennium City Canvas Tote', category: 'Boutique', price: 240, energyRestore: 10, description: 'Minimalist architectural screen-printed tote bag.' },
    ],
  },
  {
    id: 'mall-dlf-mall-of-india',
    name: 'DLF Mall of India',
    tagline: 'Noida Sector 18 Mega-Destination',
    x: 3440,
    y: 1860,
    placeId: 'noida-sector-18',
    vibe: 'Seven sprawling levels divided into international fashion zones, Snow World, and an enormous 4th-floor dining court.',
    anchors: ['Snow World Noida', 'PVR 7-Screen Multiplex', 'Decathlon', 'Eat Lounge'],
    items: [
      { id: 'moi-snow', name: 'Snow World Winter Entry Pass', category: 'Cinema & Fun', price: 480, energyRestore: 32, description: 'Sub-zero indoor snow slides and parka rental.' },
      { id: 'moi-bubbletea', name: 'Brown Sugar Boba Milk Tea', category: 'Café & Bakery', price: 195, energyRestore: 26, description: 'Fresh tapioca pearls in chilled Assam milk tea.' },
      { id: 'moi-cap', name: 'Sporty NCR Explorer Cap', category: 'Boutique', price: 260, energyRestore: 12, description: 'Breathable cotton cap from the sports concourse.' },
    ],
  },
  {
    id: 'mall-tgip-noida',
    name: 'The Great India Place (TGIP)',
    tagline: 'Noida Classic Retail & Entertainment Zone',
    x: 3550,
    y: 2040,
    placeId: 'noida-sector-18',
    vibe: 'Iconic Noida landmark paired with Worlds of Wonder theme park and lively weekend family promenades.',
    anchors: ['Worlds of Wonder', 'Big Cinemas', 'Central Atrium', 'Food Boulevard'],
    items: [
      { id: 'tgip-arcade', name: 'Arcade Token Bundle', category: 'Cinema & Fun', price: 180, energyRestore: 22, description: 'Retro racing & air-hockey game credits.' },
      { id: 'tgip-waffle', name: 'Belgian Dark Chocolate Waffle', category: 'Café & Bakery', price: 170, energyRestore: 28, description: 'Crisp hot waffle drizzled with melted cocoa.' },
      { id: 'tgip-magnet', name: 'Noida Skyline Fridge Magnet', category: 'Books & Crafts', price: 110, energyRestore: 8, description: 'Illustrated souvenir keepsake.' },
    ],
  },
  {
    id: 'mall-pacific-west',
    name: 'Pacific Mall Tagore Garden',
    tagline: 'West Delhi’s Premier Lifestyle Mall',
    x: 960,
    y: 1320,
    placeId: 'rajouri-west',
    vibe: 'Bustling West Delhi hub steps from Blue & Pink lines, packed with rooftop lounges, fashion anchors, and street-food festivals.',
    anchors: ['Salt Food Court', 'PVR Cinemas', 'Crossword Bookstore', 'Flea Bazaar'],
    items: [
      { id: 'pac-novel', name: 'Classic Hindi-English City Anthology', category: 'Books & Crafts', price: 250, energyRestore: 12, description: 'Short stories of Old & New Delhi from Crossword.' },
      { id: 'pac-momos', name: 'Tandoori Paneer Platter', category: 'Café & Bakery', price: 185, energyRestore: 30, description: 'Charred food-court favorite with mint dip.' },
      { id: 'pac-keychain', name: 'Metro Map Brass Keychain', category: 'Books & Crafts', price: 120, energyRestore: 8, description: 'Engraved souvenir of Delhi’s transit lines.' },
    ],
  },
  {
    id: 'mall-vegas-dwarka',
    name: 'Vegas Mall Dwarka',
    tagline: 'Sector 14 Retail & PVR Superplex',
    x: 520,
    y: 1460,
    placeId: 'dwarka-subcity',
    vibe: 'Bright contemporary West NCR flagship featuring a 12-screen PVR Superplex and open courtyard fountains.',
    anchors: ['PVR Luxe Superplex', 'Central Fountain Plaza', 'Shoppers Stop', 'Food Court'],
    items: [
      { id: 'veg-imax', name: 'Superplex Evening Movie Pass', category: 'Cinema & Fun', price: 320, energyRestore: 28, description: 'Dolby Atmos screening with salted popcorn.' },
      { id: 'veg-shake', name: 'Hazelnut Ferrero Milkshake', category: 'Café & Bakery', price: 190, energyRestore: 28, description: 'Thick dessert shake from the courtyard kiosk.' },
      { id: 'veg-notebook', name: 'Embossed Travel Journal', category: 'Books & Crafts', price: 210, energyRestore: 10, description: 'Lined leatherette notebook for NCR sketches.' },
    ],
  },
  {
    id: 'mall-chanakya',
    name: 'The Chanakya',
    tagline: 'Lutyens’ Boutique Galleria & PVR ECX',
    x: 1730,
    y: 1790,
    placeId: 'india-gate',
    vibe: 'Refined sandstone-and-brass architectural mall in Chanakyapuri offering gourmet patisseries and boutique cinema.',
    anchors: ['PVR ECX Boutique Cinema', 'MKT Gourmet Hall', 'L’Opéra Bakery', 'Luxury Galleries'],
    items: [
      { id: 'chn-macaron', name: 'French Macaron Gift Box (4 pcs)', category: 'Café & Bakery', price: 320, energyRestore: 32, description: 'Rose, pistachio, salted caramel & dark chocolate macarons.' },
      { id: 'chn-ramen', name: 'MKT Chef’s Ramen Bowl', category: 'Café & Bakery', price: 420, energyRestore: 48, description: 'Steaming artisanal noodle bowl at MKT dining hall.' },
      { id: 'chn-postcards', name: 'Lutyens’ Architecture Postcard Set', category: 'Books & Crafts', price: 160, energyRestore: 10, description: 'Six archival botanical and sandstone prints.' },
    ],
  },
  {
    id: 'mall-worldmark-aerocity',
    name: 'Worldmark Aerocity',
    tagline: 'Airport Express Courtyard & Food Street',
    x: 1120,
    y: 1870,
    placeId: 'aerocity-igi',
    vibe: 'Modern open-air promenade beside Delhi Aerocity Metro featuring international cafés, art sculptures, and night dining.',
    anchors: ['Central Courtyard', 'Epicuria Food Hall', 'Brewery Terrace', 'Design Studios'],
    items: [
      { id: 'wm-espresso', name: 'Double Espresso & Orange Tart', category: 'Café & Bakery', price: 240, energyRestore: 32, description: 'Jet-lag buster pairing at the sunlit piazza.' },
      { id: 'wm-luggage', name: 'Handcrafted Leather Passport Cover', category: 'Boutique', price: 360, energyRestore: 12, description: 'Tan stitched cover for your Delhi NCR stamps.' },
      { id: 'wm-smoothie', name: 'Mango Passionfruit Cooler', category: 'Café & Bakery', price: 170, energyRestore: 26, description: 'Fresh tropical refresher beside the plaza fountains.' },
    ],
  },
  {
    id: 'mall-dilli-haat',
    name: 'Dilli Haat (INA Craft Bazaar)',
    tagline: 'Open-Air State Handicrafts & Food Plaza',
    x: 1850,
    y: 2010,
    placeId: 'lodhi-district',
    vibe: 'Brick-paved cultural courtyard beside INA Metro showcasing artisans and regional kitchens from every Indian state.',
    anchors: ['State Craft Stalls', 'Regional Food Pavilions', 'Open-Air Amphitheater', 'Handloom Plaza'],
    items: [
      { id: 'dh-madhubani', name: 'Hand-Painted Madhubani Print', category: 'Books & Crafts', price: 280, energyRestore: 10, description: 'Traditional folk artwork on handmade paper.' },
      { id: 'dh-momos', name: 'Sikkim Pavilion Thukpa & Momos', category: 'Café & Bakery', price: 160, energyRestore: 36, description: 'Steaming noodle soup & spiced dumplings at the state stall.' },
      { id: 'dh-pottery', name: 'Khurja Glazed Ceramic Mug', category: 'Books & Crafts', price: 220, energyRestore: 10, description: 'Artisan blue-pottery teacup from UP artisans.' },
    ],
  },
  {
    id: 'mall-khari-baoli',
    name: 'Khari Baoli & Dariba Kalan',
    tagline: 'Asia’s Largest Spice & Silver Bazaar',
    x: 1990,
    y: 890,
    placeId: 'chandni-chowk',
    vibe: '17th-century Old Delhi wholesale lanes overflowing with Kashmiri saffron, dry fruits, attar perfumes, and filigree silver.',
    anchors: ['Khari Baoli Spice Traders', 'Dariba Kalan Silversmiths', 'Kinari Bazaar Trims'],
    items: [
      { id: 'kb-saffron', name: 'Kashmiri Saffron & Almond Tin', category: 'Boutique', price: 320, energyRestore: 22, description: 'Aromatic spice gift box from a 4th-generation trader.' },
      { id: 'kb-kahwa', name: 'Spiced Saffron Kahwa Cup', category: 'Café & Bakery', price: 90, energyRestore: 24, description: 'Warm green tea infused with cinnamon, cardamom & crushed almonds.' },
      { id: 'kb-attar', name: 'Mitti & Jasmine Glass Attar', category: 'Boutique', price: 260, energyRestore: 10, description: 'Traditional steam-distilled Old Delhi botanical perfume.' },
    ],
  },
];

export const QUESTS: QuestDefinition[] = [
  {
    id: 'quest-old-delhi',
    title: 'Old Delhi Spice & Stone',
    description: 'Wander Chandni Chowk, stamp Red Fort, and eat at both Paranthe Wali Gali and Karim’s.',
    rewardRupees: 350,
    requirements: {
      places: ['chandni-chowk'],
      heritages: ['heritage-red-fort'],
      restaurants: ['rest-paranthe-wali', 'rest-karims'],
    },
  },
  {
    id: 'quest-lutyens',
    title: 'Lutyens’ Grand Boulevard',
    description: 'Stamp India Gate & Agrasen ki Baoli, then grab bites at Wenger’s and Andhra Bhavan.',
    rewardRupees: 280,
    requirements: {
      heritages: ['heritage-india-gate', 'heritage-baoli'],
      restaurants: ['rest-wengers', 'rest-andhra-bhavan'],
    },
  },
  {
    id: 'quest-mughal-circuit',
    title: 'Mughal & Medieval Marvels',
    description: 'Collect stamps from Humayun’s Tomb, Lodhi Tombs, Hauz Khas Fort, and Qutub Minar.',
    rewardRupees: 420,
    requirements: {
      heritages: ['heritage-humayun', 'heritage-lodhi', 'heritage-hauz-khas', 'heritage-qutub'],
    },
  },
  {
    id: 'quest-metro-hopper',
    title: 'Delhi Metro Line Hopper',
    description: 'Ride the Delhi Metro 3 times across different stations.',
    rewardRupees: 220,
    requirements: {
      metroRides: 3,
    },
  },
  {
    id: 'quest-ncr-malls',
    title: 'NCR Mega-Mall Circuit',
    description: 'Visit Select CITYWALK, DLF Mall of India (Noida), and Ambience Mall (Gurugram).',
    rewardRupees: 450,
    requirements: {
      malls: ['mall-select-citywalk', 'mall-dlf-mall-of-india', 'mall-ambience-gurugram'],
    },
  },
  {
    id: 'quest-sweet-chai',
    title: 'Chai & Sweet Tooth Tour',
    description: 'Taste Kulhad Kesar Lassi, Saffron Shahi Tukda, Classic Chocolate Eclair, and Irani Chai.',
    rewardRupees: 320,
    requirements: {
      dishIds: ['pwg-lassi', 'niz-tukda', 'wengers-eclair', 'ggn-iranichai'],
    },
  },
];

export const QUICK_EMOTES = [
  { id: 'namaste', label: 'Namaste!' },
  { id: 'chai', label: 'Chai time?' },
  { id: 'metro', label: 'Taking Metro' },
  { id: 'wah', label: 'Wah, tasty!' },
];

export function getTodayDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTimeUntilMidnightLabel(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diffMs = Math.max(0, midnight.getTime() - now.getTime());
  const hours = Math.floor(diffMs / 3600000);
  const mins = Math.floor((diffMs % 3600000) / 60000);
  return `${hours}h ${String(mins).padStart(2, '0')}m`;
}

// Deterministic seeded PRNG from YYYY-MM-DD so all players share fresh daily rotating missions
function hashDateSeed(dateKey: string): number {
  let h = 2166136261;
  for (let i = 0; i < dateKey.length; i++) {
    h ^= dateKey.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function nextRand(state: { seed: number }): number {
  state.seed = (Math.imul(1664525, state.seed) + 1013904223) >>> 0;
  return state.seed / 4294967296;
}

export function generateDailyMissionsForDate(dateKey: string): DailyMission[] {
  const rng = { seed: hashDateSeed(dateKey) };

  const targetPlace = PLACE_ZONES[Math.floor(nextRand(rng) * PLACE_ZONES.length)];
  const targetMall = SHOPPING_MALLS[Math.floor(nextRand(rng) * SHOPPING_MALLS.length)];

  // Slot 1: Transit & Neighborhood Mobility
  const transitPool: DailyMission[] = [
    {
      id: `daily-${dateKey}-metro`,
      title: 'Daily Metro Commuter',
      description: 'Ride the Delhi Metro 2 times today across any stations.',
      kind: 'metro_rides',
      targetCount: 2,
      rewardRupees: 160,
    },
    {
      id: `daily-${dateKey}-place`,
      title: `Explore ${targetPlace.name}`,
      description: `Travel to ${targetPlace.name} on foot or via Metro today.`,
      kind: 'visit_place',
      targetCount: 1,
      targetId: targetPlace.id,
      rewardRupees: 150,
    },
  ];

  // Slot 2: Food & Heritage Culture
  const culturePool: DailyMission[] = [
    {
      id: `daily-${dateKey}-dishes`,
      title: 'Street Foodie Cravings',
      description: 'Order 2 dishes or drinks at any NCR restaurant today.',
      kind: 'taste_dishes',
      targetCount: 2,
      rewardRupees: 180,
    },
    {
      id: `daily-${dateKey}-heritage`,
      title: 'Daily Heritage Keeper',
      description: 'Visit and stamp 1 heritage monument today.',
      kind: 'stamp_heritage',
      targetCount: 1,
      rewardRupees: 170,
    },
  ];

  // Slot 3: Shopping Malls & Treats
  const mallPool: DailyMission[] = [
    {
      id: `daily-${dateKey}-mall-visit`,
      title: `Day Out at ${targetMall.name}`,
      description: `Check into ${targetMall.name} today.`,
      kind: 'visit_mall',
      targetCount: 1,
      targetId: targetMall.id,
      rewardRupees: 190,
    },
    {
      id: `daily-${dateKey}-mall-buy`,
      title: 'NCR Retail Therapy',
      description: 'Pick up 1 cinema pass, book, coffee, or souvenir at any major mall today.',
      kind: 'buy_mall_item',
      targetCount: 1,
      rewardRupees: 200,
    },
  ];

  const m1 = transitPool[Math.floor(nextRand(rng) * transitPool.length)];
  const m2 = culturePool[Math.floor(nextRand(rng) * culturePool.length)];
  const m3 = mallPool[Math.floor(nextRand(rng) * mallPool.length)];

  return [m1, m2, m3];
}

export function getNearestPlace(x: number, y: number): PlaceZone {
  let best = PLACE_ZONES[0];
  let bestDist = Infinity;
  for (const place of PLACE_ZONES) {
    const d = Math.hypot(place.x - x, place.y - y);
    if (d < bestDist) {
      bestDist = d;
      best = place;
    }
  }
  return best;
}

export function getPlaceById(id: string): PlaceZone | undefined {
  return PLACE_ZONES.find((p) => p.id === id);
}

export interface MetroRouteResult {
  fare: number;
  hops: number;
  pathIds: string[];
  pathNames: string[];
  linesUsed: MetroLineId[];
}

export function calculateMetroRoute(fromStationId: string, toStationId: string): MetroRouteResult | null {
  if (fromStationId === toStationId) return null;

  const adj = new Map<string, Array<{ nextId: string; line: MetroLineId }>>();
  for (const st of METRO_STATIONS) {
    adj.set(st.id, []);
  }
  for (const line of METRO_LINES) {
    for (let i = 0; i < line.stationIds.length - 1; i++) {
      const a = line.stationIds[i];
      const b = line.stationIds[i + 1];
      adj.get(a)?.push({ nextId: b, line: line.id });
      adj.get(b)?.push({ nextId: a, line: line.id });
    }
  }
  for (const [a, b, line] of EXTRA_METRO_EDGES) {
    adj.get(a)?.push({ nextId: b, line });
    adj.get(b)?.push({ nextId: a, line });
  }

  const queue: Array<{ id: string; path: string[]; lines: MetroLineId[] }> = [
    { id: fromStationId, path: [fromStationId], lines: [] },
  ];
  const visited = new Set<string>([fromStationId]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.id === toStationId) {
      const hops = current.path.length - 1;
      const fare = Math.min(60, Math.max(10, 10 + Math.floor((hops - 1) / 2) * 10));
      const pathNames = current.path.map(
        (id) => METRO_STATIONS.find((s) => s.id === id)?.name ?? id
      );
      const uniqueLines = Array.from(new Set(current.lines));
      return {
        fare,
        hops,
        pathIds: current.path,
        pathNames,
        linesUsed: uniqueLines,
      };
    }

    for (const edge of adj.get(current.id) ?? []) {
      if (!visited.has(edge.nextId)) {
        visited.add(edge.nextId);
        queue.push({
          id: edge.nextId,
          path: [...current.path, edge.nextId],
          lines: [...current.lines, edge.line],
        });
      }
    }
  }

  return null;
}

export interface TransportOptionMeta {
  id: TransportMode;
  label: string;
  brandTag: string;
  description: string;
  speedPxPerSec: number;
  baseFare: number;
  perKmFare: number;
  maxFare: number;
  freeRoamPassCost: number;
  accentColor: string;
}

export const TRANSPORT_OPTIONS: Record<TransportMode, TransportOptionMeta> = {
  walk: {
    id: 'walk',
    label: 'On Foot',
    brandTag: 'Free',
    description: 'Walk or sprint along Delhi lanes and parks at zero fare.',
    speedPxPerSec: 225,
    baseFare: 0,
    perKmFare: 0,
    maxFare: 0,
    freeRoamPassCost: 0,
    accentColor: '#475569',
  },
  bike: {
    id: 'bike',
    label: 'Rapido Bike',
    brandTag: 'Captain Bike',
    description: 'Nimble yellow-black two-wheeler zipping smoothly through NCR traffic.',
    speedPxPerSec: 430,
    baseFare: 15,
    perKmFare: 5,
    maxFare: 95,
    freeRoamPassCost: 25,
    accentColor: '#CA8A04',
  },
  auto: {
    id: 'auto',
    label: 'CNG Auto',
    brandTag: 'Delhi Auto',
    description: 'Iconic green-and-yellow three-wheeler for lively city hops.',
    speedPxPerSec: 365,
    baseFare: 25,
    perKmFare: 7,
    maxFare: 145,
    freeRoamPassCost: 35,
    accentColor: '#15803D',
  },
  car: {
    id: 'car',
    label: 'Cab / Car',
    brandTag: 'NCR AC Sedan',
    description: 'Fastest point-to-point expressway ride across Delhi, Noida & Gurugram.',
    speedPxPerSec: 520,
    baseFare: 45,
    perKmFare: 10,
    maxFare: 240,
    freeRoamPassCost: 60,
    accentColor: '#2563EB',
  },
};

export const TRANSPORT_ORDER: TransportMode[] = ['walk', 'bike', 'auto', 'car'];

export interface RideEstimate {
  distancePx: number;
  distanceKm: number;
  fare: number;
  etaSeconds: number;
}

export function calculateRideEstimate(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  mode: TransportMode,
  weatherSpeedMultiplier = 1
): RideEstimate {
  const distancePx = Math.hypot(toX - fromX, toY - fromY);
  // 140 world px ≈ 1 NCR km for intuitive fares & distances
  const distanceKm = Math.max(0.2, Math.round((distancePx / 140) * 10) / 10);
  const meta = TRANSPORT_OPTIONS[mode];
  const rawFare = mode === 'walk' ? 0 : Math.round((meta.baseFare + distanceKm * meta.perKmFare) / 5) * 5;
  const fare = mode === 'walk' ? 0 : Math.min(meta.maxFare, Math.max(meta.baseFare, rawFare));
  const effectiveSpeed = Math.max(40, meta.speedPxPerSec * weatherSpeedMultiplier);
  const etaSeconds = Math.max(1, Math.round(distancePx / effectiveSpeed));
  return { distancePx, distanceKm, fare, etaSeconds };
}

export interface NcrDestinationItem {
  id: string;
  name: string;
  subtitle: string;
  kind: PoiKind;
  x: number;
  y: number;
}

export function getAllNcrDestinations(): NcrDestinationItem[] {
  const places: NcrDestinationItem[] = PLACE_ZONES.map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.subtitle,
    kind: 'place',
    x: p.x,
    y: p.y,
  }));
  const metro: NcrDestinationItem[] = METRO_STATIONS.map((m) => ({
    id: m.id,
    name: `${m.name} Metro`,
    subtitle: getPlaceById(m.placeId)?.name ?? 'Delhi Metro',
    kind: 'metro',
    x: m.x,
    y: m.y,
  }));
  const malls: NcrDestinationItem[] = SHOPPING_MALLS.map((m) => ({
    id: m.id,
    name: m.name,
    subtitle: m.tagline,
    kind: 'mall',
    x: m.x,
    y: m.y,
  }));
  const heritages: NcrDestinationItem[] = HERITAGE_SITES.map((h) => ({
    id: h.id,
    name: h.name,
    subtitle: h.era,
    kind: 'heritage',
    x: h.x,
    y: h.y,
  }));
  const restaurants: NcrDestinationItem[] = RESTAURANTS.map((r) => ({
    id: r.id,
    name: r.name,
    subtitle: r.specialty,
    kind: 'restaurant',
    x: r.x,
    y: r.y,
  }));
  return [...places, ...heritages, ...malls, ...restaurants, ...metro];
}

export const CHAI_COUNTER_ITEMS = [
  { id: 'chai', label: 'Kulhad Chai', priceTag: '₹20', accent: '#B45309' },
  { id: 'samosa', label: 'Aloo Samosa', priceTag: '₹20', accent: '#D97706' },
  { id: 'bunmaska', label: 'Bun Maska', priceTag: '₹20', accent: '#C84B31' },
  { id: 'lassi', label: 'Kesar Lassi', priceTag: '₹20', accent: '#CA8A04' },
  { id: 'patty', label: 'Paneer Patty', priceTag: '₹20', accent: '#0369A1' },
  { id: 'shikanji', label: 'Mint Shikanji', priceTag: '₹20', accent: '#15803D' },
] as const;

export const DELHI_TRIVIA_BANK: DelhiTriviaQuestion[] = [
  {
    id: 'trivia-cp-circles',
    topic: 'Lutyens’ Delhi',
    question: 'What distinct architectural shape defines Connaught Place’s inner and outer circles?',
    options: ['Concentric horseshoe rings', 'Hexagonal grid', 'Octagonal star'],
    correctIndex: 0,
    rewardRupees: 50,
    fact: 'Designed by Robert Tor Russell in 1933, Connaught Place is built as two concentric Georgian-inspired circles around Central Park.',
  },
  {
    id: 'trivia-metro-first',
    topic: 'Delhi Metro',
    question: 'Which Delhi Metro corridor opened first in December 2002 between Shahdara and Tis Hazari?',
    options: ['Yellow Line', 'Red Line', 'Blue Line'],
    correctIndex: 1,
    rewardRupees: 50,
    fact: 'The Red Line became Delhi Metro’s inaugural corridor on December 24, 2002.',
  },
  {
    id: 'trivia-hauz-khas',
    topic: 'Medieval Delhi',
    question: 'What was the original 13th-century purpose of the Hauz Khas tank built by Alauddin Khalji?',
    options: ['Supplying water to Siri Fort', 'Royal boat racing', 'Temple bathing ghat'],
    correctIndex: 0,
    rewardRupees: 50,
    fact: 'Alauddin Khalji excavated the massive reservoir around 1296 to supply drinking water to the residents of Siri.',
  },
  {
    id: 'trivia-khari-baoli',
    topic: 'Old Delhi Markets',
    question: 'Khari Baoli near Fatehpuri Masjid is celebrated across Asia as the largest wholesale market for what?',
    options: ['Brassware & textiles', 'Spices, herbs & dry fruits', 'Rare manuscripts'],
    correctIndex: 1,
    rewardRupees: 50,
    fact: 'Operating since the 17th century, Khari Baoli remains Asia’s largest wholesale spice and dry fruit hub.',
  },
  {
    id: 'trivia-qutub-pillar',
    topic: 'Heritage Craft',
    question: 'Why is the 4th-century Iron Pillar inside the Qutub complex famous among metallurgists?',
    options: ['It rings like a bell', 'It resists rust despite centuries outdoors', 'It floats in water'],
    correctIndex: 1,
    rewardRupees: 50,
    fact: 'Its high phosphorus content creates a protective passive film that has kept the Gupta-era pillar nearly rust-free for 1,600 years.',
  },
  {
    id: 'trivia-rajiv-chowk',
    topic: 'Metro Transit',
    question: 'Which two flagship Delhi Metro lines intersect underground at Rajiv Chowk?',
    options: ['Yellow & Blue Lines', 'Pink & Magenta Lines', 'Violet & Green Lines'],
    correctIndex: 0,
    rewardRupees: 50,
    fact: 'Rajiv Chowk connects the North-South Yellow Line and East-West Blue Line beneath Connaught Place.',
  },
  {
    id: 'trivia-dilli-haat',
    topic: 'Crafts & Food',
    question: 'Dilli Haat beside INA Metro showcases handlooms and regional kitchens from which areas?',
    options: ['Only Delhi neighborhoods', 'All Indian states & union territories', 'Only Mughal monuments'],
    correctIndex: 1,
    rewardRupees: 50,
    fact: 'Opened in 1994, Dilli Haat rotates artisans and hosts state food stalls from across India.',
  },
  {
    id: 'trivia-chandni-chowk',
    topic: 'Shahjahanabad',
    question: 'Who planned the original tree-lined boulevard and central water canal of Chandni Chowk in 1650?',
    options: ['Princess Jahanara Begum', 'Emperor Akbar', 'Raja Todar Mal'],
    correctIndex: 0,
    rewardRupees: 50,
    fact: 'Shah Jahan’s daughter Jahanara Begum designed Chandni Chowk with a moonlight-reflecting canal down the center.',
  },
  {
    id: 'trivia-rapid-metro',
    topic: 'NCR Transit',
    question: 'CyberHub, DLF Phase 2, and Sikanderpur in Gurugram are served by which elevated transit loop?',
    options: ['Airport Express', 'Rapid Metro Gurugram', 'Grey Line'],
    correctIndex: 1,
    rewardRupees: 50,
    fact: 'Rapid Metro connects Gurugram’s corporate towers in Cyber City directly to the Yellow Line at Sikanderpur.',
  },
  {
    id: 'trivia-lodhi-art',
    topic: 'Urban Culture',
    question: 'Lodhi Colony near India Habitat Centre is famous across India as the country’s first what?',
    options: ['Public Open-Air Art District', 'Underground Mall', 'Floating Market'],
    correctIndex: 0,
    rewardRupees: 50,
    fact: 'Over 50 large-scale murals painted by Indian and international street artists adorn Lodhi Colony’s colonial blocks.',
  },
  {
    id: 'trivia-humayun',
    topic: 'Architecture',
    question: 'Humayun’s Tomb in Nizamuddin introduced which iconic structural element to Mughal tombs in India?',
    options: ['Persian double-dome & Charbagh garden', 'Gothic flying buttresses', 'Wooden pagoda roof'],
    correctIndex: 0,
    rewardRupees: 50,
    fact: 'Completed in 1570, its red sandstone-and-marble double dome and four-quadrant garden inspired the Taj Mahal.',
  },
  {
    id: 'trivia-majnu-ka-tila',
    topic: 'Neighborhoods',
    question: 'Located along the Yamuna banks near North Campus, Majnu Ka Tila is popularly known as what?',
    options: ['Little Tibet', 'Old French Quarter', 'Pottery Village'],
    correctIndex: 0,
    rewardRupees: 50,
    fact: 'Known locally as Samyeling, Majnu Ka Tila is famed for Tibetan bakeries, momos, and prayer-flag lanes.',
  },
  {
    id: 'trivia-airport-express',
    topic: 'High-Speed Rail',
    question: 'Which Metro line offers high-speed express service between New Delhi Station and IGI Airport Terminal 3?',
    options: ['Orange Line (Airport Express)', 'Green Line', 'Magenta Line'],
    correctIndex: 0,
    rewardRupees: 50,
    fact: 'The Airport Express Orange Line links central New Delhi to Aerocity, IGI T3, and Dwarka Sector 21.',
  },
  {
    id: 'trivia-noida-18',
    topic: 'Noida NCR',
    question: 'Which vibrant street market sits right beside DLF Mall of India in Noida Sector 18?',
    options: ['Atta Market', 'Sarojini Bazaar', 'Dariba Kalan'],
    correctIndex: 0,
    rewardRupees: 50,
    fact: 'Atta Market is Noida’s iconic street-shopping hub right across from Sector 18 Metro.',
  },
];

interface GigTemplate {
  title: string;
  client: string;
  category: GigContract['category'];
  description: string;
  pickupPool: Array<{ id: string; name: string; x: number; y: number }>;
  dropoffPool: Array<{ id: string; name: string; x: number; y: number }>;
}

export function generateDeliveryGigs(playerX: number, playerY: number, count = 4): GigContract[] {
  const restItems = RESTAURANTS.map((r) => ({ id: r.id, name: r.name, x: r.x, y: r.y }));
  const mallItems = SHOPPING_MALLS.map((m) => ({ id: m.id, name: m.name, x: m.x, y: m.y }));
  const heritageItems = HERITAGE_SITES.map((h) => ({ id: h.id, name: h.name, x: h.x, y: h.y }));
  const metroItems = METRO_STATIONS.map((m) => ({ id: m.id, name: `${m.name} Metro`, x: m.x, y: m.y }));

  const templates: GigTemplate[] = [
    {
      title: 'Hot Tiffin Parcel Run',
      client: 'Dilli Dabba Express',
      category: 'Delivery',
      description: 'Collect freshly packed North Indian treats and drop them hot across NCR.',
      pickupPool: restItems,
      dropoffPool: [...mallItems, ...metroItems],
    },
    {
      title: 'Boutique Craft Courier',
      client: 'Dilli Haat Artisans',
      category: 'Courier',
      description: 'Transport hand-wrapped craft goods safely to a high-street buyer.',
      pickupPool: mallItems,
      dropoffPool: [...restItems, ...metroItems],
    },
    {
      title: 'Heritage Postcard Shoot',
      client: 'NCR Travel Gazette',
      category: 'Photography',
      description: 'Capture monument lighting at pickup and deliver film prints to the café desk.',
      pickupPool: heritageItems,
      dropoffPool: [...restItems, ...mallItems],
    },
    {
      title: 'Express Metro Document Drop',
      client: 'Connaught Legal & Design',
      category: 'Errand',
      description: 'Pick up sealed architectural blueprints at the station and deliver to the hub.',
      pickupPool: metroItems,
      dropoffPool: [...mallItems, ...heritageItems],
    },
  ];

  const gigs: GigContract[] = [];
  const usedPairs = new Set<string>();

  for (let i = 0; i < count * 3 && gigs.length < count; i++) {
    const tpl = templates[(i + Math.floor(Math.random() * templates.length)) % templates.length];
    const pickup = tpl.pickupPool[Math.floor(Math.random() * tpl.pickupPool.length)];
    const validDropoffs = tpl.dropoffPool.filter(
      (d) => d.id !== pickup.id && Math.hypot(d.x - pickup.x, d.y - pickup.y) >= 420
    );
    if (validDropoffs.length === 0) continue;
    const dropoff = validDropoffs[Math.floor(Math.random() * validDropoffs.length)];
    const pairKey = `${pickup.id}->${dropoff.id}`;
    if (usedPairs.has(pairKey)) continue;
    usedPairs.add(pairKey);

    const approachDist = Math.hypot(pickup.x - playerX, pickup.y - playerY);
    const legDist = Math.hypot(dropoff.x - pickup.x, dropoff.y - pickup.y);
    const totalKm = Math.round(((approachDist * 0.4 + legDist) / 140) * 10) / 10;
    const rewardRupees = Math.min(340, Math.max(120, Math.round((100 + totalKm * 12) / 10) * 10));

    gigs.push({
      id: `gig-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      title: tpl.title,
      client: tpl.client,
      category: tpl.category,
      description: tpl.description,
      pickupId: pickup.id,
      pickupName: pickup.name,
      pickupX: pickup.x,
      pickupY: pickup.y,
      dropoffId: dropoff.id,
      dropoffName: dropoff.name,
      dropoffX: dropoff.x,
      dropoffY: dropoff.y,
      rewardRupees,
    });
  }

  return gigs;
}

export const WEATHER_SEQUENCE: WeatherType[] = ['sunny', 'smoggy', 'monsoon'];

export const WEATHER_CONFIGS: Record<WeatherType, WeatherConfig> = {
  sunny: {
    id: 'sunny',
    label: 'Clear Sun',
    shortLabel: 'Sunny',
    description: 'Golden sunlight across Kartavya Path & Connaught Place — full travel speed.',
    speedMultiplier: 1.0,
    accentColor: '#D97706',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    durationSec: 45,
  },
  smoggy: {
    id: 'smoggy',
    label: 'NCR Smog',
    shortLabel: 'Smoggy',
    description: 'Thick winter haze lowers visibility across avenues — movement slowed to 85%.',
    speedMultiplier: 0.85,
    accentColor: '#64748B',
    badgeBg: '#E2E8F0',
    badgeText: '#334155',
    durationSec: 40,
  },
  monsoon: {
    id: 'monsoon',
    label: 'Monsoon Rain',
    shortLabel: 'Monsoon',
    description: 'Heavy downpour & slick waterlogged roads slow travel across NCR to 76% speed.',
    speedMultiplier: 0.76,
    accentColor: '#2563EB',
    badgeBg: '#DBEAFE',
    badgeText: '#1E40AF',
    durationSec: 45,
  },
};

export const ROAMING_NPCS: NpcCharacter[] = [
  {
    id: 'npc-chandni-vendor',
    name: 'Chacha Banwari',
    role: 'vendor',
    roleLabel: 'Street Food Vendor',
    placeId: 'chandni-chowk',
    areaLabel: 'Chandni Chowk Bazaar',
    shirtColor: '#D97706',
    accentColor: '#FEF3C7',
    speed: 44,
    waypoints: [
      { x: 1890, y: 920 },
      { x: 1965, y: 880 },
      { x: 2015, y: 935 },
      { x: 1935, y: 970 },
    ],
    greeting: 'Garama-garam jalebi aur bedmi poori! Stopping by Old Delhi?',
    lines: [
      {
        kind: 'fact',
        text: 'Princess Jahanara Begum designed Chandni Chowk in 1650 with a tree-lined canal reflecting the moonlight down its center.',
      },
      {
        kind: 'tip',
        text: 'Low on energy after exploring? Grabbing Dahi Bhalla at Natraj or Kulfi nearby restores energy fast for cheap!',
      },
      {
        kind: 'fact',
        text: 'Just west of Fatehpuri Masjid sits Khari Baoli — Asia’s largest wholesale spice and dry-fruit market since the 17th century.',
      },
      {
        kind: 'tip',
        text: 'Chandni Chowk Yellow Line Metro is right around the corner if you want a quick hop down to Rajiv Chowk or Saket.',
      },
    ],
  },
  {
    id: 'npc-jama-vendor',
    name: 'Rukhsar Begum',
    role: 'vendor',
    roleLabel: 'Kebab & Chai Hawker',
    placeId: 'red-fort-jama',
    areaLabel: 'Jama Masjid Precinct',
    shirtColor: '#991B1B',
    accentColor: '#FDE68A',
    speed: 42,
    waypoints: [
      { x: 2200, y: 1030 },
      { x: 2295, y: 975 },
      { x: 2320, y: 1055 },
      { x: 2235, y: 1075 },
    ],
    greeting: 'Adaab! The aroma from Gali Kababian drifts all the way to Red Fort.',
    lines: [
      {
        kind: 'fact',
        text: 'Karim’s near Jama Masjid was founded in 1913 by Haji Karimuddin, whose ancestors cooked in the Mughal royal kitchens.',
      },
      {
        kind: 'tip',
        text: 'Stamp both Red Fort and Jama Masjid in your Heritage Passport while you’re in this precinct for easy explorer grants.',
      },
      {
        kind: 'fact',
        text: 'Jama Masjid’s red sandstone courtyard can hold up to 25,000 worshippers and overlooks the ramparts of Lal Qila.',
      },
      {
        kind: 'tip',
        text: 'Need extra Rupees for shopping? Open Earn ₹ (press M) and run a Hot Tiffin Parcel gig from Old Delhi to Central Delhi!',
      },
    ],
  },
  {
    id: 'npc-cp-commuter',
    name: 'Ananya Verma',
    role: 'commuter',
    roleLabel: 'Metro Commuter',
    placeId: 'connaught-place',
    areaLabel: 'Rajiv Chowk · CP',
    shirtColor: '#2563EB',
    accentColor: '#DBEAFE',
    speed: 64,
    waypoints: [
      { x: 1845, y: 1410 },
      { x: 1965, y: 1415 },
      { x: 1960, y: 1505 },
      { x: 1840, y: 1495 },
    ],
    greeting: 'Catching the Yellow-Blue transfer at Rajiv Chowk? Always bustling here!',
    lines: [
      {
        kind: 'fact',
        text: 'Rajiv Chowk sits directly beneath Connaught Place’s Central Park and handles over half a million Metro passenger transfers daily.',
      },
      {
        kind: 'tip',
        text: 'Press T anytime to dispatch a Rapido bike, CNG Auto, or AC Cab straight to any monument or café on the map.',
      },
      {
        kind: 'fact',
        text: 'Connaught Place’s white Georgian colonnades were designed by Robert Tor Russell in 1933 as two concentric horseshoe rings.',
      },
      {
        kind: 'tip',
        text: 'Step inside Wenger’s Deli on the outer ring or take a quick Photo Mode postcard with F right by Central Park!',
      },
    ],
  },
  {
    id: 'npc-kashmere-commuter',
    name: 'Vikram Nair',
    role: 'commuter',
    roleLabel: 'Interchange Commuter',
    placeId: 'chandni-chowk',
    areaLabel: 'Kashmere Gate Metro',
    shirtColor: '#7C3AED',
    accentColor: '#EDE9FE',
    speed: 62,
    waypoints: [
      { x: 1915, y: 715 },
      { x: 1995, y: 720 },
      { x: 1990, y: 775 },
      { x: 1915, y: 770 },
    ],
    greeting: 'Three Metro lines meet underground right here — mind the interchange escalators!',
    lines: [
      {
        kind: 'fact',
        text: 'Kashmere Gate is India’s only triple-line Metro interchange, connecting the Red, Yellow, and Violet lines under one roof.',
      },
      {
        kind: 'tip',
        text: 'During NCR Smog or Monsoon rain, street speeds drop — riding the Metro skips weather slowdowns between stations!',
      },
      {
        kind: 'fact',
        text: 'The historic northern city gate built by the Mughals still stands in stone just a short walk east of the station.',
      },
      {
        kind: 'tip',
        text: 'Check the Top Explorers leaderboard in the top-right to see how your Passport stamps and completed gigs stack up.',
      },
    ],
  },
  {
    id: 'npc-cyberhub-commuter',
    name: 'Meera Iyer',
    role: 'commuter',
    roleLabel: 'Rapid Metro Commuter',
    placeId: 'gurugram-cyberhub',
    areaLabel: 'CyberHub · Gurugram',
    shirtColor: '#0EA5E9',
    accentColor: '#E0F2FE',
    speed: 60,
    waypoints: [
      { x: 765, y: 2745 },
      { x: 865, y: 2765 },
      { x: 895, y: 2855 },
      { x: 795, y: 2845 },
    ],
    greeting: 'Just stepped off the elevated Rapid Metro loop — heading for coffee at CyberHub!',
    lines: [
      {
        kind: 'fact',
        text: 'Gurugram’s Rapid Metro was India’s first fully privately financed metro system, looping through DLF Cyber City and Sikanderpur.',
      },
      {
        kind: 'tip',
        text: 'You can inspect 3D architectural views of major landmarks, Metro hubs, and dining spots by pressing V anytime.',
      },
      {
        kind: 'fact',
        text: 'CyberHub’s open-air amphitheater sits beside glass office towers and connects directly onto the Yellow Line at Sikanderpur.',
      },
      {
        kind: 'tip',
        text: 'Pin any distant destination in the NCR Directory (Tab) to get a live directional compass arrow around your avatar.',
      },
    ],
  },
  {
    id: 'npc-noida-commuter',
    name: 'Sandeep Chauhan',
    role: 'commuter',
    roleLabel: 'Blue Line Regular',
    placeId: 'noida-sector-18',
    areaLabel: 'Noida Sector 18',
    shirtColor: '#1D4ED8',
    accentColor: '#DBEAFE',
    speed: 58,
    waypoints: [
      { x: 3440, y: 1920 },
      { x: 3560, y: 1935 },
      { x: 3585, y: 2015 },
      { x: 3475, y: 2005 },
    ],
    greeting: 'Sector 18 never slows down — malls on one side, Atta Market and rolls on the other.',
    lines: [
      {
        kind: 'fact',
        text: 'Across the street from Sector 18 Metro lies Atta Market, famous across UP NCR for street electronics, apparel, and chaat.',
      },
      {
        kind: 'tip',
        text: 'Click directly on the Mini-Map radar in the bottom-right corner to auto-steer your avatar or ride toward that spot.',
      },
      {
        kind: 'fact',
        text: 'Botanical Garden one stop south was Delhi Metro’s first interchange outside Delhi territory, linking Blue and Magenta lines.',
      },
      {
        kind: 'tip',
        text: 'Grab a snack at Brahmaputra Market or DLF Mall of India before taking the Blue Line back across the Yamuna!',
      },
    ],
  },
  {
    id: 'npc-nizamuddin-guide',
    name: 'Farhan Siddiqui',
    role: 'guide',
    roleLabel: 'Heritage Docent',
    placeId: 'nizamuddin',
    areaLabel: 'Humayun’s Tomb & Nizamuddin',
    shirtColor: '#9A3412',
    accentColor: '#FFEDD5',
    speed: 45,
    waypoints: [
      { x: 2380, y: 1930 },
      { x: 2475, y: 1945 },
      { x: 2465, y: 2020 },
      { x: 2370, y: 2005 },
    ],
    greeting: 'Welcome to Nizamuddin! Notice the symmetry of the Persian Charbagh walkways.',
    lines: [
      {
        kind: 'fact',
        text: 'Completed in 1570, Humayun’s Tomb was the Indian subcontinent’s first garden-tomb and directly inspired the Taj Mahal.',
      },
      {
        kind: 'tip',
        text: 'Every Heritage Site has a quick trivia bonus inside its modal — answer correctly for an instant +₹75 reward!',
      },
      {
        kind: 'fact',
        text: 'Every Thursday evening, the nearby Nizamuddin Dargah courtyard comes alive with centuries-old Sufi qawwali music.',
      },
      {
        kind: 'tip',
        text: 'You can press C anytime to preview Clear Sun, NCR Smog, or Monsoon Rain across the city.',
      },
    ],
  },
  {
    id: 'npc-lodhi-artisan',
    name: 'Kavya Menon',
    role: 'artisan',
    roleLabel: 'Lodhi Muralist & Weaver',
    placeId: 'lodhi-district',
    areaLabel: 'Lodhi Colony & INA',
    shirtColor: '#15803D',
    accentColor: '#DCFCE7',
    speed: 48,
    waypoints: [
      { x: 1875, y: 2005 },
      { x: 1985, y: 2010 },
      { x: 1990, y: 2085 },
      { x: 1885, y: 2075 },
    ],
    greeting: 'Walking between Lodhi Gardens and the street-art lanes? Fresh paint dries fast in this breeze.',
    lines: [
      {
        kind: 'fact',
        text: 'Lodhi Colony is India’s first open-air public art district, featuring over 50 towering murals across its 1940s quarters.',
      },
      {
        kind: 'tip',
        text: 'Don’t forget to check your Daily & Passport missions (P) — completing daily goals pays out generous bonus Rupees!',
      },
      {
        kind: 'fact',
        text: 'Dilli Haat beside INA Metro rotates artisans from every Indian state so travelers can sample regional crafts in one plaza.',
      },
      {
        kind: 'tip',
        text: 'Khan Market’s Khan Chacha is right nearby when you need delicious rolls to refill your explorer energy.',
      },
    ],
  },
  {
    id: 'npc-mkt-vendor',
    name: 'Tenzin Dorjee',
    role: 'vendor',
    roleLabel: 'Momo & Butter-Tea Vendor',
    placeId: 'majnu-ka-tila',
    areaLabel: 'Majnu Ka Tila',
    shirtColor: '#B45309',
    accentColor: '#FEF3C7',
    speed: 43,
    waypoints: [
      { x: 1910, y: 455 },
      { x: 2005, y: 465 },
      { x: 1995, y: 525 },
      { x: 1910, y: 515 },
    ],
    greeting: 'Tashi Delek! Steaming plates of tingmo and laphing just came off the stove.',
    lines: [
      {
        kind: 'fact',
        text: 'Known officially as New Aruna Nagar or Samyeling, Majnu Ka Tila sits beside the Yamuna and is fondly called Delhi’s Little Tibet.',
      },
      {
        kind: 'tip',
        text: 'Visiting AMA Café here unlocks dishes toward your Gourmet Taster quest — check your Passport to track remaining tastes!',
      },
      {
        kind: 'fact',
        text: 'Vishwavidyalaya Metro just south serves Delhi University’s North Campus, framed by the forested Northern Ridge.',
      },
      {
        kind: 'tip',
        text: 'Trying out the Chai Counter mini-game in Earn ₹ (press M) is a fun way to earn extra pocket money in 25 seconds.',
      },
    ],
  },
  {
    id: 'npc-hkv-student',
    name: 'Rohan Sharma',
    role: 'student',
    roleLabel: 'Architecture Student',
    placeId: 'hauz-khas',
    areaLabel: 'Hauz Khas Village',
    shirtColor: '#BE185D',
    accentColor: '#FCE7F3',
    speed: 52,
    waypoints: [
      { x: 1650, y: 2345 },
      { x: 1745, y: 2350 },
      { x: 1755, y: 2425 },
      { x: 1660, y: 2420 },
    ],
    greeting: 'Sketching the lakeside madrasa arches before sunset — have you walked up to the fort?',
    lines: [
      {
        kind: 'fact',
        text: 'Hauz Khas literally means “Royal Tank” — excavated by Alauddin Khalji in 1296 to supply water to the fortified city of Siri.',
      },
      {
        kind: 'tip',
        text: 'Press F anytime to enter Photo Mode and save a watermarked Dilli Darshan postcard of your current spot!',
      },
      {
        kind: 'fact',
        text: 'Firoz Shah Tughlaq added the L-shaped madrasa overlooking the water in 1354, making it a top South Delhi heritage walk.',
      },
      {
        kind: 'tip',
        text: 'Qutub Minar and Select CITYWALK Saket are just a short auto or Yellow Line hop directly south of here.',
      },
    ],
  },
  {
    id: 'npc-indiagate-vendor',
    name: 'Harpreet Kaur',
    role: 'vendor',
    roleLabel: 'Kartavya Path Kulfi Cart',
    placeId: 'india-gate',
    areaLabel: 'India Gate · Kartavya Path',
    shirtColor: '#0F766E',
    accentColor: '#CCFBF1',
    speed: 44,
    waypoints: [
      { x: 2020, y: 1710 },
      { x: 2150, y: 1720 },
      { x: 2145, y: 1775 },
      { x: 2025, y: 1770 },
    ],
    greeting: 'Pista kulfi and chilled nimbu pani! Nothing beats an evening stroll down Kartavya Path.',
    lines: [
      {
        kind: 'fact',
        text: 'Standing 42 meters tall, India Gate was designed by Edwin Lutyens in 1921 and bears the names of over 13,000 soldiers.',
      },
      {
        kind: 'tip',
        text: 'Holding Shift while walking lets you sprint faster across wide boulevards like Kartavya Path.',
      },
      {
        kind: 'fact',
        text: 'Andhra Bhavan’s iconic canteen just north of India Gate is famed citywide for its unlimited traditional South Indian thali.',
      },
      {
        kind: 'tip',
        text: 'Need to meet friends in the same live room? Check the room code in the top-right roster or switch rooms in the Pause menu.',
      },
    ],
  },
  {
    id: 'npc-aerocity-commuter',
    name: 'Devika Joshi',
    role: 'commuter',
    roleLabel: 'Airport Express Flyer',
    placeId: 'aerocity-igi',
    areaLabel: 'Aerocity & IGI Corridor',
    shirtColor: '#EA580C',
    accentColor: '#FFEDD5',
    speed: 62,
    waypoints: [
      { x: 1090, y: 1925 },
      { x: 1170, y: 1925 },
      { x: 1165, y: 2010 },
      { x: 1075, y: 2005 },
    ],
    greeting: 'Just zipped in from New Delhi Station on the Orange Line in under 18 minutes!',
    lines: [
      {
        kind: 'fact',
        text: 'Delhi’s Airport Express (Orange Line) is India’s fastest Metro corridor, reaching speeds up to 120 km/h between T3 and New Delhi.',
      },
      {
        kind: 'tip',
        text: 'Claim your free ₹150 Daily Explorer Stipend inside Earn ₹ (M) once per day whenever your wallet runs low.',
      },
      {
        kind: 'fact',
        text: 'Worldmark Aerocity blends open-air European-style courtyards right next to one of Asia’s busiest international aviation hubs.',
      },
      {
        kind: 'tip',
        text: 'Try booking a Rapido Bike or Auto via Book Ride (T) if you want an AI-driven ride directly to Dhaula Kuan or Dwarka!',
      },
    ],
  },
];

export function getNpcById(id: string): NpcCharacter | undefined {
  return ROAMING_NPCS.find((n) => n.id === id);
}
