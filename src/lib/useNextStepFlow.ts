"use client";

import { useEffect, useState } from "react";
import { backendApi } from "@/lib/api-client";

/**
 * Whether the optional Step 2 ("Next Step": AI assessment or plan choice) is
 * part of the candidate journey. Controlled by the admin "Plan Workflow" flag.
 *
 * It is hidden unless the admin flag is explicitly turned on, so a missing or
 * unreachable setting never sends candidates into the AI assessment.
 */
let cached: boolean | null = null;
let inflight: Promise<boolean> | null = null;

function loadNextStepFlow(): Promise<boolean> {
  if (cached !== null) return Promise.resolve(cached);
  if (!inflight) {
    inflight = backendApi
      .getPlatformConfig()
      .then((cfg) => cfg.enableNextStepFlow === true)
      .catch(() => false)
      .then((enabled) => {
        cached = enabled;
        inflight = null;
        return enabled;
      });
  }
  return inflight;
}

export function useNextStepFlow() {
  const [state, setState] = useState<{ enabled: boolean; loaded: boolean }>(() => ({
    enabled: cached ?? false,
    loaded: cached !== null,
  }));

  useEffect(() => {
    let active = true;
    loadNextStepFlow().then((enabled) => {
      if (active) setState({ enabled, loaded: true });
    });
    return () => {
      active = false;
    };
  }, []);

  return state;
}
