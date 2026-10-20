"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserCheck,
  Shield,
  Ban,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  MessageSquare,
  Key,
  Unlock,
  History,
  Crown,
  ChevronRight,
  UserX,
  FileCheck,
} from "lucide-react";
import { backendApi } from "@/lib/api-client";

interface StaffMember {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: string;
  adminApprovalStatus: string;
  isBlocked: boolean;
  blockedReason: string | null;
  blockedAt: string | null;
  blockedBy: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  createdAt: string;
  isRootHod: boolean;
}

interface PendingRequest {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  requestedRole: string;
  requestReason: string;
  requestedAt: string;
}

interface AuditLog {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  changeDiff: any;
  performedBy: string;
  performedByName: string;
  createdAt: string;
}

export default function AdminTeamPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedRoleMap, setSelectedRoleMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Block Modal
  const [blockingStaff, setBlockingStaff] = useState<StaffMember | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadTeamData() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [teamRes, pendingRes, logsRes] = await Promise.all([
        backendApi.getAdminTeam(),
        backendApi.getAdminTeamPending(),
        backendApi.getAdminAuditLogs().catch(() => ({ success: false, logs: [] })),
      ]);

      if (teamRes.success) {
        setStaff(teamRes.staff);
      }
      if (pendingRes.success) {
        setPendingRequests(pendingRes.requests);
        // Prepopulate selected role for approval
        const initialMap: Record<string, string> = {};
        pendingRes.requests.forEach((r) => {
          initialMap[r.id] = r.requestedRole;
        });
        setSelectedRoleMap(initialMap);
      }
      if (logsRes.success) {
        setAuditLogs(logsRes.logs);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load HOD team workspace.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeamData();
  }, []);

  async function handleApprove(req: PendingRequest) {
    const roleToAssign = selectedRoleMap[req.id] || req.requestedRole || "CONTENT_REVIEWER";
    if (!confirm(`Approve ${req.email} as ${roleToAssign}?`)) return;

    setErrorMsg(null);
    try {
      const res = await backendApi.approveStaffMember(req.id, roleToAssign);
      if (res.success) {
        setSuccessMsg(`Approved ${req.email} as ${roleToAssign}.`);
        await loadTeamData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to approve staff request.");
    }
  }

  async function handleReject(req: PendingRequest) {
    if (!confirm(`Reject admin access request for ${req.email}?`)) return;

    setErrorMsg(null);
    try {
      const res = await backendApi.rejectStaffMember(req.id);
      if (res.success) {
        setSuccessMsg(`Rejected access request for ${req.email}.`);
        await loadTeamData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reject staff request.");
    }
  }

  async function handleChangeRole(staffId: string, currentRole: string, newRole: string) {
    if (currentRole === newRole) return;
    if (!confirm(`Change staff role from ${currentRole} to ${newRole}?`)) return;

    setErrorMsg(null);
    try {
      const res = await backendApi.updateStaffRole(staffId, newRole);
      if (res.success) {
        setSuccessMsg(`Staff role updated to ${newRole}.`);
        await loadTeamData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update staff role.");
    }
  }

  async function handleBlockSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!blockingStaff || !blockReason.trim()) {
      setErrorMsg("Please provide written justification for blocking this staff member.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await backendApi.blockStaffMember(blockingStaff.id, blockReason.trim());
      if (res.success) {
        setSuccessMsg(`Staff member ${blockingStaff.email} has been suspended from the admin panel.`);
        setBlockingStaff(null);
        setBlockReason("");
        await loadTeamData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to block staff member.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUnblock(member: StaffMember) {
    if (!confirm(`Unblock staff member ${member.email}?`)) return;

    setErrorMsg(null);
    try {
      const res = await backendApi.unblockStaffMember(member.id);
      if (res.success) {
        setSuccessMsg(`Staff member ${member.email} has been unblocked.`);
        await loadTeamData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to unblock staff member.");
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="size-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-md">
            <Crown className="size-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Head of Department (HOD) — Staff & Access Management
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Root Exclusive
              </span>
            </div>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Review applicant written justifications, approve staff promotions, manage RBAC permissions, and universally suspend staff access.
            </p>
          </div>
        </div>

        <button
          onClick={loadTeamData}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-[#c9d1d9] bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] transition self-start md:self-auto"
        >
          Refresh Team Registry
        </button>
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

      {/* SECTION 1: Pending Staff Access Requests Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserCheck className="size-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              Pending Staff Access Requests ({pendingRequests.length})
            </h2>
          </div>
          <span className="text-xs text-[#8b949e] font-mono">
            Requires HOD Approval
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] text-center text-xs text-[#8b949e] flex items-center justify-center space-x-2">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span>No pending admin access requests at this time. All staff requests have been processed.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-[#161b22] border border-amber-500/30 space-y-4 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    {req.avatarUrl ? (
                      <img
                        src={req.avatarUrl}
                        alt=""
                        className="size-10 rounded-xl border border-[#30363d]"
                      />
                    ) : (
                      <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300">
                        {req.fullName[0] || req.email[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-white text-sm">{req.fullName}</div>
                      <div className="text-xs text-[#8b949e] font-mono">{req.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-[#8b949e]">Requested Role:</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {req.requestedRole}
                    </span>
                    <span className="text-[#8b949e] font-mono text-[11px]">
                      {new Date(req.requestedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Exact Written Justification Text Box */}
                <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-400">
                    <MessageSquare className="size-3.5" />
                    <span>Applicant Written Reason & Justification:</span>
                  </div>
                  <p className="text-xs text-[#e6edf3] font-sans leading-relaxed italic">
                    &ldquo;{req.requestReason}&rdquo;
                  </p>
                </div>

                {/* HOD Action Bar */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#8b949e]">Assign Role on Approval:</span>
                    <select
                      value={selectedRoleMap[req.id] || req.requestedRole}
                      onChange={(e) =>
                        setSelectedRoleMap({ ...selectedRoleMap, [req.id]: e.target.value })
                      }
                      className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="CURRICULUM_MANAGER">CURRICULUM_MANAGER</option>
                      <option value="STAFF_ENGINEER">STAFF_ENGINEER</option>
                      <option value="CONTENT_REVIEWER">CONTENT_REVIEWER</option>
                      <option value="HOD">HOD (Department Co-lead)</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReject(req)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-red-300 bg-red-950/30 hover:bg-red-900/40 border border-red-800/50 transition flex items-center space-x-1"
                    >
                      <XCircle className="size-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(req)}
                      className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition flex items-center space-x-1.5 shadow-md shadow-emerald-900/30"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>Approve Access</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Active Administrative Staff Directory */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="size-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Active Administrative Staff ({staff.length})
            </h2>
          </div>
          <span className="text-xs text-[#8b949e]">
            Universal Staff Suspension Available
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#30363d] bg-[#161b22] shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0d1117] text-[#8b949e] uppercase font-mono text-[11px] border-b border-[#30363d]">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Administrative Role</th>
                <th className="py-3 px-4">Approved By</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">HOD Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d]">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-[#1c2128]/60 transition">
                  {/* Identity */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt=""
                          className="size-9 rounded-xl border border-[#30363d]"
                        />
                      ) : (
                        <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-300">
                          {member.fullName ? member.fullName[0] : member.email[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-semibold text-white">{member.fullName || "Admin"}</span>
                          {member.isRootHod && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              ROOT HOD
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#8b949e] font-mono">{member.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role Selector */}
                  <td className="py-3.5 px-4">
                    {member.isRootHod ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        SUPER_ADMIN (LOCKED)
                      </span>
                    ) : (
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.id, member.role, e.target.value)}
                        className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="CURRICULUM_MANAGER">CURRICULUM_MANAGER</option>
                        <option value="STAFF_ENGINEER">STAFF_ENGINEER</option>
                        <option value="CONTENT_REVIEWER">CONTENT_REVIEWER</option>
                        <option value="HOD">HOD</option>
                      </select>
                    )}
                  </td>

                  {/* Approved Info */}
                  <td className="py-3.5 px-4 text-[#8b949e] font-mono text-[11px]">
                    {member.approvedBy ? (
                      <div>
                        <div>{member.approvedBy}</div>
                        {member.approvedAt && (
                          <div className="text-[10px] text-[#6e7681]">
                            {new Date(member.approvedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ) : (
                      "Root Account"
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {member.isBlocked ? (
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                          SUSPENDED
                        </span>
                        {member.blockedReason && (
                          <div className="text-[10px] text-red-300 truncate max-w-[140px]" title={member.blockedReason}>
                            {member.blockedReason}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        AUTHORIZED
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    {member.isRootHod ? (
                      <span className="text-[11px] text-[#8b949e] italic">Root Authority</span>
                    ) : member.isBlocked ? (
                      <button
                        onClick={() => handleUnblock(member)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-800/50 transition flex items-center space-x-1 ml-auto"
                      >
                        <Unlock className="size-3.5" />
                        <span>Unblock Staff</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setBlockingStaff(member);
                          setBlockReason("");
                        }}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-red-400 bg-red-950/30 hover:bg-red-900/40 border border-red-800/50 transition flex items-center space-x-1 ml-auto"
                      >
                        <Ban className="size-3.5" />
                        <span>Suspend Access</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Administrative Audit Trail */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <History className="size-5 text-[#8b949e]" />
          <h2 className="text-base font-bold text-white">
            Administrative Audit Trail (Recent 50 Actions)
          </h2>
        </div>

        {auditLogs.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] text-center text-xs text-[#8b949e]">
            No administrative audit logs recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-[#21262d] rounded-2xl border border-[#30363d] bg-[#161b22] max-h-72 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-[#1c2128]/50">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-emerald-400 font-bold">{log.action}</span>
                    <span className="text-[#8b949e]">on</span>
                    <span className="font-mono text-white bg-[#0d1117] px-1.5 py-0.2 rounded border border-[#30363d]">
                      {log.targetType}:{log.targetId}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8b949e]">
                    By <span className="text-white">{log.performedBy}</span> ({log.performedByName})
                  </div>
                </div>
                <div className="text-[11px] font-mono text-[#8b949e]">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Suspend Staff Member */}
      {blockingStaff && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#161b22] border border-[#30363d] p-6 shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center space-x-2 text-red-400">
              <Ban className="size-5" />
              <h3 className="text-base font-bold text-white">Suspend Staff Member</h3>
            </div>
            <p className="text-xs text-[#8b949e]">
              Blocking <span className="text-white font-semibold">{blockingStaff.email}</span> will immediately revoke all administrative control plane sessions and lock them out of the admin panel.
            </p>

            <form onSubmit={handleBlockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Reason for Suspension (Required)
                </label>
                <textarea
                  placeholder="e.g. Security audit failure, policy violation, offboarding..."
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setBlockingStaff(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8b949e] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Suspending..." : "Confirm & Suspend"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

