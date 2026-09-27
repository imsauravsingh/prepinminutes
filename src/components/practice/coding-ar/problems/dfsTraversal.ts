import { ARProblem } from "../types";

export const dfsTraversalProblem: ARProblem = {
  id: "dfs-traversal",
  title: "Depth-First Search (Max Depth)",
  difficulty: "Easy",
  pattern: "Recursion / Call Stack",
  summary:
    "Given the root of a binary tree, return its maximum depth (the number of nodes along the longest path from root to leaf).",
  intuition:
    "Max depth at any node is 1 + max(depth(left), depth(right)). Recursion naturally traverses down to the deepest leaf, building up the answer as the call stack unwinds.",
  approach: [
    "Base case: If node is null, return depth 0.",
    "Recursively compute leftDepth = maxDepth(root.left).",
    "Recursively compute rightDepth = maxDepth(root.right).",
    "Return 1 + Math.max(leftDepth, rightDepth).",
  ],
  takeaway:
    "Recursive Depth-First Search utilizes the runtime Call Stack to drill down branches until reaching base cases, then bubbles results up.",
  initialCodeJS: `function maxDepth(root) {
  // your code here
}`,
  initialCodePY: `def max_depth(root):
    # your code here
    pass`,
  recommendedCodeJS: `function maxDepth(root) {
  if (root === null) {
    return 0;
  }

  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);

  return 1 + Math.max(leftDepth, rightDepth);
}`,
  recommendedCodePY: `def max_depth(root):
    if not root:
        return 0
        
    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)
    
    return 1 + max(left_depth, right_depth)`,
  complexity: {
    timeComplexity: "O(n)",
    timeExplanation:
      "Each node in the tree is visited once by the recursive function, running in O(n) linear time.",
    timeElements: [
      {
        label: "Function Calls",
        count: "n calls",
        description: "One call per tree node",
      },
    ],
    spaceComplexity: "O(h)",
    spaceExplanation:
      "Call stack depth is bounded by tree height h. O(log n) for balanced tree, O(n) for degenerate tree.",
    spaceElements: [
      {
        label: "Call Stack",
        usage: "Up to h frames",
        description: "Memory for recursive frames",
      },
    ],
  },
  executionSteps: [
    {
      id: "dfs-1",
      stepNumber: 1,
      codeLine: 2,
      operation: "recursive_call",
      variables: { currentCall: "maxDepth(3)", callStackDepth: 1 },
      dataStructures: [
        {
          type: "call_stack",
          id: "stack",
          name: "Call Stack",
          data: ["maxDepth(3)"],
        },
        {
          type: "tree",
          id: "tree",
          name: "Tree [3 -> (9, 20)]",
          data: { val: 3, left: { val: 9 }, right: { val: 20 } },
          highlightIndices: [3],
        },
      ],
      explanation: {
        what: "Initial call: maxDepth(root = 3). Frame pushed onto Call Stack.",
        why: "Must calculate leftDepth and rightDepth for Node 3.",
        result: "Call Stack: [maxDepth(3)]",
      },
    },
    {
      id: "dfs-2",
      stepNumber: 2,
      codeLine: 6,
      operation: "recursive_call",
      variables: { currentCall: "maxDepth(9)", callStackDepth: 2 },
      dataStructures: [
        {
          type: "call_stack",
          id: "stack",
          name: "Call Stack",
          data: ["maxDepth(3)", "maxDepth(9)"],
        },
        {
          type: "tree",
          id: "tree",
          name: "Tree",
          data: { val: 3, left: { val: 9 }, right: { val: 20 } },
          highlightIndices: [9],
        },
      ],
      explanation: {
        what: "Recursive call to left child: maxDepth(Node 9).",
        why: "Drilling down left branch. Node 9 has no children, so it returns 1 + max(0, 0) = 1.",
        result: "leftDepth for Node 3 will be 1.",
      },
      quizCheckpoint: {
        question:
          "When maxDepth(9) finishes and returns 1, what happens to the Call Stack?",
        options: [
          "maxDepth(9) is popped from the stack",
          "Entire stack is cleared",
          "maxDepth(3) is replaced",
          "Another copy of maxDepth(9) is pushed",
        ],
        correctIndex: 0,
        explanation:
          "Correct! When a recursive function call returns its value, its stack frame is popped from the top of the call stack.",
      },
    },
    {
      id: "dfs-3",
      stepNumber: 3,
      codeLine: 7,
      operation: "recursive_call",
      variables: { currentCall: "maxDepth(20)", callStackDepth: 2 },
      dataStructures: [
        {
          type: "call_stack",
          id: "stack",
          name: "Call Stack",
          data: ["maxDepth(3)", "maxDepth(20)"],
        },
        {
          type: "tree",
          id: "tree",
          name: "Tree",
          data: { val: 3, left: { val: 9 }, right: { val: 20 } },
          highlightIndices: [20],
        },
      ],
      explanation: {
        what: "Recursive call to right child: maxDepth(Node 20).",
        why: "Drilling down right branch. Node 20 returns depth 1.",
        result: "rightDepth for Node 3 is 1.",
      },
    },
    {
      id: "dfs-4",
      stepNumber: 4,
      codeLine: 9,
      operation: "return",
      variables: { leftDepth: 1, rightDepth: 1, "1 + max(1, 1)": 2, result: 2 },
      dataStructures: [
        {
          type: "call_stack",
          id: "stack",
          name: "Call Stack",
          data: [],
        },
        {
          type: "tree",
          id: "tree",
          name: "Tree Completed",
          data: { val: 3, left: { val: 9 }, right: { val: 20 } },
          highlightIndices: [3, 9, 20],
        },
      ],
      explanation: {
        what: "Root Node 3 returns 1 + max(1, 1) = 2. Call Stack is empty.",
        why: "Maximum depth of the binary tree is 2.",
        result: "Returned 2.",
      },
    },
  ],
};
