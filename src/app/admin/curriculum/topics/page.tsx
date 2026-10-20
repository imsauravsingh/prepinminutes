"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Layers,
  ChevronLeft,
  X,
  HelpCircle,
  Check,
  Tag,
  Clock,
  Zap,
} from "lucide-react";
import { backendApi } from "@/lib/api-client";

interface Topic {
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  rubricAtoms: string[];
  durationMin: number;
  status: string;
  isLive: boolean;
  categorySlug: string;
  categoryName: string;
  domainSlug: string;
  domainName: string;
  questionCount: number;
  prerequisiteFor?: string[];
}

interface CategoryOption {
  slug: string;
  name: string;
  domainSlug: string;
}

export default function AdminTopicsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("categorySlug") || "ALL";

  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Add Topic Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTopicCategory, setNewTopicCategory] = useState("");
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicSlug, setNewTopicSlug] = useState("");
  const [newTopicDesc, setNewTopicDesc] = useState("");
  const [newTopicDifficulty, setNewTopicDifficulty] = useState("INTERMEDIATE");
  const [newTopicDuration, setNewTopicDuration] = useState(35);
  const [newTopicRubricAtoms, setNewTopicRubricAtoms] = useState<string[]>([]);
  const [newAtomInput, setNewAtomInput] = useState("");
  const [newTopicPublishImmediately, setNewTopicPublishImmediately] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Topic Modal
  const [editTopic, setEditTopic] = useState<Topic | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDifficulty, setEditDifficulty] = useState("INTERMEDIATE");
  const [editDuration, setEditDuration] = useState(30);
  const [editRubricAtoms, setEditRubricAtoms] = useState<string[]>([]);
  const [editAtomInput, setEditAtomInput] = useState("");

  async function loadData() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [topicsRes, catsRes] = await Promise.all([
        backendApi.getNeo4jTopics(),
        backendApi.getNeo4jCategories(),
      ]);

      if (topicsRes.success) {
        setTopics(topicsRes.topics);
      }
      if (catsRes.success) {
        setCategories(
          catsRes.categories.map((c) => ({
            slug: c.slug,
            name: c.name,
            domainSlug: c.domainSlug,
          }))
        );
        if (catsRes.categories.length > 0 && !newTopicCategory) {
          setNewTopicCategory(catsRes.categories[0].slug);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load topics from Neo4j.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleTitleChange(title: string) {
    setNewTopicTitle(title);
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setNewTopicSlug(generated);
  }

  function handleAddAtom() {
    const val = newAtomInput.trim();
    if (val && !newTopicRubricAtoms.includes(val)) {
      setNewTopicRubricAtoms([...newTopicRubricAtoms, val]);
      setNewAtomInput("");
    }
  }

  function handleRemoveAtom(index: number) {
    setNewTopicRubricAtoms(newTopicRubricAtoms.filter((_, i) => i !== index));
  }

  function handleAddEditAtom() {
    const val = editAtomInput.trim();
    if (val && !editRubricAtoms.includes(val)) {
      setEditRubricAtoms([...editRubricAtoms, val]);
      setEditAtomInput("");
    }
  }

  function handleRemoveEditAtom(index: number) {
    setEditRubricAtoms(editRubricAtoms.filter((_, i) => i !== index));
  }

  async function handleCreateTopic(e: React.FormEvent) {
    e.preventDefault();
    if (!newTopicCategory || !newTopicTitle || !newTopicSlug) {
      setErrorMsg("Category, Title, and Slug are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await backendApi.createNeo4jTopic({
        categorySlug: newTopicCategory,
        slug: newTopicSlug,
        title: newTopicTitle,
        description: newTopicDesc,
        difficulty: newTopicDifficulty,
        rubricAtoms: newTopicRubricAtoms,
        durationMin: Number(newTopicDuration) || 30,
        publishImmediately: newTopicPublishImmediately,
      });

      if (res.success) {
        setSuccessMsg(`Topic "${newTopicTitle}" created successfully!`);
        setShowAddModal(false);
        setNewTopicTitle("");
        setNewTopicSlug("");
        setNewTopicDesc("");
        setNewTopicRubricAtoms([]);
        await loadData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create topic.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateTopic(e: React.FormEvent) {
    e.preventDefault();
    if (!editTopic) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await backendApi.updateNeo4jTopic(editTopic.slug, {
        title: editTitle,
        description: editDesc,
        difficulty: editDifficulty,
        rubricAtoms: editRubricAtoms,
        durationMin: Number(editDuration) || 30,
      });

      if (res.success) {
        setSuccessMsg(`Topic "${editTopic.slug}" updated successfully!`);
        setEditTopic(null);
        await loadData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update topic.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteTopic(slug: string, title: string) {
    if (!confirm(`Are you sure you want to remove topic "${title}" (${slug})?`)) return;

    setErrorMsg(null);
    try {
      const res = await backendApi.deleteNeo4jTopic(slug);
      if (res.success) {
        setSuccessMsg(`Topic "${title}" removed.`);
        await loadData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete topic.");
    }
  }

  const filteredTopics = topics.filter((t) => {
    const matchesCategory = selectedCategory === "ALL" || t.categorySlug === selectedCategory;
    const matchesDifficulty = difficultyFilter === "ALL" || t.difficulty === difficultyFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "LIVE" && t.isLive) ||
      (statusFilter === "DRAFT" && (!t.isLive || t.status === "DRAFT" || t.status === "IN_REVIEW"));
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.rubricAtoms.some((atom) => atom.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesDifficulty && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="size-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shadow-md">
            <FileText className="size-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Link
                href="/admin/curriculum"
                className="text-xs text-[#8b949e] hover:text-white flex items-center space-x-1"
              >
                <ChevronLeft className="size-3.5" />
                <span>Categories</span>
              </Link>
              <span className="text-xs text-[#8b949e]">/</span>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Topics & Rubric Atoms Editor
              </h1>
            </div>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Configure atomic diagnostic rubric checklists, expected competency signals, and prerequisite links.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/questions"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#c9d1d9] bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] transition flex items-center space-x-1.5"
          >
            <span>Question Bank</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 transition flex items-center space-x-1.5 shadow-md shadow-teal-900/30"
          >
            <Plus className="size-4" />
            <span>Add Topic</span>
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

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-[#161b22] border border-[#30363d]">
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-2.5 size-4 text-[#8b949e]" />
          <input
            type="text"
            placeholder="Search topics or rubric tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Category Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-[#8b949e]">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-teal-500 max-w-[180px]"
            >
              <option value="ALL">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-[#8b949e]">Difficulty:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-teal-500"
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
              className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Status</option>
              <option value="LIVE">Live</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Topics List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#8b949e] font-mono">
          Loading topics & rubric atoms...
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#161b22] border border-[#30363d] text-center space-y-2">
          <FileText className="size-8 text-[#8b949e] mx-auto opacity-40" />
          <div className="text-sm font-semibold text-white">No topics found</div>
          <p className="text-xs text-[#8b949e]">
            {searchQuery
              ? `No topics matching "${searchQuery}"`
              : "Try adjusting your category or difficulty filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTopics.map((topic) => (
            <div
              key={topic.slug}
              className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-teal-500/40 transition space-y-3 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      topic.difficulty === "ADVANCED"
                        ? "bg-red-500/15 text-red-400 border border-red-500/30"
                        : topic.difficulty === "BEGINNER"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {topic.difficulty}
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {topic.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      topic.isLive
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {topic.isLive ? "LIVE" : "DRAFT"}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-[#8b949e]">
                  <span className="flex items-center space-x-1">
                    <Clock className="size-3.5 text-[#8b949e]" />
                    <span>{topic.durationMin}m prep</span>
                  </span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#0d1117] border border-[#30363d]">
                    {topic.categoryName}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#8b949e]">
                {topic.description || "No topic description."}
              </p>

              {/* Rubric Checklist Atoms Tags */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#c9d1d9]">
                  <Tag className="size-3 text-teal-400" />
                  <span>Rubric Checklist Atoms ({topic.rubricAtoms.length}):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {topic.rubricAtoms.map((atom, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#21262d] text-teal-300 border border-[#30363d] flex items-center space-x-1 shadow-sm"
                    >
                      <Check className="size-3 text-teal-400" />
                      <span>{atom}</span>
                    </span>
                  ))}
                  {topic.rubricAtoms.length === 0 && (
                    <span className="text-[11px] text-[#8b949e] italic">
                      No rubric atoms assigned. Add atoms to enable rubric-based scoring.
                    </span>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-[#21262d] flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs">
                  <Link
                    href={`/admin/questions?topicSlug=${topic.slug}`}
                    className="font-semibold text-teal-400 hover:text-teal-300 flex items-center space-x-1"
                  >
                    <HelpCircle className="size-3.5" />
                    <span>{topic.questionCount} Questions</span>
                  </Link>
                  <code className="text-[10px] font-mono text-[#8b949e] bg-[#0d1117] px-1.5 py-0.5 rounded">
                    slug: {topic.slug}
                  </code>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setEditTopic(topic);
                      setEditTitle(topic.title);
                      setEditDesc(topic.description || "");
                      setEditDifficulty(topic.difficulty || "INTERMEDIATE");
                      setEditDuration(topic.durationMin || 30);
                      setEditRubricAtoms(topic.rubricAtoms || []);
                    }}
                    className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] transition"
                    title="Edit Topic"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTopic(topic.slug, topic.title)}
                    className="p-1.5 rounded-lg text-[#8b949e] hover:text-red-400 hover:bg-red-950/30 transition"
                    title="Delete Topic"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Topic */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-[#161b22] border border-[#30363d] p-6 shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="size-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Add Curriculum Topic</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8b949e] hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Parent Category
                </label>
                <select
                  value={newTopicCategory}
                  onChange={(e) => setNewTopicCategory(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Topic Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Garbage Collection Generational Architecture"
                  value={newTopicTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Topic Slug
                </label>
                <input
                  type="text"
                  value={newTopicSlug}
                  onChange={(e) => setNewTopicSlug(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs font-mono text-teal-400 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={newTopicDifficulty}
                    onChange={(e) => setNewTopicDifficulty(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={newTopicDuration}
                    onChange={(e) => setNewTopicDuration(Number(e.target.value))}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Key concepts, underlying mechanisms, and candidate takeaways..."
                  value={newTopicDesc}
                  onChange={(e) => setNewTopicDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Rubric Atoms Tag Builder */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#8b949e]">
                  Rubric Checklist Atoms (Evaluation Criteria)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. Generational heap layout"
                    value={newAtomInput}
                    onChange={(e) => setNewAtomInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAtom();
                      }
                    }}
                    className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddAtom}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] transition"
                  >
                    Add Atom
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {newTopicRubricAtoms.map((atom, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs bg-teal-950/40 text-teal-300 border border-teal-800/60 flex items-center space-x-1.5"
                    >
                      <span>{atom}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAtom(idx)}
                        className="text-teal-400 hover:text-red-400"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="topicPublishImmediately"
                  checked={newTopicPublishImmediately}
                  onChange={(e) => setNewTopicPublishImmediately(e.target.checked)}
                  className="rounded border-[#30363d] text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="topicPublishImmediately" className="text-xs text-[#c9d1d9] select-none">
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Topic"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Topic */}
      {editTopic && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-[#161b22] border border-[#30363d] p-6 shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit2 className="size-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Edit Topic</h3>
              </div>
              <button
                onClick={() => setEditTopic(null)}
                className="text-[#8b949e] hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Topic Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={editDifficulty}
                    onChange={(e) => setEditDifficulty(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={editDuration}
                    onChange={(e) => setEditDuration(Number(e.target.value))}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Description
                </label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Rubric Atoms Tag Builder */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#8b949e]">
                  Rubric Checklist Atoms (Evaluation Criteria)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. Happens-before order"
                    value={editAtomInput}
                    onChange={(e) => setEditAtomInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddEditAtom();
                      }
                    }}
                    className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddEditAtom}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] transition"
                  >
                    Add Atom
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {editRubricAtoms.map((atom, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs bg-teal-950/40 text-teal-300 border border-teal-800/60 flex items-center space-x-1.5"
                    >
                      <span>{atom}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEditAtom(idx)}
                        className="text-teal-400 hover:text-red-400"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setEditTopic(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8b949e] hover:text-white hover:bg-[#21262d] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

