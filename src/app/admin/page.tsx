"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  Layers,
  HelpCircle,
  CheckCircle2,
  Users,
  UserCheck,
  CreditCard,
  ArrowRight,
  Database,
  Lock,
  Flame,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { backendApi } from "@/lib/api-client";

interface AdminMe {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl?: string | null;
  role: string;
  adminApprovalStatus: string;
  isRootHod: boolean;
}

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<AdminMe | null>(null);
  const [stats, setStats] = useState<{
    domains: number;
    categories: number;
    topics: { total: number; live: number; draft: number };
    questions: { total: number; live: number; draft: number };
    pendingTeamRequests: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, overviewRes] = await Promise.all([
          backendApi.getAdminMe(),
          backendApi.getNeo4jOverview().catch(() => null),
        ]);
        if (meRes.success && meRes.user) {
          setAdmin(meRes.user);
        }
        if (overviewRes?.success && overviewRes.stats) {
          setStats(overviewRes.stats);
        }
      } catch (err) {
        console.error("Failed to load admin profile or overview:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-xl">
        <div className="flex items-center space-x-4">
          {admin?.avatarUrl ? (
            <img
              src={admin.avatarUrl}
              alt={admin.fullName || "Admin"}
              className="size-14 rounded-2xl border-2 border-emerald-500/40 shadow-lg"
            />
          ) : (
            <div className="size-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-xl shadow-lg">
              S
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {admin?.fullName || "Saurav Singh"}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {admin?.role || "SUPER_ADMIN"}
              </span>
            </div>
            <p className="text-xs text-[#8b949e] font-mono mt-0.5">
              Root Head of Department • {admin?.email || "imsauravsingh@gmail.com"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/curriculum"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition flex items-center space-x-2 shadow-md shadow-emerald-900/30"
          >
            <Layers className="size-3.5" />
            <span>Manage Neo4j Graph</span>
          </Link>
          <Link
            href="/admin/team"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] transition flex items-center space-x-1.5"
          >
            <UserCheck className="size-3.5 text-amber-400" />
            <span>HOD Approvals</span>
          </Link>
        </div>
      </div>

      {/* KPI Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8b949e]">
            <span>Database Layer</span>
            <Database className="size-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">PostgreSQL</div>
          <div className="text-[11px] text-emerald-400 font-mono flex items-center space-x-1">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            <span>RBAC & Universal Block Active</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8b949e]">
            <span>Graph Taxonomy</span>
            <Layers className="size-4 text-teal-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {stats ? `${stats.categories} Categories • ${stats.topics.total} Topics` : "Neo4j AuraDB"}
          </div>
          <div className="text-[11px] text-teal-300 font-mono flex items-center space-x-1">
            <span className="size-1.5 rounded-full bg-teal-400" />
            <span>{stats ? `${stats.domains} Root Domains Live` : "Prerequisite DAG Ready"}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8b949e]">
            <span>Question Bank</span>
            <HelpCircle className="size-4 text-orange-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {stats ? `${stats.questions.total} Questions` : "Master Bank"}
          </div>
          <div className="text-[11px] text-orange-300 font-mono flex items-center space-x-1">
            <span className="size-1.5 rounded-full bg-orange-400" />
            <span>{stats ? `${stats.questions.live} Live • ${stats.questions.draft} Staging` : "Isolation Enforced"}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8b949e]">
            <span>Content Gate</span>
            <CheckCircle2 className="size-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {stats && (stats.topics.draft > 0 || stats.questions.draft > 0)
              ? `${stats.topics.draft + stats.questions.draft} Pending`
              : "0 Pending"}
          </div>
          <div className="text-[11px] text-amber-300 font-mono flex items-center space-x-1">
            <span className="size-1.5 rounded-full bg-amber-400" />
            <span>Candidate Isolation 100%</span>
          </div>
        </div>
      </div>

      {/* Operational Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Module 1: Knowledge Graph & Categories */}
        <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition group">
          <div className="space-y-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Layers className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                Curriculum Knowledge Graph
              </h2>
              <p className="text-xs text-[#8b949e] mt-1">
                Direct CRUD on Categories, Topics, and Prerequisite DAGs in Neo4j across DSA, System Design, Behavioral, and Core Language Runtimes.
              </p>
            </div>
          </div>
          <Link
            href="/admin/curriculum"
            className="flex items-center justify-between text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-2 border-t border-[#21262d]"
          >
            <span>Open Graph Manager</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Module 2: Master Question Bank */}
        <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between space-y-4 hover:border-[#ff5722]/30 transition group">
          <div className="space-y-3">
            <div className="size-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#ff5722] flex items-center justify-center">
              <HelpCircle className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white group-hover:text-[#ff5722] transition">
                Master Question Bank & Rubrics
              </h2>
              <p className="text-xs text-[#8b949e] mt-1">
                Author technical prompts, benchmark model answers, test case suites, and atomic rubric checklists for automated evaluation.
              </p>
            </div>
          </div>
          <Link
            href="/admin/questions"
            className="flex items-center justify-between text-xs font-semibold text-[#ff5722] hover:text-[#ff8a65] pt-2 border-t border-[#21262d]"
          >
            <span>Browse Question Bank</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Module 3: Staging Approvals */}
        <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition group">
          <div className="space-y-3">
            <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white group-hover:text-amber-400 transition">
                Staging Approvals Queue
              </h2>
              <p className="text-xs text-[#8b949e] mt-1">
                Inspect pending drafts submitted by staff engineers. Review side-by-side diffs and click "Approve & Push to Live" to publish.
              </p>
            </div>
          </div>
          <Link
            href="/admin/approvals"
            className="flex items-center justify-between text-xs font-semibold text-amber-400 hover:text-amber-300 pt-2 border-t border-[#21262d]"
          >
            <span>Review Pending Drafts</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Module 4: Candidate Directory & Subscriptions */}
        <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between space-y-4 hover:border-purple-500/30 transition group">
          <div className="space-y-3">
            <div className="size-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white group-hover:text-purple-400 transition">
                Candidate Directory & Plans
              </h2>
              <p className="text-xs text-[#8b949e] mt-1">
                View all registered candidates with real-time Subscription Opted (Yes/No) status, AI voice consumption, and Block Candidate actions.
              </p>
            </div>
          </div>
          <Link
            href="/admin/candidates"
            className="flex items-center justify-between text-xs font-semibold text-purple-400 hover:text-purple-300 pt-2 border-t border-[#21262d]"
          >
            <span>Open Candidate Directory</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Module 5: HOD Team Management */}
        <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between space-y-4 hover:border-blue-500/30 transition group">
          <div className="space-y-3">
            <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <UserCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                HOD Team & Staff Approvals
              </h2>
              <p className="text-xs text-[#8b949e] mt-1">
                Exclusive to HOD: review applicant reason text, grant staff roles (Manager, Engineer, Reviewer), and Block Staff Members.
              </p>
            </div>
          </div>
          <Link
            href="/admin/team"
            className="flex items-center justify-between text-xs font-semibold text-blue-400 hover:text-blue-300 pt-2 border-t border-[#21262d]"
          >
            <span>Manage Staff & Requests</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Module 6: Pricing & Usage Quotas */}
        <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition group">
          <div className="space-y-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CreditCard className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                Pricing & Quota Controls
              </h2>
              <p className="text-xs text-[#8b949e] mt-1">
                Configure subscription tier entitlements, set monthly voice minute limits, generate discount coupons, and grant customer credits.
              </p>
            </div>
          </div>
          <Link
            href="/admin/subscriptions"
            className="flex items-center justify-between text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-2 border-t border-[#21262d]"
          >
            <span>Configure Pricing & Quotas</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}

