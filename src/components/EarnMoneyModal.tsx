import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  Briefcase,
  CheckCircle2,
  Coffee,
  Coins,
  HelpCircle,
  MapPin,
  Navigation,
  RefreshCw,
  Timer,
  X,
} from 'lucide-react';
import {
  CHAI_COUNTER_ITEMS,
  DELHI_TRIVIA_BANK,
  getTimeUntilMidnightLabel,
  getTodayDateKey,
  type NcrDestinationItem,
} from '../data/delhiWorld';
import { soundEngine } from '../utils/audio';
import type { ActiveGigState, GigContract, PlayerProgress } from '../types/game';

interface EarnMoneyModalProps {
  playerX: number;
  playerY: number;
  progress: PlayerProgress;
  activeGig: ActiveGigState | null;
  availableGigs: GigContract[];
  onRefreshGigs: () => void;
  onAcceptGig: (gig: GigContract) => void;
  onCancelGig: () => void;
  onNavigateToGigTarget: (dest: NcrDestinationItem) => void;
  onClaimDailyStipend: () => void;
  onSolveTriviaQuestion: (questionId: string, rewardRupees: number) => void;
  onCompleteChaiShift: (earnedRupees: number, ordersServed: number, energyCost: number) => void;
  onClose: () => void;
}

type EarnTab = 'gigs' | 'chai' | 'trivia';

const SHIFT_DURATION_SEC = 20;
const SHIFT_ENERGY_COST = 10;

export const EarnMoneyModal: React.FC<EarnMoneyModalProps> = ({
  playerX,
  playerY,
  progress,
  activeGig,
  availableGigs,
  onRefreshGigs,
  onAcceptGig,
  onCancelGig,
  onNavigateToGigTarget,
  onClaimDailyStipend,
  onSolveTriviaQuestion,
  onCompleteChaiShift,
  onClose,
}) => {
  const [tab, setTab] = useState<EarnTab>('gigs');

  // --- Chai Counter Shift Mini-Game State ---
  const [shiftRunning, setShiftRunning] = useState(false);
  const [shiftTimeLeft, setShiftTimeLeft] = useState(SHIFT_DURATION_SEC);
  const [shiftEarnings, setShiftEarnings] = useState(0);
  const [shiftServed, setShiftServed] = useState(0);
  const [shiftStreak, setShiftStreak] = useState(0);
  const [shiftTargetIdx, setShiftTargetIdx] = useState(0);
  const [shiftLastResult, setShiftLastResult] = useState<{
    earned: number;
    served: number;
  } | null>(null);
  const [shiftFeedback, setShiftFeedback] = useState<string | null>(null);

  const shiftStatsRef = useRef({ earnings: 0, served: 0 });
  shiftStatsRef.current = { earnings: shiftEarnings, served: shiftServed };

  // --- Trivia State ---
  const [triviaIdx, setTriviaIdx] = useState(() => {
    const unsolvedIdx = DELHI_TRIVIA_BANK.findIndex(
      (q) => !progress.solvedTriviaIds.includes(q.id)
    );
    return unsolvedIdx >= 0 ? unsolvedIdx : 0;
  });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [triviaStatus, setTriviaStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [triviaStreak, setTriviaStreak] = useState(0);

  const todayKey = getTodayDateKey();
  const stipendClaimedToday = progress.lastStipendDateKey === todayKey;
  const resetCountdown = useMemo(() => getTimeUntilMidnightLabel(), []);

  // Chai Shift Countdown Loop
  useEffect(() => {
    if (!shiftRunning) return;
    const interval = window.setInterval(() => {
      setShiftTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setShiftRunning(false);
          const finalEarned = shiftStatsRef.current.earnings;
          const finalServed = shiftStatsRef.current.served;
          setShiftLastResult({ earned: finalEarned, served: finalServed });
          onCompleteChaiShift(finalEarned, finalServed, SHIFT_ENERGY_COST);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [onCompleteChaiShift, shiftRunning]);

  const startChaiShift = () => {
    if (progress.energy < SHIFT_ENERGY_COST) {
      soundEngine.playError();
      setShiftFeedback('Need at least 10 Energy. Rest for a couple seconds or eat at a café!');
      return;
    }
    setShiftLastResult(null);
    setShiftFeedback(null);
    setShiftEarnings(0);
    setShiftServed(0);
    setShiftStreak(0);
    setShiftTimeLeft(SHIFT_DURATION_SEC);
    setShiftTargetIdx(Math.floor(Math.random() * CHAI_COUNTER_ITEMS.length));
    setShiftRunning(true);
    soundEngine.playCoin();
  };

  const handleServeChaiItem = (itemIdx: number) => {
    if (!shiftRunning) return;
    if (itemIdx === shiftTargetIdx) {
      const nextStreak = shiftStreak + 1;
      const bonus = nextStreak >= 3 ? 5 : 0;
      const itemPay = 20 + bonus;
      setShiftStreak(nextStreak);
      setShiftServed((s) => s + 1);
      setShiftEarnings((e) => e + itemPay);
      setShiftFeedback(
        bonus > 0 ? `+₹${itemPay} (${nextStreak}x Streak!)` : `+₹${itemPay} Served`
      );
      soundEngine.playCoin();
      // Pick next random order (avoid repeating exact same item twice in a row)
      let nextIdx = Math.floor(Math.random() * CHAI_COUNTER_ITEMS.length);
      if (nextIdx === itemIdx) {
        nextIdx = (nextIdx + 1) % CHAI_COUNTER_ITEMS.length;
      }
      setShiftTargetIdx(nextIdx);
    } else {
      setShiftStreak(0);
      setShiftFeedback('Wrong item — streak reset!');
      soundEngine.playError();
    }
  };

  const currentQuestion = DELHI_TRIVIA_BANK[triviaIdx % DELHI_TRIVIA_BANK.length];
  const isCurrentSolved = progress.solvedTriviaIds.includes(currentQuestion.id);

  const handlePickTriviaOption = (optIdx: number) => {
    if (triviaStatus === 'correct') return;
    setSelectedOption(optIdx);
    if (optIdx === currentQuestion.correctIndex) {
      setTriviaStatus('correct');
      if (!isCurrentSolved) {
        const nextStreak = triviaStreak + 1;
        setTriviaStreak(nextStreak);
        const streakBonus = nextStreak >= 2 ? 15 : 0;
        onSolveTriviaQuestion(currentQuestion.id, currentQuestion.rewardRupees + streakBonus);
      } else {
        soundEngine.playCoin();
      }
    } else {
      setTriviaStatus('wrong');
      setTriviaStreak(0);
      soundEngine.playError();
    }
  };

  const handleNextTrivia = () => {
    setSelectedOption(null);
    setTriviaStatus('idle');
    setTriviaIdx((idx) => (idx + 1) % DELHI_TRIVIA_BANK.length);
  };

  const activeTarget = activeGig
    ? activeGig.stage === 'pickup'
      ? {
          id: activeGig.contract.pickupId,
          name: activeGig.contract.pickupName,
          x: activeGig.contract.pickupX,
          y: activeGig.contract.pickupY,
          stepLabel: 'Step 1/2 · Pick up parcel at',
        }
      : {
          id: activeGig.contract.dropoffId,
          name: activeGig.contract.dropoffName,
          x: activeGig.contract.dropoffX,
          y: activeGig.contract.dropoffY,
          stepLabel: 'Step 2/2 · Deliver parcel to',
        }
    : null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#1E293B]/45 p-4">
      <div className="bg-[#FFFDF9] border border-[#E2D5C3] rounded-2xl w-full max-w-3xl max-h-[86vh] flex flex-col shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2D5C3]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#15803D] text-white flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#1E293B]">
                Earn Rupees · Dilli Hustle
              </h2>
              <p className="text-xs text-[#64748B] tabular-nums">
                Wallet ₹{progress.rupees} · Energy {Math.round(progress.energy)}/100 · Gigs Completed{' '}
                {progress.gigsCompleted}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close earn rupees panel"
            className="p-2 rounded-lg hover:bg-[#EFE6D8] text-[#475569] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-[#FAF4E8] border-b border-[#EFE6D8] flex items-center gap-1 overflow-x-auto">
          {(
            [
              ['gigs', 'NCR Delivery Gigs'],
              ['chai', 'Chai Counter Shift'],
              ['trivia', 'Trivia & Daily Stipend'],
            ] as Array<[EarnTab, string]>
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 ncr-scroll">
          {/* TAB 1: NCR DELIVERY GIGS */}
          {tab === 'gigs' && (
            <div className="space-y-4">
              {activeGig && activeTarget && (
                <div className="p-4 bg-[#DCFCE7]/45 border border-[#15803D]/50 rounded-xl space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-semibold text-[#15803D]">
                        Active Contract · {activeGig.contract.client}
                      </div>
                      <h3 className="font-display text-base font-bold text-[#1E293B]">
                        {activeGig.contract.title}
                      </h3>
                      <p className="text-xs text-[#334155] mt-0.5">
                        {activeTarget.stepLabel} <strong>{activeTarget.name}</strong>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-base font-bold text-[#15803D] tabular-nums">
                        +₹{activeGig.contract.rewardRupees}
                      </div>
                      <div className="text-[11px] text-[#475569] tabular-nums">
                        {Math.max(
                          0.1,
                          Math.round(
                            (Math.hypot(activeTarget.x - playerX, activeTarget.y - playerY) / 140) *
                              10
                          ) / 10
                        ).toFixed(1)}{' '}
                        km away
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateToGigTarget({
                          id: activeTarget.id,
                          name: activeTarget.name,
                          subtitle: activeGig.contract.title,
                          kind: 'place',
                          x: activeTarget.x,
                          y: activeTarget.y,
                        });
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Book Ride to Target</span>
                    </button>
                    <button
                      type="button"
                      onClick={onCancelGig}
                      className="px-3.5 py-2 bg-white hover:bg-[#FEE2E2] border border-[#E2D5C3] text-[#991B1B] text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Cancel Gig
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[#1E293B]">Available NCR Jobs</h3>
                  <p className="text-xs text-[#64748B]">
                    Accept a contract, travel to the Pickup & Dropoff pins, and collect instant Rupee payouts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onRefreshGigs}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF4E8] hover:bg-[#EFE6D8] border border-[#D6C7B2] rounded-lg text-xs font-semibold text-[#1E293B] shrink-0 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>New Jobs</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableGigs.map((gig) => {
                  const pickupKm =
                    Math.round((Math.hypot(gig.pickupX - playerX, gig.pickupY - playerY) / 140) * 10) /
                    10;
                  const tripKm =
                    Math.round(
                      (Math.hypot(gig.dropoffX - gig.pickupX, gig.dropoffY - gig.pickupY) / 140) *
                        10
                    ) / 10;
                  const isSameAsActive = activeGig?.contract.id === gig.id;

                  return (
                    <div
                      key={gig.id}
                      className="p-4 bg-white border border-[#E2D5C3] rounded-xl flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-[11px] font-medium text-[#7C5A3C]">
                              {gig.category} · {gig.client}
                            </div>
                            <h4 className="font-semibold text-sm text-[#1E293B]">{gig.title}</h4>
                          </div>
                          <span className="font-mono text-sm font-bold text-[#15803D] tabular-nums shrink-0">
                            +₹{gig.rewardRupees}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B]">{gig.description}</p>
                        <div className="pt-1 text-xs text-[#334155] space-y-0.5 tabular-nums">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                            <span className="truncate">
                              Pickup: <strong>{gig.pickupName}</strong> ({pickupKm.toFixed(1)} km)
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                            <span className="truncate">
                              Dropoff: <strong>{gig.dropoffName}</strong> ({tripKm.toFixed(1)} km)
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isSameAsActive}
                        onClick={() => onAcceptGig(gig)}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                          isSameAsActive
                            ? 'bg-[#DCFCE7] text-[#15803D] cursor-default'
                            : 'bg-[#1E293B] hover:bg-[#334155] text-white cursor-pointer'
                        }`}
                      >
                        {isSameAsActive
                          ? 'In Progress'
                          : activeGig
                            ? 'Switch to This Gig'
                            : 'Accept Gig & Pin Compass'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CHAI COUNTER SHIFT MINI-GAME */}
          {tab === 'chai' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FAF4E8] border border-[#E2D5C3] rounded-xl flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-bold text-[#1E293B]">
                    Chandni Chowk Chai & Snack Counter
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Serve customer orders fast during a {SHIFT_DURATION_SEC}-second rush. Earn ₹20 per
                    order + ₹5 streak bonus (costs {SHIFT_ENERGY_COST} Energy).
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs tabular-nums">
                  <div className="flex items-center gap-1.5 font-mono font-bold text-[#1E293B]">
                    <Timer className="w-4 h-4 text-[#C84B31]" />
                    <span>{shiftTimeLeft}s</span>
                  </div>
                  <div className="font-mono font-bold text-[#15803D]">Earned ₹{shiftEarnings}</div>
                </div>
              </div>

              {shiftRunning ? (
                <div className="space-y-4">
                  {/* Timer progress bar */}
                  <div className="w-full h-2 bg-[#EFE6D8] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C84B31] transition-all duration-300"
                      style={{ width: `${(shiftTimeLeft / SHIFT_DURATION_SEC) * 100}%` }}
                    />
                  </div>

                  {/* Current Customer Order */}
                  <div className="p-5 bg-white border-2 border-[#D97706] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-medium text-[#7C5A3C]">Current Customer Order</div>
                      <div className="font-display text-2xl font-bold text-[#1E293B] mt-0.5">
                        {CHAI_COUNTER_ITEMS[shiftTargetIdx].label}
                      </div>
                    </div>
                    <div className="text-xs font-semibold tabular-nums text-[#475569]">
                      Served {shiftServed} · Streak {shiftStreak}x
                      {shiftFeedback && (
                        <div className="text-[#15803D] font-bold mt-0.5">{shiftFeedback}</div>
                      )}
                    </div>
                  </div>

                  {/* Counter Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CHAI_COUNTER_ITEMS.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleServeChaiItem(idx)}
                        className="py-3.5 px-4 bg-white hover:bg-[#FAF4E8] active:scale-95 border border-[#D6C7B2] rounded-xl text-left transition-transform cursor-pointer flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="text-sm font-bold text-[#1E293B]">{item.label}</div>
                          <div className="text-[11px] font-mono text-[#15803D]">{item.priceTag}</div>
                        </div>
                        <Coffee className="w-4 h-4 shrink-0" style={{ color: item.accent }} />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-white border border-[#E2D5C3] rounded-xl text-center space-y-4">
                  {shiftLastResult ? (
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-[#15803D]">Shift Completed</div>
                      <div className="font-display text-2xl font-bold text-[#1E293B] tabular-nums">
                        Earned +₹{shiftLastResult.earned}
                      </div>
                      <p className="text-xs text-[#64748B] tabular-nums">
                        Served {shiftLastResult.served} happy customers at the counter.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Coffee className="w-8 h-8 text-[#B45309] mx-auto" />
                      <div className="font-display text-lg font-bold text-[#1E293B]">
                        Ready for a Counter Shift?
                      </div>
                      <p className="text-xs text-[#64748B] max-w-md mx-auto">
                        Match incoming chai, samosa, and lassi orders quickly before the 20-second
                        rush wraps up.
                      </p>
                    </div>
                  )}

                  {shiftFeedback && (
                    <p className="text-xs font-medium text-[#DC2626]">{shiftFeedback}</p>
                  )}

                  <button
                    type="button"
                    onClick={startChaiShift}
                    className="px-6 py-2.5 bg-[#C84B31] hover:bg-[#B03E26] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    {shiftLastResult ? 'Work Another Shift (-10 Energy)' : 'Start 20s Shift (-10 Energy)'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRIVIA & DAILY STIPEND */}
          {tab === 'trivia' && (
            <div className="space-y-5">
              {/* Daily Explorer Stipend */}
              <div className="p-4 bg-[#FAF4E8] border border-[#E2D5C3] rounded-xl flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-[#7C5A3C]">
                    Daily Explorer Allowance · Resets in {resetCountdown}
                  </div>
                  <h3 className="font-display text-base font-bold text-[#1E293B] mt-0.5">
                    Delhi Heritage Travel Stipend
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Claim ₹150 once each day to fund your Metro rides, snacks, and Auto hops.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={stipendClaimedToday}
                  onClick={onClaimDailyStipend}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold tabular-nums whitespace-nowrap shrink-0 transition-colors ${
                    stipendClaimedToday
                      ? 'bg-[#DCFCE7] text-[#15803D] cursor-default'
                      : 'bg-[#15803D] hover:bg-[#166534] text-white cursor-pointer'
                  }`}
                >
                  {stipendClaimedToday ? 'Claimed Today' : 'Claim +₹150'}
                </button>
              </div>

              {/* Delhi Trivia Bank */}
              <div className="p-5 bg-white border border-[#E2D5C3] rounded-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
                    <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                    <span>
                      {currentQuestion.topic} · Question {(triviaIdx % DELHI_TRIVIA_BANK.length) + 1}/
                      {DELHI_TRIVIA_BANK.length}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-semibold tabular-nums text-[#15803D]">
                    {isCurrentSolved
                      ? 'Already Rewarded'
                      : `+₹${currentQuestion.rewardRupees}${triviaStreak >= 1 ? ' (+₹15 streak)' : ''}`}
                  </div>
                </div>

                <h3 className="font-display text-lg font-bold text-[#1E293B]">
                  {currentQuestion.question}
                </h3>

                <div className="space-y-2">
                  {currentQuestion.options.map((opt, idx) => {
                    const isPicked = selectedOption === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;
                    let cls =
                      'bg-[#FFFDF9] hover:bg-[#FAF4E8] border-[#D6C7B2] text-[#1E293B] cursor-pointer';
                    if (triviaStatus === 'correct' && isCorrect) {
                      cls = 'bg-[#DCFCE7] border-[#15803D] text-[#14532D] font-semibold';
                    } else if (triviaStatus === 'wrong' && isPicked) {
                      cls = 'bg-[#FEE2E2] border-[#DC2626] text-[#991B1B]';
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handlePickTriviaOption(idx)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-xs transition-colors flex items-center justify-between gap-3 ${cls}`}
                      >
                        <span>{opt}</span>
                        {triviaStatus === 'correct' && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {triviaStatus === 'correct' && (
                  <div className="p-3 bg-[#FAF4E8] border border-[#E2D5C3] rounded-lg text-xs text-[#334155]">
                    {currentQuestion.fact}
                  </div>
                )}

                {triviaStatus === 'wrong' && (
                  <p className="text-xs font-medium text-[#DC2626]">
                    Not quite — give another option a shot!
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#EFE6D8] text-xs">
                  <div className="flex items-center gap-1.5 text-[#64748B] tabular-nums">
                    <Award className="w-4 h-4 text-[#D97706]" />
                    <span>
                      Solved {progress.solvedTriviaIds.length}/{DELHI_TRIVIA_BANK.length} Delhi facts
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextTrivia}
                    className="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] text-white font-semibold rounded-lg cursor-pointer"
                  >
                    Next Question
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
