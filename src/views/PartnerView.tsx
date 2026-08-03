import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Handshake,
  Users,
  TrendingUp,
  HeartHandshake,
  CheckCircle2,
  Loader2,
  Award,
  ShieldCheck,
  Stethoscope,
  Dumbbell,
  Store,
  Megaphone,
  Briefcase,
  UserPlus,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import SEO from "../components/SEO";
import { getAttribution } from "../utils/attribution";

const PARTNER_TYPES = [
  "Clinic / Wellness Centre",
  "Yoga / Fitness Studio",
  "Doctor / Practitioner",
  "Affiliate / Influencer",
  "Corporate Wellness",
  "Distributor / Reseller",
  "Other",
];

// Only H.264 clips — partner-1/2 were HEVC (H.265) which browsers can't play.
const VIDEOS = [
  "/partner-videos/partner-3.mp4",
  "/partner-videos/partner-4.mp4",
  "/partner-videos/partner-5.mp4",
  "/partner-videos/partner-6.mp4",
];

const WHO = [
  { icon: Stethoscope, title: "Clinics & practitioners", desc: "Doctors, physios, Ayurveda & wellness clinics who want to add authentic Vedic therapies for their patients." },
  { icon: Dumbbell, title: "Yoga & fitness studios", desc: "Studios and trainers looking to offer Mudra, Marma & Ayurvedic programs alongside their classes." },
  { icon: Megaphone, title: "Affiliates & influencers", desc: "Health creators and communities who want to recommend real, certified programs and earn per referral." },
  { icon: Store, title: "Distributors & resellers", desc: "Partners who want to bring our courses and consultations to their region or customer base." },
  { icon: Briefcase, title: "Corporate wellness", desc: "HR & wellness teams adding stress, sleep and posture programs for their employees." },
  { icon: UserPlus, title: "Individual referrers", desc: "Anyone with a network who believes in natural, drug-free healing and wants to grow with us." },
];

const BENEFITS = [
  { icon: TrendingUp, title: "New income stream", desc: "Earn on every client you refer or serve — add value without building a wellness program from scratch." },
  { icon: HeartHandshake, title: "Real, certified practice", desc: "Partner with a certified team (Yoga Alliance RYS-200, Acupressure, Panchakarma, Reiki) — genuine value for your clients, not a fad." },
  { icon: Users, title: "Done-with-you support", desc: "Training, ready content, and guidance from our team on WhatsApp. We help you onboard and serve well." },
  { icon: ShieldCheck, title: "Trusted brand", desc: "7+ years and 1,200+ people guided. Your clients get care backed by a real practice and a real founder." },
];

const STEPS = [
  { n: "01", title: "Apply", desc: "Fill the short form with a little about you and how you'd like to partner." },
  { n: "02", title: "We connect", desc: "Our team reaches out on WhatsApp/email, understands your goals, and shares terms that work for both sides." },
  { n: "03", title: "Onboard & grow", desc: "You get training, materials and support — then start referring or offering programs to your clients." },
];

const CLIENT_PROGRAMS = [
  "Marma Dab Chikitsa (energy-point therapy)",
  "Mudra Therapy & guided breathing",
  "Ayurvedic / natural weight management",
  "Panchakarma & detox guidance",
  "14-Day Vedic habit challenge",
  "Stress, sleep & posture programs",
];

const FAQS = [
  { q: "Who can become a partner?", a: "Clinics, studios, doctors and practitioners, affiliates and influencers, corporate wellness teams, distributors, and individual referrers with a relevant network. If you believe in authentic, drug-free wellness, we'd love to talk." },
  { q: "Is there a fee to join?", a: "No sign-up fee to apply. Once we connect, we'll agree on simple terms that work for both of us based on how you'd like to partner (referrals, offering programs, or distribution)." },
  { q: "How do I earn?", a: "It depends on the partnership type — typically a share on every client you refer or serve. We keep it transparent and discuss the exact terms with you before you start." },
  { q: "What support will I get?", a: "Onboarding, training on our programs, ready-to-use content, and ongoing guidance from our team on WhatsApp so you can serve your clients confidently." },
  { q: "How soon will you reply?", a: "We usually respond within a day of receiving your enquiry." },
];

export default function PartnerView() {
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    whatsapp: "",
    partnerType: "",
    city: "",
    website: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.email.trim() || !form.whatsapp.trim()) {
      setError("Please fill in your name, email and WhatsApp number.");
      return;
    }
    setSubmitting(true);
    // Forward the lead to the CRM (best-effort; key stays server-side).
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.whatsapp,
        email: form.email,
        product: form.partnerType || "Partner With Us",
        message: [form.organization, form.city, form.website, form.message].filter(Boolean).join(" · "),
      }),
    }).catch(() => {});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "partner", ...form, attribution: getAttribution() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send. Please try again.");
      (window as any).fbq?.("track", "Lead", { content_name: "partner" });
      (window as any).gtag?.("event", "generate_lead", { event_label: "partner" });
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-green-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30 focus:border-[#2F5D50] transition";

  const scrollToForm = () => document.getElementById("partner-form")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const CTA = ({ className = "" }: { className?: string }) => (
    <button
      onClick={scrollToForm}
      className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-[#E8943A] to-[#C96E29] hover:from-[#EFAF3C] hover:to-[#B25D1D] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl transition-all ${className}`}
    >
      <Handshake className="w-4 h-4" /> Become a partner
    </button>
  );

  // The enquiry form card — rendered both near the top and at the bottom.
  const formCard = () => (
    <div className="max-w-2xl mx-auto bg-white border border-green-100 rounded-3xl shadow-md p-6 sm:p-9">
      {done ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-bold text-2xl text-green-900 mb-2">Thank you! 🙏</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            We've received your partnership enquiry. Our team will reach out to you on WhatsApp / email soon to take
            it forward.
          </p>
        </div>
      ) : (
        <>
          <div className="text-center max-w-md mx-auto mb-6">
            <span className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#E8943A]">
              <Sparkles className="w-3.5 h-3.5" /> Let's talk
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-green-900 mt-1">Become a partner</h2>
            <p className="text-xs text-slate-500 mt-1">Fill this in — we usually reply within a day.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Your name *</label>
                <input className={inputCls} value={form.name} onChange={set("name")} placeholder="Full name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Organization / business</label>
                <input className={inputCls} value={form.organization} onChange={set("organization")} placeholder="Clinic / studio / brand" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Email *</label>
                <input className={inputCls} type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">WhatsApp / phone *</label>
                <input className={inputCls} value={form.whatsapp} onChange={set("whatsapp")} placeholder="+91 …" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Partnership type</label>
                <select className={inputCls} value={form.partnerType} onChange={set("partnerType")}>
                  <option value="">Select…</option>
                  {PARTNER_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">City</label>
                <input className={inputCls} value={form.city} onChange={set("city")} placeholder="City" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Website / social (optional)</label>
              <input className={inputCls} value={form.website} onChange={set("website")} placeholder="https://…" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">How would you like to partner?</label>
              <textarea
                className={`${inputCls} min-h-[110px] resize-y`}
                value={form.message}
                onChange={set("message")}
                placeholder="Tell us a little about you and what you have in mind…"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-br from-[#E8943A] to-[#C96E29] hover:from-[#EFAF3C] hover:to-[#B25D1D] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-all disabled:opacity-70"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Handshake className="w-4 h-4" />}
              {submitting ? "Sending…" : "Send partnership enquiry"}
            </button>
            <p className="text-[11px] text-slate-400 text-center">
              Your details go straight to the Shivoham Shiv team. We never spam.
            </p>
          </form>
        </>
      )}
    </div>
  );

  // Auto-scrolling (left → right) video carousel. Pauses on hover so a clip
  // can be played. Self-contained marquee keyframes.
  const videoRow = () => (
    <section className="py-14 px-4 sm:px-6">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes pv-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .pv-track { display: flex; width: max-content; animation: pv-marquee 40s linear infinite; }
          .pv-wrap:hover .pv-track { animation-play-state: paused; }
        `,
        }}
      />
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Watch</span>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-[#2F5233] mt-1">See Shivoham Shiv in action</h2>
        </div>
        <div className="pv-wrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
          <div className="pv-track gap-5">
            {[...VIDEOS, ...VIDEOS].map((v, i) => (
              <div
                key={i}
                className="shrink-0 w-[300px] sm:w-[420px] rounded-2xl overflow-hidden bg-black border border-green-100 shadow-xs"
              >
                <video src={`${v}#t=0.1`} controls preload="metadata" playsInline className="w-full aspect-video bg-black" />
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-[11px] text-slate-400 mt-3">Hover to pause · click a video to play</p>
      </div>
    </section>
  );

  return (
    <div className="bg-[#FAFBF7] font-sans">
      <SEO
        title="Partner With Us — Shivoham Shiv"
        description="Partner with Shivoham Shiv to bring authentic Vedic wellness — Mudra, Marma & Ayurvedic programs — to your clients. Clinics, studios, practitioners, affiliates & corporates welcome. Earn per referral with full support."
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
            <Handshake className="w-3.5 h-3.5" /> Partner With Us
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl leading-tight mb-5 text-white">
            Bring authentic Vedic wellness to your clients —
            <br className="hidden sm:block" />
            <span className="text-amber-300"> and grow with us</span>
          </h1>
          <p className="text-sm sm:text-lg text-green-50/85 max-w-2xl mx-auto leading-relaxed mb-8">
            Whether you run a clinic, studio, or community — or you're an affiliate, doctor or corporate wellness
            team — join hands with Shivoham Shiv to offer real, certified Ayurvedic care (Mudra, Marma, Panchakarma
            &amp; more) and earn on every client you bring.
          </p>
          <div className="flex flex-col items-center gap-4">
            <CTA />
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-green-100/70 mt-1">
              <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Certified team</span>
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> 1,200+ people guided</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> No sign-up fee</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* VIDEOS (top, horizontal scroll) */}
      {videoRow()}

      {/* FORM (top) */}
      <section id="partner-form" className="pb-4 px-4 sm:px-6 scroll-mt-24">{formCard()}</section>

      {/* TRUST BADGES */}
      <section className="py-10 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Award, label: "7+ years of practice" },
            { icon: Users, label: "1,200+ people guided" },
            { icon: ShieldCheck, label: "Yoga Alliance RYS-200" },
            { icon: HeartHandshake, label: "Drug-free, natural care" },
          ].map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2 bg-white border border-green-100 rounded-2xl p-4 shadow-xs">
              <b.icon className="w-6 h-6 text-green-700" />
              <span className="text-[11px] sm:text-xs font-semibold text-[#3A4A40] leading-snug">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* WHO CAN PARTNER */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="py-12 px-4 sm:px-6 max-w-6xl mx-auto"
      >
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Who it's for</span>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-[#2F5233] mt-1">Who can partner with us</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHO.map((w) => (
            <div key={w.title} className="bg-white border border-green-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#E3F1E3] text-green-700 flex items-center justify-center mb-4">
                <w.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-green-900 mb-1.5">{w.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* BENEFITS */}
      <section className="bg-[#F2F9F2] border-y border-[#E3F1E3] py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Why partner</span>
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-[#2F5233] mt-1">What you get</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-4 bg-white border border-green-100 rounded-3xl p-6 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#E3F1E3] text-green-700 flex items-center justify-center shrink-0">
                  <b.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-green-900 mb-1">{b.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="py-16 px-4 sm:px-6 max-w-6xl mx-auto"
      >
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Simple &amp; quick</span>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-[#2F5233] mt-1">How it works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-white border border-green-100 rounded-3xl p-7 shadow-xs">
              <span className="font-heading font-bold text-3xl text-[#E8943A]">{s.n}</span>
              <h3 className="font-heading font-bold text-lg text-green-900 mt-2 mb-1.5">{s.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* WHAT CLIENTS GET */}
      <section className="pb-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-[#2F5D50] text-white rounded-3xl p-8 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-7">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-300">For your clients</span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mt-1">Programs you can offer</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CLIENT_PROGRAMS.map((p) => (
              <div key={p} className="flex items-start gap-2.5 bg-white/10 border border-white/15 rounded-2xl px-4 py-3">
                <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <span className="text-sm text-green-50">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#2F5233] text-center mb-8">Common questions</h2>
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

      {/* FORM (bottom) */}
      <section id="partner-form-bottom" className="pb-20 px-4 sm:px-6 scroll-mt-24">{formCard()}</section>
    </div>
  );
}
