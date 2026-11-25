import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Landmark,
  Maximize2,
  Minimize2,
  Navigation,
  TrainFront,
  Utensils,
  X,
} from 'lucide-react';
import {
  PLACE_3D_SHOWCASE,
  type Place3DShowcaseItem,
  type ShowcaseCategory,
} from '../data/placeImages';
import type { NcrDestinationItem } from '../data/delhiWorld';
import type { WaypointPin } from '../types/game';

interface Place3DImageProps {
  src: string;
  alt: string;
  title: string;
  className?: string;
}

export const Place3DImage: React.FC<Place3DImageProps> = ({ src, alt, title, className = '' }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-[#F3EBDD] via-[#E2D5C3] to-[#D6C7B2] flex flex-col items-center justify-center gap-2 text-[#7C5A3C] p-4 ${className}`}
      >
        <Landmark className="w-8 h-8 opacity-80" />
        <span className="text-xs font-semibold text-center">{title}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`w-full h-full object-cover ${className}`}
    />
  );
};

interface Landmark3DModalProps {
  initialItem?: Place3DShowcaseItem | null;
  playerX: number;
  playerY: number;
  onPinWaypoint: (pin: WaypointPin) => void;
  onRideHere: (dest: NcrDestinationItem) => void;
  onClose: () => void;
}

type CategoryFilter = 'all' | ShowcaseCategory;

function resolveItemKind(item: Place3DShowcaseItem): NcrDestinationItem['kind'] {
  if (item.restaurantId) return 'restaurant';
  if (item.metroId) return 'metro';
  if (item.heritageId) return 'heritage';
  if (item.mallId) return 'mall';
  return 'place';
}

function resolveItemTargetId(item: Place3DShowcaseItem): string {
  return (
    item.restaurantId ??
    item.metroId ??
    item.heritageId ??
    item.mallId ??
    item.placeId
  );
}

export const Landmark3DModal: React.FC<Landmark3DModalProps> = ({
  initialItem,
  playerX,
  playerY,
  onPinWaypoint,
  onRideHere,
  onClose,
}) => {
  // Include a custom clicked restaurant/station if it's not verbatim in the 24-card showcase
  const allItems = useMemo(() => {
    if (!initialItem) return PLACE_3D_SHOWCASE;
    const exists = PLACE_3D_SHOWCASE.some((it) => it.id === initialItem.id);
    return exists ? PLACE_3D_SHOWCASE : [initialItem, ...PLACE_3D_SHOWCASE];
  }, [initialItem]);

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(() =>
    initialItem ? initialItem.category : 'all'
  );

  const visibleItems = useMemo(() => {
    if (categoryFilter === 'all') return allItems;
    return allItems.filter((it) => it.category === categoryFilter);
  }, [allItems, categoryFilter]);

  const [selectedId, setSelectedId] = useState<string>(() => {
    if (initialItem) return initialItem.id;
    return PLACE_3D_SHOWCASE[0].id;
  });

  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [zoomed, setZoomed] = useState(false);

  const activeIndex = useMemo(() => {
    const idx = visibleItems.findIndex((it) => it.id === selectedId);
    return idx >= 0 ? idx : 0;
  }, [visibleItems, selectedId]);

  const item = visibleItems[activeIndex] ?? allItems[0];
  const distKm = Math.max(
    0.2,
    Math.round((Math.hypot(item.x - playerX, item.y - playerY) / 140) * 10) / 10
  );

  const handleCategoryChange = (nextCat: CategoryFilter) => {
    setCategoryFilter(nextCat);
    setZoomed(false);
    const nextList =
      nextCat === 'all' ? allItems : allItems.filter((it) => it.category === nextCat);
    if (nextList.length > 0 && !nextList.some((it) => it.id === selectedId)) {
      setSelectedId(nextList[0].id);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-ny * 10).toFixed(2)),
      ry: Number((nx * 12).toFixed(2)),
    });
  };

  const resetTilt = () => setTilt({ rx: 0, ry: 0 });

  const stepPrev = () => {
    setZoomed(false);
    const prevIdx = (activeIndex - 1 + visibleItems.length) % visibleItems.length;
    setSelectedId(visibleItems[prevIdx].id);
  };

  const stepNext = () => {
    setZoomed(false);
    const nextIdx = (activeIndex + 1) % visibleItems.length;
    setSelectedId(visibleItems[nextIdx].id);
  };

  const targetKind = resolveItemKind(item);
  const targetId = resolveItemTargetId(item);

  const HeaderIcon =
    item.category === 'metro'
      ? TrainFront
      : item.category === 'restaurant'
        ? Utensils
        : Landmark;

  const headerAccent =
    item.category === 'metro'
      ? '#2563EB'
      : item.category === 'restaurant'
        ? '#C84B31'
        : '#B45309';

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#1E293B]/60 p-4">
      <div className="bg-[#FFFDF9] border border-[#E2D5C3] rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-[#E2D5C3]">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-xl text-white flex items-center justify-center shrink-0 transition-colors"
              style={{ backgroundColor: headerAccent }}
            >
              <HeaderIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-xl font-bold text-[#1E293B] truncate">
                Delhi NCR 3D Sights Gallery
              </h2>
              <p className="text-xs text-[#64748B] tabular-nums">
                {activeIndex + 1} of {visibleItems.length} 3D architectural views · Move cursor
                across view to inspect 3D perspective
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2">
            <div className="flex items-center gap-1 p-1 bg-[#EFE6D8] rounded-lg overflow-x-auto">
              {(
                [
                  ['all', 'All'],
                  ['place', 'Places'],
                  ['restaurant', 'Restaurants'],
                  ['metro', 'Metro Stations'],
                ] as Array<[CategoryFilter, string]>
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCategoryChange(key)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    categoryFilter === key
                      ? 'bg-white text-[#1E293B] shadow-xs'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close 3D sights gallery"
              className="p-2 rounded-lg hover:bg-[#EFE6D8] text-[#475569] cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Viewer + Thumbnail Strip */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
          {/* Interactive 3D Viewport */}
          <div className="flex-1 p-5 bg-[#FAF4E8] flex flex-col justify-between gap-4 overflow-y-auto ncr-scroll">
            <div
              onPointerMove={handlePointerMove}
              onPointerLeave={resetTilt}
              className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#D6C7B2] bg-[#1E293B] shadow-md select-none"
              style={{ perspective: '1100px' }}
            >
              <div
                className="w-full h-full transition-transform duration-150 ease-out"
                style={{
                  transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${zoomed ? 1.18 : 1.03})`,
                }}
              >
                <Place3DImage
                  src={item.imageUrl}
                  alt={`3D architectural view of ${item.title}`}
                  title={item.title}
                />
              </div>

              {/* Measured Contrast Scrim */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

              <div className="pointer-events-none absolute bottom-4 left-5 right-16 text-white">
                <div className="text-[11px] font-medium text-[#FDE68A]">{item.subtitle}</div>
                <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight">
                  {item.title}
                </h3>
              </div>

              {/* Prev / Next / Zoom Overlay Controls */}
              <button
                type="button"
                onClick={stepPrev}
                aria-label="Previous 3D sight"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={stepNext}
                aria-label="Next 3D sight"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-label={zoomed ? 'Reset zoom' : 'Zoom in 3D view'}
                className="absolute bottom-4 right-4 p-2 rounded-lg bg-black/55 hover:bg-black/80 text-white transition-colors cursor-pointer"
              >
                {zoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Info & Direct Map Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-[#E2D5C3] rounded-xl">
              <div className="space-y-1">
                <p className="text-xs text-[#334155] leading-relaxed">{item.architectureNote}</p>
                <div className="text-[11px] font-medium text-[#7C5A3C] tabular-nums">
                  Distance from your position: {distKm.toFixed(1)} km
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onPinWaypoint({
                      kind: targetKind,
                      id: targetId,
                      name: item.title,
                      x: item.x,
                      y: item.y,
                    });
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF4E8] hover:bg-[#EFE6D8] border border-[#D6C7B2] rounded-xl text-xs font-semibold text-[#1E293B] whitespace-nowrap cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-[#C84B31]" />
                  <span>Pin Compass</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRideHere({
                      id: targetId,
                      name: item.title,
                      subtitle: item.subtitle,
                      kind: targetKind,
                      x: item.x,
                      y: item.y,
                    });
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#C84B31] hover:bg-[#B03E26] rounded-xl text-xs font-bold text-white whitespace-nowrap cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Book Ride Here</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right/Bottom Selector List */}
          <div className="lg:w-72 border-t lg:border-t-0 lg:border-l border-[#E2D5C3] bg-[#FFFDF9] p-3 overflow-x-auto lg:overflow-y-auto ncr-scroll flex lg:flex-col gap-2 shrink-0">
            {visibleItems.map((entry) => {
              const selected = entry.id === item.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => {
                    setZoomed(false);
                    setSelectedId(entry.id);
                  }}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-colors shrink-0 w-56 lg:w-full cursor-pointer ${
                    selected
                      ? 'bg-[#FAF4E8] border-[#C84B31]'
                      : 'bg-white hover:bg-[#FAF4E8]/60 border-[#E2D5C3]'
                  }`}
                >
                  <div className="w-16 h-10 rounded-lg overflow-hidden shrink-0 border border-[#E2D5C3]">
                    <Place3DImage src={entry.imageUrl} alt={entry.title} title={entry.title} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#1E293B] truncate">
                      {entry.title}
                    </div>
                    <div className="text-[10px] text-[#64748B] truncate">{entry.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
