import React, { useMemo, useState } from 'react';
import {
  Bike,
  Car,
  Check,
  Footprints,
  Landmark,
  MapPin,
  Navigation,
  Search,
  ShoppingBag,
  TrainFront,
  Utensils,
  X,
} from 'lucide-react';
import {
  TRANSPORT_OPTIONS,
  TRANSPORT_ORDER,
  WEATHER_CONFIGS,
  calculateRideEstimate,
  getAllNcrDestinations,
  type NcrDestinationItem,
} from '../data/delhiWorld';
import { applyFareDiscount } from '../data/explorerLevels';
import type { PoiKind, RideDispatchTarget, TransportMode, WeatherType } from '../types/game';

interface TransportModalProps {
  playerX: number;
  playerY: number;
  rupees: number;
  currentMode: TransportMode;
  weather: WeatherType;
  hasFareSaver?: boolean;
  initialDestination?: NcrDestinationItem | null;
  onBookRide: (target: RideDispatchTarget) => void;
  onSwitchFreeRoamMode: (mode: TransportMode, passCost: number) => void;
  onClose: () => void;
}

type CategoryFilter = 'all' | PoiKind;

const KIND_LABELS: Record<CategoryFilter, string> = {
  all: 'All Locations',
  place: 'Places',
  heritage: 'Heritages',
  mall: 'Malls',
  restaurant: 'Food',
  metro: 'Metro',
};

function ModeIcon({ mode, className }: { mode: TransportMode; className?: string }) {
  if (mode === 'walk') return <Footprints className={className} />;
  if (mode === 'bike') return <Bike className={className} />;
  if (mode === 'auto') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M5 16V9a5 5 0 0 1 5-5h4l4 5v7" />
        <path d="M3 16h18" />
        <circle cx="7" cy="17.5" r="2" />
        <circle cx="17" cy="17.5" r="2" />
      </svg>
    );
  }
  return <Car className={className} />;
}

function PoiKindIcon({ kind }: { kind: PoiKind }) {
  if (kind === 'metro') return <TrainFront className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />;
  if (kind === 'heritage') return <Landmark className="w-3.5 h-3.5 text-[#B45309] shrink-0" />;
  if (kind === 'mall') return <ShoppingBag className="w-3.5 h-3.5 text-[#0369A1] shrink-0" />;
  if (kind === 'restaurant') return <Utensils className="w-3.5 h-3.5 text-[#C84B31] shrink-0" />;
  return <MapPin className="w-3.5 h-3.5 text-[#15803D] shrink-0" />;
}

export const TransportModal: React.FC<TransportModalProps> = ({
  playerX,
  playerY,
  rupees,
  currentMode,
  weather,
  hasFareSaver = false,
  initialDestination,
  onBookRide,
  onSwitchFreeRoamMode,
  onClose,
}) => {
  const weatherCfg = WEATHER_CONFIGS[weather];
  const allDestinations = useMemo(() => getAllNcrDestinations(), []);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [selectedDest, setSelectedDest] = useState<NcrDestinationItem | null>(
    () => initialDestination ?? allDestinations[0] ?? null
  );
  const [selectedMode, setSelectedMode] = useState<TransportMode>(
    currentMode === 'walk' ? 'bike' : currentMode
  );

  const q = query.trim().toLowerCase();

  const filteredDestinations = useMemo(() => {
    return allDestinations
      .filter((d) => {
        if (category !== 'all' && d.kind !== category) return false;
        if (!q) return true;
        return d.name.toLowerCase().includes(q) || d.subtitle.toLowerCase().includes(q);
      })
      .map((d) => ({
        ...d,
        distPx: Math.hypot(d.x - playerX, d.y - playerY),
      }))
      .sort((a, b) => a.distPx - b.distPx);
  }, [allDestinations, category, playerX, playerY, q]);

  const activeEstimate = useMemo(() => {
    if (!selectedDest) return null;
    const raw = calculateRideEstimate(
      playerX,
      playerY,
      selectedDest.x,
      selectedDest.y,
      selectedMode,
      weatherCfg.speedMultiplier
    );
    return {
      ...raw,
      fare: applyFareDiscount(raw.fare, hasFareSaver),
    };
  }, [hasFareSaver, playerX, playerY, selectedDest, selectedMode, weatherCfg.speedMultiplier]);

  const canAffordSelected = activeEstimate ? rupees >= activeEstimate.fare : false;

  const handleConfirmBooking = () => {
    if (!selectedDest || !activeEstimate || !canAffordSelected) return;
    onBookRide({
      id: selectedDest.id,
      name: selectedDest.name,
      kind: selectedDest.kind,
      x: selectedDest.x,
      y: selectedDest.y,
      mode: selectedMode,
      fare: activeEstimate.fare,
    });
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#1E293B]/45 p-4">
      <div className="bg-[#FFFDF9] border border-[#E2D5C3] rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2D5C3]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAB308] text-[#422006] flex items-center justify-center">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#1E293B]">
                Book Ride & Transport
              </h2>
              <p className="text-xs text-[#64748B] tabular-nums">
                Pick any Delhi NCR destination & ride via Rapido Bike, CNG Auto, Cab, or On Foot · Wallet ₹{rupees}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close transport booking"
            className="p-2 rounded-lg hover:bg-[#EFE6D8] text-[#475569] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free-roam mode quick switcher */}
        <div className="px-6 py-2.5 bg-[#FAF4E8] border-b border-[#EFE6D8] flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#475569]">
            Free-Roam Vehicle (WASD / Click Map):
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {TRANSPORT_ORDER.map((mode) => {
              const meta = TRANSPORT_OPTIONS[mode];
              const active = currentMode === mode;
              const passCost = active ? 0 : meta.freeRoamPassCost;
              const affordable = rupees >= passCost;
              return (
                <button
                  key={mode}
                  type="button"
                  disabled={!active && !affordable}
                  onClick={() => onSwitchFreeRoamMode(mode, passCost)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors tabular-nums ${
                    active
                      ? 'bg-[#1E293B] border-[#1E293B] text-white'
                      : affordable
                        ? 'bg-white hover:bg-[#EFE6D8] border-[#D6C7B2] text-[#1E293B] cursor-pointer'
                        : 'bg-[#EFE6D8] border-[#E2D5C3] text-[#94A3B8] cursor-not-allowed'
                  }`}
                >
                  <ModeIcon mode={mode} className="w-3.5 h-3.5" />
                  <span>{meta.label}</span>
                  {!active && passCost > 0 && <span className="text-[11px] opacity-80">₹{passCost}</span>}
                  {active && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Booking Body */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12">
          {/* Left: Select Destination */}
          <div className="md:col-span-7 flex flex-col min-h-0 border-b md:border-b-0 md:border-r border-[#E2D5C3]">
            <div className="p-4 border-b border-[#EFE6D8] space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Where to? Search Connaught Place, Saket, CyberHub, Metro..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D6C7B2] rounded-lg text-[#1E293B] focus:outline-none focus:border-[#C84B31]"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                {(['all', 'place', 'heritage', 'mall', 'restaurant', 'metro'] as CategoryFilter[]).map(
                  (k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setCategory(k)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                        category === k
                          ? 'bg-[#1E293B] text-white'
                          : 'bg-[#EFE6D8] text-[#475569] hover:text-[#1E293B]'
                      }`}
                    >
                      {KIND_LABELS[k]}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 ncr-scroll max-h-64 md:max-h-none">
              {filteredDestinations.map((dest) => {
                const isSelected = selectedDest?.id === dest.id && selectedDest?.kind === dest.kind;
                const km = Math.max(0.2, Math.round((dest.distPx / 140) * 10) / 10);
                return (
                  <button
                    key={`${dest.kind}:${dest.id}`}
                    type="button"
                    onClick={() => setSelectedDest(dest)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF4E8] border-[#C84B31]'
                        : 'bg-white hover:bg-[#FAF4E8]/60 border-[#E2D5C3]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <PoiKindIcon kind={dest.kind} />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#1E293B] truncate">
                          {dest.name}
                        </div>
                        <div className="text-[11px] text-[#64748B] truncate">{dest.subtitle}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-[#7C5A3C] tabular-nums shrink-0">
                      {km.toFixed(1)} km
                    </span>
                  </button>
                );
              })}
              {filteredDestinations.length === 0 && (
                <div className="py-10 text-center text-xs text-[#64748B]">
                  No NCR locations matched “{query}”.
                </div>
              )}
            </div>
          </div>

          {/* Right: Choose Vehicle & Dispatch */}
          <div className="md:col-span-5 flex flex-col justify-between p-4 bg-[#FAF4E8]/55 space-y-4 overflow-y-auto ncr-scroll">
            {selectedDest ? (
              <>
                <div className="space-y-3">
                  <div className="p-3 bg-white border border-[#E2D5C3] rounded-xl">
                    <div className="text-[11px] font-medium text-[#7C5A3C]">Selected Destination</div>
                    <div className="font-display text-base font-bold text-[#1E293B] mt-0.5">
                      {selectedDest.name}
                    </div>
                    <div className="text-xs text-[#64748B]">{selectedDest.subtitle}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#1E293B]">Choose Ride Option</span>
                      <div className="flex items-center gap-2 text-[10px] font-semibold">
                        {hasFareSaver && (
                          <span className="text-[#15803D]">Lv.3 Concession -20%</span>
                        )}
                        {weatherCfg.speedMultiplier < 1 && (
                          <span className="text-[#7C5A3C]">
                            {weatherCfg.shortLabel} · {Math.round(weatherCfg.speedMultiplier * 100)}% spd
                          </span>
                        )}
                      </div>
                    </div>
                    {TRANSPORT_ORDER.map((mode) => {
                      const meta = TRANSPORT_OPTIONS[mode];
                      const rawEst = calculateRideEstimate(
                        playerX,
                        playerY,
                        selectedDest.x,
                        selectedDest.y,
                        mode,
                        weatherCfg.speedMultiplier
                      );
                      const est = {
                        ...rawEst,
                        fare: applyFareDiscount(rawEst.fare, hasFareSaver),
                      };
                      const isPicked = selectedMode === mode;
                      const affordable = rupees >= est.fare;
                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setSelectedMode(mode)}
                          className={`w-full text-left p-3 rounded-xl border transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                            isPicked
                              ? 'bg-white border-[#C84B31] shadow-xs'
                              : 'bg-white/75 hover:bg-white border-[#E2D5C3]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white"
                              style={{ backgroundColor: meta.accentColor }}
                            >
                              <ModeIcon mode={mode} className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-[#1E293B]">
                                  {meta.label}
                                </span>
                                <span className="text-[10px] font-medium text-[#7C5A3C]">
                                  · {meta.brandTag}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#64748B] tabular-nums">
                                {est.distanceKm.toFixed(1)} km · ~{est.etaSeconds}s ride
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div
                              className={`font-mono text-sm font-bold tabular-nums ${
                                affordable ? 'text-[#1E293B]' : 'text-[#DC2626]'
                              }`}
                            >
                              {est.fare === 0 ? 'Free' : `₹${est.fare}`}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!canAffordSelected || (activeEstimate?.distancePx ?? 0) < 20}
                  onClick={handleConfirmBooking}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold tabular-nums transition-colors ${
                    !canAffordSelected || (activeEstimate?.distancePx ?? 0) < 20
                      ? 'bg-[#EFE6D8] text-[#94A3B8] cursor-not-allowed'
                      : 'bg-[#C84B31] hover:bg-[#B03E26] text-white cursor-pointer shadow-xs'
                  }`}
                >
                  {(activeEstimate?.distancePx ?? 0) < 20
                    ? 'Already at Destination'
                    : !canAffordSelected
                      ? `Need ₹${activeEstimate?.fare ?? 0} in Wallet`
                      : selectedMode === 'walk'
                        ? `Walk to ${selectedDest.name} (~${activeEstimate?.etaSeconds ?? 1}s)`
                        : `Book ${TRANSPORT_OPTIONS[selectedMode].label} & Move · ₹${activeEstimate?.fare ?? 0}`}
                </button>
              </>
            ) : (
              <div className="text-xs text-[#64748B] text-center py-8">
                Select a destination on the left to calculate fare and start moving.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
