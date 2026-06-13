import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Lock, RefreshCw, LogOut, Users, CreditCard } from "lucide-react";

interface Lead {
  id: string;
  created_at: string;
  name?: string;
  email?: string;
  whatsapp?: string;
  message?: string;
  source?: string;
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

const PW_KEY = "shivoham_admin_pw";

function fmtDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export default function AdminView() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tab, setTab] = useState<"leads" | "payments">("leads");

  const fetchData = useCallback(async (pw: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
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
      setAuthed(true);
      sessionStorage.setItem(PW_KEY, pw);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

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
  };

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
            <p className="text-xs text-slate-500 mb-6">Enter the admin password to view leads &amp; payments.</p>
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
                  onClick={() => fetchData(password || sessionStorage.getItem(PW_KEY) || "")}
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
            <div className="flex gap-2 mb-5">
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
            </div>

            <div className="bg-white border border-green-100 rounded-2xl shadow-sm overflow-x-auto">
              {tab === "leads" ? (
                <table className="w-full text-left text-xs">
                  <thead className="bg-green-50 text-green-900 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">WhatsApp</th>
                      <th className="px-4 py-3">Source</th>
                      <th className="px-4 py-3">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No leads yet.</td></tr>
                    ) : leads.map((l) => (
                      <tr key={l.id} className="border-t border-green-50 hover:bg-green-50/40">
                        <td className="px-4 py-3 whitespace-nowrap text-slate-500">{fmtDate(l.created_at)}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{l.name || "—"}</td>
                        <td className="px-4 py-3 text-slate-600">{l.email || "—"}</td>
                        <td className="px-4 py-3 text-slate-600">{l.whatsapp || "—"}</td>
                        <td className="px-4 py-3 text-slate-600">{l.source || "—"}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={l.message}>{l.message || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
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
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No payments yet.</td></tr>
                    ) : payments.map((p) => (
                      <tr key={p.id} className="border-t border-green-50 hover:bg-green-50/40">
                        <td className="px-4 py-3 whitespace-nowrap text-slate-500">{fmtDate(p.created_at)}</td>
                        <td className="px-4 py-3 text-slate-700">{p.plan || "—"}</td>
                        <td className="px-4 py-3 font-semibold text-green-800">{p.amount != null ? `₹${p.amount}` : "—"}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{p.name || "—"}</td>
                        <td className="px-4 py-3 text-slate-600">{p.email || "—"}</td>
                        <td className="px-4 py-3 text-slate-600">{p.contact || "—"}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-[10px]">{p.razorpay_payment_id || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
