"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { backendApi } from "@/lib/api-client";
import { AdminPagination } from "@/components/admin/AdminPagination";

interface Domain {
  slug: string;
  name: string;
  description: string;
  categoryCount: number;
}

interface Category {
  slug: string;
  name: string;
  description: string;
  status: string;
  isLive: boolean;
  domainSlug: string;
  domainName: string;
  topicCount: number;
}

export default function AdminCurriculumPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State: Create Category
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatDomain, setNewCatDomain] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatPublishImmediately, setNewCatPublishImmediately] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State: Edit Category
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Merge live Neo4j domains with canonical roadmap domains
  const displayDomains = React.useMemo(() => {
    const liveMap = new Map(domains.map((d) => [d.slug, d]));
    const list: Array<{ slug: string; name: string; categoryCount: number; isLive: boolean }> = [];

    // Add all live domains from Neo4j
    for (const d of domains) {
      list.push({
        slug: d.slug,
        name: d.name,
        categoryCount: d.categoryCount,
        isLive: true,
      });
    }

    // Add canonical planned domains if not already live
    const planned = [
      { slug: "low-level-design", name: "Low-Level Design (LLD)" },
      { slug: "dsa", name: "Data Structures & Algorithms (DSA)" },
      { slug: "backend-engineering", name: "Backend & Runtime Engineering" },
      { slug: "frontend-engineering", name: "Frontend & Web Architecture" },
      { slug: "cloud-devops", name: "Cloud, DevOps & SRE" },
      { slug: "behavioral-leadership", name: "Behavioral & Leadership" },
      { slug: "data-engineering", name: "Data Engineering & Big Data" },
      { slug: "mobile-engineering", name: "Mobile Engineering" },
    ];

    for (const p of planned) {
      if (!liveMap.has(p.slug)) {
        list.push({
          slug: p.slug,
          name: p.name,
          categoryCount: 0,
          isLive: false,
        });
      }
    }

    return list;
  }, [domains]);

  async function loadData() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [domainsRes, catsRes] = await Promise.all([
        backendApi.getNeo4jDomains(),
        backendApi.getNeo4jCategories(),
      ]);

      if (domainsRes.success) {
        setDomains(domainsRes.domains);
        if (domainsRes.domains.length > 0 && !newCatDomain) {
          setNewCatDomain(domainsRes.domains[0].slug);
        }
      }
      if (catsRes.success) {
        setCategories(catsRes.categories);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load curriculum data from Neo4j.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDomain, statusFilter, searchQuery]);

  function handleNameChange(name: string) {
    setNewCatName(name);
    // Auto-generate slug
    const generated = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setNewCatSlug(generated);
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCatDomain || !newCatName || !newCatSlug) {
      setErrorMsg("Please fill in domain, category name, and slug.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await backendApi.createNeo4jCategory({
        domainSlug: newCatDomain,
        slug: newCatSlug,
        name: newCatName,
        description: newCatDesc,
        publishImmediately: newCatPublishImmediately,
      });

      if (res.success) {
        setSuccessMsg(`Category "${newCatName}" created successfully!`);
        setShowAddModal(false);
        setNewCatName("");
        setNewCatSlug("");
        setNewCatDesc("");
        await loadData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create category.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!editCategory) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await backendApi.updateNeo4jCategory(editCategory.slug, {
        name: editName,
        description: editDesc,
      });

      if (res.success) {
        setSuccessMsg(`Category "${editCategory.slug}" updated successfully!`);
        setEditCategory(null);
        await loadData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update category.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteCategory(slug: string, name: string) {
    if (!confirm(`Are you sure you want to delete category "${name}" (${slug})?`)) return;

    setErrorMsg(null);
    try {
      const res = await backendApi.deleteNeo4jCategory(slug);
      if (res.success) {
        setSuccessMsg(`Category "${name}" removed.`);
        await loadData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete category.");
    }
  }

  const filteredCategories = categories.filter((cat) => {
    const matchesDomain = selectedDomain === "ALL" || cat.domainSlug === selectedDomain;
    const matchesStatus =
      statusFilter === "ALL" ||
      ((statusFilter === "LIVE" || statusFilter === "PUBLISHED") && (cat.isLive || cat.status === "PUBLISHED")) ||
      (statusFilter === "DRAFT" && (!cat.isLive || cat.status === "DRAFT" || cat.status === "IN_REVIEW"));
    const matchesSearch =
      !searchQuery ||
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesStatus && matchesSearch;
  });

  const paginatedCategories = filteredCategories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-md">
            <Layers className="size-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Knowledge Graph — Category Manager
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Neo4j AuraDB
              </span>
            </div>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Manage core learning tracks, language runtimes, system architectures, and topic hierarchies.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/curriculum/topics"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#c9d1d9] bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] transition flex items-center space-x-1.5"
          >
            <span>All Topics & Rubrics</span>
            <ChevronRight className="size-3.5" />
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition flex items-center space-x-1.5 shadow-md shadow-emerald-900/30"
          >
            <Plus className="size-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Alert Notices */}
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

      {/* Domain Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => setSelectedDomain("ALL")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap ${
            selectedDomain === "ALL"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
              : "bg-[#161b22] text-[#8b949e] hover:text-white border border-[#30363d]"
          }`}
        >
          All Domains ({categories.length} categories)
        </button>
        {domains.map((d) => (
          <button
            key={d.slug}
            onClick={() => setSelectedDomain(d.slug)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center space-x-1.5 ${
              selectedDomain === d.slug
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "bg-[#161b22] text-[#8b949e] hover:text-white border border-[#30363d]"
            }`}
          >
            <span>{d.name}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#21262d] text-[#8b949e]">
              {d.categoryCount} categories
            </span>
          </button>
        ))}
      </div>

      {/* Search and Domain / Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-[#161b22] border border-[#30363d]">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 size-4 text-[#8b949e]" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Domain Dropdown */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-[#8b949e]">Domain:</span>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 max-w-[280px]"
            >
              <option value="ALL">All Domains ({categories.length} categories)</option>
              {displayDomains.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name} {d.isLive ? `(${d.categoryCount} categories)` : "(Planned · 0 categories)"}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center space-x-1.5">
            <Filter className="size-3.5 text-[#8b949e]" />
            <span className="text-xs text-[#8b949e]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="LIVE">Live (Published)</option>
              <option value="DRAFT">Draft / Staging</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#8b949e] font-mono">
          Loading Neo4j Knowledge Graph taxonomy...
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#161b22] border border-[#30363d] text-center space-y-2">
          <Layers className="size-8 text-[#8b949e] mx-auto opacity-40" />
          <div className="text-sm font-semibold text-white">No categories found</div>
          <p className="text-xs text-[#8b949e]">
            {searchQuery
              ? `No categories matching "${searchQuery}"`
              : "Try switching domains or add a new category above."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCategories.map((cat) => (
            <div
              key={cat.slug}
              className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-emerald-500/40 transition flex flex-col justify-between space-y-4 group shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold tracking-wider">
                      {cat.domainName}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                      {cat.name}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 ${
                      cat.isLive
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {cat.isLive ? "LIVE" : "DRAFT"}
                  </span>
                </div>

                <p className="text-xs text-[#8b949e] line-clamp-2">
                  {cat.description || "No description provided."}
                </p>

                <div className="text-[11px] font-mono text-[#8b949e] flex items-center space-x-2">
                  <span>Slug:</span>
                  <code className="text-white bg-[#0d1117] px-1.5 py-0.5 rounded border border-[#30363d]">
                    {cat.slug}
                  </code>
                </div>
              </div>

              <div className="pt-3 border-t border-[#21262d] flex items-center justify-between">
                <Link
                  href={`/admin/curriculum/topics?categorySlug=${cat.slug}`}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                >
                  <span>{cat.topicCount} Topics</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition" />
                </Link>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setEditCategory(cat);
                      setEditName(cat.name);
                      setEditDesc(cat.description || "");
                    }}
                    className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] transition"
                    title="Edit Category"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.slug, cat.name)}
                    className="p-1.5 rounded-lg text-[#8b949e] hover:text-red-400 hover:bg-red-950/30 transition"
                    title="Delete Category"
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
      {!loading && filteredCategories.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalItems={filteredCategories.length}
          pageSize={pageSize}
          onPageChange={(p) => setCurrentPage(p)}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setCurrentPage(1);
          }}
          pageSizeOptions={[10, 25, 50]}
          itemLabel="categories"
        />
      )}

      {/* Modal: Add Category */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#161b22] border border-[#30363d] p-6 shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="size-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Add Knowledge Graph Category</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8b949e] hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Parent Domain
                </label>
                <select
                  value={newCatDomain}
                  onChange={(e) => setNewCatDomain(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {displayDomains.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.name} {d.isLive ? "" : "(Planned)"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Consensus & Raft"
                  value={newCatName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Category Slug (Unique identifier)
                </label>
                <input
                  type="text"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Summarize the core technical concepts and target scope..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="publishImmediately"
                  checked={newCatPublishImmediately}
                  onChange={(e) => setNewCatPublishImmediately(e.target.checked)}
                  className="rounded border-[#30363d] text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="publishImmediately" className="text-xs text-[#c9d1d9] select-none">
                  Publish Immediately (HOD / Super Admin override; bypass staging queue)
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Category */}
      {editCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#161b22] border border-[#30363d] p-6 shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit2 className="size-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Edit Category</h3>
              </div>
              <button
                onClick={() => setEditCategory(null)}
                className="text-[#8b949e] hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Description
                </label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setEditCategory(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8b949e] hover:text-white hover:bg-[#21262d] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition disabled:opacity-50"
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

