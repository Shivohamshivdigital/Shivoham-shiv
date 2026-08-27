import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  Scale,
  Wind,
  Activity,
  Leaf,
  Baby,
  Building2,
  HeartPulse,
  ChevronRight,
} from "lucide-react";
import SEO from "../components/SEO";

interface ProgramCard {
  title: string;
  desc: string;
  to: string;
  icon: any;
  tag?: string;
}

const GROUPS: { label: string; heading: string; blurb: string; items: ProgramCard[] }[] = [
  {
    label: "For Individuals",
    heading: "Transform your own wellbeing",
    blurb: "Natural, guided programs you can do from home — for energy, digestion, calm and a healthier weight.",
    items: [
      { title: "Natural Weight Management", desc: "The 60-day Ayurvedic program — yoga, pranayama, mudra & a prakriti diet. No pills, no crash diets.", to: "/weight-loss", icon: Scale, tag: "Most popular" },
      { title: "14-Day Reset Challenge", desc: "A gentle 14-day daily ritual to beat bloating and feel lighter — just ₹999.", to: "/challenge", icon: Sparkles, tag: "₹999" },
      { title: "Meditation & Stress Management", desc: "Guided meditation and breathing to calm the nervous system and sleep deeper.", to: "/contact", icon: Wind },
      { title: "Yoga & Daily Movement", desc: "Simple, sustainable movement routines built around your body type.", to: "/contact", icon: Activity },
      { title: "Lifestyle & Personal Wellness", desc: "A personalized Dinacharya (daily routine) for lasting balance.", to: "/contact", icon: Leaf },
      { title: "Check your BMI — free tool", desc: "See where your weight sits using Indian (ICMR) or WHO guidelines.", to: "/bmi-calculator", icon: HeartPulse },
    ],
  },
  {
    label: "For Kids",
    heading: "Focus, calm & healthy habits for children",
    blurb: "Help your child manage distractions, build concentration and develop emotional balance.",
    items: [
      { title: "Mindfulness & Focus for Kids", desc: "Attention training, emotional awareness and calm-down techniques for ages 6–14.", to: "/courses/mindfulness-kids", icon: Baby },
    ],
  },
  {
    label: "For Organizations",
    heading: "Wellness for teams that sit all day",
    blurb: "Reduce burnout, sluggish digestion and desk-fatigue with practical daily rituals for your team.",
    items: [
      { title: "Corporate & Adult Wellness", desc: "Dinacharya routines, breathing blueprints and live alignment sessions for workplaces.", to: "/courses/corporate-wellness", icon: Building2 },
    ],
  },
];

export default function WellnessProgramsView() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#FAFBF7] font-sans min-h-screen">
      <SEO
        title="Wellness Programs — Transform Your Wellbeing | Shivoham Shiv"
        description="Online Vedic wellness programs for individuals, children, families and organizations — natural weight management, meditation, yoga, stress management and corporate wellness."
        focusKeyword="online wellness programs"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2F5D50] to-[#23483E] text-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-16 sm:py-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold uppercase tracking-widest text-amber-200 mb-6">
            <Leaf className="w-3.5 h-3.5" /> Wellness · Transform
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-5">
            Transform your wellbeing,<br />
            <span className="text-amber-300">the natural Vedic way</span>
          </h1>
          <p className="text-sm sm:text-base text-green-50/85 max-w-xl mx-auto leading-relaxed mb-8">
            Online wellness programs designed for individuals, children, families and organizations —
            rooted in traditional Indian practices, built for modern life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/weight-loss")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-[#E8943A] to-[#C96E29] hover:from-[#EFAF3C] hover:to-[#B25D1D] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              Start with Weight Management <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/academy"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/25 text-white hover:bg-white/10 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all"
            >
              Want to become a practitioner?
            </Link>
          </div>
        </div>
      </section>

      {/* Program groups */}
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
              {group.items.map((p) => (
                <Link
                  key={p.title}
                  to={p.to}
                  className="group flex flex-col bg-white border border-green-100 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                      <p.icon className="w-6 h-6" />
                    </div>
                    {p.tag && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E8943A] bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#2F5233] leading-snug mb-2">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-grow">{p.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2F5D50] group-hover:text-[#23483E]">
                    Explore <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Closing CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-b from-[#2F5D50] to-[#23483E] text-white rounded-3xl p-10 sm:p-14">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3">Not sure where to start?</h2>
          <p className="text-sm sm:text-base text-green-50/85 max-w-xl mx-auto mb-8">
            Book a free 15-minute consultation and our team will point you to the right program for your goals.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-[#E8943A] to-[#C96E29] hover:from-[#EFAF3C] hover:to-[#B25D1D] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-all"
          >
            Book a free consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
