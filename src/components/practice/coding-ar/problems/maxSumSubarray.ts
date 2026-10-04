import { ARProblem } from "../types";

export const maxSumSubarrayProblem: ARProblem = {
  id: "max-sum-subarray",
  title: "Max Sum Subarray (Size K)",
  difficulty: "Easy",
  pattern: "Sliding Window",
  summary:
    "Given an array of integers and a number K, find the maximum sum of any contiguous subarray of size K.",
  intuition:
    "Instead of recalculating the sum of every size-K window from scratch in O(n·k) time, slide a window of size K across the array. Subtract the element leaving the window and add the element entering it in O(1) time per step.",
  approach: [
    "Compute the sum of the first K elements to form the initial window.",
    "Initialize maxSum with this initial window sum.",
    "Slide the window forward one element at a time from index K to the end.",
    "At each step: windowSum = windowSum - arr[i - k] + arr[i].",
    "Update maxSum = Math.max(maxSum, windowSum).",
    "Return maxSum.",
  ],
  takeaway:
    "Fixed-size Sliding Window converts redundant re-computations into O(1) delta updates: WindowSum = PreviousSum - ExitingElement + EnteringElement.",
  initialCodeJS: `function maxSubarraySum(arr, k) {
  // your code here
}`,
  initialCodePY: `def max_subarray_sum(arr, k):
    # your code here
    pass`,
  recommendedCodeJS: `function maxSubarraySum(arr, k) {
  if (!arr || arr.length < k) return 0;
  let maxSum = 0;
  let windowSum = 0;

  // 1. Build initial window of size k
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;

  // 2. Slide the window across the rest of the array
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}`,
  recommendedCodePY: `def max_subarray_sum(arr, k):
    if not arr or len(arr) < k:
        return 0
    
    # 1. Build initial window of size k
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # 2. Slide the window
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
        
    return max_sum`,
  complexity: {
    timeComplexity: "O(n)",
    timeExplanation:
      "We make a single pass through the array. Calculating the initial window takes O(k), and sliding through the remaining (n - k) elements takes O(1) per step, yielding O(n) total.",
    timeElements: [
      {
        label: "Initial Window",
        count: "k steps",
        description: "Summing indices 0 to k-1",
      },
      {
        label: "Window Slides",
        count: "n - k steps",
        description: "O(1) subtraction and addition per step",
      },
      {
        label: "Total Runtime",
        count: "n operations",
        description: "Linear traversal across array",
      },
    ],
    spaceComplexity: "O(1)",
    spaceExplanation:
      "Only two scalar variables (windowSum and maxSum) are allocated, requiring constant auxiliary space regardless of input array size.",
    spaceElements: [
      {
        label: "windowSum",
        usage: "1 float/int",
        description: "Holds the running sum of current window",
      },
      {
        label: "maxSum",
        usage: "1 float/int",
        description: "Tracks maximum observed sum",
      },
    ],
  },
  executionSteps: [
    {
      id: "step-1",
      stepNumber: 1,
      codeLine: 2,
      operation: "read",
      variables: { arr: "[2, 1, 5, 1, 3, 2]", k: 3, maxSum: 0, windowSum: 0 },
      dataStructures: [
        {
          type: "array",
          id: "arr",
          name: "arr",
          data: [2, 1, 5, 1, 3, 2],
          highlightIndices: [],
          pointers: {},
        },
      ],
      explanation: {
        what: "Initialize algorithm with input array [2, 1, 5, 1, 3, 2] and window size k = 3.",
        why: "Array length (6) is >= k (3), so we proceed to compute the maximum subarray sum.",
        result: "windowSum = 0, maxSum = 0",
      },
    },
    {
      id: "step-2",
      stepNumber: 2,
      codeLine: 8,
      operation: "slide",
      variables: { i: 2, k: 3, windowSum: 8, maxSum: 8 },
      dataStructures: [
        {
          type: "array",
          id: "arr",
          name: "arr",
          data: [2, 1, 5, 1, 3, 2],
          highlightIndices: [0, 1, 2],
          pointers: { start: 0, end: 2 },
        },
        {
          type: "sliding_window",
          id: "window",
          name: "Active Window (Size 3)",
          data: { start: 0, end: 2, sum: 8 },
        },
      ],
      explanation: {
        what: "Build initial window from index 0 to 2: arr[0] + arr[1] + arr[2] = 2 + 1 + 5 = 8.",
        why: "This establishes our baseline window before we start sliding.",
        result: "windowSum = 8, maxSum = 8",
      },
    },
    {
      id: "step-3",
      stepNumber: 3,
      codeLine: 13,
      operation: "slide",
      variables: { i: 3, "arr[i]": 1, "arr[i-k]": 2, windowSum: 7, maxSum: 8 },
      dataStructures: [
        {
          type: "array",
          id: "arr",
          name: "arr",
          data: [2, 1, 5, 1, 3, 2],
          highlightIndices: [1, 2, 3],
          pointers: { start: 1, end: 3, leaving: 0, entering: 3 },
        },
        {
          type: "sliding_window",
          id: "window",
          name: "Active Window (Size 3)",
          data: { start: 1, end: 3, sum: 7 },
        },
      ],
      explanation: {
        what: "Slide window to indices [1..3] ([1, 5, 1]): Subtract arr[0]=2, Add arr[3]=1.",
        why: "windowSum = 8 - 2 + 1 = 7.",
        result:
          "Current windowSum is 7. Since 7 < maxSum (8), maxSum remains 8.",
      },
      quizCheckpoint: {
        question:
          "When the window slides to index 4 (value 3), what will the new windowSum be?",
        options: [
          "windowSum = 7 - 1 + 3 = 9",
          "windowSum = 7 - 5 + 3 = 5",
          "windowSum = 8 + 3 = 11",
          "windowSum = 7 + 3 = 10",
        ],
        correctIndex: 0,
        explanation:
          "Correct! The element leaving the window is arr[1] = 1, and the element entering is arr[4] = 3. So windowSum = 7 - 1 + 3 = 9.",
      },
    },
    {
      id: "step-4",
      stepNumber: 4,
      codeLine: 14,
      operation: "compare",
      variables: { i: 4, "arr[i]": 3, "arr[i-k]": 1, windowSum: 9, maxSum: 9 },
      dataStructures: [
        {
          type: "array",
          id: "arr",
          name: "arr",
          data: [2, 1, 5, 1, 3, 2],
          highlightIndices: [2, 3, 4],
          pointers: { start: 2, end: 4, leaving: 1, entering: 4 },
        },
        {
          type: "sliding_window",
          id: "window",
          name: "Active Window (Size 3)",
          data: { start: 2, end: 4, sum: 9 },
        },
      ],
      explanation: {
        what: "Slide window to indices [2..4] ([5, 1, 3]): Subtract arr[1]=1, Add arr[4]=3.",
        why: "windowSum = 7 - 1 + 3 = 9. Compare with maxSum (8): 9 > 8.",
        result: "New max found! maxSum is updated to 9.",
      },
    },
    {
      id: "step-5",
      stepNumber: 5,
      codeLine: 13,
      operation: "slide",
      variables: { i: 5, "arr[i]": 2, "arr[i-k]": 5, windowSum: 6, maxSum: 9 },
      dataStructures: [
        {
          type: "array",
          id: "arr",
          name: "arr",
          data: [2, 1, 5, 1, 3, 2],
          highlightIndices: [3, 4, 5],
          pointers: { start: 3, end: 5, leaving: 2, entering: 5 },
        },
        {
          type: "sliding_window",
          id: "window",
          name: "Active Window (Size 3)",
          data: { start: 3, end: 5, sum: 6 },
        },
      ],
      explanation: {
        what: "Slide window to indices [3..5] ([1, 3, 2]): Subtract arr[2]=5, Add arr[5]=2.",
        why: "windowSum = 9 - 5 + 2 = 6.",
        result: "6 < maxSum (9), so maxSum remains 9.",
      },
    },
    {
      id: "step-6",
      stepNumber: 6,
      codeLine: 17,
      operation: "return",
      variables: { maxSum: 9, finalResult: 9 },
      dataStructures: [
        {
          type: "array",
          id: "arr",
          name: "arr",
          data: [2, 1, 5, 1, 3, 2],
          highlightIndices: [2, 3, 4],
          pointers: { maxStart: 2, maxEnd: 4 },
        },
        {
          type: "sliding_window",
          id: "window",
          name: "Max Subarray [5, 1, 3]",
          data: { start: 2, end: 4, sum: 9 },
        },
      ],
      explanation: {
        what: "Reached end of array. The maximum sum of any contiguous subarray of size 3 is 9 (subarray [5, 1, 3]).",
        why: "Algorithm completes in O(n) time and O(1) space.",
        result: "Returned 9.",
      },
    },
  ],
};
