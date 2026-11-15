"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DomainCatalogItem,
  CurriculumDomainsResponse,
  CurriculumHierarchyResponse,
  CurriculumCategoryHierarchy,
  CurriculumTopicSummary,
  TopicDetailResponse,
  TopicQuestionsResponse,
} from "@/types/curriculum";
import { backendApi } from "@/lib/api-client";
import { getPracticeSessionUrl } from "@/lib/practice-router";

// Storage Keys
export const DOMAINS_CACHE_KEY = "pim_curriculum_cache_v42_domains";
export const HIERARCHY_CACHE_PREFIX = "pim_curriculum_cache_v42_hierarchy_";
export const CANDIDATE_OVERLAYS_KEY = "pim_candidate_topic_overlays";

export interface CachedItem<T> {
  data: T;
  etag: string | null;
  timestamp: number;
}

export interface CandidateTopicOverlay {
  readiness?: number;
  status?: "Needs Practice" | "Not Practiced" | "Practiced" | "In Progress";
  isStarred?: boolean;
}

export type CandidateOverlaysMap = Record<string, CandidateTopicOverlay>;

// Helper: Read from localStorage safely
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

// Helper: Write to localStorage safely
function writeLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // LocalStorage might be full or disabled
  }
}

// Helper: Read candidate overlays
export function getStoredCandidateOverlays(): CandidateOverlaysMap {
  return readLocalStorage<CandidateOverlaysMap>(CANDIDATE_OVERLAYS_KEY) || {};
}

// Helper: Save candidate overlay for a topic
export function setStoredCandidateOverlay(
  topicSlug: string,
  overlay: Partial<CandidateTopicOverlay>
): CandidateOverlaysMap {
  const current = getStoredCandidateOverlays();
  const updated = {
    ...current,
    [topicSlug]: {
      ...current[topicSlug],
      ...overlay,
    },
  };
  writeLocalStorage(CANDIDATE_OVERLAYS_KEY, updated);
  return updated;
}

/**
 * Hook: useCurriculumDomains
 * Manages domain catalog with SWR caching and ETag 304 validation.
 */
export function useCurriculumDomains() {
  const [data, setData] = useState<CurriculumDomainsResponse | null>(() => {
    const cached = readLocalStorage<CachedItem<CurriculumDomainsResponse>>(DOMAINS_CACHE_KEY);
    return cached?.data || null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(!data);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDomains = useCallback(async () => {
    setIsValidating(true);
    const cached = readLocalStorage<CachedItem<CurriculumDomainsResponse>>(DOMAINS_CACHE_KEY);
    const etag = cached?.etag || undefined;

    try {
      const response = await backendApi.getCurriculumDomains(etag);

      if (response.notModified && cached?.data) {
        // 304 Not Modified — keep existing cached data, refresh timestamp
        writeLocalStorage(DOMAINS_CACHE_KEY, {
          data: cached.data,
          etag: cached.etag,
          timestamp: Date.now(),
        });
        setData(cached.data);
      } else if (response.domains && response.domains.length > 0) {
        // 200 OK — fresh data
        const cachePayload: CachedItem<CurriculumDomainsResponse> = {
          data: {
            success: response.success,
            domains: response.domains,
            meta: response.meta,
          },
          etag: response.etag || null,
          timestamp: Date.now(),
        };
        writeLocalStorage(DOMAINS_CACHE_KEY, cachePayload);
        setData(cachePayload.data);
      }
      setError(null);
    } catch (err: any) {
      // If we have cached data, don't break the user experience
      if (!data) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  }, [data]);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  return {
    domains: data?.domains || [],
    meta: data?.meta || null,
    isLoading,
    isValidating,
    error,
    refetch: fetchDomains,
  };
}

/**
 * Hook: useCurriculumHierarchy
 * Manages 3-tier curriculum hierarchy for a domain with SWR caching, ETag 304,
 * and client-side candidate readiness overlay blending.
 */
export function useCurriculumHierarchy(domainSlug: string) {
  const cacheKey = `${HIERARCHY_CACHE_PREFIX}${domainSlug.toLowerCase()}`;

  const [data, setData] = useState<CurriculumHierarchyResponse | null>(() => {
    const cached = readLocalStorage<CachedItem<CurriculumHierarchyResponse>>(cacheKey);
    return cached?.data || null;
  });
  const [overlays, setOverlays] = useState<CandidateOverlaysMap>(getStoredCandidateOverlays);
  const [isLoading, setIsLoading] = useState<boolean>(!data);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchHierarchy = useCallback(async () => {
    if (!domainSlug) return;
    setIsValidating(true);
    const cached = readLocalStorage<CachedItem<CurriculumHierarchyResponse>>(cacheKey);
    const etag = cached?.etag || undefined;

    try {
      const response = await backendApi.getCurriculumHierarchy(domainSlug, etag);

      if (response.notModified && cached?.data) {
        writeLocalStorage(cacheKey, {
          data: cached.data,
          etag: cached.etag,
          timestamp: Date.now(),
        });
        setData(cached.data);
      } else if (response.categories) {
        const cleanPayload: CurriculumHierarchyResponse = {
          domainSlug: response.domainSlug,
          domainName: response.domainName,
          description: response.description,
          version: response.version,
          totalCategories: response.totalCategories,
          totalTopics: response.totalTopics,
          totalQuestions: response.totalQuestions,
          categories: response.categories,
        };
        writeLocalStorage(cacheKey, {
          data: cleanPayload,
          etag: response.etag || null,
          timestamp: Date.now(),
        });
        setData(cleanPayload);
      }
      setError(null);
    } catch (err: any) {
      if (!data) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  }, [domainSlug, cacheKey, data]);

  useEffect(() => {
    // When domainSlug changes, load cached snapshot immediately
    const cached = readLocalStorage<CachedItem<CurriculumHierarchyResponse>>(cacheKey);
    if (cached?.data) {
      setData(cached.data);
      setIsLoading(false);
    } else {
      setData(null);
      setIsLoading(true);
    }
    fetchHierarchy();
  }, [domainSlug, cacheKey, fetchHierarchy]);

  // Toggle star status for a topic
  const toggleStar = useCallback((topicSlug: string) => {
    const currentOverlays = getStoredCandidateOverlays();
    const isStarred = !currentOverlays[topicSlug]?.isStarred;
    const updated = setStoredCandidateOverlay(topicSlug, { isStarred });
    setOverlays(updated);
  }, []);

  // Update candidate status for a topic
  const setTopicStatus = useCallback(
    (
      topicSlug: string,
      status: "Needs Practice" | "Not Practiced" | "Practiced" | "In Progress",
      readiness?: number
    ) => {
      const updated = setStoredCandidateOverlay(topicSlug, {
        status,
        ...(typeof readiness === "number" ? { readiness } : {}),
      });
      setOverlays(updated);
    },
    []
  );

  // Blend candidate overlays and dynamic practiceHref into hierarchy
  const enrichedHierarchy = useMemo<CurriculumHierarchyResponse | null>(() => {
    if (!data) return null;

    const enrichedCategories: CurriculumCategoryHierarchy[] = data.categories.map((cat) => ({
      ...cat,
      topics: cat.topics.map((t) => {
        const overlay = overlays[t.slug] || {};
        return {
          ...t,
          practiceHref: getPracticeSessionUrl(domainSlug, t.slug),
          readiness: overlay.readiness ?? t.readiness ?? (t.priority === "P0" ? 45 : 60),
          status: overlay.status ?? t.status ?? "Not Practiced",
          isStarred: overlay.isStarred ?? t.isStarred ?? false,
        };
      }),
    }));

    return {
      ...data,
      categories: enrichedCategories,
    };
  }, [data, overlays, domainSlug]);

  // Flattened topic list across all categories for search and filtering
  const allTopics = useMemo<CurriculumTopicSummary[]>(() => {
    if (!enrichedHierarchy) return [];
    return enrichedHierarchy.categories.flatMap((cat) => cat.topics);
  }, [enrichedHierarchy]);

  return {
    hierarchy: enrichedHierarchy,
    categories: enrichedHierarchy?.categories || [],
    allTopics,
    isLoading,
    isValidating,
    error,
    toggleStar,
    setTopicStatus,
    refetch: fetchHierarchy,
  };
}

/**
 * Hook: useCurriculum
 * Unified curriculum hook combining catalog and domain hierarchy.
 */
export function useCurriculum(activeDomainSlug = "system-design") {
  const {
    domains,
    meta,
    isLoading: isDomainsLoading,
    isValidating: isDomainsValidating,
    error: domainsError,
    refetch: refetchDomains,
  } = useCurriculumDomains();

  const {
    hierarchy,
    categories,
    allTopics,
    isLoading: isHierarchyLoading,
    isValidating: isHierarchyValidating,
    error: hierarchyError,
    toggleStar,
    setTopicStatus,
    refetch: refetchHierarchy,
  } = useCurriculumHierarchy(activeDomainSlug);

  const activeDomain = useMemo(() => {
    return (
      domains.find(
        (d) => d.slug.toLowerCase() === activeDomainSlug.toLowerCase()
      ) || null
    );
  }, [domains, activeDomainSlug]);

  const refetchAll = useCallback(async () => {
    await Promise.all([refetchDomains(), refetchHierarchy()]);
  }, [refetchDomains, refetchHierarchy]);

  return {
    domains,
    meta,
    activeDomain,
    hierarchy,
    categories,
    allTopics,
    isLoading: isDomainsLoading || isHierarchyLoading,
    isValidating: isDomainsValidating || isHierarchyValidating,
    error: domainsError || hierarchyError,
    toggleStar,
    setTopicStatus,
    refetch: refetchAll,
  };
}

export { useCurriculumTopic } from "./useCurriculumTopic";
