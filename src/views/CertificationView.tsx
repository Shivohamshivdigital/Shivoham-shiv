import React, { useState } from "react";
import { motion } from "motion/react";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Building2,
  Sparkles,
  Award,
  ChevronDown,
  Users,
} from "lucide-react";
import SEO from "../components/SEO";
import { getAttribution } from "../utils/attribution";

const SLOTS = ["Morning (10 AM – 12 PM)", "Afternoon (1 – 4 PM)", "Evening (5 – 8 PM)"];

const LEARN = [
  "A structured, step-by-step Ayurvedic Acupressure methodology",
  "How to approach chronic & complex cases with more confidence",
  "Reading marma (vital) points and building a treatment plan",
  "Hands-on protocols you can use in your own clinic",
  "How to position and price a premium healing practice",
  "Certification on completion of the 180-day program",
];

const WHO = [
  { icon: Stethoscope, title: "Physiotherapists", desc: "Add a drug-free, hands-on healing modality to your existing practice." },
  { icon: Sparkles, title: "Holistic & Ayurvedic practitioners", desc: "Deepen your toolkit with authentic Marma-based chronic-case protocols." },
  { icon: Building2, title: "Clinic owners", desc: "Differentiate your clinic and build a premium, referral-worthy service." },
];

const FAQS = [
  { q: "What is the strategy call?", a: "A free 45-minute 1:1 call where we understand your background and goals, and see whether the Ayurvedic Acupressure certification is the right fit for you. No obligation." },
  { q: "Who is this certification for?", a: "Physiotherapists, holistic and Ayurvedic practitioners, and clinic owners who want a structured way to approach chronic cases and build a premium practice." },
  { q: "How long is the program?", a: "It's a guided 180-day program with a structured methodology, practice protocols and certification on completion. We'll walk you through the full structure on the call." },
  { q: "Do I need prior experience?", a: "Some healthcare or wellness background helps, but we'll assess your starting point on the call and guide you accordingly." },
];

export default function CertificationView() {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", date: "", slot: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.email.trim() || !form.whatsapp.trim()) {
      setError("Please fill in your name, email and WhatsApp number.");
      return;
    }
    setSubmitting(true);
    const details = [
      form.date && `Preferred date: ${form.date}`,
      form.slot && `Slot: ${form.slot}`,
      "45-min FREE 1:1 Strategy Call · Ayurvedic Acupressure certification",
    ].filter(Boolean).join(" | ");
    // Forward the lead to the CRM (best-effort; key stays server-side).
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.whatsapp,
        email: form.email,
        product: "Strategy Call — Marma Certification",
        message: details,
      }),
    }).catch(() => {});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          whatsapp: form.whatsapp,
          message: details,
          source: "Strategy Call — Marma Certification",
          attribution: getAttribution(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not book. Please try again.");
      (window as any).fbq?.("track", "Lead", { content_name: "strategy-call" });
      (window as any).gtag?.("event", "generate_lead", { event_label: "strategy-call" });
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldCls =
    "w-full bg-transparent text-white placeholder-white/50 text-base focus:outline-none";
  const cardCls =
    "flex items-center gap-3 rounded-2xl border border-white/25 bg-white/[0.04] px-5 py-4";
  const inputCls =
    "w-full rounded-2xl border border-white/25 bg-white/[0.04] px-5 py-4 text-white placeholder-white/50 text-base focus:outline-none focus:border-[#E8C24A]/60 transition";

  const scrollToBook = () => document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="bg-[#0F2A1E] font-sans text-white">
      <SEO
        title="Get Certified in Ayurvedic Acupressure — Shivoham Shiv"
        description="A 180-day certification for physiotherapists, holistic & Ayurvedic practitioners and clinic owners to treat chronic cases with confidence using Ayurvedic Acupressure. Book a FREE 1:1 strategy call."
      />

      {/* AUDIENCE BAR */}
      <div className="bg-[#6E1B12] text-center px-4 py-3">
        <p className="text-sm sm:text-base font-bold text-white leading-snug max-w-4xl mx-auto">
          For Physiotherapists · Holistic &amp; Ayurvedic Practitioners · Clinic Owners ready to master chronic cases
        </p>
      </div>

      {/* HERO */}
      <section className="px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="font-heading font-bold text-3xl sm:text-5xl leading-tight text-white">
            Get Certified in <span className="text-[#E8C24A]">Ayurvedic Acupressure</span> — Treat Chronic Cases With
            Confidence in <span className="text-[#E27C58]">180 Days</span>
          </h1>
          <p className="text-sm sm:text-lg text-green-50/80 leading-relaxed mt-5 max-w-2xl mx-auto">
            Learn a structured holistic healing methodology that helps you approach chronic cases with more
            confidence — while building a premium healthcare practice.
          </p>

          {/* Founder */}
          <div className="mt-9 max-w-xl mx-auto">
            <div className="rounded-3xl overflow-hidden ring-1 ring-white/15 shadow-2xl">
              <img src="/founder.jpg" alt="Pooja Chaturvedi — Founder, Shivoham Shiv" className="w-full aspect-[16/11] object-cover" />
            </div>
            <p className="font-heading font-bold text-2xl sm:text-3xl text-white mt-5">Pooja Chaturvedi</p>
            <p className="text-[#E8C24A] font-semibold">Founder · Shivoham Shiv</p>
          </div>

          {/* Booking card */}
          <div id="book" className="mt-10 max-w-xl mx-auto text-left scroll-mt-24">
            {done ? (
              <div className="rounded-3xl border border-white/15 bg-white/[0.04] p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#E8C24A]/20 text-[#E8C24A] flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="font-heading font-bold text-2xl text-white mb-2">You're booked! 🎉</h2>
                <p className="text-sm text-green-50/80 leading-relaxed max-w-md mx-auto">
                  We've received your request for a FREE 1:1 strategy call. Our team will confirm your slot on
                  WhatsApp / email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-3.5">
                <label className={cardCls}>
                  <CalendarDays className="w-5 h-5 text-[#E8C24A] shrink-0" />
                  <span className="flex-1">
                    <span className="block text-[11px] uppercase tracking-wider text-white/50 font-bold">Pick your date</span>
                    <input type="date" className={fieldCls} value={form.date} onChange={set("date")} />
                  </span>
                </label>

                <label className={cardCls}>
                  <Clock className="w-5 h-5 text-[#E8C24A] shrink-0" />
                  <span className="flex-1">
                    <span className="block text-[11px] uppercase tracking-wider text-white/50 font-bold">Time slot · 45 minutes</span>
                    <select className={`${fieldCls} [&>option]:text-slate-800`} value={form.slot} onChange={set("slot")}>
                      <option value="">Choose a slot…</option>
                      {SLOTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <input className={inputCls} value={form.name} onChange={set("name")} placeholder="Your name *" />
                  <input className={inputCls} type="email" value={form.email} onChange={set("email")} placeholder="Email *" />
                  <input className={inputCls} value={form.whatsapp} onChange={set("whatsapp")} placeholder="WhatsApp *" />
                </div>

                <div className="text-center pt-2">
                  <p className="font-heading font-bold text-lg text-white">FREE 1:1 Strategy Call</p>
                  <p className="text-sm"><span className="text-[#E27C58] font-bold">Hurry Up!!</span> <span className="text-green-50/80">Limited slots available</span></p>
                </div>

                {error && <p className="text-sm text-red-300 text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-b from-[#C0432F] to-[#9E3222] hover:from-[#CE4C36] hover:to-[#8E2C1E] text-white font-bold text-base tracking-wide shadow-lg transition-all disabled:opacity-70"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {submitting ? "Booking…" : "Book Now"} {!submitting && <ArrowRight className="w-5 h-5" />}
                </button>
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] text-green-100/60 pt-1">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> No obligation</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 45-min call</span>
                  <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Certified mentor</span>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </section>

      {/* WHAT YOU'LL MASTER */}
      <section className="bg-[#002A2E] py-16 px-4 sm:px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-[#E8C24A]">Inside the program</span>
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white mt-1">What you'll master</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {LEARN.map((l) => (
              <div key={l} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
                <CheckCircle2 className="w-5 h-5 text-[#E8C24A] shrink-0 mt-0.5" />
                <span className="text-sm text-green-50/90">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8C24A]">Is this you?</span>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white mt-1">Who this is for</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {WHO.map((w) => (
            <div key={w.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#E8C24A]/15 text-[#E8C24A] flex items-center justify-center mb-4">
                <w.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-1.5">{w.title}</h3>
              <p className="text-sm text-green-50/70 leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="pb-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Award, label: "Yoga Alliance RYS-200" },
            { icon: Users, label: "1,200+ people guided" },
            { icon: ShieldCheck, label: "7+ years of practice" },
            { icon: Sparkles, label: "Authentic Vedic method" },
          ].map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <b.icon className="w-6 h-6 text-[#E8C24A]" />
              <span className="text-[11px] sm:text-xs font-semibold text-green-50/80 leading-snug">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white text-center mb-8">Common questions</h2>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="text-sm font-bold text-white">{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-white/40 shrink-0 transition-transform ${faqOpen === i ? "rotate-180" : ""}`} />
              </button>
              {faqOpen === i && <p className="px-5 pb-4 text-sm text-green-50/75 leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pb-20 px-4 sm:px-6 text-center">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-2">Ready to master chronic cases?</h2>
        <p className="text-sm text-green-50/70 mb-6 max-w-md mx-auto">Book your FREE 45-minute 1:1 strategy call — limited slots.</p>
        <button
          onClick={scrollToBook}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-b from-[#C0432F] to-[#9E3222] hover:from-[#CE4C36] hover:to-[#8E2C1E] text-white font-bold text-base tracking-wide shadow-lg transition-all"
        >
          Book Now <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
}
