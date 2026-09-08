import React, { useState } from "react";
import { motion } from "motion/react";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Award,
  ChevronDown,
  Star,
} from "lucide-react";
import SEO from "../components/SEO";
import { getAttribution } from "../utils/attribution";

const SLOTS = ["Morning (10 AM – 12 PM)", "Afternoon (1 – 4 PM)", "Evening (5 – 8 PM)"];

const COURSE_FORMAT: [string, string][] = [
  ["Duration", "6 Months"],
  ["Mode", "Online"],
  ["Live Classes", "4 Classes Every Week"],
  ["Recorded Classes", "Included for Revision"],
  ["Study Material", "Included"],
  ["Practical Training", "Included"],
  ["Learning Format", "Live + Recorded + Guided Practical Learning"],
];

const OUTCOMES = [
  "Correct anatomical location of Marma points",
  "How to locate points through palpation (hands-on finding)",
  "Proper pressure application techniques",
  "Duration and frequency of practice",
  "The traditional Ayurvedic framework for Marma therapy",
  "Doshas (constitution types) and point selection",
  "Marma practices for different wellness goals",
  "How to assess which points suit which client",
  "When Marma is appropriate vs. when to refer",
  "How to build personalized wellness plans",
  "Communication skills for working with clients",
  "Safety precautions and contraindications",
  "Professional documentation and record-keeping",
  "Ethical scope of practice as a wellness practitioner",
];

const MODULES = [
  {
    n: "Module 1",
    title: "Foundations of Ayurveda & Marma Therapy",
    topics: [
      "Introduction to Ayurvedic wellness philosophy",
      "History and traditional use of Marma therapy",
      "What Marma points are and why they matter",
      "Energetic anatomy: channels, flow and vital points",
      "Introduction to the three Doshas (Vata, Pitta, Kapha)",
      "Safety foundations and scope-of-practice introduction",
    ],
  },
  {
    n: "Module 2",
    title: "Anatomical Foundations & Point Location",
    topics: [
      "Anatomical review of the human body",
      "Primary Marma points — location and function",
      "Using anatomical landmarks to locate points",
      "Palpation techniques — finding points by touch",
      "Common mistakes in point location and how to correct them",
      "Hands-on practice locating major Marma points",
    ],
  },
  {
    n: "Module 3",
    title: "Pressure Application & Practice Protocols",
    topics: [
      "Pressure techniques: how much, how long, how often",
      "Circular, sustained and pulsing pressure",
      "Hand positioning for safety and comfort",
      "Warm-up and preparation",
      "Adapting technique for different body types and ages",
      "Practice protocols and self-practice techniques",
    ],
  },
  {
    n: "Module 4",
    title: "Doshas, Wellness Goals & Point Selection",
    topics: [
      "Vata, Pitta and Kapha characteristics",
      "How imbalances can show up in the body",
      "Point selection based on Dosha type",
      "Supportive routines for stress, sleep, digestion, low energy and everyday tension",
      "Combining points thoughtfully",
      "Building personalized wellness plans",
    ],
  },
  {
    n: "Module 5",
    title: "Advanced Applications & Chronic-Wellness Support",
    topics: [
      "Advanced Marma combinations for complex situations",
      "Working with clients who have long-standing concerns",
      "Understanding when Marma supports vs. when medical referral is needed",
      "Documentation and tracking",
      "Managing client expectations ethically",
      "Recognizing red flags and when NOT to treat",
    ],
  },
  {
    n: "Module 6",
    title: "Professional Practice & Ethics",
    topics: [
      "Professional scope of practice and boundaries",
      "When to refer to medical doctors",
      "Ethical decision-making, consent and confidentiality",
      "Professional documentation",
      "Building a sustainable, responsible practice",
      "Continuing education and professional development",
    ],
  },
];

const WHO_CAN_JOIN = [
  "Complete beginners who want to learn Marma therapy properly",
  "Yoga teachers & instructors",
  "Ayurveda enthusiasts & students",
  "Acupressure practitioners",
  "Wellness & health coaches",
  "Massage therapists & bodyworkers",
  "Healthcare professionals exploring complementary wellness",
  "Corporate wellness trainers",
  "Holistic wellness practitioners",
  "Homemakers & personal-wellness enthusiasts",
  "Aspiring wellness entrepreneurs",
];

const WHY_CHOOSE = [
  { t: "Structured Learning", d: "Traditional knowledge organized into a clear 6-month path — not disconnected videos." },
  { t: "Live Expert Instruction", d: "3 guided classes every week with real-time feedback from your mentor." },
  { t: "Recorded Sessions", d: "Revisit lessons and refine your technique at your own pace." },
  { t: "Comprehensive Study Material", d: "Anatomical guides, point maps, practice protocols and documentation templates." },
  { t: "Practical Hands-On Training", d: "Learn correct palpation and pressure application through guided practice." },
  { t: "Beginner-Friendly", d: "No previous Ayurvedic or medical knowledge required; concepts build progressively." },
  { t: "Traditional & Modern Integration", d: "Traditional Marma wisdom within a modern understanding of anatomy and safety." },
  { t: "Responsible Practitioner Education", d: "Understand scope of practice and when to refer clients to medical professionals." },
  { t: "Live Community & Support", d: "Learn alongside other wellness seekers with peer support and accountability." },
  { t: "Recognized Certification", d: "A Practitioner Certification you can list in your professional credentials." },
];

const TESTIMONIALS = [
  {
    quote:
      "I came to this course with zero Ayurvedic background, just curious about wellness. The way it's taught makes everything clear — not just where a point is, but why it matters, when to use it, and how to adapt for different clients. After 3 months I felt confident enough to start offering Marma sessions.",
    name: "Rajesh Kumar",
    bg: "Former IT Professional, now Wellness Practitioner",
  },
  {
    quote:
      "As a yoga teacher I wanted to deepen what I could offer students. The live classes were game-changers — seeing the demonstrations and getting real-time feedback on my finger positioning made all the difference. I'm now incorporating Marma into my private yoga sessions.",
    name: "Priya Sharma",
    bg: "Certified Yoga Teacher (8 years)",
  },
  {
    quote:
      "I was skeptical about online training for something hands-on. But the hybrid approach — live classes for technique feedback + recorded videos for practice + study materials — works better than I expected. The ethics module was crucial; now I know my scope of practice and when to refer.",
    name: "Dr. Ananya Desai",
    bg: "Physiotherapist",
  },
];

const GLANCE: [string, string][] = [
  ["Course Name", "Ayurvedic Acupressure & Marma Certification"],
  ["Duration", "6 Months (24 weeks)"],
  ["Mode", "Online"],
  ["Live Classes", "4 per week"],
  ["Class Duration", "90 minutes each"],
  ["Recorded Classes", "Yes — all sessions recorded"],
  ["Study Material", "Yes — comprehensive, included"],
  ["Practical Training", "Yes — hands-on guided practice"],
  ["Certification", "Practitioner Certification (on completion)"],
  ["Experience Required", "No — beginners welcome"],
  ["Prerequisites", "None — just curiosity and commitment"],
  ["Batch Size", "Max 15–20 students (intimate learning)"],
  ["Lifetime Access", "Yes — revisit materials anytime"],
];

const FAQS = [
  { q: "Do I need previous Ayurvedic knowledge to join?", a: "No. The course is designed for complete beginners. We start with Ayurvedic foundations and build systematically. If you're already familiar with Ayurveda, you'll deepen that knowledge and add practical Marma skills." },
  { q: "How much time should I dedicate per week?", a: "Around 12–18 hours a week is recommended — roughly 6 hours for the 4 live classes, plus review, practice and study material. This gives you enough time to learn and practise properly." },
  { q: "Can I practise professionally after completing the course?", a: "The certification qualifies you to offer Marma therapy as a supportive wellness practice within your scope. It does not qualify you to diagnose medical conditions or replace medical treatment. The ethics module covers scope of practice in detail." },
  { q: "What if I miss a live class?", a: "All live classes are recorded and available for review, so you can watch at your own pace. We still recommend attending live when possible for real-time feedback on your technique." },
  { q: "Is this certification recognised?", a: "It is a recognised professional wellness credential you can list on your profiles, website and business cards. It is not a medical licence, which would require separate regulatory approval." },
  { q: "Can I teach others after becoming certified?", a: "You can teach basic Marma concepts and techniques with appropriate disclosures. Training people to become professional practitioners requires a separate advanced instructor certification." },
];

const COVERS = [
  { t: "Ayurvedic Acupressure", d: "Traditional pressure-point therapy and how to identify Marma points on the body for practical application." },
  { t: "Marma Techniques", d: "The science of Marma therapy — traditional Indian pressure points used for centuries to support balance and wellbeing." },
  { t: "Tongue, Face & Nail Observation", d: "Traditional Ayurvedic observation techniques — tongue, facial and nail assessment — to understand a client's wellness patterns." },
  { t: "Structured Case Assessment", d: "A systematic approach to case-taking, documentation and building individualized wellness plans." },
  { t: "Practitioner Certification", d: "Complete the full course and receive your Ayurvedic Acupressure & Marma Practitioner Certification." },
  { t: "Support for Chronic Concerns", d: "How Marma and acupressure may support clients managing everyday pain, stress, digestion and lifestyle-related concerns." },
  { t: "Responsibility & Scope of Practice", d: "Professional boundaries, when to refer clients to medical professionals, and how to practise ethically." },
];

const LEARN_METHODS = [
  { t: "Live Online Classes", d: "3 guided sessions every week with real-time instruction." },
  { t: "Recorded Sessions", d: "Revisit and practise lessons at your own pace." },
  { t: "Structured Study Material", d: "Detailed anatomical guides, point maps and practice protocols." },
  { t: "Practical Hands-On Training", d: "Learn palpation (finding points) and pressure techniques." },
  { t: "Guided Learning", d: "Direct feedback from certified instructors on your technique." },
];

const TIMELINE = [
  "Understand the Ayurvedic and anatomical foundations",
  "Learn concepts progressively from basic to advanced",
  "Practise locating Marma points until confident",
  "Correct technique mistakes with live instructor feedback",
  "Attend live doubt-clearing and Q&A sessions",
  "Revise recorded lessons to deepen understanding",
  "Use structured study material for self-paced learning",
  "Understand practical application in real scenarios",
  "Build confidence gradually through guided practice",
  "Learn professional and ethical boundaries",
];

const LIVE_BENEFITS = [
  "Learn the correct anatomical location of Marma points",
  "Watch live demonstrations of palpation techniques",
  "Ask questions and get immediate answers",
  "Practise under guidance and receive real-time feedback",
  "Improve your technique through expert observation",
  "Understand traditional applications in context",
  "Learn practical solutions for common mistakes",
  "Discuss how to handle complex client scenarios",
  "Build confidence through supportive group learning",
  "Develop professional communication skills",
];

export default function CertificationView() {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", date: "", slot: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.email.trim() || !form.whatsapp.trim()) {
      setError("Please fill in your name, email and WhatsApp number.");
      return;
    }
    setSubmitting(true);
    const details = [
      form.date && `Preferred date: ${form.date}`,
      form.slot && `Slot: ${form.slot}`,
      "Ayurvedic Acupressure & Marma Certification — consultation",
    ].filter(Boolean).join(" | ");
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.whatsapp,
        email: form.email,
        product: "Ayurvedic Acupressure & Marma Certification",
        message: details,
      }),
    }).catch(() => {});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          whatsapp: form.whatsapp,
          message: details,
          source: "Ayurvedic Acupressure & Marma Certification",
          attribution: getAttribution(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not book. Please try again.");
      (window as any).fbq?.("track", "Lead", { content_name: "marma-certification" });
      (window as any).gtag?.("event", "generate_lead", { event_label: "marma-certification" });
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldCls = "w-full bg-transparent text-white placeholder-white/50 text-base focus:outline-none";
  const cardCls = "flex items-center gap-3 rounded-2xl border border-white/25 bg-white/[0.04] px-5 py-4";
  const inputCls = "w-full rounded-2xl border border-white/25 bg-white/[0.04] px-5 py-4 text-white placeholder-white/50 text-base focus:outline-none focus:border-[#E8C24A]/60 transition";
  const goldLabel = "text-xs uppercase font-bold tracking-widest text-[#E8C24A]";

  const scrollToBook = () => document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="bg-[#0F2A1E] font-sans text-white">
      <SEO
        title="Ayurvedic Acupressure & Marma Certification — Shivoham Shiv"
        description="A 6-month online Ayurvedic Acupressure & Marma certification — live classes, recorded sessions, practical training and a practitioner certification. Beginners welcome. Book a free consultation."
        focusKeyword="ayurvedic acupressure marma certification"
      />

      {/* AUDIENCE BAR */}
      <div className="bg-[#6E1B12] text-center px-4 py-3">
        <p className="text-sm sm:text-base font-bold text-white leading-snug max-w-4xl mx-auto">
          For beginners &amp; wellness professionals · Yoga teachers · Ayurveda enthusiasts · Acupressure &amp; holistic practitioners
        </p>
      </div>

      {/* HERO */}
      <section className="px-4 sm:px-6 py-12 sm:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* LEFT: text */}
            <div className="text-left">
              <span className={goldLabel}>Learn Online</span>
              <h1 className="font-heading font-bold text-3xl sm:text-5xl leading-tight text-white mt-2">
                Master Ayurvedic Diagnosis &amp; <span className="text-[#E8C24A]">Marma Therapy</span>
              </h1>
              <p className="text-sm sm:text-lg text-green-50/80 leading-relaxed mt-5">
                Master Ayurvedic diagnosis, Marma therapy, acupressure and colour therapy under expert guidance. This
                6-month online certification helps you understand how traditional Ayurvedic principles, Marma point
                therapy and acupressure are used to support wellness and everyday health concerns.
              </p>
              <p className="text-sm text-green-50/70 leading-relaxed mt-3">
                Whether you want to grow your own wellness knowledge, support your family, deepen your Yoga or
                Meditation practice, or develop complementary professional skills, this course gives you a structured
                path from beginner understanding to practical application.
              </p>

              {/* Course Format box */}
              <div className="mt-6 rounded-3xl border border-white/15 bg-white/[0.04] p-6">
                <h2 className="font-heading font-bold text-lg text-white mb-4">Course Format</h2>
                <dl className="space-y-2.5">
                  {COURSE_FORMAT.map(([k, v]) => (
                    <div key={k} className="flex flex-wrap items-baseline gap-x-2 border-b border-white/10 pb-2 last:border-0 last:pb-0">
                      <dt className="text-sm font-bold text-[#E8C24A] sm:min-w-[150px]">{k}:</dt>
                      <dd className="text-sm text-green-50/90">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-[11px] text-green-100/60 mt-4">6 Months | Online Live Classes | 4 Classes/Week | Recorded Sessions | Study Material Included</p>
                <button onClick={scrollToBook} className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-b from-[#C0432F] to-[#9E3222] hover:from-[#CE4C36] hover:to-[#8E2C1E] text-white font-bold text-sm tracking-wide shadow-lg transition-all">
                  Join the Ayurvedic Certification Course <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RIGHT: instructor + booking */}
            <div className="text-center">
              <div className="rounded-3xl overflow-hidden ring-1 ring-white/15 shadow-2xl">
                <img src="/founder.jpg" alt="Pooja Chaturvedi — Founder, Shivoham Shiv" className="w-full aspect-[16/12] object-cover" />
              </div>
              <p className="font-heading font-bold text-2xl text-white mt-4">Pooja Chaturvedi</p>
              <p className="text-[#E8C24A] font-semibold text-sm">Founder &amp; Lead Instructor · Shivoham Shiv</p>

              {/* Booking card */}
              <div id="book" className="mt-6 text-left scroll-mt-24">
                {done ? (
                  <div className="rounded-3xl border border-white/15 bg-white/[0.04] p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#E8C24A]/20 text-[#E8C24A] flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="font-heading font-bold text-2xl text-white mb-2">You're booked! 🎉</h2>
                    <p className="text-sm text-green-50/80 leading-relaxed max-w-md mx-auto">
                      We've received your request. Our team will confirm your slot on WhatsApp / email shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-3.5">
                    <label className={cardCls}>
                      <CalendarDays className="w-5 h-5 text-[#E8C24A] shrink-0" />
                      <span className="flex-1">
                        <span className="block text-[11px] uppercase tracking-wider text-white/50 font-bold">Pick your date</span>
                        <input type="date" className={fieldCls} value={form.date} onChange={set("date")} />
                      </span>
                    </label>
                    <label className={cardCls}>
                      <Clock className="w-5 h-5 text-[#E8C24A] shrink-0" />
                      <span className="flex-1">
                        <span className="block text-[11px] uppercase tracking-wider text-white/50 font-bold">Time slot</span>
                        <select className={`${fieldCls} [&>option]:text-slate-800`} value={form.slot} onChange={set("slot")}>
                          <option value="">Choose a slot…</option>
                          {SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </span>
                    </label>
                    <input className={inputCls} value={form.name} onChange={set("name")} placeholder="Your name *" />
                    <input className={inputCls} type="email" value={form.email} onChange={set("email")} placeholder="Email *" />
                    <input className={inputCls} value={form.whatsapp} onChange={set("whatsapp")} placeholder="WhatsApp *" />
                    <div className="text-center pt-1">
                      <p className="font-heading font-bold text-base text-white">Book a Free Consultation</p>
                      <p className="text-xs"><span className="text-[#E27C58] font-bold">Limited batch</span> <span className="text-green-50/80">· intimate group learning</span></p>
                    </div>
                    {error && <p className="text-sm text-red-300 text-center">{error}</p>}
                    <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#E8C24A] hover:bg-[#f0cf63] text-[#0F2A1E] font-bold text-base tracking-wide shadow-lg transition-all disabled:opacity-70">
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                      {submitting ? "Booking…" : "Book Now"} {!submitting && <ArrowRight className="w-5 h-5" />}
                    </button>
                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] text-green-100/60 pt-1">
                      <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> No obligation</span>
                      <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Certified mentor</span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* WHAT THIS COURSE COVERS */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className={goldLabel}>What You'll Work With</span>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white mt-1">What This Course Covers</h2>
          <p className="text-sm text-green-50/70 leading-relaxed mt-2">
            From locating Marma points to responsible, client-centred practice — here's what you'll learn to do.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {COVERS.map((c) => (
            <div key={c.t} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-heading font-bold text-base text-[#E8C24A] mb-1.5">{c.t}</h3>
              <p className="text-sm text-green-50/75 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT IS */}
      <section className="bg-[#002A2E] py-16 px-4 sm:px-6 border-y border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <span className={goldLabel}>The Practice</span>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white mt-1">What Is Marma Therapy &amp; Ayurvedic Acupressure?</h2>
          <p className="text-sm text-green-50/80 leading-relaxed mt-4">
            Marma therapy is a traditional wellness practice based on specific pressure points used within Ayurveda,
            Yoga and Indian wellness traditions. The Sanskrit word "Marma" refers to vital points on the body where
            several channels of energy meet. Ayurvedic acupressure applies pressure to these points using the hands,
            thumbs and fingers — making it accessible and practical for wellness practitioners of all backgrounds.
          </p>
          <p className="text-[11px] text-green-100/60 leading-relaxed mt-5 max-w-2xl mx-auto">
            These are traditional wellness practices taught for education and complementary support. They do not
            diagnose, treat or cure any medical condition and are not a substitute for professional medical care.
          </p>
        </div>
      </section>

      {/* WHY STRUCTURED + OUTCOMES */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className={goldLabel}>Why a Structured Course</span>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white mt-1">Knowing where a point is isn't enough</h2>
          <p className="text-sm text-green-50/70 leading-relaxed mt-2">
            A structured course teaches the complete picture — not just where points are, but when to use them, for
            whom, and with what precautions. Here's what you'll learn:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OUTCOMES.map((o) => (
            <div key={o} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-[#E8C24A] shrink-0 mt-0.5" />
              <span className="text-sm text-green-50/90">{o}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="bg-[#002A2E] py-16 px-4 sm:px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={goldLabel}>Curriculum</span>
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white mt-1">What You Will Learn — 6 Modules</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MODULES.map((m) => (
              <div key={m.n} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8C24A]">{m.n}</span>
                <h3 className="font-heading font-bold text-lg text-white mt-1 mb-3">{m.title}</h3>
                <ul className="space-y-2">
                  {m.topics.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-green-50/80"><span className="text-[#E8C24A] mt-0.5">•</span> {t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW YOU'LL LEARN */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className={goldLabel}>How You'll Learn</span>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white mt-1">Learn Live From Anywhere</h2>
          <p className="text-sm text-green-50/70 leading-relaxed mt-2">
            This isn't a self-paced video course you watch alone. You learn through a combination of interactive,
            structured methods:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LEARN_METHODS.map((m, i) => (
            <div key={m.t} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <span className="font-heading text-xl font-extrabold text-[#E8C24A]">{i + 1}</span>
              <h3 className="font-heading font-bold text-base text-white mt-1 mb-1.5">{m.t}</h3>
              <p className="text-sm text-green-50/70 leading-relaxed">{m.d}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-green-50/75 leading-relaxed mt-8 max-w-3xl mx-auto text-center">
          This hybrid approach gives you live expert guidance — crucial for learning proper hand position, pressure
          and safety — combined with the flexibility to revise and practise on your own schedule.
        </p>
      </section>

      {/* 3 MONTHS STRUCTURED */}
      <section className="bg-[#002A2E] py-16 px-4 sm:px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className={goldLabel}>6 Months · Structured</span>
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white mt-1">Building Competence, Not Just Completion</h2>
            <p className="text-sm text-green-50/70 leading-relaxed mt-2">
              Marma therapy shouldn't be learned by memorizing a chart of point locations. Six months gives you time to:
            </p>
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TIMELINE.map((s, i) => (
              <li key={s} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="font-heading font-bold text-[#E8C24A] shrink-0">{i + 1}.</span>
                <span className="text-sm text-green-50/85">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3 LIVE CLASSES */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className={goldLabel}>Live Guidance</span>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white mt-1">4 Live Classes Every Week</h2>
          <p className="text-sm text-green-50/70 leading-relaxed mt-2">
            Attend four live online classes every week with real-time guidance from your instructor.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LIVE_BENEFITS.map((b) => (
            <div key={b} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-[#E8C24A] shrink-0 mt-0.5" />
              <span className="text-sm text-green-50/90">{b}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-green-50/75 leading-relaxed mt-8 max-w-3xl mx-auto text-center">
          Live guidance matters for Marma training because small differences in hand position and pressure affect
          safety and comfort. Real-time feedback helps you correct positioning and build proper technique from the start.
        </p>
      </section>

      {/* WHO CAN JOIN */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className={goldLabel}>Who Can Join</span>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white mt-1">Beginners &amp; Wellness Professionals</h2>
          <p className="text-sm text-green-50/70 mt-2">No previous Marma, Ayurvedic or medical training is required.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {WHO_CAN_JOIN.map((w) => (
            <div key={w} className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-green-50/90">
              <CheckCircle2 className="w-4 h-4 text-[#E8C24A] shrink-0 mt-0.5" /> {w}
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="bg-[#002A2E] py-16 px-4 sm:px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={goldLabel}>Why Shivoham Shiv</span>
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white mt-1">Why Choose Shivoham Shiv for Marma Training?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_CHOOSE.map((r) => (
              <div key={r.t} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="font-heading font-bold text-base text-white mb-1.5">{r.t}</h3>
                <p className="text-sm text-green-50/70 leading-relaxed">{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUCTOR */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-8 items-center">
          <div className="rounded-2xl overflow-hidden ring-1 ring-white/15">
            <img src="/founder.jpg" alt="Pooja Chaturvedi" className="w-full aspect-square object-cover" />
          </div>
          <div>
            <span className={goldLabel}>Your Instructor</span>
            <h2 className="font-heading font-bold text-2xl text-white mt-1">Pooja Chaturvedi</h2>
            <p className="text-[#E8C24A] font-semibold text-sm mb-3">Founder · Shivoham Shiv</p>
            <ul className="space-y-1.5 mb-4">
              {["Yoga Alliance USA — RYS-200", "Certified in Acupressure, Panchakarma & Reiki", "7+ years of teaching & practice", "Trains wellness practitioners in traditional Indian wellness"].map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-green-50/85"><CheckCircle2 className="w-4 h-4 text-[#E8C24A] shrink-0 mt-0.5" /> {c}</li>
              ))}
            </ul>
            <p className="text-sm text-green-50/75 leading-relaxed">
              Pooja teaches Marma and acupressure by combining traditional Ayurvedic knowledge with a modern
              understanding of anatomy, safety and responsible practice — so you learn technique, application and
              ethics together.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#002A2E] py-16 px-4 sm:px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white text-center mb-10">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 flex flex-col">
                <div className="flex gap-0.5 text-[#E8C24A] mb-3">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="w-4 h-4 fill-[#E8C24A]" />)}</div>
                <p className="text-sm text-green-50/85 leading-relaxed flex-grow">"{t.quote}"</p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="font-heading font-bold text-sm text-white">{t.name}</p>
                  <p className="text-xs text-green-50/60">{t.bg}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-green-100/50 mt-6">Individual experiences shared by our students; results vary from person to person.</p>
        </div>
      </section>

      {/* COURSE AT A GLANCE */}
      <section className="py-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white text-center mb-8">Course at a Glance</h2>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">
          {GLANCE.map(([k, v], i) => (
            <div key={k} className={`flex flex-wrap gap-x-3 px-5 py-3.5 ${i % 2 ? "bg-white/[0.02]" : ""}`}>
              <span className="text-sm font-bold text-[#E8C24A] sm:min-w-[190px]">{k}</span>
              <span className="text-sm text-green-50/85">{v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
                <span className="text-sm font-bold text-white">{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-white/40 shrink-0 transition-transform ${faqOpen === i ? "rotate-180" : ""}`} />
              </button>
              {faqOpen === i && <p className="px-5 pb-4 text-sm text-green-50/75 leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pb-20 px-4 sm:px-6 text-center">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-2">Your Opportunity to Master Marma Therapy From a Certified Expert</h2>
        <p className="text-sm text-green-50/70 mb-6 max-w-lg mx-auto">A structured pathway from curious beginner to confident, responsible practitioner. Enrollment is limited to a small group per batch to keep learning personal — book a free consultation to find your place.</p>
        <button onClick={scrollToBook} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#E8C24A] hover:bg-[#f0cf63] text-[#0F2A1E] font-bold text-base tracking-wide shadow-lg transition-all">
          Book a Free Consultation <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
}
