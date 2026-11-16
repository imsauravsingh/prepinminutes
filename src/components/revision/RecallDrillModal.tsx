"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  RotateCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  ArrowRight,
  Brain,
  Layers,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { backendApi, RevisionItemDto } from "@/lib/api-client";

export interface RecallCardItem {
  id: string; // revisionItem ID
  topicTitle: string;
  topicSlug: string;
  domain: string;
  difficulty: string;
  questionPrompt: string;
  answerSummary: string;
  keyRubricAtoms: string[];
  tradeoffsAnchor: string;
  hints?: string[];
  recallStrength: number;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  retentionBand: string;
}

export interface RecallDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDrillComplete?: () => void;
  initialTopicSlug?: string;
  initialRevisionItemId?: string;
}

// Fallback high-yield topics if no due revision items exist yet in DB
const FALLBACK_DRILL_CARDS: RecallCardItem[] = [
  {
    id: "fb-1",
    topicTitle: "Scalability Fundamentals & Load Balancing",
    topicSlug: "scalability-fundamentals",
    domain: "SYSTEM DESIGN",
    difficulty: "INTERMEDIATE",
    questionPrompt:
      "Explain the fundamental architectural differences and operational trade-offs between Layer 4 (Transport) vs Layer 7 (Application) Load Balancing. When should you choose L4 over L7?",
    answerSummary:
      "Layer 4 load balancers route packets strictly by IP address and TCP/UDP port without decrypting or inspecting application payload. Layer 7 load balancers terminate TLS and inspect HTTP headers, cookies, and URLs to make intelligent routing decisions.",
    keyRubricAtoms: [
      "L4 routes at packet level with zero TLS decryption overhead (ultra-low latency, maximum packets-per-second).",
      "L7 terminates SSL/TLS and inspects HTTP paths/cookies (enables path routing, sticky sessions, rate limiting).",
      "Trade-off: L4 offers 5-10x raw packet throughput; L7 requires significantly higher memory/CPU footprint.",
    ],
    tradeoffsAnchor:
      "Choose L4 for edge ingress, gaming, DNS, and multi-protocol streaming. Choose L7 for microservices routing, canary deployments, and API gateways.",
    hints: [
      "Think about the OSI model layers and where TLS handshake termination occurs.",
      "Consider what happens to CPU utilization when decrypting 100k HTTPS requests per second.",
    ],
    recallStrength: 46,
    intervalDays: 1,
    easeFactor: 2.5,
    repetitions: 0,
    retentionBand: "CRITICAL",
  },
  {
    id: "fb-2",
    topicTitle: "Database Sharding & Rebalancing",
    topicSlug: "database-sharding",
    domain: "SYSTEM DESIGN",
    difficulty: "ADVANCED",
    questionPrompt:
      "How does Consistent Hashing minimize data movement during shard scale-out compared to naive modulo hashing ($hash(K) \\pmod N$)? What role do Virtual Nodes play?",
    answerSummary:
      "Consistent Hashing maps both keys and storage nodes to a circular hash ring ($[0, 2^{32}-1]$). When a node is added or removed, only $K/N$ keys on adjacent ring partitions are re-mapped, avoiding total rehash churn.",
    keyRubricAtoms: [
      "Naive modulo ($K \\pmod N$) forces nearly 100% of keys to migrate when node count $N$ increments.",
      "Consistent hashing ring limits migrations strictly to neighbors ($K/N$ average rebalancing).",
      "Virtual nodes (e.g. 100-200 vnodes per physical server) distribute non-uniform keys evenly to eliminate hot-spot partitions.",
    ],
    tradeoffsAnchor:
      "Virtual nodes provide uniform distribution and predictable load shedding at the cost of maintaining a slightly larger routing lookup tree.",
    hints: [
      "Visualize an integer ring from 0 to 2^32 - 1.",
      "Think about non-uniform key hashing distributions without virtual points on the ring.",
    ],
    recallStrength: 51,
    intervalDays: 2,
    easeFactor: 2.5,
    repetitions: 1,
    retentionBand: "NEEDS_REINFORCEMENT",
  },
  {
    id: "fb-3",
    topicTitle: "Distributed Caching & Invalidation Strategies",
    topicSlug: "distributed-caching",
    domain: "SYSTEM DESIGN",
    difficulty: "INTERMEDIATE",
    questionPrompt:
      "Compare Cache-Aside vs Write-Through vs Write-Back caching strategies. What are the consistency and latency trade-offs for each during network partitions?",
    answerSummary:
      "Cache-Aside places application in charge of lazily reading from cache and falling back to DB. Write-Through updates cache and DB synchronously. Write-Back writes to cache immediately and flushes asynchronously to DB.",
    keyRubricAtoms: [
      "Cache-Aside: Resilient to cache failure, but initial reads suffer cache-miss latency and risk stale data under concurrent writes.",
      "Write-Through: High read consistency and no stale data, but write operations suffer double latency (cache + DB).",
      "Write-Back: Ultra-fast write latency and batch DB I/O, but risks catastrophic data loss if cache crashes before dirty writes flush.",
    ],
    tradeoffsAnchor:
      "Write-Back is ideal for heavy write workloads (clickstreams, metrics); Cache-Aside is the industry standard for read-heavy transactional web services.",
    hints: [
      "Differentiate synchronous vs asynchronous database writes.",
      "Consider what happens if the Redis/Memcached cluster crashes during a write spike.",
    ],
    recallStrength: 58,
    intervalDays: 4,
    easeFactor: 2.6,
    repetitions: 2,
    retentionBand: "NEEDS_REINFORCEMENT",
  },
  {
    id: "fb-4",
    topicTitle: "CAP Theorem & PACELC Trade-Offs",
    topicSlug: "cap-theorem",
    domain: "SYSTEM DESIGN",
    difficulty: "ADVANCED",
    questionPrompt:
      "Under PACELC theorem, how does a distributed database like Apache Cassandra vs DynamoDB configure trade-offs when there is NO network partition?",
    answerSummary:
      "CAP theorem only addresses behavior during Partition (P) vs Availability (A) vs Consistency (C). PACELC extends this: If Partition (P), choose Availability (A) or Consistency (C); Else (E), choose Latency (L) or Consistency (C).",
    keyRubricAtoms: [
      "CAP is incomplete: distributed systems spend 99.9% of their lifespan in non-partitioned normal operation.",
      "PACELC formulation: If (P) choose (A) or (C); Else (E) choose (L) or (C).",
      "Cassandra defaults to PA/EL (favors Latency in normal mode via eventual consistency tunable quorum).",
      "HBase/MongoDB defaults to PC/EC (enforces strong Consistency at the cost of higher round-trip Latency).",
    ],
    tradeoffsAnchor:
      "Tunable consistency (e.g. Read Quorum + Write Quorum > Replication Factor) allows fine-tuning Latency vs Consistency dynamically.",
    hints: [
      "What does the 'E', 'L', and 'C' stand for in PACELC?",
      "Think about latency overhead of synchronous master-replica acknowledgment.",
    ],
    recallStrength: 65,
    intervalDays: 6,
    easeFactor: 2.5,
    repetitions: 2,
    retentionBand: "STABLE",
  },
];

const GRADE_LABELS = [
  { grade: 0, label: "0 • Blackout", desc: "No recall", color: "hover:bg-rose-50 border-rose-200 text-rose-700 hover:border-rose-400" },
  { grade: 1, label: "1 • Incorrect", desc: "Wrong memory", color: "hover:bg-rose-50 border-rose-200 text-rose-700 hover:border-rose-400" },
  { grade: 2, label: "2 • Hesitant", desc: "Hard struggle", color: "hover:bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-400" },
  { grade: 3, label: "3 • Pass", desc: "Passed w/ effort", color: "hover:bg-yellow-50 border-yellow-200 text-yellow-700 hover:border-yellow-400" },
  { grade: 4, label: "4 • Good", desc: "Clean recall", color: "hover:bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-400" },
  { grade: 5, label: "5 • Perfect", desc: "Flawless & instant", color: "hover:bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-500 font-bold" },
];

export function RecallDrillModal({
  isOpen,
  onClose,
  onDrillComplete,
  initialTopicSlug,
  initialRevisionItemId,
}: RecallDrillModalProps) {
  const [cards, setCards] = useState<RecallCardItem[]>(FALLBACK_DRILL_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackDelta, setFeedbackDelta] = useState<{
    grade: number;
    intervalDelta: string;
    newBand: string;
    newStrength: number;
  } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedStats, setCompletedStats] = useState<{
    reviewedCount: number;
    masteredCount: number;
    needsReinforcementCount: number;
    healthGain: number;
  }>({ reviewedCount: 0, masteredCount: 0, needsReinforcementCount: 0, healthGain: 0 });

  // 1. Fetch live due revision items from backend edge API
  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    setIsCompleted(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setFeedbackDelta(null);

    backendApi
      .getRevisionItems({ dueOnly: false })
      .then((res) => {
        if (res.success && res.items && res.items.length > 0) {
          // Map DB items to drill card format, augmenting with high-yield questions
          const mappedCards: RecallCardItem[] = res.items.map((item: RevisionItemDto, idx: number) => {
            const fallback = FALLBACK_DRILL_CARDS[idx % FALLBACK_DRILL_CARDS.length];
            return {
              id: item.id,
              topicTitle: item.topic?.title || item.topicTitle || fallback.topicTitle,
              topicSlug: item.topic?.slug || fallback.topicSlug,
              domain: item.domain ? item.domain.toUpperCase().replace(/-/g, " ") : fallback.domain,
              difficulty: item.topic?.difficulty || fallback.difficulty,
              questionPrompt: fallback.questionPrompt,
              answerSummary: fallback.answerSummary,
              keyRubricAtoms: fallback.keyRubricAtoms,
              tradeoffsAnchor: fallback.tradeoffsAnchor,
              hints: fallback.hints,
              recallStrength: item.recallStrength,
              intervalDays: item.intervalDays,
              easeFactor: item.easeFactor,
              repetitions: item.repetitions,
              retentionBand: item.retentionBand,
            };
          });

          // If initialRevisionItemId or initialTopicSlug is set, bring it to the front
          if (initialRevisionItemId || initialTopicSlug) {
            mappedCards.sort((a, b) => {
              if (a.id === initialRevisionItemId || a.topicSlug === initialTopicSlug) return -1;
              if (b.id === initialRevisionItemId || b.topicSlug === initialTopicSlug) return 1;
              return 0;
            });
          }

          setCards(mappedCards);
        } else {
          setCards(FALLBACK_DRILL_CARDS);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch due revision items, falling back to cached cards:", err);
        setCards(FALLBACK_DRILL_CARDS);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isOpen, initialTopicSlug, initialRevisionItemId]);

  const currentCard = cards[currentIndex] || cards[0];

  // 2. Handle Flip toggle
  const handleFlip = useCallback(() => {
    if (isSubmitting || feedbackDelta) return;
    setIsFlipped((prev) => !prev);
  }, [isSubmitting, feedbackDelta]);

  // 3. Handle Grade Submission ($q \in [0, 5]$)
  const handleSelectGrade = async (grade: number) => {
    if (isSubmitting || !currentCard) return;

    setIsSubmitting(true);
    try {
      const res = await backendApi.submitRevisionRecall({
        revisionItemId: currentCard.id.startsWith("fb-") ? undefined : currentCard.id,
        topicSlug: currentCard.topicSlug,
        qualityGrade: grade,
      });

      const sm2 = res.sm2Output;
      const intervalDays = sm2?.intervalDays ?? (grade >= 3 ? currentCard.intervalDays * 2 : 1);
      const newBand = sm2?.retentionBand ?? (grade >= 4 ? "MASTERED" : grade === 3 ? "STABLE" : "CRITICAL");
      const newStrength = sm2?.recallStrength ?? (grade >= 4 ? 98 : grade === 3 ? 80 : 35);

      setFeedbackDelta({
        grade,
        intervalDelta: `+${Math.max(1, Math.round(intervalDays))}d interval`,
        newBand,
        newStrength,
      });

      // Update completed counters
      setCompletedStats((prev) => ({
        ...prev,
        reviewedCount: prev.reviewedCount + 1,
        masteredCount: grade >= 4 ? prev.masteredCount + 1 : prev.masteredCount,
        needsReinforcementCount: grade < 3 ? prev.needsReinforcementCount + 1 : prev.needsReinforcementCount,
        healthGain: prev.healthGain + (grade >= 3 ? 2 : 0),
      }));

      // Automatically advance after brief feedback
      setTimeout(() => {
        setFeedbackDelta(null);
        setIsFlipped(false);
        setShowHint(false);

        if (currentIndex + 1 < cards.length) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setIsCompleted(true);
        }
        setIsSubmitting(false);
      }, 750);
    } catch (err) {
      console.warn("Recall submission error:", err);
      // Fallback local update
      setFeedbackDelta({
        grade,
        intervalDelta: grade >= 3 ? "+6d interval" : "+1d interval",
        newBand: grade >= 4 ? "MASTERED" : "CRITICAL",
        newStrength: grade >= 3 ? 85 : 35,
      });

      setCompletedStats((prev) => ({
        ...prev,
        reviewedCount: prev.reviewedCount + 1,
        masteredCount: grade >= 4 ? prev.masteredCount + 1 : prev.masteredCount,
        needsReinforcementCount: grade < 3 ? prev.needsReinforcementCount + 1 : prev.needsReinforcementCount,
        healthGain: prev.healthGain + 2,
      }));

      setTimeout(() => {
        setFeedbackDelta(null);
        setIsFlipped(false);
        setShowHint(false);
        if (currentIndex + 1 < cards.length) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setIsCompleted(true);
        }
        setIsSubmitting(false);
      }, 750);
    }
  };

  // 4. Keyboard Shortcuts: Space/Enter to flip, 0-5 to rate
  useEffect(() => {
    if (!isOpen || isCompleted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if modifier keys active
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        handleFlip();
      } else if (e.code === "Escape") {
        onClose();
      } else if (isFlipped && !isSubmitting && !feedbackDelta) {
        if (["0", "1", "2", "3", "4", "5"].includes(e.key)) {
          e.preventDefault();
          handleSelectGrade(Number(e.key));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFlipped, isSubmitting, feedbackDelta, isCompleted, handleFlip, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="relative flex flex-col w-full max-w-2xl max-h-[92vh] rounded-2xl bg-white shadow-2xl border border-line overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line/80 bg-[#fbfaf8]">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#ffece6] text-brand">
              <Brain className="size-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand">
                RAPID ACTIVE RECALL DRILL
              </span>
              <span className="text-sm font-bold text-ink">
                SuperMemo SM-2 Spaced Reinforcement
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isCompleted && cards.length > 0 && (
              <span className="text-xs font-mono font-bold text-ink-muted bg-white px-2.5 py-1 rounded-md border border-line">
                Card {currentIndex + 1} of {cards.length}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Top Progress Bar */}
        {!isCompleted && cards.length > 0 && (
          <div className="w-full bg-[#f0ede6] h-1.5 overflow-hidden">
            <div
              className="h-full bg-brand transition-all duration-300 ease-out"
              style={{
                width: `${((currentIndex + (isFlipped ? 0.5 : 0)) / cards.length) * 100}%`,
              }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-ink-muted">
              <RotateCw className="size-8 animate-spin text-brand" />
              <p className="text-sm font-medium">Loading high-yield recall cards...</p>
            </div>
          ) : isCompleted ? (
            /* ========================================================= */
            /* Drill Completion Summary Screen */
            /* ========================================================= */
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center gap-6">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-[#edf5ec] text-[#10b981] border border-[#d1fae5] shadow-xs">
                <Sparkles className="size-8" />
              </div>

              <div className="flex flex-col gap-1.5 max-w-md">
                <h3 className="font-display text-2xl font-extrabold text-ink">
                  Recall Drill Completed!
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  Your spaced repetition memory intervals have been synchronized with the SuperMemo SM-2 engine.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                <div className="flex flex-col items-center p-3 rounded-xl bg-[#faf8f5] border border-line">
                  <span className="text-[11px] font-medium text-ink-muted">Reviewed</span>
                  <span className="font-display text-xl font-extrabold text-ink mt-0.5">
                    {completedStats.reviewedCount}
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-[#edf5ec] border border-[#d1fae5]">
                  <span className="text-[11px] font-medium text-[#059669]">Mastered</span>
                  <span className="font-display text-xl font-extrabold text-[#059669] mt-0.5">
                    {completedStats.masteredCount}
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-[#fff0ec] border border-[#ffd8cc]">
                  <span className="text-[11px] font-medium text-brand">Est. Health</span>
                  <span className="font-display text-xl font-extrabold text-brand mt-0.5">
                    +{completedStats.healthGain || 6}%
                  </span>
                </div>
              </div>

              {/* CTA Action */}
              <button
                onClick={() => {
                  onClose();
                  onDrillComplete?.();
                }}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-95 transition-all cursor-pointer active:scale-98"
              >
                <span>Return to Revision Hub</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          ) : (
            /* ========================================================= */
            /* Active Flashcard 3D Presentation Container */
            /* ========================================================= */
            <div className="flex flex-col gap-4">
              {/* Card Meta Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f3efe9] text-[10px] font-bold text-ink uppercase tracking-wider">
                    {currentCard.domain}
                  </span>
                  <span className="px-2 py-0.5 rounded-md border border-line bg-white text-[10px] font-bold text-ink-muted">
                    {currentCard.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <Clock className="size-3.5" />
                  <span>2 min drill</span>
                  <span className="text-line">•</span>
                  <span className="font-mono font-semibold text-brand">
                    {currentCard.recallStrength}% Recall
                  </span>
                </div>
              </div>

              {/* 3D Flip Card Container */}
              <div
                style={{ perspective: "1200px" }}
                className="w-full min-h-[340px] cursor-pointer select-none"
                onClick={handleFlip}
              >
                <div
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  className="relative w-full min-h-[340px] rounded-2xl border border-line bg-white shadow-xs"
                >
                  {/* FRONT FACE (Question Prompt) */}
                  <div
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                    className="absolute inset-0 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white overflow-y-auto"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Topic Title */}
                      <div className="flex items-center gap-2 text-ink-muted text-xs">
                        <Layers className="size-4 text-brand" />
                        <span className="font-semibold text-ink">{currentCard.topicTitle}</span>
                      </div>

                      {/* Question Headline */}
                      <h4 className="font-display text-lg sm:text-xl font-bold text-ink leading-snug">
                        {currentCard.questionPrompt}
                      </h4>

                      {/* Optional Hint Toggle */}
                      {currentCard.hints && currentCard.hints.length > 0 && (
                        <div
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowHint((prev) => !prev);
                          }}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline cursor-pointer">
                            <Lightbulb className="size-3.5" />
                            <span>{showHint ? "Hide Hint" : "Need a hint?"}</span>
                          </div>

                          {showHint && (
                            <div className="mt-2 p-3 rounded-lg bg-[#fff8f5] border border-[#ffe0d6] text-xs text-ink leading-relaxed">
                              <ul className="list-disc list-inside space-y-1">
                                {currentCard.hints.map((hint, i) => (
                                  <li key={i}>{hint}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Prompt Helper */}
                    <div className="flex items-center justify-between pt-4 border-t border-line/60 text-xs text-ink-muted">
                      <span className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-black/5 font-mono text-[10px]">Space</span>
                        <span>or click to flip</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFlip();
                        }}
                        className="flex items-center gap-1 font-bold text-brand hover:underline"
                      >
                        <span>Reveal Rubric Answer</span>
                        <ChevronRight className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* BACK FACE (Answer Rubric & Architectural Takeaways) */}
                  <div
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                    className="absolute inset-0 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#fbfaf8] border border-brand/20 overflow-y-auto"
                  >
                    <div className="flex flex-col gap-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          KEY ARCHITECTURAL ANSWER
                        </span>
                        <span className="text-xs text-ink-muted">Card Back</span>
                      </div>

                      {/* Answer Summary */}
                      <p className="text-xs sm:text-sm text-ink leading-relaxed font-medium">
                        {currentCard.answerSummary}
                      </p>

                      {/* Rubric Atoms */}
                      <div className="flex flex-col gap-1.5 pt-2 border-t border-line/60">
                        <span className="text-[11px] font-bold text-ink uppercase tracking-wide">
                          Must-Hit Rubric Criteria:
                        </span>
                        <ul className="space-y-1">
                          {currentCard.keyRubricAtoms.map((atom, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-ink-muted">
                              <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{atom}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Trade-off Anchor */}
                      {currentCard.tradeoffsAnchor && (
                        <div className="p-2.5 rounded-lg bg-[#fff8f5] border border-[#ffd8cc] text-[11px] text-brand leading-relaxed font-medium">
                          <strong>Staff Anchor:</strong> {currentCard.tradeoffsAnchor}
                        </div>
                      )}
                    </div>

                    {/* Bottom Helper */}
                    <div className="pt-3 border-t border-line/60 text-[11px] text-ink-muted text-center">
                      Grade your active recall below to calibrate your next review interval.
                    </div>
                  </div>
                </div>
              </div>

              {/* SM-2 Quality Grading Bar (Visible when flipped or answering) */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-ink">
                    {isFlipped ? "How well did you recall this concept?" : "Flip card above to grade your recall"}
                  </span>
                  {feedbackDelta && (
                    <span className="flex items-center gap-1 font-bold text-emerald-600 text-xs animate-in fade-in">
                      <TrendingUp className="size-3.5" />
                      <span>{feedbackDelta.intervalDelta} • {feedbackDelta.newBand}</span>
                    </span>
                  )}
                </div>

                {/* 6-Point Button Scale (0 to 5) */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {GRADE_LABELS.map((item) => (
                    <button
                      key={item.grade}
                      type="button"
                      disabled={!isFlipped || isSubmitting || feedbackDelta !== null}
                      onClick={() => handleSelectGrade(item.grade)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 ${item.color} ${
                        feedbackDelta?.grade === item.grade ? "ring-2 ring-brand ring-offset-1 bg-white font-bold" : "bg-white"
                      }`}
                    >
                      <span className="text-xs font-bold">{item.label}</span>
                      <span className="text-[10px] text-ink-muted opacity-80 mt-0.5">
                        {item.desc}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Keyboard shortcut hint */}
                <div className="flex items-center justify-center gap-1 text-[11px] text-ink-muted pt-1">
                  <span>Press keys</span>
                  <span className="px-1.5 py-0.2 rounded bg-black/5 font-mono text-[10px]">0</span>
                  <span>through</span>
                  <span className="px-1.5 py-0.2 rounded bg-black/5 font-mono text-[10px]">5</span>
                  <span>for rapid grading</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
