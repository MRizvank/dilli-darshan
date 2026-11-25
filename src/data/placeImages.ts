import { METRO_LINE_META } from './delhiWorld';
import type { MetroStation, RestaurantSpot } from '../types/game';

export type ShowcaseCategory = 'place' | 'restaurant' | 'metro';

export interface Place3DShowcaseItem {
  id: string;
  category: ShowcaseCategory;
  title: string;
  subtitle: string;
  placeId: string;
  heritageId?: string;
  mallId?: string;
  restaurantId?: string;
  metroId?: string;
  x: number;
  y: number;
  imageUrl: string;
  architectureNote: string;
}

const RESTAURANT_3D_IMAGES = {
  oldDelhiStreet: '/src/assets/images/rest_old_delhi_street_1795607750116.jpg',
  mughlaiCourtyard: '/src/assets/images/rest_karims_mughlai_1795607749328.jpg',
  cpArtDeco: '/src/assets/images/rest_cp_art_deco_1795607750883.jpg',
  khanRooftopBistro: '/src/assets/images/rest_khan_market_bistro_1795607750759.jpg',
  noidaFoodPlaza: '/src/assets/images/rest_noida_street_food_1795607752828.jpg',
  cyberhubGastro: '/src/assets/images/rest_cyberhub_gastro_1795607751686.jpg',
} as const;

const METRO_3D_IMAGES = {
  undergroundInterchange: '/src/assets/images/metro_rajiv_chowk_1795607752527.jpg',
  oldDelhiHeritage: '/src/assets/images/metro_old_delhi_heritage_1795607753750.jpg',
  elevatedViaduct: '/src/assets/images/metro_elevated_viaduct_1795607753942.jpg',
  airportExpress: '/src/assets/images/metro_airport_express_1795607758187.jpg',
  rapidGurugram: '/src/assets/images/metro_rapid_gurugram_1795607758767.jpg',
  centralPlaza: '/src/assets/images/metro_patel_chowk_plaza_1795607759459.jpg',
} as const;

export const PLACE_3D_SHOWCASE: Place3DShowcaseItem[] = [
  // ---------- PLACES, MONUMENTS & MALLS (12) ----------
  {
    id: '3d-india-gate',
    category: 'place',
    title: 'India Gate & Kartavya Path',
    subtitle: '1931 · Lutyens’ Sandstone Arch',
    placeId: 'india-gate',
    heritageId: 'heritage-india-gate',
    x: 2150,
    y: 1730,
    imageUrl: '/src/assets/images/place_india_gate_1795607410613.jpg',
    architectureNote:
      '42-metre Bharatpur sandstone triumphal arch anchoring the ceremonial Kartavya Path lawns and reflecting pools.',
  },
  {
    id: '3d-red-fort',
    category: 'place',
    title: 'Red Fort (Lal Qila)',
    subtitle: '1648 · UNESCO Mughal Fortress',
    placeId: 'red-fort-jama',
    heritageId: 'heritage-red-fort',
    x: 2340,
    y: 960,
    imageUrl: '/src/assets/images/place_red_fort_1795607410656.jpg',
    architectureNote:
      'Monumental red sandstone octagonal walls and Lahore Gate chhatri pavilions overlooking Old Delhi.',
  },
  {
    id: '3d-connaught-place',
    category: 'place',
    title: 'Connaught Place (Rajiv Chowk)',
    subtitle: '1933 · Georgian Colonnade & Central Park',
    placeId: 'connaught-place',
    x: 1900,
    y: 1450,
    imageUrl: '/src/assets/images/place_connaught_place_1795607415944.jpg',
    architectureNote:
      'Concentric white porticoed rings encircling Central Park, Janpath markets, and Delhi’s busiest Metro hub.',
  },
  {
    id: '3d-qutub-minar',
    category: 'place',
    title: 'Qutub Minar & Iron Pillar',
    subtitle: '1199 · UNESCO Victory Tower',
    placeId: 'qutub-mehrauli',
    heritageId: 'heritage-qutub',
    x: 1580,
    y: 2630,
    imageUrl: '/src/assets/images/place_qutub_minar_1795607410464.jpg',
    architectureNote:
      '72.5-metre fluted red sandstone and marble minaret towering beside carved courtyard arches and the Gupta Iron Pillar.',
  },
  {
    id: '3d-lotus-temple',
    category: 'place',
    title: 'Lotus Temple',
    subtitle: '1986 · 27 Marble Petals',
    placeId: 'kalkaji-nehru',
    heritageId: 'heritage-lotus',
    x: 2560,
    y: 2340,
    imageUrl: '/src/assets/images/place_lotus_temple_1795607412437.jpg',
    architectureNote:
      '27 free-standing white marble-clad petals arranged in clusters of three, surrounded by nine serene reflecting pools.',
  },
  {
    id: '3d-humayun-tomb',
    category: 'place',
    title: "Humayun's Tomb",
    subtitle: '1570 · UNESCO Charbagh Tomb',
    placeId: 'nizamuddin',
    heritageId: 'heritage-humayun',
    x: 2490,
    y: 2020,
    imageUrl: '/src/assets/images/place_humayun_tomb_1795607412505.jpg',
    architectureNote:
      'Pioneering Mughal garden-tomb with a white marble Persian double dome framed by four-quadrant water channels.',
  },
  {
    id: '3d-akshardham',
    category: 'place',
    title: 'Swaminarayan Akshardham',
    subtitle: '2005 · Yamuna Pink Sandstone',
    placeId: 'akshardham-yamuna',
    heritageId: 'heritage-akshardham',
    x: 2980,
    y: 1410,
    imageUrl: '/src/assets/images/place_akshardham_1795607412979.jpg',
    architectureNote:
      'Hand-carved Rajasthani pink sandstone spires and lotus water colonnades rising beside the Yamuna riverfront.',
  },
  {
    id: '3d-jama-masjid',
    category: 'place',
    title: 'Jama Masjid & Old Delhi',
    subtitle: '1656 · Grand Courtyard Mosque',
    placeId: 'chandni-chowk',
    heritageId: 'heritage-jama-masjid',
    x: 2140,
    y: 1010,
    imageUrl: '/src/assets/images/place_jama_masjid_1795607412589.jpg',
    architectureNote:
      'Striped red sandstone and white marble minarets crowned by three domes above the bustling lanes of Shahjahanabad.',
  },
  {
    id: '3d-hauz-khas',
    category: 'place',
    title: 'Hauz Khas Fort & Royal Tank',
    subtitle: '1296 · Khalji & Tughlaq Ruins',
    placeId: 'hauz-khas',
    heritageId: 'heritage-hauz-khas',
    x: 1700,
    y: 2330,
    imageUrl: '/src/assets/images/place_hauz_khas_1795607414633.jpg',
    architectureNote:
      'Stone madrasa colonnades and domed pavilions overlooking the emerald reservoir and Deer Park canopy.',
  },
  {
    id: '3d-agrasen-baoli',
    category: 'place',
    title: 'Agrasen ki Baoli',
    subtitle: '14th Century · 108-Step Stepwell',
    placeId: 'connaught-place',
    heritageId: 'heritage-baoli',
    x: 2020,
    y: 1540,
    imageUrl: '/src/assets/images/place_agrasen_baoli_1795607414858.jpg',
    architectureNote:
      'Dramatic 60-metre stone stepwell tucked off Hailey Road with three tiers of symmetrical arched niches.',
  },
  {
    id: '3d-lodhi-gardens',
    category: 'place',
    title: 'Bara Gumbad & Lodhi Gardens',
    subtitle: '1494 · Lodhi Dynasty Parkland',
    placeId: 'lodhi-district',
    heritageId: 'heritage-lodhi',
    x: 1960,
    y: 2040,
    imageUrl: '/src/assets/images/place_lodhi_gardens_1795607416186.jpg',
    architectureNote:
      '15th-century octagonal stone tombs and blue-glazed tile domes nestled across manicured botanical lawns.',
  },
  {
    id: '3d-cyberhub',
    category: 'place',
    title: 'DLF CyberHub Gurugram',
    subtitle: 'NCR Corporate & Dining Promenade',
    placeId: 'gurugram-cyberhub',
    mallId: 'mall-cyberhub',
    x: 780,
    y: 2860,
    imageUrl: '/src/assets/images/place_cyberhub_gurugram_1795607466905.jpg',
    architectureNote:
      'Glass corporate skyline framing an open-air brick and steel dining piazza linked to Rapid Metro.',
  },

  // ---------- RESTAURANTS & CULINARY LANDMARKS (6) ----------
  {
    id: '3d-rest-paranthe',
    category: 'restaurant',
    title: 'Paranthe Wali Gali & Chaat',
    subtitle: '1870s Old Delhi Culinary Lane',
    placeId: 'chandni-chowk',
    restaurantId: 'rest-paranthe-wali',
    x: 1860,
    y: 960,
    imageUrl: RESTAURANT_3D_IMAGES.oldDelhiStreet,
    architectureNote:
      'Carved wooden haveli balconies and sizzling brass tawa counters lining Chandni Chowk’s iconic heritage food lane.',
  },
  {
    id: '3d-rest-karims',
    category: 'restaurant',
    title: "Karim's (Gali Kababian)",
    subtitle: '1913 · Mughlai Courtyard Kitchen',
    placeId: 'red-fort-jama',
    restaurantId: 'rest-karims',
    x: 2220,
    y: 1080,
    imageUrl: RESTAURANT_3D_IMAGES.mughlaiCourtyard,
    architectureNote:
      'Glowing charcoal tandoor pits, Mughlai sandstone arches, and brass copper degs beside Jama Masjid.',
  },
  {
    id: '3d-rest-cp-deco',
    category: 'restaurant',
    title: "Wenger's & Kwality CP Heritage",
    subtitle: '1926–1940s · Art Deco Dining',
    placeId: 'connaught-place',
    restaurantId: 'rest-wengers',
    x: 1800,
    y: 1380,
    imageUrl: RESTAURANT_3D_IMAGES.cpArtDeco,
    architectureNote:
      'White Georgian colonnade verandas, teakwood Art Deco booths, and warm brass pendant lamps in A-Block Connaught Place.',
  },
  {
    id: '3d-rest-khan-bistro',
    category: 'restaurant',
    title: 'Hauz Khas & Khan Market Bistro',
    subtitle: 'Rooftop Terrace & Boutique Dining',
    placeId: 'hauz-khas',
    restaurantId: 'rest-hauz-khas',
    x: 1790,
    y: 2320,
    imageUrl: RESTAURANT_3D_IMAGES.khanRooftopBistro,
    architectureNote:
      'Sun-dappled brick terraces, fairy-lit pergolas, and rooftop café decks overlooking Delhi’s green canopy.',
  },
  {
    id: '3d-rest-noida-plaza',
    category: 'restaurant',
    title: 'Brahmaputra Market Evening Plaza',
    subtitle: 'Noida Street Food & Momo Promenade',
    placeId: 'noida-sector-18',
    restaurantId: 'rest-brahmaputra',
    x: 3620,
    y: 1910,
    imageUrl: RESTAURANT_3D_IMAGES.noidaFoodPlaza,
    architectureNote:
      'Open-air evening dining plaza buzzing with steaming bamboo momo kiosks, tawa rolls, and neon signboards.',
  },
  {
    id: '3d-rest-cyberhub-gastro',
    category: 'restaurant',
    title: 'Farzi Café & CyberHub Gastro-Bar',
    subtitle: 'Modern Indian & Parsi Flagship',
    placeId: 'gurugram-cyberhub',
    restaurantId: 'rest-farzi-cafe',
    x: 840,
    y: 2810,
    imageUrl: RESTAURANT_3D_IMAGES.cyberhubGastro,
    architectureNote:
      'Double-height glass and brass industrial-chic dining hall opening onto CyberHub’s lit amphitheater promenade.',
  },

  // ---------- DELHI METRO STATIONS (6) ----------
  {
    id: '3d-metro-rajiv-chowk',
    category: 'metro',
    title: 'Rajiv Chowk Underground Interchange',
    subtitle: 'Yellow & Blue Line Hub · Connaught Place',
    placeId: 'connaught-place',
    metroId: 'metro-rajiv-chowk',
    x: 1900,
    y: 1450,
    imageUrl: METRO_3D_IMAGES.undergroundInterchange,
    architectureNote:
      'Multi-level architectural cutaway revealing the Yellow and Blue line cross-platforms, escalators, and sleek silver Metro trains.',
  },
  {
    id: '3d-metro-chandni-chowk',
    category: 'metro',
    title: 'Chandni Chowk Heritage Station',
    subtitle: 'Old Delhi Sandstone Gateway',
    placeId: 'chandni-chowk',
    metroId: 'metro-chandni-chowk',
    x: 1910,
    y: 880,
    imageUrl: METRO_3D_IMAGES.oldDelhiHeritage,
    architectureNote:
      'Mughal-inspired red sandstone arches and lattice jali entrance pavilion welcoming riders into Shahjahanabad.',
  },
  {
    id: '3d-metro-elevated',
    category: 'metro',
    title: 'Akshardham Elevated Metro Viaduct',
    subtitle: 'Blue Line Skyway Corridor',
    placeId: 'akshardham-yamuna',
    metroId: 'metro-akshardham',
    x: 2920,
    y: 1520,
    imageUrl: METRO_3D_IMAGES.elevatedViaduct,
    architectureNote:
      'Cantilevered concrete skybridge and curved steel canopy roof carrying Metro trains above Delhi NCR avenues.',
  },
  {
    id: '3d-metro-aerocity',
    category: 'metro',
    title: 'Delhi Aerocity Express Atrium',
    subtitle: 'Orange Line High-Speed Airport Link',
    placeId: 'aerocity-igi',
    metroId: 'metro-aerocity',
    x: 1140,
    y: 1920,
    imageUrl: METRO_3D_IMAGES.airportExpress,
    architectureNote:
      'Sunlit glass-and-steel express concourse with platform screen doors linking New Delhi to IGI Terminal 3.',
  },
  {
    id: '3d-metro-rapid',
    category: 'metro',
    title: 'CyberHub Rapid Metro Skyway',
    subtitle: 'Gurugram Rapid Loop Elevated Station',
    placeId: 'gurugram-cyberhub',
    metroId: 'metro-cyberhub',
    x: 780,
    y: 2760,
    imageUrl: METRO_3D_IMAGES.rapidGurugram,
    architectureNote:
      'Sleek skybridge station weaving past Cyber City glass towers directly into the DLF CyberHub plaza.',
  },
  {
    id: '3d-metro-patel-chowk',
    category: 'metro',
    title: 'Patel Chowk & Central Delhi Plaza',
    subtitle: 'Yellow Line Museum & Street Forecourt',
    placeId: 'india-gate',
    metroId: 'metro-patel-chowk',
    x: 1920,
    y: 1590,
    imageUrl: METRO_3D_IMAGES.centralPlaza,
    architectureNote:
      'Glass escalator entrance pavilion framed by tree-lined Lutyens avenues, green-yellow auto-rickshaws, and Metro roundels.',
  },
];

export function get3DItemForHeritage(heritageId: string): Place3DShowcaseItem | undefined {
  return PLACE_3D_SHOWCASE.find((item) => item.heritageId === heritageId);
}

export function get3DItemForPlace(placeId: string): Place3DShowcaseItem | undefined {
  if (placeId === 'red-fort-jama') {
    return PLACE_3D_SHOWCASE.find((item) => item.id === '3d-red-fort');
  }
  if (placeId === 'connaught-place') {
    return PLACE_3D_SHOWCASE.find((item) => item.id === '3d-connaught-place');
  }
  return PLACE_3D_SHOWCASE.find((item) => item.category === 'place' && item.placeId === placeId);
}

export function get3DItemForMall(mallId: string): Place3DShowcaseItem | undefined {
  return PLACE_3D_SHOWCASE.find((item) => item.mallId === mallId);
}

function getRestaurant3DImageUrl(restaurant: RestaurantSpot): string {
  switch (restaurant.id) {
    case 'rest-paranthe-wali':
    case 'rest-natraj':
    case 'rest-jalebi-wala':
    case 'rest-shiv-misthan':
      return RESTAURANT_3D_IMAGES.oldDelhiStreet;
    case 'rest-karims':
    case 'rest-nizamuddin':
      return RESTAURANT_3D_IMAGES.mughlaiCourtyard;
    case 'rest-wengers':
    case 'rest-kake':
    case 'rest-kwality-cp':
    case 'rest-andhra-bhavan':
      return RESTAURANT_3D_IMAGES.cpArtDeco;
    case 'rest-hauz-khas':
    case 'rest-khan-chacha':
    case 'rest-big-chill':
    case 'rest-ama-cafe':
      return RESTAURANT_3D_IMAGES.khanRooftopBistro;
    case 'rest-brahmaputra':
      return RESTAURANT_3D_IMAGES.noidaFoodPlaza;
    case 'rest-farzi-cafe':
    case 'rest-cyberhub':
      return RESTAURANT_3D_IMAGES.cyberhubGastro;
    default:
      return RESTAURANT_3D_IMAGES.cpArtDeco;
  }
}

export function get3DItemForRestaurant(restaurant: RestaurantSpot): Place3DShowcaseItem {
  return {
    id: `3d-${restaurant.id}`,
    category: 'restaurant',
    title: restaurant.name,
    subtitle: restaurant.specialty,
    placeId: restaurant.placeId,
    restaurantId: restaurant.id,
    x: restaurant.x,
    y: restaurant.y,
    imageUrl: getRestaurant3DImageUrl(restaurant),
    architectureNote: restaurant.vibe,
  };
}

const OLD_DELHI_METRO_IDS = new Set([
  'metro-chandni-chowk',
  'metro-chawri-bazar',
  'metro-lal-qila',
  'metro-jama-masjid',
  'metro-kashmere-gate',
]);

const CENTRAL_PLAZA_METRO_IDS = new Set([
  'metro-patel-chowk',
  'metro-janpath',
  'metro-barakhamba',
  'metro-khan-market',
  'metro-jor-bagh',
  'metro-ito',
  'metro-supreme-court',
]);

function getMetro3DImageUrl(station: MetroStation): string {
  if (station.lines.includes('rapid')) {
    return METRO_3D_IMAGES.rapidGurugram;
  }
  if (station.lines.includes('orange') || station.id === 'metro-igi-t1') {
    return METRO_3D_IMAGES.airportExpress;
  }
  if (OLD_DELHI_METRO_IDS.has(station.id)) {
    return METRO_3D_IMAGES.oldDelhiHeritage;
  }
  if (CENTRAL_PLAZA_METRO_IDS.has(station.id)) {
    return METRO_3D_IMAGES.centralPlaza;
  }
  if (station.interchange) {
    return METRO_3D_IMAGES.undergroundInterchange;
  }
  return METRO_3D_IMAGES.elevatedViaduct;
}

export function get3DItemForMetro(station: MetroStation): Place3DShowcaseItem {
  const lineLabels = station.lines.map((l) => METRO_LINE_META[l].name).join(' & ');
  return {
    id: `3d-${station.id}`,
    category: 'metro',
    title: `${station.name} Metro`,
    subtitle: `${lineLabels}${station.interchange ? ' · Interchange' : ''}`,
    placeId: station.placeId,
    metroId: station.id,
    x: station.x,
    y: station.y,
    imageUrl: getMetro3DImageUrl(station),
    architectureNote: station.fact,
  };
}
