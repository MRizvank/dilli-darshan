import React, { useEffect, useState } from 'react';
import {
  Award,
  CalendarClock,
  CheckCircle2,
  Copy,
  Eye,
  HelpCircle,
  Landmark,
  LogOut,
  ShoppingBag,
  TrainFront,
  Utensils,
  X,
} from 'lucide-react';
import {
  HERITAGE_SITES,
  METRO_LINE_META,
  METRO_STATIONS,
  QUESTS,
  RESTAURANTS,
  SHOPPING_MALLS,
  calculateMetroRoute,
  getPlaceById,
  getTimeUntilMidnightLabel,
} from '../data/delhiWorld';
import { applyFareDiscount } from '../data/explorerLevels';
import {
  get3DItemForHeritage,
  get3DItemForMetro,
  get3DItemForRestaurant,
  type Place3DShowcaseItem,
} from '../data/placeImages';
import { Place3DImage } from './Landmark3DModal';
import type {
  HeritageSite,
  MallItem,
  MenuItem,
  MetroStation,
  PlayerProgress,
  QuestDefinition,
  RestaurantSpot,
  ShoppingMallSpot,
} from '../types/game';

/* ---------- 1. METRO TRANSIT MODAL ---------- */
interface MetroModalProps {
  station: MetroStation;
  rupees: number;
  hasFareSaver?: boolean;
  onTravel: (toStation: MetroStation, fare: number) => void;
  onOpen3D?: (item: Place3DShowcaseItem) => void;
  onClose: () => void;
}

export const MetroModal: React.FC<MetroModalProps> = ({
  station,
  rupees,
  hasFareSaver = false,
  onTravel,
  onOpen3D,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const view3D = get3DItemForMetro(station);
  const q = search.trim().toLowerCase();
  const destinations = METRO_STATIONS.filter(
    (s) =>
      s.id !== station.id &&
      (!q ||
        s.name.toLowerCase().includes(q) ||
        s.lines.some((l) => METRO_LINE_META[l].name.toLowerCase().includes(q)))
  );

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#1E293B]/45 p-4">
      <div className="bg-[#FFFDF9] border border-[#E2D5C3] rounded-2xl w-full max-w-2xl max-h-[84vh] flex flex-col shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2D5C3]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center">
              <TrainFront className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#1E293B]">
                {station.name} Metro
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                {station.lines.map((l, idx) => (
                  <span key={l} className="inline-flex items-center gap-1">
                    {idx > 0 && <span aria-hidden="true">·</span>}
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: METRO_LINE_META[l].color }}
                    />
                    <span>{METRO_LINE_META[l].name}</span>
                  </span>
                ))}
                <span>· Wallet ₹{rupees}</span>
                {hasFareSaver && (
                  <span className="font-semibold text-[#15803D]">· Lv.3 SmartCard -20%</span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Metro window"
            className="p-2 rounded-lg hover:bg-[#EFE6D8] text-[#475569] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-2.5 bg-[#FAF4E8] border-b border-[#EFE6D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs text-[#475569]">{station.fact}</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter destination or line..."
            className="px-3 py-1.5 text-xs bg-white border border-[#D6C7B2] rounded-lg text-[#1E293B] focus:outline-none focus:border-[#2563EB] sm:w-52 shrink-0"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-2.5 ncr-scroll">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#D6C7B2] bg-[#1E293B] mb-3">
            <Place3DImage
              src={view3D.imageUrl}
              alt={`3D architectural view of ${station.name} Metro Station`}
              title={`${station.name} Metro`}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
            <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2">
              <span className="text-[11px] font-semibold text-[#FDE68A]">
                3D Station View · {station.name} Metro
              </span>
              {onOpen3D && (
                <button
                  type="button"
                  onClick={() => onOpen3D(view3D)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 hover:bg-black/80 text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect 3D</span>
                </button>
              )}
            </div>
          </div>

          {destinations.map((dest) => {
            const route = calculateMetroRoute(station.id, dest.id);
            if (!route) return null;
            const finalFare = applyFareDiscount(route.fare, hasFareSaver);
            const canAfford = rupees >= finalFare;
            const place = getPlaceById(dest.placeId);

            return (
              <div
                key={dest.id}
                className="p-3.5 bg-white border border-[#E2D5C3] rounded-xl flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-[#1E293B] truncate">
                    {dest.name}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#64748B] mt-0.5 tabular-nums">
                    <span>{place?.name}</span>
                    <span aria-hidden="true">·</span>
                    <span>{route.hops} stops</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex flex-wrap items-center gap-1.5">
                      {route.linesUsed.map((l) => (
                        <span key={l} className="inline-flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: METRO_LINE_META[l].color }}
                          />
                          <span>{METRO_LINE_META[l].name}</span>
                        </span>
                      ))}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!canAfford}
                  onClick={() => onTravel(dest, finalFare)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold tabular-nums whitespace-nowrap shrink-0 transition-colors ${
                    canAfford
                      ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer'
                      : 'bg-[#EFE6D8] text-[#94A3B8] cursor-not-allowed'
                  }`}
                >
                  Ride · ₹{finalFare}
                </button>
              </div>
            );
          })}
          {destinations.length === 0 && (
            <div className="py-8 text-center text-xs text-[#64748B]">
              No Metro stations matched “{search}”.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- 2. RESTAURANT MENU MODAL ---------- */
interface RestaurantModalProps {
  restaurant: RestaurantSpot;
  progress: PlayerProgress;
  onOrderDish: (restaurant: RestaurantSpot, item: MenuItem) => void;
  onOpen3D?: (item: Place3DShowcaseItem) => void;
  onClose: () => void;
}

export const RestaurantModal: React.FC<RestaurantModalProps> = ({
  restaurant,
  progress,
  onOrderDish,
  onOpen3D,
  onClose,
}) => {
  const place = getPlaceById(restaurant.placeId);
  const view3D = get3DItemForRestaurant(restaurant);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#1E293B]/45 p-4">
      <div className="bg-[#FFFDF9] border border-[#E2D5C3] rounded-2xl w-full max-w-xl max-h-[84vh] flex flex-col shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2D5C3]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C84B31] text-white flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#1E293B]">
                {restaurant.name}
              </h2>
              <p className="text-xs text-[#7C5A3C] tabular-nums">
                {restaurant.specialty} · {place?.name} · Wallet ₹{progress.rupees}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close restaurant menu"
            className="p-2 rounded-lg hover:bg-[#EFE6D8] text-[#475569] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-2.5 bg-[#FAF4E8] border-b border-[#EFE6D8] text-xs text-[#475569]">
          {restaurant.vibe}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3 ncr-scroll">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#D6C7B2] bg-[#1E293B]">
            <Place3DImage
              src={view3D.imageUrl}
              alt={`3D architectural view of ${restaurant.name}`}
              title={restaurant.name}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
            <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2">
              <span className="text-[11px] font-semibold text-[#FDE68A]">
                3D Dining View · {restaurant.specialty}
              </span>
              {onOpen3D && (
                <button
                  type="button"
                  onClick={() => onOpen3D(view3D)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 hover:bg-black/80 text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect 3D</span>
                </button>
              )}
            </div>
          </div>

          {restaurant.menu.map((item) => {
            const canAfford = progress.rupees >= item.price;
            const tasted = progress.tastedDishes.includes(item.id);

            return (
              <div
                key={item.id}
                className="p-4 bg-white border border-[#E2D5C3] rounded-xl flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-xs border flex items-center justify-center shrink-0"
                      style={{ borderColor: item.isVeg ? '#15803D' : '#B91C1C' }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: item.isVeg ? '#15803D' : '#B91C1C' }}
                      />
                    </span>
                    <span className="font-semibold text-sm text-[#1E293B]">{item.name}</span>
                    {tasted && (
                      <span className="text-[11px] font-medium text-[#15803D]">· Tasted</span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">{item.description}</p>
                  <div className="text-[11px] font-medium text-[#D97706] mt-1 tabular-nums">
                    Restores +{item.energyRestore} Energy
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!canAfford}
                  onClick={() => onOrderDish(restaurant, item)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold tabular-nums whitespace-nowrap shrink-0 transition-colors ${
                    canAfford
                      ? 'bg-[#C84B31] hover:bg-[#B03E26] text-white cursor-pointer'
                      : 'bg-[#EFE6D8] text-[#94A3B8] cursor-not-allowed'
                  }`}
                >
                  Order · ₹{item.price}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ---------- 3. SHOPPING MALL & CRAFT BAZAAR MODAL ---------- */
interface MallModalProps {
  mall: ShoppingMallSpot;
  progress: PlayerProgress;
  onBuyMallItem: (mall: ShoppingMallSpot, item: MallItem) => void;
  onClose: () => void;
}

export const MallModal: React.FC<MallModalProps> = ({
  mall,
  progress,
  onBuyMallItem,
  onClose,
}) => {
  const place = getPlaceById(mall.placeId);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#1E293B]/45 p-4">
      <div className="bg-[#FFFDF9] border border-[#E2D5C3] rounded-2xl w-full max-w-xl max-h-[84vh] flex flex-col shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2D5C3]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0369A1] text-white flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#1E293B]">{mall.name}</h2>
              <p className="text-xs text-[#0369A1] tabular-nums">
                {mall.tagline} · {place?.name} · Wallet ₹{progress.rupees}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close mall"
            className="p-2 rounded-lg hover:bg-[#EFE6D8] text-[#475569] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-2.5 bg-[#FAF4E8] border-b border-[#EFE6D8] space-y-1">
          <p className="text-xs text-[#475569]">{mall.vibe}</p>
          <p className="text-[11px] font-medium text-[#64748B]">
            Highlights: {mall.anchors.join(' · ')}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3 ncr-scroll">
          {mall.items.map((item) => {
            const canAfford = progress.rupees >= item.price;
            const owned = progress.boughtMallItems.includes(item.id);

            return (
              <div
                key={item.id}
                className="p-4 bg-white border border-[#E2D5C3] rounded-xl flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#1E293B]">{item.name}</span>
                    {owned && (
                      <span className="text-[11px] font-medium text-[#15803D]">· Picked Up</span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#0369A1] mt-0.5">{item.category}</div>
                  <p className="text-xs text-[#64748B] mt-1">{item.description}</p>
                  <div className="text-[11px] font-medium text-[#D97706] mt-1 tabular-nums">
                    +{item.energyRestore} Energy
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!canAfford}
                  onClick={() => onBuyMallItem(mall, item)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold tabular-nums whitespace-nowrap shrink-0 transition-colors ${
                    canAfford
                      ? 'bg-[#0369A1] hover:bg-[#075985] text-white cursor-pointer'
                      : 'bg-[#EFE6D8] text-[#94A3B8] cursor-not-allowed'
                  }`}
                >
                  Buy · ₹{item.price}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ---------- 4. HERITAGE STAMP & TRIVIA MODAL ---------- */
interface HeritageModalProps {
  site: HeritageSite;
  progress: PlayerProgress;
  onStamp: (site: HeritageSite) => void;
  onSolveTrivia: (site: HeritageSite) => void;
  onOpen3D?: (item: Place3DShowcaseItem) => void;
  onClose: () => void;
}

export const HeritageModal: React.FC<HeritageModalProps> = ({
  site,
  progress,
  onStamp,
  onSolveTrivia,
  onOpen3D,
  onClose,
}) => {
  const isStamped = progress.stampedHeritages.includes(site.id);
  const triviaSolved = progress.triviaSolvedHeritages.includes(site.id);
  const canAffordTicket = progress.rupees >= site.ticketPrice;
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  const view3D = get3DItemForHeritage(site.id);

  const handleTriviaPick = (idx: number) => {
    if (triviaSolved) return;
    if (idx === site.trivia.correctIndex) {
      setWrongIdx(null);
      onSolveTrivia(site);
    } else {
      setWrongIdx(idx);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#1E293B]/45 p-4">
      <div className="bg-[#FFFDF9] border border-[#E2D5C3] rounded-2xl w-full max-w-xl max-h-[88vh] flex flex-col shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2D5C3] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B45309] text-white flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#1E293B]">{site.name}</h2>
              <p className="text-xs text-[#7C5A3C] tabular-nums">
                {site.era} · Entry {site.ticketPrice === 0 ? 'Free' : `₹${site.ticketPrice}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close monument"
            className="p-2 rounded-lg hover:bg-[#EFE6D8] text-[#475569] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto ncr-scroll">
          {view3D && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#D6C7B2] bg-[#1E293B]">
              <Place3DImage
                src={view3D.imageUrl}
                alt={`3D architectural view of ${site.name}`}
                title={site.name}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2">
                <span className="text-[11px] font-semibold text-[#FDE68A]">
                  3D Landmark View · {site.stampTitle}
                </span>
                {onOpen3D && (
                  <button
                    type="button"
                    onClick={() => onOpen3D(view3D)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 hover:bg-black/80 text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect 3D</span>
                  </button>
                )}
              </div>
            </div>
          )}

          <p className="text-sm text-[#334155] leading-relaxed">{site.description}</p>

          <div className="p-4 bg-[#FAF4E8] border border-[#E2D5C3] rounded-xl flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-[#1E293B]">{site.stampTitle}</div>
              <div className="text-xs text-[#64748B] tabular-nums">
                {isStamped
                  ? 'Collected in Heritage Passport'
                  : `Reward: +₹${site.rewardRupees} explorer grant`}
              </div>
            </div>
            {isStamped ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Stamped</span>
              </span>
            ) : (
              <button
                type="button"
                disabled={!canAffordTicket}
                onClick={() => onStamp(site)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tabular-nums whitespace-nowrap shrink-0 transition-colors ${
                  canAffordTicket
                    ? 'bg-[#B45309] hover:bg-[#92400E] text-white cursor-pointer'
                    : 'bg-[#EFE6D8] text-[#94A3B8] cursor-not-allowed'
                }`}
              >
                {site.ticketPrice === 0
                  ? 'Stamp Free'
                  : `Buy Ticket & Stamp · ₹${site.ticketPrice}`}
              </button>
            )}
          </div>

          <div className="p-4 bg-white border border-[#E2D5C3] rounded-xl space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E293B]">
                <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                <span>Heritage Guide Quiz</span>
              </div>
              <span className="text-xs font-mono font-semibold text-[#15803D] tabular-nums">
                {triviaSolved ? 'Completed (+₹75)' : '+₹75 Bonus'}
              </span>
            </div>
            <p className="text-xs text-[#475569]">{site.trivia.question}</p>
            <div className="grid grid-cols-1 gap-1.5">
              {site.trivia.options.map((opt, idx) => {
                const isCorrect = triviaSolved && idx === site.trivia.correctIndex;
                const isWrong = wrongIdx === idx;
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={triviaSolved}
                    onClick={() => handleTriviaPick(idx)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      isCorrect
                        ? 'bg-[#DCFCE7] border-[#15803D] text-[#14532D]'
                        : isWrong
                          ? 'bg-[#FEE2E2] border-[#DC2626] text-[#7F1D1D]'
                          : 'bg-[#FAF4E8] hover:bg-[#EFE6D8] border-[#E2D5C3] text-[#1E293B] cursor-pointer'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- 5. PASSPORT, DAILY MISSIONS & QUESTS MODAL ---------- */
interface PassportModalProps {
  progress: PlayerProgress;
  onClose: () => void;
}

function getQuestProgress(quest: QuestDefinition, progress: PlayerProgress): { done: number; total: number } {
  let done = 0;
  let total = 0;
  if (quest.requirements.places) {
    total += quest.requirements.places.length;
    done += quest.requirements.places.filter((id) => progress.visitedPlaces.includes(id)).length;
  }
  if (quest.requirements.heritages) {
    total += quest.requirements.heritages.length;
    done += quest.requirements.heritages.filter((id) => progress.stampedHeritages.includes(id)).length;
  }
  if (quest.requirements.restaurants) {
    total += quest.requirements.restaurants.length;
    done += quest.requirements.restaurants.filter((id) => progress.tastedRestaurants.includes(id)).length;
  }
  if (quest.requirements.malls) {
    total += quest.requirements.malls.length;
    done += quest.requirements.malls.filter((id) => progress.visitedMalls.includes(id)).length;
  }
  if (quest.requirements.dishIds) {
    total += quest.requirements.dishIds.length;
    done += quest.requirements.dishIds.filter((id) => progress.tastedDishes.includes(id)).length;
  }
  if (quest.requirements.metroRides) {
    total += quest.requirements.metroRides;
    done += Math.min(quest.requirements.metroRides, progress.metroRides);
  }
  return { done, total };
}

export const PassportModal: React.FC<PassportModalProps> = ({ progress, onClose }) => {
  const [tab, setTab] = useState<'daily' | 'quests' | 'stamps' | 'malls' | 'food'>('daily');
  const [resetCountdown, setResetCountdown] = useState(() => getTimeUntilMidnightLabel());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setResetCountdown(getTimeUntilMidnightLabel());
    }, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const allDishes = RESTAURANTS.flatMap((r) =>
    r.menu.map((m) => ({ ...m, restaurantName: r.name }))
  );

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#1E293B]/45 p-4">
      <div className="bg-[#FFFDF9] border border-[#E2D5C3] rounded-2xl w-full max-w-3xl max-h-[86vh] flex flex-col shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2D5C3]">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#1E293B]">
              Daily Missions & Passport
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5 tabular-nums">
              Daily {progress.dailyMissions.completedIds.length}/
              {progress.dailyMissions.missions.length} · Trails {progress.completedQuests.length}/
              {QUESTS.length} · Stamps {progress.stampedHeritages.length}/{HERITAGE_SITES.length} ·
              Malls {progress.visitedMalls.length}/{SHOPPING_MALLS.length}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close passport"
            className="p-2 rounded-lg hover:bg-[#EFE6D8] text-[#475569] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-2.5 bg-[#FAF4E8] border-b border-[#EFE6D8] flex items-center gap-1 overflow-x-auto">
          {(
            [
              ['daily', 'Daily Missions'],
              ['quests', 'NCR Trails'],
              ['stamps', 'Heritage Stamps'],
              ['malls', 'Malls & Bazaars'],
              ['food', 'Foodie Journal'],
            ] as Array<['daily' | 'quests' | 'stamps' | 'malls' | 'food', string]>
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                tab === k
                  ? 'bg-white text-[#1E293B] shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 ncr-scroll">
          {tab === 'daily' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-4 py-3 bg-[#FAF4E8] border border-[#E2D5C3] rounded-xl text-xs">
                <div className="flex items-center gap-2 font-semibold text-[#1E293B]">
                  <CalendarClock className="w-4 h-4 text-[#C84B31]" />
                  <span>Three Daily NCR Missions ({progress.dailyMissions.dateKey})</span>
                </div>
                <span className="font-mono font-semibold text-[#7C5A3C] tabular-nums">
                  Expires in {resetCountdown}
                </span>
              </div>

              <div className="space-y-3">
                {progress.dailyMissions.missions.map((mission) => {
                  const completed = progress.dailyMissions.completedIds.includes(mission.id);
                  const current = Math.min(
                    mission.targetCount,
                    progress.dailyMissions.progressById[mission.id] ?? 0
                  );
                  const pct = Math.round((current / mission.targetCount) * 100);

                  return (
                    <div
                      key={mission.id}
                      className={`p-4 rounded-xl border space-y-2 ${
                        completed
                          ? 'bg-[#DCFCE7]/35 border-[#15803D]/40'
                          : 'bg-white border-[#E2D5C3]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-sm text-[#1E293B]">
                            {mission.title}
                          </h3>
                          <p className="text-xs text-[#64748B] mt-0.5">{mission.description}</p>
                        </div>
                        <span
                          className={`text-xs font-mono font-semibold tabular-nums shrink-0 ${
                            completed ? 'text-[#15803D]' : 'text-[#C84B31]'
                          }`}
                        >
                          {completed ? 'Claimed' : `+₹${mission.rewardRupees}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-[#EFE6D8] rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: completed ? '#15803D' : '#D97706',
                            }}
                          />
                        </div>
                        <span className="text-[11px] font-mono tabular-nums text-[#475569]">
                          {current}/{mission.targetCount}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'quests' && (
            <div className="space-y-3">
              {QUESTS.map((quest) => {
                const completed = progress.completedQuests.includes(quest.id);
                const { done, total } = getQuestProgress(quest, progress);
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div
                    key={quest.id}
                    className="p-4 bg-white border border-[#E2D5C3] rounded-xl space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-sm text-[#1E293B]">{quest.title}</h3>
                        <p className="text-xs text-[#64748B] mt-0.5">{quest.description}</p>
                      </div>
                      <span
                        className={`text-xs font-mono font-semibold tabular-nums shrink-0 ${
                          completed ? 'text-[#15803D]' : 'text-[#C84B31]'
                        }`}
                      >
                        {completed ? 'Completed' : `+₹${quest.rewardRupees}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-[#EFE6D8] rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: completed ? '#15803D' : '#C84B31',
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-mono tabular-nums text-[#475569]">
                        {done}/{total}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'stamps' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HERITAGE_SITES.map((site) => {
                const stamped = progress.stampedHeritages.includes(site.id);
                return (
                  <div
                    key={site.id}
                    className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                      stamped
                        ? 'bg-[#FEF3C7]/45 border-[#D97706]'
                        : 'bg-white border-[#E2D5C3] opacity-75'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm text-[#1E293B]">{site.name}</div>
                      <div className="text-xs text-[#7C5A3C]">{site.stampTitle}</div>
                    </div>
                    <Award
                      className={`w-6 h-6 shrink-0 ${
                        stamped ? 'text-[#B45309]' : 'text-[#CBD5E1]'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'malls' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SHOPPING_MALLS.map((mall) => {
                const visited = progress.visitedMalls.includes(mall.id);
                return (
                  <div
                    key={mall.id}
                    className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                      visited
                        ? 'bg-[#EFF6FF] border-[#0369A1]/50'
                        : 'bg-white border-[#E2D5C3] opacity-80'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-[#1E293B] truncate">
                        {mall.name}
                      </div>
                      <div className="text-xs text-[#0369A1] truncate">{mall.tagline}</div>
                    </div>
                    <ShoppingBag
                      className={`w-5 h-5 shrink-0 ${
                        visited ? 'text-[#0369A1]' : 'text-[#CBD5E1]'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'food' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {allDishes.map((dish) => {
                const tasted = progress.tastedDishes.includes(dish.id);
                return (
                  <div
                    key={dish.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      tasted ? 'bg-[#DCFCE7]/40 border-[#15803D]/40' : 'bg-white border-[#E2D5C3]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-xs text-[#1E293B] truncate">{dish.name}</div>
                      <div className="text-[11px] text-[#64748B] truncate">
                        {dish.restaurantName}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-semibold tabular-nums text-[#1E293B]">
                        ₹{dish.price}
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        {tasted ? 'Tasted' : 'Untasted'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- 6. PAUSE & ROOM SETTINGS MODAL ---------- */
interface PauseModalProps {
  roomCode: string;
  onResume: () => void;
  onSwitchRoom: (newCode: string) => void;
  onExitToTitle: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  roomCode,
  onResume,
  onSwitchRoom,
  onExitToTitle,
}) => {
  const [targetRoom, setTargetRoom] = useState(roomCode);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(roomCode).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#1E293B]/45 p-4">
      <div className="bg-[#FFFDF9] border border-[#E2D5C3] rounded-2xl w-full max-w-md p-6 shadow-lg space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-[#1E293B]">Journey Paused</h2>
          <button
            type="button"
            onClick={onResume}
            aria-label="Resume game"
            className="p-2 rounded-lg hover:bg-[#EFE6D8] text-[#475569] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-[#FAF4E8] border border-[#E2D5C3] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#475569]">Active Room</span>
            <span className="font-mono font-bold text-[#1E293B]">{roomCode}</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#EFE6D8] border border-[#D6C7B2] rounded-lg text-xs font-medium text-[#1E293B] cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Room Code Copied' : 'Copy Invite Code'}</span>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSwitchRoom(targetRoom.trim().toUpperCase() || 'PUBLIC-NCR');
          }}
          className="space-y-2"
        >
          <label className="block text-xs font-semibold text-[#475569]">
            Switch to Public or Private Room
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={targetRoom}
              onChange={(e) => setTargetRoom(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-white border border-[#D6C7B2] rounded-lg text-[#1E293B]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
            >
              Join Room
            </button>
          </div>
        </form>

        <div className="flex items-center gap-3 pt-2 border-t border-[#EFE6D8]">
          <button
            type="button"
            onClick={onResume}
            className="flex-1 py-2.5 bg-[#C84B31] hover:bg-[#B03E26] text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Resume Exploring
          </button>
          <button
            type="button"
            onClick={onExitToTitle}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#EFE6D8] hover:bg-[#E2D5C3] text-[#1E293B] text-xs font-semibold rounded-xl cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Title Screen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
