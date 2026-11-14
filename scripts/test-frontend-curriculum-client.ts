/**
 * PrepInMinutes — TASK-P4-01 Frontend Curriculum Client & Router Verification Suite
 *
 * Verifies:
 * 1. Practice Session Archetype Router (all 10 canonical domains map without 404s)
 * 2. BackendApi Edge Client integration (domains, hierarchy, topic detail, questions)
 * 3. HTTP ETag caching & 304 Not Modified behavior
 * 4. Structured error handling for nonexistent domains/topics
 * 5. Candidate readiness & starring overlay state engine
 */

import { backendApi, ApiError } from "../src/lib/api-client";
import {
  getPracticeSessionUrl,
  getDomainWorkspaceArchetype,
  PracticeWorkspaceArchetype,
} from "../src/lib/practice-router";
import {
  setStoredCandidateOverlay,
  getStoredCandidateOverlays,
  CandidateOverlaysMap,
} from "../src/hooks/useCurriculum";

// Simulated window.localStorage for Node environment testing
const mockStorage: Record<string, string> = {};
(global as any).window = {
  localStorage: {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, val: string) => {
      mockStorage[key] = val;
    },
    removeItem: (key: string) => {
      delete mockStorage[key];
    },
    clear: () => {
      for (const k of Object.keys(mockStorage)) delete mockStorage[k];
    },
  },
};

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName}${details ? ` -> ${details}` : ""}`);
    throw new Error(`Assertion failed: ${testName}`);
  }
}

async function runTestSuite() {
  console.log("==================================================================");
  console.log("🧪 Running TASK-P4-01 Frontend Curriculum Client & Router Suite");
  console.log("==================================================================\n");

  // ---------------------------------------------------------------------------
  // TEST SUITE 1: Practice Session Archetype Router & 404 Prevention
  // ---------------------------------------------------------------------------
  console.log("👉 Test Suite 1: Practice Router & Archetype Mappings");

  const expectedArchetypes: Record<string, { archetype: PracticeWorkspaceArchetype; shellPath: string }> = {
    "system-design": { archetype: "system-design", shellPath: "/practice/session/system-design" },
    "ai-system-design": { archetype: "system-design", shellPath: "/practice/session/system-design" },
    "data-engineering": { archetype: "system-design", shellPath: "/practice/session/system-design" },
    "dsa": { archetype: "coding", shellPath: "/practice/session/coding" },
    "backend-engineering": { archetype: "coding", shellPath: "/practice/session/coding" },
    "frontend-engineering": { archetype: "coding", shellPath: "/practice/session/coding" },
    "low-level-design": { archetype: "coding", shellPath: "/practice/session/coding" },
    "mobile-engineering": { archetype: "coding", shellPath: "/practice/session/coding" },
    "cloud-devops": { archetype: "cloud", shellPath: "/practice/session/cloud" },
    "behavioral-leadership": { archetype: "behavioral", shellPath: "/practice/session/behavioral" },
  };

  for (const [domainSlug, expected] of Object.entries(expectedArchetypes)) {
    const archetype = getDomainWorkspaceArchetype(domainSlug);
    assert(
      archetype === expected.archetype,
      `Archetype for ${domainSlug} is "${expected.archetype}"`
    );

    const testTopic = `${domainSlug}-test-topic`;
    const url = getPracticeSessionUrl(domainSlug, testTopic);
    assert(
      url.startsWith(expected.shellPath),
      `Practice URL for ${domainSlug} targets valid shell "${expected.shellPath}"`
    );
    assert(
      url.includes(`topic=${testTopic}`) && url.includes(`domain=${domainSlug}`),
      `Practice URL for ${domainSlug} encodes topic and domain parameters`
    );
  }

  // Fallback for unknown domain
  const fallbackUrl = getPracticeSessionUrl("quantum-computing", "qubits-101");
  assert(
    fallbackUrl.startsWith("/practice/session/system-design"),
    "Unknown domain safely falls back to system-design archetype without 404"
  );

  console.log("\n👉 Test Suite 2: BackendApi.getCurriculumDomains()");

  // ---------------------------------------------------------------------------
  // TEST SUITE 2: BackendApi.getCurriculumDomains()
  // ---------------------------------------------------------------------------
  const domainsRes = await backendApi.getCurriculumDomains();
  assert(domainsRes.success === true, "getCurriculumDomains returns success: true");
  assert(domainsRes.domains.length === 10, "Domain catalog contains all 10 canonical domains");
  assert(domainsRes.meta.totalCategories === 122, `Meta reports 122 categories (got ${domainsRes.meta.totalCategories})`);
  assert(domainsRes.meta.totalTopics === 371, `Meta reports 371 topics (got ${domainsRes.meta.totalTopics})`);
  assert(domainsRes.meta.totalQuestions === 7420, `Meta reports 7420 questions (got ${domainsRes.meta.totalQuestions})`);
  assert(typeof domainsRes.etag === "string" && domainsRes.etag.length > 0, `ETag received: ${domainsRes.etag}`);

  // Test ETag 304 Not Modified
  const domains304 = await backendApi.getCurriculumDomains(domainsRes.etag || undefined);
  assert(domains304.notModified === true, "Subsequent call with ETag returns notModified: true (HTTP 304)");

  console.log("\n👉 Test Suite 3: BackendApi.getCurriculumHierarchy()");

  // ---------------------------------------------------------------------------
  // TEST SUITE 3: BackendApi.getCurriculumHierarchy()
  // ---------------------------------------------------------------------------
  const hierarchyRes = await backendApi.getCurriculumHierarchy("system-design");
  assert(hierarchyRes.domainSlug === "system-design", "Hierarchy returns domainSlug: system-design");
  assert(hierarchyRes.categories.length > 0, `Hierarchy contains categories (${hierarchyRes.categories.length})`);
  assert(hierarchyRes.totalTopics > 0, `Hierarchy contains topics count (${hierarchyRes.totalTopics})`);
  assert(typeof hierarchyRes.etag === "string", `Hierarchy ETag received: ${hierarchyRes.etag}`);

  // Inspect first topic
  const firstCat = hierarchyRes.categories[0];
  const firstTopic = firstCat.topics[0];
  assert(typeof firstTopic.slug === "string", `Topic has slug: ${firstTopic.slug}`);
  assert(typeof firstTopic.topicId === "string", `Topic has topicId: ${firstTopic.topicId}`);
  assert(typeof firstTopic.title === "string", `Topic has title: ${firstTopic.title}`);
  assert(firstTopic.priority === "P0" || firstTopic.priority === "P1", `Topic has priority: ${firstTopic.priority}`);

  // Test Hierarchy ETag 304
  const hierarchy304 = await backendApi.getCurriculumHierarchy("system-design", hierarchyRes.etag || undefined);
  assert(hierarchy304.notModified === true, "Hierarchy with ETag returns notModified: true (HTTP 304)");

  console.log("\n👉 Test Suite 4: BackendApi.getCurriculumTopicDetail()");

  // ---------------------------------------------------------------------------
  // TEST SUITE 4: BackendApi.getCurriculumTopicDetail()
  // ---------------------------------------------------------------------------
  const topicDetail = await backendApi.getCurriculumTopicDetail("distributed-key-value-store");
  assert(topicDetail.success === true, "Topic detail returns success: true");
  assert(topicDetail.topic.slug === "distributed-key-value-store", "Topic slug matches request");
  assert(topicDetail.domain.slug === "system-design", "Topic domain correctly linked to system-design");
  assert(Array.isArray(topicDetail.topic.rubricAtoms) && topicDetail.topic.rubricAtoms.length > 0, "Topic contains rubric atoms");
  assert(Array.isArray(topicDetail.graphRelationships?.prerequisites), "Topic contains prerequisites array in graphRelationships");
  assert(Array.isArray(topicDetail.questions), "Topic contains questions array");

  console.log("\n👉 Test Suite 5: BackendApi.getCurriculumTopicQuestions()");

  // ---------------------------------------------------------------------------
  // TEST SUITE 5: BackendApi.getCurriculumTopicQuestions()
  // ---------------------------------------------------------------------------
  const questionsRes = await backendApi.getCurriculumTopicQuestions("distributed-key-value-store", {
    limit: 5,
  });
  assert(questionsRes.success === true, "Questions bundle returns success: true");
  assert(questionsRes.questions.length <= 5, `Questions respect limit parameter (${questionsRes.questions.length} <= 5)`);
  if (questionsRes.questions.length > 0) {
    const q = questionsRes.questions[0];
    assert(typeof q.title === "string", `Question has title: ${q.title}`);
    assert(typeof q.difficulty === "string", `Question has difficulty: ${q.difficulty}`);
  }

  console.log("\n👉 Test Suite 6: Structured 404 Error Handling");

  // ---------------------------------------------------------------------------
  // TEST SUITE 6: Structured 404 Error Handling
  // ---------------------------------------------------------------------------
  let caughtDomainError = false;
  try {
    await backendApi.getCurriculumHierarchy("nonexistent-domain-xyz");
  } catch (err: any) {
    caughtDomainError = true;
    assert(err instanceof ApiError, "Nonexistent domain throws typed ApiError");
    assert(err.status === 404, `Status is 404 (got ${err.status})`);
    assert(err.code === "DOMAIN_NOT_FOUND", `Error code is DOMAIN_NOT_FOUND (got ${err.code})`);
  }
  assert(caughtDomainError, "Nonexistent domain properly caught and handled");

  let caughtTopicError = false;
  try {
    await backendApi.getCurriculumTopicDetail("nonexistent-topic-xyz");
  } catch (err: any) {
    caughtTopicError = true;
    assert(err instanceof ApiError, "Nonexistent topic throws typed ApiError");
    assert(err.status === 404, `Status is 404 (got ${err.status})`);
    assert(err.code === "TOPIC_NOT_FOUND", `Error code is TOPIC_NOT_FOUND (got ${err.code})`);
  }
  assert(caughtTopicError, "Nonexistent topic properly caught and handled");

  console.log("\n👉 Test Suite 7: Candidate Overlays & LocalStorage Persistence");

  // ---------------------------------------------------------------------------
  // TEST SUITE 7: Candidate Overlays & LocalStorage Persistence
  // ---------------------------------------------------------------------------
  const testTopicSlug = "distributed-key-value-store";
  const updatedOverlays = setStoredCandidateOverlay(testTopicSlug, {
    isStarred: true,
    status: "In Progress",
    readiness: 72,
  });
  assert(updatedOverlays[testTopicSlug]?.isStarred === true, "Candidate overlay sets isStarred: true");
  assert(updatedOverlays[testTopicSlug]?.status === "In Progress", "Candidate overlay sets status: In Progress");
  assert(updatedOverlays[testTopicSlug]?.readiness === 72, "Candidate overlay sets readiness: 72");

  const readBack = getStoredCandidateOverlays();
  assert(readBack[testTopicSlug]?.isStarred === true, "getStoredCandidateOverlays successfully deserializes from localStorage");

  console.log("\n==================================================================");
  console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED CLEANLY! (100% SUCCESS)`);
  console.log("==================================================================\n");
}

runTestSuite().catch((err) => {
  console.error("❌ Test suite aborted with unexpected error:", err);
  process.exit(1);
});
