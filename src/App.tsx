import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AVATAR_COLORS,
  HERITAGE_SITES,
  METRO_STATIONS,
  QUESTS,
  RESTAURANTS,
  SHOPPING_MALLS,
  TRANSPORT_OPTIONS,
  WEATHER_CONFIGS,
  WEATHER_SEQUENCE,
  generateDailyMissionsForDate,
  generateDeliveryGigs,
  getNearestPlace,
  getNpcById,
  getTodayDateKey,
  type NcrDestinationItem,
} from './data/delhiWorld';
import {
  DELHI_RADIO_STATIONS,
  getRadioStationById,
  getRecommendedStationForZone,
  type RadioStationId,
} from './data/delhiRadio';
import { useMultiplayer } from './hooks/useMultiplayer';
import { soundEngine } from './utils/audio';
import { delhiRadio } from './utils/delhiRadio';
import { WorldCanvas } from './components/WorldCanvas';
import { TitleScreen } from './components/TitleScreen';
import { GameHUD } from './components/GameHUD';
import { DirectoryModal } from './components/DirectoryModal';
import { TransportModal } from './components/TransportModal';
import { EarnMoneyModal } from './components/EarnMoneyModal';
import { Landmark3DModal } from './components/Landmark3DModal';
import { PhotoModeModal } from './components/PhotoModeModal';
import { NpcModal } from './components/NpcModal';
import { ExplorerLevelModal } from './components/ExplorerLevelModal';
import {
  EXPLORER_MILESTONES,
  XP_REWARDS,
  getExplorerLevelState,
} from './data/explorerLevels';
import type { Place3DShowcaseItem } from './data/placeImages';
import {
  HeritageModal,
  MallModal,
  MetroModal,
  PassportModal,
  PauseModal,
  RestaurantModal,
} from './components/InteractionModals';
import type {
  ActiveGigState,
  ActivePoiTarget,
  DailyMissionKind,
  DailyMissionState,
  GameState,
  GigContract,
  HeritageSite,
  MallItem,
  MenuItem,
  MetroStation,
  NpcCharacter,
  PlayerProgress,
  QuestDefinition,
  RestaurantSpot,
  RideDispatchTarget,
  ShoppingMallSpot,
  TransportMode,
  WaypointPin,
  WeatherType,
} from './types/game';

const STORAGE_PROGRESS_KEY = 'dilli_darshan_progress_v2';
const STORAGE_PROFILE_KEY = 'dilli_darshan_profile_v1';

function createFreshDailyState(dateKey: string): DailyMissionState {
  return {
    dateKey,
    missions: generateDailyMissionsForDate(dateKey),
    progressById: {},
    completedIds: [],
  };
}

function createDefaultProgress(): PlayerProgress {
  return {
    rupees: 500,
    xp: 0,
    energy: 100,
    maxEnergy: 100,
    visitedPlaces: ['connaught-place'],
    stampedHeritages: [],
    triviaSolvedHeritages: [],
    tastedDishes: [],
    tastedRestaurants: [],
    visitedMalls: [],
    boughtMallItems: [],
    completedQuests: [],
    metroRides: 0,
    gigsCompleted: 0,
    solvedTriviaIds: [],
    talkedNpcIds: [],
    dailyMissions: createFreshDailyState(getTodayDateKey()),
  };
}

function loadInitialProgress(): PlayerProgress {
  const today = getTodayDateKey();
  const base = createDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
      const validDaily =
        parsed.dailyMissions && parsed.dailyMissions.dateKey === today
          ? parsed.dailyMissions
          : createFreshDailyState(today);

      const fallbackXp =
        (Array.isArray(parsed.stampedHeritages) ? parsed.stampedHeritages.length : 0) *
          XP_REWARDS.stampHeritage +
        (typeof parsed.gigsCompleted === 'number' ? parsed.gigsCompleted : 0) *
          XP_REWARDS.completeGig +
        (Array.isArray(parsed.tastedDishes) ? parsed.tastedDishes.length : 0) *
          XP_REWARDS.tasteNewDish +
        (typeof parsed.metroRides === 'number' ? parsed.metroRides : 0) * XP_REWARDS.metroRide +
        Math.max(
          0,
          (Array.isArray(parsed.visitedPlaces) ? parsed.visitedPlaces.length : 1) - 1
        ) *
          XP_REWARDS.discoverPlace;

      return {
        ...base,
        ...parsed,
        rupees: typeof parsed.rupees === 'number' ? parsed.rupees : 500,
        xp: typeof parsed.xp === 'number' ? parsed.xp : fallbackXp,
        energy: typeof parsed.energy === 'number' ? parsed.energy : 100,
        visitedMalls: Array.isArray(parsed.visitedMalls) ? parsed.visitedMalls : [],
        boughtMallItems: Array.isArray(parsed.boughtMallItems) ? parsed.boughtMallItems : [],
        gigsCompleted: typeof parsed.gigsCompleted === 'number' ? parsed.gigsCompleted : 0,
        solvedTriviaIds: Array.isArray(parsed.solvedTriviaIds) ? parsed.solvedTriviaIds : [],
        talkedNpcIds: Array.isArray(parsed.talkedNpcIds) ? parsed.talkedNpcIds : [],
        dailyMissions: validDaily,
      };
    }
  } catch {
    // ignore storage errors
  }
  return base;
}

function loadInitialProfile(): { name: string; color: string } {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { name?: string; color?: string };
      return {
        name: parsed.name || 'Aarav',
        color: parsed.color || AVATAR_COLORS[0].hex,
      };
    }
  } catch {
    // ignore
  }
  return { name: 'Aarav', color: AVATAR_COLORS[0].hex };
}

function isQuestSatisfied(quest: QuestDefinition, prog: PlayerProgress): boolean {
  const req = quest.requirements;
  if (req.places && !req.places.every((id) => prog.visitedPlaces.includes(id))) return false;
  if (req.heritages && !req.heritages.every((id) => prog.stampedHeritages.includes(id)))
    return false;
  if (req.restaurants && !req.restaurants.every((id) => prog.tastedRestaurants.includes(id)))
    return false;
  if (req.malls && !req.malls.every((id) => prog.visitedMalls.includes(id))) return false;
  if (req.dishIds && !req.dishIds.every((id) => prog.tastedDishes.includes(id))) return false;
  if (req.metroRides && prog.metroRides < req.metroRides) return false;
  return true;
}

export default function App() {
  const initialProfile = useRef(loadInitialProfile());
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [playerName, setPlayerName] = useState(initialProfile.current.name);
  const [playerColor, setPlayerColor] = useState(initialProfile.current.color);
  const [progress, setProgress] = useState<PlayerProgress>(loadInitialProgress);
  const [currentZoneId, setCurrentZoneId] = useState('connaught-place');
  const [currentZoneName, setCurrentZoneName] = useState('Connaught Place');
  const [nearestPoi, setNearestPoi] = useState<ActivePoiTarget | null>(null);
  const [waypointPin, setWaypointPin] = useState<WaypointPin | null>(null);

  const [transportMode, setTransportMode] = useState<TransportMode>('walk');
  const [activeRide, setActiveRide] = useState<RideDispatchTarget | null>(null);
  const [activeGig, setActiveGig] = useState<ActiveGigState | null>(null);
  const [availableGigs, setAvailableGigs] = useState<GigContract[]>(() =>
    generateDeliveryGigs(1900, 1450, 4)
  );
  const [weather, setWeather] = useState<WeatherType>('sunny');
  const [weatherAutoCycle, setWeatherAutoCycle] = useState(true);
  const [weatherSecondsLeft, setWeatherSecondsLeft] = useState(WEATHER_CONFIGS.sunny.durationSec);
  const [radioStationId, setRadioStationId] = useState<RadioStationId>('indie-retro');
  const [radioPlaying, setRadioPlaying] = useState(false);
  const [radioAutoTune, setRadioAutoTune] = useState(true);
  const [radioVolume, setRadioVolume] = useState(0.45);

  // Modals
  const [earnOpen, setEarnOpen] = useState(false);
  const [showcaseOpen, setShowcaseOpen] = useState(false);
  const [showcaseInitialItem, setShowcaseInitialItem] = useState<Place3DShowcaseItem | null>(null);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [passportOpen, setPassportOpen] = useState(false);
  const [transportOpen, setTransportOpen] = useState(false);
  const [transportInitialDest, setTransportInitialDest] = useState<NcrDestinationItem | null>(null);
  const [activeMetro, setActiveMetro] = useState<MetroStation | null>(null);
  const [activeHeritage, setActiveHeritage] = useState<HeritageSite | null>(null);
  const [activeRestaurant, setActiveRestaurant] = useState<RestaurantSpot | null>(null);
  const [activeMall, setActiveMall] = useState<ShoppingMallSpot | null>(null);
  const [activeNpc, setActiveNpc] = useState<NpcCharacter | null>(null);
  const [photoSnapshotUrl, setPhotoSnapshotUrl] = useState<string | null>(null);
  const [levelModalOpen, setLevelModalOpen] = useState(false);

  const [muted, setMuted] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);
  const [metroTransitLabel, setMetroTransitLabel] = useState<string | null>(null);

  const levelState = getExplorerLevelState(progress.xp);
  const hasSprintEfficiency = levelState.unlockedPerks.has('sprint_efficiency');
  const hasFareSaver = levelState.unlockedPerks.has('fare_saver');
  const hasCompassRadar = levelState.unlockedPerks.has('compass_radar');
  const hasGoldenAura = levelState.unlockedPerks.has('golden_ring');
  const hasSwiftFoot = levelState.unlockedPerks.has('swift_foot');
  const prevLevelRef = useRef(levelState.level);

  // Refs for 60fps canvas simulation (Connaught Place spawn on 4400x3400 NCR map)
  const playerPosRef = useRef({ x: 1900, y: 1450, facing: 0 });
  const energyRef = useRef(progress.energy);
  const particleTriggerRef = useRef<((x: number, y: number, color: string, count?: number) => void) | null>(
    null
  );
  const cameraSnapTriggerRef = useRef<(() => void) | null>(null);
  const photoCaptureRef = useRef<(() => string | null) | null>(null);
  const mapNavigateTargetRef = useRef<{ x: number; y: number } | null>(null);
  const zoomDeltaRef = useRef(0);
  const touchMoveVectorRef = useRef({ dx: 0, dy: 0, sprint: false });
  const toastTimerRef = useRef<number | null>(null);
  const lastEnergySyncRef = useRef(0);

  const {
    status: connectionStatus,
    activeRoomCode,
    chatMessages,
    remotePlayersList,
    remotePlayersMapRef,
    selfSpeechRef,
    joinRoom,
    disconnect,
    sendMove,
    sendStats,
    sendChat,
    sendEmote,
    sendActivity,
  } = useMultiplayer();

  const showToast = useCallback((text: string) => {
    setToastText(text);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastText(null);
    }, 3400);
  }, []);

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Announce Explorer Level ups & newly unlocked perks
  useEffect(() => {
    if (levelState.level > prevLevelRef.current) {
      const milestone = EXPLORER_MILESTONES.find((m) => m.level === levelState.level);
      soundEngine.playQuestComplete();
      particleTriggerRef.current?.(playerPosRef.current.x, playerPosRef.current.y, '#F59E0B', 28);
      const perkLabel = milestone ? `${milestone.title} — ${milestone.perkName}` : `Rank ${levelState.level}`;
      showToast(`Level Up! Lv.${levelState.level} ${perkLabel}`);
      if (gameState !== 'TITLE_MENU') {
        sendActivity(`reached Explorer Lv.${levelState.level} (${milestone?.title ?? 'Explorer'})!`);
      }
    }
    prevLevelRef.current = levelState.level;
  }, [gameState, levelState.level, sendActivity, showToast]);

  // Roll over Daily Missions automatically if local calendar day changes
  useEffect(() => {
    const checkDayRollover = () => {
      const today = getTodayDateKey();
      setProgress((prev) => {
        if (prev.dailyMissions.dateKey === today) return prev;
        showToast('New Daily Missions available!');
        return {
          ...prev,
          dailyMissions: createFreshDailyState(today),
        };
      });
    };
    const timer = window.setInterval(checkDayRollover, 30000);
    return () => window.clearInterval(timer);
  }, [showToast]);

  const handleSelectWeather = useCallback(
    (nextWeather: WeatherType) => {
      setWeather(nextWeather);
      setWeatherSecondsLeft(WEATHER_CONFIGS[nextWeather].durationSec);
      const cfg = WEATHER_CONFIGS[nextWeather];
      const pct = Math.round(cfg.speedMultiplier * 100);
      if (gameState === 'PLAYING') {
        showToast(`Weather: ${cfg.label} (${pct}% movement speed)`);
      }
    },
    [gameState, showToast]
  );

  // Automatic weather cycle between sunny -> smoggy -> monsoon rain
  useEffect(() => {
    if (!weatherAutoCycle || gameState !== 'PLAYING') return;
    const interval = window.setInterval(() => {
      setWeatherSecondsLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [gameState, weatherAutoCycle]);

  useEffect(() => {
    if (!weatherAutoCycle || gameState !== 'PLAYING' || weatherSecondsLeft > 0) return;
    const idx = WEATHER_SEQUENCE.indexOf(weather);
    const next = WEATHER_SEQUENCE[(idx + 1) % WEATHER_SEQUENCE.length];
    const cfg = WEATHER_CONFIGS[next];
    const pct = Math.round(cfg.speedMultiplier * 100);
    setWeather(next);
    setWeatherSecondsLeft(cfg.durationSec);
    showToast(`Weather shifted: ${cfg.label} (${pct}% movement speed)`);
  }, [gameState, showToast, weather, weatherAutoCycle, weatherSecondsLeft]);

  // Evaluate both permanent Trails and Daily Missions
  const evaluateRewards = useCallback(
    (
      nextProg: PlayerProgress,
      dailyEvent?: { kind: DailyMissionKind; targetId?: string; amount?: number }
    ): PlayerProgress => {
      let updated = nextProg;

      // 1. Update Daily Missions
      const today = getTodayDateKey();
      let daily =
        updated.dailyMissions.dateKey === today
          ? updated.dailyMissions
          : createFreshDailyState(today);

      if (dailyEvent) {
        const nextProgressMap = { ...daily.progressById };
        const nextCompletedIds = [...daily.completedIds];
        let dailyBonus = 0;
        const completedTitles: string[] = [];

        for (const m of daily.missions) {
          if (nextCompletedIds.includes(m.id)) continue;
          if (m.kind !== dailyEvent.kind) continue;
          if (m.targetId && m.targetId !== dailyEvent.targetId) continue;

          const prevVal = nextProgressMap[m.id] ?? 0;
          const nextVal = Math.min(m.targetCount, prevVal + (dailyEvent.amount ?? 1));
          nextProgressMap[m.id] = nextVal;

          if (nextVal >= m.targetCount) {
            nextCompletedIds.push(m.id);
            dailyBonus += m.rewardRupees;
            completedTitles.push(m.title);
          }
        }

        daily = {
          ...daily,
          progressById: nextProgressMap,
          completedIds: nextCompletedIds,
        };
        updated = {
          ...updated,
          rupees: updated.rupees + dailyBonus,
          xp: updated.xp + completedTitles.length * XP_REWARDS.dailyMission,
          dailyMissions: daily,
        };

        if (completedTitles.length > 0) {
          soundEngine.playQuestComplete();
          showToast(
            `Daily Mission Complete: ${completedTitles.join(', ')} (+₹${dailyBonus}, +${completedTitles.length * XP_REWARDS.dailyMission} XP)`
          );
          sendActivity(`completed Daily Mission "${completedTitles.join(', ')}"!`);
        }
      } else if (daily !== updated.dailyMissions) {
        updated = { ...updated, dailyMissions: daily };
      }

      // 2. Check permanent NCR Trail Quests
      const newlyCompleted: QuestDefinition[] = [];
      for (const quest of QUESTS) {
        if (!updated.completedQuests.includes(quest.id) && isQuestSatisfied(quest, updated)) {
          newlyCompleted.push(quest);
        }
      }
      if (newlyCompleted.length > 0) {
        const bonus = newlyCompleted.reduce((sum, q) => sum + q.rewardRupees, 0);
        const bonusXp = newlyCompleted.length * XP_REWARDS.questComplete;
        updated = {
          ...updated,
          rupees: updated.rupees + bonus,
          xp: updated.xp + bonusXp,
          completedQuests: [
            ...updated.completedQuests,
            ...newlyCompleted.map((q) => q.id),
          ],
        };
        soundEngine.playQuestComplete();
        const titleList = newlyCompleted.map((q) => q.title).join(', ');
        showToast(`NCR Trail Completed: ${titleList} (+₹${bonus}, +${bonusXp} XP)`);
        sendActivity(`completed trail "${titleList}"!`);
      }

      return updated;
    },
    [sendActivity, showToast]
  );

  const handleStartGame = useCallback(
    (name: string, color: string, roomCode: string) => {
      setPlayerName(name);
      setPlayerColor(color);
      try {
        localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify({ name, color }));
      } catch {
        // ignore
      }

      const startZone = getNearestPlace(playerPosRef.current.x, playerPosRef.current.y);
      setCurrentZoneId(startZone.id);
      setCurrentZoneName(startZone.name);
      if (radioAutoTune) {
        setRadioStationId(getRecommendedStationForZone(startZone.id));
      }
      setRadioPlaying(true);

      joinRoom({
        name,
        color,
        roomCode,
        x: playerPosRef.current.x,
        y: playerPosRef.current.y,
        zoneName: startZone.name,
        vehicle: transportMode,
        stampsCount: progress.stampedHeritages.length,
        dishesCount: progress.tastedDishes.length,
        gigsCompleted: progress.gigsCompleted,
      });

      soundEngine.playMetroChime();
      setGameState('PLAYING');
      cameraSnapTriggerRef.current?.();
    },
    [
      joinRoom,
      progress.gigsCompleted,
      progress.stampedHeritages.length,
      progress.tastedDishes.length,
      radioAutoTune,
      transportMode,
    ]
  );

  const handleConsumeEnergy = useCallback((delta: number) => {
    const nextVal = Math.max(0, Math.min(100, energyRef.current + delta));
    energyRef.current = nextVal;
    const now = performance.now();
    if (now - lastEnergySyncRef.current > 180) {
      lastEnergySyncRef.current = now;
      setProgress((prev) =>
        Math.abs(prev.energy - nextVal) < 0.4 ? prev : { ...prev, energy: nextVal }
      );
    }
  }, []);

  const handleZoneChange = useCallback(
    (zoneId: string, zoneName: string) => {
      setCurrentZoneId(zoneId);
      setCurrentZoneName(zoneName);
      if (radioAutoTune) {
        const recStation = getRecommendedStationForZone(zoneId);
        if (recStation !== radioStationId) {
          setRadioStationId(recStation);
          if (radioPlaying && !muted) {
            const st = getRadioStationById(recStation);
            showToast(`Delhi Radio tuned to ${st.frequency} · ${st.name}`);
          }
        }
      }
      setProgress((prev) => {
        const isNewPlace = !prev.visitedPlaces.includes(zoneId);
        const next = isNewPlace
          ? {
              ...prev,
              xp: prev.xp + XP_REWARDS.discoverPlace,
              visitedPlaces: [...prev.visitedPlaces, zoneId],
            }
          : prev;
        if (isNewPlace) {
          showToast(`Discovered ${zoneName} (+${XP_REWARDS.discoverPlace} XP)`);
        }
        return evaluateRewards(next, { kind: 'visit_place', targetId: zoneId, amount: 1 });
      });
    },
    [evaluateRewards, muted, radioAutoTune, radioPlaying, radioStationId, showToast]
  );

  const handleInteractPoi = useCallback(
    (poi: ActivePoiTarget) => {
      if (poi.kind === 'metro') {
        const st = METRO_STATIONS.find((s) => s.id === poi.id);
        if (st) setActiveMetro(st);
      } else if (poi.kind === 'heritage') {
        const site = HERITAGE_SITES.find((h) => h.id === poi.id);
        if (site) setActiveHeritage(site);
      } else if (poi.kind === 'restaurant') {
        const rest = RESTAURANTS.find((r) => r.id === poi.id);
        if (rest) setActiveRestaurant(rest);
      } else if (poi.kind === 'mall') {
        const mall = SHOPPING_MALLS.find((m) => m.id === poi.id);
        if (mall) {
          setActiveMall(mall);
          setProgress((prev) => {
            const isNewMall = !prev.visitedMalls.includes(mall.id);
            const visitedMalls = isNewMall
              ? [...prev.visitedMalls, mall.id]
              : prev.visitedMalls;
            return evaluateRewards(
              {
                ...prev,
                xp: prev.xp + (isNewMall ? XP_REWARDS.visitMall : 0),
                visitedMalls,
              },
              { kind: 'visit_mall', targetId: mall.id, amount: 1 }
            );
          });
        }
      } else if (poi.kind === 'npc') {
        const npc = getNpcById(poi.id);
        if (npc) {
          soundEngine.playChatPing();
          setActiveNpc(npc);
        }
      }
    },
    [evaluateRewards]
  );

  const handleMetroTravel = useCallback(
    (dest: MetroStation, fare: number) => {
      if (progress.rupees < fare) {
        soundEngine.playError();
        showToast('Not enough Rupees for this Metro ticket. Complete a heritage quiz or daily mission!');
        return;
      }

      soundEngine.playMetroChime();
      setActiveMetro(null);
      setMetroTransitLabel(`Boarding Delhi Metro to ${dest.name}...`);

      window.setTimeout(() => {
        playerPosRef.current.x = dest.x;
        playerPosRef.current.y = dest.y + 34;
        cameraSnapTriggerRef.current?.();
        particleTriggerRef.current?.(dest.x, dest.y + 34, '#2563EB', 22);

        const place = getNearestPlace(dest.x, dest.y);
        setCurrentZoneName(place.name);
        setActiveRide(null);
        sendMove(playerPosRef.current.x, playerPosRef.current.y, 0, place.name, true, transportMode);
        sendActivity(`arrived at ${dest.name} Metro (₹${fare}).`);

        setProgress((prev) => {
          const isNewPlace = !prev.visitedPlaces.includes(place.id);
          const visitedPlaces = isNewPlace
            ? [...prev.visitedPlaces, place.id]
            : prev.visitedPlaces;
          const next = {
            ...prev,
            rupees: prev.rupees - fare,
            xp: prev.xp + XP_REWARDS.metroRide + (isNewPlace ? XP_REWARDS.discoverPlace : 0),
            metroRides: prev.metroRides + 1,
            visitedPlaces,
          };
          const afterMetro = evaluateRewards(next, { kind: 'metro_rides', amount: 1 });
          return evaluateRewards(afterMetro, { kind: 'visit_place', targetId: place.id, amount: 1 });
        });

        setMetroTransitLabel(null);
        showToast(`Arrived at ${dest.name} (-₹${fare}, +${XP_REWARDS.metroRide} XP)`);
      }, 650);
    },
    [evaluateRewards, progress.rupees, sendActivity, sendMove, showToast, transportMode]
  );

  const handleOrderDish = useCallback(
    (restaurant: RestaurantSpot, item: MenuItem) => {
      if (progress.rupees < item.price) {
        soundEngine.playError();
        showToast('Insufficient Rupees! Earn more from Daily Missions, Stamps, or Quizzes.');
        return;
      }

      soundEngine.playEat();
      const restoredEnergy = Math.min(100, energyRef.current + item.energyRestore);
      energyRef.current = restoredEnergy;
      particleTriggerRef.current?.(
        playerPosRef.current.x,
        playerPosRef.current.y,
        '#D97706',
        20
      );

      const isNewDish = !progress.tastedDishes.includes(item.id);
      const earnedXp = isNewDish ? XP_REWARDS.tasteNewDish : XP_REWARDS.repeatDish;

      setProgress((prev) => {
        const tastedDishes = prev.tastedDishes.includes(item.id)
          ? prev.tastedDishes
          : [...prev.tastedDishes, item.id];
        const tastedRestaurants = prev.tastedRestaurants.includes(restaurant.id)
          ? prev.tastedRestaurants
          : [...prev.tastedRestaurants, restaurant.id];

        const next = {
          ...prev,
          rupees: prev.rupees - item.price,
          xp: prev.xp + earnedXp,
          energy: restoredEnergy,
          tastedDishes,
          tastedRestaurants,
        };
        sendStats(next.stampedHeritages.length, next.tastedDishes.length, next.gigsCompleted);
        return evaluateRewards(next, { kind: 'taste_dishes', amount: 1 });
      });

      sendActivity(`ate ${item.name} at ${restaurant.name} (₹${item.price}).`);
      showToast(
        `Enjoyed ${item.name} (-₹${item.price}, +${item.energyRestore} Energy, +${earnedXp} XP)`
      );
    },
    [evaluateRewards, progress.rupees, progress.tastedDishes, sendActivity, sendStats, showToast]
  );

  const handleBuyMallItem = useCallback(
    (mall: ShoppingMallSpot, item: MallItem) => {
      if (progress.rupees < item.price) {
        soundEngine.playError();
        showToast('Not enough Rupees! Complete a Daily Mission or Heritage Quiz.');
        return;
      }

      soundEngine.playCoin();
      const restoredEnergy = Math.min(100, energyRef.current + item.energyRestore);
      energyRef.current = restoredEnergy;
      particleTriggerRef.current?.(
        playerPosRef.current.x,
        playerPosRef.current.y,
        '#0369A1',
        20
      );

      setProgress((prev) => {
        const boughtMallItems = prev.boughtMallItems.includes(item.id)
          ? prev.boughtMallItems
          : [...prev.boughtMallItems, item.id];
        const visitedMalls = prev.visitedMalls.includes(mall.id)
          ? prev.visitedMalls
          : [...prev.visitedMalls, mall.id];
        const next = {
          ...prev,
          rupees: prev.rupees - item.price,
          xp: prev.xp + XP_REWARDS.buyMallItem,
          energy: restoredEnergy,
          boughtMallItems,
          visitedMalls,
        };
        return evaluateRewards(next, { kind: 'buy_mall_item', amount: 1 });
      });

      sendActivity(`picked up ${item.name} at ${mall.name} (₹${item.price}).`);
      showToast(
        `Picked up ${item.name} (-₹${item.price}, +${item.energyRestore} Energy, +${XP_REWARDS.buyMallItem} XP)`
      );
    },
    [evaluateRewards, progress.rupees, sendActivity, showToast]
  );

  const handleStampHeritage = useCallback(
    (site: HeritageSite) => {
      if (progress.stampedHeritages.includes(site.id)) return;
      if (progress.rupees < site.ticketPrice) {
        soundEngine.playError();
        showToast(`Need ₹${site.ticketPrice} for entry ticket. Try the Heritage Quiz below!`);
        return;
      }

      soundEngine.playStamp();
      particleTriggerRef.current?.(site.x, site.y, '#B45309', 24);
      const rewardAmt = hasGoldenAura
        ? Math.round(site.rewardRupees * 1.15)
        : site.rewardRupees;

      setProgress((prev) => {
        const next = {
          ...prev,
          rupees: prev.rupees - site.ticketPrice + rewardAmt,
          xp: prev.xp + XP_REWARDS.stampHeritage,
          stampedHeritages: [...prev.stampedHeritages, site.id],
        };
        sendStats(next.stampedHeritages.length, next.tastedDishes.length, next.gigsCompleted);
        return evaluateRewards(next, { kind: 'stamp_heritage', amount: 1 });
      });

      sendActivity(`stamped ${site.name} in their Heritage Passport!`);
      const net = rewardAmt - site.ticketPrice;
      showToast(`Stamped ${site.name} (+₹${net} net grant, +${XP_REWARDS.stampHeritage} XP)`);
    },
    [
      evaluateRewards,
      hasGoldenAura,
      progress.rupees,
      progress.stampedHeritages,
      sendActivity,
      sendStats,
      showToast,
    ]
  );

  const handleSolveTrivia = useCallback(
    (site: HeritageSite) => {
      if (progress.triviaSolvedHeritages.includes(site.id)) return;
      soundEngine.playCoin();
      particleTriggerRef.current?.(playerPosRef.current.x, playerPosRef.current.y, '#15803D', 16);
      setProgress((prev) => ({
        ...prev,
        rupees: prev.rupees + 75,
        xp: prev.xp + XP_REWARDS.solveTrivia,
        triviaSolvedHeritages: [...prev.triviaSolvedHeritages, site.id],
      }));
      showToast(`Correct! Heritage Quiz Bonus +₹75 & +${XP_REWARDS.solveTrivia} XP`);
    },
    [progress.triviaSolvedHeritages, showToast]
  );

  const handlePinWaypoint = useCallback(
    (pin: WaypointPin) => {
      setWaypointPin(pin);
      showToast(`Compass pinned to ${pin.name}`);
    },
    [showToast]
  );

  const handleBookRide = useCallback(
    (target: RideDispatchTarget) => {
      if (progress.rupees < target.fare) {
        soundEngine.playError();
        showToast('Not enough Rupees for this ride!');
        return;
      }
      if (target.fare > 0) {
        setProgress((prev) => ({ ...prev, rupees: prev.rupees - target.fare }));
      }
      soundEngine.playVehicleDispatch(target.mode);
      setTransportOpen(false);
      setTransportInitialDest(null);
      setActiveRide(target);
      const place = getNearestPlace(playerPosRef.current.x, playerPosRef.current.y);
      sendMove(
        playerPosRef.current.x,
        playerPosRef.current.y,
        playerPosRef.current.facing,
        place.name,
        true,
        target.mode
      );
      const label = TRANSPORT_OPTIONS[target.mode].label;
      if (target.mode === 'walk') {
        showToast(`Walking toward ${target.name}`);
      } else {
        sendActivity(`booked a ${label} to ${target.name} (₹${target.fare}).`);
        showToast(`${label} dispatched to ${target.name} (-₹${target.fare})`);
      }
    },
    [progress.rupees, sendActivity, sendMove, showToast]
  );

  const handleSwitchFreeRoamMode = useCallback(
    (mode: TransportMode, passCost: number) => {
      if (progress.rupees < passCost) {
        soundEngine.playError();
        showToast(`Need ₹${passCost} for ${TRANSPORT_OPTIONS[mode].label} pass`);
        return;
      }
      if (passCost > 0) {
        setProgress((prev) => ({ ...prev, rupees: prev.rupees - passCost }));
      }
      setActiveRide(null);
      setTransportMode(mode);
      soundEngine.playVehicleDispatch(mode);
      const place = getNearestPlace(playerPosRef.current.x, playerPosRef.current.y);
      sendMove(
        playerPosRef.current.x,
        playerPosRef.current.y,
        playerPosRef.current.facing,
        place.name,
        true,
        mode
      );
      showToast(
        mode === 'walk'
          ? 'Stepped out on foot'
          : `Now cruising in ${TRANSPORT_OPTIONS[mode].label}${passCost > 0 ? ` (-₹${passCost})` : ''}`
      );
    },
    [progress.rupees, sendMove, showToast]
  );

  const handleRideComplete = useCallback(
    (ride: RideDispatchTarget) => {
      setActiveRide(null);
      setTransportMode('walk');
      soundEngine.playCoin();
      particleTriggerRef.current?.(ride.x, ride.y + 24, '#15803D', 20);
      const place = getNearestPlace(ride.x, ride.y + 24);
      setCurrentZoneName(place.name);
      showToast(`Arrived at ${ride.name} via ${TRANSPORT_OPTIONS[ride.mode].label}!`);
    },
    [showToast]
  );

  const handleRideCancel = useCallback(() => {
    setActiveRide(null);
    const place = getNearestPlace(playerPosRef.current.x, playerPosRef.current.y);
    sendMove(
      playerPosRef.current.x,
      playerPosRef.current.y,
      playerPosRef.current.facing,
      place.name,
      true,
      transportMode
    );
    showToast('Ride cancelled — manual steering');
  }, [sendMove, showToast, transportMode]);

  const handleRefreshGigs = useCallback(() => {
    setAvailableGigs(generateDeliveryGigs(playerPosRef.current.x, playerPosRef.current.y, 4));
  }, []);

  const handleAcceptGig = useCallback(
    (gig: GigContract) => {
      setActiveGig({ contract: gig, stage: 'pickup' });
      setWaypointPin({
        kind: 'place',
        id: gig.pickupId,
        name: `Pickup: ${gig.pickupName}`,
        x: gig.pickupX,
        y: gig.pickupY,
      });
      soundEngine.playCoin();
      showToast(`Gig accepted! Head to ${gig.pickupName} for pickup (+₹${gig.rewardRupees})`);
    },
    [showToast]
  );

  const handleCancelGig = useCallback(() => {
    setActiveGig(null);
    setWaypointPin(null);
    showToast('Gig contract cancelled');
  }, [showToast]);

  const handleGigStepReached = useCallback(
    (gigId: string, stage: 'pickup' | 'dropoff') => {
      setActiveGig((prev) => {
        if (!prev || prev.contract.id !== gigId || prev.stage !== stage) return prev;

        if (stage === 'pickup') {
          soundEngine.playCoin();
          particleTriggerRef.current?.(prev.contract.pickupX, prev.contract.pickupY, '#D97706', 22);
          setWaypointPin({
            kind: 'place',
            id: prev.contract.dropoffId,
            name: `Dropoff: ${prev.contract.dropoffName}`,
            x: prev.contract.dropoffX,
            y: prev.contract.dropoffY,
          });
          showToast(`Picked up! Now deliver to ${prev.contract.dropoffName}`);
          return { ...prev, stage: 'dropoff' };
        }

        // Dropoff completed -> pay out!
        const payout = hasGoldenAura
          ? Math.round(prev.contract.rewardRupees * 1.15)
          : prev.contract.rewardRupees;
        const dropName = prev.contract.dropoffName;
        const gigTitle = prev.contract.title;
        soundEngine.playQuestComplete();
        particleTriggerRef.current?.(prev.contract.dropoffX, prev.contract.dropoffY, '#15803D', 28);
        setWaypointPin(null);
        setProgress((p) => {
          const next = {
            ...p,
            rupees: p.rupees + payout,
            xp: p.xp + XP_REWARDS.completeGig,
            gigsCompleted: p.gigsCompleted + 1,
          };
          sendStats(next.stampedHeritages.length, next.tastedDishes.length, next.gigsCompleted);
          return next;
        });
        setAvailableGigs(generateDeliveryGigs(playerPosRef.current.x, playerPosRef.current.y, 4));
        sendActivity(`completed "${gigTitle}" at ${dropName} (+₹${payout})!`);
        showToast(
          `Gig Complete at ${dropName}! Earned +₹${payout} & +${XP_REWARDS.completeGig} XP`
        );
        return null;
      });
    },
    [hasGoldenAura, sendActivity, sendStats, showToast]
  );

  const handleClaimDailyStipend = useCallback(() => {
    const today = getTodayDateKey();
    setProgress((prev) => {
      if (prev.lastStipendDateKey === today) return prev;
      soundEngine.playQuestComplete();
      particleTriggerRef.current?.(playerPosRef.current.x, playerPosRef.current.y, '#15803D', 20);
      showToast('Claimed Daily Explorer Stipend (+₹150)');
      return {
        ...prev,
        rupees: prev.rupees + 150,
        lastStipendDateKey: today,
      };
    });
  }, [showToast]);

  const handleSolveCityTrivia = useCallback(
    (questionId: string, rewardRupees: number) => {
      setProgress((prev) => {
        if (prev.solvedTriviaIds.includes(questionId)) return prev;
        soundEngine.playCoin();
        particleTriggerRef.current?.(playerPosRef.current.x, playerPosRef.current.y, '#15803D', 16);
        showToast(
          `Correct! Delhi Trivia Bonus +₹${rewardRupees} & +${XP_REWARDS.solveTrivia} XP`
        );
        return {
          ...prev,
          rupees: prev.rupees + rewardRupees,
          xp: prev.xp + XP_REWARDS.solveTrivia,
          solvedTriviaIds: [...prev.solvedTriviaIds, questionId],
        };
      });
    },
    [showToast]
  );

  const handleCompleteChaiShift = useCallback(
    (earnedRupees: number, ordersServed: number, energyCost: number) => {
      const nextEnergy = Math.max(0, energyRef.current - energyCost);
      energyRef.current = nextEnergy;
      const earnedXp = ordersServed > 0 ? XP_REWARDS.chaiShift : 0;
      setProgress((prev) => ({
        ...prev,
        rupees: prev.rupees + earnedRupees,
        xp: prev.xp + earnedXp,
        energy: nextEnergy,
      }));
      if (earnedRupees > 0) {
        soundEngine.playQuestComplete();
        particleTriggerRef.current?.(playerPosRef.current.x, playerPosRef.current.y, '#D97706', 22);
        sendActivity(`worked a Chai Counter shift serving ${ordersServed} orders (+₹${earnedRupees})!`);
        showToast(
          `Chai Shift Complete: ${ordersServed} served (+₹${earnedRupees}, +${earnedXp} XP)`
        );
      } else {
        showToast('Shift ended — try clicking the matching orders faster next round!');
      }
    },
    [sendActivity, showToast]
  );

  const handleMapClickNavigate = useCallback(
    (worldX: number, worldY: number) => {
      mapNavigateTargetRef.current = { x: worldX, y: worldY };
      showToast('Navigating via GPS');
    },
    [showToast]
  );

  const handleCapturePhoto = useCallback(() => {
    const dataUrl = photoCaptureRef.current?.() ?? null;
    if (!dataUrl) {
      showToast('Could not capture viewport right now.');
      return;
    }
    soundEngine.playShutter();
    setEarnOpen(false);
    setShowcaseOpen(false);
    setDirectoryOpen(false);
    setPassportOpen(false);
    setTransportOpen(false);
    setActiveMetro(null);
    setActiveHeritage(null);
    setActiveRestaurant(null);
    setActiveMall(null);
    setActiveNpc(null);
    setLevelModalOpen(false);
    setPhotoSnapshotUrl(dataUrl);
  }, [showToast]);

  const isAnyModalOpen =
    photoSnapshotUrl !== null ||
    levelModalOpen ||
    activeNpc !== null ||
    earnOpen ||
    showcaseOpen ||
    directoryOpen ||
    passportOpen ||
    transportOpen ||
    activeMetro !== null ||
    activeHeritage !== null ||
    activeRestaurant !== null ||
    activeMall !== null ||
    gameState === 'PAUSED';

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'TITLE_MENU') return;
      const active = document.activeElement;
      const isTyping =
        active &&
        (active.tagName.toLowerCase() === 'input' || active.tagName.toLowerCase() === 'textarea');

      if (e.key === 'Escape') {
        e.preventDefault();
        if (photoSnapshotUrl) setPhotoSnapshotUrl(null);
        else if (levelModalOpen) setLevelModalOpen(false);
        else if (activeNpc) setActiveNpc(null);
        else if (showcaseOpen) setShowcaseOpen(false);
        else if (earnOpen) setEarnOpen(false);
        else if (transportOpen) setTransportOpen(false);
        else if (directoryOpen) setDirectoryOpen(false);
        else if (passportOpen) setPassportOpen(false);
        else if (activeMetro) setActiveMetro(null);
        else if (activeHeritage) setActiveHeritage(null);
        else if (activeRestaurant) setActiveRestaurant(null);
        else if (activeMall) setActiveMall(null);
        else setGameState((s) => (s === 'PLAYING' ? 'PAUSED' : 'PLAYING'));
        return;
      }

      if (isTyping) return;

      if (e.key === 'Tab') {
        e.preventDefault();
        setEarnOpen(false);
        setShowcaseOpen(false);
        setPassportOpen(false);
        setTransportOpen(false);
        setLevelModalOpen(false);
        setDirectoryOpen((v) => !v);
      } else if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setEarnOpen(false);
        setShowcaseOpen(false);
        setDirectoryOpen(false);
        setTransportOpen(false);
        setLevelModalOpen(false);
        setPassportOpen((v) => !v);
      } else if (e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setEarnOpen(false);
        setShowcaseOpen(false);
        setDirectoryOpen(false);
        setPassportOpen(false);
        setTransportOpen(false);
        setLevelModalOpen((v) => !v);
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        setEarnOpen(false);
        setShowcaseOpen(false);
        setDirectoryOpen(false);
        setPassportOpen(false);
        setLevelModalOpen(false);
        setTransportInitialDest(null);
        setTransportOpen((v) => !v);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setShowcaseOpen(false);
        setDirectoryOpen(false);
        setPassportOpen(false);
        setTransportOpen(false);
        setLevelModalOpen(false);
        setEarnOpen((v) => !v);
      } else if (e.key.toLowerCase() === 'v') {
        e.preventDefault();
        setEarnOpen(false);
        setDirectoryOpen(false);
        setPassportOpen(false);
        setTransportOpen(false);
        setLevelModalOpen(false);
        setShowcaseInitialItem(null);
        setShowcaseOpen((v) => !v);
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        const nextIdx = (WEATHER_SEQUENCE.indexOf(weather) + 1) % WEATHER_SEQUENCE.length;
        handleSelectWeather(WEATHER_SEQUENCE[nextIdx]);
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setRadioPlaying((v) => !v);
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        handleCapturePhoto();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    activeHeritage,
    activeMall,
    activeMetro,
    activeNpc,
    activeRestaurant,
    directoryOpen,
    earnOpen,
    gameState,
    handleCapturePhoto,
    handleSelectWeather,
    levelModalOpen,
    passportOpen,
    photoSnapshotUrl,
    showcaseOpen,
    transportOpen,
    weather,
  ]);

  useEffect(() => {
    delhiRadio.syncState({
      playing: gameState !== 'TITLE_MENU' && radioPlaying,
      stationId: radioStationId,
      volume: radioVolume,
      muted,
    });
  }, [gameState, muted, radioPlaying, radioStationId, radioVolume]);

  useEffect(() => {
    return () => {
      delhiRadio.syncState({
        playing: false,
        stationId: 'indie-retro',
        volume: 0,
        muted: true,
      });
    };
  }, []);

  const handleSelectRadioStation = useCallback((id: RadioStationId) => {
    setRadioAutoTune(false);
    setRadioStationId(id);
    setRadioPlaying(true);
    const st = getRadioStationById(id);
    showToast(`Tuned to ${st.frequency} · ${st.name}`);
  }, [showToast]);

  const handleStepRadioStation = useCallback(
    (delta: -1 | 1) => {
      const idx = DELHI_RADIO_STATIONS.findIndex((s) => s.id === radioStationId);
      const nextIdx =
        (idx + delta + DELHI_RADIO_STATIONS.length) % DELHI_RADIO_STATIONS.length;
      const nextStation = DELHI_RADIO_STATIONS[nextIdx];
      setRadioAutoTune(false);
      setRadioStationId(nextStation.id);
      setRadioPlaying(true);
      showToast(`Tuned to ${nextStation.frequency} · ${nextStation.name}`);
    },
    [radioStationId, showToast]
  );

  const handleToggleRadioAutoTune = useCallback(() => {
    setRadioAutoTune((prev) => {
      const next = !prev;
      if (next) {
        const rec = getRecommendedStationForZone(currentZoneId);
        setRadioStationId(rec);
        const st = getRadioStationById(rec);
        showToast(`Delhi Radio Auto-Tune ON · ${st.frequency} ${st.name}`);
      } else {
        showToast('Delhi Radio set to Manual Dial');
      }
      return next;
    });
  }, [currentZoneId, showToast]);

  const handleToggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      return next;
    });
  }, []);

  const handleSwitchRoom = useCallback(
    (newRoomCode: string) => {
      const place = getNearestPlace(playerPosRef.current.x, playerPosRef.current.y);
      joinRoom({
        name: playerName,
        color: playerColor,
        roomCode: newRoomCode,
        x: playerPosRef.current.x,
        y: playerPosRef.current.y,
        zoneName: place.name,
        vehicle: activeRide ? activeRide.mode : transportMode,
        stampsCount: progress.stampedHeritages.length,
        dishesCount: progress.tastedDishes.length,
        gigsCompleted: progress.gigsCompleted,
      });
      setGameState('PLAYING');
      showToast(`Joined room ${newRoomCode}`);
    },
    [
      activeRide,
      joinRoom,
      playerColor,
      playerName,
      progress.gigsCompleted,
      progress.stampedHeritages.length,
      progress.tastedDishes.length,
      showToast,
      transportMode,
    ]
  );

  const handleExitToTitle = useCallback(() => {
    disconnect();
    setActiveRide(null);
    setActiveGig(null);
    setEarnOpen(false);
    setShowcaseOpen(false);
    setTransportOpen(false);
    setDirectoryOpen(false);
    setPassportOpen(false);
    setActiveMetro(null);
    setActiveHeritage(null);
    setActiveRestaurant(null);
    setActiveMall(null);
    setActiveNpc(null);
    setPhotoSnapshotUrl(null);
    setLevelModalOpen(false);
    setRadioPlaying(false);
    setGameState('TITLE_MENU');
  }, [disconnect]);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#F3EBDD]">
      <WorldCanvas
        gameState={gameState}
        playerName={playerName}
        playerColor={playerColor}
        playerPosRef={playerPosRef}
        energyRef={energyRef}
        transportMode={transportMode}
        activeRide={activeRide}
        activeGig={activeGig}
        onGigStepReached={handleGigStepReached}
        onRideComplete={handleRideComplete}
        onRideCancel={handleRideCancel}
        onConsumeEnergy={handleConsumeEnergy}
        onZoneChange={handleZoneChange}
        onNearestPoiChange={setNearestPoi}
        onInteractPoi={handleInteractPoi}
        onMoveBroadcast={sendMove}
        remotePlayersMapRef={remotePlayersMapRef}
        selfSpeechRef={selfSpeechRef}
        stampedHeritages={progress.stampedHeritages}
        tastedRestaurants={progress.tastedRestaurants}
        visitedMalls={progress.visitedMalls}
        waypointPin={waypointPin}
        particleTriggerRef={particleTriggerRef}
        cameraSnapTriggerRef={cameraSnapTriggerRef}
        photoCaptureRef={photoCaptureRef}
        mapNavigateTargetRef={mapNavigateTargetRef}
        zoomDeltaRef={zoomDeltaRef}
        touchMoveVectorRef={touchMoveVectorRef}
        isModalOpen={isAnyModalOpen}
        weather={weather}
        sprintDrainMult={hasSprintEfficiency ? 0.75 : 1}
        speedBonusMult={hasSwiftFoot ? 1.15 : 1}
        interactRadiusBonus={hasCompassRadar ? 18 : 0}
        goldenAura={hasGoldenAura}
      />

      {gameState === 'TITLE_MENU' && (
        <TitleScreen
          initialName={playerName}
          initialColor={playerColor}
          onStartGame={handleStartGame}
        />
      )}

      {gameState !== 'TITLE_MENU' && (
        <GameHUD
          playerName={playerName}
          playerColor={playerColor}
          playerPosRef={playerPosRef}
          currentZoneName={currentZoneName}
          progress={progress}
          nearestPoi={nearestPoi}
          waypointPin={waypointPin}
          transportMode={transportMode}
          activeRide={activeRide}
          activeGig={activeGig}
          onCancelRide={handleRideCancel}
          onCancelGig={handleCancelGig}
          onNavigateGig={(dest) => {
            setTransportInitialDest(dest);
            setTransportOpen(true);
          }}
          onClearWaypoint={() => setWaypointPin(null)}
          onInteractPoi={handleInteractPoi}
          onOpenEarn={() => setEarnOpen(true)}
          onOpenTransport={() => {
            setTransportInitialDest(null);
            setTransportOpen(true);
          }}
          onOpen3DSights={() => {
            setShowcaseInitialItem(null);
            setShowcaseOpen(true);
          }}
          onOpenDirectory={() => setDirectoryOpen(true)}
          onOpenPassport={() => setPassportOpen(true)}
          onOpenLevelModal={() => setLevelModalOpen(true)}
          onOpenPhotoMode={handleCapturePhoto}
          onOpenPause={() => setGameState('PAUSED')}
          onMapClickNavigate={handleMapClickNavigate}
          muted={muted}
          onToggleMute={handleToggleMute}
          onZoom={(delta) => {
            zoomDeltaRef.current = delta;
          }}
          roomCode={activeRoomCode}
          connectionStatus={connectionStatus}
          remotePlayers={remotePlayersList}
          remotePlayersMapRef={remotePlayersMapRef}
          chatMessages={chatMessages}
          onSendChat={sendChat}
          onSendEmote={sendEmote}
          toastText={toastText}
          touchMoveVectorRef={touchMoveVectorRef}
          weather={weather}
          weatherAutoCycle={weatherAutoCycle}
          weatherSecondsLeft={weatherSecondsLeft}
          onSelectWeather={handleSelectWeather}
          onToggleWeatherAuto={() => setWeatherAutoCycle((v) => !v)}
          radioStationId={radioStationId}
          radioPlaying={radioPlaying}
          radioAutoTune={radioAutoTune}
          radioVolume={radioVolume}
          onToggleRadio={() => setRadioPlaying((v) => !v)}
          onSelectRadioStation={handleSelectRadioStation}
          onStepRadioStation={handleStepRadioStation}
          onToggleRadioAutoTune={handleToggleRadioAutoTune}
          onChangeRadioVolume={setRadioVolume}
        />
      )}

      {photoSnapshotUrl && (
        <PhotoModeModal
          rawSnapshotUrl={photoSnapshotUrl}
          zoneName={currentZoneName}
          playerName={playerName}
          weather={weather}
          onRetake={handleCapturePhoto}
          onSaved={(style) => {
            setProgress((prev) => ({ ...prev, xp: prev.xp + XP_REWARDS.savePhoto }));
            showToast(
              style === 'postcard'
                ? `Saved Dilli Darshan postcard PNG (+${XP_REWARDS.savePhoto} XP)!`
                : `Saved Dilli Darshan watermarked snapshot (+${XP_REWARDS.savePhoto} XP)!`
            );
          }}
          onClose={() => setPhotoSnapshotUrl(null)}
        />
      )}

      {levelModalOpen && (
        <ExplorerLevelModal
          xp={progress.xp}
          equippedTitle={progress.equippedTitle}
          onEquipTitle={(title) => {
            soundEngine.playCoin();
            setProgress((prev) => ({ ...prev, equippedTitle: title }));
            showToast(`Equipped title: ${title}`);
          }}
          onClose={() => setLevelModalOpen(false)}
        />
      )}

      {showcaseOpen && (
        <Landmark3DModal
          initialItem={showcaseInitialItem}
          playerX={playerPosRef.current.x}
          playerY={playerPosRef.current.y}
          onPinWaypoint={handlePinWaypoint}
          onRideHere={(dest) => {
            setTransportInitialDest(dest);
            setTransportOpen(true);
          }}
          onClose={() => {
            setShowcaseOpen(false);
            setShowcaseInitialItem(null);
          }}
        />
      )}

      {earnOpen && (
        <EarnMoneyModal
          playerX={playerPosRef.current.x}
          playerY={playerPosRef.current.y}
          progress={progress}
          activeGig={activeGig}
          availableGigs={availableGigs}
          onRefreshGigs={handleRefreshGigs}
          onAcceptGig={handleAcceptGig}
          onCancelGig={handleCancelGig}
          onNavigateToGigTarget={(dest) => {
            setEarnOpen(false);
            setTransportInitialDest(dest);
            setTransportOpen(true);
          }}
          onClaimDailyStipend={handleClaimDailyStipend}
          onSolveTriviaQuestion={handleSolveCityTrivia}
          onCompleteChaiShift={handleCompleteChaiShift}
          onClose={() => setEarnOpen(false)}
        />
      )}

      {transportOpen && (
        <TransportModal
          playerX={playerPosRef.current.x}
          playerY={playerPosRef.current.y}
          rupees={progress.rupees}
          currentMode={transportMode}
          weather={weather}
          hasFareSaver={hasFareSaver}
          initialDestination={transportInitialDest}
          onBookRide={handleBookRide}
          onSwitchFreeRoamMode={handleSwitchFreeRoamMode}
          onClose={() => {
            setTransportOpen(false);
            setTransportInitialDest(null);
          }}
        />
      )}

      {directoryOpen && (
        <DirectoryModal
          onClose={() => setDirectoryOpen(false)}
          onPinWaypoint={handlePinWaypoint}
          onSelectRide={(dest) => {
            setTransportInitialDest(dest);
            setTransportOpen(true);
          }}
          onOpen3D={(item) => {
            setShowcaseInitialItem(item ?? null);
            setShowcaseOpen(true);
          }}
          progress={progress}
        />
      )}

      {passportOpen && (
        <PassportModal progress={progress} onClose={() => setPassportOpen(false)} />
      )}

      {activeMetro && (
        <MetroModal
          station={activeMetro}
          rupees={progress.rupees}
          hasFareSaver={hasFareSaver}
          onTravel={handleMetroTravel}
          onOpen3D={(item) => {
            setActiveMetro(null);
            setShowcaseInitialItem(item);
            setShowcaseOpen(true);
          }}
          onClose={() => setActiveMetro(null)}
        />
      )}

      {activeRestaurant && (
        <RestaurantModal
          restaurant={activeRestaurant}
          progress={progress}
          onOrderDish={handleOrderDish}
          onOpen3D={(item) => {
            setActiveRestaurant(null);
            setShowcaseInitialItem(item);
            setShowcaseOpen(true);
          }}
          onClose={() => setActiveRestaurant(null)}
        />
      )}

      {activeMall && (
        <MallModal
          mall={activeMall}
          progress={progress}
          onBuyMallItem={handleBuyMallItem}
          onClose={() => setActiveMall(null)}
        />
      )}

      {activeHeritage && (
        <HeritageModal
          site={activeHeritage}
          progress={progress}
          onStamp={handleStampHeritage}
          onSolveTrivia={handleSolveTrivia}
          onOpen3D={(item) => {
            setActiveHeritage(null);
            setShowcaseInitialItem(item);
            setShowcaseOpen(true);
          }}
          onClose={() => setActiveHeritage(null)}
        />
      )}

      {activeNpc && (
        <NpcModal
          npc={activeNpc}
          onSayThanks={(npc) => {
            soundEngine.playChatPing();
            selfSpeechRef.current = {
              text: `Shukriya, ${npc.name}!`,
              expiresAt: performance.now() + 2600,
            };
            const isFirstTalk = !(progress.talkedNpcIds ?? []).includes(npc.id);
            if (isFirstTalk) {
              setProgress((prev) => {
                const seen = prev.talkedNpcIds ?? [];
                if (seen.includes(npc.id)) return prev;
                return {
                  ...prev,
                  xp: prev.xp + XP_REWARDS.talkNpc,
                  talkedNpcIds: [...seen, npc.id],
                };
              });
              showToast(`Local insight from ${npc.name} (+${XP_REWARDS.talkNpc} XP)`);
            }
            setActiveNpc(null);
          }}
          onClose={() => setActiveNpc(null)}
        />
      )}

      {gameState === 'PAUSED' && (
        <PauseModal
          roomCode={activeRoomCode}
          onResume={() => setGameState('PLAYING')}
          onSwitchRoom={handleSwitchRoom}
          onExitToTitle={handleExitToTitle}
        />
      )}

      {metroTransitLabel && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#1E293B]/60 p-4">
          <div className="bg-[#FFFDF9] border border-[#E2D5C3] rounded-2xl px-6 py-4 shadow-lg text-sm font-semibold text-[#1E293B]">
            {metroTransitLabel}
          </div>
        </div>
      )}
    </div>
  );
}
