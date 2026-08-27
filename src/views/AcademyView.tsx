import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  GraduationCap,
  ArrowRight,
  Fingerprint,
  Wind,
  Activity,
  Hand,
  Sparkles,
  Award,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import SEO from "../components/SEO";

interface CertCard {
  title: string;
  desc: string;
  to: string;
  icon: any;
  tag?: string;
}

const GROUPS: { label: string; heading: string; blurb: string; items: CertCard[] }[] = [
  {
    label: "Foundation",
    heading: "Build your base",
    blurb: "Start with the fundamentals every wellness practitioner needs.",
    items: [
      { title: "Meditation Foundations", desc: "The principles and practice of guided meditation, from the ground up.", to: "/contact", icon: Wind, tag: "Coming soon" },
      { title: "Pranayama Foundations", desc: "Breathwork fundamentals — the science and technique of yogic breathing.", to: "/contact", icon: Activity, tag: "Coming soon" },
      { title: "Yoga Foundations", desc: "Core asana, alignment and sequencing for safe, effective teaching.", to: "/contact", icon: BookOpen, tag: "Coming soon" },
    ],
  },
  {
    label: "Specialized Certifications",
    heading: "Become a certified practitioner",
    blurb: "Structured online certifications with video modules, guidance and a certificate.",
    items: [
      { title: "Mudra Therapy Certification", desc: "The neurological basis, precise hand alignments and timing of 15 essential Hasta Mudras.", to: "/courses/mudra-therapy", icon: Fingerprint, tag: "Enrolling" },
      { title: "Ayurvedic Acupressure", desc: "Meridian sites and pressure techniques rooted in Vedic acupressure.", to: "/courses/acupressure-therapy", icon: Hand },
      { title: "Marma Dab Chikitsa", desc: "Heal through energy points — release locked Marma nodes across the meridian lines.", to: "/courses/acupressure-therapy", icon: Sparkles },
      { title: "Meditation Therapy", desc: "Apply meditation as a therapeutic practice for stress and emotional balance.", to: "/contact", icon: Wind, tag: "Coming soon" },
    ],
  },
  {
    label: "Advanced",
    heading: "Go deeper — the practitioner ladder",
    blurb: "Advanced pathways for graduates ready to specialize and lead.",
    items: [
      { title: "Advanced Mudra Practitioner", desc: "Master-level Mudra practice and client application.", to: "/contact", icon: Award, tag: "Coming soon" },
      { title: "Advanced Marma Practitioner", desc: "Deepen your Marma diagnosis and treatment skills.", to: "/contact", icon: Award, tag: "Coming soon" },
      { title: "Holistic Wellness Practitioner", desc: "A capstone pathway across the full Vedic wellness toolkit.", to: "/contact", icon: GraduationCap, tag: "Coming soon" },
    ],
  },
];

export default function AcademyView() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#FAFBF7] font-sans min-h-screen">
      <SEO
        title="Academy — Learn. Practice. Get Certified. | Shivoham Shiv"
        description="Professional online education in traditional Indian wellness — Mudra Therapy, Ayurvedic Acupressure, Marma Dab Chikitsa and more. Structured certifications for aspiring practitioners."
        focusKeyword="wellness practitioner certification online"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#23423A] to-[#16302A] text-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-16 sm:py-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold uppercase tracking-widest text-amber-200 mb-6">
            <GraduationCap className="w-3.5 h-3.5" /> Academy · Become
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-5">
            Learn. Practice.<br />
            <span className="text-amber-300">Get certified.</span>
          </h1>
          <p className="text-sm sm:text-base text-green-50/85 max-w-xl mx-auto leading-relaxed mb-8">
            Professional online education in traditional Indian wellness practices — for aspiring and
            practicing wellness professionals. Structured curriculum, guidance and certification.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/courses/mudra-therapy"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-[#E8943A] to-[#C96E29] hover:from-[#EFAF3C] hover:to-[#B25D1D] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              Explore Certifications <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => navigate("/wellness-programs")}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/25 text-white hover:bg-white/10 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all"
            >
              Just want to feel better?
            </button>
          </div>

          {/* Proposition strip */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-green-100/70">
            <span>Authentic Indian knowledge</span>
            <span className="opacity-40">·</span>
            <span>100% online</span>
            <span className="opacity-40">·</span>
            <span>Live mentor support</span>
            <span className="opacity-40">·</span>
            <span>Certificate</span>
            <span className="opacity-40">·</span>
            <span>Global community</span>
          </div>
        </div>
      </section>

      {/* Certification ladder */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
        {GROUPS.map((group) => (
          <motion.section
            key={group.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">{group.label}</span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#2F5233] mt-1">{group.heading}</h2>
              <p className="text-sm text-slate-600 leading-relaxed mt-2">{group.blurb}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.items.map((c) => (
                <Link
                  key={c.title}
                  to={c.to}
                  className="group flex flex-col bg-white border border-green-100 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#EAF4EC] text-[#2F5D50] flex items-center justify-center">
                      <c.icon className="w-6 h-6" />
                    </div>
                    {c.tag && (
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          c.tag === "Coming soon"
                            ? "text-slate-500 bg-slate-50 border-slate-200"
                            : "text-[#E8943A] bg-amber-50 border-amber-100"
                        }`}
                      >
                        {c.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#2F5233] leading-snug mb-2">{c.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-grow">{c.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2F5D50] group-hover:text-[#23483E]">
                    {c.tag === "Coming soon" ? "Register interest" : "View certification"}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Closing CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-b from-[#23423A] to-[#16302A] text-white rounded-3xl p-10 sm:p-14">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3">Ready to become a practitioner?</h2>
          <p className="text-sm sm:text-base text-green-50/85 max-w-xl mx-auto mb-8">
            Tell us your goals and we'll help you choose the right certification pathway.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-[#E8943A] to-[#C96E29] hover:from-[#EFAF3C] hover:to-[#B25D1D] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-all"
          >
            Talk to an advisor <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
