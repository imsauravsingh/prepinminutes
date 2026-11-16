import { describe, it } from "node:test";
import assert from "node:assert";

const BACKEND_URL = process.env.API_URL || "http://localhost:8787";

async function run() {
  console.log("==================================================");
  console.log("  🧪 Phase 9 Comprehensive End-to-End Test Suite   ");
  console.log("==================================================");

  // Test 1: Flexible Topic Resolver for human-readable URLs
  console.log("\n[Test 1] Testing Flexible Topic Resolver for '?topic=Load Balancing Strategies'...");
  const topicRes = await fetch(`${BACKEND_URL}/api/curriculum/topic/${encodeURIComponent("Load Balancing Strategies")}`);
  assert.strictEqual(topicRes.status, 200, `Expected 200 OK from topic resolver, got ${topicRes.status}`);
  const topicData = await topicRes.json();
  assert.strictEqual(topicData.success, true, "Expected success: true");
  assert.strictEqual(topicData.topic.slug, "load-balancers-traffic", "Expected topic slug to match load-balancers-traffic");
  assert.ok(topicData.topic.title.includes("Load Balancer"), "Expected topic title to reference Load Balancers");
  console.log(`✅ Passed: Successfully resolved 'Load Balancing Strategies' -> '${topicData.topic.slug}' (${topicData.topic.title})`);

  // Test 2: Platform Config GET & POST
  console.log("\n[Test 2] Testing Platform Setting enable_next_step_flow...");
  const configGet = await fetch(`${BACKEND_URL}/api/platform/config`).then(r => r.json());
  assert.strictEqual(configGet.success, true);
  console.log(`Initial enableNextStepFlow: ${configGet.enableNextStepFlow}`);

  // Toggle to false
  const configSetFalse = await fetch(`${BACKEND_URL}/api/platform/config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enableNextStepFlow: false }),
  }).then(r => r.json());
  assert.strictEqual(configSetFalse.success, true);
  assert.strictEqual(configSetFalse.enableNextStepFlow, false);

  const verifyFalse = await fetch(`${BACKEND_URL}/api/platform/config`).then(r => r.json());
  assert.strictEqual(verifyFalse.enableNextStepFlow, false);
  console.log("✅ Passed: Platform flag successfully toggled to false (Direct Plan Generation)");

  // Toggle back to true
  const configSetTrue = await fetch(`${BACKEND_URL}/api/platform/config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enableNextStepFlow: true }),
  }).then(r => r.json());
  assert.strictEqual(configSetTrue.success, true);
  assert.strictEqual(configSetTrue.enableNextStepFlow, true);
  console.log("✅ Passed: Platform flag successfully restored to true (Next Step Assessment)");

  // Test 3: Profile Reset API
  console.log("\n[Test 3] Testing Profile Reset API endpoint...");
  const resetRes = await fetch(`${BACKEND_URL}/api/onboarding/profile/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-candidate-id": "test_e2e_fresher_candidate",
    },
  });
  assert.strictEqual(resetRes.status, 200, `Expected 200 OK from profile reset, got ${resetRes.status}`);
  const resetData = await resetRes.json();
  assert.strictEqual(resetData.success, true);
  console.log(`✅ Passed: Candidate profile reset endpoint responded successfully (${resetData.message})`);

  console.log("\n==================================================");
  console.log("  🎉 All Phase 9 End-to-End Tests Passed (100%)    ");
  console.log("==================================================");
}

run().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
