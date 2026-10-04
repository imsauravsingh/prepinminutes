import { ARProblem } from "../types";

export const bfsTraversalProblem: ARProblem = {
  id: "bfs-traversal",
  title: "Breadth-First Search (Level Order)",
  difficulty: "Medium",
  pattern: "Queue (FIFO)",
  summary:
    "Given the root of a binary tree, return the level order traversal of its nodes' values (from left to right, level by level).",
  intuition:
    "A Queue (First-In, First-Out) naturally processes nodes in increasing order of their distance/level from the root. Enqueue the root, then repeatedly dequeue a node, process it, and enqueue its children.",
  approach: [
    "If root is null, return empty array.",
    "Initialize Queue with [root].",
    "While queue is not empty:",
    "  1. Record current level size = queue.length.",
    "  2. Dequeue level size nodes, record values.",
    "  3. Enqueue any left and right children.",
    "Return levels array.",
  ],
  takeaway:
    "Breadth-First Search utilizes a FIFO Queue to guarantee that nodes at depth d are visited strictly before nodes at depth d + 1.",
  initialCodeJS: `function levelOrder(root) {
  // your code here
}`,
  initialCodePY: `def level_order(root):
    # your code here
    pass`,
  recommendedCodeJS: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}`,
  recommendedCodePY: `from collections import deque

def level_order(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(current_level)
        
    return result`,
  complexity: {
    timeComplexity: "O(n)",
    timeExplanation:
      "Each of the n nodes is enqueued and dequeued exactly once, leading to strict linear O(n) runtime.",
    timeElements: [
      {
        label: "Queue Operations",
        count: "n enqueues/dequeues",
        description: "O(1) operations per node",
      },
    ],
    spaceComplexity: "O(w)",
    spaceExplanation:
      "Space complexity is bounded by the maximum width w of the tree. For a full binary tree, the last level has n/2 nodes, so O(n) auxiliary space.",
    spaceElements: [
      {
        label: "Queue",
        usage: "Up to n/2 nodes",
        description: "Stores deepest level of tree",
      },
    ],
  },
  executionSteps: [
    {
      id: "bfs-1",
      stepNumber: 1,
      codeLine: 4,
      operation: "enqueue",
      variables: { queue: "[Node(3)]", result: "[]" },
      dataStructures: [
        {
          type: "tree",
          id: "tree",
          name: "Tree: 3 -> (9, 20)",
          data: { val: 3, left: { val: 9 }, right: { val: 20 } },
          highlightIndices: [3],
        },
        {
          type: "queue",
          id: "queue",
          name: "FIFO Queue",
          data: ["3"],
        },
      ],
      explanation: {
        what: "Initialize Queue with root Node(3).",
        why: "Level 0 begins with only root.",
        result: "queue = [3]",
      },
    },
    {
      id: "bfs-2",
      stepNumber: 2,
      codeLine: 10,
      operation: "dequeue",
      variables: {
        dequeued: 3,
        currentLevel: "[3]",
        queue: "[Node(9), Node(20)]",
      },
      dataStructures: [
        {
          type: "tree",
          id: "tree",
          name: "Tree: 3 -> (9, 20)",
          data: { val: 3, left: { val: 9 }, right: { val: 20 } },
          highlightIndices: [9, 20],
        },
        {
          type: "queue",
          id: "queue",
          name: "FIFO Queue",
          data: ["9", "20"],
        },
      ],
      explanation: {
        what: "Dequeue Node(3) -> append to currentLevel [3]. Enqueue its children Node(9) and Node(20).",
        why: "Level 0 finished. Children of Node(3) form Level 1.",
        result: "result = [[3]], queue = [9, 20]",
      },
      quizCheckpoint: {
        question:
          "When processing Level 1 (size 2), which node will be dequeued first?",
        options: [
          "Node 9 (FIFO order)",
          "Node 20 (LIFO order)",
          "Both nodes simultaneously",
          "Node 3 again",
        ],
        correctIndex: 0,
        explanation:
          "Correct! Queues follow First-In, First-Out (FIFO) semantics, so Node 9 (enqueued first) is dequeued before Node 20.",
      },
    },
    {
      id: "bfs-3",
      stepNumber: 3,
      codeLine: 17,
      operation: "return",
      variables: { result: "[[3], [9, 20]]" },
      dataStructures: [
        {
          type: "tree",
          id: "tree",
          name: "Tree Traversal Complete",
          data: { val: 3, left: { val: 9 }, right: { val: 20 } },
          highlightIndices: [3, 9, 20],
        },
        {
          type: "queue",
          id: "queue",
          name: "FIFO Queue",
          data: [],
        },
      ],
      explanation: {
        what: "Dequeued Node(9) and Node(20). Queue is now empty.",
        why: "All levels processed in breadth-first order.",
        result: "Returned [[3], [9, 20]].",
      },
    },
  ],
};
