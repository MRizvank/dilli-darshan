import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import type { RemotePlayer } from '../types/game';

interface TopExplorersLeaderboardProps {
  selfName: string;
  selfColor: string;
  selfGigs: number;
  selfStamps: number;
  remotePlayers: RemotePlayer[];
  roomCode: string;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  color: string;
  gigsCompleted: number;
  stampsCount: number;
  totalScore: number;
  isSelf: boolean;
}

export const TopExplorersLeaderboard: React.FC<TopExplorersLeaderboardProps> = ({
  selfName,
  selfColor,
  selfGigs,
  selfStamps,
  remotePlayers,
  roomCode,
}) => {
  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const topFive = useMemo<LeaderboardEntry[]>(() => {
    const entries: LeaderboardEntry[] = [
      {
        id: 'self',
        name: selfName || 'You',
        color: selfColor,
        gigsCompleted: selfGigs,
        stampsCount: selfStamps,
        totalScore: selfGigs + selfStamps,
        isSelf: true,
      },
      ...remotePlayers.map((rp) => {
        const gigs = rp.gigsCompleted ?? 0;
        const stamps = rp.stampsCount ?? 0;
        return {
          id: rp.id,
          name: rp.name,
          color: rp.color,
          gigsCompleted: gigs,
          stampsCount: stamps,
          totalScore: gigs + stamps,
          isSelf: false,
        };
      }),
    ];

    entries.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.gigsCompleted !== a.gigsCompleted) return b.gigsCompleted - a.gigsCompleted;
      if (b.stampsCount !== a.stampsCount) return b.stampsCount - a.stampsCount;
      return a.name.localeCompare(b.name);
    });

    return entries.slice(0, 5);
  }, [remotePlayers, selfColor, selfGigs, selfName, selfStamps]);

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFDF9] hover:bg-[#F7EFE3] border border-[#E2D5C3] rounded-xl text-xs font-semibold text-[#1E293B] shadow-xs transition-colors cursor-pointer"
        title="Show Top Explorers Leaderboard"
      >
        <Trophy className="w-3.5 h-3.5 text-[#D97706]" />
        <span>Top Explorers</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
      </button>
    );
  }

  return (
    <div className="pointer-events-auto w-64 bg-[#FFFDF9]/95 border border-[#E2D5C3] rounded-xl shadow-xs overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#EFE6D8] bg-[#FAF4E8]">
        <div className="flex items-center gap-1.5 min-w-0">
          <Trophy className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
          <span className="text-xs font-bold text-[#1E293B] truncate">Top Explorers</span>
          <span className="text-[10px] font-mono text-[#7C5A3C] shrink-0">· {roomCode}</span>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          aria-label="Collapse Top Explorers leaderboard"
          className="p-0.5 rounded hover:bg-[#EFE6D8] text-[#64748B] cursor-pointer shrink-0"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="px-3 pt-1.5 pb-1 grid grid-cols-[1fr_34px_40px_34px] gap-1 text-[10px] font-semibold text-[#64748B] border-b border-[#EFE6D8]/70">
        <span>Explorer</span>
        <span className="text-right">Gigs</span>
        <span className="text-right">Stamps</span>
        <span className="text-right">Pts</span>
      </div>

      <div className="divide-y divide-[#EFE6D8]/70">
        {topFive.map((entry, idx) => {
          const rankColor =
            idx === 0
              ? 'text-[#B45309] font-bold'
              : idx === 1
                ? 'text-[#475569] font-bold'
                : idx === 2
                  ? 'text-[#9A3412] font-bold'
                  : 'text-[#64748B] font-medium';

          return (
            <div
              key={entry.id}
              className={`px-3 py-1.5 grid grid-cols-[1fr_34px_40px_34px] items-center gap-1 text-xs ${
                entry.isSelf
                  ? 'bg-[#FEF3C7]/40'
                  : idx === 0
                    ? 'bg-[#FAF4E8]/50'
                    : ''
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`w-4 text-[11px] font-mono tabular-nums shrink-0 ${rankColor}`}>
                  #{idx + 1}
                </span>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="truncate font-semibold text-[11px] text-[#1E293B]">
                  {entry.name}
                  {entry.isSelf ? ' (You)' : ''}
                </span>
              </div>
              <span className="text-right font-mono text-[11px] tabular-nums text-[#334155]">
                {entry.gigsCompleted}
              </span>
              <span className="text-right font-mono text-[11px] tabular-nums text-[#334155]">
                {entry.stampsCount}
              </span>
              <span className="text-right font-mono text-[11px] font-bold tabular-nums text-[#C84B31]">
                {entry.totalScore}
              </span>
            </div>
          );
        })}
      </div>

      {remotePlayers.length === 0 && (
        <div className="px-3 py-1.5 bg-[#FAF4E8]/60 border-t border-[#EFE6D8] text-[10px] text-[#64748B] truncate">
          Share room <span className="font-mono font-semibold">{roomCode}</span> for live rankings
        </div>
      )}
    </div>
  );
};
