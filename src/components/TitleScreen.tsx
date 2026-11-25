import React, { useEffect, useState } from 'react';
import { Compass, Users, KeyRound, Play, RefreshCw } from 'lucide-react';
import {
  AVATAR_COLORS,
  METRO_STATIONS,
  PLACE_ZONES,
  SHOPPING_MALLS,
} from '../data/delhiWorld';

interface TitleScreenProps {
  initialName: string;
  initialColor: string;
  onStartGame: (name: string, color: string, roomCode: string) => void;
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = 'DEL';
  for (let i = 0; i < 3; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  initialName,
  initialColor,
  onStartGame,
}) => {
  const [name, setName] = useState(initialName || 'Aarav');
  const [color, setColor] = useState(initialColor || AVATAR_COLORS[0].hex);
  const [roomMode, setRoomMode] = useState<'public' | 'private'>('public');
  const [privateCode, setPrivateCode] = useState(() => generateRoomCode());
  const [publicOnlineCount, setPublicOnlineCount] = useState<number | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/rooms/summary')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && typeof data.publicPlayers === 'number') {
          setPublicOnlineCount(data.publicPlayers);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = name.trim() || 'Traveller';
    const finalRoom =
      roomMode === 'public'
        ? 'PUBLIC-NCR'
        : privateCode.trim().toUpperCase() || generateRoomCode();
    onStartGame(finalName, color, finalRoom);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? '').toLowerCase();
      if (tag === 'input') return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-between p-6 md:p-10 pointer-events-none">
      {/* Top editorial lockup over calm gradient scrim */}
      <div className="flex items-start justify-between gap-6">
        <div className="pointer-events-auto bg-[#FFFDF9]/95 border border-[#E2D5C3] rounded-2xl p-6 max-w-xl shadow-sm">
          {/* Bespoke inline SVG Title Lockup */}
          <div className="flex items-center gap-3 mb-2">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="shrink-0"
            >
              <rect width="40" height="40" rx="10" fill="#C84B31" />
              <path
                d="M11 30V18C11 13.0294 15.0294 9 20 9C24.9706 9 29 13.0294 29 18V30"
                stroke="#FFFDF9"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M15.5 30V21C15.5 18.5147 17.5147 16.5 20 16.5C22.4853 16.5 24.5 18.5147 24.5 21V30"
                stroke="#FDE68A"
                strokeWidth="2.2"
              />
              <circle cx="20" cy="12.5" r="1.5" fill="#FDE68A" />
            </svg>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[#1E293B] leading-none">
                Dilli Darshan
              </h1>
              <p className="text-xs font-medium text-[#7C5A3C] mt-1">
                Delhi NCR · Metro · Heritage · Street Food
              </p>
            </div>
          </div>

          <p className="text-sm text-[#475569] leading-relaxed mt-3">
            Wander a live 2D map from Old Delhi and Connaught Place to Noida and Gurugram. Ride
            the Delhi Metro, collect heritage monument stamps, taste famous food with real prices,
            and roam together in real time.
          </p>
        </div>

        {/* Key Art Card on wide viewports */}
        <div className="hidden lg:block pointer-events-auto w-80 bg-[#FFFDF9] border border-[#E2D5C3] rounded-2xl overflow-hidden shadow-sm">
          {!imgFailed ? (
            <img
              src="/src/assets/images/dilli_darshan_keyart_1795605421354.jpg"
              alt="Illustrated panorama of Delhi NCR featuring Red Fort, India Gate, Connaught Place, and Delhi Metro"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="w-full h-44 object-cover"
            />
          ) : (
            <div className="w-full h-44 bg-[#EFE2CE] flex items-center justify-center text-[#7C5A3C]">
              <Compass className="w-8 h-8" />
            </div>
          )}
          <div className="px-4 py-3 text-xs text-[#475569] flex items-center justify-between tabular-nums">
            <span>{PLACE_ZONES.length} Areas</span>
            <span aria-hidden="true">·</span>
            <span>{METRO_STATIONS.length} Metro Stations</span>
            <span aria-hidden="true">·</span>
            <span>{SHOPPING_MALLS.length} Malls</span>
          </div>
        </div>
      </div>

      {/* Bottom Join Panel + Single Control Hint Line */}
      <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between gap-4">
        <form
          onSubmit={handleSubmit}
          className="pointer-events-auto bg-[#FFFDF9]/95 border border-[#E2D5C3] rounded-2xl p-5 w-full max-w-md shadow-sm space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-semibold text-[#475569] mb-1">
                Explorer Name
              </span>
              <input
                type="text"
                value={name}
                maxLength={18}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 text-sm bg-white border border-[#D6C7B2] rounded-lg text-[#1E293B] focus:outline-none focus:border-[#C84B31]"
              />
            </label>

            <div>
              <span className="block text-xs font-semibold text-[#475569] mb-1">
                Token Color
              </span>
              <div className="flex items-center gap-2 pt-1.5">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    title={c.label}
                    aria-label={c.label}
                    onClick={() => setColor(c.hex)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      color === c.hex ? 'ring-2 ring-offset-2 ring-[#1E293B] scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-[#475569] mb-1.5">
              Multiplayer Session
            </span>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#EFE6D8] rounded-lg">
              <button
                type="button"
                onClick={() => setRoomMode('public')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  roomMode === 'public'
                    ? 'bg-white text-[#1E293B] shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Public NCR</span>
                {publicOnlineCount !== null && (
                  <span className="font-mono tabular-nums text-[#C84B31]">({publicOnlineCount})</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setRoomMode('private')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  roomMode === 'private'
                    ? 'bg-white text-[#1E293B] shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Private Room</span>
              </button>
            </div>

            {roomMode === 'private' && (
              <div className="mt-2.5 flex items-center gap-2">
                <input
                  type="text"
                  value={privateCode}
                  maxLength={10}
                  onChange={(e) => setPrivateCode(e.target.value.toUpperCase())}
                  placeholder="Room code (e.g. DEL482)"
                  className="flex-1 px-3 py-2 text-sm font-mono uppercase bg-white border border-[#D6C7B2] rounded-lg text-[#1E293B] focus:outline-none focus:border-[#C84B31]"
                />
                <button
                  type="button"
                  onClick={() => setPrivateCode(generateRoomCode())}
                  title="Generate new room code"
                  className="px-3 py-2 text-xs font-medium bg-[#EFE6D8] hover:bg-[#E2D5C3] text-[#1E293B] rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#C84B31] hover:bg-[#B03E26] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Exploring</span>
          </button>
        </form>

        <div className="pointer-events-auto bg-[#FFFDF9]/95 border border-[#E2D5C3] rounded-xl px-4 py-2.5 text-xs font-medium text-[#475569] self-start md:self-end">
          WASD / Click Move · Shift Sprint · E Interact · Tab Directory · P Passport · Esc Pause
        </div>
      </div>
    </div>
  );
};
