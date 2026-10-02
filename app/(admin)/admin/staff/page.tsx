"use client"
import React, { useEffect, useState, useMemo } from 'react';
import styles from './staff-management.module.css';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  Shield, 
  Mail, 
  X, 
  Sparkles,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

type StaffMember = {
  id: string;
  name: string | null;
  email: string;
  jobTitle: string | null;
  role: string;
  lastLoginAt: string | null;
  lastSeenAt: string | null;
  createdAt: string;
};

const emptyForm = { name: "", email: "", jobTitle: "", password: "" };
const avatarGradients = [
  "from-amber-600 to-green-700",
  "from-emerald-600 to-lime-700",
  "from-yellow-600 to-amber-700",
  "from-green-700 to-teal-700",
  "from-orange-600 to-yellow-700",
];

export default function StaffManagementApp() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const showToast = (message: any) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  const loadStaff = async () => {
    try {
      const response = await fetch("/api/admin/staff");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load staff.");
      setStaff(data.staff);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to load staff.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadStaff();
  }, []);

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const matchesQuery = `${member.name || ""} ${member.email} ${member.jobTitle || ""}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesQuery;
    });
  }, [staff, query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const totalPages = Math.ceil(filteredStaff.length / rowsPerPage) || 1;
  
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredStaff.slice(start, start + rowsPerPage);
  }, [filteredStaff, currentPage, rowsPerPage]);

  const stats = useMemo(() => {
    const now = Date.now();
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    return {
      total: staff.length,
      signedIn: staff.filter(member => member.lastLoginAt).length,
      recentlySeen: staff.filter(member => member.lastSeenAt && now - new Date(member.lastSeenAt).getTime() < 15 * 60 * 1000).length,
      addedThisMonth: staff.filter(member => new Date(member.createdAt) >= monthStart).length,
    };
  }, [staff]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/staff", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editingId || undefined }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save staff account.");
      await loadStaff();
      showToast(editingId ? `Successfully updated ${form.name}` : `Successfully added ${form.name}`);
      setForm(emptyForm);
      setEditingId(null);
      setIsDrawerOpen(false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to save staff account.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (member: StaffMember) => {
    setEditingId(member.id);
    setForm({
      name: member.name || "",
      email: member.email,
      jobTitle: member.jobTitle || "",
      password: "",
    });
    setIsDrawerOpen(true);
  };

  const confirmRemove = async (id: string) => {
    try {
      const response = await fetch("/api/admin/staff", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to remove staff member.");
      await loadStaff();
      showToast("Staff member removed successfully");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to remove staff member.");
    } finally {
      setDeleteModalId(null);
    }
  };

  return (
    <div className={styles.staffManagement}>
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl bg-slate-900 border border-indigo-500/30 px-4 py-3 shadow-2xl shadow-indigo-500/10 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium text-slate-200">{notification}</p>
        </div>
      )}

      {/* Header Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/25">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Enterprise Workspace</span>
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-500/20">v2.5</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">Staff Management</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setIsDrawerOpen(true);
              }}
              className="group relative inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
            >
              <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Add Staff Member</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        
        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl transition hover:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Workforce</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{stats.total}</span>
              <span className="flex items-center text-xs font-semibold text-emerald-400">
                <span className="ml-1 text-slate-400">staff accounts</span>
              </span>
            </div>
          </div>

          <div className="p-6 relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl transition hover:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Signed In</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{stats.signedIn}</span>
              <span className="text-xs text-slate-400">with a recorded sign-in</span>
            </div>
          </div>

          <div className="p-6 relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl transition hover:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Seen Recently</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{stats.recentlySeen}</span>
              <span className="text-xs text-slate-400">in the last 15 minutes</span>
            </div>
          </div>

          <div className="p-6 relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl transition hover:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Added This Month</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <UserPlus className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{stats.addedThisMonth}</span>
              <span className="text-xs text-slate-400">new staff accounts</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-end">
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, or title..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-10 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            {query && (
              <button 
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Staff Table Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Staff Member</th>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Account</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedStaff.map((member, index) => (
                  <tr key={member.id} className="group transition-colors hover:bg-slate-800/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${avatarGradients[index % avatarGradients.length]} font-bold text-white shadow-md`}>
                          {(member.name || member.email).split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                            {member.name || "Unnamed staff"}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Mail className="h-3 w-3" />
                            <span>{member.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">{member.jobTitle || "No title assigned"}</div>
                      <div className="text-xs text-slate-500">{member.role}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400">{member.lastLoginAt ? `Last sign-in ${new Date(member.lastLoginAt).toLocaleDateString()}` : "Never signed in"}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition"
                          title="Edit staff details"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModalId(member.id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition"
                          title="Remove staff member"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {paginatedStaff.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-500 mb-4 border border-slate-700/50">
                <Users className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">No staff members found</h3>
                <p className="mt-1 text-sm text-slate-400 max-w-sm">
                {isLoading ? "Loading staff accounts..." : "No staff accounts match your search."}
              </p>
              <button
                onClick={() => setQuery("")}
                className="mt-5 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 border border-slate-700 transition"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800 px-6 py-4 gap-4 bg-slate-950/40">
              <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>Showing <strong>{filteredStaff.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}</strong> to <strong>{Math.min(currentPage * rowsPerPage, filteredStaff.length)}</strong> of <strong>{filteredStaff.length}</strong> results</span>
              <div className="flex items-center gap-2 ml-4">
                <span>Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent transition"
                title="First Page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent transition"
                title="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center px-3 text-xs font-semibold text-slate-300">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent transition"
                title="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent transition"
                title="Last Page"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Slide-over Drawer for Add/Edit */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
              
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {editingId ? <Edit3 className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white">
                        {editingId ? "Edit Staff Member" : "New Staff Member"}
                      </h2>
                      <p className="text-xs text-slate-400">
                        {editingId ? "Update staff account details" : "Create a staff login and directory profile"}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form id="staff-form" onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Sarah Connor"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Work Email
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="sarah@launchgate.com"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Job Title
                    </label>
                    <input
                      required
                      type="text"
                      value={form.jobTitle}
                      onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                      placeholder="e.g. Lead Security Architect"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  {!editingId && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Initial Password
                      </label>
                      <input
                        required
                        minLength={12}
                        type="password"
                        autoComplete="new-password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="At least 12 characters"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  )}
                </form>
              </div>

              <div className="border-t border-slate-800 bg-slate-950/60 p-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="staff-form"
                  className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition active:scale-95"
                >
                  {isSaving ? "Saving..." : editingId ? "Save Changes" : "Create Staff Account"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setDeleteModalId(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Remove Staff Member?</h3>
            <p className="mt-1 text-sm text-slate-400">
              This action will permanently revoke workspace access and remove profile data. This cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModalId(null)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmRemove(deleteModalId)}
                className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}