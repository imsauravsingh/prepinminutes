import { ARProblem } from "../types";

export const reverseLinkedListProblem: ARProblem = {
  id: "reverse-linked-list",
  title: "Reverse Linked List",
  difficulty: "Easy",
  pattern: "Linked List (3 Pointers)",
  summary:
    "Given the head of a singly linked list, reverse the list, and return the reversed list's head.",
  intuition:
    "Maintain three pointers: prev (initially null), curr (current node), and nextNode (to preserve the forward link before we reassign curr.next to point backward to prev).",
  approach: [
    "Initialize prev = null, curr = head.",
    "While curr is not null:",
    "  1. Save nextNode = curr.next.",
    "  2. Reverse pointer: curr.next = prev.",
    "  3. Advance prev = curr.",
    "  4. Advance curr = nextNode.",
    "Return prev (new head of reversed list).",
  ],
  takeaway:
    "In-place Linked List reversal requires saving the forward neighbor before modifying the next pointer to avoid losing the rest of the chain.",
  initialCodeJS: `function reverseList(head) {
  // your code here
}`,
  initialCodePY: `def reverse_list(head):
    # your code here
    pass`,
  recommendedCodeJS: `function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    const nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }

  return prev;
}`,
  recommendedCodePY: `def reverse_list(head):
    prev = None
    curr = head
    
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
        
    return prev`,
  complexity: {
    timeComplexity: "O(n)",
    timeExplanation:
      "Every node in the linked list is visited exactly once, re-pointing its pointer in O(1) time.",
    timeElements: [
      {
        label: "List Traversal",
        count: "n nodes",
        description: "Visits each node once",
      },
      {
        label: "Pointer Reversal",
        count: "O(1) per node",
        description: "Constant-time pointer update",
      },
    ],
    spaceComplexity: "O(1)",
    spaceExplanation:
      "Reversal is performed completely in-place using only three reference pointers (prev, curr, nextNode).",
    spaceElements: [
      {
        label: "Pointers",
        usage: "3 references",
        description: "prev, curr, nextNode",
      },
    ],
  },
  executionSteps: [
    {
      id: "rll-1",
      stepNumber: 1,
      codeLine: 2,
      operation: "read",
      variables: { prev: "null", curr: "Node(1)", nextNode: "null" },
      dataStructures: [
        {
          type: "linked_list",
          id: "list",
          name: "Singly Linked List",
          data: [
            { val: 1, next: 2 },
            { val: 2, next: 3 },
            { val: 3, next: null },
          ],
          pointers: { prev: "null", curr: 1 },
        },
      ],
      explanation: {
        what: "Initialize pointers: prev = null, curr = Node(1).",
        why: "Input list is 1 -> 2 -> 3 -> null.",
        result: "Ready to reverse first pointer.",
      },
    },
    {
      id: "rll-2",
      stepNumber: 2,
      codeLine: 7,
      operation: "move",
      variables: { prev: "null", curr: "Node(1)", nextNode: "Node(2)" },
      dataStructures: [
        {
          type: "linked_list",
          id: "list",
          name: "Singly Linked List",
          data: [
            { val: 1, next: null },
            { val: 2, next: 3 },
            { val: 3, next: null },
          ],
          pointers: { prev: 1, curr: 2 },
        },
      ],
      explanation: {
        what: "Reverse pointer for Node(1): 1.next = null. Advance prev = 1, curr = 2.",
        why: "Node 1 is now the tail of the new reversed list pointing to null.",
        result: "1 -> null. Next to process: Node(2).",
      },
      quizCheckpoint: {
        question:
          "Why must we store 'curr.next' in a temporary variable before changing curr.next = prev?",
        options: [
          "To avoid losing reference to the rest of the list",
          "To allocate new memory for the node",
          "To compute the length of the list",
          "It is optional; curr.next can be overwritten safely",
        ],
        correctIndex: 0,
        explanation:
          "Correct! If we overwrite curr.next first, we lose the pointer to the next node and can never reach the remainder of the list.",
      },
    },
    {
      id: "rll-3",
      stepNumber: 3,
      codeLine: 7,
      operation: "move",
      variables: { prev: "Node(2)", curr: "Node(3)", nextNode: "null" },
      dataStructures: [
        {
          type: "linked_list",
          id: "list",
          name: "Singly Linked List",
          data: [
            { val: 2, next: 1 },
            { val: 1, next: null },
            { val: 3, next: null },
          ],
          pointers: { prev: 2, curr: 3 },
        },
      ],
      explanation: {
        what: "Reverse pointer for Node(2): 2.next = 1. Advance prev = 2, curr = 3.",
        why: "Chain is now 2 -> 1 -> null.",
        result: "Node 2 successfully linked to Node 1.",
      },
    },
    {
      id: "rll-4",
      stepNumber: 4,
      codeLine: 7,
      operation: "move",
      variables: { prev: "Node(3)", curr: "null", nextNode: "null" },
      dataStructures: [
        {
          type: "linked_list",
          id: "list",
          name: "Singly Linked List",
          data: [
            { val: 3, next: 2 },
            { val: 2, next: 1 },
            { val: 1, next: null },
          ],
          pointers: { prev: 3, curr: "null" },
        },
      ],
      explanation: {
        what: "Reverse pointer for Node(3): 3.next = 2. Advance prev = 3, curr = null.",
        why: "Reached end of original list (curr is now null).",
        result: "Reversed list is 3 -> 2 -> 1 -> null.",
      },
    },
    {
      id: "rll-5",
      stepNumber: 5,
      codeLine: 12,
      operation: "return",
      variables: { returnHead: "Node(3)" },
      dataStructures: [
        {
          type: "linked_list",
          id: "list",
          name: "Reversed List Head",
          data: [
            { val: 3, next: 2 },
            { val: 2, next: 1 },
            { val: 1, next: null },
          ],
          pointers: { head: 3 },
        },
      ],
      explanation: {
        what: "Return prev (Node 3), which is the new head of the reversed list.",
        why: "In-place reversal complete with O(n) runtime and O(1) space.",
        result: "Reversed chain 3 -> 2 -> 1 -> null successfully returned.",
      },
    },
  ],
};
