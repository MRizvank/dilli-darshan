import type { ExplorerMilestone } from '../types/game';

export type ExplorerPerkId =
  | 'sprint_efficiency'
  | 'fare_saver'
  | 'compass_radar'
  | 'golden_ring'
  | 'swift_foot';

export const EXPLORER_MILESTONES: ExplorerMilestone[] = [
  {
    level: 1,
    xpRequired: 0,
    title: 'Delhi Roamer',
    perkId: 'starter',
    perkName: 'NCR Explorer Pass',
    perkDescription: 'Access all 18 Delhi NCR districts, Metro lines, and local stalls.',
    badgeColor: '#64748B',
  },
  {
    level: 2,
    xpRequired: 120,
    title: 'Chai Connoisseur',
    perkId: 'sprint_efficiency',
    perkName: 'Energetic Stride (-25% Sprint Drain)',
    perkDescription: 'Sprinting with Shift drains 25% less explorer energy across NCR roads.',
    badgeColor: '#D97706',
  },
  {
    level: 3,
    xpRequired: 280,
    title: 'Metro Navigator',
    perkId: 'fare_saver',
    perkName: 'SmartCard Concession (20% Off Fares)',
    perkDescription: 'Save 20% on all Delhi Metro tickets and booked Rapido, Auto, or Cab rides.',
    badgeColor: '#2563EB',
  },
  {
    level: 4,
    xpRequired: 500,
    title: 'Old Delhi Chronicler',
    perkId: 'compass_radar',
    perkName: 'Wayfinder Sight (+20% Interact Reach)',
    perkDescription: 'Expands landmark, stall, and NPC interaction radius across the city map.',
    badgeColor: '#C84B31',
  },
  {
    level: 5,
    xpRequired: 780,
    title: 'Heritage Laureate',
    perkId: 'golden_ring',
    perkName: 'Laureate Aura (+15% Stamp & Gig Bonus)',
    perkDescription: 'Displays a golden explorer halo on the map and adds +15% bonus Rupees on gigs & stamps.',
    badgeColor: '#B45309',
  },
  {
    level: 6,
    xpRequired: 1120,
    title: 'Sultan of Shahjahanabad',
    perkId: 'swift_foot',
    perkName: 'Capital Express Boots (+15% Travel Speed)',
    perkDescription: 'Permanent +15% travel speed boost across walking and free-roam rides.',
    badgeColor: '#15803D',
  },
];

export const XP_REWARDS = {
  discoverPlace: 40,
  metroRide: 25,
  stampHeritage: 65,
  solveTrivia: 35,
  tasteNewDish: 30,
  repeatDish: 15,
  visitMall: 35,
  buyMallItem: 20,
  completeGig: 85,
  chaiShift: 45,
  talkNpc: 15,
  dailyMission: 60,
  questComplete: 90,
  savePhoto: 20,
} as const;

export function getXpThresholdForLevel(level: number): number {
  const exact = EXPLORER_MILESTONES.find((m) => m.level === level);
  if (exact) return exact.xpRequired;
  const maxDefined = EXPLORER_MILESTONES[EXPLORER_MILESTONES.length - 1];
  if (level <= 1) return 0;
  return maxDefined.xpRequired + (level - maxDefined.level) * 400;
}

export interface ExplorerLevelState {
  level: number;
  xp: number;
  currentLevelFloor: number;
  nextLevelFloor: number;
  xpIntoLevel: number;
  xpNeededForLevel: number;
  progressPct: number;
  defaultTitle: string;
  unlockedMilestones: ExplorerMilestone[];
  unlockedPerks: Set<string>;
}

export function getExplorerLevelState(xp: number): ExplorerLevelState {
  const safeXp = Math.max(0, Math.floor(xp));
  let level = 1;
  while (safeXp >= getXpThresholdForLevel(level + 1)) {
    level += 1;
  }

  const currentLevelFloor = getXpThresholdForLevel(level);
  const nextLevelFloor = getXpThresholdForLevel(level + 1);
  const xpIntoLevel = safeXp - currentLevelFloor;
  const xpNeededForLevel = Math.max(1, nextLevelFloor - currentLevelFloor);
  const progressPct = Math.min(100, Math.max(0, Math.round((xpIntoLevel / xpNeededForLevel) * 100)));

  const unlockedMilestones = EXPLORER_MILESTONES.filter((m) => level >= m.level);
  const highestMilestone = unlockedMilestones[unlockedMilestones.length - 1] ?? EXPLORER_MILESTONES[0];
  const unlockedPerks = new Set(unlockedMilestones.map((m) => m.perkId));

  return {
    level,
    xp: safeXp,
    currentLevelFloor,
    nextLevelFloor,
    xpIntoLevel,
    xpNeededForLevel,
    progressPct,
    defaultTitle: highestMilestone.title,
    unlockedMilestones,
    unlockedPerks,
  };
}

export function applyFareDiscount(fare: number, hasFareSaver: boolean): number {
  if (!hasFareSaver || fare <= 0) return fare;
  return Math.max(10, Math.round(fare * 0.8));
}
