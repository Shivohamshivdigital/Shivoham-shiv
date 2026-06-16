import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Lock, RefreshCw, LogOut, Users, CreditCard, FileText, Plus, Pencil, Trash2, ExternalLink, DownloadCloud, UserCheck, Settings as SettingsIcon } from "lucide-react";
import { blogPosts, sectionsToContent } from "../data/blogData";

interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
}

interface Lead extends Attribution {
  id: string;
  created_at: string;
  name?: string;
  email?: string;
  whatsapp?: string;
  message?: string;
  source?: string;
}

// Human-readable ad source for a lead/user (campaign / search term / platform).
function adSource(r: Attribution): string {
  if (r.utm_campaign || r.utm_source || r.utm_term) {
    return [r.utm_source, r.utm_campaign, r.utm_term].filter(Boolean).join(" · ");
  }
  if (r.gclid) return "Google Ads";
  if (r.fbclid) return "Meta Ads";
  if (r.referrer) {
    try {
      return new URL(r.referrer).hostname.replace(/^www\./, "");
    } catch {
      return r.referrer;
    }
  }
  return "Direct";
}

interface Payment {
  id: string;
  created_at: string;
  plan?: string;
  name?: string;
  email?: string;
  contact?: string;
  amount?: number;
  razorpay_payment_id?: string;
  status?: string;
}

interface AppUser extends Attribution {
  id?: string;
  email?: string;
  verified?: boolean;
  paid?: boolean;
  paidPlan?: string;
  lastPlan?: string;
  attempts?: number;
  created_at?: string;
  paidAt?: string;
  lastAttemptAt?: string;
}

interface Post {
  id?: string;
  created_at?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  meta?: string;
  keyword?: string;
  category?: string;
  author?: string;
  image?: string;
  content?: string;
  ctaText?: string;
  ctaLink?: string;
  date?: string;
  published?: boolean;
}

const PW_KEY = "shivoham_admin_pw";

function fmtDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

const emptyPost: Post = {
  title: "",
  slug: "",
  category: "Wellness",
  author: "Shivoham Shiv",
  image: "",
  excerpt: "",
  meta: "",
  keyword: "",
  content: "",
  ctaText: "Book a Free Consultation",
  ctaLink: "/weight-loss",
  published: true,
};

export default function AdminView() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [tab, setTab] = useState<"leads" | "payments" | "users" | "blog" | "settings">("leads");

  // Pricing settings
  const [settings, setSettings] = useState({ registerAmount: 999, courseAmount: 7999, courseOriginal: 11999, discountLabel: "30% OFF" });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);

  // Blog editor state
  const [editing, setEditing] = useState<Post | null>(null);
  const [savingPost, setSavingPost] = useState(false);
  const [postMsg, setPostMsg] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const pw = () => password || sessionStorage.getItem(PW_KEY) || "";

  const fetchPosts = useCallback(async (p: string) => {
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: p, action: "list" }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data.posts)) setPosts(data.posts);
    } catch {
      /* best-effort */
    }
  }, []);

  const fetchData = useCallback(
    async (p: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/data", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ password: p }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 401) {
            sessionStorage.removeItem(PW_KEY);
            setAuthed(false);
          }
          throw new Error(data.error || "Could not load data.");
        }
        setLeads(Array.isArray(data.leads) ? data.leads : []);
        setPayments(Array.isArray(data.payments) ? data.payments : []);
        setUsers(Array.isArray(data.users) ? data.users : []);
        setAuthed(true);
        sessionStorage.setItem(PW_KEY, p);
        fetchPosts(p);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
    [fetchPosts]
  );

  // Auto-login if a password was saved this session.
  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY);
    if (saved) {
      setPassword(saved);
      fetchData(saved);
    }
  }, [fetchData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) fetchData(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(PW_KEY);
    setAuthed(false);
    setPassword("");
    setLeads([]);
    setPayments([]);
    setPosts([]);
    setUsers([]);
    setEditing(null);
  };

  const savePost = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) {
      setPostMsg("Title is required.");
      return;
    }
    setSavingPost(true);
    setPostMsg(null);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw(), action: "save", post: editing }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save the post.");
      setEditing(null);
      await fetchPosts(pw());
    } catch (err: any) {
      setPostMsg(err.message || "Save failed.");
    } finally {
      setSavingPost(false);
    }
  };

  const deletePost = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this post permanently?")) return;
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw(), action: "delete", id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not delete.");
      await fetchPosts(pw());
    } catch (err: any) {
      alert(err.message || "Delete failed.");
    }
  };

  const importDefaults = async () => {
    if (!window.confirm("Import the built-in blog posts so you can edit them here? (existing ones are skipped)")) return;
    setImporting(true);
    try {
      const payload = blogPosts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        meta: p.meta,
        keyword: p.keyword,
        category: p.category,
        author: p.author,
        image: p.image,
        content: sectionsToContent(p.sections),
        ctaText: p.ctaText,
        ctaLink: p.ctaLink,
        date: p.date,
        published: true,
      }));
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw(), action: "import", posts: payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Import failed.");
      await fetchPosts(pw());
      alert(`Imported ${data.imported ?? 0} post(s). You can now edit or delete them.`);
    } catch (err: any) {
      alert(err.message || "Import failed.");
    } finally {
      setImporting(false);
    }
  };

  // Load current pricing (public) so the Settings form is pre-filled.
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings((s) => ({ ...s, ...d })))
      .catch(() => {});
  }, []);

  const saveSettings = async () => {
    setSavingSettings(true);
    setSettingsMsg(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw(), settings }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save settings.");
      setSettingsMsg("Saved! Prices on the site are updated.");
    } catch (err: any) {
      setSettingsMsg(err.message || "Save failed.");
    } finally {
      setSavingSettings(false);
    }
  };

  const setField = (k: keyof Post, v: any) => setEditing((e) => (e ? { ...e, [k]: v } : e));

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-green-150 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500";
  const labelCls = "block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5";

  return (
    <div className="min-h-screen bg-[#FAFBF7] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <Helmet>
        <title>Admin — Shivoham Shiv</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {!authed ? (
          <div className="max-w-sm mx-auto mt-20 bg-white border border-green-100 rounded-3xl shadow-sm p-8">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-700 mb-5">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-bold text-xl text-green-900 mb-1">Admin Login</h1>
            <p className="text-xs text-slate-500 mb-6">Enter the admin password to view leads, payments &amp; blog.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-green-150 text-sm bg-[#FAFBF7] focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#2F5D50] hover:bg-[#23483E] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-60"
              >
                {loading ? "Checking…" : "Log In"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h1 className="font-heading font-bold text-2xl text-green-900">Dashboard</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData(pw())}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-green-200 bg-white text-green-800 text-xs font-bold hover:bg-green-50 transition-colors disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 bg-white text-red-600 text-xs font-bold hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-600 mb-4">{error}</p>}

            {/* Tabs */}
            <div className="flex gap-2 mb-5 flex-wrap">
              <button
                onClick={() => setTab("leads")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  tab === "leads" ? "bg-[#2F5D50] text-white" : "bg-white border border-green-150 text-slate-600"
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Leads ({leads.length})
              </button>
              <button
                onClick={() => setTab("payments")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  tab === "payments" ? "bg-[#2F5D50] text-white" : "bg-white border border-green-150 text-slate-600"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" /> Payments ({payments.length})
              </button>
              <button
                onClick={() => setTab("users")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  tab === "users" ? "bg-[#2F5D50] text-white" : "bg-white border border-green-150 text-slate-600"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" /> Users ({users.length})
              </button>
              <button
                onClick={() => {
                  setTab("blog");
                  setEditing(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  tab === "blog" ? "bg-[#2F5D50] text-white" : "bg-white border border-green-150 text-slate-600"
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Blog ({posts.length})
              </button>
              <button
                onClick={() => setTab("settings")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  tab === "settings" ? "bg-[#2F5D50] text-white" : "bg-white border border-green-150 text-slate-600"
                }`}
              >
                <SettingsIcon className="w-3.5 h-3.5" /> Settings
              </button>
            </div>

            {tab === "leads" && (
              <div className="bg-white border border-green-100 rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-green-50 text-green-900 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">WhatsApp</th>
                      <th className="px-4 py-3">Source</th>
                      <th className="px-4 py-3">Ad Source</th>
                      <th className="px-4 py-3">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                          No leads yet.
                        </td>
                      </tr>
                    ) : (
                      leads.map((l) => (
                        <tr key={l.id} className="border-t border-green-50 hover:bg-green-50/40">
                          <td className="px-4 py-3 whitespace-nowrap text-slate-500">{fmtDate(l.created_at)}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{l.name || "—"}</td>
                          <td className="px-4 py-3 text-slate-600">{l.email || "—"}</td>
                          <td className="px-4 py-3 text-slate-600">{l.whatsapp || "—"}</td>
                          <td className="px-4 py-3 text-slate-600">{l.source || "—"}</td>
                          <td className="px-4 py-3 text-slate-600 max-w-[12rem] truncate" title={adSource(l)}>{adSource(l)}</td>
                          <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={l.message}>
                            {l.message || "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "payments" && (
              <div className="bg-white border border-green-100 rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-green-50 text-green-900 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Payment ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                          No payments yet.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <tr key={p.id} className="border-t border-green-50 hover:bg-green-50/40">
                          <td className="px-4 py-3 whitespace-nowrap text-slate-500">{fmtDate(p.created_at)}</td>
                          <td className="px-4 py-3 text-slate-700">{p.plan || "—"}</td>
                          <td className="px-4 py-3 font-semibold text-green-800">{p.amount != null ? `₹${p.amount}` : "—"}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{p.name || "—"}</td>
                          <td className="px-4 py-3 text-slate-600">{p.email || "—"}</td>
                          <td className="px-4 py-3 text-slate-600">{p.contact || "—"}</td>
                          <td className="px-4 py-3 text-slate-500 font-mono text-[10px]">{p.razorpay_payment_id || "—"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "users" && (
              <div className="bg-white border border-green-100 rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-green-50 text-green-900 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Email verified</th>
                      <th className="px-4 py-3">Paid</th>
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">Attempts</th>
                      <th className="px-4 py-3">Ad Source</th>
                      <th className="px-4 py-3">Signed up</th>
                      <th className="px-4 py-3">Last attempt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                          No signups yet.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id || u.email} className="border-t border-green-50 hover:bg-green-50/40">
                          <td className="px-4 py-3 font-semibold text-slate-800">{u.email || "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                              {u.verified ? "Verified" : "Unverified"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.paid ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"}`}>
                              {u.paid ? "Paid" : "Unpaid"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{u.paidPlan || u.lastPlan || "—"}</td>
                          <td className="px-4 py-3 text-slate-600">{u.attempts || 0}</td>
                          <td className="px-4 py-3 text-slate-600 max-w-[12rem] truncate" title={adSource(u)}>{adSource(u)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-500">{fmtDate(u.created_at)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-500">{u.lastAttemptAt ? fmtDate(u.lastAttemptAt) : "—"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "blog" && !editing && (
              <div className="space-y-4">
                <div className="flex justify-between items-center gap-3 flex-wrap">
                  <p className="text-xs text-slate-500">Create and manage blog posts. Published posts appear on /blog.</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={importDefaults}
                      disabled={importing}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-green-200 bg-white text-green-800 text-xs font-bold hover:bg-green-50 transition-colors disabled:opacity-60"
                      title="Bring the built-in blog posts into this panel so you can edit/delete them"
                    >
                      <DownloadCloud className={`w-4 h-4 ${importing ? "animate-pulse" : ""}`} /> {importing ? "Importing…" : "Import default posts"}
                    </button>
                    <button
                      onClick={() => {
                        setPostMsg(null);
                        setEditing({ ...emptyPost });
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E8943A] hover:bg-[#EFAF3C] text-white text-xs font-bold transition-colors"
                    >
                      <Plus className="w-4 h-4" /> New Post
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-green-100 rounded-2xl shadow-sm overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-green-50 text-green-900 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                            No posts yet. Click “New Post” to write one.
                          </td>
                        </tr>
                      ) : (
                        posts.map((p) => (
                          <tr key={p.id} className="border-t border-green-50 hover:bg-green-50/40">
                            <td className="px-4 py-3 font-semibold text-slate-800 max-w-xs truncate" title={p.title}>
                              {p.title || "—"}
                            </td>
                            <td className="px-4 py-3 text-slate-600">{p.category || "—"}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  p.published === false ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                                }`}
                              >
                                {p.published === false ? "Draft" : "Published"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{p.date || fmtDate(p.created_at)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2">
                                {p.slug && p.published !== false && (
                                  <a
                                    href={`/blog/${p.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg text-slate-500 hover:bg-green-50 hover:text-green-700"
                                    title="View"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                <button
                                  onClick={() => {
                                    setPostMsg(null);
                                    setEditing(p);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-500 hover:bg-green-50 hover:text-green-700"
                                  title="Edit"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deletePost(p.id)}
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "blog" && editing && (
              <div className="bg-white border border-green-100 rounded-2xl shadow-sm p-6 sm:p-8 max-w-3xl">
                <h2 className="font-heading font-bold text-lg text-green-900 mb-5">
                  {editing.id ? "Edit Post" : "New Post"}
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Title *</label>
                    <input className={inputCls} value={editing.title || ""} onChange={(e) => setField("title", e.target.value)} placeholder="Post title" />
                  </div>
                  <div>
                    <label className={labelCls}>Slug (URL)</label>
                    <input className={inputCls} value={editing.slug || ""} onChange={(e) => setField("slug", e.target.value)} placeholder="auto from title" />
                  </div>
                  <div>
                    <label className={labelCls}>Category</label>
                    <input className={inputCls} value={editing.category || ""} onChange={(e) => setField("category", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Author</label>
                    <input className={inputCls} value={editing.author || ""} onChange={(e) => setField("author", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Display date</label>
                    <input className={inputCls} value={editing.date || ""} onChange={(e) => setField("date", e.target.value)} placeholder="e.g. June 15, 2026 (auto if blank)" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Cover image URL</label>
                    <input className={inputCls} value={editing.image || ""} onChange={(e) => setField("image", e.target.value)} placeholder="https://…" />
                    {editing.image ? (
                      <img src={editing.image} alt="cover preview" className="mt-2 h-28 w-full object-cover rounded-xl border border-green-100" />
                    ) : null}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Excerpt (short summary on the card)</label>
                    <textarea className={inputCls} rows={2} value={editing.excerpt || ""} onChange={(e) => setField("excerpt", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Body content</label>
                    <textarea
                      className={`${inputCls} font-mono text-xs leading-relaxed`}
                      rows={14}
                      value={editing.content || ""}
                      onChange={(e) => setField("content", e.target.value)}
                      placeholder={"Write your article here.\n\nLeave a blank line between paragraphs.\n\n## This becomes a heading\n\n- This becomes\n- a bullet list\n\nLinks: [text](https://example.com)"}
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Blank line = new paragraph · <code>## </code> = heading · lines starting with <code>- </code> = bullet list · <code>[text](url)</code> = link
                    </p>
                  </div>
                  <div>
                    <label className={labelCls}>SEO meta description</label>
                    <input className={inputCls} value={editing.meta || ""} onChange={(e) => setField("meta", e.target.value)} placeholder="defaults to excerpt" />
                  </div>
                  <div>
                    <label className={labelCls}>SEO focus keyword</label>
                    <input className={inputCls} value={editing.keyword || ""} onChange={(e) => setField("keyword", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>CTA button text</label>
                    <input className={inputCls} value={editing.ctaText || ""} onChange={(e) => setField("ctaText", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>CTA link</label>
                    <input className={inputCls} value={editing.ctaLink || ""} onChange={(e) => setField("ctaLink", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editing.published !== false}
                        onChange={(e) => setField("published", e.target.checked)}
                        className="w-4 h-4 accent-green-700"
                      />
                      Published (visible on the site)
                    </label>
                  </div>
                </div>

                {postMsg && <p className="text-xs text-red-600 mt-4">{postMsg}</p>}

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={savePost}
                    disabled={savingPost}
                    className="px-5 py-2.5 bg-[#2F5D50] hover:bg-[#23483E] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-60"
                  >
                    {savingPost ? "Saving…" : "Save Post"}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(null);
                      setPostMsg(null);
                    }}
                    className="px-5 py-2.5 border border-green-200 bg-white text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-green-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {tab === "settings" && (
              <div className="bg-white border border-green-100 rounded-2xl shadow-sm p-6 sm:p-8 max-w-xl">
                <h2 className="font-heading font-bold text-lg text-green-900 mb-1">Pricing settings</h2>
                <p className="text-xs text-slate-500 mb-5">
                  These control the prices shown on the site <strong>and</strong> the amount charged by Razorpay.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Registration amount (₹)</label>
                    <input
                      type="number"
                      min={1}
                      className={inputCls}
                      value={settings.registerAmount}
                      onChange={(e) => setSettings((s) => ({ ...s, registerAmount: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>60-Day Program amount (₹)</label>
                    <input
                      type="number"
                      min={1}
                      className={inputCls}
                      value={settings.courseAmount}
                      onChange={(e) => setSettings((s) => ({ ...s, courseAmount: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>60-Day strike-through / original (₹)</label>
                    <input
                      type="number"
                      min={0}
                      className={inputCls}
                      value={settings.courseOriginal}
                      onChange={(e) => setSettings((s) => ({ ...s, courseOriginal: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Discount label</label>
                    <input
                      className={inputCls}
                      value={settings.discountLabel}
                      onChange={(e) => setSettings((s) => ({ ...s, discountLabel: e.target.value }))}
                      placeholder="e.g. 30% OFF"
                    />
                  </div>
                </div>
                {settingsMsg && <p className="text-xs mt-4 text-green-700">{settingsMsg}</p>}
                <button
                  onClick={saveSettings}
                  disabled={savingSettings}
                  className="mt-6 px-5 py-2.5 bg-[#2F5D50] hover:bg-[#23483E] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-60"
                >
                  {savingSettings ? "Saving…" : "Save settings"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
