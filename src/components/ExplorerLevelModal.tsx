import React from 'react';
import { Award, Check, Lock, Sparkles, Star, X } from 'lucide-react';
import {
  EXPLORER_MILESTONES,
  XP_REWARDS,
  getExplorerLevelState,
} from '../data/explorerLevels';

interface ExplorerLevelModalProps {
  xp: number;
  equippedTitle?: string;
  onEquipTitle: (title: string) => void;
  onClose: () => void;
}

export const ExplorerLevelModal: React.FC<ExplorerLevelModalProps> = ({
  xp,
  equippedTitle,
  onEquipTitle,
  onClose,
}) => {
  const levelState = getExplorerLevelState(xp);
  const activeTitle = equippedTitle || levelState.defaultTitle;

  const xpSources = [
    { label: 'Deliver NCR Gig', value: `+${XP_REWARDS.completeGig} XP` },
    { label: 'Stamp Heritage Site', value: `+${XP_REWARDS.stampHeritage} XP` },
    { label: 'Complete Trail Quest', value: `+${XP_REWARDS.questComplete} XP` },
    { label: 'Complete Daily Mission', value: `+${XP_REWARDS.dailyMission} XP` },
    { label: 'Chai Counter Shift', value: `+${XP_REWARDS.chaiShift} XP` },
    { label: 'Discover Neighborhood', value: `+${XP_REWARDS.discoverPlace} XP` },
    { label: 'Eat at Restaurant', value: `+${XP_REWARDS.tasteNewDish} XP` },
    { label: 'Ride Delhi Metro', value: `+${XP_REWARDS.metroRide} XP` },
  ];

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#1E293B]/50 p-4">
      <div className="bg-[#FFFDF9] border border-[#E2D5C3] rounded-2xl w-full max-w-2xl max-h-[86vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-[#E2D5C3] bg-[#FAF4E8]">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#C84B31] text-white flex items-center justify-center font-mono font-bold text-base shrink-0">
              {levelState.level}
            </div>
            <div className="min-w-0">
              <h2
                className="text-xl font-bold text-[#1E293B] leading-tight truncate"
                style={{ fontFamily: '"Fraunces", Georgia, serif' }}
              >
                Explorer Level {levelState.level} · {activeTitle}
              </h2>
              <p className="text-xs text-[#64748B] tabular-nums mt-0.5">
                {levelState.xp} Total XP · {levelState.xpIntoLevel} / {levelState.xpNeededForLevel}{' '}
                XP toward Level {levelState.level + 1}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Explorer Level window"
            className="p-2 rounded-lg hover:bg-[#EFE6D8] text-[#475569] cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar Banner */}
        <div className="px-6 py-3.5 bg-[#FFFDF9] border-b border-[#EFE6D8] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1E293B]">Level Progress</span>
            <span className="font-mono font-semibold tabular-nums text-[#C84B31]">
              {levelState.progressPct}% ({levelState.xpNeededForLevel - levelState.xpIntoLevel} XP to
              next rank)
            </span>
          </div>
          <div className="w-full h-3 bg-[#EFE6D8] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${levelState.progressPct}%`,
                backgroundColor: '#C84B31',
              }}
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 ncr-scroll">
          {/* Milestones, Titles & Map Perks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#C84B31]" />
                <span>Rank Milestones, Cosmetic Titles & Map Perks</span>
              </h3>
              <span className="text-xs text-[#64748B] tabular-nums">
                {levelState.unlockedMilestones.length}/{EXPLORER_MILESTONES.length} unlocked
              </span>
            </div>

            <div className="space-y-2.5">
              {EXPLORER_MILESTONES.map((milestone) => {
                const unlocked = levelState.level >= milestone.level;
                const isEquipped = activeTitle === milestone.title;

                return (
                  <div
                    key={milestone.level}
                    className={`p-4 rounded-xl border transition-colors ${
                      unlocked
                        ? isEquipped
                          ? 'bg-[#FAF4E8] border-[#C84B31]'
                          : 'bg-white border-[#E2D5C3]'
                        : 'bg-[#FAF4E8]/40 border-[#E2D5C3] opacity-75'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span
                            className="font-mono font-bold tabular-nums"
                            style={{ color: unlocked ? milestone.badgeColor : '#64748B' }}
                          >
                            Lv.{milestone.level}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-bold text-sm text-[#1E293B]">
                            {milestone.title}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-[#64748B] tabular-nums">
                            {milestone.xpRequired} XP
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          <span>{milestone.perkName}</span>
                        </div>
                        <p className="text-xs text-[#64748B] leading-relaxed">
                          {milestone.perkDescription}
                        </p>
                      </div>

                      <div className="shrink-0 pt-0.5">
                        {unlocked ? (
                          <button
                            type="button"
                            onClick={() => onEquipTitle(milestone.title)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              isEquipped
                                ? 'bg-[#C84B31] border-[#C84B31] text-white'
                                : 'bg-[#FAF4E8] hover:bg-[#EFE6D8] border-[#D6C7B2] text-[#1E293B]'
                            }`}
                          >
                            {isEquipped ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Equipped</span>
                              </>
                            ) : (
                              <span>Equip Title</span>
                            )}
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 text-xs font-medium text-[#64748B] tabular-nums">
                            <Lock className="w-3.5 h-3.5" />
                            <span>{milestone.xpRequired - levelState.xp} XP left</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* XP Actions Reference */}
          <div className="space-y-2.5 pt-2 border-t border-[#EFE6D8]">
            <h3 className="text-xs font-bold text-[#1E293B] flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Ways to Earn Explorer XP</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {xpSources.map((src) => (
                <div
                  key={src.label}
                  className="p-2.5 rounded-lg bg-[#FAF4E8] border border-[#E2D5C3]"
                >
                  <div className="text-[11px] font-medium text-[#475569] truncate">
                    {src.label}
                  </div>
                  <div className="text-xs font-mono font-bold text-[#C84B31] tabular-nums mt-0.5">
                    {src.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
