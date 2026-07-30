import React, { useState } from "react";
import { Handshake, Building2, Users, TrendingUp, HeartHandshake, CheckCircle2, Loader2 } from "lucide-react";
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

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "Grow together",
    desc: "Add authentic Vedic wellness — Mudra, Marma & Ayurvedic programs — to what you already offer, and earn on every client you bring.",
  },
  {
    icon: HeartHandshake,
    title: "Real, certified practice",
    desc: "Partner with a certified team (Yoga Alliance RYS-200, Acupressure, Panchakarma, Reiki) — not a fad. Your clients get genuine value.",
  },
  {
    icon: Users,
    title: "Full support",
    desc: "Training, content, and guidance from our team on WhatsApp. We help you onboard and serve your clients well.",
  },
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

  return (
    <div className="bg-[#FAFBF7] min-h-screen font-sans">
      <SEO
        title="Partner With Us — Shivoham Shiv"
        description="Partner with Shivoham Shiv to bring authentic Vedic wellness — Mudra, Marma & Ayurvedic programs — to your clients. Clinics, studios, practitioners, affiliates & corporates welcome."
      />

      {/* HERO */}
      <section className="bg-gradient-to-b from-[#2F5D50] to-[#23483E] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold uppercase tracking-widest text-amber-200 mb-6">
            <Handshake className="w-3.5 h-3.5" /> Partner With Us
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl leading-tight mb-5 text-white">
            Let's bring authentic Vedic wellness<br className="hidden sm:block" />
            <span className="text-amber-300"> to more people — together</span>
          </h1>
          <p className="text-sm sm:text-lg text-green-50/85 max-w-2xl mx-auto leading-relaxed">
            Are you a clinic, studio, practitioner, affiliate or corporate wellness team? Join hands with Shivoham
            Shiv and offer your clients real, certified Ayurvedic care — Mudra, Marma, Panchakarma &amp; more.
          </p>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-white border border-green-100 rounded-3xl p-7 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#E3F1E3] text-green-700 flex items-center justify-center mb-4">
                <b.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-green-900 mb-2">{b.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-white border border-green-100 rounded-3xl shadow-sm p-6 sm:p-9">
          {done ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-green-900 mb-2">Thank you! 🙏</h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                We've received your partnership enquiry. Our team will reach out to you on WhatsApp / email soon to
                take it forward.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-[#2F5D50] text-white flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-green-900">Become a partner</h2>
                  <p className="text-xs text-slate-500">Fill this in — we usually reply within a day.</p>
                </div>
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
      </section>
    </div>
  );
}
