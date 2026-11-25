import React, { useEffect, useRef, useState } from 'react';
import { LocateFixed, Minimize2, Navigation } from 'lucide-react';
import {
  HERITAGE_SITES,
  METRO_LINES,
  METRO_STATIONS,
  RESTAURANTS,
  SHOPPING_MALLS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from '../data/delhiWorld';
import type {
  ActiveGigState,
  RemotePlayer,
  RideDispatchTarget,
  TransportMode,
  WaypointPin,
} from '../types/game';

interface MiniMapProps {
  playerPosRef: React.MutableRefObject<{ x: number; y: number; facing: number }>;
  playerColor: string;
  currentZoneName: string;
  transportMode: TransportMode;
  remotePlayersMapRef: React.MutableRefObject<Map<string, RemotePlayer>>;
  waypointPin: WaypointPin | null;
  activeRide: RideDispatchTarget | null;
  activeGig: ActiveGigState | null;
  onMapClickNavigate: (worldX: number, worldY: number) => void;
}

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

const MAP_W = 196;
const MAP_H = 152;

export const MiniMap: React.FC<MiniMapProps> = ({
  playerPosRef,
  playerColor,
  currentZoneName,
  transportMode,
  remotePlayersMapRef,
  waypointPin,
  activeRide,
  activeGig,
  onMapClickNavigate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const propsRef = useRef({
    playerColor,
    waypointPin,
    activeRide,
    activeGig,
    transportMode,
  });
  propsRef.current = {
    playerColor,
    waypointPin,
    activeRide,
    activeGig,
    transportMode,
  };

  useEffect(() => {
    if (collapsed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = MAP_W * dpr;
    canvas.height = MAP_H * dpr;

    let rafId = 0;
    let lastDraw = 0;

    const scaleX = MAP_W / WORLD_WIDTH;
    const scaleY = MAP_H / WORLD_HEIGHT;

    const draw = (now: number) => {
      rafId = window.requestAnimationFrame(draw);
      if (now - lastDraw < 36) return; // ~28fps crisp radar updates
      lastDraw = now;

      const {
        waypointPin: wp,
        activeRide: ride,
        activeGig: gig,
        playerColor: selfColor,
      } = propsRef.current;
      const px = playerPosRef.current.x;
      const py = playerPosRef.current.y;
      const facing = playerPosRef.current.facing;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Parchment radar background
      ctx.fillStyle = '#EFE6D8';
      ctx.fillRect(0, 0, MAP_W, MAP_H);

      // Subtle sector grid
      ctx.strokeStyle = 'rgba(138, 114, 88, 0.14)';
      ctx.lineWidth = 0.75;
      for (let gx = 400; gx < WORLD_WIDTH; gx += 800) {
        ctx.beginPath();
        ctx.moveTo(gx * scaleX, 0);
        ctx.lineTo(gx * scaleX, MAP_H);
        ctx.stroke();
      }
      for (let gy = 400; gy < WORLD_HEIGHT; gy += 800) {
        ctx.beginPath();
        ctx.moveTo(0, gy * scaleY);
        ctx.lineTo(MAP_W, gy * scaleY);
        ctx.stroke();
      }

      // Yamuna River
      ctx.strokeStyle = '#7EB4C2';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      YAMUNA_POINTS.forEach(([yx, yy], idx) =>
        idx === 0 ? ctx.moveTo(yx * scaleX, yy * scaleY) : ctx.lineTo(yx * scaleX, yy * scaleY)
      );
      ctx.stroke();

      // Metro lines
      for (const line of METRO_LINES) {
        const pts = line.stationIds
          .map((id) => METRO_STATIONS.find((s) => s.id === id))
          .filter((s): s is NonNullable<typeof s> => Boolean(s));
        if (pts.length < 2) continue;
        ctx.strokeStyle = line.color;
        ctx.globalAlpha = 0.65;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        pts.forEach((st, idx) =>
          idx === 0
            ? ctx.moveTo(st.x * scaleX, st.y * scaleY)
            : ctx.lineTo(st.x * scaleX, st.y * scaleY)
        );
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Major POI dots
      ctx.fillStyle = '#0369A1';
      for (const m of SHOPPING_MALLS) {
        ctx.fillRect(m.x * scaleX - 1.5, m.y * scaleY - 1.5, 3, 3);
      }

      ctx.fillStyle = '#B45309';
      for (const h of HERITAGE_SITES) {
        ctx.beginPath();
        ctx.arc(h.x * scaleX, h.y * scaleY, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#C84B31';
      for (const r of RESTAURANTS) {
        ctx.beginPath();
        ctx.arc(r.x * scaleX, r.y * scaleY, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Active GPS route line (Active ride > Active Gig target > Waypoint pin)
      const gigTarget = gig
        ? gig.stage === 'pickup'
          ? { x: gig.contract.pickupX, y: gig.contract.pickupY, color: '#D97706' }
          : { x: gig.contract.dropoffX, y: gig.contract.dropoffY, color: '#15803D' }
        : null;

      const navTarget = ride
        ? { x: ride.x, y: ride.y, color: '#15803D' }
        : gigTarget
          ? gigTarget
          : wp
            ? { x: wp.x, y: wp.y, color: '#C84B31' }
            : null;

      if (navTarget) {
        ctx.save();
        ctx.strokeStyle = navTarget.color;
        ctx.lineWidth = 1.8;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(px * scaleX, py * scaleY);
        ctx.lineTo(navTarget.x * scaleX, navTarget.y * scaleY);
        ctx.stroke();
        ctx.restore();

        const pulse = (Math.sin(now * 0.008) + 1) * 0.5;
        ctx.strokeStyle = navTarget.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(navTarget.x * scaleX, navTarget.y * scaleY, 3.5 + pulse * 2.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = navTarget.color;
        ctx.beginPath();
        ctx.arc(navTarget.x * scaleX, navTarget.y * scaleY, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Remote players
      for (const rp of remotePlayersMapRef.current.values()) {
        ctx.fillStyle = rp.color;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(rp.x * scaleX, rp.y * scaleY, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Local player GTA/GPS directional chevron + radar ring
      const ux = px * scaleX;
      const uy = py * scaleY;
      const pulse = (Math.sin(now * 0.006) + 1) * 0.5;

      ctx.strokeStyle = 'rgba(200, 75, 49, 0.45)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(ux, uy, 6.5 + pulse * 3, 0, Math.PI * 2);
      ctx.stroke();

      ctx.save();
      ctx.translate(ux, uy);
      ctx.rotate(facing);

      ctx.fillStyle = selfColor || '#C84B31';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(6.5, 0);
      ctx.lineTo(-4.5, -4.2);
      ctx.lineTo(-2.5, 0);
      ctx.lineTo(-4.5, 4.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    };

    rafId = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(rafId);
  }, [collapsed, playerPosRef, remotePlayersMapRef]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    const worldX = Math.max(60, Math.min(WORLD_WIDTH - 60, rx * WORLD_WIDTH));
    const worldY = Math.max(60, Math.min(WORLD_HEIGHT - 60, ry * WORLD_HEIGHT));
    onMapClickNavigate(worldX, worldY);
  };

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="flex items-center gap-1.5 px-3 py-2 bg-[#FFFDF9] hover:bg-[#F7EFE3] border border-[#E2D5C3] rounded-xl text-xs font-semibold text-[#1E293B] shadow-xs cursor-pointer"
        title="Show GPS Radar"
      >
        <LocateFixed className="w-3.5 h-3.5 text-[#C84B31]" />
        <span>GPS Map</span>
      </button>
    );
  }

  return (
    <div className="bg-[#FFFDF9] border-2 border-[#D6C7B2] rounded-xl overflow-hidden shadow-md w-[166px] sm:w-[198px]">
      <div className="flex items-center justify-between px-2.5 py-1 bg-[#1E293B] text-[#FFFDF9] text-[10px] font-semibold">
        <div className="flex items-center gap-1.5 truncate">
          <Navigation className="w-3 h-3 text-[#F59E0B] shrink-0" />
          <span className="truncate">NCR GPS · {transportMode === 'walk' ? 'Walk' : transportMode.toUpperCase()}</span>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          aria-label="Minimize GPS minimap"
          className="p-0.5 hover:bg-white/15 rounded cursor-pointer shrink-0"
        >
          <Minimize2 className="w-3 h-3" />
        </button>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          title="Click anywhere on GPS to move there"
          className="block w-full h-[128px] sm:h-[152px] cursor-pointer"
        />
        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#1E293B]/80 text-[#FFFDF9] text-[9px] font-bold flex items-center justify-center pointer-events-none">
          N
        </div>
      </div>

      <div className="px-2.5 py-1 bg-[#FAF4E8] border-t border-[#E2D5C3] flex items-center justify-between gap-2 text-[10px]">
        <span className="font-semibold text-[#1E293B] truncate">{currentZoneName}</span>
        <span className="text-[#7C5A3C] shrink-0">Tap map</span>
      </div>
    </div>
  );
};
