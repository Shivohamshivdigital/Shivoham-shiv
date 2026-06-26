import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, HeartPulse } from "lucide-react";
import SEO from "../components/SEO";
import { getAttribution } from "../utils/attribution";

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

export default function AssessmentView() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(empty);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

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

  const paid = params.get("paid") === "1";

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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "assessment",
          ...form,
          conditions: form.conditions.join(", "),
          paid,
          attribution: getAttribution(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not submit. Please try again.");
      (window as any).fbq?.("track", "CompleteRegistration");
      (window as any).gtag?.("event", "generate_lead", { event_label: "health_assessment" });
      setDone(true);
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const input =
    "w-full px-3.5 py-2.5 rounded-xl border border-green-150 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500";
  const label = "block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5";

  if (done) {
    return (
      <div className="min-h-screen bg-[#FAFBF7] flex items-start justify-center px-4 pt-12 sm:pt-16 pb-24 font-sans">
        <SEO title="Assessment submitted — Shivoham Shiv" description="Your health assessment has been received." />
        <div className="max-w-lg w-full bg-white border border-green-100 rounded-3xl shadow-sm p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-green-900 mb-2">Thank you, {form.fullName.split(" ")[0] || "there"}! 🎉</h1>
          <p className="text-sm text-slate-600 leading-relaxed mb-7">
            Your health assessment is in. Our team will review it and reach out on WhatsApp within 24 hours with your
            personalized plan.
          </p>
          <div className="flex flex-col gap-3">
            {!paid && (
              <Link to="/weight-loss" className="w-full px-6 py-3.5 bg-[#2F5D50] hover:bg-[#23483E] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all">
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
                <input type="email" className={input} value={form.email} onChange={(e) => set("email", e.target.value)} />
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
