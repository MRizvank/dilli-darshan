import React, { useEffect, useRef } from 'react';
import {
  HERITAGE_SITES,
  METRO_LINES,
  METRO_LINE_META,
  METRO_STATIONS,
  PLACE_ZONES,
  RESTAURANTS,
  ROAMING_NPCS,
  SHOPPING_MALLS,
  TRANSPORT_OPTIONS,
  WEATHER_CONFIGS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  getNearestPlace,
} from '../data/delhiWorld';
import type {
  ActiveGigState,
  ActivePoiTarget,
  GameState,
  HeritageSite,
  NpcCharacter,
  Particle,
  RemotePlayer,
  RideDispatchTarget,
  ShoppingMallSpot,
  TransportMode,
  WaypointPin,
  WeatherType,
} from '../types/game';

interface WorldCanvasProps {
  gameState: GameState;
  playerName: string;
  playerColor: string;
  playerPosRef: React.MutableRefObject<{ x: number; y: number; facing: number }>;
  energyRef: React.MutableRefObject<number>;
  transportMode: TransportMode;
  activeRide: RideDispatchTarget | null;
  activeGig: ActiveGigState | null;
  onGigStepReached: (gigId: string, stage: 'pickup' | 'dropoff') => void;
  onRideComplete: (ride: RideDispatchTarget) => void;
  onRideCancel: () => void;
  onConsumeEnergy: (delta: number) => void;
  onZoneChange: (zoneId: string, zoneName: string) => void;
  onNearestPoiChange: (poi: ActivePoiTarget | null) => void;
  onInteractPoi: (poi: ActivePoiTarget) => void;
  onMoveBroadcast: (
    x: number,
    y: number,
    facing: number,
    zoneName: string,
    force?: boolean,
    vehicle?: TransportMode
  ) => void;
  remotePlayersMapRef: React.MutableRefObject<Map<string, RemotePlayer>>;
  selfSpeechRef: React.MutableRefObject<{ text: string; expiresAt: number } | null>;
  stampedHeritages: string[];
  tastedRestaurants: string[];
  visitedMalls: string[];
  waypointPin: WaypointPin | null;
  particleTriggerRef: React.MutableRefObject<((x: number, y: number, color: string, count?: number) => void) | null>;
  cameraSnapTriggerRef: React.MutableRefObject<(() => void) | null>;
  photoCaptureRef: React.MutableRefObject<(() => string | null) | null>;
  mapNavigateTargetRef: React.MutableRefObject<{ x: number; y: number } | null>;
  zoomDeltaRef: React.MutableRefObject<number>;
  touchMoveVectorRef: React.MutableRefObject<{ dx: number; dy: number; sprint: boolean }>;
  isModalOpen: boolean;
  weather: WeatherType;
  sprintDrainMult?: number;
  speedBonusMult?: number;
  interactRadiusBonus?: number;
  goldenAura?: boolean;
}

const INTERACT_RADIUS = 88;

const YAMUNA_POINTS: Array<[number, number]> = [
  [2480, -60],
  [2540, 280],
  [2450, 680],
  [2580, 1080],
  [2760, 1460],
  [2720, 1860],
  [2840, 2240],
  [2980, 2680],
  [3080, 3460],
];

const PARK_AREAS = [
  { x: 1780, y: 540, rx: 175, ry: 115 },
  { x: 1960, y: 2040, rx: 165, ry: 115 },
  { x: 1660, y: 1840, rx: 135, ry: 95 },
  { x: 1680, y: 2430, rx: 130, ry: 95 },
  { x: 2960, y: 2260, rx: 150, ry: 110 },
  { x: 1460, y: 2660, rx: 175, ry: 120 },
  { x: 640, y: 1720, rx: 140, ry: 95 },
  { x: 900, y: 660, rx: 135, ry: 90 },
];

const ROAD_SEGMENTS: Array<{ pts: Array<[number, number]>; width: number; color?: string }> = [
  // North & Old Delhi Spine
  { pts: [[1960, 440], [1940, 910], [2250, 990]], width: 16 },
  { pts: [[920, 480], [1520, 480], [1960, 480], [2580, 680], [3140, 620]], width: 14 },
  // Central Spine: Old Delhi -> CP -> India Gate -> Lodhi -> HKV -> Saket -> Qutub
  { pts: [[1930, 910], [1900, 1450], [1940, 1730], [1930, 2040], [1820, 2380], [1720, 2680]], width: 18 },
  // Kartavya Path ceremonial axis
  { pts: [[1860, 1730], [2240, 1730]], width: 26, color: '#E2C9AE' },
  // Ring Road & West Delhi
  { pts: [[480, 1520], [1120, 1260], [1900, 1450], [2430, 1970], [2600, 2380], [1820, 2380]], width: 16 },
  { pts: [[560, 1520], [1060, 1960], [1460, 1760], [1900, 1450]], width: 15 },
  // Cross-Yamuna Bridges & East/Noida NCR
  { pts: [[1960, 480], [2540, 480], [2940, 660]], width: 14 },
  { pts: [[2180, 1460], [2740, 1380], [2920, 1520], [3440, 1960], [3980, 1900]], width: 16 },
  { pts: [[2430, 1970], [2860, 1960], [3540, 1960]], width: 15 },
  // Mathura Road to Faridabad
  { pts: [[2430, 1970], [2630, 2420], [2980, 2920]], width: 15 },
  // NH-48 to Gurugram CyberHub
  { pts: [[1460, 1760], [1120, 1960], [960, 2660], [780, 2860], [1720, 2680]], width: 17 },
];

export const WorldCanvas: React.FC<WorldCanvasProps> = ({
  gameState,
  playerName,
  playerColor,
  playerPosRef,
  energyRef,
  transportMode,
  activeRide,
  activeGig,
  onGigStepReached,
  onRideComplete,
  onRideCancel,
  onConsumeEnergy,
  onZoneChange,
  onNearestPoiChange,
  onInteractPoi,
  onMoveBroadcast,
  remotePlayersMapRef,
  selfSpeechRef,
  stampedHeritages,
  tastedRestaurants,
  visitedMalls,
  waypointPin,
  particleTriggerRef,
  cameraSnapTriggerRef,
  photoCaptureRef,
  mapNavigateTargetRef,
  zoomDeltaRef,
  touchMoveVectorRef,
  isModalOpen,
  weather,
  sprintDrainMult = 1,
  speedBonusMult = 1,
  interactRadiusBonus = 0,
  goldenAura = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const propsRef = useRef({
    gameState,
    playerName,
    playerColor,
    transportMode,
    activeRide,
    activeGig,
    onGigStepReached,
    onRideComplete,
    onRideCancel,
    onConsumeEnergy,
    onZoneChange,
    onNearestPoiChange,
    onInteractPoi,
    onMoveBroadcast,
    stampedHeritages,
    tastedRestaurants,
    visitedMalls,
    waypointPin,
    isModalOpen,
    weather,
    sprintDrainMult,
    speedBonusMult,
    interactRadiusBonus,
    goldenAura,
  });
  propsRef.current = {
    gameState,
    playerName,
    playerColor,
    transportMode,
    activeRide,
    activeGig,
    onGigStepReached,
    onRideComplete,
    onRideCancel,
    onConsumeEnergy,
    onZoneChange,
    onNearestPoiChange,
    onInteractPoi,
    onMoveBroadcast,
    stampedHeritages,
    tastedRestaurants,
    visitedMalls,
    waypointPin,
    isModalOpen,
    weather,
    sprintDrainMult,
    speedBonusMult,
    interactRadiusBonus,
    goldenAura,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const heldKeys = new Set<string>();
    const particles: Particle[] = [];
    let walkTarget: { x: number; y: number } | null = null;
    let cameraX = playerPosRef.current.x;
    let cameraY = playerPosRef.current.y;
    let zoom = 0.9;
    let targetZoom = 0.9;
    let lastZoneId = '';
    let lastPoiKey = '';
    let lastGigStepKey = '';
    let nearestPoi: ActivePoiTarget | null = null;
    let walkPhase = 0;

    // Weather interpolation weights & screen-space atmospheric pools
    let sunnyWeight = propsRef.current.weather === 'sunny' ? 1 : 0;
    let smogWeight = propsRef.current.weather === 'smoggy' ? 1 : 0;
    let rainWeight = propsRef.current.weather === 'monsoon' ? 1 : 0;
    let lightningTimer = 7.5;
    let lightningFlash = 0;

    const rainDrops = Array.from({ length: 190 }, () => ({
      nx: Math.random(),
      ny: Math.random(),
      len: 14 + Math.random() * 18,
      speed: 0.72 + Math.random() * 0.45,
      alpha: 0.28 + Math.random() * 0.36,
      width: Math.random() > 0.7 ? 1.5 : 1,
    }));

    const rainSplashes = Array.from({ length: 28 }, () => ({
      nx: Math.random(),
      ny: Math.random(),
      phase: Math.random(),
      speed: 1.4 + Math.random() * 1.1,
    }));

    const smogWisps = Array.from({ length: 16 }, (_, i) => ({
      nx: (i / 16) + Math.random() * 0.06,
      ny: 0.08 + Math.random() * 0.84,
      rx: 0.16 + Math.random() * 0.18,
      ry: 0.07 + Math.random() * 0.08,
      speed: 0.012 + Math.random() * 0.016,
      alpha: 0.08 + Math.random() * 0.08,
    }));

    const parkTrees: Array<{ x: number; y: number; r: number; shade: string }> = [];
    for (let i = 0; i < PARK_AREAS.length; i++) {
      const p = PARK_AREAS[i];
      for (let j = 0; j < 18; j++) {
        const angle = (j * 2.39996 + i) % (Math.PI * 2);
        const distFactor = 0.25 + ((j * 37) % 65) / 100;
        parkTrees.push({
          x: p.x + Math.cos(angle) * p.rx * distFactor,
          y: p.y + Math.sin(angle) * p.ry * distFactor,
          r: 10 + ((j * 7) % 8),
          shade: j % 2 === 0 ? '#4D7C5B' : '#3F6A4C',
        });
      }
    }

    interface NpcRuntimeState {
      npc: NpcCharacter;
      x: number;
      y: number;
      facing: number;
      waypointIdx: number;
      pauseTimer: number;
      walkPhase: number;
    }

    const npcStates: NpcRuntimeState[] = ROAMING_NPCS.map((npc, idx) => {
      const start = npc.waypoints[0];
      const next = npc.waypoints[1] ?? start;
      return {
        npc,
        x: start.x,
        y: start.y,
        facing: Math.atan2(next.y - start.y, next.x - start.x),
        waypointIdx: 1 % npc.waypoints.length,
        pauseTimer: (idx % 3) * 0.65,
        walkPhase: idx * 0.9,
      };
    });

    particleTriggerRef.current = (px: number, py: number, color: string, count = 18) => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const speed = 50 + Math.random() * 140;
        particles.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 20,
          life: 0,
          maxLife: 0.45 + Math.random() * 0.4,
          color,
          size: 3 + Math.random() * 4,
        });
      }
    };

    cameraSnapTriggerRef.current = () => {
      cameraX = playerPosRef.current.x;
      cameraY = playerPosRef.current.y;
      walkTarget = null;
    };

    photoCaptureRef.current = () => {
      try {
        return canvas.toDataURL('image/png');
      } catch {
        return null;
      }
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const isTextInputFocused = () => {
      const active = document.activeElement;
      if (!active) return false;
      const tag = active.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || (active as HTMLElement).isContentEditable;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isTextInputFocused()) return;
      const key = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        if (propsRef.current.gameState === 'PLAYING' && !propsRef.current.isModalOpen) {
          e.preventDefault();
        }
      }
      heldKeys.add(key);

      if (key === 'e' && propsRef.current.gameState === 'PLAYING' && !propsRef.current.isModalOpen) {
        if (nearestPoi) {
          propsRef.current.onInteractPoi(nearestPoi);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      heldKeys.delete(e.key.toLowerCase());
    };

    const onBlur = () => {
      heldKeys.clear();
    };

    const onWheel = (e: WheelEvent) => {
      if (propsRef.current.gameState !== 'PLAYING' || propsRef.current.isModalOpen) return;
      targetZoom = Math.max(0.45, Math.min(1.55, targetZoom - e.deltaY * 0.0008));
    };

    const onPointerDown = (e: PointerEvent) => {
      if (propsRef.current.gameState !== 'PLAYING' || propsRef.current.isModalOpen) return;
      if (e.button !== 0) return;

      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const worldX = (sx - rect.width / 2) / zoom + cameraX;
      const worldY = (sy - rect.height / 2) / zoom + cameraY;

      const allPois = [
        ...METRO_STATIONS.map((m) => ({ kind: 'metro' as const, id: m.id, name: m.name, x: m.x, y: m.y })),
        ...HERITAGE_SITES.map((h) => ({ kind: 'heritage' as const, id: h.id, name: h.name, x: h.x, y: h.y })),
        ...RESTAURANTS.map((r) => ({ kind: 'restaurant' as const, id: r.id, name: r.name, x: r.x, y: r.y })),
        ...SHOPPING_MALLS.map((m) => ({ kind: 'mall' as const, id: m.id, name: m.name, x: m.x, y: m.y })),
      ];

      for (const poi of allPois) {
        if (Math.hypot(poi.x - worldX, poi.y - worldY) < 42) {
          const playerDist = Math.hypot(poi.x - playerPosRef.current.x, poi.y - playerPosRef.current.y);
          if (playerDist <= INTERACT_RADIUS + 20) {
            propsRef.current.onInteractPoi({ ...poi, distance: playerDist });
            return;
          }
          walkTarget = { x: poi.x, y: poi.y + 30 };
          return;
        }
      }

      for (const npcState of npcStates) {
        if (Math.hypot(npcState.x - worldX, npcState.y - worldY) < 32) {
          const playerDist = Math.hypot(
            npcState.x - playerPosRef.current.x,
            npcState.y - playerPosRef.current.y
          );
          if (playerDist <= INTERACT_RADIUS + 18) {
            propsRef.current.onInteractPoi({
              kind: 'npc',
              id: npcState.npc.id,
              name: npcState.npc.name,
              x: npcState.x,
              y: npcState.y,
              distance: playerDist,
            });
            return;
          }
          walkTarget = { x: npcState.x, y: npcState.y + 24 };
          return;
        }
      }

      walkTarget = {
        x: Math.max(60, Math.min(WORLD_WIDTH - 60, worldX)),
        y: Math.max(60, Math.min(WORLD_HEIGHT - 60, worldY)),
      };
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    canvas.addEventListener('wheel', onWheel, { passive: true });
    canvas.addEventListener('pointerdown', onPointerDown);

    const drawHeritageSilhouette = (site: HeritageSite, isStamped: boolean, pulse: number) => {
      ctx.save();
      ctx.translate(site.x, site.y);

      ctx.fillStyle = isStamped ? '#FEF3C7' : '#EFE2CE';
      ctx.strokeStyle = isStamped ? '#B45309' : '#9A7B56';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-34, -30, 68, 60, 10);
      ctx.fill();
      ctx.stroke();

      switch (site.silhouette) {
        case 'redfort': {
          ctx.fillStyle = '#B93829';
          ctx.fillRect(-24, -20, 48, 40);
          ctx.fillStyle = '#D96B43';
          ctx.fillRect(-18, -14, 36, 28);
          ctx.fillStyle = '#FFFDF9';
          ctx.beginPath();
          ctx.arc(-8, 0, 5, 0, Math.PI * 2);
          ctx.arc(8, 0, 5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'jamamasjid': {
          ctx.fillStyle = '#991B1B';
          ctx.fillRect(-22, -18, 44, 36);
          ctx.fillStyle = '#FAF5EE';
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.arc(-13, -6, 6, 0, Math.PI * 2);
          ctx.arc(13, -6, 6, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'indiagate': {
          ctx.fillStyle = '#D99B66';
          ctx.fillRect(-20, -10, 40, 20);
          ctx.fillStyle = '#573D28';
          ctx.fillRect(-7, -10, 14, 20);
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(0, 0, 4 + pulse * 1.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'baoli': {
          ctx.fillStyle = '#78716C';
          ctx.fillRect(-16, -22, 32, 44);
          ctx.fillStyle = '#475569';
          ctx.fillRect(-10, -16, 20, 32);
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(-7, 2, 14, 12);
          break;
        }
        case 'humayun': {
          ctx.fillStyle = '#6B8F71';
          ctx.fillRect(-26, -22, 52, 44);
          ctx.fillStyle = '#C84B31';
          ctx.fillRect(-14, -14, 28, 28);
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'lodhi': {
          ctx.fillStyle = '#5E8C6A';
          ctx.beginPath();
          ctx.arc(0, 0, 24, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#A88C71';
          ctx.beginPath();
          ctx.arc(0, 0, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#57534E';
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'hauzkhas': {
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(-6, 4, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#92400E';
          ctx.fillRect(2, -20, 20, 28);
          break;
        }
        case 'qutub': {
          ctx.fillStyle = '#D6C7B2';
          ctx.beginPath();
          ctx.arc(0, 0, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(30, 41, 59, 0.25)';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(26, -14);
          ctx.lineTo(29, -8);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#B93829';
          ctx.beginPath();
          ctx.arc(0, 0, 11, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'lotus': {
          ctx.fillStyle = '#BAE6FD';
          ctx.beginPath();
          ctx.arc(0, 0, 24, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = 1;
          for (let p = 0; p < 9; p++) {
            const ang = (p * Math.PI * 2) / 9;
            ctx.beginPath();
            ctx.ellipse(Math.cos(ang) * 9, Math.sin(ang) * 9, 9, 4.5, ang, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
          break;
        }
        case 'akshardham': {
          ctx.fillStyle = '#FBCFE8';
          ctx.fillRect(-24, -20, 48, 40);
          ctx.fillStyle = '#DB2777';
          ctx.fillRect(-14, -12, 28, 24);
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
      }

      if (isStamped) {
        ctx.fillStyle = '#15803D';
        ctx.beginPath();
        ctx.arc(24, -22, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, -22);
        ctx.lineTo(23, -19);
        ctx.lineTo(28, -25);
        ctx.stroke();
      }

      ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1E293B';
      ctx.fillText(site.name, 0, 44);
      ctx.restore();
    };

    const drawMallComplex = (mall: ShoppingMallSpot, visited: boolean) => {
      ctx.save();
      ctx.translate(mall.x, mall.y);

      // Architectural mall atrium base
      ctx.fillStyle = visited ? '#EFF6FF' : '#F8FAFC';
      ctx.strokeStyle = '#0369A1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-30, -22, 60, 44, 10);
      ctx.fill();
      ctx.stroke();

      // Glass skylight roof pattern
      ctx.fillStyle = '#BAE6FD';
      ctx.beginPath();
      ctx.roundRect(-20, -14, 40, 28, 6);
      ctx.fill();

      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(20, 0);
      ctx.moveTo(0, -14);
      ctx.lineTo(0, 14);
      ctx.stroke();

      // Shopping bag handle accent in center
      ctx.fillStyle = '#0369A1';
      ctx.beginPath();
      ctx.roundRect(-6, -5, 12, 11, 2);
      ctx.fill();

      if (visited) {
        ctx.fillStyle = '#15803D';
        ctx.beginPath();
        ctx.arc(23, -17, 7.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.font = '600 11.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#0C4A6E';
      ctx.textAlign = 'center';
      ctx.fillText(mall.name, 0, 35);
      ctx.restore();
    };

    const drawSpeechBubble = (x: number, y: number, text: string) => {
      ctx.save();
      ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
      const padX = 10;
      const metrics = ctx.measureText(text);
      const w = Math.min(210, metrics.width + padX * 2);
      const h = 26;
      const bx = x - w / 2;
      const by = y - 54;

      ctx.fillStyle = '#FFFDF9';
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(bx, by, w, h, 8);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x - 5, by + h);
      ctx.lineTo(x, by + h + 6);
      ctx.lineTo(x + 5, by + h);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#1E293B';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const clipped = text.length > 28 ? `${text.slice(0, 26)}…` : text;
      ctx.fillText(clipped, x, by + h / 2);
      ctx.restore();
    };

    const remoteWalkPhaseMap = new Map<string, number>();

    const getAvatarAccessoryStyle = (playerLabel: string): number => {
      let hash = 0;
      for (let i = 0; i < playerLabel.length; i++) {
        hash = (hash * 31 + playerLabel.charCodeAt(i)) | 0;
      }
      return Math.abs(hash) % 3; // 0: Explorer Cap, 1: Wide Sun Hat, 2: Bandana & Scarf
    };

    const lerpAngle = (a: number, b: number, t: number): number => {
      let diff = b - a;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      return a + diff * Math.min(1, t);
    };

    const drawTravelerAvatar = (
      x: number,
      y: number,
      facing: number,
      color: string,
      name: string,
      isSelf: boolean,
      phase: number,
      vehicle: TransportMode,
      nowMs: number,
      speech?: string
    ) => {
      ctx.save();
      ctx.translate(x, y);

      const isMoving = phase > 0.01;
      const idleBreath = !isMoving && vehicle === 'walk' ? Math.sin(nowMs * 0.0045) * 0.9 : 0;
      const walkBob =
        vehicle === 'walk'
          ? isMoving
            ? Math.abs(Math.sin(phase)) * -3.4
            : idleBreath
          : isMoving
            ? Math.sin(phase * 1.4) * 0.8
            : 0;

      // Ground shadow
      ctx.fillStyle = 'rgba(30, 41, 59, 0.2)';
      ctx.beginPath();
      if (vehicle === 'car') {
        ctx.ellipse(0, 8, 24, 13, facing, 0, Math.PI * 2);
      } else if (vehicle === 'auto') {
        ctx.ellipse(0, 7, 19, 11, facing, 0, Math.PI * 2);
      } else if (vehicle === 'bike') {
        ctx.ellipse(0, 7, 18, 9, facing, 0, Math.PI * 2);
      } else {
        const shadowScale = isMoving ? 1 - Math.abs(Math.sin(phase)) * 0.12 : 1;
        ctx.ellipse(0, 14, 12 * shadowScale, 5.2 * shadowScale, 0, 0, Math.PI * 2);
      }
      ctx.fill();

      if (isSelf) {
        if (propsRef.current.goldenAura) {
          const haloPulse = (Math.sin(nowMs * 0.005) + 1) * 0.5;
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.45 + haloPulse * 0.35})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(
            0,
            vehicle === 'walk' ? 2 : walkBob,
            (vehicle === 'walk' ? 24 : 31) + haloPulse * 2,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
        ctx.strokeStyle =
          vehicle === 'walk' ? 'rgba(200, 75, 49, 0.34)' : 'rgba(21, 128, 61, 0.36)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, vehicle === 'walk' ? 2 : walkBob, vehicle === 'walk' ? 20 : 27, 0, Math.PI * 2);
        ctx.stroke();

        // Crisp directional indicator on the ring when walking
        if (vehicle === 'walk') {
          ctx.save();
          ctx.translate(0, 2);
          ctx.rotate(facing);
          ctx.fillStyle = '#C84B31';
          ctx.beginPath();
          ctx.moveTo(23.5, 0);
          ctx.lineTo(17.5, -3.8);
          ctx.lineTo(17.5, 3.8);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      if (vehicle !== 'walk') {
        // Oriented top-down vehicle body (+X is facing direction)
        ctx.save();
        ctx.translate(0, walkBob);
        ctx.rotate(facing);

        if (vehicle === 'bike') {
          // Rapido Yellow-Black Motorcycle/Scooter
          ctx.fillStyle = 'rgba(254, 240, 138, 0.38)';
          ctx.beginPath();
          ctx.moveTo(16, 0);
          ctx.lineTo(38, -11);
          ctx.lineTo(38, 11);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.roundRect(10, -3.5, 9, 7, 3);
          ctx.roundRect(-17, -3.5, 9, 7, 3);
          ctx.fill();

          ctx.fillStyle = '#FACC15';
          ctx.strokeStyle = '#1E293B';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.roundRect(-13, -5.5, 25, 11, 4);
          ctx.fill();
          ctx.stroke();

          ctx.strokeStyle = '#1E293B';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(8, -9);
          ctx.lineTo(10, 0);
          ctx.lineTo(8, 9);
          ctx.stroke();

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.ellipse(-2, 0, 6.5, 8.5, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FACC15';
          ctx.strokeStyle = '#1E293B';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, 6.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#1E293B';
          ctx.beginPath();
          ctx.arc(2.5, 0, 3.8, -0.8, 0.8);
          ctx.fill();
        } else if (vehicle === 'auto') {
          // Delhi CNG Green-and-Yellow Auto Rickshaw
          ctx.fillStyle = 'rgba(254, 240, 138, 0.34)';
          ctx.beginPath();
          ctx.moveTo(18, 0);
          ctx.lineTo(42, -13);
          ctx.lineTo(42, 13);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#0F172A';
          ctx.fillRect(11, -3, 7, 6);
          ctx.fillRect(-15, -13, 7, 4);
          ctx.fillRect(-15, 9, 7, 4);

          ctx.fillStyle = '#15803D';
          ctx.strokeStyle = '#14532D';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.roundRect(-17, -12, 32, 24, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#BAE6FD';
          ctx.beginPath();
          ctx.roundRect(7, -8.5, 6.5, 17, 2.5);
          ctx.fill();

          ctx.fillStyle = '#FACC15';
          ctx.strokeStyle = '#CA8A04';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.roundRect(-15, -10.5, 21, 21, 4);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(15.5, 0, 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#EF4444';
          ctx.fillRect(-17.5, -9, 2, 4);
          ctx.fillRect(-17.5, 5, 2, 4);
        } else {
          // NCR AC Cab Sedan
          ctx.fillStyle = 'rgba(254, 240, 138, 0.32)';
          ctx.beginPath();
          ctx.moveTo(22, -7);
          ctx.lineTo(48, -16);
          ctx.lineTo(48, 16);
          ctx.lineTo(22, 7);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#0F172A';
          ctx.fillRect(9, -14.5, 8, 3.5);
          ctx.fillRect(9, 11, 8, 3.5);
          ctx.fillRect(-15, -14.5, 8, 3.5);
          ctx.fillRect(-15, 11, 8, 3.5);

          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.roundRect(-22, -13, 44, 26, 7);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#F1F5F9';
          ctx.fillRect(8, -10, 11, 20);

          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.roundRect(4, -9.5, 6.5, 19, 2);
          ctx.roundRect(-15, -9, 5, 18, 2);
          ctx.fill();

          ctx.fillStyle = '#E2E8F0';
          ctx.beginPath();
          ctx.roundRect(-10, -9, 14, 18, 3);
          ctx.fill();

          ctx.fillStyle = '#EAB308';
          ctx.strokeStyle = '#1E293B';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(-4.5, -4, 5, 8, 1.5);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#FEF08A';
          ctx.fillRect(20.5, -10, 2, 4.5);
          ctx.fillRect(20.5, 5.5, 2, 4.5);
          ctx.fillStyle = '#EF4444';
          ctx.fillRect(-22.5, -10, 2, 4.5);
          ctx.fillRect(-22.5, 5.5, 2, 4.5);
        }
        ctx.restore();
      } else {
        // Upright 3/4 Animated Explorer Character driven by movement vector (facing)
        const dirX = Math.cos(facing);
        const dirY = Math.sin(facing);
        const absX = Math.abs(dirX);
        const absY = Math.abs(dirY);
        const orientation: 'side' | 'up' | 'down' =
          absX >= absY * 0.9 ? 'side' : dirY < 0 ? 'up' : 'down';
        const flipX = orientation === 'side' && dirX < 0 ? -1 : 1;

        const accessory = getAvatarAccessoryStyle(name);
        const stride = isMoving ? Math.sin(phase) : 0;
        const liftL = isMoving ? Math.max(0, Math.cos(phase)) * 2.4 : 0;
        const liftR = isMoving ? Math.max(0, -Math.cos(phase)) * 2.4 : 0;
        const armSwing = isMoving ? -stride * 5.2 : 0;
        const swayTilt = isMoving ? stride * 0.06 : 0;

        ctx.save();
        ctx.translate(0, walkBob);
        ctx.scale(flipX, 1);
        ctx.rotate(swayTilt);

        if (orientation === 'side') {
          // Side-view walking cycle sprite
          // Back arm (behind torso)
          ctx.fillStyle = color;
          ctx.strokeStyle = '#1E293B';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.roundRect(-2.5 - armSwing * 0.75, -5, 4.5, 9.5, 2.2);
          ctx.fill();
          ctx.stroke();

          // Explorer backpack (on back)
          ctx.fillStyle = '#7C5A3C';
          ctx.strokeStyle = '#451A03';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.roundRect(-10.5, -7, 6.2, 12.5, 2.5);
          ctx.fill();
          ctx.stroke();

          // Back leg + shoe
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.roundRect(-2.8 - stride * 4.8, 3.5 - liftR * 0.7, 4.8, 8.5, 2);
          ctx.fill();
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.roundRect(-3.2 - stride * 4.8, 10.5 - liftR * 0.7, 6.8, 3.4, 1.5);
          ctx.fill();

          // Front leg + shoe
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.roundRect(-1.8 + stride * 4.8, 3.5 - liftL * 0.7, 4.8, 8.5, 2);
          ctx.fill();
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.roundRect(-2.2 + stride * 4.8, 10.5 - liftL * 0.7, 6.8, 3.4, 1.5);
          ctx.fill();

          // Torso / Jacket
          ctx.fillStyle = color;
          ctx.strokeStyle = '#FFFDF9';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.roundRect(-6, -7.5, 11.5, 13, 4.5);
          ctx.fill();
          ctx.stroke();

          // Scarf tail fluttering behind
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.moveTo(-4, -6.5);
          ctx.quadraticCurveTo(-11 - (isMoving ? 3 : 0), -5 + stride * 1.5, -13 - (isMoving ? 3 : 0), -2 + stride * 2);
          ctx.lineTo(-4, -3.5);
          ctx.closePath();
          ctx.fill();

          // Front swinging arm + hand
          ctx.fillStyle = color;
          ctx.strokeStyle = '#1E293B';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.roundRect(-1.5 + armSwing * 0.85, -4.5, 4.6, 9.5, 2.2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#E0AC69';
          ctx.beginPath();
          ctx.arc(0.8 + armSwing * 0.85, 5.2, 2.1, 0, Math.PI * 2);
          ctx.fill();

          // Head (side profile)
          ctx.fillStyle = '#E0AC69';
          ctx.strokeStyle = '#1E293B';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.arc(0.5, -13.5, 6.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Eye looking forward
          ctx.fillStyle = '#1E293B';
          ctx.beginPath();
          ctx.arc(4.2, -13.6, 1.25, 0, Math.PI * 2);
          ctx.fill();

          // Unique headwear
          if (accessory === 0) {
            ctx.fillStyle = color;
            ctx.strokeStyle = '#1E293B';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(0.2, -15, 6.6, Math.PI, 0);
            ctx.fill();
            ctx.stroke();
            // Forward cap visor
            ctx.fillStyle = '#1E293B';
            ctx.fillRect(3.5, -16.2, 6, 2.2);
          } else if (accessory === 1) {
            ctx.fillStyle = '#D97706';
            ctx.strokeStyle = '#78350F';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.ellipse(0.5, -16.8, 9.5, 2.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0.5, -17.4, 4.8, Math.PI, 0);
            ctx.fill();
            ctx.stroke();
          } else {
            // Hair + bandana
            ctx.fillStyle = '#1E293B';
            ctx.beginPath();
            ctx.arc(0, -14.8, 6.5, Math.PI * 0.9, Math.PI * 2.05);
            ctx.fill();
            ctx.fillStyle = '#F59E0B';
            ctx.fillRect(-5.8, -16.6, 12.2, 2.2);
          }
        } else if (orientation === 'down') {
          // Front-facing walking sprite
          // Left & Right Legs stepping
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.roundRect(-5.4, 3.5 + stride * 2.2 - liftL * 0.6, 4.4, 8.2, 2);
          ctx.roundRect(1, 3.5 - stride * 2.2 - liftR * 0.6, 4.4, 8.2, 2);
          ctx.fill();

          // Sneakers
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.roundRect(-5.8, 9.8 + stride * 2.2 - liftL * 0.6, 5.2, 3.4, 1.5);
          ctx.roundRect(0.6, 9.8 - stride * 2.2 - liftR * 0.6, 5.2, 3.4, 1.5);
          ctx.fill();

          // Swinging Arms
          ctx.fillStyle = color;
          ctx.strokeStyle = '#1E293B';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.roundRect(-9.5, -5.5 + armSwing * 0.45, 4, 9.5, 2);
          ctx.roundRect(5.5, -5.5 - armSwing * 0.45, 4, 9.5, 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#E0AC69';
          ctx.beginPath();
          ctx.arc(-7.5, 4.6 + armSwing * 0.45, 1.9, 0, Math.PI * 2);
          ctx.arc(7.5, 4.6 - armSwing * 0.45, 1.9, 0, Math.PI * 2);
          ctx.fill();

          // Torso + collar
          ctx.fillStyle = color;
          ctx.strokeStyle = '#FFFDF9';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.roundRect(-6.5, -7.5, 13, 12.8, 4.5);
          ctx.fill();
          ctx.stroke();

          // Scarf collar
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.roundRect(-4.5, -7.2, 9, 3.4, 1.5);
          ctx.fill();

          // Head & Face
          ctx.fillStyle = '#E0AC69';
          ctx.strokeStyle = '#1E293B';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.arc(0, -13.5, 6.7, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Eyes
          ctx.fillStyle = '#1E293B';
          ctx.beginPath();
          ctx.arc(-2.3, -13.2, 1.15, 0, Math.PI * 2);
          ctx.arc(2.3, -13.2, 1.15, 0, Math.PI * 2);
          ctx.fill();

          // Unique Headwear
          if (accessory === 0) {
            ctx.fillStyle = color;
            ctx.strokeStyle = '#1E293B';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(0, -15.2, 6.6, Math.PI, 0);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#1E293B';
            ctx.beginPath();
            ctx.roundRect(-5, -16.4, 10, 2.2, 1);
            ctx.fill();
          } else if (accessory === 1) {
            ctx.fillStyle = '#D97706';
            ctx.strokeStyle = '#78350F';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.ellipse(0, -16.8, 9.6, 2.6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, -17.4, 4.8, Math.PI, 0);
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.fillStyle = '#1E293B';
            ctx.beginPath();
            ctx.arc(0, -15, 6.5, Math.PI, 0);
            ctx.fill();
            ctx.fillStyle = '#F59E0B';
            ctx.fillRect(-6.2, -16.6, 12.4, 2.2);
          }
        } else {
          // Back-facing (Up / North) walking sprite
          // Legs stepping
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.roundRect(-5.4, 3.5 - stride * 2.2 - liftL * 0.6, 4.4, 8.2, 2);
          ctx.roundRect(1, 3.5 + stride * 2.2 - liftR * 0.6, 4.4, 8.2, 2);
          ctx.fill();

          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.roundRect(-5.8, 9.8 - stride * 2.2 - liftL * 0.6, 5.2, 3.4, 1.5);
          ctx.roundRect(0.6, 9.8 + stride * 2.2 - liftR * 0.6, 5.2, 3.4, 1.5);
          ctx.fill();

          // Swinging Arms
          ctx.fillStyle = color;
          ctx.strokeStyle = '#1E293B';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.roundRect(-9.5, -5.5 - armSwing * 0.45, 4, 9.5, 2);
          ctx.roundRect(5.5, -5.5 + armSwing * 0.45, 4, 9.5, 2);
          ctx.fill();
          ctx.stroke();

          // Jacket
          ctx.fillStyle = color;
          ctx.strokeStyle = '#FFFDF9';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.roundRect(-6.5, -7.5, 13, 12.8, 4.5);
          ctx.fill();
          ctx.stroke();

          // Explorer Backpack visible on back!
          ctx.fillStyle = '#7C5A3C';
          ctx.strokeStyle = '#451A03';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.roundRect(-5.2, -6.2, 10.4, 10.5, 3);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#B45309';
          ctx.fillRect(-3.8, -1.5, 7.6, 2);

          // Back of head / Hair
          ctx.fillStyle = '#1E293B';
          ctx.beginPath();
          ctx.arc(0, -13.5, 6.7, 0, Math.PI * 2);
          ctx.fill();

          if (accessory === 0) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, -14.8, 6.6, Math.PI, 0);
            ctx.fill();
          } else if (accessory === 1) {
            ctx.fillStyle = '#D97706';
            ctx.strokeStyle = '#78350F';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.ellipse(0, -16.8, 9.6, 2.6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, -17.4, 4.8, Math.PI, 0);
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.fillStyle = '#F59E0B';
            ctx.fillRect(-6.2, -15.8, 12.4, 2.2);
          }
        }

        ctx.restore();
      }

      // Player Name Tag
      ctx.font = isSelf ? '700 12px "Plus Jakarta Sans", sans-serif' : '600 12px "Plus Jakarta Sans", sans-serif';
      const labelW = ctx.measureText(name).width + 12;
      const labelY = vehicle === 'walk' ? 20 : 22;
      ctx.fillStyle = isSelf ? 'rgba(30, 41, 59, 0.88)' : 'rgba(255, 253, 249, 0.9)';
      ctx.beginPath();
      ctx.roundRect(-labelW / 2, labelY, labelW, 19, 6);
      ctx.fill();

      ctx.fillStyle = isSelf ? '#FFFDF9' : '#1E293B';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, 0, labelY + 9.5);
      ctx.restore();

      if (speech) {
        drawSpeechBubble(x, y + walkBob - (vehicle === 'walk' ? 10 : 4), speech);
      }
    };

    const drawNpcCharacter = (
      state: NpcRuntimeState,
      isNearby: boolean,
      isNearest: boolean,
      nowMs: number,
      pulseVal: number
    ) => {
      const { npc, x, y, facing, walkPhase: nPhase } = state;
      const isMoving = nPhase > 0.01;
      const stride = isMoving ? Math.sin(nPhase) : 0;
      const bob = isMoving ? Math.abs(Math.sin(nPhase)) * -2.6 : Math.sin(nowMs * 0.004 + x) * 0.7;
      const dirX = Math.cos(facing);
      const faceSign = dirX < -0.15 ? -1 : 1;

      ctx.save();
      ctx.translate(x, y);

      // Ground shadow
      ctx.fillStyle = 'rgba(30, 41, 59, 0.18)';
      ctx.beginPath();
      ctx.ellipse(0, 12.5, 10.5, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(0, bob);

      // Legs stepping
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(-4.6, 3 + stride * 2.1, 3.8, 7.6, 1.8);
      ctx.roundRect(0.8, 3 - stride * 2.1, 3.8, 7.6, 1.8);
      ctx.fill();

      // Arms
      ctx.fillStyle = npc.shirtColor;
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.roundRect(-8.4, -4.8 - stride * 2.4, 3.5, 8.2, 1.8);
      ctx.roundRect(4.9, -4.8 + stride * 2.4, 3.5, 8.2, 1.8);
      ctx.fill();
      ctx.stroke();

      // Torso
      ctx.fillStyle = npc.shirtColor;
      ctx.strokeStyle = '#FFFDF9';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.roundRect(-5.6, -6.8, 11.2, 11.4, 4);
      ctx.fill();
      ctx.stroke();

      // Role-specific outfit accents
      if (npc.role === 'vendor') {
        // Warm cream street-vendor apron + small snack tray on arm
        ctx.fillStyle = '#FFFDF9';
        ctx.beginPath();
        ctx.roundRect(-3.8, -4.2, 7.6, 8.5, 2);
        ctx.fill();

        ctx.fillStyle = '#B45309';
        ctx.strokeStyle = '#78350F';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.ellipse(8.2 * faceSign, 1.5, 5.2, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (npc.role === 'commuter') {
        // Messenger sling strap & Metro smartcard badge
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-4.8, -6);
        ctx.lineTo(4.8, 3.8);
        ctx.stroke();
        ctx.fillStyle = '#FACC15';
        ctx.fillRect(1.2, -3.5, 3, 4);
      } else if (npc.role === 'guide') {
        // Khaki heritage pocket vest
        ctx.fillStyle = '#D6C7B2';
        ctx.fillRect(-4.5, -4, 3.2, 7.5);
        ctx.fillRect(1.3, -4, 3.2, 7.5);
      } else if (npc.role === 'artisan') {
        // Woven stole
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(-4.5, -6.5, 2.6, 10.5);
      } else {
        // Student camera strap
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(4.5, -6);
        ctx.lineTo(-4.5, 3.5);
        ctx.stroke();
      }

      // Head
      ctx.fillStyle = '#D99B66';
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, -12.4, 5.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Eyes
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(1.7 * faceSign, -12.4, 1.05, 0, Math.PI * 2);
      ctx.arc(4.0 * faceSign, -12.4, 0.95, 0, Math.PI * 2);
      ctx.fill();

      // Headwear by role
      if (npc.role === 'vendor') {
        ctx.fillStyle = '#F59E0B';
        ctx.strokeStyle = '#78350F';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, -16.2, 6.4, 3.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (npc.role === 'guide') {
        ctx.fillStyle = '#B45309';
        ctx.beginPath();
        ctx.ellipse(0, -16, 8.2, 2.1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -16.4, 4.3, Math.PI, 0);
        ctx.fill();
      } else {
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.arc(0, -13.9, 5.8, Math.PI * 0.95, Math.PI * 2.05);
        ctx.fill();
      }

      ctx.restore();

      // Compact NPC name tag
      ctx.font = '600 10.5px "Plus Jakarta Sans", sans-serif';
      const label = npc.name;
      const lw = ctx.measureText(label).width + 10;
      ctx.fillStyle = isNearest ? 'rgba(200, 75, 49, 0.92)' : 'rgba(255, 253, 249, 0.9)';
      ctx.strokeStyle = isNearest ? '#991B1B' : 'rgba(214, 199, 178, 0.9)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(-lw / 2, 16.5, lw, 16.5, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isNearest ? '#FFFDF9' : '#334155';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, 0, 24.75);

      // Interactive chat cue bubble when nearby
      if (isNearby) {
        const floatY = -28 - pulseVal * 3;
        ctx.fillStyle = '#FFFDF9';
        ctx.strokeStyle = isNearest ? '#C84B31' : '#7C5A3C';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(-14, floatY - 10, 28, 17, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isNearest ? '#C84B31' : '#7C5A3C';
        ctx.beginPath();
        ctx.arc(-5, floatY - 1.5, 1.6, 0, Math.PI * 2);
        ctx.arc(0, floatY - 1.5, 1.6, 0, Math.PI * 2);
        ctx.arc(5, floatY - 1.5, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    let lastTime = performance.now();
    let rafId = 0;
    let dustTimer = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const pulse = (Math.sin(now * 0.005) + 1) * 0.5;
      const currentProps = propsRef.current;

      // Smoothly transition weather aesthetics & movement modifier
      const targetWeather = currentProps.weather;
      const weatherLerp = Math.min(1, dt * 1.5);
      sunnyWeight += ((targetWeather === 'sunny' ? 1 : 0) - sunnyWeight) * weatherLerp;
      smogWeight += ((targetWeather === 'smoggy' ? 1 : 0) - smogWeight) * weatherLerp;
      rainWeight += ((targetWeather === 'monsoon' ? 1 : 0) - rainWeight) * weatherLerp;

      const weatherSpeedMult =
        sunnyWeight * WEATHER_CONFIGS.sunny.speedMultiplier +
        smogWeight * WEATHER_CONFIGS.smoggy.speedMultiplier +
        rainWeight * WEATHER_CONFIGS.monsoon.speedMultiplier;

      // Advance rain, splashes, smog wisps, and lightning
      if (rainWeight > 0.02) {
        for (const drop of rainDrops) {
          drop.nx -= dt * 0.14 * drop.speed;
          drop.ny += dt * 1.08 * drop.speed;
          if (drop.ny > 1.04) {
            drop.ny = -0.04;
            drop.nx = Math.random() * 1.12;
          }
          if (drop.nx < -0.05) {
            drop.nx = 1.05;
          }
        }
        for (const sp of rainSplashes) {
          sp.phase += dt * sp.speed;
          if (sp.phase >= 1) {
            sp.phase = 0;
            sp.nx = Math.random();
            sp.ny = Math.random();
          }
        }
        lightningTimer -= dt;
        if (lightningTimer <= 0) {
          lightningFlash = 0.28;
          lightningTimer = 9 + Math.random() * 9;
        }
      }
      lightningFlash = Math.max(0, lightningFlash - dt * 1.4);

      if (smogWeight > 0.02) {
        for (const wisp of smogWisps) {
          wisp.nx += dt * wisp.speed;
          if (wisp.nx - wisp.rx > 1.05) {
            wisp.nx = -wisp.rx - 0.05;
          }
        }
      }

      if (zoomDeltaRef.current !== 0) {
        targetZoom = Math.max(0.45, Math.min(1.55, targetZoom + zoomDeltaRef.current));
        zoomDeltaRef.current = 0;
      }
      zoom += (targetZoom - zoom) * Math.min(1, dt * 10);

      if (currentProps.gameState === 'TITLE_MENU') {
        const t = now * 0.00018;
        cameraX = 2000 + Math.cos(t) * 650;
        cameraY = 1600 + Math.sin(t * 0.8) * 580;
        zoom = 0.78;
      } else if (currentProps.gameState === 'PLAYING') {
        if (mapNavigateTargetRef.current) {
          walkTarget = { ...mapNavigateTargetRef.current };
          mapNavigateTargetRef.current = null;
          if (currentProps.activeRide) {
            currentProps.onRideCancel();
          }
        }

        let dx = 0;
        let dy = 0;
        let isSprinting = false;

        if (!currentProps.isModalOpen) {
          if (heldKeys.has('w') || heldKeys.has('arrowup')) dy -= 1;
          if (heldKeys.has('s') || heldKeys.has('arrowdown')) dy += 1;
          if (heldKeys.has('a') || heldKeys.has('arrowleft')) dx -= 1;
          if (heldKeys.has('d') || heldKeys.has('arrowright')) dx += 1;

          const touch = touchMoveVectorRef.current;
          if (Math.abs(touch.dx) > 0.05 || Math.abs(touch.dy) > 0.05) {
            dx += touch.dx;
            dy += touch.dy;
            isSprinting = touch.sprint;
          }

          if (heldKeys.has('shift')) {
            isSprinting = true;
          }
        }

        const ride = currentProps.activeRide;
        let effectiveMode: TransportMode = ride ? ride.mode : currentProps.transportMode;

        if (dx !== 0 || dy !== 0) {
          walkTarget = null;
          if (ride) {
            currentProps.onRideCancel();
            effectiveMode = currentProps.transportMode;
          }
        } else if (ride) {
          const tx = ride.x - playerPosRef.current.x;
          const ty = ride.y - playerPosRef.current.y;
          const dist = Math.hypot(tx, ty);
          if (dist < 16) {
            playerPosRef.current.x = Math.max(50, Math.min(WORLD_WIDTH - 50, ride.x));
            playerPosRef.current.y = Math.max(50, Math.min(WORLD_HEIGHT - 50, ride.y + 24));
            const place = getNearestPlace(playerPosRef.current.x, playerPosRef.current.y);
            currentProps.onMoveBroadcast(
              playerPosRef.current.x,
              playerPosRef.current.y,
              playerPosRef.current.facing,
              place.name,
              true,
              'walk'
            );
            currentProps.onRideComplete(ride);
          } else {
            dx = tx / dist;
            dy = ty / dist;
          }
        } else if (walkTarget && !currentProps.isModalOpen) {
          const tx = walkTarget.x - playerPosRef.current.x;
          const ty = walkTarget.y - playerPosRef.current.y;
          const dist = Math.hypot(tx, ty);
          if (dist < 10) {
            walkTarget = null;
          } else {
            dx = tx / dist;
            dy = ty / dist;
          }
        }

        const len = Math.hypot(dx, dy);
        if (len > 0.001) {
          const ndx = dx / len;
          const ndy = dy / len;
          const isVehicle = effectiveMode !== 'walk';
          const canSprint = !isVehicle && isSprinting && energyRef.current > 4;
          const baseSpeed = isVehicle
            ? TRANSPORT_OPTIONS[effectiveMode].speedPxPerSec
            : canSprint
              ? 345
              : TRANSPORT_OPTIONS.walk.speedPxPerSec;
          const speed = baseSpeed * weatherSpeedMult * currentProps.speedBonusMult;

          if (canSprint) {
            currentProps.onConsumeEnergy(-dt * 12 * currentProps.sprintDrainMult);
          } else if (isVehicle) {
            currentProps.onConsumeEnergy(dt * 4);
          } else {
            currentProps.onConsumeEnergy(dt * 2.2);
          }

          playerPosRef.current.x = Math.max(
            50,
            Math.min(WORLD_WIDTH - 50, playerPosRef.current.x + ndx * speed * dt)
          );
          playerPosRef.current.y = Math.max(
            50,
            Math.min(WORLD_HEIGHT - 50, playerPosRef.current.y + ndy * speed * dt)
          );
          const targetFacing = Math.atan2(ndy, ndx);
          playerPosRef.current.facing = lerpAngle(playerPosRef.current.facing, targetFacing, dt * 18);
          walkPhase += dt * (isVehicle ? 16 : canSprint ? 15 : 10.5) * weatherSpeedMult;

          // Subtle tire, water splash, or footstep dust trail behind moving avatar
          dustTimer += dt;
          const dustInterval = isVehicle ? 0.09 : canSprint ? 0.16 : 0.24;
          if (dustTimer > dustInterval) {
            dustTimer = 0;
            const isRainSplash = rainWeight > 0.45;
            particles.push({
              x: playerPosRef.current.x - Math.cos(playerPosRef.current.facing) * (isVehicle ? 16 : 6),
              y:
                playerPosRef.current.y +
                (isVehicle ? 0 : 12) -
                Math.sin(playerPosRef.current.facing) * (isVehicle ? 16 : 4),
              vx: (Math.random() - 0.5) * (isRainSplash ? 32 : 18),
              vy: (Math.random() - 0.5) * 18 - (isRainSplash ? 12 : 6),
              life: 0,
              maxLife: isVehicle ? 0.38 : 0.28,
              color: isRainSplash
                ? 'rgba(147, 197, 253, 0.85)'
                : isVehicle
                  ? effectiveMode === 'bike'
                    ? '#FDE047'
                    : '#CBD5E1'
                  : '#D6C7B2',
              size: isVehicle ? (effectiveMode === 'car' ? 4 : 3) : 2.5,
            });
          }

          const place = getNearestPlace(playerPosRef.current.x, playerPosRef.current.y);
          currentProps.onMoveBroadcast(
            playerPosRef.current.x,
            playerPosRef.current.y,
            playerPosRef.current.facing,
            place.name,
            false,
            effectiveMode
          );
        } else {
          currentProps.onConsumeEnergy(dt * 3.5);
          walkPhase = 0;
        }

        cameraX += (playerPosRef.current.x - cameraX) * Math.min(1, dt * 8);
        cameraY += (playerPosRef.current.y - cameraY) * Math.min(1, dt * 8);

        const nearestZone = getNearestPlace(playerPosRef.current.x, playerPosRef.current.y);
        if (nearestZone.id !== lastZoneId) {
          lastZoneId = nearestZone.id;
          currentProps.onZoneChange(nearestZone.id, nearestZone.name);
        }

        let bestPoi: ActivePoiTarget | null = null;
        let bestDist = INTERACT_RADIUS + currentProps.interactRadiusBonus;

        for (const m of METRO_STATIONS) {
          const d = Math.hypot(m.x - playerPosRef.current.x, m.y - playerPosRef.current.y);
          if (d < bestDist) {
            bestDist = d;
            bestPoi = { kind: 'metro', id: m.id, name: m.name, x: m.x, y: m.y, distance: d };
          }
        }
        for (const h of HERITAGE_SITES) {
          const d = Math.hypot(h.x - playerPosRef.current.x, h.y - playerPosRef.current.y);
          if (d < bestDist) {
            bestDist = d;
            bestPoi = { kind: 'heritage', id: h.id, name: h.name, x: h.x, y: h.y, distance: d };
          }
        }
        for (const r of RESTAURANTS) {
          const d = Math.hypot(r.x - playerPosRef.current.x, r.y - playerPosRef.current.y);
          if (d < bestDist) {
            bestDist = d;
            bestPoi = { kind: 'restaurant', id: r.id, name: r.name, x: r.x, y: r.y, distance: d };
          }
        }
        for (const mall of SHOPPING_MALLS) {
          const d = Math.hypot(mall.x - playerPosRef.current.x, mall.y - playerPosRef.current.y);
          if (d < bestDist) {
            bestDist = d;
            bestPoi = { kind: 'mall', id: mall.id, name: mall.name, x: mall.x, y: mall.y, distance: d };
          }
        }
        for (const npcState of npcStates) {
          const d = Math.hypot(
            npcState.x - playerPosRef.current.x,
            npcState.y - playerPosRef.current.y
          );
          if (d < 78 && d < bestDist) {
            bestDist = d;
            bestPoi = {
              kind: 'npc',
              id: npcState.npc.id,
              name: npcState.npc.name,
              x: npcState.x,
              y: npcState.y,
              distance: d,
            };
          }
        }

        nearestPoi = bestPoi;
        const poiKey = bestPoi ? `${bestPoi.kind}:${bestPoi.id}` : '';
        if (poiKey !== lastPoiKey) {
          lastPoiKey = poiKey;
          currentProps.onNearestPoiChange(bestPoi);
        }

        const gig = currentProps.activeGig;
        if (gig) {
          const tx = gig.stage === 'pickup' ? gig.contract.pickupX : gig.contract.dropoffX;
          const ty = gig.stage === 'pickup' ? gig.contract.pickupY : gig.contract.dropoffY;
          const stepKey = `${gig.contract.id}:${gig.stage}`;
          const distToGig = Math.hypot(tx - playerPosRef.current.x, ty - playerPosRef.current.y);
          if (distToGig < 95 && stepKey !== lastGigStepKey) {
            lastGigStepKey = stepKey;
            currentProps.onGigStepReached(gig.contract.id, gig.stage);
          }
        } else {
          lastGigStepKey = '';
        }
      }

      // Roaming NPC patrol update (pauses politely when player approaches closely)
      if (currentProps.gameState === 'PLAYING' && !currentProps.isModalOpen) {
        for (let i = 0; i < npcStates.length; i++) {
          const st = npcStates[i];
          const distToPlayer = Math.hypot(
            playerPosRef.current.x - st.x,
            playerPosRef.current.y - st.y
          );
          if (distToPlayer < 78) {
            st.walkPhase = 0;
            st.facing = Math.atan2(
              playerPosRef.current.y - st.y,
              playerPosRef.current.x - st.x
            );
            continue;
          }

          if (st.pauseTimer > 0) {
            st.pauseTimer = Math.max(0, st.pauseTimer - dt);
            st.walkPhase = 0;
            continue;
          }

          const target = st.npc.waypoints[st.waypointIdx];
          const dx = target.x - st.x;
          const dy = target.y - st.y;
          const dist = Math.hypot(dx, dy);

          if (dist <= 6) {
            st.waypointIdx = (st.waypointIdx + 1) % st.npc.waypoints.length;
            st.pauseTimer = 1.1 + ((i * 5) % 9) * 0.18;
            st.walkPhase = 0;
          } else {
            const step = Math.min(dist, st.npc.speed * weatherSpeedMult * dt);
            st.x += (dx / dist) * step;
            st.y += (dy / dist) * step;
            st.facing = Math.atan2(dy, dx);
            st.walkPhase += dt * 9.5;
          }
        }
      }

      for (const rp of remotePlayersMapRef.current.values()) {
        const distRem = Math.hypot(rp.targetX - rp.x, rp.targetY - rp.y);
        rp.x += (rp.targetX - rp.x) * Math.min(1, dt * 10);
        rp.y += (rp.targetY - rp.y) * Math.min(1, dt * 10);
        if (distRem > 1.2) {
          remoteWalkPhaseMap.set(rp.id, (remoteWalkPhaseMap.get(rp.id) ?? 0) + dt * 12);
        } else {
          remoteWalkPhaseMap.set(rp.id, 0);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.life += dt;
        if (pt.life >= pt.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vy += 120 * dt;
      }

      // --- RENDER ---
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewW = canvas.width / dpr;
      const viewH = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.fillStyle = '#F3EBDD';
      ctx.fillRect(0, 0, viewW, viewH);

      ctx.translate(viewW / 2, viewH / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-cameraX, -cameraY);

      ctx.strokeStyle = 'rgba(138, 114, 88, 0.08)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx <= WORLD_WIDTH; gx += 200) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, WORLD_HEIGHT);
        ctx.stroke();
      }
      for (let gy = 0; gy <= WORLD_HEIGHT; gy += 200) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(WORLD_WIDTH, gy);
        ctx.stroke();
      }

      for (const place of PLACE_ZONES) {
        ctx.fillStyle = 'rgba(255, 253, 249, 0.42)';
        ctx.strokeStyle = 'rgba(148, 125, 98, 0.16)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(place.x, place.y, place.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      for (const park of PARK_AREAS) {
        ctx.fillStyle = '#DCE7D5';
        ctx.beginPath();
        ctx.ellipse(park.x, park.y, park.rx, park.ry, 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const tree of parkTrees) {
        ctx.fillStyle = tree.shade;
        ctx.beginPath();
        ctx.arc(tree.x, tree.y, tree.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Yamuna River
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#7EB4C2';
      ctx.lineWidth = 115;
      ctx.beginPath();
      YAMUNA_POINTS.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.stroke();

      ctx.strokeStyle = '#A6D2DD';
      ctx.lineWidth = 56;
      ctx.beginPath();
      YAMUNA_POINTS.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.stroke();

      ctx.font = 'italic 600 16px "Fraunces", Georgia, serif';
      ctx.fillStyle = '#1E4E5F';
      ctx.textAlign = 'center';
      ctx.fillText('Yamuna River', 2620, 1120);
      ctx.restore();

      // Road Network
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (const seg of ROAD_SEGMENTS) {
        ctx.strokeStyle = '#C9B9A2';
        ctx.lineWidth = seg.width + 4;
        ctx.beginPath();
        seg.pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
        ctx.stroke();

        ctx.strokeStyle = seg.color ?? '#FAF4E8';
        ctx.lineWidth = seg.width;
        ctx.beginPath();
        seg.pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
        ctx.stroke();
      }

      // Iconic Connaught Place double concentric white circles
      ctx.strokeStyle = '#FAF4E8';
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.arc(1900, 1450, 105, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(1900, 1450, 56, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#4D7C5B';
      ctx.beginPath();
      ctx.arc(1900, 1450, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // All 10 Delhi Metro Lines + Animated Trains
      for (let li = 0; li < METRO_LINES.length; li++) {
        const line = METRO_LINES[li];
        const coords = line.stationIds
          .map((id) => METRO_STATIONS.find((s) => s.id === id))
          .filter((s): s is NonNullable<typeof s> => Boolean(s));
        if (coords.length < 2) continue;

        ctx.save();
        ctx.strokeStyle = line.color;
        ctx.globalAlpha = 0.72;
        ctx.lineWidth = 4.5;
        ctx.setLineDash([11, 5]);
        ctx.beginPath();
        coords.forEach((st, idx) => (idx === 0 ? ctx.moveTo(st.x, st.y) : ctx.lineTo(st.x, st.y)));
        ctx.stroke();
        ctx.restore();

        const totalSegs = coords.length - 1;
        const speedCycle = (now * 0.00016 + li * 0.19) % 2;
        const tNorm = speedCycle <= 1 ? speedCycle : 2 - speedCycle;
        const segFloat = tNorm * totalSegs;
        const segIdx = Math.min(totalSegs - 1, Math.floor(segFloat));
        const segT = segFloat - segIdx;
        const a = coords[segIdx];
        const b = coords[segIdx + 1];
        const tx = a.x + (b.x - a.x) * segT;
        const ty = a.y + (b.y - a.y) * segT;
        const angle = Math.atan2(b.y - a.y, b.x - a.x);

        ctx.save();
        ctx.translate(tx, ty);
        ctx.rotate(angle);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-15, -5.5, 30, 11, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = line.color;
        ctx.fillRect(-9, -2.5, 18, 5);
        ctx.restore();
      }

      // District / Neighborhood Titles
      for (const place of PLACE_ZONES) {
        ctx.save();
        ctx.font = '700 16.5px "Fraunces", Georgia, serif';
        ctx.fillStyle = 'rgba(30, 41, 59, 0.78)';
        ctx.textAlign = 'center';
        ctx.fillText(place.name, place.x, place.y - place.radius + 30);
        ctx.restore();
      }

      // Heritage Sites
      for (const site of HERITAGE_SITES) {
        drawHeritageSilhouette(site, currentProps.stampedHeritages.includes(site.id), pulse);
      }

      // Major Shopping Malls & Craft Bazaars
      for (const mall of SHOPPING_MALLS) {
        drawMallComplex(mall, currentProps.visitedMalls.includes(mall.id));
      }

      // Famous Restaurants & Street Stalls
      for (const rest of RESTAURANTS) {
        const tasted = currentProps.tastedRestaurants.includes(rest.id);
        ctx.save();
        ctx.translate(rest.x, rest.y);

        ctx.fillStyle = '#FFFDF9';
        ctx.strokeStyle = '#C84B31';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-24, -18, 48, 36, 8);
        ctx.fill();
        ctx.stroke();

        for (let s = -20; s < 20; s += 10) {
          ctx.fillStyle = (s / 10) % 2 === 0 ? '#D97706' : '#FFFDF9';
          ctx.fillRect(s, -16, 10, 12);
        }

        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(0, 8, 5, 0, Math.PI * 2);
        ctx.fill();

        if (tasted) {
          ctx.fillStyle = '#15803D';
          ctx.beginPath();
          ctx.arc(19, -15, 7, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.font = '600 11.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#7C2D12';
        ctx.textAlign = 'center';
        ctx.fillText(rest.name, 0, 32);
        ctx.restore();
      }

      // Metro Stations
      for (const st of METRO_STATIONS) {
        const distToPlayer = Math.hypot(st.x - playerPosRef.current.x, st.y - playerPosRef.current.y);
        const showLabel = st.interchange || st.major || zoom >= 0.85 || distToPlayer < 220;

        ctx.save();
        ctx.translate(st.x, st.y);

        const r = st.interchange ? 15.5 : 13;
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = METRO_LINE_META[st.lines[0]].color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (st.lines.length > 1) {
          ctx.strokeStyle = METRO_LINE_META[st.lines[1]].color;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.arc(0, 0, r + 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.font = '700 11.5px "JetBrains Mono", monospace';
        ctx.fillStyle = '#1E293B';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('M', 0, 0.5);

        if (showLabel) {
          ctx.font = '600 10.5px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#1E293B';
          ctx.textBaseline = 'top';
          ctx.fillText(st.name.split(' (')[0], 0, r + 6);
        }
        ctx.restore();
      }

      if (nearestPoi && currentProps.gameState === 'PLAYING') {
        const liveNpc =
          nearestPoi.kind === 'npc'
            ? npcStates.find((n) => n.npc.id === nearestPoi?.id)
            : undefined;
        const ringX = liveNpc ? liveNpc.x : nearestPoi.x;
        const ringY = liveNpc ? liveNpc.y : nearestPoi.y;
        const ringR = liveNpc ? 24 + pulse * 4 : 42 + pulse * 6;
        ctx.save();
        ctx.strokeStyle = `rgba(200, 75, 49, ${0.45 + pulse * 0.4})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ringX, ringY, ringR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (currentProps.waypointPin && currentProps.gameState === 'PLAYING') {
        const wp = currentProps.waypointPin;
        ctx.save();
        ctx.strokeStyle = '#C84B31';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, 46 + pulse * 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (currentProps.activeGig && currentProps.gameState === 'PLAYING') {
        const gig = currentProps.activeGig;
        const gx = gig.stage === 'pickup' ? gig.contract.pickupX : gig.contract.dropoffX;
        const gy = gig.stage === 'pickup' ? gig.contract.pickupY : gig.contract.dropoffY;
        const gigColor = gig.stage === 'pickup' ? '#D97706' : '#15803D';
        ctx.save();
        ctx.strokeStyle = gigColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(gx, gy, 52 + pulse * 12, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = gigColor;
        ctx.beginPath();
        ctx.roundRect(gx - 42, gy - 68, 84, 20, 6);
        ctx.fill();
        ctx.font = '700 10.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#FFFDF9';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(gig.stage === 'pickup' ? 'GIG PICKUP' : 'GIG DROPOFF', gx, gy - 58);
        ctx.restore();
      }

      if (currentProps.activeRide && currentProps.gameState === 'PLAYING') {
        const ride = currentProps.activeRide;
        ctx.save();
        ctx.strokeStyle = '#15803D';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 7]);
        ctx.beginPath();
        ctx.moveTo(playerPosRef.current.x, playerPosRef.current.y);
        ctx.lineTo(ride.x, ride.y);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.strokeStyle = '#15803D';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(ride.x, ride.y, 18 + pulse * 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (walkTarget && currentProps.gameState === 'PLAYING') {
        ctx.save();
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(walkTarget.x, walkTarget.y, 10 + pulse * 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      for (const npcState of npcStates) {
        const distToPlayer = Math.hypot(
          npcState.x - playerPosRef.current.x,
          npcState.y - playerPosRef.current.y
        );
        const isNearestNpc =
          nearestPoi?.kind === 'npc' && nearestPoi.id === npcState.npc.id;
        drawNpcCharacter(
          npcState,
          distToPlayer < 150 && currentProps.gameState === 'PLAYING',
          isNearestNpc,
          now,
          pulse
        );
      }

      for (const rp of remotePlayersMapRef.current.values()) {
        const speech = rp.speechExpiresAt && now < rp.speechExpiresAt ? rp.speechText : undefined;
        const rPhase = remoteWalkPhaseMap.get(rp.id) ?? 0;
        drawTravelerAvatar(
          rp.x,
          rp.y,
          rp.facing,
          rp.color,
          rp.name,
          false,
          rPhase,
          rp.vehicle ?? 'walk',
          now,
          speech
        );
      }

      if (currentProps.gameState !== 'TITLE_MENU') {
        const selfSpeech =
          selfSpeechRef.current && now < selfSpeechRef.current.expiresAt
            ? selfSpeechRef.current.text
            : undefined;
        const selfVehicle = currentProps.activeRide
          ? currentProps.activeRide.mode
          : currentProps.transportMode;

        drawTravelerAvatar(
          playerPosRef.current.x,
          playerPosRef.current.y,
          playerPosRef.current.facing,
          currentProps.playerColor,
          currentProps.playerName || 'You',
          true,
          walkPhase,
          selfVehicle,
          now,
          selfSpeech
        );

        if (currentProps.waypointPin) {
          const wp = currentProps.waypointPin;
          const dx = wp.x - playerPosRef.current.x;
          const dy = wp.y - playerPosRef.current.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 90) {
            const ang = Math.atan2(dy, dx);
            ctx.save();
            ctx.translate(
              playerPosRef.current.x + Math.cos(ang) * 34,
              playerPosRef.current.y + Math.sin(ang) * 34
            );
            ctx.rotate(ang);
            ctx.fillStyle = '#C84B31';
            ctx.beginPath();
            ctx.moveTo(9, 0);
            ctx.lineTo(-4, -5);
            ctx.lineTo(-4, 5);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }
        }
      }

      for (const pt of particles) {
        const alpha = 1 - pt.life / pt.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();

      // --- SCREEN-SPACE DYNAMIC WEATHER OVERLAY ---
      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Sunny golden rays & warm glow
      if (sunnyWeight > 0.02) {
        ctx.fillStyle = `rgba(253, 224, 110, ${(0.075 * sunnyWeight).toFixed(3)})`;
        ctx.fillRect(0, 0, viewW, viewH);

        const sunGlow = ctx.createRadialGradient(
          viewW * 0.12,
          viewH * 0.06,
          10,
          viewW * 0.12,
          viewH * 0.06,
          Math.max(viewW, viewH) * 0.65
        );
        sunGlow.addColorStop(0, `rgba(254, 240, 138, ${(0.28 * sunnyWeight).toFixed(3)})`);
        sunGlow.addColorStop(0.35, `rgba(253, 224, 71, ${(0.08 * sunnyWeight).toFixed(3)})`);
        sunGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = sunGlow;
        ctx.fillRect(0, 0, viewW, viewH);

        // Subtle diagonal sunbeam shafts
        ctx.fillStyle = `rgba(255, 251, 235, ${(0.05 * sunnyWeight).toFixed(3)})`;
        for (let b = 0; b < 3; b++) {
          const offset = b * viewW * 0.26 + Math.sin(now * 0.0004 + b) * 18;
          ctx.beginPath();
          ctx.moveTo(viewW * 0.05 + offset, 0);
          ctx.lineTo(viewW * 0.16 + offset, 0);
          ctx.lineTo(viewW * 0.48 + offset, viewH);
          ctx.lineTo(viewW * 0.3 + offset, viewH);
          ctx.closePath();
          ctx.fill();
        }
      }

      // 2. Delhi NCR Winter Smog & drifting haze
      if (smogWeight > 0.02) {
        ctx.fillStyle = `rgba(176, 168, 150, ${(0.34 * smogWeight).toFixed(3)})`;
        ctx.fillRect(0, 0, viewW, viewH);

        // Radial haze vignette keeping center slightly clearer for visibility
        const hazeGrad = ctx.createRadialGradient(
          viewW * 0.5,
          viewH * 0.5,
          Math.min(viewW, viewH) * 0.16,
          viewW * 0.5,
          viewH * 0.5,
          Math.max(viewW, viewH) * 0.72
        );
        hazeGrad.addColorStop(0, `rgba(198, 190, 174, ${(0.05 * smogWeight).toFixed(3)})`);
        hazeGrad.addColorStop(0.6, `rgba(156, 149, 135, ${(0.28 * smogWeight).toFixed(3)})`);
        hazeGrad.addColorStop(1, `rgba(112, 108, 100, ${(0.52 * smogWeight).toFixed(3)})`);
        ctx.fillStyle = hazeGrad;
        ctx.fillRect(0, 0, viewW, viewH);

        // Drifting layered smog wisps
        for (const wisp of smogWisps) {
          ctx.fillStyle = `rgba(218, 212, 198, ${(wisp.alpha * smogWeight).toFixed(3)})`;
          ctx.beginPath();
          ctx.ellipse(
            wisp.nx * viewW,
            wisp.ny * viewH,
            wisp.rx * viewW,
            wisp.ry * viewH,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }

      // 3. Monsoon Downpour, puddles, splashes & occasional lightning
      if (rainWeight > 0.02) {
        // Overcast monsoon sky tint
        ctx.fillStyle = `rgba(26, 48, 78, ${(0.24 * rainWeight).toFixed(3)})`;
        ctx.fillRect(0, 0, viewW, viewH);

        // Cool stormy perimeter vignette
        const stormGrad = ctx.createRadialGradient(
          viewW * 0.5,
          viewH * 0.5,
          Math.min(viewW, viewH) * 0.25,
          viewW * 0.5,
          viewH * 0.5,
          Math.max(viewW, viewH) * 0.78
        );
        stormGrad.addColorStop(0, 'rgba(15, 23, 42, 0)');
        stormGrad.addColorStop(1, `rgba(15, 23, 42, ${(0.34 * rainWeight).toFixed(3)})`);
        ctx.fillStyle = stormGrad;
        ctx.fillRect(0, 0, viewW, viewH);

        // Subtle lightning illumination flash
        if (lightningFlash > 0.01) {
          ctx.fillStyle = `rgba(226, 240, 255, ${(lightningFlash * rainWeight).toFixed(3)})`;
          ctx.fillRect(0, 0, viewW, viewH);
        }

        // Ground puddle ripples
        ctx.lineWidth = 1.2;
        for (const sp of rainSplashes) {
          const r = 2 + sp.phase * 11;
          const alpha = (1 - sp.phase) * 0.36 * rainWeight;
          ctx.strokeStyle = `rgba(191, 219, 254, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.ellipse(sp.nx * viewW, sp.ny * viewH, r, r * 0.45, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Falling slanted rain streaks
        ctx.lineCap = 'round';
        for (const drop of rainDrops) {
          const sx = drop.nx * viewW;
          const sy = drop.ny * viewH;
          ctx.strokeStyle = `rgba(219, 234, 254, ${(drop.alpha * rainWeight).toFixed(3)})`;
          ctx.lineWidth = drop.width;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx - drop.len * 0.14, sy + drop.len);
          ctx.stroke();
        }
      }

      ctx.restore();
      rafId = window.requestAnimationFrame(frame);
    };

    rafId = window.requestAnimationFrame(frame);

    return () => {
      photoCaptureRef.current = null;
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('pointerdown', onPointerDown);
    };
  }, [
    cameraSnapTriggerRef,
    energyRef,
    mapNavigateTargetRef,
    particleTriggerRef,
    photoCaptureRef,
    playerPosRef,
    remotePlayersMapRef,
    selfSpeechRef,
    touchMoveVectorRef,
    zoomDeltaRef,
  ]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#F3EBDD]">
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />
    </div>
  );
};
