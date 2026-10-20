"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  X,
  Lightbulb,
  FileCode,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
import { backendApi } from "@/lib/api-client";
import { AdminPagination } from "@/components/admin/AdminPagination";

interface Question {
  id: string;
  title: string;
  prompt: string;
  difficulty: string;
  rubricGuide: string;
  hints: string[];
  status: string;
  isLive: boolean;
  version: number;
  topicSlug: string;
  topicTitle: string;
  categorySlug: string;
  categoryName: string;
}

interface TopicOption {
  slug: string;
  title: string;
  categoryName: string;
}

export default function AdminQuestionsPage() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topicSlug") || "ALL";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Add Question Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQTopic, setNewQTopic] = useState("");
  const [newQTitle, setNewQTitle] = useState("");
  const [newQPrompt, setNewQPrompt] = useState("");
  const [newQDifficulty, setNewQDifficulty] = useState("INTERMEDIATE");
  const [newQRubricGuide, setNewQRubricGuide] = useState("");
  const [newQHints, setNewQHints] = useState<string[]>([]);
  const [newHintInput, setNewHintInput] = useState("");
  const [newQPublishImmediately, setNewQPublishImmediately] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Question Modal
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [editDifficulty, setEditDifficulty] = useState("INTERMEDIATE");
  const [editRubricGuide, setEditRubricGuide] = useState("");
  const [editHints, setEditHints] = useState<string[]>([]);
  const [editHintInput, setEditHintInput] = useState("");

  async function loadData() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [qRes, topicsRes] = await Promise.all([
        backendApi.getNeo4jQuestions(),
        backendApi.getNeo4jTopics(),
      ]);

      if (qRes.success) {
        setQuestions(qRes.questions);
      }
      if (topicsRes.success) {
        setTopics(
          topicsRes.topics.map((t) => ({
            slug: t.slug,
            title: t.title,
            categoryName: t.categoryName,
          }))
        );
        if (topicsRes.topics.length > 0 && !newQTopic) {
          setNewQTopic(topicsRes.topics[0].slug);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load questions from Neo4j.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTopic, difficultyFilter, statusFilter, searchQuery]);

  function handleAddHint() {
    const val = newHintInput.trim();
    if (val) {
      setNewQHints([...newQHints, val]);
      setNewHintInput("");
    }
  }

  function handleRemoveHint(idx: number) {
    setNewQHints(newQHints.filter((_, i) => i !== idx));
  }

  function handleAddEditHint() {
    const val = editHintInput.trim();
    if (val) {
      setEditHints([...editHints, val]);
      setEditHintInput("");
    }
  }

  function handleRemoveEditHint(idx: number) {
    setEditHints(editHints.filter((_, i) => i !== idx));
  }

  async function handleCreateQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!newQTopic || !newQTitle || !newQPrompt) {
      setErrorMsg("Topic, Title, and Prompt are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await backendApi.createNeo4jQuestion({
        topicSlug: newQTopic,
        title: newQTitle,
        prompt: newQPrompt,
        difficulty: newQDifficulty,
        rubricGuide: newQRubricGuide,
        hints: newQHints,
        publishImmediately: newQPublishImmediately,
      });

      if (res.success) {
        setSuccessMsg(`Question "${newQTitle}" created successfully!`);
        setShowAddModal(false);
        setNewQTitle("");
        setNewQPrompt("");
        setNewQRubricGuide("");
        setNewQHints([]);
        await loadData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create question.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!editQuestion) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await backendApi.updateNeo4jQuestion(editQuestion.id, {
        title: editTitle,
        prompt: editPrompt,
        difficulty: editDifficulty,
        rubricGuide: editRubricGuide,
        hints: editHints,
      });

      if (res.success) {
        setSuccessMsg(`Question updated and version bumped to v${editQuestion.version + 1}!`);
        setEditQuestion(null);
        await loadData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update question.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteQuestion(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete question "${title}" (${id})?`)) return;

    setErrorMsg(null);
    try {
      const res = await backendApi.deleteNeo4jQuestion(id);
      if (res.success) {
        setSuccessMsg(`Question "${title}" deleted.`);
        await loadData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete question.");
    }
  }

  const filteredQuestions = questions.filter((q) => {
    const matchesTopic = selectedTopic === "ALL" || q.topicSlug === selectedTopic;
    const matchesDifficulty = difficultyFilter === "ALL" || q.difficulty === difficultyFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "LIVE" && q.isLive) ||
      (statusFilter === "DRAFT" && (!q.isLive || q.status === "DRAFT" || q.status === "IN_REVIEW"));
    const matchesSearch =
      !searchQuery ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesDifficulty && matchesStatus && matchesSearch;
  });

  const paginatedQuestions = filteredQuestions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="size-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#ff5722] flex items-center justify-center shadow-md">
            <HelpCircle className="size-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Link
                href="/admin/curriculum/topics"
                className="text-xs text-[#8b949e] hover:text-white flex items-center space-x-1"
              >
                <ChevronLeft className="size-3.5" />
                <span>Topics</span>
              </Link>
              <span className="text-xs text-[#8b949e]">/</span>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Master Question Bank
              </h1>
            </div>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Curate benchmark diagnostic questions, technical prompts, evaluation rubrics, and hint progressions.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/approvals"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#c9d1d9] bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] transition flex items-center space-x-1.5"
          >
            <span>Staging Queue</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-orange-600 to-[#ff5722] hover:from-orange-500 hover:to-orange-400 transition flex items-center space-x-1.5 shadow-md shadow-orange-900/30"
          >
            <Plus className="size-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Notices */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="size-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-[#161b22] border border-[#30363d]">
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-2.5 size-4 text-[#8b949e]" />
          <input
            type="text"
            placeholder="Search prompt, title, id..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Topic Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-[#8b949e]">Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-orange-500 max-w-[200px]"
            >
              <option value="ALL">All Topics ({topics.length})</option>
              {topics.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-[#8b949e]">Level:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-[#8b949e]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Status</option>
              <option value="LIVE">Live</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#8b949e] font-mono">
          Loading benchmark questions from Neo4j...
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#161b22] border border-[#30363d] text-center space-y-2">
          <HelpCircle className="size-8 text-[#8b949e] mx-auto opacity-40" />
          <div className="text-sm font-semibold text-white">No questions found</div>
          <p className="text-xs text-[#8b949e]">
            {searchQuery
              ? `No questions matching "${searchQuery}"`
              : "Try adjusting your filters or click Add Question above."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedQuestions.map((q) => (
            <div
              key={q.id}
              className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-orange-500/40 transition space-y-4 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      q.difficulty === "ADVANCED"
                        ? "bg-red-500/15 text-red-400 border border-red-500/30"
                        : q.difficulty === "BEGINNER"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {q.title}
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono text-[#8b949e] bg-[#0d1117] border border-[#30363d]">
                    v{q.version}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      q.isLive
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {q.isLive ? "LIVE" : "DRAFT"}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs text-[#8b949e]">
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#0d1117] border border-[#30363d]">
                    {q.categoryName} &gt; {q.topicTitle}
                  </span>
                </div>
              </div>

              {/* Prompt Body */}
              <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#21262d] text-xs text-[#e6edf3] font-sans leading-relaxed">
                {q.prompt}
              </div>

              {/* Rubric Guide & Hints */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {q.rubricGuide && (
                  <div className="p-3 rounded-xl bg-[#1c2128] border border-[#30363d] space-y-1">
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1">
                      <Sparkles className="size-3" />
                      <span>Benchmark Rubric Guide:</span>
                    </span>
                    <p className="text-[#8b949e] leading-snug">{q.rubricGuide}</p>
                  </div>
                )}

                {q.hints && q.hints.length > 0 && (
                  <div className="p-3 rounded-xl bg-[#1c2128] border border-[#30363d] space-y-1">
                    <span className="text-[11px] font-semibold text-amber-400 flex items-center space-x-1">
                      <Lightbulb className="size-3" />
                      <span>Progressive Hints ({q.hints.length}):</span>
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[#8b949e]">
                      {q.hints.map((hint, i) => (
                        <li key={i} className="leading-snug">
                          {hint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#21262d] flex items-center justify-between text-xs">
                <code className="text-[10px] font-mono text-[#8b949e] bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">
                  id: {q.id}
                </code>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setEditQuestion(q);
                      setEditTitle(q.title);
                      setEditPrompt(q.prompt);
                      setEditDifficulty(q.difficulty);
                      setEditRubricGuide(q.rubricGuide || "");
                      setEditHints(q.hints || []);
                    }}
                    className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] transition"
                    title="Edit Question"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id, q.title)}
                    className="p-1.5 rounded-lg text-[#8b949e] hover:text-red-400 hover:bg-red-950/30 transition"
                    title="Delete Question"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && filteredQuestions.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalItems={filteredQuestions.length}
          pageSize={pageSize}
          onPageChange={(p) => setCurrentPage(p)}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setCurrentPage(1);
          }}
          pageSizeOptions={[10, 25, 50]}
          itemLabel="questions"
        />
      )}

      {/* Modal: Add Question */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-[#161b22] border border-[#30363d] p-6 shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HelpCircle className="size-5 text-[#ff5722]" />
                <h3 className="text-base font-bold text-white">Add Diagnostic Question</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8b949e] hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Parent Topic
                </label>
                <select
                  value={newQTopic}
                  onChange={(e) => setNewQTopic(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  {topics.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.categoryName} — {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Question Title / Scenario
                </label>
                <input
                  type="text"
                  placeholder="e.g. Design a Real-Time Distributed Rate Limiter"
                  value={newQTitle}
                  onChange={(e) => setNewQTitle(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Difficulty Level
                </label>
                <select
                  value={newQDifficulty}
                  onChange={(e) => setNewQDifficulty(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Technical Prompt (Exact text candidate hears / reads)
                </label>
                <textarea
                  placeholder="Write the comprehensive prompt, technical scenario, and expectations..."
                  value={newQPrompt}
                  onChange={(e) => setNewQPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Rubric Guide (Target answer criteria for AI evaluator)
                </label>
                <textarea
                  placeholder="What key architectural terms, algorithms, or trade-offs must candidate state?"
                  value={newQRubricGuide}
                  onChange={(e) => setNewQRubricGuide(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Hints Editor */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#8b949e]">
                  Progressive Hints (Triggered if candidate struggles)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. Compare sliding window counter with token bucket."
                    value={newHintInput}
                    onChange={(e) => setNewHintInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddHint();
                      }
                    }}
                    className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddHint}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] transition"
                  >
                    Add Hint
                  </button>
                </div>

                <div className="space-y-1.5 pt-1">
                  {newQHints.map((hint, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg text-xs bg-amber-950/30 text-amber-300 border border-amber-800/50 flex items-center justify-between space-x-2"
                    >
                      <span>Hint {idx + 1}: {hint}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHint(idx)}
                        className="text-amber-400 hover:text-red-400"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="qPublishImmediately"
                  checked={newQPublishImmediately}
                  onChange={(e) => setNewQPublishImmediately(e.target.checked)}
                  className="rounded border-[#30363d] text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="qPublishImmediately" className="text-xs text-[#c9d1d9] select-none">
                  Publish Immediately (HOD / Super Admin override)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8b949e] hover:text-white hover:bg-[#21262d] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#ff5722] hover:bg-orange-500 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Question */}
      {editQuestion && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-[#161b22] border border-[#30363d] p-6 shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit2 className="size-5 text-[#ff5722]" />
                <h3 className="text-base font-bold text-white">
                  Edit Question (v{editQuestion.version} &rarr; v{editQuestion.version + 1})
                </h3>
              </div>
              <button
                onClick={() => setEditQuestion(null)}
                className="text-[#8b949e] hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Difficulty Level
                </label>
                <select
                  value={editDifficulty}
                  onChange={(e) => setEditDifficulty(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Technical Prompt
                </label>
                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Rubric Guide
                </label>
                <textarea
                  value={editRubricGuide}
                  onChange={(e) => setEditRubricGuide(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Hints Editor */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#8b949e]">
                  Progressive Hints
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add hint..."
                    value={editHintInput}
                    onChange={(e) => setEditHintInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddEditHint();
                      }
                    }}
                    className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddEditHint}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] transition"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 pt-1">
                  {editHints.map((hint, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg text-xs bg-amber-950/30 text-amber-300 border border-amber-800/50 flex items-center justify-between space-x-2"
                    >
                      <span>Hint {idx + 1}: {hint}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEditHint(idx)}
                        className="text-amber-400 hover:text-red-400"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setEditQuestion(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8b949e] hover:text-white hover:bg-[#21262d] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#ff5722] hover:bg-orange-500 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save & Bump Version"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

