import { ARProblem } from "../types";

export const binaryTreeInorderProblem: ARProblem = {
  id: "binary-tree-inorder",
  title: "Binary Tree Inorder Traversal",
  difficulty: "Easy",
  pattern: "Tree Traversal (Left → Root → Right)",
  summary:
    "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
  intuition:
    "Inorder traversal visits the left subtree, then the root node itself, and finally the right subtree. In a Binary Search Tree (BST), inorder traversal visits nodes in strictly sorted ascending order.",
  approach: [
    "Initialize an empty result array and a traversal stack.",
    "Set current = root.",
    "While current is not null or stack is not empty:",
    "  1. Traverse down left branch, pushing current onto stack: current = current.left.",
    "  2. Pop node from stack, append its value to result.",
    "  3. Move to right subtree: current = node.right.",
    "Return result.",
  ],
  takeaway:
    "Inorder traversal (Left → Root → Right) can be written iteratively using an explicit Stack or recursively using the call stack.",
  initialCodeJS: `function inorderTraversal(root) {
  // your code here
}`,
  initialCodePY: `def inorder_traversal(root):
    # your code here
    pass`,
  recommendedCodeJS: `function inorderTraversal(root) {
  const result = [];
  const stack = [];
  let curr = root;

  while (curr !== null || stack.length > 0) {
    while (curr !== null) {
      stack.push(curr);
      curr = curr.left;
    }

    curr = stack.pop();
    result.push(curr.val);
    curr = curr.right;
  }

  return result;
}`,
  recommendedCodePY: `def inorder_traversal(root):
    result = []
    stack = []
    curr = root
    
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
            
        curr = stack.pop()
        result.append(curr.val)
        curr = curr.right
        
    return result`,
  complexity: {
    timeComplexity: "O(n)",
    timeExplanation:
      "Every node in the tree of n nodes is visited exactly once.",
    timeElements: [
      {
        label: "Node Visits",
        count: "n nodes",
        description: "Each node pushed and popped once",
      },
    ],
    spaceComplexity: "O(h)",
    spaceExplanation:
      "Stack space is proportional to the tree height h. For a balanced tree h = O(log n); worst-case skewed tree h = O(n).",
    spaceElements: [
      {
        label: "Call Stack / Array",
        usage: "Up to h nodes",
        description: "Stores ancestor nodes",
      },
    ],
  },
  executionSteps: [
    {
      id: "bt-1",
      stepNumber: 1,
      codeLine: 4,
      operation: "read",
      variables: { curr: "Node(1)", stack: "[]", result: "[]" },
      dataStructures: [
        {
          type: "tree",
          id: "tree",
          name: "Binary Tree: [1, null, 2, 3]",
          data: {
            val: 1,
            left: null,
            right: {
              val: 2,
              left: { val: 3, left: null, right: null },
              right: null,
            },
          },
        },
        {
          type: "stack",
          id: "stack",
          name: "Traversal Stack",
          data: [],
        },
      ],
      explanation: {
        what: "Start traversal at root Node(1). Stack and result list are empty.",
        why: "Tree has root 1 with right child 2, and 2 has left child 3.",
        result: "curr = Node(1)",
      },
    },
    {
      id: "bt-2",
      stepNumber: 2,
      codeLine: 8,
      operation: "push",
      variables: { curr: "null", stack: "[Node(1)]", result: "[]" },
      dataStructures: [
        {
          type: "tree",
          id: "tree",
          name: "Binary Tree",
          data: {
            val: 1,
            left: null,
            right: {
              val: 2,
              left: { val: 3, left: null, right: null },
              right: null,
            },
          },
          highlightIndices: [1],
        },
        {
          type: "stack",
          id: "stack",
          name: "Traversal Stack",
          data: ["1"],
        },
      ],
      explanation: {
        what: "Push Node(1) to stack. Node(1).left is null, so loop terminates.",
        why: "Must process left subtree first (none exists here).",
        result: "stack = [1]",
      },
    },
    {
      id: "bt-3",
      stepNumber: 3,
      codeLine: 13,
      operation: "pop",
      variables: { popped: "Node(1)", result: "[1]", curr: "Node(2)" },
      dataStructures: [
        {
          type: "tree",
          id: "tree",
          name: "Binary Tree",
          data: {
            val: 1,
            left: null,
            right: {
              val: 2,
              left: { val: 3, left: null, right: null },
              right: null,
            },
          },
          highlightIndices: [1],
        },
        {
          type: "stack",
          id: "stack",
          name: "Traversal Stack",
          data: [],
        },
      ],
      explanation: {
        what: "Pop Node(1), append value 1 to result. Move to curr = 1.right (Node 2).",
        why: "Inorder rule: Root is processed after its left subtree.",
        result: "result = [1], curr = Node(2)",
      },
      quizCheckpoint: {
        question:
          "Node(2) has left child Node(3). In what order will they appear in result?",
        options: [
          "Node 3 before Node 2",
          "Node 2 before Node 3",
          "Both at the same time",
          "Node 2 will be discarded",
        ],
        correctIndex: 0,
        explanation:
          "Correct! Inorder traversal always visits the Left subtree before the Root, so Node 3 is appended before Node 2.",
      },
    },
    {
      id: "bt-4",
      stepNumber: 4,
      codeLine: 8,
      operation: "push",
      variables: { stack: "[Node(2), Node(3)]", curr: "null" },
      dataStructures: [
        {
          type: "tree",
          id: "tree",
          name: "Binary Tree",
          data: {
            val: 1,
            left: null,
            right: {
              val: 2,
              left: { val: 3, left: null, right: null },
              right: null,
            },
          },
          highlightIndices: [2, 3],
        },
        {
          type: "stack",
          id: "stack",
          name: "Traversal Stack",
          data: ["2", "3"],
        },
      ],
      explanation: {
        what: "Push Node(2), then traverse to its left child Node(3) and push Node(3).",
        why: "Drill down to deepest left node before popping.",
        result: "stack = [2, 3]",
      },
    },
    {
      id: "bt-5",
      stepNumber: 5,
      codeLine: 13,
      operation: "pop",
      variables: { result: "[1, 3, 2]" },
      dataStructures: [
        {
          type: "tree",
          id: "tree",
          name: "Binary Tree Traversal Complete",
          data: {
            val: 1,
            left: null,
            right: {
              val: 2,
              left: { val: 3, left: null, right: null },
              right: null,
            },
          },
          highlightIndices: [1, 3, 2],
        },
        {
          type: "stack",
          id: "stack",
          name: "Traversal Stack",
          data: [],
        },
      ],
      explanation: {
        what: "Pop Node(3) -> append 3. Then pop Node(2) -> append 2. Stack is empty.",
        why: "All nodes visited according to Left -> Root -> Right rule.",
        result: "Returned [1, 3, 2].",
      },
    },
  ],
};
