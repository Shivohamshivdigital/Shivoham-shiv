import React, { useEffect, useState } from "react";
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
  Gift,
  Award,
  Users,
} from "lucide-react";
import SEO from "../components/SEO";
import MarmaTestimonials from "../components/MarmaTestimonials";
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
  const [founder, setFounder] = useState<{ src: string; name: string; title: string } | null>(null);

  useEffect(() => {
    fetch(`/api/settings?type=founder&t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (d.founder) setFounder(d.founder); })
      .catch(() => {});
  }, []);

  // The guide card always shows a correct default; the admin can override
  // any field once its save actually persists.
  const guideName = (founder?.name || "").trim() || "Pooja Chaturvedi";
  const guideTitle = (founder?.title || "").trim() || "Founder · Shivoham Shiv";
  const guideImg = (founder?.src || "").trim() || "/founder.jpg";

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

      {/* TRUST BADGES */}
      <section className="py-6 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Award, label: "7+ years of practice" },
            { icon: Users, label: "1,200+ people guided" },
            { icon: HandHeart, label: "No pills or equipment" },
            { icon: ShieldCheck, label: "One-time ₹1 · no auto-debit" },
          ].map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2 bg-white border border-green-100 rounded-2xl p-4 shadow-xs">
              <b.icon className="w-6 h-6 text-green-700" />
              <span className="text-[11px] sm:text-xs font-semibold text-[#3A4A40] leading-snug">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

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

      {/* QUALIFICATION CHECKLIST */}
      <section className="py-14 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Is this for you?</span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#2F5233] mt-1">
            Check the boxes where your answer is YES
          </h2>
        </div>
        <div className="space-y-3">
          {[
            "You often feel tired, stressed or low on energy.",
            "You sit for long hours and carry tension in your neck & shoulders.",
            "Your digestion feels heavy or irregular.",
            "You struggle to switch off and sleep deeply.",
            "You'd rather build a natural daily habit than rely on pills.",
            "You can spare 3 minutes a day for two weeks.",
          ].map((c, i) => (
            <div key={i} className="flex items-start gap-3 bg-white border border-green-100 rounded-2xl px-4 py-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <span className="text-sm text-[#3A4A40]">{c}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-600 mt-6">
          Checked 3 or more? <b className="text-[#2F5233]">This challenge is built for you.</b>
        </p>
      </section>

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

      {/* WHAT YOU'LL DISCOVER (numbered) */}
      <section className="py-14 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Inside the 14 days</span>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-[#2F5233] mt-1">What you'll discover</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { n: "01", t: "Instant-calm tools", d: "Simple mudras & breathing you can use the moment stress hits — no app, no equipment." },
            { n: "02", t: "Lighter digestion", d: "Gentle finger alignments and points that ease bloating and heaviness after meals." },
            { n: "03", t: "Deeper sleep & focus", d: "A wind-down routine to quiet a busy mind, plus a gesture to sharpen daytime focus." },
            { n: "04", t: "Your 5-minute ritual", d: "By day 13 it all comes together into one simple daily habit you can keep for life." },
          ].map((f, i) => (
            <div key={i} className="flex gap-4 bg-white border border-green-100 rounded-3xl p-6 shadow-xs">
              <span className="font-heading font-bold text-3xl text-[#E8943A] shrink-0 leading-none">{f.n}</span>
              <div>
                <h3 className="font-heading font-bold text-lg text-green-900 mb-1">{f.t}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

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

      {/* FREE BONUSES */}
      <section className="py-14 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Included free</span>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-[#2F5233] mt-1">Free bonuses with your ₹1</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "Dosha self-assessment", was: "₹299", d: "Find your Ayurvedic body type and what suits it — no lab tests needed." },
            { title: "WhatsApp guidance", was: "₹499", d: "Daily nudges and answers from the Shivoham Shiv team through the challenge." },
            { title: "5-minute ritual card", was: "₹199", d: "A simple morning routine to keep long after the 14 days are over." },
          ].map((b, i) => (
            <div key={i} className="bg-white border border-green-100 rounded-3xl p-6 shadow-xs text-center">
              <div className="w-11 h-11 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6" />
              </div>
              <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-[#E8943A] mb-1">Bonus {i + 1}</span>
              <h3 className="font-heading font-bold text-base text-green-900 mb-1">{b.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{b.d}</p>
              <span className="text-xs text-slate-400 line-through mr-1.5">{b.was}</span>
              <span className="text-xs font-extrabold text-green-700">FREE</span>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-600 mt-6">
          Total value <b className="text-slate-400 line-through">₹997</b> — yours free with the ₹1 challenge.
        </p>
      </section>

      {/* MARMA TESTIMONIALS CAROUSEL (auto-scrolling, with photos) */}
      <MarmaTestimonials heading="What our Marma Dab Chikitsa clients say" />

      {/* FOUNDER / YOUR GUIDE */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-white border border-green-100 rounded-3xl shadow-md overflow-hidden grid md:grid-cols-5">
          <div className="md:col-span-2 bg-[#F2F9F2] flex flex-col items-center justify-center p-8 gap-3">
            <div className="relative w-40 h-40 rounded-full overflow-hidden bg-[#2F5D50] text-white flex items-center justify-center shadow-lg shrink-0">
              <span className="font-heading font-bold text-4xl">
                {guideName.trim().charAt(0).toUpperCase() || "S"}
              </span>
              <img
                src={guideImg}
                alt={guideName}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <p className="font-heading font-bold text-green-900 leading-tight">{guideName}</p>
              <p className="text-xs text-[#E8943A] font-semibold">{guideTitle}</p>
            </div>
          </div>
          <div className="md:col-span-3 p-8">
            <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Your guide</span>
            <h2 className="font-heading font-bold text-2xl text-green-900 mt-1 mb-3">Rooted in authentic Vedic practice</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              At Shivoham Shiv we've spent 7+ years guiding 1,200+ people back to balance using traditional Mudra,
              Marma and Ayurvedic practices — no pills, no shortcuts. This challenge is the gentle first step of that
              same path, simplified into 3 mindful minutes a day.
            </p>
            <p className="text-sm font-bold text-[#2F5233]">— {guideName}</p>
          </div>
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
