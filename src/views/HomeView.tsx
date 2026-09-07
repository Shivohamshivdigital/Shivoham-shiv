import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import {
  Sparkles,
  ChevronRight,
  ArrowRight,
  Leaf,
  GraduationCap,
  Baby,
  Scale,
  Building2,
  Wind,
  Hand,
  Fingerprint,
  Award,
  BookOpen,
  Users,
  Globe,
  Compass,
  HelpCircle,
} from "lucide-react";

interface HomeViewProps {
  onOpenConsultation: () => void;
  onSetBanner: (message: string) => void;
}

const WELLNESS_PROGRAMS = [
  {
    icon: Baby,
    title: "Kids Mindfulness & Focus",
    tagline: "Help Your Child Build Focus, Calmness & Healthy Habits",
    desc: "Introduce children to age-appropriate mindfulness, breathing, yoga and focus-building practices that can become part of their daily routine — encouraging greater awareness, concentration and positive lifestyle habits.",
    cta: "Explore Kids Mindfulness & Focus",
    to: "/courses/mindfulness-kids",
  },
  {
    icon: Scale,
    title: "Weight Management & Wellness",
    tagline: "Build Healthier Habits. Create Sustainable Lifestyle Changes.",
    desc: "Develop a healthier relationship with movement, daily routines, mindful practices and lifestyle habits. Our wellness approach focuses on building consistency rather than short-term solutions.",
    cta: "Explore Weight Management & Wellness",
    to: "/weight-loss",
  },
  {
    icon: Building2,
    title: "Corporate & Adult Wellness",
    tagline: "Healthier People. Healthier Workplaces.",
    desc: "Practical wellness — yoga, mindfulness, breathing, movement and stress-management — brought into everyday work life for corporates, startups, IT companies, institutions, healthcare organizations, and remote & hybrid teams.",
    cta: "Explore Corporate Wellness",
    to: "/courses/corporate-wellness",
  },
  {
    icon: Wind,
    title: "Yoga & Meditation",
    tagline: "Move Better. Breathe Better. Live With Greater Awareness.",
    desc: "Build a consistent practice through Yoga, Meditation, Pranayama and mindfulness — designed to make traditional practices practical and accessible for today's lifestyle.",
    cta: "Enquire about Yoga & Meditation",
    to: "/contact",
  },
];

const ACADEMY_PROGRAMS = [
  {
    icon: Fingerprint,
    title: "Mudra Therapy",
    tagline: "Learn the Traditional Science of Mudras",
    desc: "Explore the principles, techniques and practical application of Mudra Therapy through structured learning, and develop a stronger foundation for professional application.",
    cta: "Explore Mudra Therapy",
    to: "/courses/mudra-therapy",
  },
  {
    icon: Hand,
    title: "Ayurvedic Acupressure",
    tagline: "Learn Traditional Acupressure & Wellness Practices",
    desc: "Develop knowledge of traditional acupressure principles, pressure points and practical application through structured education and guided practice — a strong foundation for responsible professional wellness practice.",
    cta: "Explore Ayurvedic Acupressure",
    to: "/courses/acupressure-therapy",
  },
  {
    icon: Award,
    title: "Advanced Certifications",
    tagline: "Take Your Wellness Knowledge to the Next Level",
    desc: "Go beyond foundational learning with advanced education, practical application, mentorship and specialized certification pathways — for learners who want to deepen their knowledge and professional confidence.",
    cta: "Explore Advanced Certifications",
    to: "/academy",
  },
];

const DIFFERENTIATOR = [
  { n: "01", t: "Learn", d: "Understand the foundations, principles and traditional knowledge behind your chosen wellness discipline." },
  { n: "02", t: "Practice", d: "Develop practical skills through guided demonstrations, exercises and structured practice." },
  { n: "03", t: "Understand Application", d: "Learn how wellness practices can be selected and adapted according to different individual needs and goals." },
  { n: "04", t: "Build Confidence", d: "Develop the knowledge and practical framework needed to work with clients responsibly within your professional scope." },
  { n: "05", t: "Get Certified", d: "Complete the applicable course requirements and receive certification from Shivoham Shiv Academy." },
  { n: "06", t: "Continue Growing", d: "Progress toward advanced learning, mentorship and professional development." },
];

const WHY = [
  { icon: Leaf, t: "Traditional Knowledge", d: "Explore practices rooted in India's rich wellness and knowledge traditions." },
  { icon: BookOpen, t: "Structured Education", d: "Learn through clearly designed programs rather than disconnected information." },
  { icon: Compass, t: "Practical Learning", d: "Move beyond theory and develop practical understanding through guided learning." },
  { icon: Users, t: "Guided Mentorship", d: "Learn with support from experienced wellness educators and practitioners." },
  { icon: GraduationCap, t: "Professional Development", d: "Build your knowledge through progressive courses and certification pathways." },
  { icon: Globe, t: "Learn From Anywhere", d: "Access online wellness education and learning opportunities from anywhere in the world." },
];

const WHO_WE_SERVE = [
  { icon: Users, t: "Individuals & Families", d: "Build practical wellness habits together." },
  { icon: Baby, t: "Children", d: "Develop mindfulness, focus and healthy routines." },
  { icon: Building2, t: "Working Professionals", d: "Introduce movement, mindfulness and stress-management into busy lifestyles." },
  { icon: Building2, t: "Organizations", d: "Create structured wellness initiatives for employees and teams." },
  { icon: Leaf, t: "Wellness Enthusiasts", d: "Explore traditional Indian wellness practices more deeply." },
  { icon: GraduationCap, t: "Aspiring Practitioners", d: "Develop professional knowledge through specialized Academy programs." },
];

const HOW_IT_WORKS = [
  { n: "01", t: "Choose Your Goal", d: "Decide whether you want personal wellness or professional learning." },
  { n: "02", t: "Choose Your Program", d: "Select the wellness program or Academy course that matches your needs." },
  { n: "03", t: "Learn With Guidance", d: "Participate in structured online learning and guided sessions." },
  { n: "04", t: "Practice", d: "Apply what you learn through regular practice." },
  { n: "05", t: "Grow", d: "Continue through advanced learning, certification and professional development." },
];

const LADDER = [
  { t: "Learn", d: "Build strong foundational knowledge." },
  { t: "Practice", d: "Develop practical skills." },
  { t: "Apply", d: "Understand real-world wellness applications." },
  { t: "Get Certified", d: "Complete your program and certification requirements." },
  { t: "Grow", d: "Continue developing your expertise and professional confidence." },
];

const CORPORATE_INCLUDES = [
  "Workplace Yoga", "Meditation & Mindfulness", "Pranayama & Breathing Practices",
  "Stress Management", "Desk-Based Movement", "Healthy Lifestyle Education",
  "Employee Wellness Sessions", "Wellness Challenges", "Customized Workshops",
];

const FAQS = [
  { q: "What is Shivoham Shiv?", a: "Shivoham Shiv is a holistic wellness and education platform offering wellness programs and professional learning in areas such as Yoga, Meditation, Pranayama, Mudra Therapy and Ayurvedic Acupressure." },
  { q: "What is the difference between Wellness Programs and the Academy?", a: "Wellness Programs are designed for individuals, families, children, adults and organizations looking to improve their wellbeing and lifestyle. Shivoham Shiv Academy is for people who want deeper education, practical training and professional development in wellness disciplines." },
  { q: "Do I need previous experience to join an Academy course?", a: "Many foundational programs can be started by beginners. Specific eligibility requirements may vary by program." },
  { q: "Will I receive a certificate?", a: "Certification depends on the specific Academy program and completion of its requirements." },
  { q: "Can I use my learning professionally?", a: "Academy programs are designed to develop knowledge and practical skills for professional wellness education and development. Your scope of practice should always remain within your training, applicable laws and professional qualifications." },
  { q: "Do you offer corporate wellness programs?", a: "Yes. Shivoham Shiv offers Corporate & Adult Wellness programs that can be customized for organizations and teams." },
  { q: "Are programs available online?", a: "Yes. Shivoham Shiv provides online learning options so participants can learn from different locations." },
];

export default function HomeView({ onOpenConsultation }: HomeViewProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const sectionLabel = "text-xs uppercase font-bold tracking-widest text-[#EF8321]";
  const heading = "font-heading font-bold text-[#004C53]";
  const orangeBtn =
    "inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#EF8321] hover:bg-[#004C53] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all";
  const tealOutline =
    "inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-[#004C53] text-[#004C53] hover:bg-[#004C53] hover:text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all";

  return (
    <div className="bg-[#FAF5EC] min-h-screen text-[#004C53]/90 font-sans selection:bg-[#EF8321]/20 selection:text-[#EF8321]">
      <SEO
        title="Shivoham Shiv | Vedic Wellness Programs & Professional Academy"
        description="Vedic Wellness for Modern Life. Professional Learning for a Better Future. Explore online wellness programs for individuals, families and organizations, or train as a wellness practitioner through Shivoham Shiv Academy."
        focusKeyword="vedic wellness and education platform"
      />

      {/* 0. CHALLENGE PROMO BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          to="/challenge"
          className="group block max-w-6xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-r from-[#004C53] to-[#003A40] text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-amber-400 text-[#5a3a12] items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-amber-300 mb-1">New · ₹999</span>
                <h3 className="font-heading font-bold text-lg sm:text-2xl leading-tight text-white">14-Day Vedic Detox &amp; Metabolism Challenge</h3>
                <p className="text-xs sm:text-sm text-green-50/80 mt-0.5">Beat bloating, support digestion &amp; feel lighter with 20-minute daily Ayurvedic habits.</p>
              </div>
            </div>
            <span className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-amber-400 group-hover:bg-amber-300 text-[#5a3a12] font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-colors">
              Join for ₹999 <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </section>

      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#004C53] to-[#003A40] text-white mt-6">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-16 sm:py-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold uppercase tracking-widest text-amber-200 mb-6">
            <Leaf className="w-3.5 h-3.5" /> Ancient Wisdom · Modern Wellness
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight text-white">
            Vedic Wellness for Modern Life.<br />
            <span className="text-amber-300">Professional Learning for a Better Future.</span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-green-50/85 max-w-2xl mx-auto leading-relaxed">
            Discover a holistic approach to wellbeing through Yoga, Meditation, Pranayama, Mudra Therapy,
            Ayurvedic Acupressure and mindfulness practices. We bring traditional Indian wellness knowledge into
            structured programs for modern individuals, families, professionals and aspiring practitioners.
          </p>

          {/* Choose Your Journey */}
          <p className="mt-10 text-[11px] uppercase font-bold tracking-widest text-amber-200">Choose Your Journey</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
            <Link to="/wellness-programs" className="group rounded-2xl bg-white/[0.06] border border-white/15 hover:bg-white/[0.1] p-6 transition-all">
              <div className="flex items-center gap-2 text-amber-200 mb-2"><Leaf className="w-5 h-5" /><span className="font-heading font-bold text-lg text-white">I Want to Improve My Wellbeing</span></div>
              <p className="text-xs text-green-50/80 leading-relaxed mb-4">Explore practical wellness programs for yourself, your family, children or workplace.</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">Explore Wellness Programs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
            <Link to="/academy" className="group rounded-2xl bg-white/[0.06] border border-white/15 hover:bg-white/[0.1] p-6 transition-all">
              <div className="flex items-center gap-2 text-amber-200 mb-2"><GraduationCap className="w-5 h-5" /><span className="font-heading font-bold text-lg text-white">I Want to Become a Practitioner</span></div>
              <p className="text-xs text-green-50/80 leading-relaxed mb-4">Learn specialized wellness practices through structured training, practical learning and certification pathways.</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">Explore Shivoham Shiv Academy <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. TWO PATHS. ONE PURPOSE. */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={sectionLabel}>Two Paths. One Purpose.</span>
            <h2 className={`${heading} text-2xl sm:text-4xl mt-2`}>Learn. Practice. Transform.</h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              Whether you are beginning your personal wellness journey or developing professional wellness skills,
              Shivoham Shiv provides a structured path for your goals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-gradient-to-br from-[#004C53] to-[#003A40] text-white p-8 sm:p-10">
              <Leaf className="w-8 h-8 text-amber-300 mb-4" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">Wellness Programs</span>
              <h3 className="font-heading font-bold text-2xl mt-1 mb-3">Transform Your Mind, Body &amp; Lifestyle</h3>
              <p className="text-sm text-green-50/85 leading-relaxed mb-6">Practical programs designed to help you develop healthier habits, mindfulness, movement and balanced lifestyle practices.</p>
              <Link to="/wellness-programs" className="inline-flex items-center gap-2 px-6 py-3 bg-[#EF8321] hover:bg-[#F49B3E] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all">Explore Wellness Programs <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="rounded-3xl bg-white border border-[#004C53]/10 shadow-sm p-8 sm:p-10">
              <GraduationCap className="w-8 h-8 text-[#EF8321] mb-4" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#EF8321]">Shivoham Shiv Academy</span>
              <h3 className="font-heading font-bold text-2xl text-[#004C53] mt-1 mb-3">Learn. Practice. Get Certified.</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">Structured education for people who want to develop deeper knowledge and practical skills in traditional Indian wellness practices.</p>
              <Link to="/academy" className={tealOutline}>Explore Academy <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WELLNESS PROGRAMS */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-white border-y border-[#004C53]/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className={sectionLabel}>🌿 Wellness Programs</span>
            <h2 className={`${heading} text-2xl sm:text-4xl mt-2`}>Transform Your Health. Mind. Lifestyle.</h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              Designed for modern lifestyles and focused on practical, sustainable wellbeing — whether you want to
              improve your own lifestyle, support your family, help children build healthy habits or create a
              healthier workplace.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WELLNESS_PROGRAMS.map((p) => (
              <div key={p.title} className="flex flex-col bg-[#FAFBF7] rounded-3xl border border-[#004C53]/10 shadow-sm hover:shadow-md transition-all p-7">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF6F6] text-[#004C53] flex items-center justify-center mb-4"><p.icon className="w-6 h-6" /></div>
                <h3 className="font-heading font-bold text-lg text-[#004C53]">{p.title}</h3>
                <p className="text-sm font-semibold text-[#EF8321] mt-0.5 mb-2">{p.tagline}</p>
                <p className="text-xs text-slate-600 leading-relaxed flex-grow">{p.desc}</p>
                <Link to={p.to} className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#004C53] hover:text-[#EF8321] transition-colors">{p.cta} <ChevronRight className="w-4 h-4" /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ACADEMY */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className={sectionLabel}>🎓 Shivoham Shiv Academy</span>
            <h2 className={`${heading} text-2xl sm:text-4xl mt-2`}>Learn. Practice. Get Certified. Build Professional Confidence.</h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              For individuals who want to go beyond personal wellness and develop specialized knowledge in
              traditional Indian wellness practices — through structured education, practical training, guided
              learning and certification pathways.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ACADEMY_PROGRAMS.map((p) => (
              <div key={p.title} className="flex flex-col bg-white rounded-3xl border border-[#004C53]/10 shadow-sm hover:shadow-md transition-all p-7">
                <div className="w-12 h-12 rounded-2xl bg-[#004C53] text-white flex items-center justify-center mb-4"><p.icon className="w-6 h-6" /></div>
                <h3 className="font-heading font-bold text-lg text-[#004C53]">{p.title}</h3>
                <p className="text-sm font-semibold text-[#EF8321] mt-0.5 mb-2">{p.tagline}</p>
                <p className="text-xs text-slate-600 leading-relaxed flex-grow">{p.desc}</p>
                <Link to={p.to} className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#004C53] hover:text-[#EF8321] transition-colors">{p.cta} <ChevronRight className="w-4 h-4" /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ACADEMY DIFFERENTIATOR */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-[#EEF6F6] border-y border-[#004C53]/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-4">
            <span className={sectionLabel}>⭐ Academy Difference</span>
            <h2 className={`${heading} text-2xl sm:text-4xl mt-2`}>Don't Just Learn. Learn How to Apply.</h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">Information alone does not create a confident practitioner.</p>
            <p className="text-xs font-bold uppercase tracking-wider text-[#EF8321] mt-4">Knowledge → Practice → Application → Certification → Professional Growth</p>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DIFFERENTIATOR.map((s) => (
              <div key={s.n} className="rounded-2xl bg-white border border-[#004C53]/10 p-6">
                <span className="font-heading text-2xl font-extrabold text-[#EF8321]">{s.n}</span>
                <h3 className="font-heading font-bold text-base text-[#004C53] mt-1 mb-1.5">{s.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ACADEMY USP */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <span className={sectionLabel}>🔥 Advanced Training</span>
          <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>Build the Confidence to Support Clients With Complex Wellness Needs</h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-4">
            Wellness practitioners may encounter clients with multiple, long-standing or chronic health concerns.
            Our advanced training is designed to help you develop structured knowledge, practical skills and greater
            confidence in applying appropriate supportive wellness practices — learning not only what a technique is,
            but how to use it responsibly within your professional scope.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-bold text-[#004C53]">
            <span>Learn the Technique.</span><span className="text-[#EF8321]">·</span>
            <span>Understand the Application.</span><span className="text-[#EF8321]">·</span>
            <span>Practice With Guidance.</span><span className="text-[#EF8321]">·</span>
            <span>Build Professional Confidence.</span>
          </div>
          <div className="mt-8"><Link to="/academy" className={orangeBtn}>Explore Academy Certifications <ArrowRight className="w-4 h-4" /></Link></div>
          <p className="text-[11px] text-slate-500 leading-relaxed mt-6 max-w-xl mx-auto">
            Academy education and certification are intended for wellness education and professional development. They
            do not replace medical diagnosis, emergency care or treatment by qualified healthcare professionals.
          </p>
        </div>
      </section>

      {/* 7. WHY SHIVOHAM SHIV */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-white border-y border-[#004C53]/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className={sectionLabel}>Why Shivoham Shiv?</span>
            <h2 className={`${heading} text-2xl sm:text-4xl mt-2`}>Traditional Wisdom. Structured Learning. Practical Application.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY.map((w) => (
              <div key={w.t} className="rounded-3xl bg-[#FAFBF7] border border-[#004C53]/10 p-6">
                <div className="w-11 h-11 rounded-2xl bg-[#EEF6F6] text-[#004C53] flex items-center justify-center mb-4"><w.icon className="w-6 h-6" /></div>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{w.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CORPORATE WELLNESS */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-[#004C53] to-[#003A40] text-white p-8 sm:p-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">Corporate Wellness</span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mt-2">Create a Healthier, More Balanced Workplace</h2>
          <p className="text-sm text-green-50/85 leading-relaxed mt-3 max-w-2xl">
            Long hours of sitting, high workloads, digital exposure and workplace pressure can make healthy routines
            difficult. Our Corporate Wellness Programs help organizations bring practical wellness into the working
            environment.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {CORPORATE_INCLUDES.map((c) => (
              <span key={c} className="text-[11px] font-semibold rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-green-50/90">{c}</span>
            ))}
          </div>
          <div className="mt-8">
            <button onClick={onOpenConsultation} className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#EF8321] hover:bg-[#F49B3E] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all">
              Talk to Us About Corporate Wellness <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 9. WHO WE SERVE */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-[#EEF6F6] border-y border-[#004C53]/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className={sectionLabel}>Who We Serve</span>
            <h2 className={`${heading} text-2xl sm:text-4xl mt-2`}>A Wellness Journey for Every Stage of Life</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHO_WE_SERVE.map((w) => (
              <div key={w.t} className="rounded-3xl bg-white border border-[#004C53]/10 p-6">
                <div className="w-11 h-11 rounded-2xl bg-[#EEF6F6] text-[#004C53] flex items-center justify-center mb-4"><w.icon className="w-6 h-6" /></div>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{w.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. HOW IT WORKS */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className={sectionLabel}>How It Works</span>
            <h2 className={`${heading} text-2xl sm:text-4xl mt-2`}>Your Journey Starts Here</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.n} className="rounded-2xl bg-white border border-[#004C53]/10 p-6">
                <span className="font-heading text-xl font-extrabold text-[#EF8321]">{s.n}</span>
                <h3 className="font-heading font-bold text-sm text-[#004C53] mt-1 mb-1.5">{s.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. LEARNING TO PROFESSIONAL CONFIDENCE */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-white border-y border-[#004C53]/10">
        <div className="max-w-3xl mx-auto text-center">
          <span className={sectionLabel}>From Learning to Professional Confidence</span>
          <h2 className={`${heading} text-2xl sm:text-3xl mt-2 mb-8`}>Your Knowledge Can Become Your Professional Skill</h2>
          <ol className="relative border-l-2 border-[#004C53]/15 ml-3 space-y-6 text-left max-w-md mx-auto">
            {LADDER.map((s, i) => (
              <li key={s.t} className="ml-5">
                <span className="absolute -left-[9px] w-4 h-4 rounded-full bg-[#EF8321] border-2 border-white" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#EF8321]">Step {i + 1}</span>
                <h3 className="font-heading font-bold text-base text-[#004C53]">{s.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8"><Link to="/academy" className={orangeBtn}>Start Your Academy Journey <ArrowRight className="w-4 h-4" /></Link></div>
        </div>
      </section>

      {/* 12. GLOBAL WELLNESS COMMUNITY */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <span className={sectionLabel}>Global Wellness Community</span>
          <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>Bringing Traditional Indian Wellness to the World</h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-4">
            Shivoham Shiv combines traditional Indian wellness practices with modern online education to make
            structured learning accessible across the globe. Whether you join a wellness program for yourself or
            pursue professional education through the Academy, you can learn and grow from wherever you are.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#EEF6F6] border border-[#004C53]/10 px-4 py-1.5 text-xs font-bold text-[#004C53]">
            <Users className="w-3.5 h-3.5 text-[#EF8321]" /> 10,000+ Wellness Community &amp; Growing
          </div>
          <div className="mt-8"><Link to="/community" className={orangeBtn}>Join Shivoham Shiv <ArrowRight className="w-4 h-4" /></Link></div>
        </div>
      </section>

      {/* 13. FAQ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 bg-white border-t border-[#004C53]/10 pt-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className={sectionLabel}>FAQ</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>Common Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="rounded-2xl border border-[#004C53]/10 bg-[#FAFBF7] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                  aria-expanded={openFaq === i}
                >
                  <span className="flex items-start gap-2.5 text-sm font-bold text-[#004C53]">
                    <HelpCircle className="w-4 h-4 text-[#EF8321] shrink-0 mt-0.5" /> {f.q}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-[#EF8321] shrink-0 transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                </button>
                {openFaq === i && <p className="px-5 pb-4 text-sm text-slate-600 leading-relaxed pl-12">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. FINAL CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-gradient-to-b from-[#004C53] to-[#003A40] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white">Your Wellness Journey. Your Learning Journey. Your Next Step.</h2>
          <p className="mt-4 text-sm sm:text-base text-green-50/85 max-w-2xl mx-auto leading-relaxed">
            Whether you want to transform your own wellbeing or build professional expertise in traditional Indian
            wellness, Shivoham Shiv gives you a structured path to move forward.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="rounded-2xl bg-white/[0.06] border border-white/15 p-6">
              <div className="flex items-center gap-2 text-amber-200 mb-2"><Leaf className="w-5 h-5" /><span className="font-heading font-bold text-white">Want Better Wellbeing?</span></div>
              <p className="text-xs text-green-50/80 leading-relaxed mb-4">Explore programs designed for individuals, families, children and workplaces.</p>
              <Link to="/wellness-programs" className="inline-flex items-center gap-2 px-6 py-3 bg-[#EF8321] hover:bg-[#F49B3E] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all">Explore Wellness Programs <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="rounded-2xl bg-white/[0.06] border border-white/15 p-6">
              <div className="flex items-center gap-2 text-amber-200 mb-2"><GraduationCap className="w-5 h-5" /><span className="font-heading font-bold text-white">Want to Become a Practitioner?</span></div>
              <p className="text-xs text-green-50/80 leading-relaxed mb-4">Develop specialized knowledge, practical skills and professional confidence through Shivoham Shiv Academy.</p>
              <Link to="/academy" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#004C53] hover:bg-green-50 font-bold text-xs uppercase tracking-wider rounded-full transition-all">Explore Academy <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
          <p className="mt-10 font-heading text-lg text-amber-200">Start Your Journey With Shivoham Shiv</p>
          <p className="text-sm text-green-50/70">Learn. Practice. Transform. Grow.</p>
        </div>
      </section>
    </div>
  );
}
