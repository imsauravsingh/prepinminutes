import { ARProblem } from "../types";

export const twoSumProblem: ARProblem = {
  id: "two-sum",
  title: "Two Sum",
  difficulty: "Easy",
  pattern: "HashMap Lookup",
  summary:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  intuition:
    "Instead of comparing every pair in O(n²) with nested loops, use a HashMap. For each number, calculate its required complement = target - nums[i]. If the complement is already in the map, we found our pair in O(1) lookup time.",
  approach: [
    "Create an empty HashMap to store seen numbers and their indices.",
    "Iterate through the array with index i and value nums[i].",
    "Calculate complement = target - nums[i].",
    "Check if complement exists in the map.",
    "If it exists, return [map.get(complement), i].",
    "Otherwise, insert map.set(nums[i], i) and continue.",
  ],
  takeaway:
    "Trade space for time: A HashMap lookup reduces pair-finding from O(n²) brute force to O(n) single-pass linear time.",
  initialCodeJS: `function twoSum(nums, target) {
  // your code here
}`,
  initialCodePY: `def two_sum(nums, target):
    # your code here
    pass`,
  recommendedCodeJS: `function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
  }

  return [];
}`,
  recommendedCodePY: `def two_sum(nums, target):
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
        
    return []`,
  complexity: {
    timeComplexity: "O(n)",
    timeExplanation:
      "We traverse the array of n elements exactly once. Each HashMap insertion and lookup runs in O(1) average time, resulting in O(n) total runtime.",
    timeElements: [
      {
        label: "Array Traversal",
        count: "n elements",
        description: "Single for-loop pass",
      },
      {
        label: "HashMap Lookups",
        count: "O(1) each",
        description: "Constant-time key search",
      },
      {
        label: "Overall Time",
        count: "O(n)",
        description: "Optimal linear performance",
      },
    ],
    spaceComplexity: "O(n)",
    spaceExplanation:
      "In the worst case, we store up to n - 1 elements in the HashMap before finding the target pair, using O(n) auxiliary space.",
    spaceElements: [
      {
        label: "seen HashMap",
        usage: "Up to n entries",
        description: "Stores { value -> index } pairs",
      },
    ],
  },
  executionSteps: [
    {
      id: "step-1",
      stepNumber: 1,
      codeLine: 2,
      operation: "read",
      variables: {
        nums: "[2, 7, 11, 15]",
        target: 9,
        i: "null",
        complement: "null",
      },
      dataStructures: [
        {
          type: "array",
          id: "nums",
          name: "nums",
          data: [2, 7, 11, 15],
          highlightIndices: [],
          pointers: {},
        },
        {
          type: "hash_map",
          id: "map",
          name: "seen Map",
          data: {},
        },
      ],
      explanation: {
        what: "Initialize empty HashMap to record seen numbers and their indices.",
        why: "Input is nums = [2, 7, 11, 15] and target = 9.",
        result: "map = {}, ready to scan elements.",
      },
    },
    {
      id: "step-2",
      stepNumber: 2,
      codeLine: 5,
      operation: "lookup",
      variables: { i: 0, "nums[i]": 2, target: 9, complement: 7 },
      dataStructures: [
        {
          type: "array",
          id: "nums",
          name: "nums",
          data: [2, 7, 11, 15],
          highlightIndices: [0],
          pointers: { i: 0 },
        },
        {
          type: "hash_map",
          id: "map",
          name: "seen Map",
          data: {},
          activeKey: 7,
        },
      ],
      visualActions: [
        { targetId: "nums-0", action: "highlight", color: "#ff5520" },
      ],
      explanation: {
        what: "Process index i = 0 (value 2). Calculate required complement = 9 - 2 = 7.",
        why: "Check if complement 7 already exists in the map.",
        result: "Map does not contain 7. Match not found yet.",
      },
      quizCheckpoint: {
        question: "Since 7 was not in the map, what is our next action?",
        options: [
          "Insert 2 → 0 into the HashMap and advance i",
          "Insert 7 into the HashMap",
          "Reset target to 7",
          "Return empty array immediately",
        ],
        correctIndex: 0,
        explanation:
          "Correct! We store nums[i] (2) with its index (0) into our map so future elements can look it up.",
      },
    },
    {
      id: "step-3",
      stepNumber: 3,
      codeLine: 11,
      operation: "insert",
      variables: { i: 0, "nums[0]": 2, map: "{ 2: 0 }" },
      dataStructures: [
        {
          type: "array",
          id: "nums",
          name: "nums",
          data: [2, 7, 11, 15],
          highlightIndices: [0],
          pointers: { i: 0 },
        },
        {
          type: "hash_map",
          id: "map",
          name: "seen Map",
          data: { 2: 0 },
        },
      ],
      visualActions: [{ targetId: "map", action: "pulse", color: "#10b981" }],
      explanation: {
        what: "Insert key-value pair 2 → index 0 into HashMap.",
        why: "If another number needs 2 to reach 9, it can find index 0 in O(1) time.",
        result: "map is now { 2: 0 }.",
      },
    },
    {
      id: "step-4",
      stepNumber: 4,
      codeLine: 5,
      operation: "lookup",
      variables: { i: 1, "nums[i]": 7, target: 9, complement: 2 },
      dataStructures: [
        {
          type: "array",
          id: "nums",
          name: "nums",
          data: [2, 7, 11, 15],
          highlightIndices: [1],
          pointers: { i: 1 },
        },
        {
          type: "hash_map",
          id: "map",
          name: "seen Map",
          data: { 2: 0 },
          activeKey: 2,
        },
      ],
      visualActions: [
        { targetId: "nums-1", action: "highlight", color: "#ff5520" },
      ],
      explanation: {
        what: "Process index i = 1 (value 7). Calculate complement = 9 - 7 = 2.",
        why: "Query HashMap for complement 2.",
        result: "MATCH FOUND! Key 2 exists in map at index 0.",
      },
    },
    {
      id: "step-5",
      stepNumber: 5,
      codeLine: 8,
      operation: "return",
      variables: { "map.get(2)": 0, i: 1, result: "[0, 1]" },
      dataStructures: [
        {
          type: "array",
          id: "nums",
          name: "nums",
          data: [2, 7, 11, 15],
          highlightIndices: [0, 1],
          pointers: { match1: 0, match2: 1 },
        },
        {
          type: "hash_map",
          id: "map",
          name: "seen Map",
          data: { 2: 0 },
        },
      ],
      explanation: {
        what: "Return indices pair: [0, 1] since nums[0] (2) + nums[1] (7) = 9.",
        why: "Target sum reached in a single pass with O(1) lookup.",
        result: "Algorithm successfully finishes and returns [0, 1].",
      },
    },
  ],
};
