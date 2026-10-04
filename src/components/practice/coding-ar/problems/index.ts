import { ARProblem } from "../types";
import { maxSumSubarrayProblem } from "./maxSumSubarray";
import { twoSumProblem } from "./twoSum";
import { binarySearchProblem } from "./binarySearch";
import { validParenthesesProblem } from "./validParentheses";
import { reverseLinkedListProblem } from "./reverseLinkedList";
import { longestSubstringProblem } from "./longestSubstring";
import { mergeSortedListsProblem } from "./mergeSortedLists";
import { binaryTreeInorderProblem } from "./binaryTreeInorder";
import { bfsTraversalProblem } from "./bfsTraversal";
import { dfsTraversalProblem } from "./dfsTraversal";

export const ALL_AR_PROBLEMS: ARProblem[] = [
  maxSumSubarrayProblem,
  twoSumProblem,
  binarySearchProblem,
  validParenthesesProblem,
  reverseLinkedListProblem,
  longestSubstringProblem,
  mergeSortedListsProblem,
  binaryTreeInorderProblem,
  bfsTraversalProblem,
  dfsTraversalProblem,
];

export function getARProblem(id?: string): ARProblem {
  if (!id) return maxSumSubarrayProblem;
  const found = ALL_AR_PROBLEMS.find((p) => p.id === id);
  return found || maxSumSubarrayProblem;
}
