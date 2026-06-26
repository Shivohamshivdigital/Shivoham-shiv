import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  CreditCard,
  ClipboardList,
  MessageCircle,
  LogOut,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import SEO from "../components/SEO";
import { fetchMe, getSession, clearSession, displayName, SessionUser } from "../utils/session";

interface DashboardViewProps {
  onSetBanner: (message: string) => void;
  onStatsUpdated: () => void;
  updateTrigger?: number;
}

function fmtDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium" });
  } catch {
    return iso;
  }
}

export default function DashboardView({ onSetBanner }: DashboardViewProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [assessment, setAssessment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    // Not logged in → send to login (and come back here afterwards).
    if (!getSession()) {
      navigate("/login?redirect=/dashboard", { replace: true });
      return;
    }
    fetchMe().then((d) => {
      if (!d) {
        navigate("/login?redirect=/dashboard", { replace: true });
        return;
      }
      setUser(d.user);
      setAssessment(d.assessment);
      setLoading(false);
    });
  }, [navigate]);

  const logout = () => {
    clearSession();
    onSetBanner("You've been logged out.");
    navigate("/", { replace: true });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#FAFBF7] flex items-center justify-center font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-green-700" />
      </div>
    );
  }

  const name = (assessment && assessment.full_name) || displayName(user.email);
  const phone = user.phone || user.contact || "";
  const plan = user.paidPlan || user.lastPlan || "";
  const planLabel = plan === "register" ? "Registration (₹999)" : plan === "course" ? "60-Day Program" : plan || "—";
  const assessmentQ = new URLSearchParams({ paid: user.paid ? "1" : "0" });
  if (user.email) assessmentQ.set("email", user.email);
  if (phone) assessmentQ.set("phone", phone);

  return (
    <div className="bg-[#FAFBF7] min-h-screen py-12 font-sans">
      <SEO
        title="My Account — Shivoham Shiv"
        description="Your Shivoham Shiv account: membership status, health assessment and support."
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-green-700 text-cream flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              {name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-green-700">My Account</span>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-green-900 mt-0.5">Namaste, {name}!</h1>
              <p className="text-xs text-slate-500 mt-1">
                {user.email} · Member since {fmtDate(user.created_at)}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 bg-white text-red-600 text-xs font-bold hover:bg-red-50 transition-colors self-start"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>

        {/* Membership status banner */}
        <div
          className={`rounded-3xl p-6 sm:p-7 mb-6 border ${
            user.paid ? "bg-green-900 border-green-800 text-cream" : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          {user.paid ? (
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg">You're enrolled 🎉</h2>
                <p className="text-xs text-green-100/80 mt-1 leading-relaxed">
                  Plan: <strong>{planLabel}</strong>
                  {user.paidAt ? ` · Activated ${fmtDate(user.paidAt)}` : ""}. Our team will guide your
                  transformation on WhatsApp.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg">You're not enrolled yet</h2>
                  <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">
                    Join the Ayurvedic 60-Day program to start your transformation.
                  </p>
                </div>
              </div>
              <Link
                to="/weight-loss"
                className="shrink-0 inline-flex items-center gap-1.5 px-5 py-3 bg-gradient-to-br from-[#5DBB63] to-[#3E9B49] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Enroll now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Health assessment */}
          <div className="bg-white border border-green-100 rounded-3xl shadow-sm p-6">
            <div className="w-11 h-11 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-4">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-green-900 mb-1">Health assessment</h3>
            {assessment ? (
              <>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  <span className="inline-flex items-center gap-1 text-green-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
                  </span>
                  {assessment.created_at ? ` on ${fmtDate(assessment.created_at)}` : ""}. Your details are below.
                </p>
                <a
                  href="#my-assessment"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#2F5D50] hover:bg-[#23483E] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                >
                  View my details <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Fill your details so we can build your personalized Ayurvedic plan. Takes ~2 minutes.
                </p>
                <Link
                  to={`/assessment?${assessmentQ.toString()}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#2F5D50] hover:bg-[#23483E] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                >
                  Open assessment <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Support */}
          <div className="bg-white border border-green-100 rounded-3xl shadow-sm p-6">
            <div className="w-11 h-11 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-green-900 mb-1">Talk to our team</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Questions about your plan, diet or progress? Message us on WhatsApp — we usually reply within hours.
            </p>
            <a
              href="https://wa.me/917317778215"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#25D366] hover:bg-[#1da851] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
            >
              Message on WhatsApp <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Submitted health assessment (read-only) */}
        {assessment && (
          <div id="my-assessment" className="bg-white border border-green-100 rounded-3xl shadow-sm p-6 sm:p-7 mb-6 scroll-mt-24">
            <div className="flex items-center gap-2 mb-5">
              <ClipboardList className="w-5 h-5 text-green-700" />
              <h3 className="font-heading font-bold text-base text-green-900">Your health assessment</h3>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {(
                [
                  ["Full name", assessment.full_name],
                  ["Age", assessment.age],
                  ["Gender", assessment.gender],
                  ["Mobile", assessment.mobile],
                  ["City & State", assessment.city_state],
                  ["Current weight (kg)", assessment.current_weight],
                  ["Height (cm)", assessment.height],
                  ["Target weight (kg)", assessment.target_weight],
                  ["Kg to lose", assessment.kg_to_lose],
                  ["Conditions", [assessment.conditions, assessment.conditions_other].filter(Boolean).join(", ")],
                  ["Medications", assessment.medications],
                  ["Recent surgery", assessment.surgery],
                  ["Pregnant/breastfeeding", assessment.pregnant],
                  ["Why lose weight", assessment.why_lose_weight],
                  ["Biggest challenge", assessment.biggest_challenge],
                ] as [string, string | undefined][]
              ).map(([k, v]) => (
                <div
                  key={k}
                  className={
                    k === "Why lose weight" || k === "Biggest challenge" || k === "Conditions" ? "sm:col-span-2" : ""
                  }
                >
                  <dt className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{k}</dt>
                  <dd className="text-slate-700 mt-0.5 break-words">{v || "—"}</dd>
                </div>
              ))}
            </dl>
            <p className="text-[11px] text-slate-400 mt-5">
              Need to change something?{" "}
              <a href="https://wa.me/917317778215" target="_blank" rel="noreferrer" className="text-green-700 font-semibold hover:underline">
                Message us on WhatsApp
              </a>{" "}
              and we'll update it.
            </p>
          </div>
        )}

        {/* Account details */}
        <div className="bg-white border border-green-100 rounded-3xl shadow-sm p-6 sm:p-7">
          <h3 className="font-heading font-bold text-base text-green-900 mb-5">Account details</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Email</dt>
              <dd className="text-slate-700 mt-0.5">{user.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Phone / WhatsApp</dt>
              <dd className="text-slate-700 mt-0.5">{phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Email verified</dt>
              <dd className="mt-0.5 flex items-center gap-1.5 text-slate-700">
                {user.verified ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> Verified
                  </>
                ) : (
                  "Not verified"
                )}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Membership</dt>
              <dd className="text-slate-700 mt-0.5">{user.paid ? planLabel : "Free account"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
