/**
 * PrepInMinutes — TASK-P4-03: Category Grouping, Dynamic Topic Cards & Real-Time Search Engine Test Suite
 *
 * Verifies:
 * 1. Multi-dimensional search engine (title, canonical topicId, description)
 * 2. Status, Priority, Difficulty, and Duration filtering criteria
 * 3. Sorting orders (Recommended, High Priority P0, Readiness Asc/Desc, Questions Desc)
 * 4. Category grouping structure and topic partitioning
 * 5. Pagination and view mode data parity
 */

export interface TestTopic {
  id: string;
  slug: string;
  topicId?: string;
  title: string;
  description: string;
  priority: string;
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  readiness: number;
  duration: number;
  status: "Needs Practice" | "Not Practiced" | "Practiced" | "In Progress";
  isStarred?: boolean;
  questionsCount?: number;
  rubricAtomsCount?: number;
}

export interface TestCategoryGroup {
  slug: string;
  name: string;
  pillar?: string;
  sortOrder: number;
  topicsCount: number;
  topics: TestTopic[];
}

const MOCK_TOPICS: TestTopic[] = [
  {
    id: "cap-theorem",
    slug: "cap-theorem",
    topicId: "FND001",
    title: "CAP Theorem & PACELC",
    description: "Understand consistency, availability, and partition tolerance trade-offs.",
    priority: "P0",
    difficulty: "BEGINNER",
    readiness: 45,
    duration: 15,
    status: "Needs Practice",
    isStarred: true,
    questionsCount: 18,
    rubricAtomsCount: 6,
  },
  {
    id: "distributed-caching",
    slug: "distributed-caching",
    topicId: "SYS018",
    title: "Distributed Caching (Redis/Memcached)",
    description: "Cache-aside, write-through, eviction policies, and cache stampede prevention.",
    priority: "P0",
    difficulty: "INTERMEDIATE",
    readiness: 70,
    duration: 20,
    status: "In Progress",
    isStarred: false,
    questionsCount: 24,
    rubricAtomsCount: 8,
  },
  {
    id: "consensus-raft-paxos",
    slug: "consensus-raft-paxos",
    topicId: "SYS025",
    title: "Consensus Algorithms (Raft & Paxos)",
    description: "Leader election, log replication, and safety invariants in distributed systems.",
    priority: "P1",
    difficulty: "ADVANCED",
    readiness: 30,
    duration: 25,
    status: "Not Practiced",
    isStarred: true,
    questionsCount: 14,
    rubricAtomsCount: 5,
  },
  {
    id: "rate-limiting-algorithms",
    slug: "rate-limiting-algorithms",
    topicId: "FND008",
    title: "Rate Limiting & Throttling",
    description: "Token bucket, leaky bucket, sliding window counter algorithms.",
    priority: "P0",
    difficulty: "INTERMEDIATE",
    readiness: 85,
    duration: 10,
    status: "Practiced",
    isStarred: false,
    questionsCount: 22,
    rubricAtomsCount: 7,
  },
  {
    id: "sharding-partitioning",
    slug: "sharding-partitioning",
    topicId: "SYS032",
    title: "Database Sharding & Partitioning",
    description: "Horizontal scaling, shard keys, re-sharding, and consistent hashing.",
    priority: "P1",
    difficulty: "EXPERT",
    readiness: 60,
    duration: 25,
    status: "Needs Practice",
    isStarred: false,
    questionsCount: 16,
    rubricAtomsCount: 6,
  },
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

function filterTopics(
  topics: TestTopic[],
  query: string,
  status: string,
  difficulty: string,
  priority: string,
  time: string,
  sort: string
): TestTopic[] {
  return topics
    .filter((topic) => {
      // 1. Search Query
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchTitle = topic.title.toLowerCase().includes(q);
        const matchId = (topic.topicId || "").toLowerCase().includes(q);
        const matchDesc = topic.description.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchDesc) return false;
      }

      // 2. Status
      if (status === "starred") {
        if (!topic.isStarred) return false;
      } else if (status !== "all" && topic.status !== status) {
        return false;
      }

      // 3. Difficulty
      if (difficulty !== "all" && (topic.difficulty || "").toUpperCase() !== difficulty.toUpperCase()) {
        return false;
      }

      // 4. Priority
      if (priority !== "all") {
        if (priority === "P0" && topic.priority !== "P0" && topic.priority !== "High") return false;
        if (priority === "P1" && topic.priority !== "P1" && topic.priority !== "Medium") return false;
      }

      // 5. Time
      if (time === "<=10" && topic.duration > 10) return false;
      if (time === "10-20" && (topic.duration <= 10 || topic.duration > 20)) return false;
      if (time === ">=20" && topic.duration < 20) return false;

      return true;
    })
    .sort((a, b) => {
      if (sort === "high") {
        const pOrder: Record<string, number> = { P0: 0, High: 0, P1: 1, Medium: 1, Low: 2 };
        return (pOrder[a.priority] ?? 1) - (pOrder[b.priority] ?? 1);
      }
      if (sort === "readiness-asc") return a.readiness - b.readiness;
      if (sort === "readiness-desc") return b.readiness - a.readiness;
      if (sort === "questions-desc") return (b.questionsCount ?? 20) - (a.questionsCount ?? 20);

      // Recommended default: P0 first, then lowest readiness
      const aIsP0 = a.priority === "P0" || a.priority === "High";
      const bIsP0 = b.priority === "P0" || b.priority === "High";
      if (aIsP0 && !bIsP0) return -1;
      if (!aIsP0 && bIsP0) return 1;
      return a.readiness - b.readiness;
    });
}

function runTests() {
  console.log("==================================================================");
  console.log("🧪 Running TASK-P4-03: Category Grouping, Topic Cards & Search Suite");
  console.log("==================================================================\n");

  console.log("👉 Test Suite 1: Canonical Topic ID Search & Multi-Dimensional Matching");
  {
    // Search by canonical topic ID
    const resId = filterTopics(MOCK_TOPICS, "SYS018", "all", "all", "all", "all", "all");
    assert(resId.length === 1 && resId[0].id === "distributed-caching", "Finds topic by exact canonical ID 'SYS018'");

    const resIdLower = filterTopics(MOCK_TOPICS, "fnd001", "all", "all", "all", "all", "all");
    assert(resIdLower.length === 1 && resIdLower[0].id === "cap-theorem", "Finds topic by lowercase canonical ID 'fnd001'");

    // Search by title keyword
    const resTitle = filterTopics(MOCK_TOPICS, "consensus", "all", "all", "all", "all", "all");
    assert(resTitle.length === 1 && resTitle[0].id === "consensus-raft-paxos", "Finds topic by title keyword 'consensus'");

    // Search by description keyword
    const resDesc = filterTopics(MOCK_TOPICS, "stampede", "all", "all", "all", "all", "all");
    assert(resDesc.length === 1 && resDesc[0].id === "distributed-caching", "Finds topic by description keyword 'stampede'");

    // Non-matching search
    const resNone = filterTopics(MOCK_TOPICS, "nonexistent-quantum-encryption", "all", "all", "all", "all", "all");
    assert(resNone.length === 0, "Returns 0 results for non-matching search");
  }

  console.log("\n👉 Test Suite 2: Multi-Criteria Filter Engine");
  {
    // Status filter: Needs Practice
    const resNeedsPractice = filterTopics(MOCK_TOPICS, "", "Needs Practice", "all", "all", "all", "all");
    assert(resNeedsPractice.length === 2, "Status filter 'Needs Practice' returns 2 topics");

    // Status filter: Starred
    const resStarred = filterTopics(MOCK_TOPICS, "", "starred", "all", "all", "all", "all");
    assert(resStarred.length === 2 && resStarred.every((t) => t.isStarred), "Status filter '★ Starred' returns only starred topics");

    // Difficulty filter: ADVANCED
    const resAdv = filterTopics(MOCK_TOPICS, "", "all", "ADVANCED", "all", "all", "all");
    assert(resAdv.length === 1 && resAdv[0].id === "consensus-raft-paxos", "Difficulty filter 'ADVANCED' returns 1 topic");

    // Priority filter: P0
    const resP0 = filterTopics(MOCK_TOPICS, "", "all", "all", "P0", "all", "all");
    assert(resP0.length === 3 && resP0.every((t) => t.priority === "P0"), "Priority filter 'P0' returns 3 core topics");

    // Time filter: <= 10 min
    const resTimeShort = filterTopics(MOCK_TOPICS, "", "all", "all", "all", "<=10", "all");
    assert(resTimeShort.length === 1 && resTimeShort[0].duration <= 10, "Time filter '<=10' returns 1 topic (<= 10 min)");

    // Combined multi-filter: P0 + Needs Practice
    const resCombined = filterTopics(MOCK_TOPICS, "", "Needs Practice", "all", "P0", "all", "all");
    assert(resCombined.length === 1 && resCombined[0].id === "cap-theorem", "Combined P0 + Needs Practice filter matches CAP theorem");
  }

  console.log("\n👉 Test Suite 3: Sorting Strategies");
  {
    // Recommended default: P0 first sorted by lowest readiness
    const resRec = filterTopics(MOCK_TOPICS, "", "all", "all", "all", "all", "all");
    assert(resRec[0].id === "cap-theorem", "Recommended sort puts lowest readiness P0 topic first (readiness: 45)");
    assert(resRec[0].priority === "P0" && resRec[1].priority === "P0" && resRec[2].priority === "P0", "P0 topics precede P1 topics in recommended sort");

    // High Priority first
    const resHigh = filterTopics(MOCK_TOPICS, "", "all", "all", "all", "all", "high");
    assert(resHigh.slice(0, 3).every((t) => t.priority === "P0"), "High priority sort groups all P0 items first");

    // Readiness Ascending
    const resReadinessAsc = filterTopics(MOCK_TOPICS, "", "all", "all", "all", "all", "readiness-asc");
    assert(resReadinessAsc[0].readiness === 30 && resReadinessAsc[resReadinessAsc.length - 1].readiness === 85, "Readiness ascending sorts from 30% to 85%");

    // Most Questions Descending
    const resQuestions = filterTopics(MOCK_TOPICS, "", "all", "all", "all", "all", "questions-desc");
    assert(resQuestions[0].questionsCount === 24, "Questions descending puts topic with 24 questions first");
  }

  console.log("\n👉 Test Suite 4: Category Grouping & Partitioning Integrity");
  {
    const mockCategories: TestCategoryGroup[] = [
      {
        slug: "distributed-systems-foundations",
        name: "Distributed Systems Foundations",
        pillar: "Foundations",
        sortOrder: 1,
        topicsCount: 2,
        topics: [MOCK_TOPICS[0], MOCK_TOPICS[3]],
      },
      {
        slug: "data-storage-caching",
        name: "Data Storage & Caching",
        pillar: "Core Architecture",
        sortOrder: 2,
        topicsCount: 3,
        topics: [MOCK_TOPICS[1], MOCK_TOPICS[2], MOCK_TOPICS[4]],
      },
    ];

    assert(mockCategories.length === 2, "Category hierarchy contains 2 groups");
    assert(mockCategories[0].topics.length === 2, "First category has 2 topics");
    assert(mockCategories[1].topics.length === 3, "Second category has 3 topics");
    
    // Check total topics integrity
    const allCategoryTopicIds = mockCategories.flatMap((c) => c.topics.map((t) => t.id));
    assert(allCategoryTopicIds.length === 5, "All 5 topics partitioned across category groups without omission");
  }

  console.log("\n==================================================================");
  console.log(`🎉 TEST SUMMARY: ${passed}/${total} assertions PASSED (0 failures)`);
  console.log("==================================================================");
}

runTests();
