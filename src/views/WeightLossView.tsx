import React, { useState, useEffect } from "react";
import { 
  Flame, 
  Check, 
  ChevronDown, 
  Phone, 
  User, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Video, 
  Award, 
  Users, 
  BookOpen, 
  Sparkles, 
  Clock, 
  Activity,
  Heart,
  HelpCircle,
  TrendingDown,
  ChevronRight,
  AlertCircle,
  ShieldCheck,
  Clock3
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

// Standard book function simulated or logged
import { bookConsultation } from "../services/consultationService";
import { startPayment, PaymentPlan } from "../services/paymentService";

// Pricing options shown in the single enroll box (selectable via the dropdown).
const PLAN_INFO: Record<PaymentPlan, {
  badge: string;
  title: string;
  price: string;
  original: string | null;
  discount: string | null;
  unit: string;
  desc: string;
  features: string[];
  cta: string;
  dropdownLabel: string;
}> = {
  register: {
    badge: "Reserve Your Seat",
    title: "Registration",
    price: "₹999",
    original: null,
    discount: null,
    unit: "one-time",
    desc: "Lock your spot in this week's batch and get your onboarding started within 24 hours.",
    features: ["Seat reserved in current batch", "Onboarding call within 24 hrs", "Adjustable towards full program"],
    cta: "Register for ₹999",
    dropdownLabel: "Registration — ₹999 (start now)",
  },
  course: {
    badge: "Full Transformation",
    title: "60-Day Natural Program",
    price: "₹7,999",
    original: "₹11,999",
    discount: "30% OFF",
    unit: "full course",
    desc: 'The complete personalized program — backed by our "results or it\'s on us" guarantee.',
    features: ["Prakriti-personalized diet & plan", "Yoga, Pranayama, Mudra & Marma guidance", "Results guarantee — until you reach your goal"],
    cta: "Enroll for ₹7,999",
    dropdownLabel: "60-Day Program — ₹7,999 (30% OFF)",
  },
};

export default function WeightLossView() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  
  // Form elements State
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [fullName, setFullName] = useState(""); // let's store name as well for consultation
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bannerText, setBannerText] = useState<string | null>(null);
  const [payingPlan, setPayingPlan] = useState<PaymentPlan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan>("register");

  const handlePay = async (plan: PaymentPlan) => {
    if (payingPlan) return;
    setPayingPlan(plan);
    try {
      await startPayment(plan, {
        name: fullName || undefined,
        email: email || undefined,
        contact: contactNo || undefined,
      });
      setBannerText("Payment successful! 🎉 Our team will reach out on WhatsApp within 24 hours to begin your journey.");
    } catch (err: any) {
      if (err?.message && err.message !== "Payment cancelled.") {
        setBannerText(err.message);
      }
    } finally {
      setPayingPlan(null);
    }
  };

  const scrollToEnroll = () => {
    document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" });
  };

  // Smooth scroll links helper
  const handleScrollToSegment = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 80; // height of sticky top nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleHeroScroll = () => {
    const element = document.getElementById("contact-us");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !contactNo) {
      setBannerText("Please provide both email and phone details.");
      return;
    }
    
    setIsSubmitting(true);
    console.log("Weight Loss Consultation Entry Captured:", {
      email,
      contactNo,
      fullName: fullName || "Anonymous Learner",
      message,
      submittedAt: new Date().toISOString()
    });

    try {
      // Persist using current consultation service
      await bookConsultation(
        fullName || "Weight Loss Aspirant",
        email,
        contactNo,
        `[NATURAL WEIGHT LOSS INQUIRY] ${message || "I want to join the 60-day natural metabolic reset program."}`
      );
      
      setIsSubmitting(false);
      setIsSuccess(true);
      setBannerText("Aligned! Your weight loss profile is locked into our counseling database.");
      
      // Open WhatsApp chat directly in a new window or trigger simulated action
      const encodedMsg = encodeURIComponent(
        `Pranama, Shivoham Shiv! I have registered for the 60-Day Natural Weight Loss Consultation. Please review my profile (Contact: ${contactNo}).`
      );
      setTimeout(() => {
        window.open(`https://wa.me/919682051868?text=${encodedMsg}`, "_blank");
      }, 1500);

    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setIsSuccess(true); // fall back graciously
    }
  };

  const faqs = [
    {
      q: "Will I have to take supplements or pills?",
      a: "Absolutely not. No pills, no chemical formulas, no meal replacement shakes, and zero commercial supplements. We use purely natural whole foods structured around your biological bodily constitution (Prakriti), accompanied by targeted physical movements and energy locks."
    },
    {
      q: "How soon will I see results?",
      a: "Most clients experience a noticeable drop in severe water bloating, deeper sleep, and significantly higher energy levels in the first 7 to 10 days. Sustainable weight loss typically activates from week 2 onwards as your cortisol level stabilizes."
    },
    {
      q: "Will the weight come back?",
      a: "Traditional crash diets fail because they trigger extreme survival-starvation responses in cellular tissues. Our 60-day program resets your core thyroid and cortisol metabolic clock from within. Once completed, the weight stays off sustainably because your biological craving patterns are neutralized."
    },
    {
      q: "What happens in the free consultation?",
      a: "You will spend 15 minutes with a certified Ayurvedic counselor who will detail your key Prakriti symptoms, diagnose active digestive blocks (Mandagni), and explain your custom step-by-step path to cellular recovery. No pressure, just complete clarity."
    }
  ];

  return (
    <div className="bg-[#FAFBF7] min-h-screen font-sans text-[#3A4A40] overflow-x-hidden selection:bg-green-150">
      {/* Floating toast (payment + form messages) */}
      {bannerText && (
        <div className="fixed bottom-6 right-6 z-[60] max-w-sm w-[calc(100%-3rem)] sm:w-full bg-[#0F3320] text-cream shadow-2xl p-4 rounded-2xl flex items-start gap-3 animate-fadeIn border border-green-800">
          <AlertCircle className="w-5 h-5 text-[#F3C969] shrink-0 mt-0.5" />
          <span className="text-xs leading-relaxed font-medium flex-1">{bannerText}</span>
          <button onClick={() => setBannerText(null)} className="text-green-200 hover:text-white shrink-0" aria-label="Close">✕</button>
        </div>
      )}

      <SEO
        title="Ayurvedic Natural Weight Loss | 60-Day Program — Shivoham Shiv"
        description="Lose weight naturally with Shivoham Shiv's 60-day Ayurvedic program — yoga, pranayama, mudra therapy and a prakriti diet. No pills, no crash diets."
        focusKeyword="ayurvedic natural weight loss"
        isFAQPage={true}
        faqs={faqs}
        isBreadcrumb={true}
        breadcrumbItems={[
          { name: "Home", url: "/" },
          { name: "Natural Weight Loss", url: "/weight-loss" }
        ]}
      />
      
      {/* 2. HERO SECTION */}
      <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 text-left space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#E3F1E3] rounded-full text-[#2F5233] text-xs font-bold uppercase tracking-widest border border-green-200">
              <Sparkles className="w-3.5 h-3.5 text-[#E8943A] fill-[#E8943A]" />
              100% NATURAL · AYURVEDIC ROOT
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-[#2F5233] leading-tight tracking-tight">
              Why does the weight keep coming back?
            </h1>
            
            <p className="text-lg sm:text-xl font-semibold text-[#E8943A] italic">
              And the 60-day natural system that finally stops it.
            </p>
            
            <p className="text-sm sm:text-base leading-relaxed text-[#3A4A40]/90 max-w-xl">
              Chemical pills, crash diets, and extreme starvation break the body down — they don't rebuild it. 
              The 60-Day Natural Program resets metabolism from within via deep Yoga, proper Pranayama, specific 
              Mudra Therapy, Acupressure channels, and a Prakriti-personalized natural diet.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={scrollToEnroll}
                className="px-8 py-4 bg-[#E8943A] hover:bg-[#EFAF3C] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-xl transform hover:-translate-y-0.5 transition-all text-center border-b-2 border-amber-600 flex items-center justify-center gap-2"
              >
                <Clock3 className="w-4 h-4" />
                Get Started in 24 Hrs
              </button>
              <a
                href="#the-program"
                onClick={(e) => handleScrollToSegment(e, "the-program")}
                className="px-8 py-4 border-2 border-[#4A7C59] text-[#4A7C59] hover:bg-[#E3F1E3] rounded-2xl font-bold text-sm uppercase tracking-wider text-center transition-all bg-white"
              >
                See how it works
              </a>
            </div>

            {/* Verification Chips */}
            <div className="flex flex-wrap gap-2.5 pt-4 text-xs font-bold text-green-900 tracking-wide">
              {["100% Natural", "0 Supplements Required", "Personalized Prakriti Diet"].map((chip, idx) => (
                <span key={idx} className="flex items-center gap-1 bg-[#E3F1E3] px-3.5 py-1.5 rounded-full border border-green-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5 relative">
            <div className="w-full aspect-square bg-[#FAFBF7] rounded-[40px] shadow-2xl overflow-hidden relative border-8 border-white">
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200"
                alt="Representative yoga and pranayama posture showing Ayurvedic Natural Transformation for cellular weight loss"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-green-900/10" />

              {/* Dynamic Overlay Badges */}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-xs py-2 px-3.5 rounded-xl shadow-md border border-green-105 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase text-[#2F5233]">7+ Years Experience</span>
              </div>

              <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-xs py-2.5 px-4 rounded-xl shadow-lg border border-[#E3F1E3] flex items-center gap-1.5 text-slate-900">
                <span className="text-amber-500 font-bold text-sm">★ 4.8</span>
                <span className="text-[10px] text-gray-500 font-medium">Ayurvedic Score</span>
              </div>
            </div>

            {/* Rotating Star or Promo Badge */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#E8943A] rounded-full flex items-center justify-center text-white font-bold text-center leading-tight shadow-xl -rotate-12 select-none border border-amber-300">
              Metabolic<br/>Reset!
            </div>
          </div>

        </div>
      </section>

      {/* Hero Stats Strip */}
      <section className="bg-green-950 text-cream py-8 px-4 sm:px-6 lg:px-8 border-y-4 border-[#E8943A]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[
            { value: "6–9kg", label: "avg loss / 60 days" },
            { value: "1,200+", label: "Transformations Guided" },
            { value: "7+ Years", label: "Clinical Experience" },
            { value: "0", label: "Supplements Required" }
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white">{stat.value}</span>
              <span className="block text-[10px] sm:text-xs uppercase tracking-widest text-green-200/80 font-semibold">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Dieting But No Results Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* LEFT — image: rounded-2xl card with soft shadow, full height of the section */}
          <div className="lg:col-span-5 flex">
            <div className="w-full rounded-2xl shadow-md overflow-hidden relative border border-[#2F5D50]/5 flex">
              <img
                src="/images/transformation-reset.jpg"
                alt="Before and after natural weight-loss transformation"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover min-h-[350px] lg:min-h-full"
              />
            </div>
          </div>

          {/* RIGHT — text */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
            <h2 className="text-3xl sm:text-4xl font-semibold font-serif text-[#2F5233] leading-tight">
              Dieting hard but seeing no difference?
            </h2>
            
            <p className="text-sm sm:text-base leading-relaxed text-[#3A4A40]/90 font-light">
              You've cut your meals, skipped the foods you love, and pushed through every workout — yet 
              the scale won't budge and that stubborn belly stays. Here's the truth most diets won't tell you: 
              it's not about how little you eat. When your body is under constant stress, high cortisol keeps 
              it locked in "fat-storage" mode — no matter how strict you are. That's exactly why dieting alone 
              keeps failing. Our 60-Day Natural Program works on the real cause first: calming your body so it 
              finally lets the weight go — naturally and sustainably.
            </p>

            <div className="pt-2">
              <button
                onClick={handleHeroScroll}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#C96E29] hover:bg-[#B25D1D] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <span>Start Your Reset →</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. #why-it-returns SECTION */}
      <section id="why-it-returns" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">The Real Reason</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#2F5233]">
            This isn't a weight problem — it's a <span className="text-[#E8943A] italic font-serif">disconnection</span> problem
          </h2>
          <p className="text-sm leading-relaxed text-[#3A4A40]/80">
            Traditional diets focus purely on caloric calculations and numbers. The Veda teaches us that excess weight is 
            the physical result of systemic disconnection: from our natural body signals (Prakriti), seasonal transitions, 
            and metabolic digestions (Mandagni). Here is why conventional approaches continue to fail:
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 [&::-webkit-scrollbar]:hidden text-left lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
          {[
            {
              title: "Crash Diets",
              desc: "Starvation mode spikes cortisol. Your body hoards every gram of fat in physical survival panic."
            },
            {
              title: "Chemical Pills",
              desc: "Synthetic pills irritate native gut flora and deplete thyroid functions, slowing digestion limits permanently."
            },
            {
              title: "Random Workouts",
              desc: "High-impact stress routines exhaust the system without balancing your primary elemental currents."
            },
            {
              title: "Generic Plans",
              desc: "They completely ignore your unique dosha profile (Vata, Pitta, or Kapha) which regulates your natural structure."
            }
          ].map((card, idx) => (
            <div key={idx} className="snap-start shrink-0 w-[78%] sm:w-[46%] lg:w-auto bg-white rounded-2xl p-6 border-b-4 border-[#E8943A] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between border border-green-100">
              <div className="space-y-3 prose">
                <span className="text-2xl block text-amber-500 font-bold">0{idx + 1}</span>
                <h3 className="font-heading font-bold text-lg text-[#2F5233] leading-snug">{card.title}</h3>
                <p className="text-xs text-[#3A4A40]/85 leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. THE MECHANISM (Cortisol weight-loss line chart) */}
      <section className="bg-[#F2F9F2] py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E3F1E3]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">The Scientific Mechanism</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#2F5233]">
              The one thing every diet misses — cortisol
            </h2>
            <p className="text-sm leading-relaxed text-[#3A4A40]/80">
              Chronic micro-level stress produces cortisol, a biological hormone designed for physiological emergencies. 
              High cortisol locks the fat-storage switch 'ON', signaling your metabolism to retain elements for winter protection. 
              Our natural system resets this switch at the source:
            </p>

            <div className="space-y-4">
              {[
                { step: "1", title: "Pranayama & Meditation Integration", text: "Targeted rhythmic breathing triggers the vagus nerve, dropping nervous stress markers rapidly." },
                { step: "2", title: "Organic Stress Drop", text: "As internal anxiety levels fall, your ancestral cellular tissues turn off the evolutionary 'survival protection mode'." },
                { step: "3", title: "Fat-Storage Switch Turned Off", text: "Your core thyroid metabolism awakens. Weight begins decreasing without metabolic starvation." }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-white/70 backdrop-blur-md p-4 rounded-xl border border-green-100">
                  <div className="w-8 h-8 rounded-full bg-[#4A7C59] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2F5233]">{step.title}</h4>
                    <p className="text-xs text-slate-650 mt-0.5">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Polished interactive SVG cortisol chart card */}
          <div className="lg:col-span-6">
            <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-green-100 shadow-xl relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8943A] block">Averages Database</span>
                  <h4 className="font-heading font-semibold text-base text-[#2F5233]">Average Weight Change (60 Days)</h4>
                </div>
                <div className="flex items-center gap-1 bg-[#F2F9F2] px-2 py-1 rounded-lg text-[10px] font-bold text-[#4A7C59]">
                  <TrendingDown className="w-3 h-3" />
                  <span>-8 kg average tracking</span>
                </div>
              </div>

              {/* Polished Visual SVG Line Chart */}
              <div className="relative w-full h-56 bg-[#FAFBF7] rounded-2xl border border-green-50 p-4 flex flex-col justify-between">
                
                {/* Horizontal grid guide lines */}
                <div className="absolute inset-x-0 top-1/4 border-b border-gray-100 pointer-events-none" />
                <div className="absolute inset-x-0 top-2/4 border-b border-gray-100 pointer-events-none" />
                <div className="absolute inset-x-0 top-3/4 border-b border-gray-100 pointer-events-none" />

                {/* SVG path mapping */}
                <svg className="absolute inset-0 w-full h-full p-6 text-green-600" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Subtle area gradient fallback filled shadow under line */}
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4A7C59" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#4A7C59" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  <path
                    d="M 0 20 L 20 22 L 40 45 L 60 55 L 80 80 L 100 90 L 100 100 L 0 100 Z"
                    fill="url(#chartGrad)"
                    className="transition-all duration-1000"
                  />
                  <path
                    d="M 0 20 Q 20 22 40 45 T 80 80 Q 90 85 100 90"
                    fill="none"
                    stroke="#4A7C59"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />

                  {/* Nodes */}
                  <circle cx="0" cy="20" r="2.5" fill="#E8943A" />
                  <circle cx="40" cy="45" r="2.5" fill="#E8943A" />
                  <circle cx="80" cy="80" r="2.5" fill="#E8943A" />
                  <circle cx="100" cy="90" r="2.5" fill="#E8943A" />
                </svg>

                {/* Y-Axis guide labels */}
                <div className="relative z-10 flex flex-col justify-between h-full text-[9px] font-mono text-gray-400 select-none items-end pr-1">
                  <span>82 kg (Initial)</span>
                  <span>78 kg (Week 2)</span>
                  <span>75 kg (Week 4)</span>
                  <span>74 kg (Final Goal)</span>
                </div>

                {/* X-Axis labels */}
                <div className="flex justify-between text-[9px] font-mono font-bold text-[#2F5233] mt-2 select-none border-t border-green-100/60 pt-2 relative z-10">
                  <span>Day 0 (Start)</span>
                  <span>Day 15</span>
                  <span>Day 30</span>
                  <span>Day 60 (Goal)</span>
                </div>
              </div>

              <p className="text-[10px] text-gray-500 leading-relaxed italic mt-4 text-center">
                ✔ Measured tracking across 1,200+ graduates holding the daily cortisol-detox breathing cycle.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. #the-program SECTION */}
      <section id="the-program" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">The 60-Day Natural Program</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#2F5233]">
            Five ancient practices. One structured system.
          </h2>
          <p className="text-sm leading-relaxed text-[#3A4A40]/80">
            True transformation happens when methods are synchronous. Our program binds five authentic Vedic practices into a single, daily curriculum that fits cleanly into any schedule.
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:pb-0">
          {[
            {
              title: "Yoga",
              desc: "Dynamic and restorative postures specifically targeted to trigger abdominal organs and jumpstart thyroid metabolic functions.",
              icon: "🧘"
            },
            {
              title: "Meditation + Pranayama",
              desc: "Sacred centering locks and breathing systems (such as Kapalbhati and Nadi Shodhana) to naturally ground biological cortisol levels.",
              icon: "💨"
            },
            {
              title: "Mudra Therapy",
              desc: "Hand finger gestural locks (like Surya Mudra and Apana Mudra) to balance fire, water, and earth elements inside your cellular fields.",
              icon: "🖐️"
            },
            {
              title: "Murm Dab Chikitsa",
              desc: "Focused physiological surface point activation to stimulate natural spleen, liver, and digestive meridian channels.",
              icon: "✨"
            },
            {
              title: "Personalized Prakriti Diet",
              desc: "A custom natural dietary guide structured completely around your ancestral body type (Dosha) — strictly 0 starvation.",
              icon: "🍲"
            },
            {
              title: "Daily Guidance",
              desc: "Immediate, dedicated community counseling and review checks with certified mentors to keep you fully on track.",
              icon: "👥"
            }
          ].map((item, idx) => (
            <div key={idx} className="snap-start shrink-0 w-[78%] sm:w-[46%] lg:w-auto bg-white rounded-3xl p-6 border border-[#E3F1E3] hover:shadow-xl hover:border-green-700 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-4xl block">{item.icon}</span>
                <h3 className="font-heading font-bold text-lg text-[#2F5233] leading-snug">{item.title}</h3>
                <p className="text-xs text-[#3A4A40]/85 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. HOLISTIC APPROACH SECTION */}
      <section className="bg-green-950 text-cream py-20 px-4 sm:px-6 lg:px-8 border-y-4 border-[#E8943A]">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Holistic Approach</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white">
            One complete system — body, mind and diet, together
          </h2>
          <p className="text-sm text-green-150 leading-relaxed max-w-2xl mx-auto mb-12">
            No element acts in isolation. By supporting your breathing patterns, physical muscle tone, and dosha nourishment together, weight loss occurs as a natural physiological consequence of health.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "Yoga & Flexibility",
                desc: "Fluid structural adjustments to reduce localized visceral fat, strengthen spinal columns, and increase cell oxygenation.",
                image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600"
              },
              {
                title: "Meditation & Pranayama",
                desc: "Daily morning respiratory guidelines to calm sympathetic brain activity and relieve stress-related cravings.",
                image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600"
              },
              {
                title: "Prakriti Diet",
                desc: "100% natural, whole ingredients chosen specifically to align Pitta, Kapha, or Vata digestive heat (Agni) safely.",
                image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600"
              }
            ].map((prod, idx) => (
              <div key={idx} className="bg-green-900 border border-green-800 rounded-3xl overflow-hidden shadow-md hover:border-green-600 transition-all">
                <div className="aspect-[4/3] relative">
                  <img
                    src={prod.image}
                    alt={`Visual representation of ${prod.title} for Ayurvedic weight loss program`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-green-950/20" />
                </div>
                <div className="p-6 space-y-2">
                  <h4 className="font-heading font-semibold text-lg text-white leading-tight">{prod.title}</h4>
                  <p className="text-xs text-green-100/80 leading-relaxed">{prod.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. #results SECTION */}
      <section id="results" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">The Progress Map</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#2F5233]">
            How the weight comes off — week by week
          </h2>
          <p className="text-sm leading-relaxed text-[#3A4A40]/80">
            A clear timeline of biological adjustments. True metabolic resets cannot happen overnight, but they are fully visible within 60 days.
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 [&::-webkit-scrollbar]:hidden text-left lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
          {[
            {
              week: "Week 1",
              title: "Detoxification & Start",
              desc: "Body begins shedding trapped storage fluids, water bloat drains, and mental alignment clarity activates."
            },
            {
              week: "Week 2",
              title: "Cravings Calm (-3 kg)",
              desc: "Digestive pathways cleanse, systemic sugar dependencies naturally fade, and deeper sleep sets in."
            },
            {
              week: "Week 4",
              title: "Metabolic Reset (-5 kg)",
              desc: "Deep fatty tissues dissolve, functional stamina spikes upwards, and localized cellular vitality returns."
            },
            {
              week: "Week 8",
              title: "Lasting Balance (-8 kg)",
              desc: "Sustained lifestyle integration completes, establishing full biological equilibrium from the root up."
            }
          ].map((progress, idx) => (
            <div key={idx} className="snap-start shrink-0 w-[78%] sm:w-[46%] lg:w-auto bg-white p-6 rounded-2xl border border-green-150 relative hover:border-[#4A7C59] transition-all shadow-xs">
              <span className="absolute top-4 right-4 text-xs font-bold text-[#E8943A] font-mono bg-amber-50 px-2 py-0.5 rounded-md">
                {progress.week}
              </span>
              <div className="space-y-4 mt-2">
                <h3 className="font-heading font-bold text-base text-[#2F5233] leading-snug">{progress.title}</h3>
                <p className="text-xs text-[#3A4A40]/80 leading-relaxed">{progress.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10c. PRICING / ENROLL SECTION */}
      <section id="enroll" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAFBF7] border-y border-green-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: rich content so the sticky price box stays beside it while scrolling */}
            <div className="lg:pt-4">
              <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Simple Pricing</span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#2F5233] mt-2 mb-3 leading-tight">
                Start your transformation today
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed mb-8">
                Reserve your seat with a small registration, or enroll in the full 60-Day Program —
                both backed by our results guarantee.
              </p>

              <h3 className="font-heading font-bold text-lg text-[#2F5233] mb-4">What's included</h3>
              <ul className="space-y-3.5 mb-9">
                {[
                  "Prakriti-personalized natural diet plan for your body type",
                  "Daily guided Yoga & Pranayama routines",
                  "Mudra therapy & Murm Dab Chikitsa (acupressure) guidance",
                  "1-on-1 practitioner support on WhatsApp",
                  "Weekly progress tracking with plan adjustments",
                  "Results guarantee — we continue free until you reach your goal",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <h3 className="font-heading font-bold text-lg text-[#2F5233] mb-4">Why members choose us</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3.5 lg:grid-cols-1 mb-9">
                {[
                  "Prakriti-personalized plan for your body type",
                  "Guided by experienced practitioners",
                  "100% natural — no crash diets or pills",
                  "1,200+ transformations over 7+ years",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-[#EFFFDF]/60 border border-green-100 rounded-2xl p-5">
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "If you don't notice a real transition in your first 14 days, the rest of your journey is on us — until you reach your goal."
                </p>
                <span className="block mt-2 text-xs font-bold text-[#2F5233]">— The Shivoham Shiv Promise</span>
              </div>
            </div>

            {/* Right: pricing box — sticks to the side while scrolling on desktop */}
            <div className="lg:sticky lg:top-24 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
              {(() => {
              const plan = PLAN_INFO[selectedPlan];
              return (
                <div className="relative bg-[#0F3320] text-cream rounded-3xl shadow-xl p-8 flex flex-col border border-green-800">
                  {plan.discount && (
                    <span className="absolute -top-3 right-6 bg-[#E8943A] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow">
                      {plan.discount}
                    </span>
                  )}

                  {/* Plan selector dropdown */}
                  <label htmlFor="plan-select" className="text-[10px] uppercase font-bold tracking-widest text-[#F3C969] mb-2 block">
                    Choose your plan
                  </label>
                  <div className="relative mb-7">
                    <select
                      id="plan-select"
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value as PaymentPlan)}
                      className="w-full appearance-none bg-white/10 border border-green-700 text-white font-semibold text-sm rounded-xl py-3.5 pl-4 pr-11 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F3C969]"
                    >
                      {(Object.keys(PLAN_INFO) as PaymentPlan[]).map((key) => (
                        <option key={key} value={key} className="text-slate-900">
                          {PLAN_INFO[key].dropdownLabel}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 text-[#F3C969] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#F3C969]">{plan.badge}</span>
                  <h3 className="font-heading font-bold text-xl text-white mt-2">{plan.title}</h3>

                  <div className="flex items-end gap-2 mt-4 mb-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.original && (
                      <span className="text-lg text-green-100/50 line-through mb-1.5">{plan.original}</span>
                    )}
                    <span className="text-xs text-green-100/70 mb-1.5">{plan.unit}</span>
                  </div>

                  <p className="text-xs text-green-100/80 leading-relaxed mb-6 mt-2">{plan.desc}</p>

                  <ul className="space-y-2.5 mb-7">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-50">
                        <Check className="w-4 h-4 text-[#F3C969] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePay(selectedPlan)}
                    disabled={payingPlan !== null}
                    className="w-full py-3.5 bg-[#E8943A] hover:bg-[#EFAF3C] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all border-b-2 border-amber-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {payingPlan === selectedPlan ? "Processing…" : plan.cta}
                  </button>
                </div>
                );
              })()}
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-500 mt-8 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            Secure payment via Razorpay — UPI, cards, net-banking &amp; wallets accepted.
          </p>
        </div>
      </section>

      {/* 8. REAL NUMBERS · REAL CLIENTS */}
      <section className="bg-[#F2F9F2] py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E3F1E3]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-4 text-left space-y-6">
            <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Real Numbers · Real Clients</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#2F5233]">
              Clients who had tried for 10 years — saw results in 60 days
            </h2>
            <p className="text-sm text-[#3A4A40]/85 leading-relaxed">
              Vedic therapy focuses on permanent results. By addressing psychological stressors and elemental physical blocks, our graduates hold onto their wellness profiles sustainably.
            </p>

            <div className="pt-4 border-t border-green-200 grid grid-cols-2 gap-4 text-left">
              <div>
                <span className="block text-2xl font-bold text-[#4A7C59]">1,200+</span>
                <span className="text-[10px] uppercase text-gray-500 font-semibold tracking-wide">Transformations Guided</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-[#4A7C59]">6–9 kg</span>
                <span className="text-[10px] uppercase text-gray-500 font-semibold tracking-wide">Average Loss</span>
              </div>
              <div className="pt-2">
                <span className="block text-2xl font-bold text-[#4A7C59]">92%</span>
                <span className="text-[10px] uppercase text-gray-500 font-semibold tracking-wide">Fewer Cravings (Wk 3)</span>
              </div>
              <div className="pt-2">
                <span className="block text-2xl font-bold text-[#4A7C59]">0</span>
                <span className="text-[10px] uppercase text-gray-500 font-semibold tracking-wide">Pills / Supplements</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                loss: "8 kg in 60 days",
                client: "Ritu S.",
                loc: "Jaipur",
                text: "I tried calorie counting workouts for years and only got fatigued. Changing my breathing and food to match Pitta digestion completely melted my bloating within several weeks!"
              },
              {
                loss: "Lost 9 kg",
                client: "Anil K.",
                loc: "Delhi",
                text: "The combination of Surya Mudra with yogic posture flow was magical. I never felt starved, yet my stress cravings vanished before the end of class modules."
              },
              {
                loss: "7 kg, and it stayed",
                client: "Pooja M.",
                loc: "Jhansi",
                text: "My thyroid counts had slowed down, but Ayurvedic healing reset my inner systems naturally. This isn't just weight-loss — it gave me a complete spiritual recharge."
              }
            ].map((testim, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-green-150/60 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="inline-block px-2.5 py-1 text-[11px] font-bold bg-[#E3F1E3] text-green-800 rounded-md">
                    {testim.loss}
                  </span>
                  <p className="text-xs text-[#3A4A40]/80 italic mt-2 leading-relaxed">
                    "{testim.text}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#2F5233]">
                  <span>{testim.client}</span>
                  <span className="text-[#E8943A] font-normal text-[10px]">{testim.loc}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. #is-it-for-you SECTION */}
      <section id="is-it-for-you" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Candidate Alignment</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#2F5233]">
            Is this program right for you?
          </h2>
          <p className="text-sm text-slate-705 leading-relaxed">
            Please review our candid entry filters. We protect the integrity of our groups and only accept seekers who respect timeless natural processes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto text-left">
          
          {/* Column IS for you */}
          <div className="bg-white p-8 rounded-3xl border border-green-100 shadow-xs space-y-6">
            <h3 className="font-heading font-extrabold text-xl text-[#2F5233] border-b border-green-100 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              This IS for you, if —
            </h3>
            <ul className="space-y-4 text-xs tracking-wide">
              <li className="flex items-start gap-2 text-slate-755 leading-relaxed">
                <Check className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                <span>You want to deeply understand your specific biological body constitution, rather than chase artificial scale numbers.</span>
              </li>
              <li className="flex items-start gap-2 text-slate-755 leading-relaxed">
                <Check className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                <span>You want lasting weight balance over years, rather than a crash diet that bounces back.</span>
              </li>
              <li className="flex items-start gap-2 text-slate-755 leading-relaxed">
                <Check className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                <span>You want to experience deep results from within, restoring intestinal ease, and clearing severe brain fog.</span>
              </li>
              <li className="flex items-start gap-2 text-slate-755 leading-relaxed">
                <Check className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                <span>You are fully willing to commit steady effort to daily practice and custom meal maps for 60 consecutive days.</span>
              </li>
            </ul>
          </div>

          {/* Column ISN'T for you */}
          <div className="bg-white p-8 rounded-3xl border border-red-100/60 shadow-xs space-y-6">
            <h3 className="font-heading font-extrabold text-xl text-red-900 border-b border-red-50 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8943A]"></span>
              This ISN'T for you, if —
            </h3>
            <ul className="space-y-4 text-xs tracking-wide">
              <li className="flex items-start gap-2 text-slate-755 leading-relaxed">
                <span className="text-[#E8943A] font-bold shrink-0">✕</span>
                <span>You are chasing a magic chemical pill, synthetic powder, or instant 7-day starvation breakthrough.</span>
              </li>
              <li className="flex items-start gap-2 text-slate-755 leading-relaxed">
                <span className="text-[#E8943A] font-bold shrink-0">✕</span>
                <span>You suffer from severe physiological clinical illness where active lifestyle adjustments must be managed on-site by medical clinicians.</span>
              </li>
              <li className="flex items-start gap-2 text-slate-755 leading-relaxed">
                <span className="text-[#E8943A] font-bold shrink-0">✕</span>
                <span>You expect deep results to manifest without engaging in basic breathing sadhana or whole ingredients.</span>
              </li>
              <li className="flex items-start gap-2 text-slate-755 leading-relaxed">
                <span className="text-[#E8943A] font-bold shrink-0">✕</span>
                <span>You place permanent trust in superficial fitness shortcuts over verified, structured Vedic healing laws.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 10. STRAIGHT ANSWERS - FAQ ACCORDION */}
      <section className="bg-[#FAFBF7] py-20 px-4 sm:px-6 lg:px-8 border-t border-green-100 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Straight answers</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#2F5233]">Frequently Asked Queries</h2>
        </div>

        <div className="space-y-4 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = faqOpen === idx;
            return (
              <div key={idx} className="bg-white border border-green-100 rounded-2xl overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setFaqOpen(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <span className="font-heading font-semibold text-[#2F5233] text-sm sm:text-base leading-relaxed">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-green-700 shrink-0 transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`} />
                </button>
                
                {isOpen && (
                  <div className="p-6 pt-0 border-t border-green-50 text-slate-700 text-xs sm:text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10b. RESULTS GUARANTEE / OFFER BAND */}
      <section id="guarantee" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F3320] text-cream">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1F4D45] rounded-full text-xs font-bold uppercase tracking-widest border border-green-800 text-[#F3C969]">
            <ShieldCheck className="w-4 h-4" />
            Our Results Guarantee
          </span>

          <h2 className="font-heading font-bold text-3xl sm:text-4xl mt-5 mb-5 leading-tight text-white">
            Results — or the rest of the journey is <span className="text-[#F3C969]">on us.</span>
          </h2>

          <p className="text-sm sm:text-lg leading-relaxed text-green-50/90 max-w-2xl mx-auto">
            If you don't notice a real transition in your <strong className="text-white">first 14 days</strong>,
            the rest of your journey is on us. We're so confident that even if there are
            <strong className="text-white"> no tangible results after 1.5 months</strong>, we keep going
            entirely at our cost — <strong className="text-[#F3C969]">until you reach your goal.</strong>
          </p>

          {/* Guarantee pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 text-left">
            {[
              { t: "14-Day Promise", d: "No real transition in the first 14 days? The rest is on us." },
              { t: "Beyond 1.5 Months", d: "No tangible results? We continue free of cost." },
              { t: "Until the Goal", d: "We don't stop until your target is achieved." },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#1F4D45]/60 border border-green-800/60 rounded-2xl p-5">
                <ShieldCheck className="w-5 h-5 text-[#F3C969] mb-2" />
                <h3 className="font-bold text-sm text-white mb-1">{item.t}</h3>
                <p className="text-xs text-green-100/80 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-10">
            <button
              onClick={scrollToEnroll}
              className="px-8 py-4 bg-[#E8943A] hover:bg-[#EFAF3C] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 border-b-2 border-amber-600"
            >
              <Clock3 className="w-4 h-4" />
              Get Started in 24 Hrs
            </button>
          </div>
        </div>
      </section>

      {/* 11. CTA BAND (Heal your body from within) */}
      <section className="bg-[#EFFFDF]/70 py-16 px-4 sm:px-6 lg:px-8 border-y border-green-100">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A] block">Free Space Evaluation</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#2F5233] leading-tight">
            Heal your body from within — naturally and sustainably.
          </h2>
          <p className="text-sm sm:text-base text-slate-705 leading-relaxed max-w-2xl mx-auto">
            Book your FREE consultation — tell us your situation and our team will map the right path. No pressure, just absolute clarity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <button
              onClick={handleHeroScroll}
              className="px-8 py-3.5 bg-[#4A7C59] hover:bg-[#2F5233] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all border border-green-600"
            >
              Book Your FREE Consultation
            </button>
            <a
              href="https://wa.me/919682051868"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-white hover:bg-neutral-50 text-[#3A4A40] border border-green-200 font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-green-600 shrink-0 fill-green-600" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          <span className="block text-[10px] text-[#4A7C59] font-bold uppercase tracking-wider">
            🚨 Spots limited to 15 slots this week. Register to reserve space.
          </span>
        </div>
      </section>

      {/* 12. #contact-us SECTION */}
      <section id="contact-us" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Booking inputs form left */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-green-105 shadow-sm text-left">
            
            <div className="mb-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8943A]">Vedic Registry</span>
              <h3 className="font-heading font-bold text-2xl text-[#2F5233]">Book your FREE consultation</h3>
              <p className="text-xs text-slate-500 mt-1">Submit your profile to map natural solutions with a counselor.</p>
            </div>

            {isSuccess ? (
              <div className="p-8 bg-[#E3F1E3] border border-green-200 text-[#2F5233] rounded-2xl text-center space-y-3">
                <Check className="w-10 h-10 text-green-700 bg-white rounded-full p-2 mx-auto shadow-sm" />
                <h4 className="font-bold text-base">Inquiry secured!</h4>
                <p className="text-xs leading-relaxed max-w-md mx-auto">
                  Pranama! We have logged your weight-loss diagnostic request. We are now redirecting you to converse with our lead counselor directly on WhatsApp (+91 9682051868) for your timeslot confirmation.
                </p>
                <a
                  href="https://wa.me/919682051868"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-6 py-2.5 bg-[#4A7C59] hover:bg-[#2F5233] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-green-600"
                >
                  Converse on WhatsApp Now
                </a>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-medium">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="full-name">
                      Full Name
                    </label>
                    <input
                      id="full-name"
                      type="text"
                      placeholder="e.g. Aditi Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="email">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="aditi@sharma.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="phone">
                    Contact / WhatsApp Mobile No. *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="e.g. +91 94523 42921"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="message">
                    Tell us your situation (Starvation trials, thyroid, blockages...)
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="e.g. I have tried multiple keto diets and lost weight temporarily, but it keeps returning when I eat normal home carbohydrates."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none text-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#4A7C59] hover:bg-[#2F5233] text-cream rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer text-center"
                >
                  {isSubmitting ? "Locking Profile..." : "Submit &amp; Chat on WhatsApp"}
                </button>
              </form>
            )}

          </div>

          {/* Contact Details Column Right */}
          <div className="lg:col-span-5 bg-[#F2F9F2] p-8 sm:p-10 rounded-3xl border border-[#E3F1E3] space-y-6 text-left">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8943A]">Main Headquarters</span>
              <h4 className="font-heading font-bold text-lg text-[#2F5233] mt-1">Shivoham Shiv Center</h4>
              <p className="text-xs text-[#3A4A40]/80 mt-2 leading-relaxed">
                We provide full clinical review checks in-person and digital counseling slots. Our main office traces directly into the heart of India:
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-green-200 text-xs">
              <div className="flex gap-3">
                <span className="text-lg shrink-0">📍</span>
                <div>
                  <span className="block font-bold uppercase text-slate-600 text-[10px]">Physical Address</span>
                  <p className="text-slate-800 leading-relaxed font-serif">
                    Arya Kanya Chowraha, Sipri Bazar, Jhansi, UP 284003, India
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-lg shrink-0">📞</span>
                <div>
                  <span className="block font-bold uppercase text-slate-600 text-[10px]">Mobile Contact</span>
                  <p className="text-slate-800 font-mono text-xs font-bold">
                    +91 9682051868
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-lg shrink-0">✉</span>
                <div>
                  <span className="block font-bold uppercase text-slate-600 text-[10px]">Lineage Support Email</span>
                  <p className="text-slate-800 font-mono text-xs">
                    healing@shivohamshiv.org
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-green-100 shadow-3xs flex items-center gap-3">
              <span className="text-2xl">🕉️</span>
              <div>
                <p className="text-[11px] text-[#2F5233] font-bold">The Shivoham Oath</p>
                <p className="text-[10px] text-gray-500 font-serif italic">"No commercial supplement traps. Only timeless Vedic wisdom."</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER VARIANT */}
      <footer className="bg-[#2F5233] text-cream/70 py-12 px-4 sm:px-6 lg:px-8 border-t-2 border-[#E8943A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 uppercase tracking-widest text-[10px] text-[#E3F1E3]/70 font-bold">
          <span>© Shivoham Shiv Academy 2026</span>
          <span className="text-center md:text-right font-serif text-xs capitalize italic tracking-normal text-amber-100">
            "Explore The Timeless Knowledge Of Vedas — The Right Path. The Right Result."
          </span>
          <div className="flex gap-6">
            <span>Natural Ways</span>
            <span>0 Supplements</span>
            <span>Vedic Roots</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
