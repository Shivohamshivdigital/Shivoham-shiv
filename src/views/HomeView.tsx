import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import SEO from "../components/SEO";
import {
  Play,
  X,
  Star,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  PhoneCall,
  Flame,
  Award,
  Target,
  Users,
  Clock,
  BookOpen,
  Lock,
  Compass,
  Briefcase,
  Layers,
  CheckCircle2,
  HelpCircle,
  Heart
} from "lucide-react";
import { getCourses } from "../services/courseService";
import { Course } from "../types";
import CourseCard from "../components/CourseCard";

interface HomeViewProps {
  onOpenConsultation: () => void;
  onSetBanner: (message: string) => void;
}

const STORIES = [
  {
    title: "Overcoming Somatic Bloating & Revitalizing Digestion",
    student: "Priya M.",
    details: "Age 41, Accountant • Bangalore",
    duration: "Apana Mudra Practice — 3 Weeks",
    text: "For over two years, Priya felt trapped in chronic digestive dampness, acid reflux, and persistent fatigue. After integrating Apana Mudra—the classical Hasta gesture of purification—into her post-work breathing routine for just twenty minutes daily, her digestive discomfort resolved naturally. Today, her sleep cycles are completely stabilized, and her physical energy has returned to full vitality.",
    quote: "A true revelation. Completing the simple energy circuits changed my entire life.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400",
    metric: "Digestive comfort restored"
  },
  {
    title: "Halting Severe Day Stress & Navigating Burnout",
    student: "Devansh R.",
    details: "Age 34, Senior Software Lead • Pune",
    duration: "Gyan Mudra & Dinacharya — 6 Weeks",
    text: "Faced with institutional burnout, intense daylight pressure, and stress-triggered brain fog, Devansh sought refuge in classical wellness. By implementing our corporate stress protocol—including Gyan Mudra and the Circadian Daily routine (Dinacharya)—he succeeded in reducing his chronic anxiety. His focus metrics cleared within weeks.",
    quote: "No gimmicks or trends. Just profound Vedic wisdom paired with direct lineage guidance.",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=400",
    metric: "Cognitive focus unlocked"
  },
  {
    title: "Nurturing Somatic Grounding & Screen-Time Boundaries",
    student: "Ritika Sen (Parent)",
    details: "Mother of Aarav (Age 11) • New Delhi",
    duration: "Kids EQ Breathing — 4 Weeks",
    text: "Aarav struggled with restless classroom focus and screen addiction. Ritika registered him for the Kids EQ program. Through animal-inspired breathing games and creative sensory check-ins, Aarav learned to identify emotional waves and self-soothe naturally. His school attention span has improved, and family communication has flourished.",
    quote: "Empowered my child with a lifeworthy emotional vocabulary. His tablet attachment is down 40%.",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=400",
    metric: "Screen-dependency down 40%"
  }
];

const TESTIMONIALS = [
  {
    quote: "In the middle of professional burnout and physical stagnation, I found a sanctuary of genuine Vedic wisdom. Shivoham Shiv does not teach trendy meditation—they restore the classical Sanskrit lineage with pristine guidance and scientifically sound practices. It changed my health forever.",
    name: "Dr. Ananya Iyer",
    role: "Chief Wellness Consultant & Clinical Biologist",
    gradNum: "Graduate #1,024",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=200"
  },
  {
    quote: "The direct mentorship from certified Vedic teachers is incomparable. Unlike common apps, they review your finger alignments, answer real questions, and provide direct diagnostic checkpoints. It is a true classical classroom.",
    name: "Rohan Deshmukh",
    role: "Corporate Program Director",
    gradNum: "Graduate #892",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=200"
  }
];

const FAQS = [
  {
    q: "Are these courses completely online?",
    a: "Yes, all our offerings are conducted online. They combine live interactive guidance, high-definition tutorial sequences, and home-accessible assignments, bringing true Vedic wisdom directly to your screen."
  },
  {
    q: "Do I need prior experience in yoga or Ayurveda?",
    a: "Not at all. Every curriculum is carefully structured to start from the foundational biological elements (Tattva systems), leading you step-by-step into advanced practices with ease and safety."
  },
  {
    q: "How does Mudra Therapy affect physical health?",
    a: "Hand placements connect nerve endings on your fingertips. By forming these energetic seals, you direct vital energy (prana) to stimulate organ functions, soothe digestion, and regulate nervous stress signals."
  },
  {
    q: "What happens after I pre-register?",
    a: "Pre-registration reserves your space for upcoming releases, locking in early-bird advantages and complementary resources. You can track all reserved paths directly in your Learner Dashboard."
  },
  {
    q: "Are the schedules flexible for busy working professionals?",
    a: "Absolutely. The core lecture material is fully recorded and self-paced. Live group alignment calls are held bimonthly, and all session replays are accessible 24/7."
  },
  {
    q: "How are student results evaluated?",
    a: "Students submit simple checkpoint verification photographs or self-assessments. Certified instructors review these directly to ensure perfect posture and energetic alignments."
  }
];

export default function HomeView({ onOpenConsultation, onSetBanner }: HomeViewProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    getCourses().then(setCourses);
  }, []);

  const handleNextStory = () => {
    setActiveStoryIndex((prev) => (prev + 1) % STORIES.length);
  };

  const handlePrevStory = () => {
    setActiveStoryIndex((prev) => (prev - 1 + STORIES.length) % STORIES.length);
  };

  const handleNextTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrevTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="bg-[#FAF5EC] min-h-screen text-[#004C53]/90 font-sans selection:bg-[#D9741A]/20 selection:text-[#D9741A]">
      <SEO
        title="Shivoham Shiv | Vedic Wellness Programs & Professional Academy"
        description="Explore online wellness programs for individuals, children and organizations, or develop professional skills through Shivoham Shiv's traditional Indian wellness education and certification pathways."
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
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-amber-300 mb-1">
                  New · ₹999
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-2xl leading-tight text-white">
                  14-Day Vedic Detox &amp; Metabolism Challenge
                </h3>
                <p className="text-xs sm:text-sm text-green-50/80 mt-0.5">
                  Beat bloating, support digestion &amp; feel lighter with 20-minute daily Ayurvedic habits.
                </p>
              </div>
            </div>
            <span className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-amber-400 group-hover:bg-amber-300 text-[#5a3a12] font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-colors">
              Join for ₹999 <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </section>

      {/* 1. HERO SECTION — TWO-PART SPLIT */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FAF5EC]">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-[#004C53]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-[#D9741A]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* LEFT: Headline, Sub, CTA, Avatar Cluster */}
            <div className="lg:col-span-6 flex flex-col space-y-8 text-left relative z-10">
              
              <div className="inline-flex items-center space-x-2 bg-[#004C53]/10 border border-[#004C53]/20 rounded-full px-4 py-1.5 w-fit text-[#004C53] text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#D9741A]" />
                <span>Traditional Indian Wellness Education, Delivered Globally</span>
              </div>

              <h1 className="font-heading font-semibold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#004C53] leading-[1.12]">
                Ancient Wisdom.<br /><span className="italic text-[#004C53] font-heading font-medium">Modern Wellness.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#004C53]/80 leading-relaxed max-w-xl">
                Transform your wellbeing or build your expertise in traditional Indian wellness — through
                structured online programs, professional certifications and a global learning community.
              </p>

              {/* Action Buttons — two paths, each with helper text */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="flex flex-col items-start gap-1.5">
                  <Link
                    to="/wellness-programs"
                    className="w-full sm:w-auto px-8 py-4 bg-[#EF8321] hover:bg-[#d9741a] text-white rounded-full font-bold text-sm uppercase tracking-wider text-center shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Explore Wellness Programs
                  </Link>
                  <span className="text-[11px] text-[#004C53]/60 px-1">For yourself, your family, your team or your organization.</span>
                </div>
                <div className="flex flex-col items-start gap-1.5">
                  <Link
                    to="/academy"
                    className="w-full sm:w-auto px-8 py-4 border-2 border-[#004C53] text-[#004C53] rounded-full font-bold text-sm uppercase tracking-wider text-center hover:bg-[#004C53]/5 transition-all duration-200"
                  >
                    Explore Academy
                  </Link>
                  <span className="text-[11px] text-[#004C53]/60 px-1">Learn specialized wellness practices and develop practitioner skills.</span>
                </div>
              </div>

              {/* Tertiary — talk to us first */}
              <button
                onClick={onOpenConsultation}
                className="text-sm font-semibold text-[#D9741A] hover:text-[#C56A15] underline underline-offset-2 w-fit transition-colors"
              >
                Prefer to talk first? Book a free session →
              </button>

              {/* Avatar Cluster with "1,258+ learners" */}
              <div className="flex items-center space-x-4 pt-4 border-t border-[#004C53]/10">
                <div className="flex -space-x-3 overflow-hidden">
                  {[
                    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
                    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
                    "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80",
                    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
                  ].map((imgUrl, i) => (
                    <img
                      key={i}
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-[#FAF5EC] object-cover"
                      src={imgUrl}
                      alt="Student avatar"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div className="text-left font-sans text-xs">
                  <p className="font-bold text-[#004C53] text-sm">1,258+ Global Learners</p>
                  <p className="text-[#004C53]/70">Actively holding space & breathing daily</p>
                </div>
              </div>

            </div>

            {/* RIGHT: Asymmetric Bento Grid of 5-6 Tiles */}
            <div className="lg:col-span-6 relative">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 auto-rows-auto sm:auto-rows-[150px]">
                
                {/* Tile 1: Large Serene Photo */}
                <div className="col-span-1 sm:col-span-2 sm:row-span-2 h-48 sm:h-auto rounded-3xl overflow-hidden shadow-sm relative group bg-neutral-100 border border-[#004C53]/5">
                  <img
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
                    alt="Ayurvedic Practitioner meditating"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-5">
                    <span className="text-xs uppercase font-bold tracking-widest text-[#FAF5EC]">
                      Sadhana & Stillness
                    </span>
                  </div>
                </div>

                {/* Tile 2: Small Text/Vibe Card */}
                <div className="col-span-1 bg-[#004C53] text-[#FAF5EC] p-5 rounded-3xl shadow-sm flex flex-col justify-center text-left border border-[#004C53]/10 min-h-[120px] sm:min-h-0">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D9741A] mb-1.5Block">Dialogue</span>
                  <p className="font-heading font-medium text-sm leading-snug">
                    Your wellness journey starts here
                  </p>
                </div>

                {/* Tile 3: Stat card */}
                <div className="col-span-1 bg-white border border-[#004C53]/15 p-5 flex flex-col items-center justify-center rounded-3xl text-center shadow-sm min-h-[120px] sm:min-h-0">
                  <div className="flex items-center space-x-1 mb-1 text-[#D9741A]">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-heading font-bold text-lg text-[#004C53]">4.9★</span>
                  </div>
                  <p className="text-[10px] uppercase font-semibold text-[#004C53]/70 tracking-wider">
                    Rated worldwide
                  </p>
                </div>

                {/* Tile 4: High-contrast Text card */}
                <div className="col-span-1 bg-[#D9741A] text-white p-5 rounded-3xl shadow-sm flex flex-col justify-center text-left min-h-[120px] sm:min-h-0">
                  <p className="font-sans font-extrabold text-sm uppercase tracking-wider mb-1">Mantra</p>
                  <p className="font-heading font-medium text-sm leading-snug">
                    Pause. Notice. Breathe. Heal.
                  </p>
                </div>

                {/* Tile 5: Photo element */}
                <div className="col-span-1 sm:row-span-2 h-48 sm:h-auto rounded-3xl overflow-hidden shadow-sm relative group bg-neutral-100 border border-[#004C53]/5">
                  <img
                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=500"
                    alt="Vedic yoga practitioner"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent flex items-end p-4">
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">Ayurvedic Elements</span>
                  </div>
                </div>

                {/* Tile 6: Testimonial note block */}
                <div className="col-span-1 bg-white border border-[#004C53]/10 p-5 rounded-3xl shadow-sm flex flex-col justify-center text-left min-h-[120px] sm:min-h-0">
                  <Heart className="w-3.5 h-3.5 text-[#D9741A] mb-1.5" />
                  <p className="italic text-xs text-[#004C53]/80 leading-relaxed font-light mb-1">
                    “Stillness found inside.”
                  </p>
                  <span className="text-[9px] font-semibold text-[#004C53]/60 block">— Amit K.</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 0.5 TWO PATHS — What are you looking for? */}
      <section className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-[#EF8321]">One platform · Two paths</span>
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-[#004C53] mt-2">What are you looking for?</h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-2">
              Shivoham Shiv brings traditional Indian wellness into modern online learning — transform your own
              wellbeing, or train to become a certified practitioner.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wellness path */}
            <Link
              to="/wellness-programs"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#004C53] to-[#003A40] text-white p-8 sm:p-10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-200 mb-5">
                <Heart className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">Wellness · Transform</span>
              <h3 className="font-heading font-bold text-2xl mt-1 mb-3 text-white">I want to transform my wellness</h3>
              <p className="text-sm text-green-50/85 leading-relaxed mb-6">
                Practical wellness programs for individuals, families, children and organizations — weight
                management, meditation, yoga and stress relief.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-white">
                Explore Wellness Programs <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            {/* Academy path */}
            <Link
              to="/academy"
              className="group relative overflow-hidden rounded-3xl bg-white border border-green-100 p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E3F1F1] flex items-center justify-center text-[#004C53] mb-5">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#EF8321]">Academy · Become</span>
              <h3 className="font-heading font-bold text-2xl text-[#004C53] mt-1 mb-3">I want to become a practitioner</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Learn traditional wellness practices through structured online education, practical training and
                certification.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-[#004C53]">
                Explore Academy <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 0.6 THREE-PILLAR OVERVIEW */}
      <section className="px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#004C53]">
              One Platform. Two Paths. One Global Community.
            </h2>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#EEF6F6] border border-green-100 px-4 py-1.5 text-xs font-bold text-[#004C53]">
              10,000+ Wellness Community &amp; Growing
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { to: "/wellness-programs", label: "Wellness Programs", sub: "Transform Yourself", desc: "Personal, family, children's and workplace wellness programs.", icon: Heart, accent: "bg-[#E3F1F1] text-[#004C53]" },
              { to: "/academy", label: "Academy", sub: "Empower Others", desc: "Structured learning, practitioner training and specialized certifications.", icon: Award, accent: "bg-amber-50 text-[#EF8321]" },
              { to: "/community", label: "Community", sub: "Grow Together", desc: "Ongoing learning, guided sessions, peer connection and practitioner development.", icon: Users, accent: "bg-[#E3F1F1] text-[#004C53]" },
            ].map((p) => (
              <Link
                key={p.to}
                to={p.to}
                className="group flex flex-col items-center text-center bg-white border border-green-100 rounded-3xl p-8 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${p.accent}`}>
                  <p.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#004C53]">{p.label}</h3>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#EF8321] mt-1">{p.sub}</span>
                <p className="text-xs text-slate-600 leading-relaxed mt-3">{p.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION — "HELPING YOU HARMONIZE MIND, BODY & SPIRIT" */}
      <section className="py-20 lg:py-28 bg-[#FAF5EC] border-t border-[#004C53]/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Heading and Terracotta Card */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-[#D9741A]">
                Ancient Roots, Modern Compass
              </span>
              <h2 className="font-heading font-semibold text-3xl sm:text-4xl text-[#004C53] leading-tight">
                Helping you harmonize mind, body & spirit
              </h2>

              <div className="bg-[#D9741A]/5 border-l-4 border-[#D9741A] p-6 rounded-r-2xl text-left bg-white shadow-sm mt-4">
                <p className="font-heading text-lg italic text-[#004C53] leading-relaxed mb-3">
                  "Sadhana is not a set of exercises. It is a systematic return to classical elemental order."
                </p>
                <span className="text-xs uppercase font-bold tracking-widest text-[#D9741A] block">
                  Vedic Lineage Mantra
                </span>
              </div>
            </div>

            {/* Right Column: Multi-paragraph narrative */}
            <div className="lg:col-span-7 flex flex-col space-y-6 text-left text-sm sm:text-base text-[#004C53]/80 leading-relaxed font-light pt-2">
              <p>
                Shivoham Shiv was created with a single, clear objective: to protect the purity and lineage of Sanskrit wellness traditions, making them highly approachable and clinically impactful for modern, busy lives. Our pathways do not follow standard fitness trends or superficial wellness fads. Instead, we dive straight into original Vedic sciences.
              </p>
              <p>
                Through classical Hasta Mudra Mudra maps, precise Marma pressure point stimulations, and Ayurvedic daily routines (Dinacharya), we help you activate physical self-healing systems and soothe overstimulated cortisol levels. Every exercise, lecture, and breathing sequence is tailored to return individual bodily elements to their unique original constitution (Prakriti).
              </p>
              
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center space-x-1 text-[#D9741A] hover:text-[#C56A15] text-sm font-semibold group hover:underline"
                >
                  <span>Read Our Full Story</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. "HOW WE WORK" SECTION WITH VIDEO BLOCK */}
      <section className="py-20 lg:py-28 bg-[#FFFDF9] border-t border-b border-[#004C53]/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-[#D9741A]">
              Sequential Guidance
            </span>
            <h2 className="font-heading font-semibold text-3xl sm:text-4xl text-[#004C53] mt-2 mb-4">
              Our 4-Step Process
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-[#004C53]/70 max-w-xl mx-auto font-light">
              We translate timeless Eastern scriptures into practical daily protocols, following a clear, lineage-backed healing sequence.
            </p>
          </div>

          {/* Process Timeline Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                num: "01",
                title: "Dosha Diagnostic",
                desc: "Discover your unique body-mind constitution (Prakriti) using our classical element-calculating queries."
              },
              {
                num: "02",
                title: "Mudra Circuitry",
                desc: "Unlock subtle energetic circuits in your hands using precise finger contact, duration, and pressure points."
              },
              {
                num: "03",
                title: "Prana Cooling",
                desc: "Stabilize mental ripples using traditional breathing ratios and soothing acoustic drone alignments."
              },
              {
                num: "04",
                title: "Certified Checkout",
                desc: "Receive customized posture reviews directly from chief mentors and log lifetime certificates."
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-[#FAF5EC] border border-[#004C53]/5 p-6 rounded-2xl flex flex-col justify-between text-left relative shadow-sm group hover:-translate-y-0.5 transition-transform duration-200">
                <div>
                  <span className="font-heading font-bold text-4xl text-[#004C53]/20 block group-hover:text-[#004C53]/45 transition-colors duration-250 mb-4">{step.num}</span>
                  <h3 className="font-heading font-semibold text-base text-[#004C53] mb-2">{step.title}</h3>
                  <p className="text-xs text-[#004C53]/80 font-light leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Centerpiece: Elegant Video Block with Play Button Modal */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="font-heading font-semibold text-lg sm:text-xl text-[#004C53] mb-1">
                Watch: Inside the Mudra & Meditative Space
              </h3>
              <p className="text-xs text-[#004C53]/70 font-light max-w-md mx-auto">
                Take a brief visual journey into our interactive learning academy and see how our lessons are formatted.
              </p>
            </div>

            <div
              onClick={() => setIsVideoOpen(true)}
              className="aspect-video relative rounded-3xl overflow-hidden shadow-lg border-4 border-white group cursor-pointer bg-neutral-100"
            >
              <img
                src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1200"
                alt="Inside the meditative space"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-101"
              />
              <div className="absolute inset-0 bg-[#004C53]/30 group-hover:bg-[#004C53]/20 transition-colors duration-300 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FAF5EC] text-[#D9741A] rounded-full flex items-center justify-center shadow-2xl scale-95 group-hover:scale-100 transition-transform duration-300 relative">
                  <div className="absolute inset-0 rounded-full bg-[#FAF5EC] animate-ping opacity-25" />
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current ml-1" />
                </div>
              </div>
              <div className="absolute bottom-5 right-5 bg-black/55 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold text-white tracking-wider flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D9741A]" />
                <span>3:12 Mins Preview</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* VIDEO MODAL INTERACTIVE OVERLAY */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#004C53]/85 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full relative border border-white/10"
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-10 bg-[#FAF5EC] hover:bg-[#FAF5EC]/85 p-2 rounded-full text-[#004C53] transition-transform cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-video bg-black w-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/inpok4MKVLM?autoplay=1&mute=0"
                  title="Inside the mudra & meditative space video preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-5 bg-[#FAF5EC] text-left">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D9741A] block mb-1">
                  Mudra & Sadhana Lineage
                </span>
                <h4 className="font-heading font-medium text-base text-[#004C53] mb-1">
                  Practice space overview
                </h4>
                <p className="text-xs text-[#004C53]/70 font-light">
                  See how certified mentors trace element-pressure channels on finger maps, ensuring proper clinical alignment safely.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. "WHY CHOOSE SHIVOHAM SHIV" SECTION */}
      <section className="py-20 lg:py-28 bg-[#FAF5EC] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Visual element Column */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-sm relative group bg-neutral-100 border border-[#004C53]/5">
                <img
                  src="https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&q=80&w=800"
                  alt="Ancient text studying"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#004C53]/40 flex flex-col justify-end p-6 text-left">
                  <span className="px-3 py-1 bg-[#FAF5EC]/35 backdrop-blur-md text-[#FAF5EC] text-[10px] font-bold tracking-widest uppercase rounded-full w-fit mb-2">
                    Ayurvedic Authenticity
                  </span>
                  <p className="text-white text-base font-heading italic leading-relaxed">
                    "Lineage means maintaining true elements, unchanged across generational tides."
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist Column */}
            <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-[#D9741A]">
                Purity Points
              </span>
              <h2 className="font-heading font-semibold text-3xl text-[#004C53] leading-tight">
                Why you'll love learning with us
              </h2>

              <div className="space-y-6 pt-2">
                {[
                  {
                    letter: "A",
                    title: "Lineage Purity",
                    desc: "Directly sourced from classical Sanskrit texts. No commercial alterations, generic theories, or unvouched concepts."
                  },
                  {
                    letter: "B",
                    title: "Scientific Validation",
                    desc: "We merge original neurological mappings with traditional Marma channels and fingertip electrical circuit sciences."
                  },
                  {
                    letter: "C",
                    title: "Active Live Mentorship",
                    desc: "Benefit from bi-weekly alignment calls where chief guides evaluate individual hand locks and posture details."
                  },
                  {
                    letter: "D",
                    title: "Dynamic Simulators",
                    desc: "Explore hands-on using element calculators, customized countdown intervals, and rhythmic breathers on-demand."
                  },
                  {
                    letter: "E",
                    title: "Lifetime Dashboard Assets",
                    desc: "Secure lifetime access. Log milestones, audit modules, and secure verifiable certifications seamlessly."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex space-x-4 items-start pb-4 border-b border-[#004C53]/5 last:border-none">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#004C53]/15 text-[#004C53] font-bold text-xs shrink-0 mt-0.5">
                      {item.letter}
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-base text-[#004C53]">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-[#004C53]/70 font-light mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. "COURSES" STRIP — LAYOUT OF THE 4 COURSE CARDS */}
      <section className="py-20 lg:py-28 bg-[#FFFDF9] border-t border-b border-[#004C53]/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div className="text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-[#D9741A]">
                Begin Your Path Today
              </span>
              <h2 className="font-heading font-semibold text-3xl text-[#004C53] mt-1">
                Our Signature Courses
              </h2>
            </div>
            <Link
              to="/courses"
              className="mt-4 sm:mt-0 text-sm font-semibold text-[#D9741A] hover:text-[#C56A15] flex items-center space-x-1 group"
            >
              <span>Browse Complete Catalog</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Grid Layout of the 4 Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {courses.slice(0, 4).map((course) => (
              <div key={course.id} className="h-full">
                <CourseCard course={course} />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. "SUCCESS STORIES THAT INSPIRE" — HORIZONTAL CARD CAROUSEL */}
      <section className="py-20 lg:py-28 bg-[#FAF5EC] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-[#D9741A]">
              Real Transitions
            </span>
            <h2 className="font-heading font-semibold text-3xl sm:text-4xl text-[#004C53] mt-2 mb-4">
              Success Stories That Inspire
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-[#004C53]/70 max-w-xl mx-auto font-light">
              Explore structural, lineage-tested healing diaries logged in our student databases. See real elements restoration!
            </p>
          </div>

          {/* Interactive Carousel Layout */}
          <div className="max-w-5xl mx-auto relative px-4">
            
            {/* Story Card Container */}
            <div 
              onTouchStart={(e) => {
                const touchX = e.touches[0].clientX;
                (e.currentTarget as any)._startX = touchX;
              }}
              onTouchEnd={(e) => {
                const startX = (e.currentTarget as any)._startX;
                if (typeof startX !== "number") return;
                const touchX = e.changedTouches[0].clientX;
                const diff = startX - touchX;
                if (diff > 50) {
                  handleNextStory();
                } else if (diff < -50) {
                  handlePrevStory();
                }
              }}
              className="relative overflow-hidden bg-white rounded-3xl border border-[#004C53]/5 shadow-sm p-6 sm:p-10 lg:p-12 min-h-[460px] sm:min-h-[400px] flex flex-col justify-between"
            >
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStoryIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  
                  {/* Left Column: Image & Metric Badge */}
                  <div className="lg:col-span-4 relative flex justify-center">
                    <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-md border-4 border-[#FAF5EC]">
                      <img
                        src={STORIES[activeStoryIndex].image}
                        alt={`Portrait of ${STORIES[activeStoryIndex].student}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* Floating Metric tag */}
                    <div className="absolute -bottom-2 bg-[#004C53] text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md border border-[#FAF5EC]/15">
                      {STORIES[activeStoryIndex].metric}
                    </div>
                  </div>

                  {/* Right Column: Case description */}
                  <div className="lg:col-span-8 text-left space-y-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#D9741A] bg-[#D9741A]/10 px-3 py-1 rounded-full">
                      {STORIES[activeStoryIndex].duration}
                    </span>
                    <h3 className="font-heading font-medium text-xl sm:text-2xl text-[#004C53] leading-snug">
                      {STORIES[activeStoryIndex].title}
                    </h3>
                    <p className="text-xs font-semibold text-[#004C53]/70">
                      Case: <span className="text-[#004C53]">{STORIES[activeStoryIndex].student}</span> • {STORIES[activeStoryIndex].details}
                    </p>
                    <p className="text-xs sm:text-sm text-[#004C53]/80 font-light leading-relaxed">
                      {STORIES[activeStoryIndex].text}
                    </p>
                    <div className="border-t border-[#004C53]/10 pt-4 mt-2">
                      <p className="italic font-heading text-sm text-[#004C53] leading-relaxed">
                        “{STORIES[activeStoryIndex].quote}”
                      </p>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>

              {/* Slider Dots Indicator */}
              <div className="flex items-center justify-between border-t border-[#004C53]/10 pt-6 mt-8">
                <div className="flex space-x-2">
                  {STORIES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStoryIndex(i)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        activeStoryIndex === i ? "w-6 bg-[#D9741A]" : "w-2.5 bg-[#004C53]/20 hover:bg-[#004C53]/40"
                      }`}
                      aria-label={`Go to case story ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Left/Right Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handlePrevStory}
                    className="p-2.5 rounded-full border border-[#004C53]/15 hover:border-[#004C53]/30 hover:bg-[#004C53]/5 text-[#004C53] transition-all cursor-pointer"
                    aria-label="Previous story case"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextStory}
                    className="p-2.5 rounded-full border border-[#004C53]/15 hover:border-[#004C53]/30 hover:bg-[#004C53]/5 text-[#004C53] transition-all cursor-pointer"
                    aria-label="Next story case"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS — LARGE PULL-QUOTE LAYOUT */}
      <section className="py-20 lg:py-28 bg-[#FFFDF9] border-t border-b border-[#004C53]/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div 
            onTouchStart={(e) => {
              const touchX = e.touches[0].clientX;
              (e.currentTarget as any)._startX = touchX;
            }}
            onTouchEnd={(e) => {
              const startX = (e.currentTarget as any)._startX;
              if (typeof startX !== "number") return;
              const touchX = e.changedTouches[0].clientX;
              const diff = startX - touchX;
              if (diff > 50) {
                handleNextTestimonial();
              } else if (diff < -50) {
                handlePrevTestimonial();
              }
            }}
            className="max-w-4xl mx-auto space-y-8"
          >
            
            <div className="flex justify-center">
              <span className="text-8xl font-serif text-[#D9741A]/20 leading-none select-none">“</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonialIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <blockquote className="font-heading font-medium text-xl sm:text-2xl lg:text-3xl text-[#004C53] leading-relaxed max-w-3xl mx-auto">
                  {TESTIMONIALS[activeTestimonialIndex].quote}
                </blockquote>

                {/* Graduate details */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 pt-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D9741A]/20 shadow-sm">
                    <img
                      src={TESTIMONIALS[activeTestimonialIndex].image}
                      className="w-full h-full object-cover"
                      alt={TESTIMONIALS[activeTestimonialIndex].name}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[#004C53] text-sm leading-tight">
                      {TESTIMONIALS[activeTestimonialIndex].name}
                    </p>
                    <p className="text-[#004C53]/70 text-xs mt-0.5">
                      {TESTIMONIALS[activeTestimonialIndex].role} &bull; <span className="text-[#D9741A] font-semibold">{TESTIMONIALS[activeTestimonialIndex].gradNum}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Quote navigation details */}
            <div className="flex items-center justify-center space-x-4 pt-4">
              <button
                onClick={handlePrevTestimonial}
                className="p-2 rounded-full border border-[#004C53]/10 hover:border-[#004C53]/20 hover:bg-[#004C53]/5 text-[#004C53]/80 cursor-pointer"
                aria-label="Previous testimonial quote"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-sans text-xs text-[#004C53]/60">
                {activeTestimonialIndex + 1} of {TESTIMONIALS.length}
              </span>
              <button
                onClick={handleNextTestimonial}
                className="p-2 rounded-full border border-[#004C53]/10 hover:border-[#004C53]/20 hover:bg-[#004C53]/5 text-[#004C53]/80 cursor-pointer"
                aria-label="Next testimonial quote"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FAQ — TWO-COLUMN ACCORDION */}
      <section className="py-20 lg:py-28 bg-[#FAF5EC] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-[#D9741A]">
              Common Queries
            </span>
            <h2 className="font-heading font-semibold text-3xl sm:text-4xl text-[#004C53] mt-2 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-[#004C53]/70 max-w-xl mx-auto font-light">
              Clear pathways demand clear answers. Review detailed elements below or click contact for specialized assessments.
            </p>
          </div>

          {/* Grid Layout of two accordion columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start max-w-6xl mx-auto">
            
            {/* Column 1 (indexes 0, 1, 2) */}
            <div className="space-y-4">
              {FAQS.slice(0, 3).map((faq, idx) => {
                const uniqueIdx = idx;
                const isExpanded = expandedFaq === uniqueIdx;
                return (
                  <div
                    key={uniqueIdx}
                    className="bg-white border border-[#004C53]/5 rounded-2xl p-5 shadow-sm text-left transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFaq(uniqueIdx)}
                      className="w-full flex justify-between items-center text-left font-heading font-semibold text-sm sm:text-base text-[#004C53] focus:outline-none cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className="p-1 rounded-full bg-[#FAF5EC] text-[#D9741A] ml-4 shrink-0 transition-transform duration-200">
                        {isExpanded ? (
                          <span className="text-xs font-bold leading-none block px-1.5 py-0.5">–</span>
                        ) : (
                          <span className="text-xs font-bold leading-none block px-1.5 py-0.5">+</span>
                        )}
                      </span>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs sm:text-sm text-[#004C53]/80 font-light leading-relaxed pt-4 border-t border-[#004C53]/5 mt-3.5">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Column 2 (indexes 3, 4, 5) */}
            <div className="space-y-4">
              {FAQS.slice(3, 6).map((faq, idx) => {
                const uniqueIdx = idx + 3;
                const isExpanded = expandedFaq === uniqueIdx;
                return (
                  <div
                    key={uniqueIdx}
                    className="bg-white border border-[#004C53]/5 rounded-2xl p-5 shadow-sm text-left transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFaq(uniqueIdx)}
                      className="w-full flex justify-between items-center text-left font-heading font-semibold text-sm sm:text-base text-[#004C53] focus:outline-none cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className="p-1 rounded-full bg-[#FAF5EC] text-[#D9741A] ml-4 shrink-0 transition-transform duration-200">
                        {isExpanded ? (
                          <span className="text-xs font-bold leading-none block px-1.5 py-0.5">–</span>
                        ) : (
                          <span className="text-xs font-bold leading-none block px-1.5 py-0.5">+</span>
                        )}
                      </span>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs sm:text-sm text-[#004C53]/80 font-light leading-relaxed pt-4 border-t border-[#004C53]/5 mt-3.5">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>

          {/* CTA under FAQs */}
          <div className="mt-12 text-center bg-white border border-[#004C53]/5 rounded-3xl p-8 max-w-3xl mx-auto shadow-sm">
            <h4 className="font-heading font-semibold text-[#004C53] text-lg sm:text-xl">
              Ready to start your path to holistic wellness?
            </h4>
            <p className="text-xs text-[#004C53]/70 max-w-sm mx-auto mt-1 mb-6 font-light">
              Secure a detailed, personalized 3-month element diagnostic session with certified chief guides.
            </p>
            <button
              onClick={onOpenConsultation}
              className="px-8 py-3.5 bg-[#D9741A] hover:bg-[#C56A15] text-cream text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-200 shadow-md cursor-pointer"
            >
              Book My Consultation Session
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
