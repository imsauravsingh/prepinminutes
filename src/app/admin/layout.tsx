"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  Layers,
  HelpCircle,
  CheckCircle2,
  Users,
  UserCheck,
  CreditCard,
  LogOut,
  ChevronRight,
  Shield,
  Activity,
  Flame,
  LayoutDashboard,
} from "lucide-react";
import { backendApi } from "@/lib/api-client";

interface AdminUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl?: string | null;
  role: string;
  adminApprovalStatus: string;
  isRootHod: boolean;
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage =
    pathname === "/admin/login" ||
    pathname === "/admin/request-access" ||
    pathname === "/admin/pending-approval";

  const [loading, setLoading] = useState(!isAuthPage);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [forbiddenError, setForbiddenError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthPage) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function verifyAdmin() {
      try {
        const res = await backendApi.getAdminMe();
        if (!isMounted) return;

        if (res.success && res.user) {
          setAdminUser(res.user);
          setLoading(false);
        } else {
          router.replace("/admin/login");
        }
      } catch (err: any) {
        if (!isMounted) return;

        const errMsg = err?.message || "";
        if (errMsg.includes("PENDING_APPROVAL") || err?.code === "PENDING_APPROVAL") {
          router.replace("/admin/pending-approval");
        } else if (errMsg.includes("ACCOUNT_BLOCKED") || err?.code === "ACCOUNT_BLOCKED") {
          setForbiddenError(errMsg);
          setLoading(false);
        } else {
          router.replace("/admin/login");
        }
      }
    }

    verifyAdmin();

    return () => {
      isMounted = false;
    };
  }, [isAuthPage, pathname, router]);

  const handleLogout = async () => {
    try {
      await backendApi.adminLogout();
    } catch {}
    router.replace("/admin/login");
  };

  // If on Login, Request Access, or Pending page: render standalone without sidebar
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#0d0f12] text-[#f0f3f6] antialiased selection:bg-[#ff5722] selection:text-white">
        {children}
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0f12] text-[#f0f3f6] flex flex-col items-center justify-center space-y-4">
        <div className="size-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
        <p className="text-xs uppercase tracking-widest text-[#8b949e]">Verifying Administrative Authority...</p>
      </div>
    );
  }

  // Forbidden / Blocked State
  if (forbiddenError) {
    return (
      <div className="min-h-screen bg-[#0d0f12] text-[#f0f3f6] flex flex-col items-center justify-center p-6 text-center">
        <div className="size-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mb-4">
          <ShieldAlert className="size-8" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Access Suspended</h1>
        <p className="text-sm text-[#8b949e] max-w-md mb-6">{forbiddenError}</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#21262d] hover:bg-[#30363d] rounded-lg transition"
        >
          Return to Login
        </button>
      </div>
    );
  }

  const isHod = adminUser?.isRootHod || adminUser?.role === "SUPER_ADMIN" || adminUser?.role === "HOD";

  const navLinks = [
    {
      href: "/admin",
      label: "Overview",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      href: "/admin/curriculum",
      label: "Knowledge Graph",
      icon: Layers,
      active: pathname.startsWith("/admin/curriculum"),
      badge: "Neo4j",
    },
    {
      href: "/admin/questions",
      label: "Question Bank",
      icon: HelpCircle,
      active: pathname.startsWith("/admin/questions"),
    },
    {
      href: "/admin/approvals",
      label: "Staging Approvals",
      icon: CheckCircle2,
      active: pathname.startsWith("/admin/approvals"),
    },
    {
      href: "/admin/candidates",
      label: "Candidate Directory",
      icon: Users,
      active: pathname.startsWith("/admin/candidates"),
      badge: "Subscriptions",
    },
    {
      href: "/admin/team",
      label: "HOD Team Control",
      icon: UserCheck,
      active: pathname.startsWith("/admin/team"),
      hodOnly: true,
      badge: "HOD",
    },
    {
      href: "/admin/subscriptions",
      label: "Pricing & Quotas",
      icon: CreditCard,
      active: pathname.startsWith("/admin/subscriptions"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f0f3f6] flex flex-col antialiased selection:bg-[#ff5722] selection:text-white">
      {/* Top Warning Banner for Root HOD */}
      <div className="bg-gradient-to-r from-amber-950/80 via-emerald-950/40 to-slate-900 border-b border-emerald-500/20 px-4 py-1.5 flex items-center justify-between text-[11px] text-[#8b949e]">
        <div className="flex items-center space-x-2">
          <Shield className="size-3.5 text-emerald-400" />
          <span className="font-semibold text-emerald-400 uppercase tracking-widest">
            PrepInMinutes Control Plane
          </span>
          <span className="text-[#484f58]">•</span>
          <span>PostgreSQL RBAC + Neo4j AuraDB Active</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-mono">LIVE CLUSTER</span>
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Administrative Sidebar */}
        <aside className="w-64 bg-[#161b22] border-r border-[#30363d] flex flex-col justify-between shrink-0">
          <div className="p-4 space-y-6">
            {/* Admin Brand / Logo */}
            <div className="flex items-center space-x-3 px-2">
              <div className="size-8 rounded-lg bg-gradient-to-br from-[#ff5722] to-[#ff8a65] flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">
                P
              </div>
              <div>
                <div className="text-sm font-bold tracking-tight text-white flex items-center space-x-1.5">
                  <span>PrepInMinutes</span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Admin
                  </span>
                </div>
                <div className="text-[10px] text-[#8b949e] font-mono">v1.0 • AuraDB + PG</div>
              </div>
            </div>

            {/* Navigation Section */}
            <nav className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#6e7681] font-semibold px-2 mb-2">
                Core Modules
              </div>
              {navLinks.map((link) => {
                if (link.hodOnly && !isHod) return null;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                      link.active
                        ? "bg-[#21262d] text-white font-semibold border-l-2 border-[#ff5722]"
                        : "text-[#8b949e] hover:text-white hover:bg-[#21262d]/60"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`size-4 ${link.active ? "text-[#ff5722]" : "text-[#8b949e]"}`} />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          link.badge === "HOD"
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            : "bg-[#30363d] text-[#c9d1d9]"
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Session Footer */}
          <div className="p-4 border-t border-[#30363d] bg-[#0d0f12]/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5 min-w-0">
                {adminUser?.avatarUrl ? (
                  <img
                    src={adminUser.avatarUrl}
                    alt={adminUser.fullName || "Admin"}
                    className="size-8 rounded-full border border-emerald-500/40"
                  />
                ) : (
                  <div className="size-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    {(adminUser?.fullName?.[0] || adminUser?.email?.[0] || "A").toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">
                    {adminUser?.fullName || "Administrator"}
                  </div>
                  <div className="text-[10px] text-[#8b949e] truncate font-mono">
                    {adminUser?.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#21262d] text-[10px]">
              <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {adminUser?.role}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-[#8b949e] hover:text-rose-400 transition"
              >
                <LogOut className="size-3" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Administrative Workspace Content */}
        <main className="flex-1 overflow-y-auto bg-[#0d0f12] p-8">
          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

