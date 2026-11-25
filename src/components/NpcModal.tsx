import React, { useMemo, useState } from 'react';
import { Compass, Lightbulb, MessageCircle, RefreshCw, Sparkles, X } from 'lucide-react';
import type { NpcCharacter } from '../types/game';

interface NpcModalProps {
  npc: NpcCharacter;
  onSayThanks: (npc: NpcCharacter) => void;
  onClose: () => void;
}

export const NpcModal: React.FC<NpcModalProps> = ({ npc, onSayThanks, onClose }) => {
  const [filterKind, setFilterKind] = useState<'all' | 'tip' | 'fact'>('all');
  const [lineIndex, setLineIndex] = useState(() =>
    Math.floor(Math.random() * Math.max(1, npc.lines.length))
  );

  const visibleLines = useMemo(() => {
    if (filterKind === 'all') return npc.lines;
    return npc.lines.filter((l) => l.kind === filterKind);
  }, [filterKind, npc.lines]);

  const safeIndex = visibleLines.length > 0 ? lineIndex % visibleLines.length : 0;
  const activeLine = visibleLines[safeIndex] ?? npc.lines[0];

  const handleNextLine = () => {
    if (visibleLines.length <= 1) return;
    setLineIndex((prev) => (prev + 1) % visibleLines.length);
  };

  const handleSwitchFilter = (nextKind: 'all' | 'tip' | 'fact') => {
    setFilterKind(nextKind);
    setLineIndex(0);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#1E293B]/50 p-4">
      <div className="w-full max-w-lg bg-[#FFFDF9] border border-[#E2D5C3] rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-[#E2D5C3] bg-[#FAF4E8]">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0 border border-black/10"
              style={{ backgroundColor: npc.shirtColor }}
            >
              {npc.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h2
                className="text-xl font-bold text-[#1E293B] leading-tight truncate"
                style={{ fontFamily: '"Fraunces", Georgia, serif' }}
              >
                {npc.name}
              </h2>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#64748B] mt-0.5">
                <span className="font-semibold text-[#7C5A3C]">{npc.roleLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{npc.areaLabel}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close conversation"
            className="p-2 rounded-lg hover:bg-[#EFE6D8] text-[#475569] cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Greeting line */}
          <p className="text-sm italic text-[#475569] leading-relaxed">
            “{npc.greeting}”
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1 p-1 bg-[#EFE6D8] rounded-lg">
              <button
                type="button"
                onClick={() => handleSwitchFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterKind === 'all'
                    ? 'bg-[#FFFDF9] text-[#1E293B] shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                All ({npc.lines.length})
              </button>
              <button
                type="button"
                onClick={() => handleSwitchFilter('tip')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterKind === 'tip'
                    ? 'bg-[#FFFDF9] text-[#1E293B] shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                Local Tips
              </button>
              <button
                type="button"
                onClick={() => handleSwitchFilter('fact')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterKind === 'fact'
                    ? 'bg-[#FFFDF9] text-[#1E293B] shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                Delhi Facts
              </button>
            </div>

            <span className="text-xs font-mono tabular-nums text-[#64748B]">
              {safeIndex + 1} / {visibleLines.length}
            </span>
          </div>

          {/* Active Tip or Fact Card */}
          <div className="p-4 bg-[#FAF4E8] border border-[#E2D5C3] rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C84B31]">
              {activeLine.kind === 'tip' ? (
                <>
                  <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                  <span>Explorer Tip</span>
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5 shrink-0" />
                  <span>Delhi NCR Fact</span>
                </>
              )}
            </div>
            <p className="text-[15px] text-[#1E293B] leading-relaxed">{activeLine.text}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#E2D5C3] bg-[#FFFDF9]">
          <button
            type="button"
            onClick={handleNextLine}
            disabled={visibleLines.length <= 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF4E8] hover:bg-[#EFE6D8] disabled:opacity-50 border border-[#D6C7B2] text-[#1E293B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C84B31]" />
            <span>Another Tip / Fact</span>
          </button>

          <button
            type="button"
            onClick={() => onSayThanks(npc)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#C84B31] hover:bg-[#B03E26] text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {npc.role === 'vendor' ? (
              <Sparkles className="w-3.5 h-3.5" />
            ) : (
              <MessageCircle className="w-3.5 h-3.5" />
            )}
            <span>Shukriya & Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
