export type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED';

export type MetroLineId =
  | 'yellow'
  | 'blue'
  | 'violet'
  | 'magenta'
  | 'red'
  | 'pink'
  | 'green'
  | 'grey'
  | 'orange'
  | 'rapid';

export type PoiKind = 'metro' | 'heritage' | 'restaurant' | 'mall' | 'place';

export interface PlaceZone {
  id: string;
  name: string;
  subtitle: string;
  x: number;
  y: number;
  radius: number;
  description: string;
  highlights: string[];
  accentColor: string;
}

export interface MetroStation {
  id: string;
  name: string;
  x: number;
  y: number;
  lines: MetroLineId[];
  placeId: string;
  interchange: boolean;
  major?: boolean;
  fact: string;
}

export interface MetroLine {
  id: MetroLineId;
  name: string;
  color: string;
  stationIds: string[];
}

export interface HeritageSite {
  id: string;
  name: string;
  era: string;
  x: number;
  y: number;
  placeId: string;
  ticketPrice: number;
  rewardRupees: number;
  description: string;
  stampTitle: string;
  silhouette:
    | 'redfort'
    | 'jamamasjid'
    | 'indiagate'
    | 'baoli'
    | 'humayun'
    | 'lodhi'
    | 'hauzkhas'
    | 'qutub'
    | 'lotus'
    | 'akshardham';
  trivia: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  energyRestore: number;
  isVeg: boolean;
  description: string;
}

export interface RestaurantSpot {
  id: string;
  name: string;
  specialty: string;
  x: number;
  y: number;
  placeId: string;
  vibe: string;
  menu: MenuItem[];
}

export interface MallItem {
  id: string;
  name: string;
  category: 'Boutique' | 'Cinema & Fun' | 'Café & Bakery' | 'Books & Crafts';
  price: number;
  energyRestore: number;
  description: string;
}

export interface ShoppingMallSpot {
  id: string;
  name: string;
  tagline: string;
  x: number;
  y: number;
  placeId: string;
  vibe: string;
  anchors: string[];
  items: MallItem[];
}

export interface QuestDefinition {
  id: string;
  title: string;
  description: string;
  rewardRupees: number;
  requirements: {
    places?: string[];
    heritages?: string[];
    restaurants?: string[];
    malls?: string[];
    dishIds?: string[];
    metroRides?: number;
  };
}

export type DailyMissionKind =
  | 'metro_rides'
  | 'stamp_heritage'
  | 'taste_dishes'
  | 'visit_mall'
  | 'visit_place'
  | 'buy_mall_item';

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  kind: DailyMissionKind;
  targetCount: number;
  targetId?: string;
  rewardRupees: number;
}

export interface DailyMissionState {
  dateKey: string;
  missions: DailyMission[];
  progressById: Record<string, number>;
  completedIds: string[];
}

export interface GigContract {
  id: string;
  title: string;
  client: string;
  category: 'Delivery' | 'Courier' | 'Photography' | 'Errand';
  description: string;
  pickupId: string;
  pickupName: string;
  pickupX: number;
  pickupY: number;
  dropoffId: string;
  dropoffName: string;
  dropoffX: number;
  dropoffY: number;
  rewardRupees: number;
}

export interface ActiveGigState {
  contract: GigContract;
  stage: 'pickup' | 'dropoff';
}

export interface DelhiTriviaQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  rewardRupees: number;
  fact: string;
}

export interface ExplorerMilestone {
  level: number;
  xpRequired: number;
  title: string;
  perkId: string;
  perkName: string;
  perkDescription: string;
  badgeColor: string;
}

export interface PlayerProgress {
  xp: number;
  equippedTitle?: string;
  rupees: number;
  energy: number;
  maxEnergy: number;
  visitedPlaces: string[];
  stampedHeritages: string[];
  triviaSolvedHeritages: string[];
  tastedDishes: string[];
  tastedRestaurants: string[];
  visitedMalls: string[];
  boughtMallItems: string[];
  completedQuests: string[];
  metroRides: number;
  gigsCompleted: number;
  solvedTriviaIds: string[];
  talkedNpcIds?: string[];
  lastStipendDateKey?: string;
  dailyMissions: DailyMissionState;
}

export type TransportMode = 'walk' | 'bike' | 'auto' | 'car';

export type WeatherType = 'sunny' | 'smoggy' | 'monsoon';

export interface WeatherConfig {
  id: WeatherType;
  label: string;
  shortLabel: string;
  description: string;
  speedMultiplier: number;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  durationSec: number;
}

export interface RideDispatchTarget {
  id: string;
  name: string;
  kind: PoiKind;
  x: number;
  y: number;
  mode: TransportMode;
  fare: number;
}

export interface RemotePlayer {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  facing: number;
  zoneName: string;
  vehicle?: TransportMode;
  stampsCount: number;
  dishesCount: number;
  gigsCompleted: number;
  speechText?: string;
  speechExpiresAt?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderColor: string;
  text: string;
  timestamp: number;
  kind: 'chat' | 'activity' | 'system';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface ActivePoiTarget {
  kind: 'metro' | 'heritage' | 'restaurant' | 'mall' | 'npc';
  id: string;
  name: string;
  x: number;
  y: number;
  distance: number;
}

export type NpcRole = 'vendor' | 'commuter' | 'artisan' | 'guide' | 'student';

export interface NpcLine {
  kind: 'tip' | 'fact';
  text: string;
}

export interface NpcCharacter {
  id: string;
  name: string;
  role: NpcRole;
  roleLabel: string;
  placeId: string;
  areaLabel: string;
  shirtColor: string;
  accentColor: string;
  speed: number;
  waypoints: Array<{ x: number; y: number }>;
  greeting: string;
  lines: NpcLine[];
}

export interface WaypointPin {
  kind: PoiKind;
  id: string;
  name: string;
  x: number;
  y: number;
}

export type ClientToServerMessage =
  | {
      type: 'player:join';
      payload: {
        name: string;
        color: string;
        roomCode: string;
        x: number;
        y: number;
        zoneName: string;
        vehicle?: TransportMode;
        stampsCount: number;
        dishesCount: number;
        gigsCompleted: number;
      };
    }
  | {
      type: 'player:move';
      payload: {
        x: number;
        y: number;
        facing: number;
        zoneName: string;
        vehicle?: TransportMode;
      };
    }
  | {
      type: 'player:stats';
      payload: {
        stampsCount: number;
        dishesCount: number;
        gigsCompleted: number;
      };
    }
  | {
      type: 'player:chat';
      payload: {
        id: string;
        text: string;
      };
    }
  | {
      type: 'player:emote';
      payload: {
        id: string;
        label: string;
      };
    }
  | {
      type: 'player:activity';
      payload: {
        id: string;
        text: string;
      };
    };

export type ServerToClientMessage =
  | {
      type: 'world:init';
      payload: {
        selfId: string;
        roomCode: string;
        players: Array<{
          id: string;
          name: string;
          color: string;
          x: number;
          y: number;
          facing: number;
          zoneName: string;
          vehicle?: TransportMode;
          stampsCount: number;
          dishesCount: number;
          gigsCompleted: number;
        }>;
        chatHistory: ChatMessage[];
      };
    }
  | {
      type: 'player:joined';
      payload: {
        id: string;
        name: string;
        color: string;
        x: number;
        y: number;
        facing: number;
        zoneName: string;
        vehicle?: TransportMode;
        stampsCount: number;
        dishesCount: number;
        gigsCompleted: number;
      };
    }
  | {
      type: 'player:left';
      payload: {
        id: string;
        name: string;
      };
    }
  | {
      type: 'player:moved';
      payload: {
        id: string;
        x: number;
        y: number;
        facing: number;
        zoneName: string;
        vehicle?: TransportMode;
      };
    }
  | {
      type: 'player:statsUpdated';
      payload: {
        id: string;
        stampsCount: number;
        dishesCount: number;
        gigsCompleted: number;
      };
    }
  | {
      type: 'chat:message';
      payload: ChatMessage;
    }
  | {
      type: 'player:emoted';
      payload: {
        id: string;
        senderName: string;
        label: string;
      };
    };
