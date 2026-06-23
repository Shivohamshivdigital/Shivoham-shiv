import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Award, 
  ChevronRight, 
  ChevronLeft,
  PhoneCall, 
  ShieldCheck, 
  Mail, 
  User, 
  MessageSquare,
  Lock,
  ChevronDown,
  Info,
  Layers,
  GraduationCap,
  ArrowRight,
  Leaf,
  Brain,
  Sun,
  Heart
} from "lucide-react";
import SEO from "../components/SEO";
import { bookConsultation } from "../services/consultationService";
import { Course } from "../types";
import { getCourses } from "../services/courseService";

const carouselSlides = [
  {
    title: "Reduces stress, anxiety, and mental fatigue",
    description: "Mudras help calm the mind by easing nervous tension and releasing emotional stress. Consistent practice promotes relaxation, reduces mental overload, and supports a sense of inner peace."
  },
  {
    title: "Enhances concentration and mental clarity",
    description: "By channeling vital energy to the brain's cognitive centers, Mudras facilitate sharper memory focus, clear decision making, and academic or professional performance."
  },
  {
    title: "Balances internal organ functions naturally",
    description: "Specific hand locks stimulate nerve endings connected to digestive, respiratory, and cardiovascular pathways, encouraging the body's natural healing abilities."
  }
];


export default function CourseDetailView() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Contact Form State
  const [fullName, setFullName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentKidsSlide, setCurrentKidsSlide] = useState(0);

  // Normalize slug to query our coursesData
  let courseId = "corp-wellness";
  if (slug === "mudra-therapy" || slug === "mudra-therapy-course") {
    courseId = "mudra-therapy";
  } else if (slug === "acupressure-therapy") {
    courseId = "acupressure-therapy";
  } else if (slug === "mindfulness-kids" || slug === "kids-eq") {
    courseId = "kids-eq";
  } else if (slug === "corporate-wellness") {
    courseId = "corp-wellness";
  }

  useEffect(() => {
    const validSlugs = ["corporate-wellness", "corp-wellness", "mudra-therapy", "mudra-therapy-course", "acupressure-therapy", "mindfulness-kids", "kids-eq"];
    if (slug && !validSlugs.includes(slug)) {
      navigate("/courses", { replace: true });
    }
  }, [slug, navigate]);

  // Smooth scroll helper
  const handleScrollToSegment = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 85; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isFirstLastName = courseId === "mudra-therapy" || courseId === "kids-eq";
    const resolvedFullName = isFirstLastName ? `${firstName} ${lastName}`.trim() : fullName;
    const requiredFieldsFilled = isFirstLastName 
      ? (firstName && lastName && email && whatsapp) 
      : (fullName && email && whatsapp);

    if (!requiredFieldsFilled) {
      setFormError("Please fill out all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    setFormError("");

    try {
      await bookConsultation(
        resolvedFullName,
        email,
        whatsapp,
        `[COURSE PAGE INQUIRY - ${courseId}] : ${note}`
      );
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // WhatsApp redirection
      const customMsg = encodeURIComponent(
        `Pranama, Shivoham Shiv! I have registered and booked an evaluation for the course: ${courseId === "corp-wellness" ? "Corporate & Adult Wellness" : courseId}. (Name: ${resolvedFullName}, Phone: ${whatsapp})`
      );
      setTimeout(() => {
        window.open(`https://wa.me/917317778215?text=${customMsg}`, "_blank");
      }, 1500);

    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setFormError("There was a problem submitting your request. Please try again.");
    }
  };

  // Switch templates on current slug
  if (courseId === "mudra-therapy") {
    return (
      <div className="bg-[#FAFBF7] min-h-screen font-sans selection:bg-green-105 selection:text-green-905 text-[#3A463F] text-left">
        <SEO 
          title="Mudra Therapy Course | Discover Ancient Hand Gestures — Shivoham Shiv"
          description="At Shivoham Shiv, discover the science of ancient hand gestures (Mudras) that help restore balance, reduce stress, and support holistic well-being."
          focusKeyword="mudra therapy course online"
          isCourseDetail={true}
          courseData={{
            name: "Mudra Therapy Course",
            description: "At Shivoham Shiv, discover the science of ancient hand gestures (Mudras) that help restore balance, reduce stress, and support holistic well-being.",
            lessonsCount: 15
          }}
          isBreadcrumb={true}
          breadcrumbItems={[
            { name: "Home", url: "/" },
            { name: "Courses", url: "/courses" },
            { name: "Mudra Therapy", url: "/courses/mudra-therapy" }
          ]}
        />

        {/* 1. HERO */}
        <section className="bg-teal-950 text-cream py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-[#C96E29] relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1600"
              alt="Person practicing gyan mudra"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-35 filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-905/85 to-[#0F3320]/60" />
          </div>
          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F4D45] rounded-full text-[#FAFBF7] text-xs font-bold uppercase tracking-widest border border-green-800">
              <Sparkles className="w-3 text-[#C9A24B] fill-[#C9A24B]" />
              Online Mudra Pathways
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white tracking-tight leading-tight">
              Mudra Therapy Course
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed font-light">
              At Shivoham Shiv, discover the science of ancient hand gestures (Mudras) that help restore balance, reduce stress, and support holistic well-being. Learn simple, natural practices designed for modern life and lasting inner harmony.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => handleScrollToSegment("mudra-contact-form")}
                className="px-8 py-4 bg-[#C96E29] hover:bg-[#B85F22] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              >
                Book a Session
              </button>
            </div>
          </div>
          {/* Subtle geometric background filters */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-850/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* 2. SECTION "What is Mudra Therapy?" (image left, text right) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image left */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-square rounded-full overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
                  alt="Mudra therapy instruction and serene balance"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#FAF5EC] border border-[#2F5D50]/20 rounded-2xl flex flex-col items-center justify-center p-3 text-center shadow-lg">
                <span className="block font-heading text-[#C96E29] font-bold text-xl leading-none">100%</span>
                <span className="text-[9px] uppercase tracking-wider text-green-905 font-bold mt-1">ONLINE</span>
              </div>
            </div>

            {/* Text right */}
            <div className="lg:col-span-7 text-left space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Core Definition</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45] leading-tight">
                What is Mudra Therapy?
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-[#3A463F]/90">
                <p>
                  Mudra Therapy is an ancient Vedic healing practice that uses specific hand gestures, known as Mudras, to activate and balance the body's natural energy channels. These hand positions help guide the flow of energy, supporting physical health, mental clarity, and emotional stability.
                </p>
                <p>
                  Each Mudra works by connecting different elements of the body, allowing energy to move more freely and restoring harmony within the system. When practiced regularly, Mudra Therapy supports the body's natural ability to heal itself and maintain balance.
                </p>
              </div>

              <div className="space-y-3">
                <p className="font-bold text-[#1F4D45] text-sm">
                  Mudra Therapy helps by:
                </p>
                <ul className="space-y-2.5 text-xs text-[#3A463F]/90 md:pl-2">
                  {[
                    "Activating specific energy pathways within the body",
                    "Supporting physical, mental, and emotional balance",
                    "Calming the nervous system and reducing stress",
                    "Improving focus, awareness, and inner clarity",
                    "Encouraging natural healing without external tools"
                  ].map((bullet, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-655 mt-1.5 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-sm leading-relaxed text-[#3A463F]/90 pt-2">
                Mudra Therapy is gentle, non-invasive, and safe for all age groups. It requires no special equipment and can be practiced anywhere—at home, at work, or during meditation. Simple to learn and easy to integrate into daily life, Mudra Therapy offers a practical and natural approach to long-term well-being and inner harmony.
              </p>
            </div>

          </div>
        </section>

        {/* 3. SECTION "Special Offer: Enroll in Mudra Therapy and Get Exclusive Benefits" */}
        <section className="bg-[#FAF5EC] py-20 px-4 sm:px-6 lg:px-8 border-y border-green-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-3 mb-16">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Stellar Value Additions</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45]">
                Special Offer: Enroll in Mudra Therapy and Get Exclusive Benefits
              </h2>
              <p className="text-[#3A463F]/90 max-w-2xl mx-auto leading-relaxed text-sm">
                When you enroll in the <strong className="font-bold text-green-905">Mudra Therapy Course</strong>, you unlock the following exclusive benefits:
              </p>
            </div>

            {/* Timelines of special offer */}
            <div className="relative">
              {/* Center vertical Line (desktop) */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-sky-200 -translate-x-1/2 hidden md:block" />

              <div className="space-y-12 md:space-y-0 relative">
                
                {/* 1) 1-Month Free Meditation Subscription */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8">
                  {/* Card Left */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-green-50 relative hover:-translate-y-0.5 transition-all">
                    <div className="flex flex-col space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-700">
                        <Leaf className="w-6 h-6" />
                      </div>
                      <h3 className="font-heading font-bold text-lg text-[#1F4D45] leading-snug">
                        1-Month Free Meditation Subscription
                      </h3>
                      <p className="text-xs text-[#3A463F]/85 leading-relaxed">
                        Experience the calming effects of our Meditation Course with <strong>1 month of free access</strong>. This complimentary month allows you to explore meditation techniques designed to bring peace and clarity into your life.
                      </p>
                    </div>
                  </div>

                  {/* Node point */}
                  <div className="flex justify-center z-15 relative">
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-sky-400 flex items-center justify-center shadow-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    </div>
                  </div>

                  {/* Empty space */}
                  <div className="hidden md:block" />
                </div>

                {/* 2) 6 Free Psychiatrist Meetings */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8 md:-mt-8">
                  {/* Empty left */}
                  <div className="hidden md:block" />

                  {/* Node point */}
                  <div className="flex justify-center z-15 relative">
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-green-500 flex items-center justify-center shadow-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                  </div>

                  {/* Card Right */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-green-50 relative hover:-translate-y-0.5 transition-all">
                    <div className="flex flex-col space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-700">
                        <Brain className="w-6 h-6" />
                      </div>
                      <h3 className="font-heading font-bold text-lg text-[#1F4D45] leading-snug">
                        6 Free Psychiatrist Meetings
                      </h3>
                      <p className="text-xs text-[#3A463F]/85 leading-relaxed">
                        As a special reward for enrolling in the Mudra Therapy Course, you'll receive <strong>6 free online psychiatrist meetings</strong>—one session each month for six months. These sessions are designed to support your mental health, help you manage stress, and enhance your emotional well-being.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3) Vedic Math Course Complimentary */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8 md:-mt-8">
                  {/* Card Left */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-green-50 relative hover:-translate-y-0.5 transition-all">
                    <div className="flex flex-col space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-700">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <h3 className="font-heading font-bold text-lg text-[#1F4D45] leading-snug">
                        Vedic Math Course Complimentary
                      </h3>
                      <p className="text-xs text-[#3A463F]/85 leading-relaxed">
                        Receive free access to the Vedic Math Course and learn ancient techniques to sharpen your mind and improve mental agility.
                      </p>
                    </div>
                  </div>

                  {/* Node point */}
                  <div className="flex justify-center z-15 relative">
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-sky-400 flex items-center justify-center shadow-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    </div>
                  </div>

                  {/* Empty space */}
                  <div className="hidden md:block" />
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* 4. SECTION "Why Practice Mudra Therapy?" */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45]">
              Why Practice Mudra Therapy?
            </h2>
            <p className="text-sm font-bold text-[#1F4D45] block font-heading uppercase tracking-wide">
              Key Benefits of Mudra Therapy:
            </p>
          </div>

          {/* Interactive Carousel */}
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
                setCurrentSlide((prev) => (prev < carouselSlides.length - 1 ? prev + 1 : 0));
              } else if (diff < -50) {
                setCurrentSlide((prev) => (prev > 0 ? prev - 1 : carouselSlides.length - 1));
              }
            }}
            className="max-w-5xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl h-[450px] flex items-center justify-center"
          >
            {/* Background Image of slide */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1600" 
                alt="Breathing relaxation and stress release outdoors" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-75"
              />
              <div className="absolute inset-0 bg-black/35" />
            </div>

            {/* Left controller */}
            <button 
              onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : carouselSlides.length - 1))}
              className="absolute left-4 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all z-10 cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Sliding White Overlap Card info */}
            <div className="bg-white/95 backdrop-blur-xs p-8 sm:p-10 rounded-2xl max-w-2xl mx-12 shadow-xl z-10 text-center space-y-4">
              <h3 className="font-heading font-bold text-[#1F4D45] text-xl sm:text-2xl leading-snug">
                {carouselSlides[currentSlide].title}
              </h3>
              <p className="text-xs sm:text-sm text-[#3A463F]/90 leading-relaxed max-w-lg mx-auto">
                {carouselSlides[currentSlide].description}
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => handleScrollToSegment("mudra-contact-form")}
                  className="px-6 py-2.5 bg-[#1F4D45] hover:bg-green-905 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                >
                  Explore More
                </button>
              </div>
            </div>

            {/* Right controller */}
            <button 
              onClick={() => setCurrentSlide((prev) => (prev < carouselSlides.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all z-10 cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </section>

        {/* 5. SECTION "Why Choose Shivoham Shiv for Mudra Therapy?" (image left, text right) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Elegant Custom meditating SVG illustration left */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-sm w-full aspect-square bg-[#FAFBF7] rounded-[48px] border border-teal-100 shadow-xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#1F4D45_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                
                <svg className="w-4/5 h-4/5 relative z-10 filter drop-shadow-md" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="200" cy="230" r="100" stroke="#1F4D45" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                  <circle cx="200" cy="230" r="140" fill="#EADCC9" fillOpacity="0.15" />
                  
                  {/* Outer body contour */}
                  <path d="M120 330 C120 330, 200 350, 280 330 C290 320, 310 260, 270 230 C250 215, 250 180, 240 140 C235 120, 165 120, 160 140 C150 180, 150 215, 130 230 C90 260, 110 320, 120 330 Z" fill="#EADCC9" />
                  
                  {/* Sports top green */}
                  <path d="M165 140 C165 140, 200 155, 235 140 C238 160, 243 190, 230 220 C215 225, 185 225, 170 220 C157 190, 162 160, 165 140 Z" fill="#1F4D45" />
                  
                  {/* Straps */}
                  <path d="M170 140 L178 120 L188 120 L180 140 Z" fill="#1F4D45" />
                  <path d="M230 140 L222 120 L212 120 L220 140 Z" fill="#1F4D45" />

                  {/* Pants green */}
                  <path d="M136 290 C155 315, 245 315, 264 290 C280 300, 290 320, 280 330 C230 345, 170 345, 120 330 C110 320, 120 300, 136 290 Z" fill="#1F4D45" />
                  
                  {/* Left arm */}
                  <path d="M160 155 C140 170, 90 220, 80 260 C75 280, 95 285, 105 270 C115 255, 140 210, 160 185" fill="none" stroke="#EADCC9" strokeWidth="14" strokeLinecap="round" />
                  {/* Right arm */}
                  <path d="M240 155 C260 170, 310 220, 320 260 C325 280, 305 285, 295 270 C285 255, 260 210, 240 185" fill="none" stroke="#EADCC9" strokeWidth="14" strokeLinecap="round" />

                  {/* Hands Mudra detail */}
                  <path d="M78 260 C70 260, 65 268, 70 273 C75 278, 85 270, 85 264" fill="#EADCC9" />
                  <circle cx="74" cy="264" r="3.5" fill="#C96E29" /> 
                  
                  <path d="M322 260 C330 260, 335 268, 330 273 C325 278, 315 270, 315 264" fill="#EADCC9" />
                  <circle cx="326" cy="264" r="3.5" fill="#C96E29" /> 

                  {/* Head */}
                  <circle cx="200" cy="95" r="24" fill="#EADCC9" />
                  <path d="M176 95 C176 70, 224 70, 224 95 C215 105, 185 105, 176 95 Z" fill="#1A1817" />
                  <circle cx="200" cy="65" r="12" fill="#1A1817" /> 
                  
                  {/* Expression */}
                  <path d="M188 95 Q192 99 196 95" stroke="#1A1817" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  <path d="M204 95 Q208 99 212 95" stroke="#1A1817" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            </div>

            {/* Text right */}
            <div className="lg:col-span-7 text-left space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Vedic Credentials</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45] leading-tight">
                Why Choose Shivoham Shiv for Mudra Therapy?
              </h2>
              <div className="space-y-4 text-sm text-[#3A463F]/90 leading-relaxed text-left">
                <p>
                  At Shivoham Shiv, we believe true transformation through Mudra Therapy comes from authentic Vedic knowledge practiced with consistency and awareness. Our Mudra Therapy Course is rooted in ancient wisdom and thoughtfully adapted to suit modern lifestyles.
                </p>
                <p>
                  We focus on simplicity, clarity, and correct practice—so you don't just learn Mudras, you develop a sustainable daily routine that supports mental clarity, emotional balance, and overall harmony.
                </p>
              </div>

              <div className="space-y-3">
                <p className="font-bold text-[#1F4D45] text-sm">
                  What sets our Mudra Therapy approach apart:
                </p>
                <ul className="space-y-3.5 text-xs text-[#3A463F]/90 text-left">
                  {[
                    { title: "Authentic Vedic Mudra Teachings", desc: "Our course follows traditional Mudra knowledge, ensuring each practice remains true to its original healing purpose and intent." },
                    { title: "Simple and Practical Learning", desc: "Mudras are taught in an easy, step-by-step format, making them effortless to practice and integrate into everyday life." },
                    { title: "Beginner-Friendly Guidance", desc: "Clear demonstrations and instructions help beginners practice Mudras correctly, safely, and with confidence from the start." },
                    { title: "Holistic Mind–Body–Energy Focus", desc: "Each Mudra supports balance across mental, physical, and energetic levels, promoting overall well-being." },
                    { title: "Calm, Supportive, and Purpose-Driven Instruction", desc: "Our teaching approach encourages mindful practice, consistency, and inner awareness for long-term benefits." }
                  ].map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-550 mt-1.5 shrink-0" />
                      <div>
                        <strong>{bullet.title}</strong> – {bullet.desc}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => handleScrollToSegment("mudra-contact-form")}
                  className="px-8 py-4 bg-[#1F4D45] hover:bg-green-905 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Enroll Now
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* 6. SECTION "Benefits of Our Mudra Therapy Services" */}
        <section className="bg-slate-50 border-y border-green-100 py-16 px-4 sm:px-6 lg:px-8 text-left">
          <div className="max-w-7xl mx-auto text-center">
            
            <div className="space-y-3 mb-16">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Comprehensive Integration</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45]">
                Benefits of Our Mudra Therapy Services
              </h2>
              <p className="text-xs sm:text-sm text-[#3A463F]/85 italic leading-relaxed">
                Align your mind, body, and energy through authentic Mudra therapy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Sun className="w-6 h-6 text-green-700" />,
                  title: "Authentic Vedic Healing Approach",
                  desc: "Our services are rooted in traditional Mudra knowledge, ensuring natural, time-tested practices that support holistic healing and inner balance."
                },
                {
                  icon: <CheckCircle2 className="w-6 h-6 text-green-700" />,
                  title: "Simple, Practical, and Effective",
                  desc: "We focus on easy-to-follow Mudra techniques that can be practiced daily, making wellness accessible even with a busy lifestyle."
                },
                {
                  icon: <Sparkles className="w-6 h-6 text-green-700" />,
                  title: "Supports Mind, Body, and Energy Balance",
                  desc: "Our Mudra Therapy services help improve mental clarity, emotional balance, and physical well-being by aligning the body's natural energy flow."
                },
                {
                  icon: <Heart className="w-6 h-6 text-green-700" />,
                  title: "Safe, Gentle, and Beginner-Friendly",
                  desc: "Our approach is non-invasive, suitable for all age groups, and guided carefully to ensure correct and confident practice."
                }
              ].map((card, idx) => (
                <div key={idx} className="bg-white border border-green-50 p-6 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-center space-y-4 text-left">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                    {card.icon}
                  </div>
                  <h3 className="font-heading font-bold text-center text-[#1F4D45] text-sm uppercase tracking-wide leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs text-center text-[#3A463F]/85 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 7. CONTACT Form + Jhansi Map */}
        <section id="mudra-contact-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-white text-left">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
              
              {/* Form Column */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-green-150 shadow-xl">
                <div className="space-y-2 mb-8">
                  <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#C96E29]">Vedic Diagnostic Gate</span>
                  <h3 className="font-heading font-bold text-2xl text-[#1F4D45]">
                    Get in Touch
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ready to begin Mudra Therapy or have any questions? Submit your details below to schedule an online evaluation.
                  </p>
                </div>

                {isSuccess ? (
                  <div className="p-8 bg-[#E3F1E3] border border-green-200 text-[#1F4D45] rounded-2xl text-center space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-green-700 mx-auto animate-bounce" />
                    <h4 className="font-bold text-base">Pranama, evaluation information recorded!</h4>
                    <p className="text-xs leading-relaxed max-w-md mx-auto text-slate-705">
                      Your details have been locked into the local dashboard. Conversing direct on WhatsApp with Pooja's certified team is now opening in a new tab!
                    </p>
                    <a 
                      href="https://wa.me/917317778215" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-7 py-3 bg-[#1F4D45] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-101 shrink-0"
                    >
                      Converse on WhatsApp
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-medium text-slate-705">
                    {formError && (
                      <div className="p-3 bg-red-50 text-red-900 border border-red-100 rounded-lg text-left font-bold text-[11px]">
                        ⚠ {formError}
                      </div>
                    )}

                    {/* Name * splits into First & Last */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">
                        Name *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <input 
                            type="text"
                            required
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">First</span>
                        </div>
                        <div>
                          <input 
                            type="text"
                            required
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">Last</span>
                        </div>
                      </div>
                    </div>

                    {/* Email * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="mudra-email">
                        Email *
                      </label>
                      <input 
                        id="mudra-email"
                        type="email"
                        required
                        placeholder="aditi@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                      />
                    </div>

                    {/* Contact No. * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="mudra-tel">
                        Contact No. *
                      </label>
                      <input 
                        id="mudra-tel"
                        type="tel"
                        required
                        placeholder="e.g. +91 94523 42921"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                      />
                    </div>

                    {/* Comment or Message */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="mudra-message">
                        Comment or Message
                      </label>
                      <textarea 
                        id="mudra-message"
                        rows={4}
                        placeholder="State your health conditions, wellness symptoms, or goals..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none text-[#3A463F]"
                      />
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3.5 bg-[#1F4D45] hover:bg-green-905 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Map Column */}
              <div className="lg:col-span-5 flex flex-col h-full justify-between text-left">
                <div className="bg-[#FAF5EC]/50 border border-green-100 rounded-3xl p-6 shadow-sm space-y-4 flex-grow flex flex-col">
                  <div className="space-y-1 text-left">
                    <h4 className="font-heading font-extrabold text-[#1F4D45] text-base">
                      Office Location Base
                    </h4>
                    <p className="text-xs text-[#3A463F]/90 leading-relaxed">
                      Arya Kanya Chowraha, Sipri Bazar, Jhansi, Uttar Pradesh 284003, India
                    </p>
                  </div>

                  {/* Google Map of Jhansi, Uttar Pradesh */}
                  <div className="relative rounded-2xl overflow-hidden flex-grow min-h-[350px] border border-green-150 shadow-inner mt-4 bg-slate-100">
                    <iframe 
                      title="Shivoham Shiv Sipri Bazar Jhansi HQ Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.2201415694220!2d78.5562!3d25.4292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3977712e0220e88d%3A0xc3f92ba47c49b6d8!2sSipri%20Bazar%2C%20Jhansi%2C%20Uttar%20Pradesh%20284003!5e0!3m2!1sen!2sin!4v1717582840000!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    );
  }

  // Switch templates on current slug
  if (courseId === "acupressure-therapy") {
    const acupressureSlides = [
      {
        title: "Relieves pain and muscular tension",
        desc: "Acupressure stimulates specific pressure points that help release muscle stiffness, reduce body aches, and ease chronic or work-related pain naturally. Explore our pathways below to see how these practices integrate simple healing routines into modern schedules."
      },
      {
        title: "Supports holistic circulation and relief",
        desc: "By applying gentle guidance to nervous system zones, these techniques release energetic blocks and active flow throughout the entire physiological system."
      },
      {
        title: "Calms emotional strain & mental stress",
        desc: "Somatic focus and touch help quiet overactive neural states, restoring a state of sustained focus and tranquil mindfulness."
      }
    ];

    const prevSlide = () => {
      setCurrentSlide((prev) => (prev === 0 ? acupressureSlides.length - 1 : prev - 1));
    };

    const nextSlide = () => {
      setCurrentSlide((prev) => (prev === acupressureSlides.length - 1 ? 0 : prev + 1));
    };

    return (
      <div className="bg-[#FAFBF7] min-h-screen font-sans selection:bg-green-105 selection:text-green-900 text-[#3A463F] text-left">
        <SEO 
          title="Murm Dab Chikitsa (Acupressure Therapy) Course: Energy Healing — Shivoham Shiv"
          description="At Shivoham Shiv, experience the power of natural healing through Acupressure Therapy. This ancient practice works by activating specific pressure points in the body to relieve pain, restore energy balance, and support overall well-being."
          focusKeyword="acupressure therapy course"
          isCourseDetail={true}
          courseData={{
            name: "Murm Dab Chikitsa (Acupressure Therapy): Energy Healing",
            description: "At Shivoham Shiv, experience the power of natural healing through Acupressure Therapy. This ancient practice works by activating specific pressure points in the body to relieve pain, restore energy balance, and support overall well-being – naturally and holistically.",
            lessonsCount: 16
          }}
          isBreadcrumb={true}
          breadcrumbItems={[
            { name: "Home", url: "/" },
            { name: "Courses", url: "/courses" },
            { name: "Murm Dab Chikitsa", url: "/courses/acupressure-therapy" }
          ]}
        />
        
        {/* Helper styling for Marquee anim */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-custom {
            display: flex;
            width: max-content;
            animation: marquee 20s linear infinite;
          }
        `}} />

        {/* 1. HERO */}
        <section className="bg-[#0F3320] text-cream py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-[#C96E29] relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F4D45] rounded-full text-[#FAFBF7] text-xs font-bold uppercase tracking-widest border border-green-800">
              <Sparkles className="w-3 text-[#C9A24B] fill-[#C9A24B]" />
Online Murm Dab Chikitsa (Acupressure) Pathways
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white tracking-tight leading-tight">
              Murm Dab Chikitsa: Energy Healing
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed font-light">
              At Shivoham Shiv, experience the power of natural healing through Acupressure Therapy. This ancient practice works by activating specific pressure points in the body to relieve pain, restore energy balance, and support overall well-being – naturally and holistically.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => handleScrollToSegment("acupressure-contact-form")}
                className="px-8 py-4 bg-[#C96E29] hover:bg-[#B85F22] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl hover:shadow-2xl transition-all cursor-pointer border-none"
              >
                Book a Session
              </button>
            </div>
          </div>
          {/* Subtle background blurs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-850/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* 2. MARQUEE STRIP */}
        <div className="bg-[#EFFFDF] border-y border-green-150 py-4 overflow-hidden relative w-full font-sans">
          <div className="animate-marquee-custom gap-8">
            {Array(5).fill("Murm Dab Chikitsa (Acupressure) Live Course - Coming Soon").map((text, idx) => (
              <div key={idx} className="flex items-center gap-4 shrink-0 text-[#1F4D45] text-xs sm:text-sm font-bold uppercase tracking-widest font-heading pr-8">
                <span>{text}</span>
                <Leaf className="w-4 h-4 fill-[#C96E29]/20 text-[#C96E29]" />
              </div>
            ))}
          </div>
        </div>

        {/* 3. SECTION "What is Acupressure Therapy?" (image left, text right) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image left */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] sm:aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200"
                  alt="Acupressure, energy lines and reflexology points guide representation"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-[#FAF5EC] border border-[#2F5D50]/20 rounded-2xl flex flex-col items-center justify-center p-3 text-center shadow-lg">
                <span className="block font-heading text-[#C96E29] font-bold text-2xl leading-none">100%</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-green-905 mt-1 leading-none">ONLINE</span>
                <span className="text-[8px] text-slate-400 mt-1 uppercase tracking-wide">Live Studies</span>
              </div>
            </div>

            {/* Text block right */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Core Knowledge</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45] leading-tight">
                What is Murm Dab Chikitsa (Acupressure Therapy)?
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-[#3A463F]/95">
                <p>
                  Acupressure Therapy is an ancient natural healing practice rooted in traditional wisdom that works by applying gentle pressure on specific points of the body. These pressure points are connected to internal organs and energy pathways that regulate physical health, emotional balance, and overall well-being.
                </p>
                <p>
                  By stimulating these points using fingers and hands, Acupressure Therapy helps improve the flow of energy throughout the body. This process supports relaxation, releases internal blockages, enhances circulation, and activates the body's natural self-healing mechanism without the use of medicines or equipment.
                </p>
                
                <div className="space-y-3 pt-2">
                  <p className="font-bold text-[#1F4D45]">Acupressure Therapy works by:</p>
                  <ul className="space-y-2.5">
                    {[
                      "Applying precise pressure to specific energy and reflex points",
                      "Stimulating natural energy flow within the body",
                      "Releasing tension and restoring balance",
                      "Supporting the body's ability to heal itself naturally"
                    ].map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#3A463F]">
                        <CheckCircle2 className="w-4 h-4 text-[#C96E29] mt-0.5 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="pt-2 text-xs italic text-[#3A463F]/90 border-t border-green-50 mt-4 font-light">
                  Acupressure Therapy is safe, non-invasive, and suitable for all age groups. It can be easily practiced as part of a daily wellness routine and is known to promote pain relief, stress reduction, relaxation, and overall harmony of the mind and body.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 4. SECTION "Acupressure Therapy – Natural Healing Through Touch" */}
        <section className="bg-[#FAF5EC] py-20 px-4 sm:px-6 lg:px-8 border-y border-green-100 text-left">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Healing Philosophy</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45]">
Murm Dab Chikitsa (Acupressure) – Natural Healing Through Touch
              </h2>
              <p className="text-sm leading-relaxed text-[#3A463F]/90 max-w-2xl mx-auto">
                At Shivoham Shiv, our Acupressure Therapy services are designed to offer natural, effective, and practical healing support using time-tested techniques. We focus on correct methods, guided practice, and real-life application to ensure meaningful results.
              </p>
            </div>

            {/* Zigzag Timeline Grid (4 cards) */}
            <div className="relative max-w-5xl mx-auto">
              
              {/* Connecting vertical line for desktop zigzag */}
              <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-green-200/50 -translate-x-1/2" />

              <div className="space-y-12 lg:space-y-16">
                {[
                  {
                    title: "Guided Natural Healing Practices",
                    desc: "We provide structured acupressure guidance that helps activate pressure points correctly for pain relief, relaxation, and energy balance."
                  },
                  {
                    title: "Simple, Safe, and Non-Invasive Approach",
                    desc: "Our services focus on gentle techniques that require no medicines or equipment, making them safe and suitable for all age groups."
                  },
                  {
                    title: "Practical Techniques for Daily Use",
                    desc: "We teach easy acupressure methods that can be practiced at home, at work, or anytime for ongoing well-being."
                  },
                  {
                    title: "Holistic Mind–Body Balance Support",
                    desc: "Our acupressure services are designed to improve circulation, reduce stress, and restore overall physical and emotional harmony."
                  }
                ].map((card, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <div 
                      key={idx} 
                      className={`flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 relative`}
                    >
                      {/* Left Column (Content or Filler) */}
                      <div className={`w-full lg:w-[45%] ${isEven ? 'lg:order-1 text-left lg:text-right' : 'lg:order-2 text-left'}`}>
                        <div className="bg-white border border-green-100 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-3 relative z-10">
                          <span className="text-[10px] uppercase font-mono font-bold text-[#C96E29]">Step 0{idx+1}</span>
                          <h3 className="font-heading font-bold text-lg md:text-xl text-[#1F4D45]">{card.title}</h3>
                          <p className="text-xs sm:text-sm text-[#3A463F]/90 leading-relaxed font-light">{card.desc}</p>
                        </div>
                      </div>

                      {/* Timeline Center Point Indicator */}
                      <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1F4D45] border-4 border-white text-cream items-center justify-center font-mono text-xs font-bold z-20 shadow-md">
                        {idx + 1}
                      </div>

                      {/* Right Column (Filler block to maintain responsive balance) */}
                      <div className={`hidden lg:block w-[45%] ${isEven ? 'lg:order-2' : 'lg:order-1'}`} />
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </section>

        {/* 5. SECTION "Why Practice Acupressure Therapy?" */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Physical Yield</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45] mt-2 mb-2">
Why Practice Murm Dab Chikitsa (Acupressure)?
          </h2>
          <p className="text-sm uppercase font-bold tracking-wider text-slate-500 mb-10 block font-heading">
            Key Benefits of Acupressure Therapy:
          </p>

          {/* Interactive Carousel */}
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
                nextSlide();
              } else if (diff < -50) {
                prevSlide();
              }
            }}
            className="bg-white border text-left border-green-105 p-8 sm:p-12 rounded-3xl shadow-xl relative overflow-hidden"
          >
            
            {/* Visual quotes mark */}
            <div className="absolute top-4 right-6 text-7xl font-serif text-green-100 select-none leading-none">”</div>

            {/* Active Slide Text Verbatim block */}
            <div className="space-y-4">
              {currentSlide === 0 ? (
                <div className="space-y-4">
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#1F4D45] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C96E29]" />
                    Relieves pain and muscular tension
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-[#3A463F]/95">
                    Relieves pain and muscular tension — Acupressure stimulates specific pressure points that help release muscle stiffness, reduce body aches, and ease chronic or work-related pain naturally. 
                    {" "}
                    <button 
                      onClick={() => handleScrollToSegment("acupressure-benefits")}
                      className="font-bold text-[#C96E29] hover:text-[#B85F22] underline cursor-pointer inline-flex items-center gap-1 border-none bg-transparent py-0 px-1 font-sans text-sm"
                    >
                      [Explore More]
                    </button>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#1F4D45] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-700" />
                    {acupressureSlides[currentSlide].title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-[#3A463F]/95">
                    {acupressureSlides[currentSlide].desc}
                  </p>
                </div>
              )}
            </div>

            {/* Carousel navigation controls */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-green-50">
              <span className="text-xs text-slate-400 font-mono">
                Slide 0{currentSlide + 1} / 0{acupressureSlides.length}
              </span>
              <div className="flex space-x-2">
                <button 
                  onClick={prevSlide}
                  className="p-2 border border-green-150 rounded-xl hover:bg-green-50 text-[#1F4D45] transition-all cursor-pointer bg-white"
                  aria-label="Previous Benefit"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="p-2 bg-[#1F4D45] hover:bg-green-905 text-white rounded-xl transition-all cursor-pointer border-none"
                  aria-label="Next Benefit"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* 6. SECTION "Acupressure Therapy – Live Course (Coming Soon)" (light-green highlighted band) */}
        <section className="bg-[#EFFFDF]/40 border-y-2 border-green-105 py-16 px-4 sm:px-6 lg:px-8 text-center text-[#3A463F]">
          <div className="max-w-4xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-250">
              <Clock className="w-3" /> Upcoming Interactive Batch
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1F4D45] tracking-tight">
Murm Dab Chikitsa (Acupressure) – Live Course (Coming Soon)
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-4 text-sm sm:text-base leading-relaxed text-[#3A463F]/90 font-light">
              <p>
                Our Acupressure Therapy Live Course is currently under development and will be launching soon at Shivoham Shiv. This upcoming course will focus on teaching authentic acupressure techniques through guided live sessions, ensuring correct practice, personal guidance, and deeper understanding.
              </p>
              <p>
                Unlike recorded learning, this course is being designed as a fully live, interactive experience, allowing learners to understand pressure points, techniques, and applications with clarity and confidence.
              </p>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => handleScrollToSegment("acupressure-contact-form")}
                className="px-8 py-4 bg-[#C96E29] hover:bg-[#B85F22] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer border-none"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </section>

        {/* 7. SECTION "Why Choose Shivoham Shiv for Acupressure Therapy?" (image left, text right) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image left */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200"
                  alt="Acupressure therapy — applying pressure to a hand pressure point"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-emerald-950 text-[#FAFBF7] rounded-full flex flex-col items-center justify-center p-2 text-center border-4 border-white shadow-lg">
                <Leaf className="w-5 h-5 text-[#C9A24B] fill-[#C9A24B]" />
              </div>
            </div>

            {/* Text block right with bullets */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Vedic Standard</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45]">
Why Choose Shivoham Shiv for Murm Dab Chikitsa (Acupressure)?
              </h2>
              
              <div className="space-y-4 text-sm leading-relaxed text-[#3A463F]/90 font-light text-left">
                <p>
                  At Shivoham Shiv, we are committed to teaching Acupressure Therapy in its most authentic and effective form. Our approach is rooted in traditional healing wisdom and thoughtfully adapted to meet the needs of modern lifestyles.
                </p>
                <p>
                  We focus on correct technique, gentle practice, and consistency—so you gain confidence in applying Acupressure and experience real, lasting benefits in your daily life.
                </p>
              </div>

              <div className="space-y-3.5 pt-2 text-left">
                <p className="font-extrabold text-sm text-[#1F4D45]">What sets our Acupressure Therapy approach apart:</p>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      label: "Authentic, Time-Tested Acupressure Knowledge",
                      detail: "Our teachings are based on traditional Acupressure principles that have been practiced for generations, ensuring safe, natural, and effective healing methods."
                    },
                    {
                      label: "Simple and Practical Techniques for Daily Use",
                      detail: "We teach easy-to-follow techniques that can be comfortably practiced at home, at work, or during relaxation, without complexity or strain."
                    },
                    {
                      label: "Safe, Gentle, and Non-Invasive Approach",
                      detail: "Our Acupressure practices use controlled, gentle pressure, making them suitable for all age groups without the need for medicines or equipment."
                    },
                    {
                      label: "Beginner-Friendly Guidance with Clear Demonstrations",
                      detail: "Step-by-step explanations and demonstrations help beginners learn correct pressure points and techniques with clarity and confidence."
                    },
                    {
                      label: "Holistic Focus on Physical, Mental, and Energy Balance",
                      detail: "Our approach supports not just physical relief, but also emotional calmness, mental clarity, and balanced energy flow throughout the body."
                    }
                  ].map((bullet, idx) => (
                    <div key={idx} className="flex gap-3 items-start text-xs text-[#3A463F]">
                      <div className="bg-[#FAFBF7] border border-green-200 text-green-800 p-1 rounded-lg shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-755 font-bold animate-pulse" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-[#1F4D45]">{bullet.label}</h4>
                        <p className="text-slate-500 font-light leading-relaxed">{bullet.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 text-left">
                <button 
                  onClick={() => handleScrollToSegment("acupressure-contact-form")}
                  className="px-8 py-4 bg-[#1F4D45] hover:bg-green-905 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer border-none"
                >
                  Enroll Now
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* 8. SECTION "Benefits of Our Acupressure Therapy Services" */}
        <section id="acupressure-benefits" className="bg-[#FAF5EC] py-20 px-4 sm:px-6 lg:px-8 border-y border-green-100 text-left">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Systemic Restoration</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45]">
Benefits of Our Murm Dab Chikitsa (Acupressure) Services
              </h2>
              <p className="text-xs sm:text-sm text-[#3A463F]/90 leading-relaxed italic max-w-md mx-auto">
                Experience traditional acupressure practices adapted for modern, stress-free living.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Natural Pain Relief & Relaxation",
                  desc: "Our Acupressure Therapy helps ease body pain, muscular tension, and stiffness by stimulating key pressure points, promoting deep relaxation and comfort naturally."
                },
                {
                  title: "Improved Energy Flow & Circulation",
                  desc: "By activating specific pressure points, our therapy supports healthy blood circulation and balanced energy flow, helping restore vitality and physical ease."
                },
                {
                  title: "Stress Reduction & Emotional Balance",
                  desc: "Regular acupressure practice calms the nervous system, reduces stress and anxiety, and supports emotional balance and mental clarity."
                },
                {
                  title: "Safe, Gentle & Beginner-Friendly Healing",
                  desc: "Our non-invasive acupressure techniques are easy to learn, gentle on the body, and suitable for all age groups for daily wellness."
                }
              ].map((card, i) => (
                <div 
                  key={i} 
                  className="bg-white border border-green-100 p-6 rounded-3xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <span className="w-8 h-8 rounded-full bg-[#1F4D45] text-cream flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-cream" />
                    </span>
                    <h3 className="font-heading font-extrabold text-base text-[#1F4D45] leading-snug">{card.title}</h3>
                    <p className="text-xs text-[#3A463F]/85 leading-relaxed font-light">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 9. CONTACT FORM + MAP (acupressure-contact-form) */}
        <section id="acupressure-contact-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-green-100 text-left font-sans">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Form Block Left */}
              <div className="lg:col-span-7 bg-[#FAFBF7] border border-green-105 p-6 sm:p-10 rounded-3xl shadow-lg">
                <div className="space-y-2 mb-8">
                  <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#C96E29]">Course Admission Evaluation</span>
                  <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#1F4D45]">
                    Begin Your Transformation Journey
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3A463F]/85 leading-relaxed font-light">
                    Submit your evaluation query block below, and our holistic consultants will formulate your path. Registration is backed up and direct WhatsApp connects are offered post submission.
                  </p>
                </div>

                {isSuccess ? (
                  <div className="p-8 bg-[#E3F1E3] border border-green-200 text-[#1F4D45] rounded-2xl text-center space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-green-700 mx-auto animate-pulse" />
                    <h4 className="font-bold text-base">Pranama, evaluation information recorded!</h4>
                    <p className="text-xs leading-relaxed max-w-md mx-auto text-[#1F4D45]">
                      Your details have been locked into the local dashboard. Conversing direct on WhatsApp with Pooja's certified team is now opening in a new tab!
                    </p>
                    <a 
                      href="https://wa.me/917317778215" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-7 py-3 bg-[#1F4D45] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-101 shrink-0 text-center"
                    >
                      Converse on WhatsApp
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-medium text-slate-755">
                    {formError && (
                      <div className="p-3 bg-red-50 text-red-900 border border-red-100 rounded-lg text-left font-bold text-[11px]">
                        ⚠ {formError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="acu-name">
                        Full Name *
                      </label>
                      <input 
                        id="acu-name"
                        type="text"
                        required
                        placeholder="e.g. Aditi Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-white focus:outline-none text-[#3A463F]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="acu-email">
                          Email Address *
                        </label>
                        <input 
                          id="acu-email"
                          type="email"
                          required
                          placeholder="aditi@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-white focus:outline-none text-[#3A463F]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="acu-phone">
                          WhatsApp Contact Number *
                        </label>
                        <input 
                          id="acu-phone"
                          type="tel"
                          required
                          placeholder="e.g. +91 94523 42921"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-white focus:outline-none text-[#3A463F]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="acu-msg">
                        Current Symptoms, Health Goals or Questions
                      </label>
                      <textarea 
                        id="acu-msg"
                        rows={4}
                        placeholder="Please state any persistent pain symptoms, stress blocks or physical goals you want to address..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-white focus:outline-none text-[#3A463F]"
                      />
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-4 bg-[#C96E29] hover:bg-[#B85F22] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none"
                      >
                        {isSubmitting ? "Submitting Request..." : "Pre-register / Book Evaluation Session"}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Map Column */}
              <div className="lg:col-span-5 flex flex-col h-full justify-between">
                <div className="bg-[#FAF5EC]/50 border border-green-100 rounded-3xl p-6 shadow-sm space-y-4 flex-grow flex flex-col text-left">
                  <div className="space-y-1">
                    <h4 className="font-heading font-extrabold text-[#1F4D45] text-base">
                      Office Location Base
                    </h4>
                    <p className="text-xs text-[#3A463F]/90 leading-relaxed font-light font-sans">
                      Arya Kanya Chowraha, Sipri Bazar, Jhansi, Uttar Pradesh 284003, India
                    </p>
                  </div>

                  {/* Google Map of Jhansi, Uttar Pradesh */}
                  <div className="relative rounded-2xl overflow-hidden flex-grow min-h-[350px] border border-green-150 shadow-inner mt-4 bg-slate-100">
                    <iframe 
                      title="Shivoham Shiv Sipri Bazar Jhansi HQ Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.2201415694220!2d78.5562!3d25.4292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3977712e0220e88d%3A0xc3f92ba47c49b6d8!2sSipri%20Bazar%2C%20Jhansi%2C%20Uttar%20Pradesh%20284003!5e0!3m2!1sen!2sin!4v1717582840000!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    );
  }

  // Switch templates on current slug
  if (courseId === "corp-wellness") {
    const faqs = [
      { q: "Can these sessions be held live online?", a: "Yes. All our corporate programs and adult alignment sessions are delivered entirely online through live, interactive streams. We support team setups worldwide." },
      { q: "How long are the recommended daily micro-breaks?", a: "We design simple, science-backed 10-minute breaks that fit cleanly even between intense workspace calendars without interrupting team focus." },
      { q: "Is there customized scheduling?", a: "Absolutely. We align schedules directly with your company's timelines, delivering flexible group sessions across multiple time zones." }
    ];

    return (
      <div className="bg-[#FAFBF7] min-h-screen font-sans selection:bg-green-105 selection:text-green-900 text-[#3A463F]">
        <SEO 
          title="Corporate & Adult Wellness Program | Workplace Well-Being — Shivoham Shiv"
          description="Holistic corporate & adult wellness programs that reduce workplace stress, improve focus and support employee well-being."
          focusKeyword="corporate wellness program"
          isCourseDetail={true}
          courseData={{
            name: "Corporate & Adult Wellness: Well-Being at Work",
            description: "At Shivoham Shiv, we help organizations improve employee well-being through holistic, science-backed wellness programs rooted in ancient wisdom and adapted for modern workplaces.",
            lessonsCount: 18
          }}
          isBreadcrumb={true}
          breadcrumbItems={[
            { name: "Home", url: "/" },
            { name: "Courses", url: "/courses" },
            { name: "Corporate Wellness", url: "/courses/corporate-wellness" }
          ]}
        />

        {/* 1. HERO */}
        <section className="bg-[#0F3320] text-cream py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-[#C96E29] relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F4D45] rounded-full text-[#FAFBF7] text-xs font-bold uppercase tracking-widest border border-green-800">
              <Sparkles className="w-3 text-[#C9A24B] fill-[#C9A24B]" />
              Online Corporate Pathways
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white tracking-tight leading-tight">
              Corporate & Adult Wellness: Well-Being at Work
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed font-light">
              At Shivoham Shiv, we help organizations improve employee well-being through holistic, science-backed wellness programs rooted in ancient wisdom and adapted for modern workplaces.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => handleScrollToSegment("evaluation-form")}
                className="px-8 py-4 bg-[#C96E29] hover:bg-[#B85F22] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              >
                Book a Session
              </button>
            </div>
          </div>
          {/* Subtle geometric background filters */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-850/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* 2. WHAT IS CORPORATE & ADULT WELLNESS? */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image block left */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] sm:aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200"
                  alt="Corporate and adult breathing therapy and mental alignment session outdoors representation"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#FAF5EC] border border-[#2F5D50]/20 rounded-2xl flex flex-col items-center justify-center p-3 text-center shadow-lg">
                <span className="block font-heading text-[#C96E29] font-bold text-xl leading-none">100%</span>
                <span className="text-[9px] uppercase tracking-wider text-green-905 font-bold mt-1">ONLINE</span>
              </div>
            </div>

            {/* Text block right */}
            <div className="lg:col-span-7 text-left space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Core Definition</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45] leading-tight">
                What is Corporate & Adult Wellness?
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-[#3A463F]/90">
                <p>
                  Corporate & Adult Wellness is a holistic approach focused on improving the physical, mental, and emotional well-being of employees within the workplace. It aims to create a healthier, more balanced, and productive work environment by addressing stress, burnout, lifestyle-related issues, and overall employee health.
                </p>
                <p>
                  In today's fast-paced corporate culture, long working hours, screen exposure, and constant pressure often lead to fatigue, reduced focus, and health concerns. Corporate Wellness programs are designed to support employees through natural, preventive, and sustainable practices.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 3. BENEFITS TO ORGANIZATIONS */}
        <section className="bg-[#FAF5EC] py-20 px-4 sm:px-6 lg:px-8 border-y border-green-100">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Organizational Yield</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45]">
                How do corporate wellness programs benefit organizations?
              </h2>
              <p className="text-xs sm:text-sm text-[#3A463F]/80 leading-relaxed font-medium italic">
                "Investing in employee well-being is not just a trend — it is a strategic decision that directly affects an organization's success and sustainability."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Increased Productivity",
                  desc: "Healthy and stress-free employees perform significantly better, excel in decision-making, and maintain high enthusiasm levels throughout the working day."
                },
                {
                  title: "Reduced Absenteeism",
                  desc: "Preventive health habits and simple daily breathing techniques reduce physical illnesses, chronic fatigue, and sick leaves."
                },
                {
                  title: "High Retentiveness",
                  desc: "When employees feel genuinely cared for and supported by their employers, overall job satisfaction levels increase, lowering employee turnover."
                },
                {
                  title: "Strong Team Cohesion",
                  desc: "Practicing mindfulness and group yoga creates empathetic workspaces, helping teams communicate consciously and collaborate with ease."
                }
              ].map((b, i) => (
                <div key={i} className="bg-white border border-green-100 p-6 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-8 h-8 rounded-full bg-[#1F4D45] text-cream font-mono font-bold text-xs flex items-center justify-center">
                      0{i+1}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-[#1F4D45]">{b.title}</h3>
                    <p className="text-xs leading-relaxed text-[#3A463F]/85">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 4. WHY CHOOSE SHIVOHAM SHIV? */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Vedic Edge</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45]">
                Why Choose Shivoham Shiv?
              </h2>
              <p className="text-sm leading-relaxed text-[#3A463F]/90">
                Unlike average surface-level setups, Shivoham Shiv designs profound programs that create deep, organic adjustments under Pooja Chaturvedi's direct wellness guidance. All courses and consultations are conducted 100% online, making this timeless knowledge accessible worldwide.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {[
                  {
                    title: "Tailored Blueprints",
                    desc: "We never use generic templates. Every single routine (Dinacharya) and breathing sequence is shaped around individual physical traits (Prakriti)."
                  },
                  {
                    title: "Holistic Vedic Depth",
                    desc: "We combine elements of yoga, breathing exercises (Pranayama), finger postures (Mudra), and energy balancing to support systemic, continuous recovery."
                  },
                  {
                    title: "Digital Workspace Integration",
                    desc: "Simple 10-minute micro-breaks designed specifically for busy screen workers that fit effortlessly into intense schedules."
                  },
                  {
                    title: "Reliable Mentorship",
                    desc: "Complete programmatic support, verified diagnostics, and access to continuous wellness alignment dashboards."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-green-100 rounded-lg text-green-800">
                        <CheckCircle2 className="w-4 h-4 text-green-700" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-[#1F4D45]">{item.title}</h4>
                    </div>
                    <p className="text-xs text-[#3A463F]/85 leading-relaxed pl-8">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Static Mockup Laptop/Workspace display on the right */}
            <div className="lg:col-span-6">
              <div className="bg-white p-6 rounded-[32px] border border-green-100 shadow-xl space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C96E29] block">
                  Corporate Dashboard Audit
                </span>
                <div className="aspect-[16/10] bg-[#0F3320] rounded-2xl overflow-hidden relative border border-green-900 flex items-center justify-center p-6 text-cream">
                  <div className="text-center space-y-3">
                    <GraduationCap className="w-12 h-12 text-[#C9A24B] mx-auto animate-pulse" />
                    <h4 className="font-heading font-semibold text-lg text-white">Shivoham Shiv Corporate Portal</h4>
                    <p className="text-[11px] text-green-200 uppercase tracking-widest font-mono">
                      ✔ 4 Live Corporate sessions reserved
                    </p>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg flex items-center justify-between text-[10px] font-medium font-mono text-green-100 border border-white/5">
                    <span>STATUS: ALL SESSIONS ONLINE</span>
                    <span className="text-[#C9A24B]">● ACTIVE</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs pt-2">
                  <span className="font-semibold text-slate-500">Program Duration:</span>
                  <span className="font-bold text-[#1F4D45]">6 Weeks (Self-Paced + Live)</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 5. CORE WELL-BEING MODULES */}
        <section className="bg-[#F2F9F2] py-20 px-4 sm:px-6 lg:px-8 border-y border-green-100 text-left">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Systematic Path</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45]">
                Our Core Well-Being Modules
              </h2>
              <p className="text-xs sm:text-sm text-[#3A463F]/85 leading-relaxed">
                We split our corporate modules into three targeted stages to guide teams from initial fatigue to long-term resilience:
              </p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {[
                {
                  mod: "Module 1",
                  title: "Foundations of Corporate Mindfulness",
                  desc: "Identify corporate stress cues, analyze biological stress responses, and practice basic sitting breathwork (Pranayama) to cool the nervous system instantly."
                },
                {
                  mod: "Module 2",
                  title: "Daily Cycle Synchronization (Dinacharya)",
                  desc: "Incorporate Vedic circadian schedules, configure ergonomic mindful workspaces, and practice element-balancing finger locks (Hasta Mudra) to renew daily energy."
                },
                {
                  mod: "Module 3",
                  title: "Relational Harmony & Vedic Expression",
                  desc: "Incorporate conscious communication models to decrease workplace friction, resolve conflicts with ease, and foster supportive team micro-communities."
                }
              ].map((m, idx) => (
                <div key={idx} className="bg-white p-6 sm:p-8 rounded-3xl border border-green-100 flex flex-col md:flex-row gap-6 items-start">
                  <div className="px-3.5 py-1.5 bg-[#C96E29] text-white rounded-lg text-xs font-mono font-bold shrink-0">
                    {m.mod}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-lg text-[#1F4D45]">{m.title}</h3>
                    <p className="text-xs sm:text-sm text-[#3A463F]/90 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 6. FAQ ACCORDION */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-left">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Clear Up Doubts</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1F4D45]">Frequently Asked Corporate Queries</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div key={idx} className="bg-white border border-green-100 rounded-2xl overflow-hidden shadow-xs">
                  <button 
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-semibold text-[#1F4D45] flex justify-between items-center bg-white cursor-pointer hover:bg-[#FAFBF7] transition-all"
                  >
                    <span className="font-heading text-sm text-[#1F4D45]">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-green-700 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-green-50 text-xs text-[#3A463F]/85 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. EVALUATION FORM SECTION */}
        <section id="evaluation-form" className="bg-[#EFFFDF]/40 py-20 px-4 sm:px-6 lg:px-8 border-t border-green-100 text-left">
          <div className="max-w-4xl mx-auto">
            
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-green-105 shadow-xl max-w-2xl mx-auto">
              <div className="text-center mb-8 space-y-2">
                <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#C96E29]">Vedic Corporate Registry</span>
                <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#1F4D45]">
                  Introduce Authentic Well-Being to Your Workplace
                </h3>
                <p className="text-xs sm:text-sm text-[#3A463F]/85 leading-relaxed">
                  Ready to assist your team in neutralizing burnout and building resilient, focused daily habits? Connect with our chief counselor to plan a custom program. Registered in local diagnostic storage.
                </p>
              </div>

              {isSuccess ? (
                <div className="p-8 bg-[#E3F1E3] border border-green-200 text-[#1F4D45] rounded-2xl text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-green-700 mx-auto" />
                  <h4 className="font-bold text-base">Corporate diagnostic request saved!</h4>
                  <p className="text-xs leading-relaxed max-w-md mx-auto text-slate-705">
                    We have successfully captured your organization's wellness inquiry. Initiating chat confirmation directly with Pooja Chaturvedi's consulting team on WhatsApp (+91 73177 78215). Check dashboard entries to view saved data!
                  </p>
                  <a 
                    href="https://wa.me/917317778215" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-7 py-3 bg-[#1F4D45] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-101 shrink-0"
                  >
                    Discuss details on WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-medium">
                  {formError && (
                    <div className="p-3 bg-red-50 text-red-900 border border-red-100 rounded-lg text-left font-bold text-[11px]">
                      ⚠ {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5" htmlFor="corp-fullname">
                        Your Full Name *
                      </label>
                      <input 
                        id="corp-fullname"
                        type="text"
                        required
                        placeholder="e.g. Aditi Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5" htmlFor="corp-email">
                        Company Email Address *
                      </label>
                      <input 
                        id="corp-email"
                        type="email"
                        required
                        placeholder="aditi@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5" htmlFor="corp-whatsapp">
                      WhatsApp Contact Number *
                    </label>
                    <input 
                      id="corp-whatsapp"
                      type="tel"
                      required
                      placeholder="e.g. +91 94523 42921"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5" htmlFor="corp-note">
                      Organization Size / Corporate Wellness Objectives
                    </label>
                    <textarea 
                      id="corp-note"
                      rows={3}
                      placeholder="e.g. Help a team of 45 reduce screen-fatigue and secure monthly wellness alignments."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] text-[#3A463F] focus:outline-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#C96E29] hover:bg-[#B85F22] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-101 cursor-pointer mt-2"
                  >
                    {isSubmitting ? "Securing Evaluation Slot..." : "Secure a Free Corporate Evaluation Session"}
                  </button>
                </form>
              )}

            </div>

          </div>
        </section>

      </div>
    );
  }

  // Live Mindfulness & EQ Program for Kids specific rendering
  if (courseId === "kids-eq") {
    const kidsSlides = [
      {
        title: "Better Focus & Learning Ability",
        description: "Helps children improve concentration, attention span, and mental clarity, supporting better learning and daily activities.",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200"
      },
      {
        title: "Emotional Self-Regulation & Calm",
        description: "Teaches kids how to recognize and manage intense emotions like anxiety, fear, or frustration safely.",
        image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1200"
      },
      {
        title: "Reduced Stress & Digital Fatigue",
        description: "Offline, sensory awareness games that help children disconnect from digital overload and rest their minds.",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200"
      }
    ];

    const nextKidsSlide = () => {
      setCurrentKidsSlide((prev) => (prev + 1) % kidsSlides.length);
    };

    const prevKidsSlide = () => {
      setCurrentKidsSlide((prev) => (prev - 1 + kidsSlides.length) % kidsSlides.length);
    };

    return (
      <div className="bg-[#FAFBF7] min-h-screen font-sans selection:bg-green-105 selection:text-green-900 text-[#3A463F] text-left">
        <SEO 
          title="Mindfulness & EQ Training for Kids | Focus and Emotional Growth — Shivoham Shiv"
          description="Build focus, emotional balance, and self-awareness through gentle, age-appropriate practices—supporting calm minds and emotional growth."
          focusKeyword="EQ training for kids"
          isCourseDetail={true}
          courseData={{
            name: "Mindfulness & Focus Training for Kids",
            description: "At Shivoham Shiv, our Mindfulness & EQ Program for Kids helps children build focus, emotional balance, and self-awareness through gentle, age-appropriate practices—supporting calm minds and healthy emotional growth in a natural, holistic way.",
            lessonsCount: 12
          }}
          isBreadcrumb={true}
          breadcrumbItems={[
            { name: "Home", url: "/" },
            { name: "Courses", url: "/courses" },
            { name: "Mindfulness & Focus Training for Kids", url: `/courses/${slug}` }
          ]}
        />

        {/* 1. HERO */}
        <section className="relative bg-[#0F3320] text-cream py-20 lg:py-32 px-4 sm:px-6 lg:px-8 border-b-4 border-[#C96E29] overflow-hidden">
          {/* Subtle Ambient Background Overlay */}
          <div className="absolute inset-0 z-0 opacity-15">
            <img 
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1600"
              alt="Background context children classroom"
              className="w-full h-full object-cover filter blur-[2px]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="max-w-4xl mx-auto space-y-6 relative z-10 text-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#1F4D45] rounded-full text-[#FAFBF7] text-xs font-bold uppercase tracking-widest border border-green-800">
              <Sparkles className="w-3 text-amber-500 fill-amber-500" />
              Active Admissions Open
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white tracking-tight leading-tight">
              Mindfulness & Focus Training for Kids
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-green-100 max-w-3xl mx-auto leading-relaxed font-light">
              At Shivoham Shiv, our Mindfulness & EQ Program for Kids helps children build focus, 
              emotional balance, and self-awareness through gentle, age-appropriate practices—supporting calm 
              minds and healthy emotional growth in a natural, holistic way.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => handleScrollToSegment("kids-contact-form")}
                className="px-8 py-4 bg-[#C96E29] hover:bg-[#B85F22] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              >
                Book a Session
              </button>
            </div>
          </div>
        </section>

        {/* 2. What is? (Image Left, Text Right) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Image (Left) */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200" 
                  alt="Teacher guiding young children in a calm mindfulness session"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#FAF5EC] -z-10 rounded-full" />
            </div>

            {/* Text Context (Right) */}
            <div className="space-y-6 text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Child Mind Roots</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45] leading-tight">
                What is Mindfulness & EQ Training for Kids?
              </h2>
              <p className="text-sm leading-relaxed text-[#3A463F]/90">
                Mindfulness & Emotional Intelligence (EQ) Training for Kids is a gentle, structured approach that helps children understand their thoughts, emotions, and reactions in a healthy way. Rooted in mindful awareness and emotional learning, this program supports a child's mental focus, emotional balance, and self-awareness during their key developmental years.
              </p>
              <p className="text-sm leading-relaxed text-[#3A463F]/90">
                Through simple mindfulness exercises, breathing practices, and age-appropriate EQ activities, children learn how to calm their minds, recognize emotions, improve concentration, and respond positively to everyday situations at home, school, and social environments.
              </p>
              
              <div className="pt-2">
                <p className="text-sm font-bold text-[#1F4D45] mb-3">Mindfulness & EQ Training works by:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    "Teaching children to become aware of their thoughts and emotions",
                    "Improving focus, attention, and listening skills",
                    "Helping manage stress, anxiety, and emotional overwhelm",
                    "Building self-confidence, empathy, and emotional regulation"
                  ].map((bullet, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-[#3A463F]/95">
                      <CheckCircle2 className="w-4 h-4 text-green-750 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs leading-relaxed text-[#3A463F]/80 italic pt-2">
                Mindfulness & EQ Training is safe, non-invasive, and suitable for children of all ages. It can be easily integrated into daily routines and supports emotional stability, better behavior, improved learning ability, and overall mental well-being—naturally and holistically.
              </p>
            </div>

          </div>
        </section>

        {/* 3. Nurturing Calm & Emotional Awareness (Zigzag 4 cards) */}
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-y border-green-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="text-xs uppercase font-semibold tracking-widest text-[#C96E29]">Guided Evolution Pathways</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45] leading-tight">
                Mindfulness & EQ Training for Kids – Nurturing Calm & Emotional Awareness
              </h2>
              <p className="text-sm text-[#3A463F]/90 leading-relaxed max-w-2xl mx-auto">
                At Shivoham Shiv, our Mindfulness & EQ program gently supports children in understanding their thoughts and emotions. Using simple mindfulness exercises and emotional learning activities, we help cultivate calm minds, emotional clarity, and balanced growth—naturally and holistically.
              </p>
            </div>

            {/* Alternating Zigzag Timeline Grid style */}
            <div className="relative max-w-5xl mx-auto py-8">
              {/* Center vertical connector line */}
              <div className="absolute left-[20px] md:left-1/2 transform md:-translate-x-1/2 top-4 bottom-4 w-1 bg-green-100 hidden md:block" />

              <div className="space-y-12 relative">
                
                {/* Timeline Card 1 */}
                <div className="flex flex-col md:flex-row items-center justify-between relative">
                  <div className="absolute left-[10px] md:left-1/2 transform -translate-x-[2px] md:-translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-green-800 flex items-center justify-center z-10 shadow hidden md:flex">
                    <Brain className="w-3.5 h-3.5 text-[#1F4D45]" />
                  </div>
                  <div className="w-full md:w-[45%] text-left md:text-right order-1">
                    <div className="bg-[#FAFBF7] p-6 sm:p-8 rounded-3xl border border-green-50 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex md:flex-row-reverse items-center gap-3.5 mb-3">
                        <div className="p-2.5 bg-green-105 rounded-xl shrink-0">
                          <Brain className="w-5 h-5 text-[#1F4D45]" />
                        </div>
                        <h3 className="font-heading font-extrabold text-[#1F4D45] text-lg">
                          Improved Focus & Attention Skills
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#3A463F]/90 leading-relaxed">
                        We offer guided mindfulness practices that help children strengthen concentration, listening ability, and mental clarity for better learning and daily activities.
                      </p>
                    </div>
                  </div>
                  <div className="w-full md:w-[45%] hidden md:block order-2" />
                </div>

                {/* Timeline Card 2 */}
                <div className="flex flex-col md:flex-row items-center justify-between relative">
                  <div className="absolute left-[10px] md:left-1/2 transform -translate-x-[2px] md:-translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-green-800 flex items-center justify-center z-10 shadow hidden md:flex">
                    <Heart className="w-3.5 h-3.5 text-[#1F4D45]" />
                  </div>
                  <div className="w-full md:w-[45%] hidden md:block order-1" />
                  <div className="w-full md:w-[45%] text-left order-2">
                    <div className="bg-[#FAFBF7] p-6 sm:p-8 rounded-3xl border border-green-50 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3.5 mb-3">
                        <div className="p-2.5 bg-green-105 rounded-xl shrink-0">
                          <Heart className="w-5 h-5 text-[#1F4D45]" />
                        </div>
                        <h3 className="font-heading font-extrabold text-[#1F4D45] text-lg">
                          Emotional Awareness & Regulation
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#3A463F]/90 leading-relaxed">
                        Our EQ-based activities help children recognize, understand, and manage their emotions in a healthy and balanced way.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline Card 3 */}
                <div className="flex flex-col md:flex-row items-center justify-between relative">
                  <div className="absolute left-[10px] md:left-1/2 transform -translate-x-[2px] md:-translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-green-800 flex items-center justify-center z-10 shadow hidden md:flex">
                    <Leaf className="w-3.5 h-3.5 text-[#1F4D45]" />
                  </div>
                  <div className="w-full md:w-[45%] text-left md:text-right order-1">
                    <div className="bg-[#FAFBF7] p-6 sm:p-8 rounded-3xl border border-green-50 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex md:flex-row-reverse items-center gap-3.5 mb-3">
                        <div className="p-2.5 bg-green-105 rounded-xl shrink-0">
                          <Leaf className="w-5 h-5 text-[#1F4D45]" />
                        </div>
                        <h3 className="font-heading font-extrabold text-[#1F4D45] text-lg">
                          Calm Mind & Stress Management
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#3A463F]/90 leading-relaxed">
                        Simple breathing and relaxation practices support emotional calm, reduce restlessness, and promote a peaceful state of mind.
                      </p>
                    </div>
                  </div>
                  <div className="w-full md:w-[45%] hidden md:block order-2" />
                </div>

                {/* Timeline Card 4 */}
                <div className="flex flex-col md:flex-row items-center justify-between relative">
                  <div className="absolute left-[10px] md:left-1/2 transform -translate-x-[2px] md:-translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-green-800 flex items-center justify-center z-10 shadow hidden md:flex">
                    <User className="w-3.5 h-3.5 text-[#1F4D45]" />
                  </div>
                  <div className="w-full md:w-[45%] hidden md:block order-1" />
                  <div className="w-full md:w-[45%] text-left order-2">
                    <div className="bg-[#FAFBF7] p-6 sm:p-8 rounded-3xl border border-green-50 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3.5 mb-3">
                        <div className="p-2.5 bg-green-105 rounded-xl shrink-0">
                          <User className="w-5 h-5 text-[#1F4D45]" />
                        </div>
                        <h3 className="font-heading font-extrabold text-[#1F4D45] text-lg">
                          Confidence & Positive Social Behavior
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#3A463F]/90 leading-relaxed">
                        Through emotional learning and self-awareness exercises, children build confidence, empathy, and positive interaction skills.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* 4. Why Choose Mindfulness & EQ Training for Kids (Interactive Carousel) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF5EC]/40 text-left relative overflow-hidden">
          <div className="max-w-5xl mx-auto space-y-12">
            
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Interactive Exploration</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45]">
                Why Choose Mindfulness & EQ Training for Kids?
              </h2>
              <p className="text-sm text-slate-600 font-semibold max-w-md mx-auto text-center">
                Key Benefits of Mindfulness & EQ Training for Kids:
              </p>
            </div>

            {/* Slider Showcase Frame */}
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
                  nextKidsSlide();
                } else if (diff < -50) {
                  prevKidsSlide();
                }
              }}
              className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl col-span-1 min-h-[460px] flex items-end"
            >
              {/* Background Slide Image */}
              <div className="absolute inset-0 z-0 bg-slate-205">
                <img 
                  src={kidsSlides[currentKidsSlide].image} 
                  alt={kidsSlides[currentKidsSlide].title}
                  className="w-full h-full object-cover transition-all duration-705 ease-in-out select-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
              </div>

              {/* Slider Left/Right Arrows */}
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-20">
                <button 
                  onClick={prevKidsSlide}
                  className="p-3 rounded-full bg-white/90 hover:bg-white text-[#1F4D45] transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5 font-bold" />
                </button>
                <button 
                  onClick={nextKidsSlide}
                  className="p-3 rounded-full bg-white/90 hover:bg-white text-[#1F4D45] transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-5 h-5 font-bold" />
                </button>
              </div>

              {/* Content Panel Overlaid in center-bottom */}
              <div className="p-8 sm:p-12 relative z-10 w-full max-w-3xl mx-auto text-center space-y-4">
                <span className="inline-block px-3 py-1 bg-amber-500 rounded-full text-[#FAFBF7] text-[10px] font-bold uppercase tracking-widest leading-none">
                  Core Wellness Slide {currentKidsSlide + 1} of {kidsSlides.length}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
                  {kidsSlides[currentKidsSlide].title}
                </h3>
                <p className="text-xs sm:text-sm text-green-50 max-w-xl mx-auto leading-relaxed">
                  {kidsSlides[currentKidsSlide].description}
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => handleScrollToSegment("kids-contact-form")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C96E29] hover:bg-[#B85F22] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md hover:shadow-lg"
                  >
                    Explore More
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 5. Why Choose Shivoham Shiv... (Image Left, Bullet Items Right) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Image (Left) */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                <img 
                  src="/images/kids-why-choose.jpg"
                  alt="Children practicing mindfulness and calm breathing"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#FAF5EC] -z-10 rounded-full" />
            </div>

            {/* Bullets (Right) */}
            <div className="space-y-6 text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Shivoham Shiv Standards</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45] leading-tight">
                Why Choose Shivoham Shiv for Mindfulness & EQ Training for Kids?
              </h2>
              <p className="text-sm leading-relaxed text-[#3A463F]/90">
                At Shivoham Shiv, we offer a gentle, structured Mindfulness & EQ program designed specifically for children. Through age-appropriate practices and guided learning, we help children build focus, emotional awareness, and calm behavior in a safe and supportive environment—encouraging balanced emotional and mental growth.
              </p>

              <div>
                <p className="text-sm font-bold text-[#1F4D45] mb-4">What sets our Mindfulness & EQ Training for Kids apart:</p>
                <div className="space-y-4">
                  {[
                    {
                      title: "Age-Appropriate & Child-Friendly Learning Methods",
                      desc: "Our sessions are designed specifically for children, using simple language, engaging activities, and gentle practices that make learning mindfulness and emotional skills easy and enjoyable."
                    },
                    {
                      title: "Focus on Emotional Awareness & Healthy Expression",
                      desc: "We help children recognize, understand, and express their emotions in a positive and balanced way, supporting emotional maturity and resilience."
                    },
                    {
                      title: "Safe, Gentle & Non-Intrusive Practices",
                      desc: "All mindfulness and EQ activities are non-invasive, stress-free, and suitable for children of all ages, creating a comfortable and supportive learning environment."
                    },
                    {
                      title: "Structured Guidance with Clear Demonstrations",
                      desc: "Step-by-step guidance and practical demonstrations help children learn focus, breathing, and emotional regulation with clarity and confidence."
                    },
                    {
                      title: "Holistic Support for Mental, Emotional & Social Growth",
                      desc: "Our approach supports not only concentration and calmness, but also self-confidence, empathy, and positive social behavior—encouraging balanced overall development."
                    }
                  ].map((bullet, idx) => (
                    <div key={idx} className="flex items-start space-x-3.5 text-xs text-[#3A463F]/95">
                      <div className="w-5 h-5 rounded-full bg-green-110 flex items-center justify-center text-[#1F4D45] font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <strong className="text-sm font-heading font-extrabold text-[#1F4D45] block leading-snug">
                          {bullet.title}
                        </strong>
                        <p className="text-xs text-[#3A463F]/85 leading-relaxed">{bullet.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => handleScrollToSegment("kids-contact-form")}
                  className="px-8.5 py-4 bg-[#C96E29] hover:bg-[#B85F22] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
                >
                  Enroll Now
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* 6. Benefits (4 Cards Grid) */}
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-t border-green-100 text-left">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Somatic Milestones</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1F4D45]">
                Benefits of Our Mindfulness & EQ Training Services
              </h2>
              <p className="text-sm text-[#3A463F]/85 italic leading-relaxed max-w-md mx-auto text-center">
                Helping children grow calm, focused, and emotionally strong through gentle, age-appropriate practices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Building Strong Concentration Skills",
                  desc: "Helps children strengthen focus, listening ability, and mental clarity to support better learning and daily activities.",
                  icon: GraduationCap
                },
                {
                  title: "Understanding & Managing Emotions",
                  desc: "Supports children in recognizing their emotions and responding calmly, helping develop emotional stability and self-control.",
                  icon: Heart
                },
                {
                  title: "Encouraging Calm & Positive Responses",
                  desc: "Teaches simple mindfulness and breathing practices that reduce restlessness and promote calm, balanced behavior.",
                  icon: Leaf
                },
                {
                  title: "Developing Healthy Social Interaction",
                  desc: "Builds self-confidence, empathy, and positive communication skills, helping children connect better with others.",
                  icon: User
                }
              ].map((b, idx) => {
                const IconComponent = b.icon;
                return (
                  <div key={idx} className="bg-[#FAFBF7] border border-green-50 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all">
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-2xl bg-green-105 text-[#1F4D45] flex items-center justify-center font-bold">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading font-extrabold text-[#1F4D45] text-base leading-tight">{b.title}</h3>
                      <p className="text-xs leading-relaxed text-[#3A463F]/85">{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. CONTACT Form + Jhansi HQ Map */}
        <section id="kids-contact-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF5EC]/30 border-t border-green-100 text-left">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
              
              {/* Form Input Container */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-green-150 shadow-xl">
                <div className="space-y-2 mb-8">
                  <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#C96E29]">Vedic Diagnostic Gate</span>
                  <h3 className="font-heading font-bold text-2xl text-[#1F4D45]">
                    Get in Touch
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ready to begin Mindfulness & EQ Training or have any questions? Submit your details below to schedule an online evaluation.
                  </p>
                </div>

                {isSuccess ? (
                  <div className="p-8 bg-[#E3F1E3] border border-green-200 text-[#1F4D45] rounded-2xl text-center space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-green-700 mx-auto animate-bounce" />
                    <h4 className="font-bold text-base">Pranama, evaluation information recorded!</h4>
                    <p className="text-xs leading-relaxed max-w-md mx-auto text-slate-705">
                      Your details have been locked into the local dashboard. Conversing direct on WhatsApp with Pooja's certified team is now opening in a new tab!
                    </p>
                    <a 
                      href="https://wa.me/917317778215" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-7 py-3 bg-[#1F4D45] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-101 shrink-0"
                    >
                      Converse on WhatsApp
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-medium text-slate-755">
                    {formError && (
                      <div className="p-3 bg-red-50 text-red-900 border border-red-100 rounded-lg text-left font-bold text-[11px]">
                        ⚠ {formError}
                      </div>
                    )}

                    {/* Split Form Names */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">
                        Name *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <input 
                            type="text"
                            required
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block font-normal">First</span>
                        </div>
                        <div>
                          <input 
                            type="text"
                            required
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block font-normal">Last</span>
                        </div>
                      </div>
                    </div>

                    {/* Email * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 animate-none" htmlFor="kids-email">
                        Email *
                      </label>
                      <input 
                        id="kids-email"
                        type="email"
                        required
                        placeholder="aditi@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                      />
                    </div>

                    {/* Contact No. * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-medium" htmlFor="kids-tel">
                        Contact No. *
                      </label>
                      <input 
                        id="kids-tel"
                        type="tel"
                        required
                        placeholder="e.g. +91 94523 42921"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                      />
                    </div>

                    {/* Health Note details */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="kids-message">
                        Comment or Message
                      </label>
                      <textarea 
                        id="kids-message"
                        rows={4}
                        placeholder="State children's conditions, learning wellness questions, or age details..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none text-[#3A463F]"
                      />
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3.5 bg-[#1F4D45] hover:bg-green-905 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Map base info */}
              <div className="lg:col-span-5 flex flex-col h-full justify-between text-left">
                <div className="bg-[#FAF5EC]/50 border border-green-100 rounded-3xl p-6 shadow-sm flex-grow flex flex-col">
                  <div className="space-y-1 text-left">
                    <h4 className="font-heading font-extrabold text-[#1F4D45] text-base">
                      Office Location Base
                    </h4>
                    <p className="text-xs text-[#3A463F]/90 leading-relaxed">
                      Arya Kanya Chowraha, Sipri Bazar, Jhansi, Uttar Pradesh 284003, India
                    </p>
                  </div>

                  {/* Google Map centered in Jhansi UP base */}
                  <div className="relative rounded-2xl overflow-hidden flex-grow min-h-[350px] border border-green-150 shadow-inner mt-4 bg-slate-100">
                    <iframe 
                      title="Shivoham Shiv Sipri Bazar Jhansi HQ Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.2201415694220!2d78.5562!3d25.4292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3977712e0220e88d%3A0xc3f92ba47c49b6d8!2sSipri%20Bazar%2C%20Jhansi%2C%20Uttar%20Pradesh%20284003!5e0!3m2!1sen!2sin!4v1717582840000!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    );
  }

  // Handle generalized template details for Mudra, Acupressure, Kids EQ and Vedic Math courses!
  const allGeneralDetails: Record<string, {
    title: string;
    description: string;
    seoFocusWord: string;
    heroSubtitle: string;
    category: string;
    courseDuration: string;
    studentCount: number;
    lessons: number;
    image: string;
    subH2: string;
    subP: string;
    benefits: string[];
    features: string[];
    modules: Array<{ title: string; desc: string }>;
    isUpcoming?: boolean;
    upcomingStartDate?: string;
    isSelfPaced?: boolean;
  }> = {
    "mudra-therapy": {
      title: "Mudra Therapy Course: A Path to Holistic Healing",
      description: "A complete interactive system unlocking the energetic circuitry of your hands. Guided directly by Vedic lineages, learn the neurological basis, precise hand alignments, and timing regimens for 15 essential Hasta Mudras to heal stomach blockages, severe tension, and emotional volatility.",
      seoFocusWord: "mudra therapy course online",
      heroSubtitle: "Channel biological micro-currents through simple gestures. Over 840 healers started here.",
      category: "Mudra Therapy",
      courseDuration: "4 Weeks (Interactive Video)",
      studentCount: 846,
      lessons: 15,
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
      subH2: "What is Mudra Therapy?",
      subP: "Mudra Therapy is a classical Ayurvedic science that uses precise hand and finger placements to direct the flow of prana (vital life force) throughout the body. By touching element-regulating fingers together, we stimulate biological points in the brain and central nervous system. Built to return individuals to their original state of balance, calmness, and profound inner alignment.",
      benefits: [
        "Soothing Systemic Cravings: Active morning hand-locks calm overactive Pitta heat elements.",
        "Clear Somatic Tension: Simple Gyan and Prana gestures drop severe day pressure rapidly.",
        "Deepen Spiritual Alignment: Restores digestions (Mandagni) and blocks fatigue at its root."
      ],
      features: [
        "Unrestricted access to the Hasta Mudra digital guide algorithms",
        "Anatomical fingertips elemental energy pressure details",
        "Assessment diagnostic checks with certified Ayurvedic mentors",
        "Hasta Mudra Fundamentals Completion Certificate"
      ],
      modules: [
        { title: "Module 1: The Bio-Electric Hand (Tattva Science)", desc: "Map the five primal elements (Fire, Air, Space, Earth, Water) to your fingertips and examine biological micro-currents." },
        { title: "Module 2: Practical Mudras for Everyday Calm", desc: "Discover Gyan Mudra, Prana Mudra, and Apana Mudra to trigger inner ease, support digestions, and lower daily cortisol." },
        { title: "Module 3: Developing a Self-Healing Practice", desc: "Establish targeted breathing ratios, combine mudra bundles, and practice guided 21-day sadhana routines." }
      ]
    },
    "acupressure-therapy": {
      title: "Murm Dab Chikitsa: Heal Through Energy Points",
      description: "An ancient holistic wellness system detailing key meridian sites of the nervous system. Learn how gentle stimulation of Marma points on the head, feet, hands, and shoulders directly benefits internal organ health, resolves persistent somatic blocks, and triggers immediate endorphin release.",
      seoFocusWord: "acupressure therapy course",
      heroSubtitle: "Release locked energy nodes (Marma points) across your meridian lines. Pre-register for next month's batch today.",
      category: "Murm Dab Chikitsa",
      courseDuration: "5 Weeks (Fully Online Live Sessions)",
      studentCount: 194,
      lessons: 16,
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200",
      subH2: "What is Acupressure Therapy?",
      subP: "Acupressure is a timeless classical science centered on the body's primary Marma point networks. By gently stimulating nervous system nodes on your scalp, chest, spine, and feet, you can clear blood stagnation, balance meridian elements, and unlock immediate relief from muscular neck stiffness and systemic tension without pills or invasive methods.",
      benefits: [
        "Direct Organ Stimulation: Learn the 12 essential acupuncture codes to harmonize digestive heart pathways.",
        "Chronic Stress Defense: Stimulate the head and shoulder nodes to drop muscular stress blocks instantly.",
        "Nervous Cleanse: Integrate acupressure points with specific breath cycles to trigger endorphin releases."
      ],
      features: [
        "High-definition clinical Marma anatomical maps",
        "Home pressure-gauging protocols for safe practicing",
        "Vedic Marma to modern neuroscience integration worksheets",
        "Pre-registration Early Bird discount codes applied"
      ],
      modules: [
        { title: "Module 1: Sacred Meridian Geographies", desc: "Explore the ancient Marma point geography of Vedic sages and compare energy channels with modern connective tissue contours." },
        { title: "Module 2: Practical Touch & Point Activation", desc: "Unlock head and upper cranial acupressure for mental release, and relieve shoulder congestion safely at home." }
      ],
      isUpcoming: true,
      upcomingStartDate: "July 12, 2026"
    },
    "kids-eq": {
      title: "Mindfulness & EQ Training for Kids: Emotional & Mental Growth",
      description: "Designed specifically for parents eager to equip children aged 6-14 with emotional grounding techniques inspired by classical mindfulness. Uses interactive storytelling, dynamic breath-games, and simple creative activities to guide youngsters in expressing complex feelings calmly, reducing digital fatigue, and improving real-world focus.",
      seoFocusWord: "EQ training for kids",
      heroSubtitle: "Empower your child's emotional vocabulary, resilience, and attention. Pre-register today.",
      category: "Kids EQ",
      courseDuration: "4 Weeks (Fully Online Sessions)",
      studentCount: 305,
      lessons: 12,
      image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1200",
      subH2: "What is Mindfulness & EQ Training for Kids?",
      subP: "This course has been crafted to introduce children to mindfulness, self-recognition, and emotional intelligence in a playful, secular, and gentle way. Through somatic breath-games, storytelling, and family communication protocols, kids learn to understand complex emotional waves, improve classroom attention, and find focus away from bright digital screens.",
      benefits: [
        "Somatic Grounding: Kids learn straightforward breath tools to anchor focus when feeling overwhelmed.",
        "Vested Mental Resilience: Builds active, deep-reading attention span while lowering gadget dependencies.",
        "Empathetic Growth: Promotes cooperative and empathetic family dialogues at home."
      ],
      features: [
        "Downloadable emotion cards and custom sensory story sheets",
        "Parent-child connection handbook with modern child-psychology tracking",
        "Actionable 8-minute kid-centered focus and calm micro-sessions",
        "Digital badge and Certificate of Kids EQ Grounding"
      ],
      modules: [
        { title: "Module 1: Emotional Geographies for Kids", desc: "Learn to identify physical feelings of happiness, anxiety, and anger, and practice animal-inspired breathing games." },
        { title: "Module 2: Digital Decongestion & Focus", desc: "Practice five fun sensory checks to restore cognitive calm from tablet over-exposure and steady attention routines." }
      ],
      isUpcoming: true,
      upcomingStartDate: "August 5, 2026"
    }
  };

  const d = allGeneralDetails[courseId] || allGeneralDetails["mudra-therapy"];

  const courseFaqs = [
    { q: `Who is the ${d.category} course designed for?`, a: `This course is beginner-friendly and built for anyone wanting to integrate ancient Vedic knowledge into their busy modern routines safely.` },
    { q: "Are the study materials downloadable?", a: "Yes. All students receive high-definition worksheet downloads, practical manuals, and checklist files to follow along with ease." },
    { q: "Is a certificate provided on completion?", a: "Yes. Once you complete the self-paced lectures and standard review checklists, you are awarded an official Shivoham Shiv certificate." }
  ];

  return (
    <div className="bg-[#FAFBF7] min-h-screen font-sans selection:bg-green-105 selection:text-green-900 text-[#3A463F] text-left">
      <SEO 
        title={`${d.title} — Shivoham Shiv`}
        description={d.description}
        focusKeyword={d.seoFocusWord}
        isCourseDetail={true}
        courseData={{
          name: d.title,
          description: d.description,
          lessonsCount: d.lessons
        }}
        isBreadcrumb={true}
        breadcrumbItems={[
          { name: "Home", url: "/" },
          { name: "Courses", url: "/courses" },
          { name: d.category, url: `/courses/${slug}` }
        ]}
      />

      {/* Hero Banner */}
      <section className="bg-[#0F3320] text-cream py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-[#C96E29] relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F4D45] rounded-full text-[#FAFBF7] text-xs font-bold uppercase tracking-widest border border-green-800">
            <Sparkles className="w-3 text-[#C9A24B] fill-[#C9A24B]" />
            {d.isSelfPaced ? "Recorded Classes" : d.isUpcoming ? "Pre-register Batch" : "Authentic Vedic Path"}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white tracking-tight leading-tight">
            {d.title}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed font-light">
            {d.heroSubtitle}
          </p>
          <div className="pt-2">
            <button 
              onClick={() => handleScrollToSegment("evaluation-form")}
              className="px-8 py-4 bg-[#C96E29] hover:bg-[#B85F22] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            >
              Book a Session
            </button>
          </div>
        </div>
      </section>

      {/* Detail Block */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Image */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <img 
                src={d.image} 
                alt={d.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {d.isUpcoming && (
              <div className="absolute top-4 left-4 bg-amber-500 text-[#FAFBF7] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-xl shadow-md">
                Starts: {d.upcomingStartDate}
              </div>
            )}
          </div>

          {/* Text Description */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Core Insights</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45] leading-tight">
              {d.subH2}
            </h2>
            <p className="text-sm leading-relaxed text-[#3A463F]/90">
              {d.subP}
            </p>
          </div>

        </div>
      </section>

      {/* Benefits Block */}
      <section className="bg-[#FAF5EC] py-20 px-4 sm:px-6 lg:px-8 border-y border-green-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Real Wellness Advantages</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45]">
              Course Benefits & Somatic Outcomes
            </h2>
            <p className="text-xs text-[#3A463F]/80 leading-relaxed font-semibold max-w-md mx-auto">
              Our ancient therapies create measurable physiological enhancements when practiced consistently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {d.benefits.map((b, idx) => {
              const [bTitle, bDesc] = b.split(":");
              return (
                <div key={idx} className="bg-white border border-green-100 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <div className="w-8 h-8 rounded-full bg-[#1F4D45] text-cream flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <h3 className="font-heading font-bold text-base text-[#1F4D45]">{bTitle}</h3>
                    <p className="text-xs leading-relaxed text-[#3A463F]/85">{bDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Program Features / Checklist Column split */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Authentic Systems</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#1F4D45]">
              Why Learn With Shivoham Shiv?
            </h2>
            <p className="text-sm leading-relaxed text-[#3A463F]/90">
              We focus on 100% online courses to bring genuine Vedic, Mudra, and mindfulness healing systems directly to deep seekers worldwide. Every curriculum is supervised under chief counselor Pooja Chaturvedi.
            </p>
            <div className="space-y-3 pt-2">
              {d.features.map((feat, i) => (
                <div key={i} className="flex items-start space-x-2.5 text-xs text-[#3A463F]/90">
                  <CheckCircle2 className="w-4 h-4 text-green-750 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus modules */}
          <div className="lg:col-span-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-green-100 shadow-xl space-y-4">
              <h3 className="font-heading font-extrabold text-[#1F4D45] text-base border-b border-green-50 pb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C96E29]" />
                Curriculum Syllabus
              </h3>
              <div className="space-y-4">
                {d.modules.map((m, i) => (
                  <div key={i} className="p-4 bg-[#FAFBF7] border border-green-50 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#C96E29]">Module {i+1}</span>
                    <h4 className="font-heading font-bold font-sm text-[#1F4D45] leading-tight">{m.title}</h4>
                    <p className="text-xs text-[#3A463F]/80 leading-relaxed mt-1">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#FAF5EC]/30 border-t border-green-100 text-left">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C96E29]">Queries & Answers</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1F4D45]">Frequently Asked Course Queriess</h2>
          </div>
          
          <div className="space-y-4">
            {courseFaqs.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div key={idx} className="bg-white border border-green-100 rounded-2xl overflow-hidden shadow-xs">
                  <button 
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-semibold text-[#1F4D45] flex justify-between items-center bg-white cursor-pointer hover:bg-[#FAFBF7] transition-all"
                  >
                    <span className="font-heading text-sm text-[#1F4D45]">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-green-700 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-green-50 text-xs text-[#3A463F]/85 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="evaluation-form" className="bg-[#EFFFDF]/40 py-20 px-4 sm:px-6 lg:px-8 border-t border-green-100 text-left">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-green-105 shadow-xl max-w-2xl mx-auto">
            <div className="text-center mb-8 space-y-2">
              <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#C96E29]">Course Admission Evaluation</span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#1F4D45]">
                Plan Your Natural Transformation Path
              </h3>
              <p className="text-xs sm:text-sm text-[#3A463F]/85 leading-relaxed">
                Connect with our certified counseling team to organize your course pathway and verify details. Securely saved in the client mock repository database.
              </p>
            </div>

            {isSuccess ? (
              <div className="p-8 bg-[#E3F1E3] border border-green-200 text-[#1F4D45] rounded-2xl text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-green-700 mx-auto animate-pulse" />
                <h4 className="font-bold text-base">Pranama, evaluation information recorded!</h4>
                <p className="text-xs leading-relaxed max-w-md mx-auto text-slate-705">
                  Your details have been locked into the local dashboard. Conversing direct on WhatsApp with Pooja's certified team is now opening in a new tab!
                </p>
                <a 
                  href="https://wa.me/917317778215" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-7 py-3 bg-[#1F4D45] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-101 shrink-0"
                >
                  Converse on WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-medium">
                {formError && (
                  <div className="p-3 bg-red-50 text-red-900 border border-red-100 rounded-lg text-left font-bold text-[11px]">
                    ⚠ {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5" htmlFor="gen-fullname">
                      Full Name *
                    </label>
                    <input 
                      id="gen-fullname"
                      type="text"
                      required
                      placeholder="e.g. Aditi Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5" htmlFor="gen-email">
                      Email Address *
                    </label>
                    <input 
                      id="gen-email"
                      type="email"
                      required
                      placeholder="aditi@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5" htmlFor="gen-whatsapp">
                    WhatsApp Contact Number *
                  </label>
                  <input 
                    id="gen-whatsapp"
                    type="tel"
                    required
                    placeholder="e.g. +91 73177 78215"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5" htmlFor="gen-note">
                    Your Current Symptoms, Health Goals or Questions
                  </label>
                  <textarea 
                    id="gen-note"
                    rows={3}
                    placeholder="e.g. I experience severe day fatigue or want child focus activities..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-green-150 focus:ring-1 focus:ring-green-500 bg-[#FAFBF7] text-[#3A463F] focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#C96E29] hover:bg-[#B85F22] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-101 cursor-pointer mt-2"
                >
                  {isSubmitting ? "Submitting Request..." : "Pre-Register / Book Evaluation Session"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
