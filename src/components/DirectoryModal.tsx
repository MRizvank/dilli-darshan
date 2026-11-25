import React, { useMemo, useState } from 'react';
import {
  Compass,
  Eye,
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
  HERITAGE_SITES,
  METRO_LINE_META,
  METRO_STATIONS,
  PLACE_ZONES,
  RESTAURANTS,
  SHOPPING_MALLS,
  getPlaceById,
  type NcrDestinationItem,
} from '../data/delhiWorld';
import {
  get3DItemForHeritage,
  get3DItemForMall,
  get3DItemForMetro,
  get3DItemForPlace,
  get3DItemForRestaurant,
  type Place3DShowcaseItem,
} from '../data/placeImages';
import { Place3DImage } from './Landmark3DModal';
import type { PlayerProgress, WaypointPin } from '../types/game';

type DirectoryTab = 'all' | 'places' | 'metro' | 'malls' | 'heritages' | 'restaurants';

interface DirectoryModalProps {
  onClose: () => void;
  onPinWaypoint: (pin: WaypointPin) => void;
  onSelectRide: (dest: NcrDestinationItem) => void;
  onOpen3D: (item?: Place3DShowcaseItem) => void;
  progress: PlayerProgress;
}

export const DirectoryModal: React.FC<DirectoryModalProps> = ({
  onClose,
  onPinWaypoint,
  onSelectRide,
  onOpen3D,
  progress,
}) => {
  const [tab, setTab] = useState<DirectoryTab>('all');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();

  const filteredPlaces = useMemo(
    () =>
      PLACE_ZONES.filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.highlights.some((h) => h.toLowerCase().includes(q))
      ),
    [q]
  );

  const filteredMetro = useMemo(
    () =>
      METRO_STATIONS.filter(
        (m) =>
          !q ||
          m.name.toLowerCase().includes(q) ||
          m.lines.some((l) => METRO_LINE_META[l].name.toLowerCase().includes(q))
      ),
    [q]
  );

  const filteredMalls = useMemo(
    () =>
      SHOPPING_MALLS.filter(
        (m) =>
          !q ||
          m.name.toLowerCase().includes(q) ||
          m.tagline.toLowerCase().includes(q) ||
          m.anchors.some((a) => a.toLowerCase().includes(q)) ||
          m.items.some((item) => item.name.toLowerCase().includes(q))
      ),
    [q]
  );

  const filteredHeritages = useMemo(
    () =>
      HERITAGE_SITES.filter(
        (h) =>
          !q ||
          h.name.toLowerCase().includes(q) ||
          h.era.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q)
      ),
    [q]
  );

  const filteredRestaurants = useMemo(
    () =>
      RESTAURANTS.filter(
        (r) =>
          !q ||
          r.name.toLowerCase().includes(q) ||
          r.specialty.toLowerCase().includes(q) ||
          r.menu.some((item) => item.name.toLowerCase().includes(q))
      ),
    [q]
  );

  const handlePin = (pin: WaypointPin) => {
    onPinWaypoint(pin);
    onClose();
  };

  const handleRide = (dest: NcrDestinationItem) => {
    onClose();
    onSelectRide(dest);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#1E293B]/45 p-4">
      <div className="bg-[#FFFDF9] border border-[#E2D5C3] rounded-2xl w-full max-w-5xl max-h-[86vh] flex flex-col shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2D5C3]">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#1E293B]">
              Delhi NCR Directory
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5 tabular-nums">
              {PLACE_ZONES.length} Places · {METRO_STATIONS.length} Metro Stations ·{' '}
              {SHOPPING_MALLS.length} Malls & Bazaars · {HERITAGE_SITES.length} Heritages ·{' '}
              {RESTAURANTS.length} Famous Restaurants
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close directory"
            className="p-2 rounded-lg hover:bg-[#EFE6D8] text-[#475569] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="px-6 py-3 border-b border-[#EFE6D8] bg-[#FAF4E8] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search places, metro lines, malls, monuments, dishes..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D6C7B2] rounded-lg text-[#1E293B] focus:outline-none focus:border-[#C84B31]"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#EFE6D8] rounded-lg overflow-x-auto">
            {(
              [
                ['all', 'All'],
                ['places', 'Places'],
                ['metro', 'Metro Stations'],
                ['malls', 'Shopping Malls'],
                ['heritages', 'Heritages'],
                ['restaurants', 'Restaurants & Foods'],
              ] as Array<[DirectoryTab, string]>
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  tab === key
                    ? 'bg-white text-[#1E293B] shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 ncr-scroll">
          {/* Places */}
          {(tab === 'all' || tab === 'places') && filteredPlaces.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-[#C84B31]" />
                <h3 className="font-display text-lg font-bold text-[#1E293B]">
                  Places & Neighborhoods ({filteredPlaces.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredPlaces.map((place) => {
                  const visited = progress.visitedPlaces.includes(place.id);
                  const view3D = get3DItemForPlace(place.id);
                  return (
                    <div
                      key={place.id}
                      className="p-4 bg-white border border-[#E2D5C3] rounded-xl flex flex-col justify-between gap-3"
                    >
                      <div>
                        {view3D && (
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 border border-[#E2D5C3] bg-[#1E293B]">
                            <Place3DImage
                              src={view3D.imageUrl}
                              alt={`3D view of ${place.name}`}
                              title={place.name}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpen3D(view3D);
                              }}
                              className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 bg-black/65 hover:bg-black/85 text-white text-[11px] font-semibold rounded-md cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>3D View</span>
                            </button>
                          </div>
                        )}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-sm text-[#1E293B]">{place.name}</h4>
                            <div className="text-xs text-[#7C5A3C]">
                              {place.subtitle}
                              {visited && ' · Visited'}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                handleRide({
                                  id: place.id,
                                  name: place.name,
                                  subtitle: place.subtitle,
                                  kind: 'place',
                                  x: place.x,
                                  y: place.y,
                                })
                              }
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-[#C84B31] hover:bg-[#B03E26] rounded-lg text-white whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>Ride</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handlePin({
                                  kind: 'place',
                                  id: place.id,
                                  name: place.name,
                                  x: place.x,
                                  y: place.y,
                                })
                              }
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-[#FAF4E8] hover:bg-[#EFE6D8] border border-[#E2D5C3] rounded-lg text-[#1E293B] whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Compass className="w-3.5 h-3.5 text-[#C84B31]" />
                              <span>Pin</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                          {place.description}
                        </p>
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        Highlights: {place.highlights.join(' · ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Metro Stations */}
          {(tab === 'all' || tab === 'metro') && filteredMetro.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <TrainFront className="w-4 h-4 text-[#2563EB]" />
                <h3 className="font-display text-lg font-bold text-[#1E293B]">
                  Delhi Metro Stations ({filteredMetro.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredMetro.map((st) => {
                  const place = getPlaceById(st.placeId);
                  const view3D = get3DItemForMetro(st);
                  return (
                    <div
                      key={st.id}
                      className="p-3.5 bg-white border border-[#E2D5C3] rounded-xl flex flex-col justify-between gap-2.5"
                    >
                      <div>
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2.5 border border-[#E2D5C3] bg-[#1E293B]">
                          <Place3DImage
                            src={view3D.imageUrl}
                            alt={`3D view of ${st.name} Metro Station`}
                            title={`${st.name} Metro`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpen3D(view3D);
                            }}
                            className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 bg-black/65 hover:bg-black/85 text-white text-[11px] font-semibold rounded-md cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>3D View</span>
                          </button>
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm text-[#1E293B]">{st.name}</h4>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                handleRide({
                                  id: st.id,
                                  name: `${st.name} Metro`,
                                  subtitle: place?.name ?? 'Delhi Metro',
                                  kind: 'metro',
                                  x: st.x,
                                  y: st.y,
                                })
                              }
                              className="p-1.5 bg-[#C84B31] hover:bg-[#B03E26] rounded-lg text-white shrink-0 cursor-pointer"
                              title="Book ride to station"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handlePin({
                                  kind: 'metro',
                                  id: st.id,
                                  name: st.name,
                                  x: st.x,
                                  y: st.y,
                                })
                              }
                              className="p-1.5 bg-[#FAF4E8] hover:bg-[#EFE6D8] border border-[#E2D5C3] rounded-lg text-[#C84B31] shrink-0 cursor-pointer"
                              title="Pin station on map"
                            >
                              <Compass className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[11px] font-medium text-[#475569]">
                          {st.lines.map((l, i) => (
                            <span key={l} className="inline-flex items-center gap-1">
                              {i > 0 && <span aria-hidden="true">·</span>}
                              <span
                                className="w-2 h-2 rounded-full inline-block"
                                style={{ backgroundColor: METRO_LINE_META[l].color }}
                              />
                              <span>{METRO_LINE_META[l].name}</span>
                            </span>
                          ))}
                          {st.interchange && <span>· Interchange</span>}
                        </div>
                        <p className="text-xs text-[#64748B] mt-1.5 leading-snug">{st.fact}</p>
                      </div>
                      <div className="text-[11px] text-[#7C5A3C]">
                        Area: {place?.name ?? 'Delhi NCR'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Major Shopping Malls & Craft Bazaars */}
          {(tab === 'all' || tab === 'malls') && filteredMalls.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="w-4 h-4 text-[#0369A1]" />
                <h3 className="font-display text-lg font-bold text-[#1E293B]">
                  Major Shopping Malls & Craft Bazaars ({filteredMalls.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMalls.map((mall) => {
                  const place = getPlaceById(mall.placeId);
                  const visited = progress.visitedMalls.includes(mall.id);
                  const view3D = get3DItemForMall(mall.id);
                  return (
                    <div
                      key={mall.id}
                      className="p-4 bg-white border border-[#E2D5C3] rounded-xl flex flex-col gap-3"
                    >
                      {view3D && (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#E2D5C3] bg-[#1E293B]">
                          <Place3DImage
                            src={view3D.imageUrl}
                            alt={`3D view of ${mall.name}`}
                            title={mall.name}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpen3D(view3D);
                            }}
                            className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 bg-black/65 hover:bg-black/85 text-white text-[11px] font-semibold rounded-md cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>3D View</span>
                          </button>
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-sm text-[#1E293B]">{mall.name}</h4>
                          <div className="text-xs text-[#0369A1]">
                            {mall.tagline} · {place?.name}
                            {visited && ' · Visited'}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleRide({
                                id: mall.id,
                                name: mall.name,
                                subtitle: mall.tagline,
                                kind: 'mall',
                                x: mall.x,
                                y: mall.y,
                              })
                            }
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-[#C84B31] hover:bg-[#B03E26] rounded-lg text-white whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>Ride</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handlePin({
                                kind: 'mall',
                                id: mall.id,
                                name: mall.name,
                                x: mall.x,
                                y: mall.y,
                              })
                            }
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-[#FAF4E8] hover:bg-[#EFE6D8] border border-[#E2D5C3] rounded-lg text-[#1E293B] whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <Compass className="w-3.5 h-3.5 text-[#C84B31]" />
                            <span>Pin</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#64748B]">
                        Anchors: {mall.anchors.join(' · ')}
                      </div>

                      <div className="divide-y divide-[#EFE6D8] border-t border-[#EFE6D8]">
                        {mall.items.map((item) => (
                          <div
                            key={item.id}
                            className="py-2 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0">
                              <div className="font-medium text-[#1E293B] truncate">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#64748B] truncate">
                                {item.category} · {item.description}
                              </div>
                            </div>
                            <div className="font-mono font-semibold tabular-nums text-[#1E293B] shrink-0">
                              ₹{item.price}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Heritages */}
          {(tab === 'all' || tab === 'heritages') && filteredHeritages.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Landmark className="w-4 h-4 text-[#B45309]" />
                <h3 className="font-display text-lg font-bold text-[#1E293B]">
                  Heritage Monuments ({filteredHeritages.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredHeritages.map((site) => {
                  const stamped = progress.stampedHeritages.includes(site.id);
                  const view3D = get3DItemForHeritage(site.id);
                  return (
                    <div
                      key={site.id}
                      className="p-4 bg-white border border-[#E2D5C3] rounded-xl flex flex-col justify-between gap-2.5"
                    >
                      <div>
                        {view3D && (
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 border border-[#E2D5C3] bg-[#1E293B]">
                            <Place3DImage
                              src={view3D.imageUrl}
                              alt={`3D view of ${site.name}`}
                              title={site.name}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpen3D(view3D);
                              }}
                              className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 bg-black/65 hover:bg-black/85 text-white text-[11px] font-semibold rounded-md cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>3D View</span>
                            </button>
                          </div>
                        )}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-sm text-[#1E293B]">{site.name}</h4>
                            <div className="text-xs text-[#7C5A3C] tabular-nums">
                              {site.era} · Entry{' '}
                              {site.ticketPrice === 0 ? 'Free' : `₹${site.ticketPrice}`}
                              {stamped && ' · Stamped'}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                handleRide({
                                  id: site.id,
                                  name: site.name,
                                  subtitle: site.era,
                                  kind: 'heritage',
                                  x: site.x,
                                  y: site.y,
                                })
                              }
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-[#C84B31] hover:bg-[#B03E26] rounded-lg text-white whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>Ride</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handlePin({
                                  kind: 'heritage',
                                  id: site.id,
                                  name: site.name,
                                  x: site.x,
                                  y: site.y,
                                })
                              }
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-[#FAF4E8] hover:bg-[#EFE6D8] border border-[#E2D5C3] rounded-lg text-[#1E293B] whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Compass className="w-3.5 h-3.5 text-[#C84B31]" />
                              <span>Pin</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                          {site.description}
                        </p>
                      </div>
                      <div className="text-[11px] font-medium text-[#15803D] tabular-nums">
                        Discovery Stamp Bonus: +₹{site.rewardRupees}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Famous Restaurants & Foods with Prices */}
          {(tab === 'all' || tab === 'restaurants') && filteredRestaurants.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="w-4 h-4 text-[#C84B31]" />
                <h3 className="font-display text-lg font-bold text-[#1E293B]">
                  Famous Restaurants & Street Food Menus ({filteredRestaurants.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRestaurants.map((rest) => {
                  const place = getPlaceById(rest.placeId);
                  const view3D = get3DItemForRestaurant(rest);
                  return (
                    <div
                      key={rest.id}
                      className="p-4 bg-white border border-[#E2D5C3] rounded-xl flex flex-col gap-3"
                    >
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#E2D5C3] bg-[#1E293B]">
                        <Place3DImage
                          src={view3D.imageUrl}
                          alt={`3D view of ${rest.name}`}
                          title={rest.name}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpen3D(view3D);
                          }}
                          className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 bg-black/65 hover:bg-black/85 text-white text-[11px] font-semibold rounded-md cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>3D View</span>
                        </button>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-sm text-[#1E293B]">{rest.name}</h4>
                          <div className="text-xs text-[#7C5A3C]">
                            {rest.specialty} · {place?.name}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleRide({
                                id: rest.id,
                                name: rest.name,
                                subtitle: rest.specialty,
                                kind: 'restaurant',
                                x: rest.x,
                                y: rest.y,
                              })
                            }
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-[#C84B31] hover:bg-[#B03E26] rounded-lg text-white whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>Ride</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handlePin({
                                kind: 'restaurant',
                                id: rest.id,
                                name: rest.name,
                                x: rest.x,
                                y: rest.y,
                              })
                            }
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-[#FAF4E8] hover:bg-[#EFE6D8] border border-[#E2D5C3] rounded-lg text-[#1E293B] whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <Compass className="w-3.5 h-3.5 text-[#C84B31]" />
                            <span>Pin</span>
                          </button>
                        </div>
                      </div>

                      <div className="divide-y divide-[#EFE6D8] border-t border-[#EFE6D8]">
                        {rest.menu.map((item) => {
                          const tasted = progress.tastedDishes.includes(item.id);
                          return (
                            <div
                              key={item.id}
                              className="py-2 flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="w-2.5 h-2.5 rounded-xs border flex items-center justify-center shrink-0"
                                    style={{
                                      borderColor: item.isVeg ? '#15803D' : '#B91C1C',
                                    }}
                                    title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                                  >
                                    <span
                                      className="w-1.5 h-1.5 rounded-full"
                                      style={{
                                        backgroundColor: item.isVeg ? '#15803D' : '#B91C1C',
                                      }}
                                    />
                                  </span>
                                  <span className="font-medium text-[#1E293B] truncate">
                                    {item.name}
                                  </span>
                                  {tasted && (
                                    <span className="text-[11px] text-[#15803D] shrink-0">
                                      · Tasted
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-[#64748B] truncate">
                                  {item.description}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="font-mono font-semibold tabular-nums text-[#1E293B]">
                                  ₹{item.price}
                                </div>
                                <div className="text-[11px] text-[#D97706] tabular-nums">
                                  +{item.energyRestore} Energy
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {filteredPlaces.length === 0 &&
            filteredMetro.length === 0 &&
            filteredMalls.length === 0 &&
            filteredHeritages.length === 0 &&
            filteredRestaurants.length === 0 && (
              <div className="py-12 text-center text-sm text-[#64748B]">
                No Delhi NCR places, metro stations, malls, monuments, or dishes matched “{query}”.
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
