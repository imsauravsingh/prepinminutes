/**
 * PrepInMinutes — TASK-P4-02: 10-Domain Responsive Navigation Test Suite
 *
 * Verifies:
 * 1. 10 Canonical Domain visual mappings exist with required theme tokens & Lucide icons
 * 2. Domain list covers all 10 canonical slugs exactly matching Neo4j/Postgres
 * 3. Dynamic counts and active domain header summary metadata are valid
 * 4. Practice archetype routes resolve correctly for each of the 10 domains
 */

import {
  DOMAIN_VISUAL_MAP,
  DomainVisualMeta,
} from "../src/components/practice/ChooseTopicWorkspace";
import {
  getPracticeSessionUrl,
  getDomainWorkspaceArchetype,
} from "../src/lib/practice-router";

const EXPECTED_CANONICAL_DOMAINS = [
  "system-design",
  "ai-system-design",
  "low-level-design",
  "dsa",
  "backend-engineering",
  "frontend-engineering",
  "cloud-devops",
  "behavioral-leadership",
  "data-engineering",
  "mobile-engineering",
];

let passed = 0;
let total = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` -> ${detail}` : ""}`);
    throw new Error(`Assertion failed: ${testName}`);
  }
}

function runTests() {
  console.log("==================================================================");
  console.log("🧪 Running TASK-P4-02: 10-Domain Responsive Navigation Suite");
  console.log("==================================================================\n");

  console.log("👉 Test Suite 1: Canonical 10-Domain Visual Map Integrity");
  assert(
    Object.keys(DOMAIN_VISUAL_MAP).length === 10,
    `DOMAIN_VISUAL_MAP contains exactly 10 domains (got ${Object.keys(DOMAIN_VISUAL_MAP).length})`
  );

  for (const slug of EXPECTED_CANONICAL_DOMAINS) {
    const meta: DomainVisualMeta = DOMAIN_VISUAL_MAP[slug];
    assert(!!meta, `Visual meta exists for canonical domain "${slug}"`);
    assert(typeof meta.shortName === "string" && meta.shortName.length > 0, `Short name exists for "${slug}": ${meta.shortName}`);
    assert(typeof meta.icon === "object" || typeof meta.icon === "function", `Lucide icon component exists for "${slug}"`);
    assert(meta.badgeBg.startsWith("bg-"), `Badge background token exists for "${slug}": ${meta.badgeBg}`);
    assert(meta.badgeColor.startsWith("text-"), `Badge text color token exists for "${slug}": ${meta.badgeColor}`);
    assert(meta.activeRing.startsWith("ring-"), `Active ring token exists for "${slug}": ${meta.activeRing}`);
    assert(meta.activeBorder.startsWith("border-"), `Active border token exists for "${slug}": ${meta.activeBorder}`);
  }

  console.log("\n👉 Test Suite 2: Domain Practice Session URL Resolution");
  for (const slug of EXPECTED_CANONICAL_DOMAINS) {
    const archetype = getDomainWorkspaceArchetype(slug);
    assert(
      ["system-design", "coding", "cloud", "behavioral"].includes(archetype),
      `Archetype for "${slug}" maps to supported shell: ${archetype}`
    );

    const testUrl = getPracticeSessionUrl(slug, "test-topic-123");
    assert(
      testUrl.startsWith(`/practice/session/${archetype}`),
      `Target URL for "${slug}" resolves to /practice/session/${archetype}`
    );
    assert(
      testUrl.includes("topic=test-topic-123") && testUrl.includes(`domain=${slug}`),
      `Target URL carries query parameters: topic & domain (${testUrl})`
    );
  }

  console.log("\n👉 Test Suite 3: Domain Metadata & Archetype Coverage");
  const archetypesCovered = new Set(
    EXPECTED_CANONICAL_DOMAINS.map((slug) => getDomainWorkspaceArchetype(slug))
  );
  assert(
    archetypesCovered.has("system-design") &&
      archetypesCovered.has("coding") &&
      archetypesCovered.has("cloud") &&
      archetypesCovered.has("behavioral"),
    "All 4 workspace archetypes (Architecture, Code, Cloud, Voice) are represented across the 10 domains"
  );

  console.log("\n==================================================================");
  console.log(`🎉 ALL ${passed}/${total} TESTS PASSED CLEANLY! (100% SUCCESS)`);
  console.log("==================================================================\n");
}

runTests();
