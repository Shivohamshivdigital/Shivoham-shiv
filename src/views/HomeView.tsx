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
    quote: "I came to Shivoham Shiv wanting to improve my own health. Three months later, I'm a certified Mudra therapist. The structured approach and live instruction made all the difference — my clients are already seeing results.",
    name: "Rajesh Kumar",
    role: "Former IT Professional, Now Wellness Practitioner",
    gradNum: "★★★★★",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=200"
  },
  {
    quote: "As a yoga teacher for 8 years, I thought I knew traditional practices. But this academy deepened my understanding completely. Now I can offer my students authentic, safe and science-informed techniques.",
    name: "Priya Sharma",
    role: "Certified Yoga Teacher",
    gradNum: "★★★★★",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=200"
  },
  {
    quote: "The weight management program changed how I think about health. It's not about restriction — it's about understanding your body and building sustainable habits. I've lost weight and kept it off.",
    name: "Isha Desai",
    role: "Wellness Transformation Student",
    gradNum: "★★★★★",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=200"
  }
];

const FAQS = [
  {
    q: "What if I have no experience with Yoga or Ayurveda?",
    a: "Perfect! Both our wellness programs and academy courses are designed for beginners. We start with the foundations and build progressively — no previous experience needed, just curiosity and commitment."
  },
  {
    q: "Is this only for people wanting to become practitioners?",
    a: "No. Our wellness programs are for anyone wanting to improve their own health, and our academy is for people wanting professional certification. Choose based on your goals."
  },
  {
    q: "Are the courses really online? Can I get feedback?",
    a: "Yes, completely online — but not just self-paced videos. We use live classes (3 per week) where instructors give real-time feedback on your technique, and recorded sessions are available for review."
  },
  {
    q: "How long does a certification take?",
    a: "Most certifications are 3 months of structured learning. This isn't a shortcut course — it's designed to give you real depth and competence, not just a certificate."
  },
  {
    q: "Can I really start a career as a wellness practitioner?",
    a: "Yes. Many of our graduates launch their own practices or integrate these skills into existing careers such as yoga teaching, corporate wellness and coaching."
  },
  {
    q: "Not sure which program is right for you?",
    a: "Book a free consultation and our team will help you choose the wellness program or Academy course that best fits your goals."
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
                Ancient Vedic Wisdom,<br /><span className="italic text-[#004C53] font-heading font-medium">Modern Scientific Healing.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#004C53]/80 leading-relaxed max-w-xl">
                Blending timeless Vedic practices — Mudra Therapy, Yoga, Pranayama and Ayurvedic Acupressure —
                into structured, science-informed wellness and certification programs.
              </p>

              <p className="text-sm sm:text-base text-[#004C53]/70 leading-relaxed max-w-xl">
                Transform your health and your career through Shivoham Shiv's structured approach to ancient
                wellness traditions — designed for modern individuals, families, professionals and aspiring practitioners.
              </p>

              {/* Action Buttons — two paths, each with helper text */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="flex flex-col items-start gap-1.5">
                  <Link
                    to="/wellness-programs"
                    className="w-full sm:w-auto px-8 py-4 bg-[#EF8321] hover:bg-[#d9741a] text-white rounded-full font-bold text-sm uppercase tracking-wider text-center shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Explore Programs
                  </Link>
                  <span className="text-[11px] text-[#004C53]/60 px-1">For yourself, your family, your team or your organization.</span>
                </div>
                <div className="flex flex-col items-start gap-1.5">
                  <Link
                    to="/academy"
                    className="w-full sm:w-auto px-8 py-4 border-2 border-[#004C53] text-[#004C53] rounded-full font-bold text-sm uppercase tracking-wider text-center hover:bg-[#004C53]/5 transition-all duration-200"
                  >
                    Join the Academy
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
              <h3 className="font-heading font-bold text-2xl mt-1 mb-3 text-white">🌿 I Want to Improve My Wellbeing</h3>
              <p className="text-sm text-green-50/85 leading-relaxed mb-6">
                Explore practical wellness programs for yourself, your family, children or workplace.
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
              <h3 className="font-heading font-bold text-2xl text-[#004C53] mt-1 mb-3">🎓 I Want to Become a Wellness Practitioner</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Learn specialized wellness practices through structured training, practical learning and
                certification pathways.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-[#004C53]">
                Explore Shivoham Shiv Academy <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              A Growing Global Wellness Community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { to: "/wellness-programs", label: "Shivoham Shiv Wellness", sub: "Holistic Healing & Lifestyle Transformation", desc: "Practical wellness programs designed to help you reclaim your health, build sustainable habits and transform your lifestyle through ancient Vedic practices.", icon: Heart, accent: "bg-[#E3F1F1] text-[#004C53]" },
              { to: "/academy", label: "Shivoham Shiv Academy", sub: "Learn. Practice. Get Certified.", desc: "Professional certification programs combining ancient Vedic knowledge with modern scientific understanding. Learn from certified experts and become a qualified wellness practitioner.", icon: Award, accent: "bg-amber-50 text-[#EF8321]" },
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

          {/* Mission statement */}
          <div className="mt-12 max-w-3xl mx-auto text-center">
            <span className="text-xs uppercase font-bold tracking-widest text-[#EF8321]">Our Vision &amp; Mission</span>
            <p className="mt-3 font-heading text-lg sm:text-2xl text-[#004C53] leading-relaxed">
              At Shivoham Shiv, our mission is to revive, modernize and share the healing wisdom of the Vedas —
              natural, drug-free wellness practices that work with the body's own capacity for balance and self-care.
            </p>
          </div>

          {/* Three conceptual pillars */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { e: "🌿", t: "Drug-Free Practices", d: "Natural, drug-free wellness practices that work with the body's own capacity for balance." },
              { e: "⚡", t: "Dual Practice Approach", d: "Mudra for everyday relief and Marma for ongoing support — a complete natural wellness toolkit." },
              { e: "💪", t: "Empowered Self-Care", d: "Learn to support your own wellbeing with time-tested, natural practices." },
            ].map((p) => (
              <div key={p.t} className="rounded-2xl bg-white border border-green-100 p-5 text-center">
                <div className="text-2xl mb-2">{p.e}</div>
                <h3 className="font-heading font-bold text-sm text-[#004C53] mb-1">{p.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{p.d}</p>
              </div>
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
                About Shivoham Shiv
              </span>
              <h2 className="font-heading font-semibold text-3xl sm:text-4xl text-[#004C53] leading-tight">
                Ancient Wisdom for Modern Life
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
                At Shivoham Shiv, we make authentic Vedic practices accessible, practical and science-informed —
                turning timeless traditions like Mudra Therapy, Yoga, Pranayama and Ayurvedic Acupressure into
                structured programs you can actually use in modern life.
              </p>
              <p>
                Whether you want to improve your own wellbeing or train to become a certified practitioner, we give
                you a clear, guided pathway rooted in tradition and designed for today.
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
                What Makes Us Different
              </span>
              <h2 className="font-heading font-semibold text-3xl text-[#004C53] leading-tight">
                Why Choose Shivoham Shiv?
              </h2>

              <div className="space-y-6 pt-2">
                {[
                  {
                    letter: "A",
                    title: "Authentic Vedic Foundation",
                    desc: "Rooted in genuine Vedic traditions with centuries of practice behind them — not modern reinterpretations."
                  },
                  {
                    letter: "B",
                    title: "Expert Instruction",
                    desc: "Learn from experienced, certified practitioners — not social-media influencers."
                  },
                  {
                    letter: "C",
                    title: "Structured Learning",
                    desc: "Organised programs that build progressively, from foundation to mastery — no random, disconnected information."
                  },
                  {
                    letter: "D",
                    title: "Live + Recorded Flexibility",
                    desc: "Attend live classes for real-time feedback and access recorded sessions to learn at your own pace."
                  },
                  {
                    letter: "E",
                    title: "Professional Certification",
                    desc: "Credentials respected in the wellness industry — use them to build your career or deepen your practice."
                  },
                  {
                    letter: "F",
                    title: "Global Community",
                    desc: "Join a growing global community of wellness seekers and professionals learning together."
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

      {/* 4b. WHO WE SERVE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#004C53]/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#D9741A]">Who We Serve</span>
            <h2 className="font-heading font-semibold text-3xl sm:text-4xl text-[#004C53] mt-2">A Wellness Journey for Every Stage of Life</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { e: "👨‍👩‍👧", t: "Individuals & Families", d: "Build practical wellness habits together." },
              { e: "🧒", t: "Children", d: "Develop mindfulness, focus and healthy routines." },
              { e: "💼", t: "Working Professionals", d: "Introduce movement, mindfulness and stress-management practices into busy lifestyles." },
              { e: "🏢", t: "Organizations", d: "Create structured wellness initiatives for employees and teams." },
              { e: "🧘", t: "Wellness Enthusiasts", d: "Explore traditional Indian wellness practices more deeply." },
              { e: "🎓", t: "Aspiring Practitioners", d: "Develop professional knowledge through specialized Academy programs." },
            ].map((w) => (
              <div key={w.t} className="rounded-3xl bg-[#FAF5EC] border border-[#004C53]/10 p-6">
                <div className="text-3xl mb-3">{w.e}</div>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{w.t}</h3>
                <p className="text-xs text-[#004C53]/70 leading-relaxed">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4c. HOW IT WORKS — 5 STEPS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#D9741A]">How It Works</span>
            <h2 className="font-heading font-semibold text-3xl sm:text-4xl text-[#004C53] mt-2">Your Journey Starts Here</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { n: "01", t: "Choose Your Goal", d: "Decide whether you want personal wellness or professional learning." },
              { n: "02", t: "Choose Your Program", d: "Select the wellness program or Academy course that matches your needs." },
              { n: "03", t: "Learn With Guidance", d: "Participate in structured online learning and guided sessions." },
              { n: "04", t: "Practice", d: "Apply what you learn through regular practice." },
              { n: "05", t: "Grow", d: "Continue your journey through advanced learning, certification and professional development." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl bg-white border border-[#004C53]/10 p-6">
                <span className="font-heading text-xl font-extrabold text-[#EF8321]">{s.n}</span>
                <h3 className="font-heading font-bold text-sm text-[#004C53] mt-1 mb-1.5">{s.t}</h3>
                <p className="text-xs text-[#004C53]/70 leading-relaxed">{s.d}</p>
              </div>
            ))}
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

      {/* 7b. TRUST BADGES */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-[#FAF5EC] border-t border-[#004C53]/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { t: "Certified Mentors", d: "Learn from experienced instructors" },
            { t: "Live + Recorded", d: "Real-time feedback, revisit anytime" },
            { t: "Beginner Friendly", d: "No prior experience needed" },
            { t: "Global Community", d: "Online learners worldwide" },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl bg-white border border-green-100 p-5 text-center shadow-xs">
              <p className="font-heading font-bold text-base text-[#004C53]">{s.t}</p>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">{s.d}</p>
            </div>
          ))}
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
              Quick Questions? We Have Answers.
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-[#004C53]/70 max-w-xl mx-auto font-light">
              Whether you want to improve your own wellbeing or train as a practitioner, here are the answers to the questions we hear most.
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
              Book a free consultation with our team and we'll help you choose the right path for your goals.
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

      {/* 9. GLOBAL COMMUNITY */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#004C53]/10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D9741A]">Global Wellness Community</span>
          <h2 className="font-heading font-semibold text-3xl sm:text-4xl text-[#004C53] mt-2">Bringing Traditional Indian Wellness to the World</h2>
          <p className="mt-4 text-base text-[#004C53]/75 leading-relaxed">
            Shivoham Shiv combines traditional Indian wellness practices with modern online education to make
            structured learning accessible to people across the globe. Whether you are joining a wellness program for
            yourself or pursuing professional education through the Academy, you can learn and grow from wherever you are.
          </p>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#004C53] to-[#003A40] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-300">Your Transformation Starts Today</span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mt-2">Discover the Ancient Science That's Changing Modern Lives</h2>
          <p className="mt-4 text-base text-green-50/85 leading-relaxed">
            Whether you're ready to transform your own health or ready to master ancient healing techniques and build a
            meaningful career, Shivoham Shiv is your structured pathway. Our next batch is limited to a small group to
            ensure personalized attention.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/wellness-programs" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#EF8321] hover:bg-[#F49B3E] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">
              Explore Wellness Programs <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/academy" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#004C53] hover:bg-green-50 font-bold text-xs uppercase tracking-wider rounded-full transition-all">
              Join the Academy <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-green-50/85">
            {["Certified Expert Instructors", "Live + Recorded Classes", "Beginner-Friendly", "Structured 3-Month Programs"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-amber-300" /> {t}</span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
