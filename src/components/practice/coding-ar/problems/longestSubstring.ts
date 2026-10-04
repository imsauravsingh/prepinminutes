import { ARProblem } from "../types";

export const longestSubstringProblem: ARProblem = {
  id: "longest-substring",
  title: "Longest Substring Without Repeating Characters",
  difficulty: "Medium",
  pattern: "Dynamic Sliding Window + Set",
  summary:
    "Given a string s, find the length of the longest substring without duplicate characters.",
  intuition:
    "Use a dynamic sliding window [left..right] and a Set to track characters in the window. Expand right pointer. If a duplicate is encountered, shrink left pointer until the duplicate character is eliminated.",
  approach: [
    "Initialize left = 0, maxLength = 0, and an empty Set.",
    "Iterate right pointer from 0 to s.length - 1.",
    "While s[right] is already in the set, delete s[left] and increment left.",
    "Add s[right] to the set.",
    "Update maxLength = Math.max(maxLength, right - left + 1).",
    "Return maxLength.",
  ],
  takeaway:
    "Dynamic Sliding Window shrinks the left boundary when constraints are violated and expands the right boundary to find the optimal span in O(n) time.",
  initialCodeJS: `function lengthOfLongestSubstring(s) {
  // your code here
}`,
  initialCodePY: `def length_of_longest_substring(s):
    # your code here
    pass`,
  recommendedCodeJS: `function lengthOfLongestSubstring(s) {
  let left = 0;
  let maxLength = 0;
  const charSet = new Set();

  for (let right = 0; right < s.length; right++) {
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }

    charSet.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}`,
  recommendedCodePY: `def length_of_longest_substring(s):
    char_set = set()
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
        
    return max_length`,
  complexity: {
    timeComplexity: "O(n)",
    timeExplanation:
      "In the worst case, each character is visited at most twice (once by right, once by left), running in 2n = O(n) linear time.",
    timeElements: [
      {
        label: "Right Pointer",
        count: "n steps",
        description: "Expands window forward",
      },
      {
        label: "Left Pointer",
        count: "At most n steps",
        description: "Shrinks window upon duplicates",
      },
    ],
    spaceComplexity: "O(min(n, m))",
    spaceExplanation:
      "Set stores unique characters bounded by the string size n and alphabet size m (e.g. 26 lowercase English letters or 128 ASCII).",
    spaceElements: [
      {
        label: "charSet",
        usage: "Up to min(n, 128)",
        description: "Tracks characters in active window",
      },
    ],
  },
  executionSteps: [
    {
      id: "ls-1",
      stepNumber: 1,
      codeLine: 2,
      operation: "read",
      variables: { s: '"a b c a b c b b"', left: 0, right: 0, maxLength: 0 },
      dataStructures: [
        {
          type: "array",
          id: "chars",
          name: "String Characters",
          data: ["a", "b", "c", "a", "b", "c", "b", "b"],
          highlightIndices: [0],
          pointers: { L: 0, R: 0 },
        },
        {
          type: "sliding_window",
          id: "window",
          name: "Window [0..0]",
          data: { start: 0, end: 0, length: 1 },
        },
      ],
      explanation: {
        what: "Initialize left = 0, maxLength = 0. Add s[0] = 'a' to Set.",
        why: "Set has {'a'}. Window length is 1.",
        result: "maxLength = 1",
      },
    },
    {
      id: "ls-2",
      stepNumber: 2,
      codeLine: 13,
      operation: "slide",
      variables: {
        left: 0,
        right: 2,
        "s[right]": "c",
        maxLength: 3,
        set: "{'a', 'b', 'c'}",
      },
      dataStructures: [
        {
          type: "array",
          id: "chars",
          name: "String Characters",
          data: ["a", "b", "c", "a", "b", "c", "b", "b"],
          highlightIndices: [0, 1, 2],
          pointers: { L: 0, R: 2 },
        },
        {
          type: "sliding_window",
          id: "window",
          name: 'Window [0..2] "abc"',
          data: { start: 0, end: 2, length: 3 },
        },
      ],
      explanation: {
        what: "Expanded to right = 2 ('c'). No duplicates found in {'a', 'b', 'c'}.",
        why: "Window spans 'a', 'b', 'c'.",
        result: "maxLength updated to 3.",
      },
      quizCheckpoint: {
        question:
          "Next character at index 3 is 'a'. What must the sliding window do?",
        options: [
          "Delete s[left]='a' from the set and increment left",
          "Reset right pointer to 0",
          "Immediately return 3",
          "Add duplicate 'a' to the set anyway",
        ],
        correctIndex: 0,
        explanation:
          "Correct! Because 'a' is already in the set, we shrink the left boundary by removing s[left] and incrementing left until 'a' is no longer a duplicate.",
      },
    },
    {
      id: "ls-3",
      stepNumber: 3,
      codeLine: 8,
      operation: "slide",
      variables: { left: 1, right: 3, duplicate: "a", set: "{'b', 'c', 'a'}" },
      dataStructures: [
        {
          type: "array",
          id: "chars",
          name: "String Characters",
          data: ["a", "b", "c", "a", "b", "c", "b", "b"],
          highlightIndices: [1, 2, 3],
          pointers: { L: 1, R: 3 },
        },
        {
          type: "sliding_window",
          id: "window",
          name: 'Window [1..3] "bca"',
          data: { start: 1, end: 3, length: 3 },
        },
      ],
      explanation: {
        what: "Duplicate 'a' found at right = 3. Shrink left: remove s[0]='a', left = 1. Add s[3]='a'.",
        why: "New window [1..3] contains 'bca', which has no duplicates.",
        result: "Window length is 3 (max stays 3).",
      },
    },
    {
      id: "ls-4",
      stepNumber: 4,
      codeLine: 17,
      operation: "return",
      variables: { maxLength: 3 },
      dataStructures: [
        {
          type: "array",
          id: "chars",
          name: "String Characters",
          data: ["a", "b", "c", "a", "b", "c", "b", "b"],
          highlightIndices: [0, 1, 2],
          pointers: { BestStart: 0, BestEnd: 2 },
        },
      ],
      explanation: {
        what: "Traversed entire string. Longest substring without repeating characters is 'abc' with length 3.",
        why: "Algorithm ran in single linear O(n) pass.",
        result: "Returned 3.",
      },
    },
  ],
};
