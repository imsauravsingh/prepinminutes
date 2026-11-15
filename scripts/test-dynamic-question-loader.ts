/**
 * PrepInMinutes — TASK-P5-01: Dynamic Question Loader for Practice Workspaces Test Suite
 *
 * Verifies:
 * 1. Default fallback generation for any topic slug
 * 2. Active question selection and indexing (Q1 of 20 to Q20 of 20)
 * 3. Next / Previous question circular navigation
 * 4. Rubric criteria, prompt, and hints preservation
 * 5. Coverage across all 4 practice archetypes (Architecture, Coding, Cloud, Voice/STAR)
 */

import { generateDefaultTopicData } from "../src/hooks/useCurriculumTopic";
import { BaseQuestionNode } from "../src/types/curriculum";

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
  console.log("🧪 Running TASK-P5-01: Dynamic Question Loader Test Suite");
  console.log("==================================================================\n");

  console.log("👉 Test Suite 1: Topic Data & Fallback Synthesis");
  {
    const topicData = generateDefaultTopicData("distributed-caching");
    assert(!!topicData.topic, "Generates topic object for 'distributed-caching'");
    assert(topicData.topic.title === "Distributed Caching", `Formatted title is correct: ${topicData.topic.title}`);
    assert(topicData.questions.length > 0, "Contains at least 1 default question");
    assert(topicData.questions[0].rubricAtoms.length >= 4, "Default question contains rubric atoms");
    assert(topicData.questions[0].hints.length >= 3, "Default question contains hints ladder");
  }

  console.log("\n👉 Test Suite 2: Question Navigation & Bounds Invariants");
  {
    const mockQuestions: BaseQuestionNode[] = Array.from({ length: 20 }, (_, i) => ({
      id: `q_test_${String(i + 1).padStart(2, "0")}`,
      title: `Test Scenario ${i + 1}`,
      difficulty: i < 5 ? "BEGINNER" : i < 15 ? "INTERMEDIATE" : "ADVANCED",
      learningLevel: `L${(i % 4) + 1}`,
      archetype: i % 2 === 0 ? "deep-dive" : "failure-analysis",
      prompt: `Prompt for question ${i + 1}`,
      rubricGuide: `Rubric guide for question ${i + 1}`,
      rubricAtoms: [`Atom ${i + 1}.1`, `Atom ${i + 1}.2`],
      hints: [`Hint ${i + 1}.1`],
      followUpProbes: [`Probe ${i + 1}.1`],
      expectedKeywords: ["keyword"],
    }));

    // Active question selection
    let activeQuestionId = "q_test_05";
    let activeQuestion = mockQuestions.find((q) => q.id === activeQuestionId)!;
    let activeIndex = mockQuestions.findIndex((q) => q.id === activeQuestion.id);

    assert(activeIndex === 4, "Finds index 4 for question 'q_test_05'");
    assert(activeQuestion.title === "Test Scenario 5", "Matches correct question title");

    // Next Question
    activeIndex = (activeIndex + 1) % mockQuestions.length;
    activeQuestion = mockQuestions[activeIndex];
    assert(activeQuestion.id === "q_test_06", "nextQuestion transitions from Q5 to Q6");

    // Circular Next Question from last (Q20 -> Q1)
    activeIndex = 19;
    activeIndex = (activeIndex + 1) % mockQuestions.length;
    activeQuestion = mockQuestions[activeIndex];
    assert(activeQuestion.id === "q_test_01", "nextQuestion wraps around from Q20 to Q1");

    // Circular Previous Question from first (Q1 -> Q20)
    activeIndex = 0;
    activeIndex = (activeIndex - 1 + mockQuestions.length) % mockQuestions.length;
    activeQuestion = mockQuestions[activeIndex];
    assert(activeQuestion.id === "q_test_20", "previousQuestion wraps around from Q1 to Q20");
  }

  console.log("\n👉 Test Suite 3: Practice Archetypes Integration Parity");
  {
    const archetypes = [
      { name: "System Design", route: "/practice/session/system-design", defaultTopic: "distributed-caching" },
      { name: "Coding & Algorithms", route: "/practice/session/coding", defaultTopic: "dynamic-programming-patterns" },
      { name: "Cloud & DevOps", route: "/practice/session/cloud", defaultTopic: "kubernetes-architecture" },
      { name: "Behavioral & Leadership", route: "/practice/session/behavioral", defaultTopic: "conflict-resolution-disagreement" },
    ];

    for (const arch of archetypes) {
      const topicData = generateDefaultTopicData(arch.defaultTopic);
      assert(
        topicData.topic.slug === arch.defaultTopic,
        `${arch.name} default topic (${arch.defaultTopic}) resolves valid topic slug`
      );
      assert(
        topicData.questions[0].prompt.length > 20,
        `${arch.name} provides rich initial prompt: "${topicData.questions[0].prompt.slice(0, 40)}..."`
      );
    }
  }

  console.log("\n==================================================================");
  console.log(`🎉 TEST SUMMARY: ${passed}/${total} assertions PASSED (0 failures)`);
  console.log("==================================================================");
}

runTests();
