import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Users, Leaf, GraduationCap, Globe, ArrowRight, Check, MessageSquare } from "lucide-react";
import SEO from "../components/SEO";

const WHATSAPP = "https://wa.me/917317778215";

const TIERS = [
  {
    icon: Leaf,
    label: "Wellness Community",
    who: "For people doing our wellness programs",
    accent: "bg-green-100 text-green-700",
    features: [
      "Weekly live wellness sessions",
      "Guided meditation & breathing sessions",
      "Challenges & habit tracking",
      "Expert Q&A",
      "Community events",
    ],
    cta: { label: "Join the Wellness Community", to: WHATSAPP, external: true },
  },
  {
    icon: GraduationCap,
    label: "Practitioner Community",
    who: "For certified students & practitioners",
    accent: "bg-[#E3F1F1] text-[#004C53]",
    features: [
      "Monthly practitioner sessions",
      "Case discussions & mentorship",
      "Continuing education & workshops",
      "Practitioner directory & referrals",
      "Networking & business development",
    ],
    cta: { label: "Explore the Academy", to: "/academy", external: false },
  },
  {
    icon: Globe,
    label: "Global Shivoham Community",
    who: "Our long-term global network",
    accent: "bg-amber-50 text-[#EF8321]",
    features: [
      "One worldwide Vedic wellness network",
      "Members from both paths — wellness & practice",
      "Global events & live gatherings",
      "Ongoing support & belonging",
      "Membership (coming soon)",
    ],
    cta: { label: "Register your interest", to: "/contact", external: false },
  },
];

export default function CommunityView() {
  return (
    <div className="bg-[#FAFBF7] font-sans min-h-screen">
      <SEO
        title="Community — Connect. Grow. Belong. | Shivoham Shiv"
        description="Join the Shivoham Shiv community — a global Vedic wellness network for people on their wellness journey and for certified practitioners. Live sessions, mentorship and belonging."
        focusKeyword="vedic wellness community"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#004C53] to-[#003A40] text-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-16 sm:py-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold uppercase tracking-widest text-amber-200 mb-6">
            <Users className="w-3.5 h-3.5" /> Community · Belong
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-5 text-white">
            Connect. Grow.<br />
            <span className="text-amber-300">Belong.</span>
          </h1>
          <p className="text-sm sm:text-base text-green-50/85 max-w-xl mx-auto leading-relaxed">
            One platform, two paths, one global community. Whether you're transforming your own wellbeing
            or building your practice, you don't do it alone.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-bold text-amber-100">
            <Users className="w-3.5 h-3.5" /> 10,000+ Wellness Community &amp; Growing
          </div>
        </div>
      </section>

      {/* Tiers */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              className="flex flex-col bg-white border border-green-100 rounded-3xl p-7 shadow-xs"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${t.accent}`}>
                <t.icon className="w-6 h-6" />
              </div>
              <h2 className="font-heading font-bold text-xl text-[#004C53]">{t.label}</h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1 mb-5">{t.who}</p>
              <ul className="space-y-2.5 mb-7 flex-grow">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {t.cta.external ? (
                <a
                  href={t.cta.to}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  <MessageSquare className="w-4 h-4" /> {t.cta.label}
                </a>
              ) : (
                <Link
                  to={t.cta.to}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-br from-[#5DBB63] to-[#3E9B49] hover:from-[#6BC971] hover:to-[#46AA52] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                >
                  {t.cta.label} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 mt-10 max-w-2xl mx-auto leading-relaxed">
          Community can become the heart of Shivoham Shiv — recurring live sessions, mentorship and belonging
          that go far beyond a single course. New community features are rolling out; join now to be part of it early.
        </p>
      </div>

      {/* Closing CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-b from-[#004C53] to-[#003A40] text-white rounded-3xl p-10 sm:p-14">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3 text-white">Grow together</h2>
          <p className="text-sm sm:text-base text-green-50/85 max-w-xl mx-auto mb-8">
            Not sure which community fits you? Message us and we'll welcome you into the right circle.
          </p>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-[#EF8321] to-[#D9741A] hover:from-[#F49B3E] hover:to-[#C56A15] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-all"
          >
            Say hello on WhatsApp <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
