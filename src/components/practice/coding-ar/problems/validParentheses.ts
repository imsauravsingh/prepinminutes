import { ARProblem } from "../types";

export const validParenthesesProblem: ARProblem = {
  id: "valid-parentheses",
  title: "Valid Parentheses",
  difficulty: "Easy",
  pattern: "Stack (LIFO)",
  summary:
    "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Brackets must close in the correct order.",
  intuition:
    "A Stack naturally models nested structures because the most recently opened bracket must be the first one closed (Last-In, First-Out). Push expected closing brackets onto the stack; when a closing bracket appears, pop and verify it matches.",
  approach: [
    "Initialize an empty Stack.",
    "Iterate through characters in the string.",
    "If character is '(', push ')' onto stack; if '{', push '}'; if '[', push ']'.",
    "If character is a closing bracket, pop from stack and verify it matches.",
    "If stack is empty or doesn't match, return false.",
    "After loop, string is valid if and only if stack is empty.",
  ],
  takeaway:
    "Whenever problems require matching nearest opening and closing boundaries, a LIFO Stack is the optimal data structure.",
  initialCodeJS: `function isValid(s) {
  // your code here
}`,
  initialCodePY: `def is_valid(s):
    # your code here
    pass`,
  recommendedCodeJS: `function isValid(s) {
  const stack = [];

  for (let char of s) {
    if (char === '(') stack.push(')');
    else if (char === '{') stack.push('}');
    else if (char === '[') stack.push(']');
    else {
      if (stack.length === 0 || stack.pop() !== char) {
        return false;
      }
    }
  }

  return stack.length === 0;
}`,
  recommendedCodePY: `def is_valid(s):
    stack = []
    mapping = {'(': ')', '{': '}', '[': ']'}
    
    for char in s:
        if char in mapping:
            stack.append(mapping[char])
        elif not stack or stack.pop() != char:
            return False
            
    return len(stack) == 0`,
  complexity: {
    timeComplexity: "O(n)",
    timeExplanation:
      "We iterate through the string of n characters once. Push and pop operations on a stack execute in O(1) time.",
    timeElements: [
      {
        label: "String Traversal",
        count: "n characters",
        description: "Single linear pass",
      },
      {
        label: "Stack Operations",
        count: "O(1) push/pop",
        description: "Constant-time per character",
      },
    ],
    spaceComplexity: "O(n)",
    spaceExplanation:
      "In the worst-case scenario (e.g. '(((((('), all n characters are opening brackets and pushed onto the stack, using O(n) space.",
    spaceElements: [
      {
        label: "Stack",
        usage: "Up to n elements",
        description: "Stores expected closing brackets",
      },
    ],
  },
  executionSteps: [
    {
      id: "vp-1",
      stepNumber: 1,
      codeLine: 2,
      operation: "read",
      variables: { s: '"{ [ ] }"', char: "null", stack: "[]" },
      dataStructures: [
        {
          type: "stack",
          id: "stack",
          name: "Bracket Stack",
          data: [],
        },
      ],
      explanation: {
        what: "Initialize an empty Stack. Input string is s = '{ [ ] }'.",
        why: "Stack will track expected closing brackets in LIFO order.",
        result: "stack = []",
      },
    },
    {
      id: "vp-2",
      stepNumber: 2,
      codeLine: 6,
      operation: "push",
      variables: { char: "{", stack: "['}']" },
      dataStructures: [
        {
          type: "stack",
          id: "stack",
          name: "Bracket Stack",
          data: ["}"],
        },
      ],
      explanation: {
        what: "Encountered opening bracket '{'. Push expected closing bracket '}' onto stack.",
        why: "When the matching closing bracket appears, it must be '}'.",
        result: "stack: ['}'] (top: '}')",
      },
      quizCheckpoint: {
        question:
          "Next character is '['. What should be pushed onto the stack?",
        options: [
          "Push ']' onto the stack",
          "Push '[' onto the stack",
          "Pop '}' from the stack",
          "Return true immediately",
        ],
        correctIndex: 0,
        explanation:
          "Correct! For opening bracket '[', we push its matching closing bracket ']' to the top of the stack.",
      },
    },
    {
      id: "vp-3",
      stepNumber: 3,
      codeLine: 7,
      operation: "push",
      variables: { char: "[", stack: "['}', ']']" },
      dataStructures: [
        {
          type: "stack",
          id: "stack",
          name: "Bracket Stack",
          data: ["}", "]"],
        },
      ],
      explanation: {
        what: "Encountered opening bracket '['. Push expected closing bracket ']' onto stack.",
        why: "Top of stack now expects ']' first.",
        result: "stack: ['}', ']'] (top: ']')",
      },
    },
    {
      id: "vp-4",
      stepNumber: 4,
      codeLine: 9,
      operation: "pop",
      variables: { char: "]", popped: "]", stack: "['}']" },
      dataStructures: [
        {
          type: "stack",
          id: "stack",
          name: "Bracket Stack",
          data: ["}"],
        },
      ],
      explanation: {
        what: "Encountered closing bracket ']'. Pop top element from stack and check match.",
        why: "popped element ']' === char ']'. Match is valid!",
        result: "Inner bracket pair matched and removed from stack.",
      },
    },
    {
      id: "vp-5",
      stepNumber: 5,
      codeLine: 9,
      operation: "pop",
      variables: { char: "}", popped: "}", stack: "[]" },
      dataStructures: [
        {
          type: "stack",
          id: "stack",
          name: "Bracket Stack",
          data: [],
        },
      ],
      explanation: {
        what: "Encountered closing bracket '}'. Pop top element from stack and check match.",
        why: "popped element '}' === char '}'. Match is valid!",
        result: "Outer bracket pair matched. Stack is now empty.",
      },
    },
    {
      id: "vp-6",
      stepNumber: 6,
      codeLine: 15,
      operation: "return",
      variables: { "stack.length === 0": true, result: true },
      dataStructures: [
        {
          type: "stack",
          id: "stack",
          name: "Bracket Stack",
          data: [],
        },
      ],
      explanation: {
        what: "Finished parsing string. Stack is completely empty.",
        why: "All opened brackets were matched and closed in valid LIFO order.",
        result: "Return true (Valid Parentheses).",
      },
    },
  ],
};
