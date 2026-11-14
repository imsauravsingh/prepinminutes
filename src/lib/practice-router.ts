/**
 * PrepInMinutes — Practice Session Archetype Router
 * Maps the 10 canonical curriculum domains to their dedicated interactive workspace shell.
 * Prevents 404 errors by dynamically routing to the appropriate workspace with query parameters.
 */

export type PracticeWorkspaceArchetype =
  | "system-design"
  | "coding"
  | "cloud"
  | "behavioral";

/**
 * Resolves the target practice session URL for any domain and topic combination.
 * Automatically injects `topic` and `domain` query parameters.
 */
export function getPracticeSessionUrl(
  domainSlug: string,
  topicSlug: string
): string {
  const cleanDomain = (domainSlug || "").trim().toLowerCase();
  const cleanTopic = (topicSlug || "").trim().toLowerCase();

  switch (cleanDomain) {
    // Architecture & Canvas Whiteboard Shell
    case "system-design":
    case "ai-system-design":
    case "data-engineering":
      return `/practice/session/system-design?topic=${cleanTopic}&domain=${cleanDomain}`;

    // Code Editor & Algorithmic Test Cases Shell
    case "dsa":
    case "backend-engineering":
    case "frontend-engineering":
    case "low-level-design":
    case "mobile-engineering":
      return `/practice/session/coding?topic=${cleanTopic}&domain=${cleanDomain}`;

    // Cloud Infrastructure & Terminal Shell
    case "cloud-devops":
      return `/practice/session/cloud?topic=${cleanTopic}&domain=${cleanDomain}`;

    // Audio STAR Voice Interview Shell
    case "behavioral-leadership":
      return `/practice/session/behavioral?topic=${cleanTopic}&domain=${cleanDomain}`;

    // Default Fallback
    default:
      return `/practice/session/system-design?topic=${cleanTopic}&domain=${cleanDomain}`;
  }
}

/**
 * Returns the workspace archetype name for a given domain slug.
 */
export function getDomainWorkspaceArchetype(
  domainSlug: string
): PracticeWorkspaceArchetype {
  const clean = (domainSlug || "").trim().toLowerCase();
  switch (clean) {
    case "system-design":
    case "ai-system-design":
    case "data-engineering":
      return "system-design";

    case "dsa":
    case "backend-engineering":
    case "frontend-engineering":
    case "low-level-design":
    case "mobile-engineering":
      return "coding";

    case "cloud-devops":
      return "cloud";

    case "behavioral-leadership":
      return "behavioral";

    default:
      return "system-design";
  }
}
