import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Radio,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  DELHI_RADIO_STATIONS,
  getRadioStationById,
  type RadioStationId,
} from '../data/delhiRadio';

interface DelhiRadioWidgetProps {
  stationId: RadioStationId;
  isPlaying: boolean;
  autoTune: boolean;
  volume: number;
  globalMuted: boolean;
  currentZoneName: string;
  onTogglePlay: () => void;
  onSelectStation: (id: RadioStationId) => void;
  onStepStation: (delta: -1 | 1) => void;
  onToggleAutoTune: () => void;
  onChangeVolume: (vol: number) => void;
}

export const DelhiRadioWidget: React.FC<DelhiRadioWidgetProps> = ({
  stationId,
  isPlaying,
  autoTune,
  volume,
  globalMuted,
  currentZoneName,
  onTogglePlay,
  onSelectStation,
  onStepStation,
  onToggleAutoTune,
  onChangeVolume,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const station = getRadioStationById(stationId);
  const activeSound = isPlaying && !globalMuted;

  return (
    <div className="pointer-events-auto relative">
      {/* Compact Top-Left Radio Bar */}
      <div className="bg-[#FFFDF9] border border-[#E2D5C3] rounded-xl px-2.5 py-1.5 shadow-xs flex items-center gap-2 max-w-[330px] sm:max-w-[380px]">
        <button
          type="button"
          onClick={onTogglePlay}
          title={isPlaying ? 'Pause Delhi Radio (R)' : 'Play Delhi Radio (R)'}
          aria-label={isPlaying ? 'Pause Delhi Radio' : 'Play Delhi Radio'}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 transition-colors cursor-pointer"
          style={{ backgroundColor: isPlaying ? station.accentColor : '#64748B' }}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        <button
          type="button"
          onClick={() => setDrawerOpen((v) => !v)}
          className="flex items-center gap-2 min-w-0 text-left hover:opacity-85 transition-opacity cursor-pointer"
          title="Open Delhi Radio Station Dial"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs leading-tight">
              <span
                className="font-mono font-bold tabular-nums shrink-0"
                style={{ color: station.accentColor }}
              >
                {station.frequency}
              </span>
              <span className="font-bold text-[#1E293B] truncate">{station.name}</span>
            </div>
            <div className="text-[10px] text-[#64748B] truncate leading-tight">
              {globalMuted
                ? 'Muted in HUD'
                : isPlaying
                  ? `${station.genre} · ${autoTune ? currentZoneName : 'Manual'}`
                  : 'Delhi Radio paused · Press R'}
            </div>
          </div>
        </button>

        {/* Live Equalizer Bars */}
        <div className="flex items-end gap-0.5 h-3.5 px-1 shrink-0" aria-hidden="true">
          <span
            className={`w-0.5 rounded-sm transition-all ${activeSound ? 'animate-pulse' : ''}`}
            style={{
              height: activeSound ? '100%' : '35%',
              backgroundColor: activeSound ? station.accentColor : '#CBD5E1',
            }}
          />
          <span
            className={`w-0.5 rounded-sm transition-all ${activeSound ? 'animate-pulse' : ''}`}
            style={{
              height: activeSound ? '60%' : '35%',
              animationDelay: '150ms',
              backgroundColor: activeSound ? station.accentColor : '#CBD5E1',
            }}
          />
          <span
            className={`w-0.5 rounded-sm transition-all ${activeSound ? 'animate-pulse' : ''}`}
            style={{
              height: activeSound ? '85%' : '35%',
              animationDelay: '300ms',
              backgroundColor: activeSound ? station.accentColor : '#CBD5E1',
            }}
          />
        </div>

        <div className="flex items-center border-l border-[#EFE6D8] pl-1 shrink-0">
          <button
            type="button"
            onClick={() => onStepStation(-1)}
            aria-label="Previous radio station"
            title="Previous station"
            className="p-1 rounded hover:bg-[#EFE6D8] text-[#475569] cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onStepStation(1)}
            aria-label="Next radio station"
            title="Next station"
            className="p-1 rounded hover:bg-[#EFE6D8] text-[#475569] cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen((v) => !v)}
            aria-label="Tune Delhi Radio stations"
            title="Open Delhi Radio Dial"
            className={`p-1 rounded transition-colors cursor-pointer ${
              drawerOpen
                ? 'bg-[#EFE6D8] text-[#1E293B]'
                : 'hover:bg-[#EFE6D8] text-[#475569]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Delhi Radio Tuner Popover */}
      {drawerOpen && (
        <div className="absolute left-0 top-12 w-80 bg-[#FFFDF9] border border-[#E2D5C3] rounded-xl p-3.5 shadow-lg z-30 space-y-3">
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#EFE6D8]">
            <div>
              <div className="text-xs font-bold text-[#1E293B] flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" style={{ color: station.accentColor }} />
                <span>Delhi Radio · {station.frequency}</span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                {station.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close Delhi Radio dial"
              className="p-1 hover:bg-[#EFE6D8] rounded text-[#64748B] cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Volume + Auto-Tune Controls */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {globalMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#475569] shrink-0" />
              )}
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(volume * 100)}
                onChange={(e) => onChangeVolume(Number(e.target.value) / 100)}
                aria-label="Delhi Radio volume"
                className="w-full accent-[#C84B31] cursor-pointer"
              />
              <span className="text-[10px] font-mono tabular-nums text-[#64748B] w-7 text-right shrink-0">
                {Math.round(volume * 100)}%
              </span>
            </div>

            <button
              type="button"
              onClick={onToggleAutoTune}
              title="Automatically switch stations as you enter new Delhi NCR areas"
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                autoTune
                  ? 'bg-[#DCFCE7] border-[#15803D]/40 text-[#15803D]'
                  : 'bg-[#FAF4E8] border-[#D6C7B2] text-[#475569]'
              }`}
            >
              {autoTune ? 'Auto Area: ON' : 'Auto Area: OFF'}
            </button>
          </div>

          {/* Station List */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto ncr-scroll pr-0.5">
            {DELHI_RADIO_STATIONS.map((st) => {
              const active = st.id === stationId;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onSelectStation(st.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#FAF4E8] border-[#C84B31]'
                      : 'bg-white hover:bg-[#FAF4E8]/70 border-[#E2D5C3]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#1E293B] truncate">
                      {st.name}
                    </span>
                    <span
                      className="text-[11px] font-mono font-bold tabular-nums shrink-0"
                      style={{ color: st.accentColor }}
                    >
                      {st.frequency}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-[#7C5A3C] mt-0.5 truncate">
                    {st.genre}
                  </div>
                  <div className="text-[10px] text-[#64748B] mt-0.5 truncate">
                    {st.areaSummary}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
