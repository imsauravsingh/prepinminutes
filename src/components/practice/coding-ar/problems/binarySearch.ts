import { ARProblem } from "../types";

export const binarySearchProblem: ARProblem = {
  id: "binary-search",
  title: "Binary Search",
  difficulty: "Easy",
  pattern: "Two Pointer / Divide & Conquer",
  summary:
    "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index; otherwise, return -1.",
  intuition:
    "Because the array is sorted, comparing target with the middle element allows us to discard half of the remaining elements in each step, achieving logarithmic O(log n) efficiency.",
  approach: [
    "Initialize left = 0 and right = nums.length - 1.",
    "While left <= right, calculate mid = Math.floor((left + right) / 2).",
    "If nums[mid] === target, return mid.",
    "If nums[mid] < target, discard left half: left = mid + 1.",
    "If nums[mid] > target, discard right half: right = mid - 1.",
    "If not found, return -1.",
  ],
  takeaway:
    "Halving the problem space at each step turns an O(n) linear search into an O(log n) binary search.",
  initialCodeJS: `function search(nums, target) {
  // your code here
}`,
  initialCodePY: `def search(nums, target):
    # your code here
    pass`,
  recommendedCodeJS: `function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}`,
  recommendedCodePY: `def search(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1`,
  complexity: {
    timeComplexity: "O(log n)",
    timeExplanation:
      "The search space of n elements is halved at every iteration: n, n/2, n/4, ..., 1. The maximum number of comparisons is log₂(n).",
    timeElements: [
      {
        label: "Step 1",
        count: "n elements",
        description: "Entire sorted array",
      },
      {
        label: "Step 2",
        count: "n/2 elements",
        description: "Half of array eliminated",
      },
      {
        label: "Step k",
        count: "1 element",
        description: "Target reached in at most log₂(n) steps",
      },
    ],
    spaceComplexity: "O(1)",
    spaceExplanation:
      "Binary search uses only three pointer variables (left, right, mid), requiring constant space.",
    spaceElements: [
      {
        label: "Pointers",
        usage: "3 integers",
        description: "left, right, mid indices",
      },
    ],
  },
  executionSteps: [
    {
      id: "bs-1",
      stepNumber: 1,
      codeLine: 2,
      operation: "read",
      variables: {
        nums: "[-1, 0, 3, 5, 9, 12]",
        target: 9,
        left: 0,
        right: 5,
        mid: "null",
      },
      dataStructures: [
        {
          type: "array",
          id: "nums",
          name: "nums",
          data: [-1, 0, 3, 5, 9, 12],
          highlightIndices: [0, 1, 2, 3, 4, 5],
          pointers: { L: 0, R: 5 },
        },
      ],
      explanation: {
        what: "Initialize search bounds: left = 0, right = 5 for target = 9.",
        why: "Search space is the entire array [indices 0 to 5].",
        result: "Active search range: [-1, 0, 3, 5, 9, 12].",
      },
    },
    {
      id: "bs-2",
      stepNumber: 2,
      codeLine: 6,
      operation: "compare",
      variables: { left: 0, right: 5, mid: 2, "nums[mid]": 3, target: 9 },
      dataStructures: [
        {
          type: "array",
          id: "nums",
          name: "nums",
          data: [-1, 0, 3, 5, 9, 12],
          highlightIndices: [2],
          pointers: { L: 0, Mid: 2, R: 5 },
        },
      ],
      explanation: {
        what: "Calculate mid = (0 + 5) / 2 = 2. Value at mid is nums[2] = 3.",
        why: "Compare nums[mid]=3 with target=9. Since 3 < 9, target must be in the right half.",
        result: "Discard indices 0 to 2. Set left = mid + 1 = 3.",
      },
      quizCheckpoint: {
        question:
          "Since nums[mid] = 3 is less than target 9, what happens to the search bounds?",
        options: [
          "Move left pointer to mid + 1 (index 3)",
          "Move right pointer to mid - 1 (index 1)",
          "Keep left and right unchanged",
          "Return -1 immediately",
        ],
        correctIndex: 0,
        explanation:
          "Correct! Since the array is sorted and 3 < 9, all elements at and before index 2 are too small. We eliminate them by setting left = mid + 1.",
      },
    },
    {
      id: "bs-3",
      stepNumber: 3,
      codeLine: 6,
      operation: "compare",
      variables: { left: 3, right: 5, mid: 4, "nums[mid]": 9, target: 9 },
      dataStructures: [
        {
          type: "array",
          id: "nums",
          name: "nums",
          data: [-1, 0, 3, 5, 9, 12],
          highlightIndices: [4],
          pointers: { L: 3, Mid: 4, R: 5 },
        },
      ],
      explanation: {
        what: "Calculate new mid = (3 + 5) / 2 = 4. Value at mid is nums[4] = 9.",
        why: "nums[mid] === target (9 === 9). Exact match found!",
        result: "Return index 4.",
      },
    },
    {
      id: "bs-4",
      stepNumber: 4,
      codeLine: 9,
      operation: "return",
      variables: { result: 4 },
      dataStructures: [
        {
          type: "array",
          id: "nums",
          name: "nums",
          data: [-1, 0, 3, 5, 9, 12],
          highlightIndices: [4],
          pointers: { Match: 4 },
        },
      ],
      explanation: {
        what: "Found target 9 at index 4 in only 2 comparisons!",
        why: "Logarithmic binary search eliminated 4 out of 6 elements in just 2 steps.",
        result: "Returned 4.",
      },
    },
  ],
};
