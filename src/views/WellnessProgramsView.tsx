import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Leaf, ChevronRight } from "lucide-react";
import SEO from "../components/SEO";

interface Program {
  emoji: string;
  title: string;
  subtitle: string;
  desc: string;
  button: string;
  to: string;
}

const PROGRAMS: Program[] = [
  {
    emoji: "🧘",
    title: "Kids Mindfulness & Focus",
    subtitle: "Help Your Child Build Focus, Calmness & Healthy Habits",
    desc: "Introduce children to age-appropriate mindfulness, breathing, yoga and focus-building practices that can become part of their daily routine. Designed to encourage greater awareness, concentration and positive lifestyle habits.",
    button: "Explore Kids Mindfulness & Focus",
    to: "/courses/mindfulness-kids",
  },
  {
    emoji: "⚖️",
    title: "Weight Management & Wellness",
    subtitle: "Build Healthier Habits. Create Sustainable Lifestyle Changes.",
    desc: "Develop a healthier relationship with movement, daily routines, mindful practices and lifestyle habits. Our wellness approach focuses on building consistency rather than relying on short-term solutions.",
    button: "Explore Weight Management & Wellness",
    to: "/weight-loss",
  },
  {
    emoji: "💼",
    title: "Corporate & Adult Wellness",
    subtitle: "Healthier People. Healthier Workplaces.",
    desc: "Modern professionals spend long hours working, sitting and managing demanding schedules. Our Corporate & Adult Wellness Programs introduce practical wellness practices such as yoga, mindfulness, breathing, movement and stress-management activities into everyday life.",
    button: "Explore Corporate Wellness",
    to: "/courses/corporate-wellness",
  },
  {
    emoji: "🕉️",
    title: "Yoga & Meditation",
    subtitle: "Move Better. Breathe Better. Live With Greater Awareness.",
    desc: "Build a consistent practice through Yoga, Meditation, Pranayama and mindfulness. Our programs are designed to make traditional practices practical and accessible for today's lifestyle.",
    button: "Explore Yoga & Meditation",
    to: "/contact",
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
      <section className="relative overflow-hidden bg-gradient-to-b from-[#004C53] to-[#003A40] text-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-16 sm:py-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold uppercase tracking-widest text-amber-200 mb-6">
            <Leaf className="w-3.5 h-3.5" /> Wellness · Transform
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-5 text-white">
            Transform Your Health. Mind. <span className="text-amber-300">Lifestyle.</span>
          </h1>
          <p className="text-sm sm:text-base text-green-50/85 max-w-2xl mx-auto leading-relaxed mb-8">
            Our wellness programs are designed for modern lifestyles and focus on practical, sustainable wellbeing.
            Whether you want to improve your own lifestyle, support your family, help children develop healthy habits
            or create a healthier workplace, there is a program for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/weight-loss")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-[#EF8321] to-[#D9741A] hover:from-[#F49B3E] hover:to-[#C56A15] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl transition-all"
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

      {/* Mission & Vision */}
      <section className="px-4 sm:px-6 lg:px-8 py-14 sm:py-16 bg-white border-b border-[#004C53]/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-[#004C53]/10 bg-[#EEF6F6] p-7">
            <span className="text-xs uppercase font-bold tracking-widest text-[#EF8321]">Our Mission</span>
            <p className="mt-3 text-sm sm:text-base text-[#004C53] leading-relaxed">
              To make India's traditional wellness knowledge — Yoga, Meditation, Pranayama, Mudra and Ayurvedic
              Acupressure — practical and accessible for modern life, by pairing it with a structured,
              science-informed approach through our Wellness Programs and Academy.
            </p>
          </div>
          <div className="rounded-3xl border border-[#004C53]/10 bg-[#EEF6F6] p-7">
            <span className="text-xs uppercase font-bold tracking-widest text-[#EF8321]">Our Vision</span>
            <p className="mt-3 text-sm sm:text-base text-[#004C53] leading-relaxed">
              A world where anyone, anywhere can learn authentic Indian wellness practices to care for their own
              wellbeing — and where a new generation of responsible practitioners carries this knowledge forward.
            </p>
          </div>
        </div>
      </section>

      {/* Program cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROGRAMS.map((p) => (
            <div
              key={p.title}
              className="flex flex-col bg-white border border-green-100 rounded-3xl p-7 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{p.emoji}</div>
              <h2 className="font-heading font-bold text-xl text-[#004C53] leading-snug">{p.title}</h2>
              <p className="text-sm font-semibold text-[#EF8321] mt-1 mb-2">{p.subtitle}</p>
              <p className="text-sm text-slate-600 leading-relaxed flex-grow">{p.desc}</p>
              <Link
                to={p.to}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#004C53] hover:text-[#EF8321] transition-colors"
              >
                {p.button} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-b from-[#004C53] to-[#003A40] text-white rounded-3xl p-10 sm:p-14">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3 text-white">Not sure where to start?</h2>
          <p className="text-sm sm:text-base text-green-50/85 max-w-xl mx-auto mb-8">
            Book a free 15-minute consultation and our team will point you to the right program for your goals.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-[#EF8321] to-[#D9741A] hover:from-[#F49B3E] hover:to-[#C56A15] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-all"
          >
            Book a free consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
