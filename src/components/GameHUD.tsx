import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  Camera,
  CloudFog,
  CloudRain,
  Coins,
  Compass,
  Eye,
  Landmark,
  MessageCircle,
  MessageSquare,
  Minus,
  Navigation,
  Pause,
  Plus,
  Send,
  ShoppingBag,
  Sun,
  TrainFront,
  Users,
  Utensils,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  HERITAGE_SITES,
  QUICK_EMOTES,
  RESTAURANTS,
  SHOPPING_MALLS,
  TRANSPORT_OPTIONS,
  WEATHER_CONFIGS,
  WEATHER_SEQUENCE,
  type NcrDestinationItem,
} from '../data/delhiWorld';
import { MiniMap } from './MiniMap';
import { TopExplorersLeaderboard } from './TopExplorersLeaderboard';
import { DelhiRadioWidget } from './DelhiRadioWidget';
import { getExplorerLevelState } from '../data/explorerLevels';
import type { RadioStationId } from '../data/delhiRadio';
import type {
  ActiveGigState,
  ActivePoiTarget,
  ChatMessage,
  PlayerProgress,
  RemotePlayer,
  RideDispatchTarget,
  TransportMode,
  WaypointPin,
  WeatherType,
} from '../types/game';
import type { ConnectionStatus } from '../hooks/useMultiplayer';

interface GameHUDProps {
  playerName: string;
  playerColor: string;
  playerPosRef: React.MutableRefObject<{ x: number; y: number; facing: number }>;
  currentZoneName: string;
  progress: PlayerProgress;
  nearestPoi: ActivePoiTarget | null;
  waypointPin: WaypointPin | null;
  transportMode: TransportMode;
  activeRide: RideDispatchTarget | null;
  activeGig: ActiveGigState | null;
  onCancelRide: () => void;
  onCancelGig: () => void;
  onNavigateGig: (dest: NcrDestinationItem) => void;
  onClearWaypoint: () => void;
  onInteractPoi: (poi: ActivePoiTarget) => void;
  onOpenEarn: () => void;
  onOpenTransport: () => void;
  onOpen3DSights: () => void;
  onOpenDirectory: () => void;
  onOpenPassport: () => void;
  onOpenLevelModal: () => void;
  onOpenPhotoMode: () => void;
  onOpenPause: () => void;
  onMapClickNavigate: (worldX: number, worldY: number) => void;
  muted: boolean;
  onToggleMute: () => void;
  onZoom: (delta: number) => void;
  roomCode: string;
  connectionStatus: ConnectionStatus;
  remotePlayers: RemotePlayer[];
  remotePlayersMapRef: React.MutableRefObject<Map<string, RemotePlayer>>;
  chatMessages: ChatMessage[];
  onSendChat: (text: string) => void;
  onSendEmote: (label: string) => void;
  toastText: string | null;
  touchMoveVectorRef: React.MutableRefObject<{ dx: number; dy: number; sprint: boolean }>;
  weather: WeatherType;
  weatherAutoCycle: boolean;
  weatherSecondsLeft: number;
  onSelectWeather: (w: WeatherType) => void;
  onToggleWeatherAuto: () => void;
  radioStationId: RadioStationId;
  radioPlaying: boolean;
  radioAutoTune: boolean;
  radioVolume: number;
  onToggleRadio: () => void;
  onSelectRadioStation: (id: RadioStationId) => void;
  onStepRadioStation: (delta: -1 | 1) => void;
  onToggleRadioAutoTune: () => void;
  onChangeRadioVolume: (vol: number) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  playerName,
  playerColor,
  playerPosRef,
  currentZoneName,
  progress,
  nearestPoi,
  waypointPin,
  transportMode,
  activeRide,
  activeGig,
  onCancelRide,
  onCancelGig,
  onNavigateGig,
  onClearWaypoint,
  onInteractPoi,
  onOpenEarn,
  onOpenTransport,
  onOpen3DSights,
  onOpenDirectory,
  onOpenPassport,
  onOpenLevelModal,
  onOpenPhotoMode,
  onOpenPause,
  onMapClickNavigate,
  muted,
  onToggleMute,
  onZoom,
  roomCode,
  connectionStatus,
  remotePlayers,
  remotePlayersMapRef,
  chatMessages,
  onSendChat,
  onSendEmote,
  toastText,
  touchMoveVectorRef,
  weather,
  weatherAutoCycle,
  weatherSecondsLeft,
  onSelectWeather,
  onToggleWeatherAuto,
  radioStationId,
  radioPlaying,
  radioAutoTune,
  radioVolume,
  onToggleRadio,
  onSelectRadioStation,
  onStepRadioStation,
  onToggleRadioAutoTune,
  onChangeRadioVolume,
}) => {
  const [chatOpen, setChatOpen] = useState(true);
  const [rosterOpen, setRosterOpen] = useState(false);
  const [weatherOpen, setWeatherOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const weatherCfg = WEATHER_CONFIGS[weather];
  const WeatherIcon =
    weather === 'sunny' ? Sun : weather === 'smoggy' ? CloudFog : CloudRain;
  const speedPct = Math.round(weatherCfg.speedMultiplier * 100);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChat(chatInput);
    setChatInput('');
  };

  const energyPct = Math.max(0, Math.min(100, Math.round((progress.energy / progress.maxEnergy) * 100)));
  const levelState = getExplorerLevelState(progress.xp);
  const activeTitle = progress.equippedTitle || levelState.defaultTitle;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-3 md:p-4">
      {/* Top Perimeter Row */}
      <div className="flex items-start justify-between gap-3">
        {/* Top-Left Status Cluster + Weather Card + Delhi Radio */}
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-start gap-2 relative">
          <div className="pointer-events-auto bg-[#FFFDF9] border border-[#E2D5C3] rounded-xl px-3.5 py-2.5 shadow-xs flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-2.5">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 border border-white shadow-xs"
                style={{ backgroundColor: playerColor }}
              />
              <div>
                <div className="text-xs font-bold text-[#1E293B] leading-tight">
                  {playerName}
                </div>
                <div className="text-[11px] font-medium text-[#7C5A3C] leading-tight">
                  {currentZoneName} · {activeTitle}
                </div>
              </div>
            </div>

            <div className="h-6 w-px bg-[#E2D5C3] hidden sm:block" />

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <button
                type="button"
                onClick={onOpenLevelModal}
                title="Explorer Rank, Titles & Map Perks (L)"
                className="flex items-center gap-2 hover:bg-[#EFE6D8] px-2 py-1 -mx-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Award className="w-3.5 h-3.5 text-[#C84B31] shrink-0" />
                <span className="font-mono font-bold tabular-nums text-[#C84B31]">
                  Lv.{levelState.level}
                </span>
                <div className="w-16 h-2 bg-[#EFE6D8] rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-200"
                    style={{
                      width: `${levelState.progressPct}%`,
                      backgroundColor: '#C84B31',
                    }}
                  />
                </div>
                <span className="font-mono font-medium tabular-nums text-[#64748B] text-[11px]">
                  {levelState.xpIntoLevel}/{levelState.xpNeededForLevel} XP
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenEarn}
                title="Open Earn Rupees (M)"
                className="hover:bg-[#EFE6D8] px-1.5 py-0.5 -mx-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span className="text-[#64748B] mr-1">Wallet</span>
                <span className="font-mono font-semibold tabular-nums text-[#15803D]">
                  ₹{progress.rupees}
                </span>
              </button>

              <div className="flex items-center gap-1.5">
                <span className="text-[#64748B]">Energy</span>
                <div className="w-16 h-2 bg-[#EFE6D8] rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-150"
                    style={{
                      width: `${energyPct}%`,
                      backgroundColor: energyPct > 30 ? '#D97706' : '#DC2626',
                    }}
                  />
                </div>
                <span className="font-mono font-medium tabular-nums text-[#1E293B]">
                  {Math.round(progress.energy)}
                </span>
              </div>

              <div className="hidden md:flex items-center gap-2 text-[#475569] tabular-nums">
                <span>
                  Stamps {progress.stampedHeritages.length}/{HERITAGE_SITES.length}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Malls {progress.visitedMalls.length}/{SHOPPING_MALLS.length}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Eateries {progress.tastedRestaurants.length}/{RESTAURANTS.length}
                </span>
              </div>
            </div>
          </div>

          <div className="pointer-events-auto relative">
            <button
              type="button"
              onClick={() => setWeatherOpen((v) => !v)}
              title="NCR Weather Forecast & Speed Impact (C to cycle)"
              className="flex items-center gap-2 px-3 py-2 bg-[#FFFDF9] hover:bg-[#F7EFE3] border border-[#E2D5C3] rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
            >
              <span
                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: weatherCfg.badgeBg, color: weatherCfg.badgeText }}
              >
                <WeatherIcon className="w-3.5 h-3.5" />
              </span>
              <div className="text-left leading-tight">
                <div className="font-bold text-[#1E293B]">{weatherCfg.shortLabel}</div>
                <div
                  className="text-[10px] font-mono font-semibold tabular-nums"
                  style={{ color: speedPct < 100 ? weatherCfg.badgeText : '#15803D' }}
                >
                  {speedPct}% Spd
                </div>
              </div>
            </button>

            {weatherOpen && (
              <div className="absolute left-0 top-12 w-72 bg-[#FFFDF9] border border-[#E2D5C3] rounded-xl p-3.5 shadow-lg z-30 space-y-3">
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#EFE6D8]">
                  <div>
                    <div className="text-xs font-bold text-[#1E293B] flex items-center gap-1.5">
                      <WeatherIcon className="w-3.5 h-3.5" style={{ color: weatherCfg.accentColor }} />
                      <span>NCR Weather · {weatherCfg.label}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                      {weatherCfg.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWeatherOpen(false)}
                    aria-label="Close weather forecast"
                    className="p-1 hover:bg-[#EFE6D8] rounded text-[#64748B] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {WEATHER_SEQUENCE.map((wKey) => {
                    const cfg = WEATHER_CONFIGS[wKey];
                    const Icon = wKey === 'sunny' ? Sun : wKey === 'smoggy' ? CloudFog : CloudRain;
                    const active = weather === wKey;
                    return (
                      <button
                        key={wKey}
                        type="button"
                        onClick={() => onSelectWeather(wKey)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#FAF4E8] border-[#C84B31] text-[#1E293B]'
                            : 'bg-white hover:bg-[#FAF4E8]/60 border-[#E2D5C3] text-[#475569]'
                        }`}
                      >
                        <Icon className="w-4 h-4" style={{ color: cfg.accentColor }} />
                        <span>{cfg.shortLabel}</span>
                        <span className="text-[10px] font-mono tabular-nums text-[#64748B]">
                          {Math.round(cfg.speedMultiplier * 100)}%
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-[#EFE6D8] text-[11px]">
                  <span className="text-[#64748B] tabular-nums">
                    {weatherAutoCycle ? `Next cycle in ${weatherSecondsLeft}s` : 'Auto-cycle paused'}
                  </span>
                  <button
                    type="button"
                    onClick={onToggleWeatherAuto}
                    className={`px-2 py-1 rounded-md font-semibold border cursor-pointer transition-colors ${
                      weatherAutoCycle
                        ? 'bg-[#DCFCE7] border-[#15803D]/40 text-[#15803D]'
                        : 'bg-[#EFE6D8] border-[#D6C7B2] text-[#475569]'
                    }`}
                  >
                    {weatherAutoCycle ? 'Auto: ON' : 'Auto: OFF'}
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>

          <DelhiRadioWidget
            stationId={radioStationId}
            isPlaying={radioPlaying}
            autoTune={radioAutoTune}
            volume={radioVolume}
            globalMuted={muted}
            currentZoneName={currentZoneName}
            onTogglePlay={onToggleRadio}
            onSelectStation={onSelectRadioStation}
            onStepStation={onStepRadioStation}
            onToggleAutoTune={onToggleRadioAutoTune}
            onChangeVolume={onChangeRadioVolume}
          />
        </div>

        {/* Top-Right Action & Room Cluster + Top Explorers Leaderboard */}
        <div className="flex flex-col items-end gap-2">
          <div className="pointer-events-auto flex items-center gap-2 relative">
          <button
            type="button"
            onClick={() => setRosterOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FFFDF9] hover:bg-[#F7EFE3] border border-[#E2D5C3] rounded-xl text-xs font-semibold text-[#1E293B] shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-[#C84B31]" />
            <span className="font-mono">{roomCode}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{remotePlayers.length + 1}</span>
          </button>

          <button
            type="button"
            onClick={onOpenEarn}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#15803D] hover:bg-[#166534] border border-[#166534] rounded-xl text-xs font-bold text-white shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Earn ₹</span>
          </button>

          <button
            type="button"
            onClick={onOpenTransport}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#EAB308] hover:bg-[#CA8A04] border border-[#CA8A04] rounded-xl text-xs font-bold text-[#422006] shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Book Ride</span>
            {transportMode !== 'walk' && (
              <span className="hidden sm:inline font-mono text-[10px] uppercase">
                · {transportMode}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpen3DSights}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FFFDF9] hover:bg-[#F7EFE3] border border-[#E2D5C3] rounded-xl text-xs font-semibold text-[#1E293B] shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#B45309]" />
            <span className="hidden sm:inline">3D Sights</span>
            <span className="sm:hidden">3D</span>
          </button>

          <button
            type="button"
            onClick={onOpenDirectory}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FFFDF9] hover:bg-[#F7EFE3] border border-[#E2D5C3] rounded-xl text-xs font-semibold text-[#1E293B] shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="hidden sm:inline">NCR Directory</span>
            <span className="sm:hidden">Map</span>
          </button>

          <button
            type="button"
            onClick={onOpenPassport}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FFFDF9] hover:bg-[#F7EFE3] border border-[#E2D5C3] rounded-xl text-xs font-semibold text-[#1E293B] shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="hidden sm:inline">Daily & Passport</span>
            <span className="sm:hidden">Daily</span>
            <span className="font-mono tabular-nums text-[#C84B31]">
              {progress.dailyMissions.completedIds.length}/{progress.dailyMissions.missions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenPhotoMode}
            title="Photo Mode · Capture Dilli Darshan Postcard (F)"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FFFDF9] hover:bg-[#F7EFE3] border border-[#E2D5C3] rounded-xl text-xs font-semibold text-[#1E293B] shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-[#C84B31]" />
            <span className="hidden sm:inline">Photo</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? 'Unmute audio' : 'Mute audio'}
            className="p-2 bg-[#FFFDF9] hover:bg-[#F7EFE3] border border-[#E2D5C3] rounded-xl text-[#1E293B] shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenPause}
            aria-label="Pause menu"
            className="p-2 bg-[#FFFDF9] hover:bg-[#F7EFE3] border border-[#E2D5C3] rounded-xl text-[#1E293B] shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Pause className="w-4 h-4" />
          </button>

          {/* Active Players Popover */}
          {rosterOpen && (
            <div className="absolute right-0 top-12 w-64 bg-[#FFFDF9] border border-[#E2D5C3] rounded-xl p-3 shadow-md z-30">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#EFE6D8]">
                <span className="text-xs font-bold text-[#1E293B]">
                  Explorers in {roomCode}
                </span>
                <span className="text-[11px] text-[#64748B] capitalize">{connectionStatus}</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto ncr-scroll text-xs">
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: playerColor }}
                    />
                    <span className="font-semibold text-[#1E293B] truncate">{playerName} (You)</span>
                  </div>
                  <span className="text-[11px] text-[#64748B] shrink-0">{currentZoneName}</span>
                </div>
                {remotePlayers.map((rp) => (
                  <div key={rp.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: rp.color }}
                      />
                      <span className="font-medium text-[#1E293B] truncate">{rp.name}</span>
                    </div>
                    <span className="text-[11px] text-[#64748B] shrink-0 truncate max-w-[100px]">
                      {rp.zoneName}
                    </span>
                  </div>
                ))}
                {remotePlayers.length === 0 && (
                  <p className="text-[11px] text-[#64748B] pt-1">
                    Share room code <span className="font-mono font-semibold">{roomCode}</span> for
                    others to join you live.
                  </p>
                )}
              </div>
            </div>
          )}
          </div>

          <TopExplorersLeaderboard
            selfName={playerName}
            selfColor={playerColor}
            selfGigs={progress.gigsCompleted}
            selfStamps={progress.stampedHeritages.length}
            remotePlayers={remotePlayers}
            roomCode={roomCode}
          />
        </div>
      </div>

      {/* Transient Top-Center Notification Banner */}
      <div className="flex flex-col items-center gap-2 pointer-events-none">
        {toastText && (
          <div className="bg-[#1E293B] text-[#FFFDF9] px-4 py-2 rounded-xl text-xs font-medium shadow-sm">
            {toastText}
          </div>
        )}
        {activeRide && (
          <div className="pointer-events-auto flex items-center gap-2.5 bg-[#FFFDF9] border border-[#15803D] px-3.5 py-1.5 rounded-xl text-xs text-[#1E293B] shadow-xs">
            <Navigation className="w-3.5 h-3.5 text-[#15803D]" />
            <span>
              En route via <strong>{TRANSPORT_OPTIONS[activeRide.mode].label}</strong> to{' '}
              <strong>{activeRide.name}</strong>
            </span>
            <button
              type="button"
              onClick={onCancelRide}
              className="px-2 py-0.5 bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] rounded text-[11px] font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
        {activeGig && (
          <div className="pointer-events-auto flex flex-wrap items-center gap-2 bg-[#FFFDF9] border border-[#D97706] px-3.5 py-1.5 rounded-xl text-xs text-[#1E293B] shadow-xs">
            <Briefcase className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
            <span>
              {activeGig.stage === 'pickup' ? 'Pick up at' : 'Deliver to'}{' '}
              <strong>
                {activeGig.stage === 'pickup'
                  ? activeGig.contract.pickupName
                  : activeGig.contract.dropoffName}
              </strong>{' '}
              <span className="font-mono font-semibold text-[#15803D] tabular-nums">
                (+₹{activeGig.contract.rewardRupees})
              </span>
            </span>
            <button
              type="button"
              onClick={() =>
                onNavigateGig({
                  id:
                    activeGig.stage === 'pickup'
                      ? activeGig.contract.pickupId
                      : activeGig.contract.dropoffId,
                  name:
                    activeGig.stage === 'pickup'
                      ? activeGig.contract.pickupName
                      : activeGig.contract.dropoffName,
                  subtitle: activeGig.contract.title,
                  kind: 'place',
                  x:
                    activeGig.stage === 'pickup'
                      ? activeGig.contract.pickupX
                      : activeGig.contract.dropoffX,
                  y:
                    activeGig.stage === 'pickup'
                      ? activeGig.contract.pickupY
                      : activeGig.contract.dropoffY,
                })
              }
              className="px-2 py-0.5 bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] rounded text-[11px] font-semibold cursor-pointer"
            >
              Ride
            </button>
            <button
              type="button"
              onClick={onCancelGig}
              className="px-2 py-0.5 bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] rounded text-[11px] font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
        {waypointPin && (
          <div className="pointer-events-auto flex items-center gap-2 bg-[#FFFDF9] border border-[#C84B31] px-3 py-1.5 rounded-xl text-xs text-[#1E293B] shadow-xs">
            <Compass className="w-3.5 h-3.5 text-[#C84B31]" />
            <span>
              Compass pinned: <strong>{waypointPin.name}</strong>
            </span>
            <button
              type="button"
              onClick={onClearWaypoint}
              className="p-0.5 hover:bg-[#EFE6D8] rounded cursor-pointer"
              aria-label="Clear compass pin"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Perimeter Row */}
      <div className="flex items-end justify-between gap-3">
        {/* Bottom-Left Live Room Chat */}
        <div className="pointer-events-auto w-72 sm:w-80">
          {chatOpen ? (
            <div className="bg-[#FFFDF9] border border-[#E2D5C3] rounded-xl overflow-hidden shadow-xs">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#EFE6D8]">
                <span className="text-xs font-bold text-[#1E293B]">Room Chat</span>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="text-[11px] font-medium text-[#64748B] hover:text-[#1E293B] cursor-pointer"
                >
                  Minimize
                </button>
              </div>
              <div className="h-32 overflow-y-auto px-3 py-2 space-y-1.5 ncr-scroll text-xs">
                {chatMessages.length === 0 ? (
                  <p className="text-[#64748B]">Say hello to fellow NCR explorers.</p>
                ) : (
                  chatMessages.map((m) => (
                    <div key={m.id} className="leading-snug">
                      {m.kind === 'chat' ? (
                        <>
                          <span className="font-semibold" style={{ color: m.senderColor }}>
                            {m.senderName}:{' '}
                          </span>
                          <span className="text-[#1E293B]">{m.text}</span>
                        </>
                      ) : (
                        <span className="text-[#64748B] italic">{m.text}</span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Quick Emotes */}
              <div className="flex items-center gap-1 px-2.5 py-1.5 border-t border-[#EFE6D8] bg-[#FAF4E8] overflow-x-auto">
                {QUICK_EMOTES.map((em) => (
                  <button
                    key={em.id}
                    type="button"
                    onClick={() => onSendEmote(em.label)}
                    className="px-2 py-1 text-[11px] font-medium bg-white hover:bg-[#EFE6D8] border border-[#E2D5C3] rounded-md text-[#1E293B] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {em.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleChatSubmit} className="flex items-center border-t border-[#E2D5C3]">
                <input
                  type="text"
                  value={chatInput}
                  maxLength={140}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Chat with room..."
                  className="flex-1 px-3 py-2 text-xs bg-white text-[#1E293B] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="px-3 py-2 text-[#C84B31] hover:bg-[#FAF4E8] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#FFFDF9] hover:bg-[#F7EFE3] border border-[#E2D5C3] rounded-xl text-xs font-semibold text-[#1E293B] shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#C84B31]" />
              <span>Chat ({chatMessages.length})</span>
            </button>
          )}
        </div>

        {/* Bottom-Center Contextual Interaction Prompt */}
        <div className="flex flex-col items-center gap-2">
          {nearestPoi && (
            <button
              type="button"
              onClick={() => onInteractPoi(nearestPoi)}
              className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 bg-[#C84B31] hover:bg-[#B03E26] text-white rounded-xl text-xs font-semibold shadow-sm transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {nearestPoi.kind === 'metro' && <TrainFront className="w-4 h-4" />}
              {nearestPoi.kind === 'heritage' && <Landmark className="w-4 h-4" />}
              {nearestPoi.kind === 'restaurant' && <Utensils className="w-4 h-4" />}
              {nearestPoi.kind === 'mall' && <ShoppingBag className="w-4 h-4" />}
              {nearestPoi.kind === 'npc' && <MessageCircle className="w-4 h-4" />}
              <span>
                Press E ·{' '}
                {nearestPoi.kind === 'metro'
                  ? `Ride Metro (${nearestPoi.name})`
                  : nearestPoi.kind === 'heritage'
                    ? `Visit ${nearestPoi.name}`
                    : nearestPoi.kind === 'mall'
                      ? `Explore ${nearestPoi.name}`
                      : nearestPoi.kind === 'npc'
                        ? `Talk to ${nearestPoi.name}`
                        : `Menu at ${nearestPoi.name}`}
              </span>
            </button>
          )}
          <div className="hidden lg:block bg-[#FFFDF9]/95 border border-[#E2D5C3] rounded-lg px-3 py-1 text-[11px] font-medium text-[#64748B]">
            WASD / Click Move · Shift Sprint · E Interact · T Ride · L Rank · C Weather · R Radio · F Photo · M Earn ₹ · V 3D Sights · Tab Directory
          </div>
        </div>

        {/* Bottom-Right GPS Radar, Touch Controls & Zoom */}
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <MiniMap
            playerPosRef={playerPosRef}
            playerColor={playerColor}
            currentZoneName={currentZoneName}
            transportMode={activeRide ? activeRide.mode : transportMode}
            remotePlayersMapRef={remotePlayersMapRef}
            waypointPin={waypointPin}
            activeRide={activeRide}
            activeGig={activeGig}
            onMapClickNavigate={onMapClickNavigate}
          />

          {/* Compact mobile touch pad */}
          <div className="grid grid-cols-3 gap-1 md:hidden bg-[#FFFDF9] border border-[#E2D5C3] p-1.5 rounded-xl">
            <div />
            <button
              type="button"
              onPointerDown={() => (touchMoveVectorRef.current = { dx: 0, dy: -1, sprint: false })}
              onPointerUp={() => (touchMoveVectorRef.current = { dx: 0, dy: 0, sprint: false })}
              onPointerLeave={() => (touchMoveVectorRef.current = { dx: 0, dy: 0, sprint: false })}
              className="w-9 h-9 bg-[#EFE6D8] rounded-lg text-xs font-bold"
            >
              ▲
            </button>
            <div />
            <button
              type="button"
              onPointerDown={() => (touchMoveVectorRef.current = { dx: -1, dy: 0, sprint: false })}
              onPointerUp={() => (touchMoveVectorRef.current = { dx: 0, dy: 0, sprint: false })}
              onPointerLeave={() => (touchMoveVectorRef.current = { dx: 0, dy: 0, sprint: false })}
              className="w-9 h-9 bg-[#EFE6D8] rounded-lg text-xs font-bold"
            >
              ◀
            </button>
            <button
              type="button"
              onPointerDown={() => (touchMoveVectorRef.current = { dx: 0, dy: 1, sprint: false })}
              onPointerUp={() => (touchMoveVectorRef.current = { dx: 0, dy: 0, sprint: false })}
              onPointerLeave={() => (touchMoveVectorRef.current = { dx: 0, dy: 0, sprint: false })}
              className="w-9 h-9 bg-[#EFE6D8] rounded-lg text-xs font-bold"
            >
              ▼
            </button>
            <button
              type="button"
              onPointerDown={() => (touchMoveVectorRef.current = { dx: 1, dy: 0, sprint: false })}
              onPointerUp={() => (touchMoveVectorRef.current = { dx: 0, dy: 0, sprint: false })}
              onPointerLeave={() => (touchMoveVectorRef.current = { dx: 0, dy: 0, sprint: false })}
              className="w-9 h-9 bg-[#EFE6D8] rounded-lg text-xs font-bold"
            >
              ▶
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#FFFDF9] border border-[#E2D5C3] rounded-xl p-1 shadow-xs">
            <button
              type="button"
              onClick={() => onZoom(-0.15)}
              aria-label="Zoom out"
              className="p-1.5 hover:bg-[#EFE6D8] rounded-lg text-[#1E293B] cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onZoom(0.15)}
              aria-label="Zoom in"
              className="p-1.5 hover:bg-[#EFE6D8] rounded-lg text-[#1E293B] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
