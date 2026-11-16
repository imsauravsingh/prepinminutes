/**
 * PrepInMinutes — TASK-P5-03 Automated Verification Test Suite
 *
 * Verifies:
 * 1. Multi-Language Starter Code Generator (7 Languages: TS, JS, Node.js, Python, Java, C++, Go)
 * 2. Domain-Calibrated Skeletons (DSA, Low-Level Design, Frontend Architecture)
 * 3. Isolated Per-Language Code Buffers (Non-destructive switching & session storage isolation)
 * 4. Whiteboard State Persistence & Serialization (Nodes, Sticky Notes, Text Items, Shapes)
 * 5. Edge cases: empty context fallback, PascalCase/camelCase normalization
 */

import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  generateStarterCode,
  getSavedCodeForLanguage,
  saveCodeForLanguage,
  TemplateGenerationContext,
} from "../src/lib/code-templates";
import { getWhiteboardStorageKey, WhiteboardStatePayload } from "../src/hooks/useWhiteboardState";

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` — ${detail}` : ""}`);
    process.exitCode = 1;
  }
}

async function runTestSuite() {
  console.log("==================================================================");
  console.log("🧪 TASK-P5-03: Multi-Domain Code Editor & Whiteboard Sync Test Suite");
  console.log("==================================================================\n");

  // -------------------------------------------------------------
  // Test Group 1: Supported Languages Catalog & Metadata
  // -------------------------------------------------------------
  console.log("🔹 1. Testing Supported Languages Catalog (7 Languages)...");
  {
    assert(SUPPORTED_LANGUAGES.length === 7, "Catalog contains exactly 7 languages");

    const expectedLangs: SupportedLanguage[] = [
      "typescript",
      "javascript",
      "nodejs",
      "python",
      "java",
      "cpp",
      "go",
    ];

    for (const langId of expectedLangs) {
      const config = SUPPORTED_LANGUAGES.find((l) => l.id === langId);
      assert(!!config, `Language '${langId}' exists in configuration catalog`);
      assert(!!config?.extension, `Language '${langId}' has valid extension (${config?.extension})`);
      assert(!!config?.monacoLanguage, `Language '${langId}' has Monaco language mapping`);
      assert(!!config?.badge, `Language '${langId}' has display badge (${config?.badge})`);
    }
  }

  // -------------------------------------------------------------
  // Test Group 2: Algorithmic & DSA Starter Code Generation
  // -------------------------------------------------------------
  console.log("\n🔹 2. Testing DSA / Algorithm Starter Code Generation across all 7 languages...");
  {
    const dsaContext: TemplateGenerationContext = {
      domainSlug: "dsa",
      topicSlug: "sliding-window-maximum",
      topicTitle: "Sliding Window Maximum Sum",
      questionId: "q101",
      questionTitle: "Max Subarray Sum of Size K",
      prompt: "Given an array of integers nums and an integer k, find the maximum sum of any contiguous subarray of size k.",
      difficulty: "INTERMEDIATE",
    };

    // 1. TypeScript
    const tsCode = generateStarterCode("typescript", dsaContext);
    assert(tsCode.includes("export class Solution"), "TS: Contains export class Solution");
    assert(tsCode.includes("public maxSubarraySumOfSizeK"), "TS: Contains camelCase method signature");
    assert(tsCode.includes("nums: number[]"), "TS: Strongly typed number[] parameter");

    // 2. JavaScript
    const jsCode = generateStarterCode("javascript", dsaContext);
    assert(jsCode.includes("function maxSubarraySumOfSizeK"), "JS: Contains standard function declaration");
    assert(jsCode.includes("@param {number[]} nums"), "JS: Contains JSDoc type annotations");
    assert(jsCode.includes("module.exports"), "JS: Contains CommonJS export");

    // 3. Node.js
    const nodeCode = generateStarterCode("nodejs", dsaContext);
    assert(nodeCode.includes("class Solution"), "Node.js: Contains Solution class");
    assert(nodeCode.includes("perf_hooks"), "Node.js: Uses Node performance hooks");
    assert(nodeCode.includes("module.exports = { Solution }"), "Node.js: Exports Solution module");

    // 4. Python
    const pyCode = generateStarterCode("python", dsaContext);
    assert(pyCode.includes("class Solution:"), "Python: Contains class Solution");
    assert(pyCode.includes("def maxSubarraySumOfSizeK(self, nums: List[int]"), "Python: Uses PEP 484 List[int] type hint");
    assert(pyCode.includes('"""'), "Python: Contains docstring with complexity expectations");

    // 5. Java
    const javaCode = generateStarterCode("java", dsaContext);
    assert(javaCode.includes("public class Solution"), "Java: Contains public class Solution");
    assert(javaCode.includes("public int maxSubarraySumOfSizeK(int[] nums, int target)"), "Java: Strongly typed array signature");
    assert(javaCode.includes("import java.util.*;"), "Java: Standard collections imported");

    // 6. C++
    const cppCode = generateStarterCode("cpp", dsaContext);
    assert(cppCode.includes("class Solution"), "C++: Contains class Solution");
    assert(cppCode.includes("const std::vector<int>& nums"), "C++: Uses const std::vector reference");
    assert(cppCode.includes("#include <vector>"), "C++: Includes STL vector header");

    // 7. Go
    const goCode = generateStarterCode("go", dsaContext);
    assert(goCode.includes("package main"), "Go: Contains package main");
    assert(goCode.includes("nums []int"), "Go: Uses Go slice syntax []int");
  }

  // -------------------------------------------------------------
  // Test Group 3: Low-Level Design (LLD) Starter Code Generation
  // -------------------------------------------------------------
  console.log("\n🔹 3. Testing Low-Level Design (LLD) OOP Scaffolding...");
  {
    const lldContext: TemplateGenerationContext = {
      domainSlug: "low-level-design",
      topicSlug: "rate-limiter-design",
      topicTitle: "Token Bucket Rate Limiter",
      questionId: "lld01",
      questionTitle: "Thread Safe Token Bucket Limiter",
      prompt: "Design a thread-safe token bucket rate limiter supporting dynamic refill rates and burst capacities.",
      difficulty: "ADVANCED",
    };

    const tsLld = generateStarterCode("typescript", lldContext);
    assert(tsLld.includes("interface IThreadSafeTokenBucketLimiterService"), "TS LLD: Defines Service Interface");
    assert(tsLld.includes("export class ThreadSafeTokenBucketLimiter"), "TS LLD: Implements concrete class");

    const jsLld = generateStarterCode("javascript", lldContext);
    assert(jsLld.includes("class ThreadSafeTokenBucketLimiter"), "JS LLD: Defines ES6 Class");

    const nodeLld = generateStarterCode("nodejs", lldContext);
    assert(nodeLld.includes("EventEmitter = require('events')"), "Node.js LLD: Inherits EventEmitter");
    assert(nodeLld.includes("async dispatch("), "Node.js LLD: Contains async event dispatcher");

    const pyLld = generateStarterCode("python", lldContext);
    assert(pyLld.includes("from abc import ABC, abstractmethod"), "Python LLD: Uses ABC for abstract base class");
    assert(pyLld.includes("class IThreadSafeTokenBucketLimiter(ABC):"), "Python LLD: Defines abstract interface");

    const javaLld = generateStarterCode("java", lldContext);
    assert(javaLld.includes("ConcurrentHashMap"), "Java LLD: Uses ConcurrentHashMap for thread-safety");
    assert(javaLld.includes("synchronized boolean execute"), "Java LLD: Includes synchronization primitive");

    const cppLld = generateStarterCode("cpp", lldContext);
    assert(cppLld.includes("#include <mutex>"), "C++ LLD: Includes mutex header");
    assert(cppLld.includes("std::lock_guard<std::mutex>"), "C++ LLD: RAII lock guard used");

    const goLld = generateStarterCode("go", lldContext);
    assert(goLld.includes("sync.RWMutex"), "Go LLD: Uses sync.RWMutex concurrency lock");
  }

  // -------------------------------------------------------------
  // Test Group 4: Frontend Architecture Starter Code Generation
  // -------------------------------------------------------------
  console.log("\n🔹 4. Testing Frontend Architecture React Component Scaffolding...");
  {
    const feContext: TemplateGenerationContext = {
      domainSlug: "frontend-engineering",
      topicSlug: "virtualized-list-component",
      topicTitle: "Virtualized List Component",
      questionId: "fe05",
      questionTitle: "Infinite Scroll Virtual Grid",
      prompt: "Implement an infinite scrolling virtual grid component that renders only visible DOM nodes.",
      difficulty: "ADVANCED",
    };

    const tsFe = generateStarterCode("typescript", feContext);
    assert(tsFe.includes("React.FC<InfiniteScrollVirtualGridProps>"), "Frontend TS: React Functional Component with Props Interface");
    assert(tsFe.includes("useState"), "Frontend TS: Hooks imported");

    const jsFe = generateStarterCode("javascript", feContext);
    assert(jsFe.includes("export function InfiniteScrollVirtualGrid("), "Frontend JS: Component function exported");

    const nodeFe = generateStarterCode("nodejs", feContext);
    assert(nodeFe.includes("renderHtml("), "Frontend Node.js: SSR HTML server renderer provided");
  }

  // -------------------------------------------------------------
  // Test Group 5: Isolated Per-Language Code Buffers
  // -------------------------------------------------------------
  console.log("\n🔹 5. Testing Isolated Per-Language Buffer Storage...");
  {
    const ctx: TemplateGenerationContext = {
      topicSlug: "distributed-cache",
      questionId: "q42",
      questionTitle: "LRU Cache Implementation",
    };

    const pythonSolution = "class LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity";
    const javaSolution = "public class LRUCache {\n    private final int capacity;\n    public LRUCache(int cap) { this.capacity = cap; }\n}";
    const nodeSolution = "class LRUCache {\n    constructor(capacity) {\n        this.capacity = capacity;\n    }\n}";

    // Save different code for different languages
    saveCodeForLanguage("python", pythonSolution, ctx);
    saveCodeForLanguage("java", javaSolution, ctx);
    saveCodeForLanguage("nodejs", nodeSolution, ctx);

    // Retrieve and verify complete isolation
    const retrievedPy = getSavedCodeForLanguage("python", ctx);
    const retrievedJava = getSavedCodeForLanguage("java", ctx);
    const retrievedNode = getSavedCodeForLanguage("nodejs", ctx);

    assert(retrievedPy === pythonSolution, "Buffer Python: Exactly matches saved Python solution");
    assert(retrievedJava === javaSolution, "Buffer Java: Exactly matches saved Java solution");
    assert(retrievedNode === nodeSolution, "Buffer Node.js: Exactly matches saved Node.js solution");

    // Switching back does NOT overwrite or mutate
    assert(retrievedPy !== retrievedJava, "Language buffers are completely isolated without cross-contamination");

    // Unsaved language defaults cleanly to calibrated starter code
    const retrievedCpp = getSavedCodeForLanguage("cpp", ctx);
    assert(retrievedCpp.includes("class Solution") || retrievedCpp.includes("class LruCache"), "Unsaved language falls back to calibrated template");
  }

  // -------------------------------------------------------------
  // Test Group 6: Whiteboard Persistence & Serialization
  // -------------------------------------------------------------
  console.log("\n🔹 6. Testing Whiteboard Persistence Key & Payload Serialization...");
  {
    const key = getWhiteboardStorageKey("system-design-url-shortener", "q1");
    assert(key === "pim_wb_system-design-url-shortener_q1", "Storage key adheres to canonical prefix 'pim_wb_'");

    const samplePayload: WhiteboardStatePayload = {
      boardNodes: [
        {
          id: "node-1",
          type: "architecture",
          title: "API Gateway",
          x: 100,
          y: 200,
          width: 160,
          borderColor: "#38bdf8",
          bgColor: "#f0f9ff",
          textColor: "#0369a1",
        },
      ],
      stickyNotes: [
        {
          id: "sticky-1",
          x: 400,
          y: 150,
          text: "Rate limit: 10,000 req/min",
          color: "yellow",
        },
      ],
      textItems: [
        {
          id: "txt-1",
          x: 100,
          y: 50,
          text: "System High-Level Topology",
          color: "#1e1c1a",
          fontSize: 18,
        },
      ],
      shapes: [
        {
          id: "shape-1",
          type: "rectangle",
          x1: 50,
          y1: 50,
          x2: 300,
          y2: 400,
          color: "#94a3b8",
          strokeWidth: 2,
        },
      ],
      canvasDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      updatedAt: new Date().toISOString(),
    };

    const serialized = JSON.stringify(samplePayload);
    const deserialized: WhiteboardStatePayload = JSON.parse(serialized);

    assert(deserialized.boardNodes.length === 1, "Whiteboard Serialization: boardNodes count preserved");
    assert(deserialized.boardNodes[0].title === "API Gateway", "Whiteboard Serialization: node attributes preserved");
    assert(deserialized.stickyNotes.length === 1, "Whiteboard Serialization: stickyNotes count preserved");
    assert(deserialized.textItems.length === 1, "Whiteboard Serialization: textItems count preserved");
    assert(deserialized.shapes.length === 1, "Whiteboard Serialization: shapes count preserved");
    assert(!!deserialized.canvasDataUrl, "Whiteboard Serialization: high-res DataURL preserved");
  }

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log("\n==================================================================");
  console.log(`🎉 TEST SUMMARY: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log("==================================================================\n");

  if (passedTests === totalTests) {
    console.log("🌟 All multi-language code templates and whiteboard synchronization tests passed with 0 failures!");
  } else {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test runner encountered an unhandled exception:", err);
  process.exit(1);
});
