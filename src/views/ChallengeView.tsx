import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Zap,
  Flame,
  Moon,
  CheckCircle2,
  ShieldCheck,
  Clock,
  HandHeart,
  Loader2,
  ChevronDown,
  Star,
} from "lucide-react";
import SEO from "../components/SEO";
import AuthModal from "../components/AuthModal";
import { startPayment } from "../services/paymentService";
import { setSession } from "../utils/session";

const PHASES = [
  {
    icon: Zap,
    tag: "Phase 1 · Days 1–5",
    title: "Energy & Stress Reset",
    desc: "Switch off the stress loop that keeps you tired and wired. Instant-calm mudras, a caffeine-free morning breath, and pressure points that melt tension in seconds.",
  },
  {
    icon: Flame,
    tag: "Phase 2 · Days 6–10",
    title: "Digestion & Detox",
    desc: "Fire up sluggish digestion, beat bloating, and switch your metabolism back on — using simple finger alignments and your Ayurvedic body type.",
  },
  {
    icon: Moon,
    tag: "Phase 3 · Days 11–14",
    title: "Better Sleep & Focus",
    desc: "Wind down a busy mind before bed, ease into rest, sharpen daytime focus, and settle everything into one simple 5-minute daily routine.",
  },
];

const DAYS = [
  "Introduction to your body's micro-currents & the instant-calm mudra",
  "Activate the root chakra to dissolve workspace anxiety",
  "The 3-minute morning breath that replaces caffeine",
  "Map your hand's acupressure points for instant tension relief",
  "Release neck & shoulder stiffness using simple Marma nodes",
  "The Ayurvedic 'fire-activating' gesture for heavy meals",
  "Eliminate bloating with a morning finger alignment",
  "Mudras that switch metabolism & fat-burning back on",
  "The 10-minute digital-detox routine before sleep",
  "Discover your body type (Dosha) — no lab tests",
  "The 'deep sleep' gesture for insomnia & racing thoughts",
  "Boost daily focus & clarity during afternoon fatigue",
  "Put it together into a 5-minute morning ritual",
  "From micro-gestures to deep, lasting transformation",
];

const INCLUDED = [
  "14 daily guided lessons (one every morning)",
  "Traditional Mudra, Marma & acupressure techniques — about 3 minutes each",
  "No pills, no equipment — just your hands and breath",
  "A simple 5-minute daily routine to keep after the challenge",
  "Ayurvedic body-type (Dosha) self-assessment",
  "Guidance on WhatsApp from the Shivoham Shiv team",
  "One-time ₹1 — no subscription, no auto-debit",
];

const FAQS = [
  {
    q: "Will I be charged again or auto-debited?",
    a: "No. It's a single one-time ₹1 payment through Razorpay. There is no subscription, no auto-renewal and no UPI auto-mandate — we will never charge you automatically. Any deeper course later is completely optional and separately priced, only if you choose it.",
  },
  {
    q: "What exactly do I get for ₹1?",
    a: "Access to all 14 daily lessons of the challenge — traditional Mudra, Marma and acupressure techniques you can do in about 3 minutes a day, plus guidance on WhatsApp from our team.",
  },
  {
    q: "Is this a weight-loss or medical treatment?",
    a: "No. This is a general Ayurvedic wellness habit challenge focused on daily energy, stress, digestion and sleep. It is not a weight-loss program and not a substitute for medical care. Persistent fatigue, pain or any health condition should be evaluated by a doctor.",
  },
  {
    q: "Is a 14-day result realistic?",
    a: "We don't promise a cure or a transformation in 14 days. Real, lasting change takes consistent effort over months. What the 14 days give you is a simple daily habit and the techniques to keep building on — results vary from person to person.",
  },
  {
    q: "Do I need any experience or equipment?",
    a: "None. Every technique uses only your hands and breath, and each lesson is beginner-friendly.",
  },
];

export default function ChallengeView() {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const startJoin = () => {
    setError(null);
    setAuthOpen(true);
  };

  const handleAuthSuccess = async (email: string, phone: string, token?: string) => {
    if (token) setSession(token, email);
    setAuthOpen(false);
    setPaying(true);
    setError(null);
    try {
      await startPayment("challenge", { email, contact: phone });
      const q = new URLSearchParams({ plan: "challenge", amount: "1", email, phone });
      navigate(`/thank-you?${q.toString()}`);
    } catch (err: any) {
      setError(err.message || "Payment could not complete. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const CTA = ({ className = "" }: { className?: string }) => (
    <button
      onClick={startJoin}
      disabled={paying}
      className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-[#E8943A] to-[#C96E29] hover:from-[#EFAF3C] hover:to-[#B25D1D] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 ${className}`}
    >
      {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
      {paying ? "Opening payment…" : "Join the challenge — ₹1"}
    </button>
  );

  return (
    <div className="bg-[#FAFBF7] font-sans">
      <SEO
        title="14-Day Vedic Healing Challenge — Just ₹1 | Shivoham Shiv"
        description="A guided 14-day Ayurvedic habit challenge to support your everyday energy, digestion & sleep — Mudra, Marma & breathing, about 3 minutes a day. One-time ₹1, no subscription. Not a medical treatment."
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2F5D50] to-[#23483E] text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold uppercase tracking-widest text-amber-200 mb-6">
            <Sparkles className="w-3.5 h-3.5" /> 14-Day Vedic Healing Challenge
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl leading-tight mb-5 text-white">
            Feel calmer, clearer &amp; more energetic —<br />
            <span className="text-amber-300">one simple habit a day</span>
          </h1>
          <p className="text-sm sm:text-lg text-green-50/85 max-w-2xl mx-auto leading-relaxed mb-6">
            A guided 14-day introduction to traditional Ayurvedic <strong>Mudra, Marma &amp; breathing</strong>
            practices — about 3 minutes a day to support your everyday energy, digestion and sleep. It's a gentle
            daily habit, not a medical treatment or a quick fix.
          </p>
          <p className="text-[11px] sm:text-xs text-green-100/60 max-w-xl mx-auto leading-relaxed mb-8">
            Persistent tiredness, pain or health concerns should be checked by a doctor — these practices support
            daily wellbeing and do not diagnose, treat or cure any condition.
          </p>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-green-200/60 line-through text-lg">₹499</span>
              <span className="text-4xl sm:text-5xl font-extrabold text-white">₹1</span>
              <span className="text-xs bg-amber-400 text-[#5a3a12] font-extrabold px-2.5 py-1 rounded-full">
                Today only
              </span>
            </div>
            <CTA />
            {error && <p className="text-xs text-red-200 max-w-sm">{error}</p>}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-green-100/70 mt-2">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> One-time ₹1 · no auto-debit</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 3 min a day</span>
              <span className="flex items-center gap-1.5"><HandHeart className="w-3.5 h-3.5" /> No pills or equipment</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* AGITATION */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="py-16 px-4 sm:px-6 max-w-3xl mx-auto text-center"
      >
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#2F5233] mb-4">
          Small daily habits, done consistently
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          This isn't a cure or a shortcut. It's a simple guided routine: each day you learn one traditional
          Ayurvedic technique — a mudra, a breath, or an acupressure point — that takes about 3 minutes. The idea
          is to help you build a calming daily habit that supports your energy, digestion and sleep over time.
          Results vary from person to person, and it works best alongside good sleep, balanced food, and any care
          your doctor advises.
        </p>
      </motion.section>

      {/* PHASES */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="py-12 px-4 sm:px-6 max-w-6xl mx-auto"
      >
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">The Journey</span>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-[#2F5233] mt-1">
            3 phases. 14 days. A calmer, lighter you.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PHASES.map((p) => (
            <div key={p.title} className="bg-white border border-green-100 rounded-3xl p-7 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-4">
                <p.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8943A]">{p.tag}</span>
              <h3 className="font-heading font-bold text-lg text-green-900 mt-1 mb-2">{p.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* DAY-BY-DAY */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="py-12 px-4 sm:px-6 max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">What you'll unlock</span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#2F5233] mt-1">Your 14-day roadmap</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DAYS.map((d, i) => (
            <div key={i} className="flex items-start gap-3 bg-white border border-green-100 rounded-2xl px-4 py-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-[#2F5D50] text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-sm text-slate-700 leading-snug">{d}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* INCLUDED + PRICE */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="py-14 px-4 sm:px-6"
      >
        <div className="max-w-3xl mx-auto bg-white border border-green-100 rounded-3xl shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8">
              <h3 className="font-heading font-bold text-xl text-green-900 mb-5">Everything you get</h3>
              <ul className="space-y-3">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-b from-[#2F5D50] to-[#23483E] text-white p-8 flex flex-col justify-center text-center">
              <p className="text-xs uppercase tracking-widest text-green-100/70 mb-1">Your price today</p>
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="text-green-200/60 line-through text-lg">₹499</span>
                <span className="text-5xl font-extrabold">₹1</span>
              </div>
              <p className="text-xs text-green-100/70 mb-6">
                One-time payment. No subscription, no auto-debit, no UPI mandate, no hidden charges — ever.
              </p>
              <CTA className="w-full" />
              {error && <p className="text-xs text-red-200 mt-3">{error}</p>}
              <p className="text-[11px] text-green-100/60 mt-4 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Secured by Razorpay
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SOCIAL PROOF */}
      <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Ritu S.", loc: "Jaipur", text: "By day 5 my shoulder tension was gone and I was sleeping deeper than I had in months." },
            { name: "Anil K.", loc: "Delhi", text: "The morning breath replaced my 3 cups of coffee. No jitters, steady energy all day." },
            { name: "Pooja M.", loc: "Jhansi", text: "Simple 3-minute gestures — but my bloating and afternoon slump genuinely faded." },
          ].map((t) => (
            <div key={t.name} className="bg-white border border-green-100 rounded-2xl p-6 shadow-xs">
              <div className="flex gap-0.5 mb-3 text-amber-400">
                {Array(5).fill(0).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed mb-4">"{t.text}"</p>
              <div className="text-xs font-bold text-[#2F5233] flex items-center justify-between">
                <span>{t.name}</span>
                <span className="text-[#E8943A] font-normal">{t.loc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4 sm:px-6 max-w-3xl mx-auto">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#2F5233] text-center mb-8">
          Quick questions
        </h2>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="bg-white border border-green-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="text-sm font-bold text-green-900">{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${faqOpen === i ? "rotate-180" : ""}`} />
              </button>
              {faqOpen === i && <p className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="py-16 px-4 sm:px-6"
      >
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-b from-[#2F5D50] to-[#23483E] text-white rounded-3xl p-10 sm:p-14">
          <h2 className="font-heading font-bold text-2xl sm:text-4xl mb-4 text-white">
            Start your 14-day reset — for ₹1
          </h2>
          <p className="text-sm sm:text-base text-green-50/85 max-w-xl mx-auto mb-8">
            Build one calming Ayurvedic habit a day for two weeks — a gentle first step you can keep going at your
            own pace. One-time ₹1, no subscription. Results vary, and it's not a medical treatment.
          </p>
          <CTA />
          {error && <p className="text-xs text-red-200 mt-3">{error}</p>}
          <p className="text-[11px] text-green-100/60 mt-5">
            Traditional Vedic wellness practices. Not a substitute for medical care.
          </p>
        </div>
      </motion.section>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />}
    </div>
  );
}
