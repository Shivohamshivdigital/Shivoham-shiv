import React from "react";
import { Link } from "react-router-dom";
import { Award, GraduationCap, Sparkles, Heart, CheckCircle2, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import Testimonials from "../components/Testimonials";

const BELIEFS = [
  "Ancient wisdom should be respected, structured, tested and taught with professional rigour — not diluted by commercialization or mysticism.",
  "Drugless, Vedic-based approaches to wellness can work alongside — not against — modern healthcare.",
];

const PILLARS = [
  { icon: "🌿", t: "Natural, Drug-Free Wellness", d: "Support the body's own capacity for balance through traditional, drug-free practices — as a complement to, not a replacement for, medical care." },
  { icon: "🖐️", t: "Mudra for Everyday Support", d: "Teach simple Mudra and breathing practices used to support calm, focus and everyday relief — and to recognise when professional medical help is needed." },
  { icon: "🎯", t: "Ayurvedic Acupressure for Ongoing Wellbeing", d: "Use gentle Marma and acupressure practices to support the body through long-standing, lifestyle-related concerns, within a responsible scope of practice." },
  { icon: "🧘", t: "Holistic Mind-Body Balance", d: "Integrate guided Meditation and Pranayama to help ease stress, restore emotional harmony and sustain everyday vitality." },
  { icon: "🎓", t: "Educate & Empower", d: "Bridge scriptural heritage with a modern understanding of anatomy and safety, certifying confident, responsible practitioners." },
];

const SERVE = [
  { e: "👨‍👩‍👧", t: "Individuals & Families", d: "Build practical wellness habits together." },
  { e: "🧒", t: "Children", d: "Develop mindfulness, focus and healthy routines." },
  { e: "💼", t: "Working Professionals", d: "Bring movement, mindfulness and stress-management into busy lifestyles." },
  { e: "🏢", t: "Organizations", d: "Create structured wellness initiatives for employees and teams." },
  { e: "🧘", t: "Wellness Enthusiasts", d: "Explore traditional Indian wellness practices more deeply." },
  { e: "🎓", t: "Aspiring Practitioners", d: "Develop professional knowledge through specialized Academy programs." },
  { e: "🏥", t: "Healthcare Professionals", d: "Integrate complementary wellness approaches within your clinical scope." },
  { e: "🌍", t: "Global Community", d: "Learn and practise from anywhere in the world." },
];

const PHILOSOPHY = [
  { t: "Traditional Wisdom Without Mysticism", d: "We respect Vedic sciences for their knowledge, but we teach them clearly, structured and responsibly — not through vagueness or spiritual bypassing." },
  { t: "Accessible, Not Exclusive", d: "Ancient knowledge shouldn't be gatekept. We make it available to anyone willing to learn and practise." },
  { t: "Professional, Not Dogmatic", d: "We don't claim every ancient text is literally true. We test, we validate, we update — with a modern understanding of safety." },
  { t: "Complementary, Not a Replacement", d: "Our practices support wellbeing and work alongside healthcare — they don't replace medical diagnosis, emergency care or treatment by qualified professionals." },
  { t: "Empowerment Through Education", d: "We don't create dependency on our services. We teach people to practise independently and confidently." },
  { t: "Responsible, Not Greedy", d: "We charge fairly, but wellness should never be commodified so heavily that people are excluded." },
];

const STEPS = [
  { n: "01", t: "Choose Your Goal", d: "Decide whether you want personal wellness or professional learning." },
  { n: "02", t: "Choose Your Program", d: "Select the wellness program or Academy course that matches your needs." },
  { n: "03", t: "Learn With Guidance", d: "Participate in structured online learning and guided sessions." },
  { n: "04", t: "Practice", d: "Apply what you learn through regular practice." },
  { n: "05", t: "Grow", d: "Continue through advanced learning, certification and professional development." },
];

const IMPACT = [
  "People who became independent practitioners",
  "Families who built healthier routines together",
  "Organizations that created wellness cultures",
  "Individuals who built healthier everyday habits",
  "Practitioners who developed ethical, responsible practices",
  "Communities reconnecting with traditional wellness heritage",
];

const WHY = [
  { t: "Traditional Knowledge", d: "Practices rooted in India's rich wellness and knowledge traditions." },
  { t: "Structured Education", d: "Clearly designed programs rather than disconnected information." },
  { t: "Practical Learning", d: "Move beyond theory and develop practical understanding through guided learning." },
  { t: "Professional Development", d: "Build knowledge through progressive courses and certification pathways." },
  { t: "Guided Mentorship", d: "Learn with support from experienced wellness educators and practitioners." },
  { t: "Global Accessibility", d: "Learn from anywhere in the world through online education." },
  { t: "Responsible Practice", d: "We emphasise knowing when to support and when to refer." },
  { t: "Growing Community", d: "Join a growing community of wellness learners and practitioners worldwide." },
];

const VALUES = [
  { t: "Integrity", d: "We don't make unrealistic medical claims. We don't overpromise. We don't exploit fear or desperation." },
  { t: "Excellence", d: "We train professionals, not salespeople. Our educators have real expertise and an ongoing learning commitment." },
  { t: "Accessibility", d: "Wealth shouldn't determine who gets wellness education. We strive to keep learning affordable." },
  { t: "Respect for Science & Tradition", d: "We honour both Vedic wisdom and a modern understanding of safety — they inform each other." },
  { t: "Empowerment", d: "We teach independence, not dependency — putting health decisions back in people's hands." },
  { t: "Responsibility", d: "We acknowledge limits, refer appropriately and maintain ethical boundaries." },
];

const PROGRESSION = ["Learn", "Practice", "Apply", "Get Certified", "Grow"];

const GLOBAL = [
  "Yoga teachers adding Mudra and Acupressure skills",
  "Healthcare professionals exploring complementary approaches",
  "Wellness enthusiasts deepening their practice",
  "Corporate trainers bringing wellness to organizations",
  "Families building health together",
  "Aspiring practitioners starting their professional journeys",
];

const FAQS = [
  { q: "Is Shivoham Shiv affiliated with any medical organization?", a: "Shivoham Shiv is a wellness and education platform. We work in the complementary-wellness space, not clinical medicine. Our focus is education and responsible professional-practice development." },
  { q: "Are your programs scientifically validated?", a: "Our programs are based on traditional Vedic practices and modern wellness-education principles. While individual techniques have traditional and anecdotal support, we do not claim randomized-controlled-trial evidence for all our practices. We emphasise practical application and responsible use." },
  { q: "Can I use Academy certification professionally?", a: "Yes. Our certifications qualify you to practise complementary wellness within your scope and applicable local regulations. Professional use should remain within your training and qualifications." },
  { q: "Do you work with hospitals or medical centres?", a: "We collaborate with healthcare professionals and organizations interested in complementary wellness. Our graduates work in wellness centres, corporate environments and independent practice." },
  { q: "What if I want to learn just for personal wellness?", a: "All our programs welcome personal learners. You can study for your own wellbeing without any intention to practise professionally." },
  { q: "How do you ensure practitioner quality?", a: "Our courses include case-based learning, practical training, practitioner-boundary education and professional ethics. Graduates are expected to practise responsibly and make appropriate referrals." },
  { q: "Are programs available internationally?", a: "Yes. All our Academy programs are delivered online and accessible globally." },
  { q: "What's the difference between Wellness Programs and Academy Courses?", a: "Wellness Programs are personal wellness offerings. Academy Courses provide professional practitioner training leading to certification." },
];

export default function AboutView() {
  const label = "text-xs uppercase font-bold tracking-widest text-[#EF8321]";
  const h2 = "font-heading font-bold text-[#004C53]";
  const card = "rounded-3xl bg-white border border-green-100 shadow-sm p-6";
  const wrap = "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8";

  return (
    <div className="bg-[#FAFBF7] min-h-screen font-sans text-[#3A4A40]">
      <SEO
        title="About Shivoham Shiv | Reviving Ancient Vedic Sciences for Modern Wellness"
        description="Shivoham Shiv makes authentic, traditional Vedic wellness practices accessible, structured and professionally taught — natural, drug-free approaches that work alongside modern healthcare."
        focusKeyword="about shivoham shiv"
        isFAQPage
        faqs={FAQS}
        isBreadcrumb
        breadcrumbItems={[{ name: "Home", url: "/" }, { name: "About Us", url: "/about" }]}
      />

      {/* 1. HERO */}
      <section className="bg-green-950 text-cream py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-[#EF8321]">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-900 rounded-full text-[#EFFFDF] text-xs font-bold uppercase tracking-widest border border-green-800"><Sparkles className="w-3.5 h-3.5 text-[#EF8321] fill-[#EF8321]" /> About Us</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white tracking-tight leading-tight">About Shivoham Shiv</h1>
          <p className="text-lg text-amber-100 font-semibold">Reviving Ancient Vedic Sciences for Modern Wellness</p>
          <p className="text-base sm:text-lg text-green-100/90 leading-relaxed max-w-3xl mx-auto">
            Shivoham Shiv is dedicated to making authentic, traditional Vedic wellness practices accessible, structured
            and professionally taught for modern life.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto pt-4 text-left">
            {BELIEFS.map((b) => (
              <div key={b} className="flex items-start gap-2.5 rounded-2xl bg-green-900/60 border border-green-800 px-4 py-3 text-sm text-green-50"><CheckCircle2 className="w-4 h-4 text-[#EF8321] shrink-0 mt-0.5" /> {b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. VISION */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="max-w-3xl mx-auto text-center">
          <span className={label}>Our Vision</span>
          <h2 className={`${h2} text-2xl sm:text-4xl mt-2`}>A World Where Vedic Wellness Is Understood &amp; Used</h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-4">
            A world where authentic Vedic wellness practices — Mudra, Ayurvedic Acupressure, Meditation and Pranayama —
            are widely understood and used as natural, drug-free ways to support everyday health and wellbeing.
          </p>
          <p className="text-sm sm:text-base font-semibold text-[#004C53] mt-4">
            Not as alternatives to medicine. Not as replacements for hospitals.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-2">
            But as respected, responsible complementary approaches that work alongside modern healthcare — helping
            people support their body's own capacity for balance, as part of a healthy lifestyle.
          </p>
        </div>
      </section>

      {/* 3. MISSION — 5 PILLARS */}
      <section className="bg-white border-y border-green-100 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>Our Mission</span>
            <h2 className={`${h2} text-2xl sm:text-4xl mt-2`}>Five Interconnected Pillars</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((p) => (
              <div key={p.t} className={card}>
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{p.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHO WE SERVE */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className={label}>Who We Serve</span>
          <h2 className={`${h2} text-2xl sm:text-4xl mt-2`}>A Wellness Journey for Every Stage of Life</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVE.map((s) => (
            <div key={s.t} className="rounded-3xl bg-white border border-green-100 p-6">
              <div className="text-3xl mb-3">{s.e}</div>
              <h3 className="font-heading font-bold text-sm text-[#004C53] mb-1.5">{s.t}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PHILOSOPHY */}
      <section className="bg-[#EEF6F6] border-y border-[#D6E9EA] py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>Our Philosophy</span>
            <h2 className={`${h2} text-2xl sm:text-4xl mt-2`}>How We Approach Wellness</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PHILOSOPHY.map((p) => (
              <div key={p.t} className={card}>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{p.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className={label}>How It Works</span>
          <h2 className={`${h2} text-2xl sm:text-4xl mt-2`}>Your Journey Starts Here</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl bg-white border border-green-100 p-6">
              <span className="font-heading text-xl font-extrabold text-[#EF8321]">{s.n}</span>
              <h3 className="font-heading font-bold text-sm text-[#004C53] mt-1 mb-1.5">{s.t}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FOUNDER */}
      <section className="bg-white border-y border-green-100 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] rounded-[32px] overflow-hidden border-8 border-white shadow-xl">
              <img src="/founder.jpg" alt="Pooja Chaturvedi — Founder, Shivoham Shiv" referrerPolicy="no-referrer" loading="lazy" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1200"; }} />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-5 text-left">
            <span className={label}>Meet Our Founder</span>
            <h2 className={`${h2} text-3xl sm:text-4xl leading-tight`}>Pooja Chaturvedi</h2>
            <div className="p-4.5 bg-[#EEF6F6] rounded-2xl border border-green-100 flex items-start gap-3">
              <GraduationCap className="w-9 h-9 text-[#005461] shrink-0" />
              <p className="text-sm text-slate-700">Founder &amp; Lead Instructor · Certified Yoga Expert, Meditation Coach and Holistic Wellness Practitioner with 8+ years of experience.</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              Driven by a deep curiosity about ancient Indian holistic wellness, Pooja spent years studying classical
              scriptures, energy-point therapies and traditional practices. She founded Shivoham Shiv to bring these
              timeless practices to modern life in a structured, responsible and accessible way.
            </p>
            <p className="text-sm leading-relaxed text-slate-700">
              Her teaching blends authentic traditional techniques with a modern understanding of anatomy, safety and
              scope of practice — so students learn technique, application and ethics together.
            </p>
          </div>
        </div>
      </section>

      {/* 8. COMMUNITY & IMPACT */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className={label}>Community &amp; Impact</span>
          <h2 className={`${h2} text-2xl sm:text-4xl mt-2`}>A Growing Global Wellness Community</h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-3">
            Our real success isn't measured only in numbers — it's measured in the people and communities we help:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {IMPACT.map((i) => (
            <div key={i} className="flex items-start gap-2.5 rounded-2xl bg-white border border-green-100 px-4 py-3 text-sm text-[#004C53]"><CheckCircle2 className="w-4 h-4 text-[#EF8321] shrink-0 mt-0.5" /> {i}</div>
          ))}
        </div>
      </section>

      {/* 9. WHY */}
      <section className="bg-white border-y border-green-100 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>The Difference</span>
            <h2 className={`${h2} text-2xl sm:text-4xl mt-2`}>Why Shivoham Shiv?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY.map((w) => (
              <div key={w.t} className="rounded-2xl bg-[#FAFBF7] border border-green-100 p-5">
                <h3 className="font-heading font-bold text-sm text-[#004C53] mb-1.5">{w.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. VALUES */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className={label}>What We Stand For</span>
          <h2 className={`${h2} text-2xl sm:text-4xl mt-2`}>Our Values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VALUES.map((v) => (
            <div key={v.t} className={card}>
              <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{v.t}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. PROGRESSION */}
      <section className="bg-[#EEF6F6] border-y border-[#D6E9EA] py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className={label}>Your Pathway</span>
          <h2 className={`${h2} text-2xl sm:text-4xl mt-2`}>From Learning to Professional Confidence</h2>
          <p className="text-sm text-slate-600 mt-3">Your knowledge can become your professional skill. This progression is built into every Academy program:</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {PROGRESSION.map((p, i, arr) => (
              <span key={p} className="inline-flex items-center gap-2.5">
                <span className="rounded-full bg-white border border-green-100 px-4 py-2 text-sm font-bold text-[#004C53]">{p}</span>
                {i < arr.length - 1 && <span className="text-[#EF8321] font-bold">→</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 12. GLOBAL COMMUNITY */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="max-w-3xl mx-auto text-center">
          <span className={label}>Global Community</span>
          <h2 className={`${h2} text-2xl sm:text-4xl mt-2`}>Bringing Traditional Indian Wellness to the World</h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-3">
            We combine traditional Indian wellness with modern online education so anyone can learn and grow from
            wherever they are. Our community includes:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto mt-8">
          {GLOBAL.map((g) => (
            <div key={g} className="flex items-start gap-2.5 rounded-2xl bg-white border border-green-100 px-4 py-3 text-sm text-[#004C53]"><CheckCircle2 className="w-4 h-4 text-[#EF8321] shrink-0 mt-0.5" /> {g}</div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-600 mt-6 max-w-2xl mx-auto">All connected through shared values of authentic, professional and responsible Vedic wellness.</p>
      </section>

      {/* 13. FAQ */}
      <section className="bg-white border-y border-green-100 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className={`${h2} text-2xl sm:text-3xl text-center mb-10`}>Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <details key={i} className="group rounded-2xl bg-[#FAFBF7] border border-green-100 px-5 py-4">
                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none font-heading font-bold text-sm text-[#004C53]">
                  {f.q}
                  <span className="text-[#EF8321] shrink-0 transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                </summary>
                <p className="text-sm text-slate-600 leading-relaxed mt-3 pt-3 border-t border-green-100">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* 14. FINAL CTA */}
      <section className="bg-green-950 text-cream py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t-4 border-[#EF8321]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white">Join the Shivoham Shiv Community</h2>
          <p className="text-sm sm:text-base text-green-100/90 leading-relaxed max-w-2xl mx-auto">
            Whether you want to transform your personal wellness or develop professional expertise in traditional
            Indian wellness, Shivoham Shiv gives you a structured path to move forward.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto pt-2 text-left">
            <div className="rounded-3xl bg-green-900/60 border border-green-800 p-6">
              <h3 className="font-heading font-bold text-white mb-1">🌿 Want Better Wellbeing?</h3>
              <p className="text-xs text-green-100/80 mb-4">Programs for individuals, families, children and workplaces.</p>
              <Link to="/wellness-programs" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-200">Explore Wellness Programs <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="rounded-3xl bg-green-900/60 border border-green-800 p-6">
              <h3 className="font-heading font-bold text-white mb-1">🎓 Want to Become a Practitioner?</h3>
              <p className="text-xs text-green-100/80 mb-4">Specialized knowledge, practical skills and professional confidence.</p>
              <Link to="/academy" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-200">Explore the Academy <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
          <div className="pt-2">
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#EF8321] hover:bg-[#F49B3E] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-green-100/70 mt-4">Learn · Practice · Transform · Grow &nbsp;·&nbsp; hello@shivohamshiv.com</p>
          </div>
        </div>
      </section>
    </div>
  );
}
