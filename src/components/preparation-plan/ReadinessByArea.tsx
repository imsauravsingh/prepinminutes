"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart2,
  Sparkles,
  Database,
  Cloud,
  Code2,
  Users,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Circle,
} from "lucide-react";
import { AreaTopicsModal, type ModalTopicItem } from "./AreaTopicsModal";

type Topic = {
  num: number;
  name: string;
  type: "Reading" | "Practice";
  estTime: string;
  status: "Not Started" | "In Progress" | "Completed";
};

type AreaData = {
  id: string;
  title: string;
  description: string;
  icon: typeof Database;
  iconBg: string;
  iconColor: string;
  barColor: string;
  route: string;
  phaseStats: Record<
    string,
    { readiness: number; remaining: string; topics: Topic[] }
  >;
  allTopics: ModalTopicItem[];
};

const phaseNames: Record<string, string> = {
  "phase-1": "Foundation Building",
  "phase-2": "Skill Deepening",
  "phase-3": "Mock & Polish",
  "phase-4": "Final Review",
};

const areasData: AreaData[] = [
  {
    id: "system-design",
    title: "System Design",
    description:
      "Core architecture, scalability and distributed systems concepts.",
    icon: Database,
    iconBg: "bg-[#fff1ec]",
    iconColor: "text-[#ea580c]",
    barColor: "bg-[#ea580c]",
    route: "/practice/session/system-design",
    phaseStats: {
      "phase-1": {
        readiness: 32,
        remaining: "5 topics remaining",
        topics: [
          {
            num: 1,
            name: "Scalability Fundamentals",
            type: "Reading",
            estTime: "10 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Load Balancing Strategies",
            type: "Reading",
            estTime: "8 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Database Sharding & Partitioning",
            type: "Practice",
            estTime: "20 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "CAP Theorem & Consistency Models",
            type: "Reading",
            estTime: "10 min",
            status: "Not Started",
          },
          {
            num: 5,
            name: "Microservices vs Monoliths Architecture",
            type: "Practice",
            estTime: "25 min",
            status: "Not Started",
          },
        ],
      },
      "phase-2": {
        readiness: 48,
        remaining: "5 topics remaining",
        topics: [
          {
            num: 1,
            name: "Distributed Caching (Redis & Memcached)",
            type: "Reading",
            estTime: "15 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Message Queues & Event-Driven Architecture",
            type: "Practice",
            estTime: "25 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Distributed Transactions & Saga Pattern",
            type: "Practice",
            estTime: "30 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "CDN & Edge Computing Strategy",
            type: "Reading",
            estTime: "12 min",
            status: "Not Started",
          },
          {
            num: 5,
            name: "API Rate Limiting & Gateway Architecture",
            type: "Practice",
            estTime: "20 min",
            status: "Not Started",
          },
        ],
      },
      "phase-3": {
        readiness: 72,
        remaining: "4 topics remaining",
        topics: [
          {
            num: 1,
            name: "Full Design Mock: URL Shortener at Global Scale",
            type: "Practice",
            estTime: "35 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Full Design Mock: Video Streaming Platform (Netflix/YouTube)",
            type: "Practice",
            estTime: "45 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Full Design Mock: Real-Time Chat & Notification System",
            type: "Practice",
            estTime: "40 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "Distributed Failover & High Availability Drill",
            type: "Reading",
            estTime: "15 min",
            status: "Not Started",
          },
        ],
      },
      "phase-4": {
        readiness: 90,
        remaining: "3 topics remaining",
        topics: [
          {
            num: 1,
            name: "System Design Latency & Scale Numbers Cheat Sheet",
            type: "Reading",
            estTime: "10 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Top 10 Architecture Trade-offs Comparison",
            type: "Reading",
            estTime: "12 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Framework Walkthrough: 4-Step System Design Template",
            type: "Reading",
            estTime: "8 min",
            status: "Not Started",
          },
        ],
      },
    },
    allTopics: [
      {
        id: "sd-1",
        num: 1,
        name: "Scalability Fundamentals",
        type: "Reading",
        estTime: "10 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "sd-2",
        num: 2,
        name: "Load Balancing Strategies",
        type: "Reading",
        estTime: "8 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "sd-3",
        num: 3,
        name: "Database Sharding & Partitioning",
        type: "Practice",
        estTime: "20 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "sd-4",
        num: 4,
        name: "CAP Theorem & Consistency Models",
        type: "Reading",
        estTime: "10 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "sd-5",
        num: 5,
        name: "Microservices vs Monoliths Architecture",
        type: "Practice",
        estTime: "25 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "sd-6",
        num: 6,
        name: "Distributed Caching (Redis & Memcached)",
        type: "Reading",
        estTime: "15 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "sd-7",
        num: 7,
        name: "Message Queues & Event-Driven Architecture",
        type: "Practice",
        estTime: "25 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "sd-8",
        num: 8,
        name: "Distributed Transactions & Saga Pattern",
        type: "Practice",
        estTime: "30 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "sd-9",
        num: 9,
        name: "CDN & Edge Computing Strategy",
        type: "Reading",
        estTime: "12 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "sd-10",
        num: 10,
        name: "API Rate Limiting & Gateway Architecture",
        type: "Practice",
        estTime: "20 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "sd-11",
        num: 11,
        name: "Full Design Mock: URL Shortener at Global Scale",
        type: "Practice",
        estTime: "35 min",
        status: "Not Started",
        phase: "Mock & Polish",
      },
      {
        id: "sd-12",
        num: 12,
        name: "Full Design Mock: Video Streaming Platform (Netflix/YouTube)",
        type: "Practice",
        estTime: "45 min",
        status: "Not Started",
        phase: "Mock & Polish",
      },
      {
        id: "sd-13",
        num: 13,
        name: "Full Design Mock: Real-Time Chat & Notification System",
        type: "Practice",
        estTime: "40 min",
        status: "Not Started",
        phase: "Mock & Polish",
      },
      {
        id: "sd-14",
        num: 14,
        name: "Distributed Failover & High Availability Drill",
        type: "Reading",
        estTime: "15 min",
        status: "Not Started",
        phase: "Mock & Polish",
      },
      {
        id: "sd-15",
        num: 15,
        name: "System Design Latency & Scale Numbers Cheat Sheet",
        type: "Reading",
        estTime: "10 min",
        status: "Not Started",
        phase: "Final Review",
      },
      {
        id: "sd-16",
        num: 16,
        name: "Top 10 Architecture Trade-offs Comparison",
        type: "Reading",
        estTime: "12 min",
        status: "Not Started",
        phase: "Final Review",
      },
      {
        id: "sd-17",
        num: 17,
        name: "Framework Walkthrough: 4-Step System Design Template",
        type: "Reading",
        estTime: "8 min",
        status: "Not Started",
        phase: "Final Review",
      },
    ],
  },
  {
    id: "cloud",
    title: "Cloud",
    description:
      "Cloud architecture, distributed infrastructure, scalability and DevOps patterns.",
    icon: Cloud,
    iconBg: "bg-[#eff6ff]",
    iconColor: "text-[#3b82f6]",
    barColor: "bg-[#3b82f6]",
    route: "/practice/session/cloud",
    phaseStats: {
      "phase-1": {
        readiness: 67,
        remaining: "5 topics remaining",
        topics: [
          {
            num: 1,
            name: "Cloud Computing Core Concepts (IaaS, PaaS, Serverless)",
            type: "Reading",
            estTime: "10 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "VPC, Subnets & Network Security Groups",
            type: "Practice",
            estTime: "20 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Object Storage vs Block Storage vs File Systems",
            type: "Reading",
            estTime: "8 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "IAM Policies & Principle of Least Privilege",
            type: "Reading",
            estTime: "12 min",
            status: "Not Started",
          },
          {
            num: 5,
            name: "Compute Scaling: Auto Scaling Groups & Elastic Load Balancers",
            type: "Practice",
            estTime: "20 min",
            status: "Not Started",
          },
        ],
      },
      "phase-2": {
        readiness: 76,
        remaining: "5 topics remaining",
        topics: [
          {
            num: 1,
            name: "Container Orchestration with Kubernetes (EKS / GKE)",
            type: "Practice",
            estTime: "25 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Managed Databases: Aurora, DynamoDB & Bigtable",
            type: "Practice",
            estTime: "30 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Serverless Event-Driven Patterns with Lambda / Cloud Functions",
            type: "Practice",
            estTime: "25 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "Infrastructure as Code: Terraform & CloudFormation",
            type: "Reading",
            estTime: "15 min",
            status: "Not Started",
          },
          {
            num: 5,
            name: "Multi-Region Deployment & Disaster Recovery Models",
            type: "Reading",
            estTime: "18 min",
            status: "Not Started",
          },
        ],
      },
      "phase-3": {
        readiness: 86,
        remaining: "3 topics remaining",
        topics: [
          {
            num: 1,
            name: "Cloud System Mock: Highly Available Multi-Region Web Service",
            type: "Practice",
            estTime: "40 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Designing Secure Cloud VPC Architecture with Zero-Trust",
            type: "Practice",
            estTime: "35 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Cloud Cost Optimization & FinOps Best Practices",
            type: "Reading",
            estTime: "15 min",
            status: "Not Started",
          },
        ],
      },
      "phase-4": {
        readiness: 95,
        remaining: "2 topics remaining",
        topics: [
          {
            num: 1,
            name: "Cloud Architecture Review Checklist (Well-Architected Framework)",
            type: "Reading",
            estTime: "10 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Key Cloud Services Comparison (AWS vs GCP vs Azure)",
            type: "Reading",
            estTime: "8 min",
            status: "Not Started",
          },
        ],
      },
    },
    allTopics: [
      {
        id: "cl-1",
        num: 1,
        name: "Cloud Computing Core Concepts (IaaS, PaaS, Serverless)",
        type: "Reading",
        estTime: "10 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "cl-2",
        num: 2,
        name: "VPC, Subnets & Network Security Groups",
        type: "Practice",
        estTime: "20 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "cl-3",
        num: 3,
        name: "Object Storage vs Block Storage vs File Systems",
        type: "Reading",
        estTime: "8 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "cl-4",
        num: 4,
        name: "IAM Policies & Principle of Least Privilege",
        type: "Reading",
        estTime: "12 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "cl-5",
        num: 5,
        name: "Compute Scaling: Auto Scaling Groups & Elastic Load Balancers",
        type: "Practice",
        estTime: "20 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "cl-6",
        num: 6,
        name: "Container Orchestration with Kubernetes (EKS / GKE)",
        type: "Practice",
        estTime: "25 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "cl-7",
        num: 7,
        name: "Managed Databases: Aurora, DynamoDB & Bigtable",
        type: "Practice",
        estTime: "30 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "cl-8",
        num: 8,
        name: "Serverless Event-Driven Patterns with Lambda / Cloud Functions",
        type: "Practice",
        estTime: "25 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "cl-9",
        num: 9,
        name: "Infrastructure as Code: Terraform & CloudFormation",
        type: "Reading",
        estTime: "15 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "cl-10",
        num: 10,
        name: "Multi-Region Deployment & Disaster Recovery Models",
        type: "Reading",
        estTime: "18 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "cl-11",
        num: 11,
        name: "Cloud System Mock: Highly Available Multi-Region Web Service",
        type: "Practice",
        estTime: "40 min",
        status: "Not Started",
        phase: "Mock & Polish",
      },
      {
        id: "cl-12",
        num: 12,
        name: "Designing Secure Cloud VPC Architecture with Zero-Trust",
        type: "Practice",
        estTime: "35 min",
        status: "Not Started",
        phase: "Mock & Polish",
      },
      {
        id: "cl-13",
        num: 13,
        name: "Cloud Cost Optimization & FinOps Best Practices",
        type: "Reading",
        estTime: "15 min",
        status: "Not Started",
        phase: "Mock & Polish",
      },
      {
        id: "cl-14",
        num: 14,
        name: "Cloud Architecture Review Checklist (Well-Architected Framework)",
        type: "Reading",
        estTime: "10 min",
        status: "Not Started",
        phase: "Final Review",
      },
      {
        id: "cl-15",
        num: 15,
        name: "Key Cloud Services Comparison (AWS vs GCP vs Azure)",
        type: "Reading",
        estTime: "8 min",
        status: "Not Started",
        phase: "Final Review",
      },
    ],
  },
  {
    id: "coding-patterns",
    title: "Coding Patterns",
    description:
      "DSA patterns, algorithm optimization and problem solving techniques.",
    icon: Code2,
    iconBg: "bg-[#ecfdf5]",
    iconColor: "text-[#10b981]",
    barColor: "bg-[#10b981]",
    route: "/practice/session/coding",
    phaseStats: {
      "phase-1": {
        readiness: 78,
        remaining: "4 topics remaining",
        topics: [
          {
            num: 1,
            name: "Two Pointers & Sliding Window Fundamentals",
            type: "Practice",
            estTime: "25 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Fast & Slow Pointers (Cycle Detection)",
            type: "Practice",
            estTime: "20 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Binary Search on Unknown Search Spaces",
            type: "Practice",
            estTime: "25 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "Prefix Sums & Frequency Hashing Patterns",
            type: "Reading",
            estTime: "12 min",
            status: "Not Started",
          },
        ],
      },
      "phase-2": {
        readiness: 84,
        remaining: "5 topics remaining",
        topics: [
          {
            num: 1,
            name: "Tree & Graph Traversals: BFS / DFS in Matrix",
            type: "Practice",
            estTime: "30 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Top 'K' Elements Using Heaps & Priority Queues",
            type: "Practice",
            estTime: "25 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Dynamic Programming: Knapsack & Partition Subsets",
            type: "Practice",
            estTime: "35 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "Monotonic Stack & Next Greater Element",
            type: "Practice",
            estTime: "25 min",
            status: "Not Started",
          },
          {
            num: 5,
            name: "Trie & Prefix Tree Implementation",
            type: "Practice",
            estTime: "20 min",
            status: "Not Started",
          },
        ],
      },
      "phase-3": {
        readiness: 89,
        remaining: "3 topics remaining",
        topics: [
          {
            num: 1,
            name: "Hard Graph Pattern: Course Schedule & Topological Sort",
            type: "Practice",
            estTime: "35 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Advanced 2D Dynamic Programming: Subsequence Problems",
            type: "Practice",
            estTime: "30 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Timed Mock Coding Interview (LeetCode Hard)",
            type: "Practice",
            estTime: "45 min",
            status: "Not Started",
          },
        ],
      },
      "phase-4": {
        readiness: 96,
        remaining: "2 topics remaining",
        topics: [
          {
            num: 1,
            name: "Big-O Time & Space Complexity Reference Card",
            type: "Reading",
            estTime: "6 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Edge Cases Checklist (Empty, Duplicates, Integer Overflow)",
            type: "Reading",
            estTime: "8 min",
            status: "Not Started",
          },
        ],
      },
    },
    allTopics: [
      {
        id: "cp-1",
        num: 1,
        name: "Two Pointers & Sliding Window Fundamentals",
        type: "Practice",
        estTime: "25 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "cp-2",
        num: 2,
        name: "Fast & Slow Pointers (Cycle Detection)",
        type: "Practice",
        estTime: "20 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "cp-3",
        num: 3,
        name: "Binary Search on Unknown Search Spaces",
        type: "Practice",
        estTime: "25 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "cp-4",
        num: 4,
        name: "Prefix Sums & Frequency Hashing Patterns",
        type: "Reading",
        estTime: "12 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "cp-5",
        num: 5,
        name: "Tree & Graph Traversals: BFS / DFS in Matrix",
        type: "Practice",
        estTime: "30 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "cp-6",
        num: 6,
        name: "Top 'K' Elements Using Heaps & Priority Queues",
        type: "Practice",
        estTime: "25 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "cp-7",
        num: 7,
        name: "Dynamic Programming: Knapsack & Partition Subsets",
        type: "Practice",
        estTime: "35 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "cp-8",
        num: 8,
        name: "Monotonic Stack & Next Greater Element",
        type: "Practice",
        estTime: "25 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "cp-9",
        num: 9,
        name: "Trie & Prefix Tree Implementation",
        type: "Practice",
        estTime: "20 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "cp-10",
        num: 10,
        name: "Hard Graph Pattern: Course Schedule & Topological Sort",
        type: "Practice",
        estTime: "35 min",
        status: "Not Started",
        phase: "Mock & Polish",
      },
      {
        id: "cp-11",
        num: 11,
        name: "Advanced 2D Dynamic Programming: Subsequence Problems",
        type: "Practice",
        estTime: "30 min",
        status: "Not Started",
        phase: "Mock & Polish",
      },
      {
        id: "cp-12",
        num: 12,
        name: "Timed Mock Coding Interview (LeetCode Hard)",
        type: "Practice",
        estTime: "45 min",
        status: "Not Started",
        phase: "Mock & Polish",
      },
      {
        id: "cp-13",
        num: 13,
        name: "Big-O Time & Space Complexity Reference Card",
        type: "Reading",
        estTime: "6 min",
        status: "Not Started",
        phase: "Final Review",
      },
      {
        id: "cp-14",
        num: 14,
        name: "Edge Cases Checklist (Empty, Duplicates, Integer Overflow)",
        type: "Reading",
        estTime: "8 min",
        status: "Not Started",
        phase: "Final Review",
      },
    ],
  },
  {
    id: "behavioral",
    title: "Behavioral",
    description:
      "Leadership, cultural fit, STAR storytelling and situational questions.",
    icon: Users,
    iconBg: "bg-[#f5f3ff]",
    iconColor: "text-[#8b5cf6]",
    barColor: "bg-[#8b5cf6]",
    route: "/practice/session/behavioral",
    phaseStats: {
      "phase-1": {
        readiness: 91,
        remaining: "4 topics remaining",
        topics: [
          {
            num: 1,
            name: "STAR Method Mastery: Situation, Task, Action, Result",
            type: "Reading",
            estTime: "8 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Crafting Your 'Tell Me About Yourself' 2-Minute Narrative",
            type: "Practice",
            estTime: "15 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Brainstorming Your 5 Core Impact & Complexity Stories",
            type: "Practice",
            estTime: "20 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "Discussing Mistakes, Failures, and Retrospectives",
            type: "Reading",
            estTime: "10 min",
            status: "Not Started",
          },
        ],
      },
      "phase-2": {
        readiness: 93,
        remaining: "4 topics remaining",
        topics: [
          {
            num: 1,
            name: "Handling Disagreements with Staff Engineers & Tech Leads",
            type: "Practice",
            estTime: "18 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Demonstrating Ownership & Execution Under Pressure",
            type: "Practice",
            estTime: "20 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Balancing Tech Debt vs Business Deadlines",
            type: "Reading",
            estTime: "12 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "Mentoring Junior Engineers & Improving Team Culture",
            type: "Practice",
            estTime: "15 min",
            status: "Not Started",
          },
        ],
      },
      "phase-3": {
        readiness: 96,
        remaining: "3 topics remaining",
        topics: [
          {
            num: 1,
            name: "Senior SWE Leadership & Influence Mock Interview",
            type: "Practice",
            estTime: "30 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Deep Dive: 'Tell Me About a High-Stakes Production Outage'",
            type: "Practice",
            estTime: "25 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Navigating Organizational Politics & Conflicting Priorities",
            type: "Reading",
            estTime: "15 min",
            status: "Not Started",
          },
        ],
      },
      "phase-4": {
        readiness: 100,
        remaining: "2 topics remaining",
        topics: [
          {
            num: 1,
            name: "Quick Reference: 10 Story Prompts & Metrics to Remember",
            type: "Reading",
            estTime: "8 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "High-Signal Questions to Ask Your Google Interviewers",
            type: "Reading",
            estTime: "10 min",
            status: "Not Started",
          },
        ],
      },
    },
    allTopics: [
      {
        id: "bh-1",
        num: 1,
        name: "STAR Method Mastery: Situation, Task, Action, Result",
        type: "Reading",
        estTime: "8 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "bh-2",
        num: 2,
        name: "Crafting Your 'Tell Me About Yourself' 2-Minute Narrative",
        type: "Practice",
        estTime: "15 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "bh-3",
        num: 3,
        name: "Brainstorming Your 5 Core Impact & Complexity Stories",
        type: "Practice",
        estTime: "20 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "bh-4",
        num: 4,
        name: "Discussing Mistakes, Failures, and Retrospectives",
        type: "Reading",
        estTime: "10 min",
        status: "Not Started",
        phase: "Foundation Building",
      },
      {
        id: "bh-5",
        num: 5,
        name: "Handling Disagreements with Staff Engineers & Tech Leads",
        type: "Practice",
        estTime: "18 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "bh-6",
        num: 6,
        name: "Demonstrating Ownership & Execution Under Pressure",
        type: "Practice",
        estTime: "20 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "bh-7",
        num: 7,
        name: "Balancing Tech Debt vs Business Deadlines",
        type: "Reading",
        estTime: "12 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "bh-8",
        num: 8,
        name: "Mentoring Junior Engineers & Improving Team Culture",
        type: "Practice",
        estTime: "15 min",
        status: "Not Started",
        phase: "Skill Deepening",
      },
      {
        id: "bh-9",
        num: 9,
        name: "Senior SWE Leadership & Influence Mock Interview",
        type: "Practice",
        estTime: "30 min",
        status: "Not Started",
        phase: "Mock & Polish",
      },
      {
        id: "bh-10",
        num: 10,
        name: "Deep Dive: 'Tell Me About a High-Stakes Production Outage'",
        type: "Practice",
        estTime: "25 min",
        status: "Not Started",
        phase: "Mock & Polish",
      },
      {
        id: "bh-11",
        num: 11,
        name: "Navigating Organizational Politics & Conflicting Priorities",
        type: "Reading",
        estTime: "15 min",
        status: "Not Started",
        phase: "Mock & Polish",
      },
      {
        id: "bh-12",
        num: 12,
        name: "Quick Reference: 10 Story Prompts & Metrics to Remember",
        type: "Reading",
        estTime: "8 min",
        status: "Not Started",
        phase: "Final Review",
      },
      {
        id: "bh-13",
        num: 13,
        name: "High-Signal Questions to Ask Your Google Interviewers",
        type: "Reading",
        estTime: "10 min",
        status: "Not Started",
        phase: "Final Review",
      },
    ],
  },
];

interface ReadinessByAreaProps {
  selectedPhase?: string;
}

export function ReadinessByArea({
  selectedPhase = "phase-1",
}: ReadinessByAreaProps) {
  const [expandedArea, setExpandedArea] = useState<string | null>(
    "system-design",
  );

  // Track which area modal is open
  const [modalAreaId, setModalAreaId] = useState<string | null>(null);

  // State holding custom user prioritization sequence per area
  const [areaTopicsMap, setAreaTopicsMap] = useState<
    Record<string, ModalTopicItem[]>
  >(() => {
    const initialMap: Record<string, ModalTopicItem[]> = {};
    areasData.forEach((a) => {
      initialMap[a.id] = a.allTopics;
    });
    return initialMap;
  });

  const toggleArea = (id: string) => {
    setExpandedArea(expandedArea === id ? null : id);
  };

  const currentPhaseName = phaseNames[selectedPhase] || "Foundation Building";
  const activeModalArea = areasData.find((a) => a.id === modalAreaId);

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex items-start gap-2.5">
          <BarChart2 className="mt-0.5 size-5 text-ink shrink-0" />
          <div className="flex flex-col">
            <h2 className="font-display text-base font-extrabold text-ink sm:text-lg">
              Readiness by Area
            </h2>
            <p className="text-xs text-ink-muted">
              Showing topics tailored to{" "}
              <span className="font-semibold text-ink">{currentPhaseName}</span>
              . Topics and readiness update based on the selected timeline
              phase.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-ink-muted self-start sm:self-auto">
          <Sparkles className="size-3.5 text-[#f59e0b]" />
          <span>Completing topics will update readiness</span>
        </div>
      </div>

      {/* Accordion Categories */}
      <div className="flex w-full flex-col gap-3">
        {areasData.map((area) => {
          const isExpanded = expandedArea === area.id;
          const Icon = area.icon;
          const phaseData =
            area.phaseStats[selectedPhase] || area.phaseStats["phase-1"];
          const topics = phaseData.topics;
          const areaAllTopics = areaTopicsMap[area.id] || area.allTopics;

          return (
            <div
              key={area.id}
              className={`w-full rounded-2xl border transition-all ${
                isExpanded
                  ? "border-[#ffdecb] bg-white shadow-[0_4px_16px_rgba(30,28,26,0.04)]"
                  : "border-line bg-white shadow-[0_2px_8px_rgba(30,28,26,0.02)] hover:border-line-strong"
              }`}
            >
              {/* Clickable Card Header */}
              <button
                type="button"
                onClick={() => toggleArea(area.id)}
                className="flex w-full items-center justify-between p-4 sm:p-5 text-left focus:outline-none cursor-pointer"
                aria-expanded={isExpanded}
              >
                {/* Left side: Icon, Title, Description */}
                <div className="flex items-center gap-3.5 min-w-0 pr-4 sm:pr-8">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${area.iconBg} ${area.iconColor}`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-display text-sm sm:text-base font-extrabold text-ink">
                      {area.title}
                    </span>
                    <span className="truncate text-xs text-ink-muted sm:whitespace-normal">
                      {area.description}
                    </span>
                  </div>
                </div>

                {/* Right side: Readiness percentage, Progress bar, remaining, chevron */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-xs sm:text-sm font-extrabold text-ink">
                        {phaseData.readiness}% Ready
                      </span>
                      <div className="hidden h-2 w-28 overflow-hidden rounded-full bg-[#f4efe8] sm:block sm:w-36 lg:w-48">
                        <div
                          className={`h-full rounded-full ${area.barColor} transition-all duration-300`}
                          style={{ width: `${phaseData.readiness}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[11px] text-ink-muted">
                      {phaseData.remaining}
                    </span>
                  </div>

                  <div className="flex size-7 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-cream">
                    {isExpanded ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Nested Content (Topics Table for this Area & Phase) */}
              {isExpanded && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                  <div className="rounded-xl border border-line bg-[#fdfcfb] p-4 sm:p-5">
                    {/* Inner header */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                      <h3 className="font-display text-sm font-extrabold text-ink">
                        Topics to Cover ({topics.length})
                      </h3>
                      <span className="rounded-full bg-[#fff1ec] px-3 py-1 text-xs font-bold text-[#ea580c]">
                        Phase: {currentPhaseName}
                      </span>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-line text-ink-muted/80">
                            <th className="pb-2.5 font-medium w-8">#</th>
                            <th className="pb-2.5 font-medium">Topic</th>
                            <th className="pb-2.5 font-medium w-24">Type</th>
                            <th className="pb-2.5 font-medium w-28">
                              Est. Time
                            </th>
                            <th className="pb-2.5 font-medium w-32">Status</th>
                            <th className="pb-2.5 font-medium w-24 text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                          {topics.map((topic) => (
                            <tr
                              key={topic.num}
                              className="group hover:bg-cream/40 transition-colors"
                            >
                              <td className="py-3 font-semibold text-ink-muted font-mono">
                                {String(topic.num).padStart(2, "0")}
                              </td>
                              <td className="py-3 font-semibold text-ink">
                                {topic.name}
                              </td>
                              <td className="py-3">
                                {topic.type === "Reading" ? (
                                  <span className="inline-flex rounded border border-[#dbeafe] bg-[#eff6ff] px-2 py-0.5 text-[11px] font-semibold text-[#2563eb]">
                                    Reading
                                  </span>
                                ) : (
                                  <span className="inline-flex rounded border border-[#a7f3d0] bg-[#ecfdf5] px-2 py-0.5 text-[11px] font-semibold text-[#059669]">
                                    Practice
                                  </span>
                                )}
                              </td>
                              <td className="py-3 text-ink-muted">
                                {topic.estTime}
                              </td>
                              <td className="py-3">
                                <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-muted">
                                  <Circle className="size-3 text-ink-muted/60" />
                                  <span>{topic.status}</span>
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <Link
                                  href={`${area.route}?topic=${encodeURIComponent(topic.name)}`}
                                  className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-1 text-xs font-semibold text-ink shadow-xs transition-colors hover:border-line-strong hover:bg-cream"
                                >
                                  <span>Start</span>
                                  <ArrowRight className="size-3 text-ink" />
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Footer link opening Modal */}
                    <div className="pt-3 text-center">
                      <button
                        type="button"
                        onClick={() => setModalAreaId(area.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563eb] hover:underline cursor-pointer transition-colors"
                      >
                        <span>
                          View all {areaAllTopics.length} topics in {area.title}
                        </span>
                        <ArrowRight className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Area Topics Modal Popup with Pagination & Prioritization */}
      {activeModalArea && (
        <AreaTopicsModal
          isOpen={!!modalAreaId}
          onClose={() => setModalAreaId(null)}
          areaTitle={activeModalArea.title}
          areaIcon={activeModalArea.icon}
          areaIconBg={activeModalArea.iconBg}
          areaIconColor={activeModalArea.iconColor}
          areaRoute={activeModalArea.route}
          initialTopics={
            areaTopicsMap[activeModalArea.id] || activeModalArea.allTopics
          }
          onSaveTopicsOrder={(newOrder) => {
            setAreaTopicsMap((prev) => ({
              ...prev,
              [activeModalArea.id]: newOrder,
            }));
          }}
        />
      )}
    </div>
  );
}
