"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TopicDetailResponse,
  BaseTopicNode,
  BaseQuestionNode,
} from "@/types/curriculum";
import { backendApi } from "@/lib/api-client";

export const TOPIC_CACHE_PREFIX = "pim_curriculum_cache_topic_";

export interface CachedTopicItem {
  data: TopicDetailResponse;
  timestamp: number;
}

function readLocalStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // LocalStorage quota or access error
  }
}

export function generateDefaultTopicData(topicSlug: string): TopicDetailResponse {
  const cleanTitle = topicSlug
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const defaultQuestion: BaseQuestionNode = {
    id: `q_${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_01`,
    title: `${cleanTitle} Architectural Scenario`,
    difficulty: "INTERMEDIATE",
    learningLevel: "L2",
    archetype: "deep-dive",
    prompt: `Analyze and design a resilient architecture for ${cleanTitle}. Walk through requirements scoping, component trade-offs, bottleneck identification, and failure recovery.`,
    rubricGuide: `Candidate should demonstrate understanding of ${cleanTitle}, component boundaries, scalability bottlenecks, and high-availability mitigations.`,
    rubricAtoms: [
      "Requirements and constraints scoping",
      "Component decomposition and data flow",
      "Trade-off analysis and bottleneck identification",
      "Failure modes and graceful degradation",
    ],
    hints: [
      "Start by clarifying non-functional constraints like scale, latency, and consistency.",
      "Consider how data is stored, partitioned, and cached.",
      "Identify the single point of failure (SPOF) and how to mitigate it.",
    ],
    followUpProbes: [
      "How would this architecture behave if traffic suddenly spikes by 10x?",
      "What monitoring and alerting metrics would you set up in production?",
    ],
    expectedKeywords: [
      "scalability",
      "high availability",
      "latency",
      "consistency",
      "throughput",
    ],
  };

  const defaultTopic: BaseTopicNode = {
    slug: topicSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    topicId: cleanTitle.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || "TOPIC",
    title: cleanTitle,
    priority: "P0",
    difficulty: "INTERMEDIATE",
    durationMin: 20,
    frequency: 0.85,
    weight: 0.85,
    trend: "HOT",
    description: `Core interview topics covering ${cleanTitle} concepts and real-world trade-offs.`,
    rubricAtoms: defaultQuestion.rubricAtoms,
  };

  return {
    success: true,
    domain: {
      slug: "system-design",
      name: "System Design & Distributed Systems",
    },
    category: {
      slug: "core-architecture",
      name: "Core Architecture",
      pillar: "architecture",
    },
    topic: defaultTopic,
    graphRelationships: {
      prerequisites: [],
      dependents: [],
      usedComponents: [],
      foundedOn: [],
    },
    questions: [defaultQuestion],
  };
}

export interface UseCurriculumTopicOptions {
  topicSlug?: string | null;
  questionId?: string | null;
  defaultTopicSlug?: string;
}

export function useCurriculumTopic(options?: UseCurriculumTopicOptions) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTopicSlug = useMemo(() => {
    const rawParam =
      options?.topicSlug ||
      searchParams?.get("topic") ||
      searchParams?.get("topicSlug") ||
      searchParams?.get("slug") ||
      options?.defaultTopicSlug ||
      "distributed-caching";

    try {
      return decodeURIComponent(rawParam).trim();
    } catch {
      return rawParam.trim();
    }
  }, [options?.topicSlug, searchParams, options?.defaultTopicSlug]);

  const urlQuestionId = useMemo(() => {
    return options?.questionId || searchParams?.get("q") || null;
  }, [options?.questionId, searchParams]);

  const cacheKey = `${TOPIC_CACHE_PREFIX}${activeTopicSlug.toLowerCase()}`;

  const [topicData, setTopicData] = useState<TopicDetailResponse | null>(() => {
    const cached = readLocalStorage<CachedTopicItem>(cacheKey);
    return cached?.data || null;
  });

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    urlQuestionId
  );
  const [isLoading, setIsLoading] = useState<boolean>(!topicData);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Sync internal state if URL question param changes
  useEffect(() => {
    if (urlQuestionId) {
      setActiveQuestionId(urlQuestionId);
    }
  }, [urlQuestionId]);

  // Fetch topic details
  const fetchTopic = useCallback(async () => {
    if (!activeTopicSlug) return;
    setIsValidating(true);

    try {
      const response = await backendApi.getCurriculumTopicDetail(activeTopicSlug);
      if (response && response.topic) {
        setTopicData(response);
        writeLocalStorage(cacheKey, {
          data: response,
          timestamp: Date.now(),
        });
        setError(null);
      } else {
        // Fallback to synthesized topic data
        const fallback = generateDefaultTopicData(activeTopicSlug);
        setTopicData(fallback);
      }
    } catch (err: any) {
      setTopicData((prev) => prev || generateDefaultTopicData(activeTopicSlug));
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  }, [activeTopicSlug, cacheKey]);

  useEffect(() => {
    // When topic slug changes, check cache first
    const cached = readLocalStorage<CachedTopicItem>(cacheKey);
    if (cached?.data) {
      setTopicData(cached.data);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    fetchTopic();
  }, [activeTopicSlug, cacheKey, fetchTopic]);

  const questions = useMemo<BaseQuestionNode[]>(() => {
    if (topicData?.questions && topicData.questions.length > 0) {
      return topicData.questions;
    }
    return generateDefaultTopicData(activeTopicSlug).questions;
  }, [topicData, activeTopicSlug]);

  // Selected Active Question
  const activeQuestion = useMemo<BaseQuestionNode>(() => {
    if (activeQuestionId) {
      const found = questions.find((q) => q.id === activeQuestionId);
      if (found) return found;
    }
    return questions[0] || generateDefaultTopicData(activeTopicSlug).questions[0];
  }, [questions, activeQuestionId, activeTopicSlug]);

  const activeQuestionIndex = useMemo(() => {
    const idx = questions.findIndex((q) => q.id === activeQuestion.id);
    return idx >= 0 ? idx : 0;
  }, [questions, activeQuestion]);

  // Select question and update URL query params without scroll
  const selectQuestion = useCallback(
    (questionId: string) => {
      setActiveQuestionId(questionId);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("q", questionId);
        router.replace(url.pathname + url.search, { scroll: false });
      }
    },
    [router]
  );

  const nextQuestion = useCallback(() => {
    if (questions.length === 0) return;
    const nextIdx = (activeQuestionIndex + 1) % questions.length;
    selectQuestion(questions[nextIdx].id);
  }, [questions, activeQuestionIndex, selectQuestion]);

  const previousQuestion = useCallback(() => {
    if (questions.length === 0) return;
    const prevIdx =
      (activeQuestionIndex - 1 + questions.length) % questions.length;
    selectQuestion(questions[prevIdx].id);
  }, [questions, activeQuestionIndex, selectQuestion]);

  return {
    topicSlug: activeTopicSlug,
    topic: topicData?.topic || null,
    domain: topicData?.domain || null,
    category: topicData?.category || null,
    graphRelationships: topicData?.graphRelationships || null,
    questions,
    activeQuestion,
    activeQuestionIndex,
    totalQuestions: questions.length,
    isLoading,
    isValidating,
    error,
    selectQuestion,
    nextQuestion,
    previousQuestion,
    refetch: fetchTopic,
  };
}
