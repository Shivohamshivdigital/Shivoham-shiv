import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  CreditCard,
  ClipboardList,
  LogOut,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Home,
  Compass,
  BookOpen,
  User,
  PersonStanding,
  Wind,
  Hand,
  Fingerprint,
  Brain,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import SEO from "../components/SEO";
import { fetchMe, getSession, clearSession, displayName, SessionUser } from "../utils/session";

interface DashboardViewProps {
  onSetBanner: (message: string) => void;
  onStatsUpdated: () => void;
  updateTrigger?: number;
}

const WHATSAPP = "https://wa.me/917317778215";

function fmtDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium" });
  } catch {
    return iso;
  }
}

// A small decorative lotus + seated figure, matching the app mockup.
function Lotus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g fill="#F6C64B">
        {[-52, -26, 0, 26, 52].map((d) => (
          <ellipse key={d} cx="60" cy="58" rx="9" ry="26" transform={`rotate(${d} 60 84)`} />
        ))}
      </g>
      <g fill="#EBB93F">
        <ellipse cx="60" cy="58" rx="8" ry="24" transform="rotate(-14 60 84)" />
        <ellipse cx="60" cy="58" rx="8" ry="24" transform="rotate(14 60 84)" />
      </g>
      {/* seated meditation figure */}
      <circle cx="60" cy="46" r="9" fill="#2F5D50" />
      <path
        d="M60 56 C 47 60, 40 74, 44 82 C 53 87, 67 87, 76 82 C 80 74, 73 60, 60 56 Z"
        fill="#2F5D50"
      />
    </svg>
  );
}

export default function DashboardView({ onSetBanner }: DashboardViewProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [assessment, setAssessment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
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
  const firstName = String(name).trim().split(/\s+/)[0] || name;
  const phone = user.phone || user.contact || "";
  const plan = user.paidPlan || user.lastPlan || "";
  const planLabel = plan === "register" ? "Registration (₹999)" : plan === "course" ? "40-Day Program" : plan || "—";
  const assessmentQ = new URLSearchParams({ paid: user.paid ? "1" : "0" });
  if (user.email) assessmentQ.set("email", user.email);
  if (phone) assessmentQ.set("phone", phone);

  // Feature tiles (mirror the mockup) — each links to a real page.
  const tiles: { label: string; to: string; icon: any }[] = [
    { label: "Yoga", to: "/courses", icon: PersonStanding },
    { label: "Meditation", to: "/challenge", icon: Wind },
    { label: "Mudra Therapy", to: "/courses/mudra-therapy", icon: Hand },
    { label: "Marma Dab Chikitsa", to: "/courses/acupressure-therapy", icon: Fingerprint },
    { label: "Mindfulness", to: "/courses/corp-wellness", icon: Brain },
    { label: "Wellness Courses", to: "/courses", icon: GraduationCap },
  ];

  return (
    <div className="bg-[#FAFBF7] min-h-screen font-sans">
      <SEO
        title="My Wellness Journey — Shivoham Shiv"
        description="Your Shivoham Shiv wellness dashboard: daily practice, courses, assessment and account."
      />

      <div className="max-w-md lg:max-w-4xl mx-auto px-4 lg:px-8 pt-6 pb-8">
        {/* Greeting card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-[#EEF7EE] border border-green-100 shadow-sm p-6 lg:p-9 pr-28 lg:pr-48">
          <span className="text-[11px] uppercase font-bold tracking-widest text-green-700">Your Wellness Journey</span>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-green-900 mt-1">Namaste, {firstName}</h1>
          <p className="text-sm lg:text-base font-semibold text-[#E8943A] mt-1">Breathe. Heal. Glow.</p>
          <Lotus className="w-28 h-28 lg:w-44 lg:h-44 absolute -right-1 lg:right-4 top-1/2 -translate-y-1/2 opacity-95" />
        </div>

        {/* Membership status (slim) */}
        {user.paid ? (
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-green-900 text-cream px-4 py-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs leading-snug">
              You're enrolled — <strong>{planLabel}</strong>. Our team guides you on WhatsApp.
            </p>
          </div>
        ) : (
          <Link
            to="/weight-loss"
            className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 hover:bg-amber-100 transition-colors"
          >
            <span className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-amber-600 shrink-0" />
              <span className="text-xs text-amber-900 leading-snug">
                You're not enrolled yet — <strong>join the 40-Day program</strong>.
              </span>
            </span>
            <ArrowRight className="w-4 h-4 text-amber-600 shrink-0" />
          </Link>
        )}

        {/* Feature tiles */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 mt-5">
          {tiles.map((t) => (
            <Link
              key={t.label}
              to={t.to}
              className="flex flex-col items-center justify-start gap-2 lg:gap-3 bg-white border border-green-100 rounded-2xl p-3 pt-4 lg:py-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all text-center"
            >
              <span className="w-11 h-11 lg:w-14 lg:h-14 rounded-xl bg-[#EEF7EE] text-[#2F5D50] flex items-center justify-center">
                <t.icon className="w-5 h-5 lg:w-6 lg:h-6" />
              </span>
              <span className="text-[11px] lg:text-xs font-semibold text-[#3A4A40] leading-tight">{t.label}</span>
            </Link>
          ))}
        </div>

        {/* Daily Practice + Health assessment (side-by-side on desktop) */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2 lg:items-stretch">
        {/* Daily Practice banner */}
        <Link
          to="/challenge"
          className="flex items-center gap-4 rounded-2xl bg-[#E8F0EA] border border-green-100 p-4 lg:p-6 hover:bg-[#E2EDE4] transition-colors lg:h-full"
        >
          <span className="w-12 h-12 rounded-2xl bg-[#2F5D50] text-white flex items-center justify-center shrink-0">
            <PersonStanding className="w-6 h-6" />
          </span>
          <span className="flex-1">
            <b className="block font-heading font-bold text-green-900 text-sm">Daily Practice</b>
            <span className="text-xs text-slate-500">For a balanced you</span>
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-[#2F5D50] whitespace-nowrap">
            Start <ChevronRight className="w-4 h-4" />
          </span>
        </Link>

        {/* Health assessment */}
        <div className="bg-white border border-green-100 rounded-2xl shadow-xs p-5 lg:h-full">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-5 h-5 text-green-700" />
            <h3 className="font-heading font-bold text-sm text-green-900">Health assessment</h3>
          </div>
          {assessment ? (
            <>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
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
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
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
        </div>

        {/* Submitted health assessment (read-only) */}
        {assessment && (
          <div id="my-assessment" className="mt-5 bg-white border border-green-100 rounded-2xl shadow-xs p-5 scroll-mt-24">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-green-700" />
              <h3 className="font-heading font-bold text-sm text-green-900">Your health assessment</h3>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-sm">
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
            <p className="text-[11px] text-slate-400 mt-4">
              Need to change something?{" "}
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="text-green-700 font-semibold hover:underline">
                Message us on WhatsApp
              </a>{" "}
              and we'll update it.
            </p>
          </div>
        )}

        {/* Account details */}
        <div className="mt-5 bg-white border border-green-100 rounded-2xl shadow-xs p-5">
          <h3 className="font-heading font-bold text-sm text-green-900 mb-4">Account details</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Email</dt>
              <dd className="text-slate-700 mt-0.5 break-words">{user.email || "—"}</dd>
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
            <div>
              <dt className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Member since</dt>
              <dd className="text-slate-700 mt-0.5">{fmtDate(user.created_at)}</dd>
            </div>
          </dl>
          <div className="mt-5 pt-4 border-t border-green-100">
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
        </div>
      </div>

      {/* Bottom app nav (mobile only — desktop uses the site navbar) */}
      <div className="sticky bottom-0 z-30 pointer-events-none px-4 pb-3 lg:hidden">
        <nav className="pointer-events-auto max-w-md mx-auto bg-white/95 backdrop-blur border border-green-100 rounded-2xl shadow-lg flex items-center justify-around px-2 py-2">
          <span className="flex flex-col items-center gap-0.5 px-3 py-1 text-[#E8943A]">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold">Home</span>
          </span>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-0.5 px-3 py-1 text-slate-400 hover:text-green-700 transition-colors">
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Guidance</span>
          </a>
          <Link to="/courses" className="flex flex-col items-center gap-0.5 px-3 py-1 text-slate-400 hover:text-green-700 transition-colors">
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Learn</span>
          </Link>
          <a href="#my-account" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 99999, behavior: "smooth" }); }} className="flex flex-col items-center gap-0.5 px-3 py-1 text-slate-400 hover:text-green-700 transition-colors">
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Profile</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
