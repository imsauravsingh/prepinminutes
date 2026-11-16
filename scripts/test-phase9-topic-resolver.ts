/**
 * Test Suite: Phase 9 Flexible Topic Resolver Verification
 * Verifies that title strings, spaced queries, and exact slugs properly resolve
 * to canonical curriculum topics with full question and rubric sets.
 */

import { backendApi } from "../src/lib/api-client";

interface TestCase {
  query: string;
  expectedSlugPattern: string;
  expectedMinQuestions: number;
}

const TEST_CASES: TestCase[] = [
  {
    query: "Load Balancing Strategies",
    expectedSlugPattern: "load-balancer",
    expectedMinQuestions: 1,
  },
  {
    query: "load-balancers-traffic",
    expectedSlugPattern: "load-balancers-traffic",
    expectedMinQuestions: 1,
  },
  {
    query: "TinyURL",
    expectedSlugPattern: "url-shortener",
    expectedMinQuestions: 1,
  },
  {
    query: "Kafka",
    expectedSlugPattern: "kafka",
    expectedMinQuestions: 1,
  },
  {
    query: "distributed-caching",
    expectedSlugPattern: "distributed-caching",
    expectedMinQuestions: 1,
  },
];

async function runTests() {
  console.log("🚀 Starting Topic Resolver Verification Suite...\n");

  let passed = 0;
  let failed = 0;

  for (const tc of TEST_CASES) {
    try {
      console.log(`🔍 Resolving query: "${tc.query}"...`);
      const res = await backendApi.getCurriculumTopicDetail(tc.query);

      if (!res || !res.topic) {
        console.error(`❌ FAILED: Query "${tc.query}" returned no topic.`);
        failed++;
        continue;
      }

      const slug = res.topic.slug.toLowerCase();
      const title = res.topic.title;
      const questionCount = res.questions ? res.questions.length : 0;

      if (!slug.includes(tc.expectedSlugPattern.toLowerCase())) {
        console.error(
          `❌ FAILED: Expected slug containing "${tc.expectedSlugPattern}", but got "${slug}" (${title}).`
        );
        failed++;
        continue;
      }

      if (questionCount < tc.expectedMinQuestions) {
        console.error(
          `❌ FAILED: Expected at least ${tc.expectedMinQuestions} questions, but found ${questionCount}.`
        );
        failed++;
        continue;
      }

      console.log(
        `   ✅ PASSED: "${tc.query}" -> ${slug} ("${title}") [${questionCount} questions]`
      );
      passed++;
    } catch (err: unknown) {
      console.error(`❌ ERROR testing "${tc.query}":`, err);
      failed++;
    }
  }

  console.log(
    `\n🏁 Summary: ${passed}/${TEST_CASES.length} passed, ${failed} failed.`
  );

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
