import { ARProblem } from "../types";

export const mergeSortedListsProblem: ARProblem = {
  id: "merge-sorted-lists",
  title: "Merge Two Sorted Lists",
  difficulty: "Easy",
  pattern: "Linked List (Two Pointers / Dummy Head)",
  summary:
    "Merge two sorted linked lists and return it as a single sorted list. The list should be made by splicing together the nodes of the first two lists.",
  intuition:
    "Use a dummy head node and a current pointer. Compare the values at list1 and list2. Attach the smaller node to current.next and advance that list's pointer. Once one list is exhausted, attach the remainder of the other list.",
  approach: [
    "Create a dummy head node and set tail = dummy.",
    "While both list1 and list2 are not null:",
    "  Compare list1.val with list2.val.",
    "  If list1.val <= list2.val: tail.next = list1, list1 = list1.next.",
    "  Else: tail.next = list2, list2 = list2.next.",
    "  Advance tail = tail.next.",
    "Attach whichever list is non-empty: tail.next = list1 || list2.",
    "Return dummy.next.",
  ],
  takeaway:
    "A dummy head node eliminates edge cases for initializing the merged list head.",
  initialCodeJS: `function mergeTwoLists(l1, l2) {
  // your code here
}`,
  initialCodePY: `def merge_two_lists(l1, l2):
    # your code here
    pass`,
  recommendedCodeJS: `function mergeTwoLists(l1, l2) {
  const dummy = { val: -1, next: null };
  let tail = dummy;

  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      tail.next = l1;
      l1 = l1.next;
    } else {
      tail.next = l2;
      l2 = l2.next;
    }
    tail = tail.next;
  }

  tail.next = l1 !== null ? l1 : l2;
  return dummy.next;
}`,
  recommendedCodePY: `def merge_two_lists(l1, l2):
    dummy = ListNode(-1)
    tail = dummy

    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next

    tail.next = l1 if l1 else l2
    return dummy.next`,
  complexity: {
    timeComplexity: "O(n + m)",
    timeExplanation:
      "Every step does an O(1) comparison and appends one node. The loop runs at most n + m times where n and m are list lengths.",
    timeElements: [
      {
        label: "Node Comparisons",
        count: "n + m iterations",
        description: "Compares values from list1 and list2",
      },
      {
        label: "Pointer Updates",
        count: "O(1) per node",
        description: "Splicing existing node references",
      },
    ],
    spaceComplexity: "O(1)",
    spaceExplanation:
      "No new nodes are allocated. We splice existing list nodes using only reference pointers (dummy, tail).",
    spaceElements: [
      {
        label: "Pointers",
        usage: "2 references",
        description: "dummy and tail pointer",
      },
    ],
  },
  executionSteps: [
    {
      id: "step-1",
      stepNumber: 1,
      codeLine: 2,
      operation: "insert",
      variables: { l1: 1, l2: 1, tail: "dummy(-1)" },
      dataStructures: [
        {
          type: "linked_list",
          id: "merged",
          name: "Merged List",
          data: [{ val: -1, next: null }],
          pointers: { tail: 0 },
        },
      ],
      explanation: {
        what: "Initialize dummy head (-1) and set tail pointer to dummy.",
        why: "A dummy sentinel node simplifies splicing by avoiding null checks on the initial head.",
        result: "dummy created, tail references dummy.",
      },
    },
    {
      id: "step-2",
      stepNumber: 2,
      codeLine: 5,
      operation: "compare",
      variables: { "l1.val": 1, "l2.val": 1, tail: "dummy(-1)" },
      dataStructures: [
        {
          type: "linked_list",
          id: "merged",
          name: "Merged List",
          data: [{ val: -1, next: null }],
          pointers: { tail: 0 },
        },
      ],
      explanation: {
        what: "Compare l1.val (1) and l2.val (1).",
        why: "Since 1 <= 1, attach l1 node to tail.next.",
        result: "tail.next set to l1 (1). l1 advances to 2.",
      },
      quizCheckpoint: {
        question:
          "Why is the dummy head technique advantageous when merging sorted linked lists?",
        options: [
          "It avoids special conditional logic for setting the first head node",
          "It decreases time complexity from O(n) to O(1)",
          "It automatically sorts the list without comparisons",
          "It allows backward traversal in a singly linked list",
        ],
        correctIndex: 0,
        explanation:
          "The dummy head node acts as a fixed anchor, so you never need a special 'if head === null' branch when appending the first node.",
      },
    },
    {
      id: "step-3",
      stepNumber: 3,
      codeLine: 10,
      operation: "move",
      variables: { "l1.val": 2, "l2.val": 1, tail: 1 },
      dataStructures: [
        {
          type: "linked_list",
          id: "merged",
          name: "Merged List",
          data: [
            { val: -1, next: 1 },
            { val: 1, next: null },
          ],
          pointers: { tail: 1 },
        },
      ],
      explanation: {
        what: "Advance tail pointer to node 1.",
        why: "Tail must always point to the last node in the merged chain.",
        result: "tail is now at node 1.",
      },
    },
    {
      id: "step-4",
      stepNumber: 4,
      codeLine: 5,
      operation: "compare",
      variables: { "l1.val": 2, "l2.val": 1, tail: 1 },
      dataStructures: [
        {
          type: "linked_list",
          id: "merged",
          name: "Merged List",
          data: [
            { val: -1, next: 1 },
            { val: 1, next: null },
          ],
          pointers: { tail: 1 },
        },
      ],
      explanation: {
        what: "Compare l1.val (2) and l2.val (1).",
        why: "l2.val (1) < l1.val (2), so attach l2 to tail.next.",
        result: "tail.next set to l2 (1). l2 advances to 3.",
      },
    },
    {
      id: "step-5",
      stepNumber: 5,
      codeLine: 10,
      operation: "move",
      variables: { "l1.val": 2, "l2.val": 3, tail: 1 },
      dataStructures: [
        {
          type: "linked_list",
          id: "merged",
          name: "Merged List",
          data: [
            { val: 1, next: 1 },
            { val: 1, next: null },
          ],
          pointers: { tail: 1 },
        },
      ],
      explanation: {
        what: "Advance tail pointer to node 1 (from l2).",
        why: "Keep tail at the current end of the merged list.",
        result: "tail updated to node 1.",
      },
    },
    {
      id: "step-6",
      stepNumber: 6,
      codeLine: 5,
      operation: "compare",
      variables: { "l1.val": 2, "l2.val": 3, tail: 1 },
      dataStructures: [
        {
          type: "linked_list",
          id: "merged",
          name: "Merged List",
          data: [
            { val: 1, next: 1 },
            { val: 1, next: 2 },
            { val: 2, next: null },
          ],
          pointers: { tail: 2 },
        },
      ],
      explanation: {
        what: "Compare l1.val (2) and l2.val (3).",
        why: "2 <= 3, attach l1 node 2 to tail.",
        result: "tail.next points to node 2. l1 advances to 4.",
      },
    },
    {
      id: "step-7",
      stepNumber: 7,
      codeLine: 13,
      operation: "insert",
      variables: { l1: 4, l2: 3, tail: 2 },
      dataStructures: [
        {
          type: "linked_list",
          id: "merged",
          name: "Merged List",
          data: [
            { val: 1, next: 1 },
            { val: 1, next: 2 },
            { val: 2, next: 3 },
            { val: 3, next: 4 },
            { val: 4, next: null },
          ],
          pointers: { tail: 4 },
        },
      ],
      explanation: {
        what: "Remaining nodes from l2 (3) and l1 (4) are appended sequentially.",
        why: "Once either list is exhausted or remaining items sorted, attach remaining chain in O(1).",
        result: "Final merged sorted list: [1 -> 1 -> 2 -> 3 -> 4].",
      },
    },
    {
      id: "step-8",
      stepNumber: 8,
      codeLine: 14,
      operation: "return",
      variables: { result: "dummy.next (head at 1)" },
      dataStructures: [
        {
          type: "linked_list",
          id: "merged",
          name: "Merged List",
          data: [
            { val: 1, next: 1 },
            { val: 1, next: 2 },
            { val: 2, next: 3 },
            { val: 3, next: 4 },
            { val: 4, next: null },
          ],
          pointers: { head: 0 },
        },
      ],
      explanation: {
        what: "Return dummy.next.",
        why: "dummy was our anchor; dummy.next points directly to the real sorted head.",
        result: "Merged sorted list returned: 1 -> 1 -> 2 -> 3 -> 4.",
      },
    },
  ],
};
