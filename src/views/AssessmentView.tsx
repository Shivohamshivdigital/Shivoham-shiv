import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, HeartPulse, ShieldCheck } from "lucide-react";
import SEO from "../components/SEO";
import { getAttribution } from "../utils/attribution";
import { getSession, setSession, fetchMe } from "../utils/session";

const CONDITIONS = [
  "Diabetes",
  "Thyroid Disorder",
  "High Blood Pressure",
  "PCOS/PCOD",
  "Fatty Liver",
  "High Cholesterol",
  "Joint Pain",
  "None",
];

interface Form {
  fullName: string;
  age: string;
  gender: string;
  mobile: string;
  email: string;
  cityState: string;
  currentWeight: string;
  height: string;
  targetWeight: string;
  conditions: string[];
  conditionsOther: string;
  medications: string;
  surgery: string;
  pregnant: string;
  whyLoseWeight: string;
  kgToLose: string;
  biggestChallenge: string;
}

const empty: Form = {
  fullName: "",
  age: "",
  gender: "",
  mobile: "",
  email: "",
  cityState: "",
  currentWeight: "",
  height: "",
  targetWeight: "",
  conditions: [],
  conditionsOther: "",
  medications: "",
  surgery: "",
  pregnant: "",
  whyLoseWeight: "",
  kgToLose: "",
  biggestChallenge: "",
};

const STEPS = ["Your details", "Body metrics", "Health profile", "Your goals"];

type Phase = "form" | "otp" | "done" | "already";

export default function AssessmentView() {
  const [params] = useSearchParams();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(empty);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");
  const [otp, setOtp] = useState("");
  const [otpInfo, setOtpInfo] = useState<string | null>(null);
  const [existing, setExisting] = useState<any | null>(null);
  const [paidState, setPaidState] = useState(params.get("paid") === "1");

  // Prefill from the signup/payment flow if available.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setForm((f) => ({
      ...f,
      email: params.get("email") || f.email,
      fullName: params.get("name") || f.fullName,
      mobile: params.get("phone") || f.mobile,
    }));
  }, [params]);

  // When logged in, the email is fixed to the account (primary) email and
  // can't be edited — the assessment is owned by this email.
  const sessionEmail = getSession()?.email || "";
  useEffect(() => {
    if (sessionEmail) setForm((f) => ({ ...f, email: sessionEmail }));
  }, [sessionEmail]);

  // If already logged in, prefill from the account and block re-submitting
  // when an assessment already exists (show their details instead).
  useEffect(() => {
    if (!getSession()) return;
    fetchMe().then((d) => {
      if (!d) return;
      if (d.user?.paid) setPaidState(true);
      setForm((f) => ({
        ...f,
        email: f.email || d.user?.email || "",
        mobile: f.mobile || d.user?.phone || d.user?.contact || "",
      }));
      if (d.assessment) {
        setExisting(d.assessment);
        setPhase("already");
      }
    });
  }, []);

  const paid = paidState;

  const set = (k: keyof Form, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const toggleCondition = (c: string) =>
    setForm((f) => {
      if (c === "None") return { ...f, conditions: f.conditions.includes("None") ? [] : ["None"] };
      const without = f.conditions.filter((x) => x !== "None");
      return { ...f, conditions: without.includes(c) ? without.filter((x) => x !== c) : [...without, c] };
    });

  const validateStep = (): string | null => {
    if (step === 0) {
      if (!form.fullName.trim()) return "Please enter your full name.";
      if (!form.age.trim()) return "Please enter your age.";
      if (!form.gender) return "Please select your gender.";
      if (form.mobile.replace(/\D/g, "").length < 10) return "Please enter a valid mobile number.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email.";
      if (!form.cityState.trim()) return "Please enter your city & state.";
    } else if (step === 1) {
      if (!form.currentWeight.trim()) return "Please enter your current weight.";
      if (!form.height.trim()) return "Please enter your height.";
      if (!form.targetWeight.trim()) return "Please enter your target weight.";
    } else if (step === 2) {
      if (form.conditions.length === 0 && !form.conditionsOther.trim())
        return "Please select your conditions (or choose None).";
      if (!form.medications.trim()) return "Please answer the medications question.";
      if (!form.surgery.trim()) return "Please answer the surgery question.";
      if (!form.pregnant.trim()) return "Please answer the pregnancy question (write N/A if not applicable).";
    } else if (step === 3) {
      if (!form.whyLoseWeight.trim()) return "Please tell us why you want to lose weight.";
      if (!form.kgToLose.trim()) return "Please enter how many kg you want to lose.";
      if (!form.biggestChallenge.trim()) return "Please tell us your biggest challenge.";
    }
    return null;
  };

  const next = () => {
    const e = validateStep();
    if (e) return setError(e);
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    const e = validateStep();
    if (e) return setError(e);
    setSubmitting(true);
    setError(null);
    try {
      // 1) Save the assessment (one per email — backend dedups).
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "assessment",
          ...form,
          conditions: form.conditions.join(", "),
          paid,
          token: getSession()?.token,
          attribution: getAttribution(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not submit. Please try again.");

      // Already submitted from this email before → show their details.
      if (data.already) {
        const me = getSession() ? await fetchMe() : null;
        if (me?.assessment) setExisting(me.assessment);
        setPhase("already");
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }

      (window as any).fbq?.("track", "CompleteRegistration");
      (window as any).gtag?.("event", "generate_lead", { event_label: "health_assessment" });

      // 2) Already logged in → no need to verify again.
      if (getSession()) {
        setPhase("done");
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }

      // 3) New visitor → open an account: email them a one-time code.
      await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "request", email: form.email, attribution: getAttribution() }),
      });
      setOtpInfo("We've emailed you a 6-digit code to create your account.");
      setPhase("otp");
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Verify the emailed code → create + log into the account, save their phone.
  const verifyOtp = async () => {
    if (otp.length < 6) return setError("Please enter the 6-digit code.");
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "verify", email: form.email, otp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Incorrect code. Please try again.");
      if (data.token) setSession(data.token, data.email || form.email.trim().toLowerCase());
      // Save their phone onto the account (best-effort).
      fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "phone", email: form.email, phone: form.mobile }),
      }).catch(() => {});
      setPhase("done");
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resendOtp = async () => {
    setError(null);
    setOtpInfo(null);
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "resend", email: form.email }),
      });
      setOtpInfo("A new code is on its way.");
    } catch {
      setError("Could not resend the code.");
    }
  };

  const input =
    "w-full px-3.5 py-2.5 rounded-xl border border-green-150 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500";
  const label = "block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5";

  // OTP step — verify email to create the account.
  if (phase === "otp") {
    return (
      <div className="min-h-screen bg-[#FAFBF7] flex items-start justify-center px-4 pt-12 sm:pt-16 pb-24 font-sans">
        <SEO title="Verify your email — Shivoham Shiv" description="Verify your email to create your account." />
        <div className="max-w-md w-full bg-white border border-green-100 rounded-3xl shadow-sm p-8 sm:p-10">
          <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-5">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-green-900 mb-1">Verify your email</h1>
          <p className="text-xs text-slate-500 mb-6">
            We sent a 6-digit code to <span className="text-slate-800 font-semibold">{form.email}</span>. Enter it to
            create your account and save your assessment.
          </p>
          <input
            inputMode="numeric"
            maxLength={6}
            autoFocus
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="------"
            className="w-full text-center tracking-[0.5em] text-2xl font-bold bg-[#FAFBF7] border border-green-200 rounded-xl py-3 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {error && <p className="text-xs text-red-600 mt-3">{error}</p>}
          {otpInfo && <p className="text-xs text-green-700 mt-3">{otpInfo}</p>}
          <button
            onClick={verifyOtp}
            disabled={submitting || otp.length < 6}
            className="w-full mt-5 py-3.5 bg-gradient-to-br from-[#5DBB63] to-[#3E9B49] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Verify & save
          </button>
          <p className="text-center text-xs text-slate-500 mt-5">
            Didn't get it?{" "}
            <button onClick={resendOtp} className="text-green-700 font-bold hover:underline">
              Resend code
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Already submitted — show their saved details (read-only).
  if (phase === "already") {
    const a = existing || {};
    const rows: [string, string | undefined][] = [
      ["Full name", a.full_name],
      ["Age", a.age],
      ["Gender", a.gender],
      ["Mobile", a.mobile],
      ["City & State", a.city_state],
      ["Current weight (kg)", a.current_weight],
      ["Height (cm)", a.height],
      ["Target weight (kg)", a.target_weight],
      ["Kg to lose", a.kg_to_lose],
      ["Conditions", [a.conditions, a.conditions_other].filter(Boolean).join(", ")],
      ["Medications", a.medications],
      ["Recent surgery", a.surgery],
      ["Pregnant/breastfeeding", a.pregnant],
      ["Why lose weight", a.why_lose_weight],
      ["Biggest challenge", a.biggest_challenge],
    ];
    return (
      <div className="min-h-screen bg-[#FAFBF7] flex items-start justify-center px-4 pt-12 sm:pt-16 pb-24 font-sans">
        <SEO title="Your health assessment — Shivoham Shiv" description="Your submitted health assessment." />
        <div className="max-w-lg w-full bg-white border border-green-100 rounded-3xl shadow-sm p-7 sm:p-9">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <h1 className="font-heading font-bold text-xl sm:text-2xl text-green-900">You've already submitted</h1>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Here are the details we have on file. To change anything, message us on WhatsApp.
          </p>
          {existing && (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-sm mb-6">
              {rows.map(([k, v]) => (
                <div key={k} className={k === "Why lose weight" || k === "Biggest challenge" || k === "Conditions" ? "sm:col-span-2" : ""}>
                  <dt className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{k}</dt>
                  <dd className="text-slate-700 mt-0.5 break-words">{v || "—"}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/dashboard" className="flex-1 text-center px-6 py-3 bg-[#2F5D50] hover:bg-[#23483E] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors">
              Go to my account
            </Link>
            <a href="https://wa.me/917317778215" target="_blank" rel="noreferrer" className="flex-1 text-center px-6 py-3 bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors">
              Message on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="min-h-screen bg-[#FAFBF7] flex items-start justify-center px-4 pt-12 sm:pt-16 pb-24 font-sans">
        <SEO title="Assessment submitted — Shivoham Shiv" description="Your health assessment has been received." />
        <div className="max-w-lg w-full bg-white border border-green-100 rounded-3xl shadow-sm p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-green-900 mb-2">Thank you, {form.fullName.split(" ")[0] || "there"}! 🎉</h1>
          <p className="text-sm text-slate-600 leading-relaxed mb-7">
            Your account is created and your health assessment is saved. Our team will review it and reach out on
            WhatsApp within 24 hours with your personalized plan.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/dashboard" className="w-full px-6 py-3.5 bg-[#2F5D50] hover:bg-[#23483E] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all">
              View my details
            </Link>
            {!paid && (
              <Link to="/weight-loss" className="w-full px-6 py-3.5 border-2 border-green-200 text-green-800 hover:bg-green-50 font-bold text-xs uppercase tracking-wider rounded-xl transition-all">
                Enroll in the program
              </Link>
            )}
            <a href="https://wa.me/917317778215" target="_blank" rel="noreferrer" className="w-full px-6 py-3.5 bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all">
              Message us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBF7] px-4 py-12 sm:py-16 font-sans">
      <SEO title="Free Health Assessment — Shivoham Shiv" description="Get your personalized Ayurvedic weight-loss plan. Fill the quick health assessment." />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-3">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#2F5233]">Health Assessment</h1>
          <p className="text-sm text-slate-600 mt-2">A few quick questions so we can build your personalized plan.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full ${i <= step ? "bg-[#4A7C59]" : "bg-green-100"}`} />
              <span className={`mt-1.5 block text-[10px] font-bold uppercase tracking-wider ${i === step ? "text-[#2F5233]" : "text-slate-400"}`}>{s}</span>
            </div>
          ))}
        </div>

        <div className="bg-white border border-green-100 rounded-3xl shadow-sm p-6 sm:p-8">
          {step === 0 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={label}>Full Name *</label>
                <input className={input} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
              </div>
              <div>
                <label className={label}>Age *</label>
                <input type="number" className={input} value={form.age} onChange={(e) => set("age", e.target.value)} />
              </div>
              <div>
                <label className={label}>Gender *</label>
                <select className={input} value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                  <option value="">Select…</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className={label}>Mobile Number *</label>
                <input type="tel" className={input} value={form.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="+91…" />
              </div>
              <div>
                <label className={label}>Email Address *</label>
                <input
                  type="email"
                  className={`${input} ${sessionEmail ? "bg-slate-50 text-slate-500 cursor-not-allowed" : ""}`}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  readOnly={!!sessionEmail}
                  title={sessionEmail ? "This is your account email and can't be changed." : undefined}
                />
                {sessionEmail && <p className="text-[10px] text-slate-400 mt-1">Your account email — can't be edited</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={label}>City & State *</label>
                <input className={input} value={form.cityState} onChange={(e) => set("cityState", e.target.value)} placeholder="e.g. Jhansi, Uttar Pradesh" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={label}>Current Weight (kg) *</label>
                <input type="number" className={input} value={form.currentWeight} onChange={(e) => set("currentWeight", e.target.value)} />
              </div>
              <div>
                <label className={label}>Height (cm) *</label>
                <input type="number" className={input} value={form.height} onChange={(e) => set("height", e.target.value)} />
              </div>
              <div>
                <label className={label}>Target Weight (kg) *</label>
                <input type="number" className={input} value={form.targetWeight} onChange={(e) => set("targetWeight", e.target.value)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className={label}>Do you have any of the following? (Select all that apply)</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {CONDITIONS.map((c) => (
                    <label key={c} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl border cursor-pointer transition-colors ${form.conditions.includes(c) ? "border-[#4A7C59] bg-green-50 text-[#2F5233] font-semibold" : "border-green-150 text-slate-700"}`}>
                      <input type="checkbox" checked={form.conditions.includes(c)} onChange={() => toggleCondition(c)} className="w-4 h-4 accent-green-700" />
                      {c}
                    </label>
                  ))}
                </div>
                <input className={`${input} mt-2`} value={form.conditionsOther} onChange={(e) => set("conditionsOther", e.target.value)} placeholder="Other (please specify)" />
              </div>
              <div>
                <label className={label}>Are you currently taking any medications? *</label>
                <input className={input} value={form.medications} onChange={(e) => set("medications", e.target.value)} placeholder="Yes (which ones) / No" />
              </div>
              <div>
                <label className={label}>Any major surgery in the last 12 months? *</label>
                <input className={input} value={form.surgery} onChange={(e) => set("surgery", e.target.value)} placeholder="Yes (details) / No" />
              </div>
              <div>
                <label className={label}>Are you pregnant or breastfeeding? *</label>
                <input className={input} value={form.pregnant} onChange={(e) => set("pregnant", e.target.value)} placeholder="Yes / No / N/A" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className={label}>Why do you want to lose weight? *</label>
                <textarea rows={3} className={input} value={form.whyLoseWeight} onChange={(e) => set("whyLoseWeight", e.target.value)} />
              </div>
              <div>
                <label className={label}>How many kilograms do you want to lose? *</label>
                <input className={input} value={form.kgToLose} onChange={(e) => set("kgToLose", e.target.value)} placeholder="e.g. 8 kg" />
              </div>
              <div>
                <label className={label}>What is your biggest challenge in losing weight? *</label>
                <textarea rows={3} className={input} value={form.biggestChallenge} onChange={(e) => set("biggestChallenge", e.target.value)} />
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-600 mt-4">{error}</p>}

          <div className="flex items-center justify-between gap-3 mt-7">
            <button onClick={back} disabled={step === 0} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-green-200 text-slate-600 text-xs font-bold disabled:opacity-40 hover:bg-green-50 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={next} className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#2F5D50] hover:bg-[#23483E] text-white text-xs font-bold uppercase tracking-wider transition-colors">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={submit} disabled={submitting} className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-br from-[#5DBB63] to-[#3E9B49] text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-60">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Submit assessment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
