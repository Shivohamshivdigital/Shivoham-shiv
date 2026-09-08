import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import SEO from "../components/SEO";

const IMPACTS = [
  "Eye strain & digital fatigue from continuous screens",
  "Neck, shoulder & upper-back stiffness from desk posture",
  "Lower-back & sciatica-type discomfort from prolonged sitting",
  "Postural decline & reduced spinal mobility",
  "Digestive issues from stress & irregular eating",
  "Afternoon energy crashes & burnout",
];

const SOLUTIONS = [
  { e: "🧘", t: "Desk Yoga & Mobility", d: "Accessible stretches right at the workstation for neck, shoulders, wrists, spine and hips. No equipment needed." },
  { e: "🤲", t: "Mudra Science", d: "Simple hand-energy postures employees can practise during meetings or commutes to support focus and ease anxiety." },
  { e: "🌬️", t: "Pranayama & Stress Resets", d: "Quick breathwork (2–5 minutes) to reset the nervous system during intense deadlines." },
  { e: "🧠", t: "Guided Mindfulness & Meditation", d: "5–10 minute mental resets to ease cognitive overload and improve emotional resilience." },
  { e: "👁️", t: "Digital Eye Wellness", d: "Visual breaks and palming techniques to help preserve long-term eye comfort." },
  { e: "🥗", t: "Nutrition & Lifestyle Education", d: "Practical guidance on meal timing, desk snacks, hydration and post-lunch movement." },
];

const ROUTINE = [
  { time: "Start of workday", mins: "5 min", act: "Diaphragmatic breathing & mental intention" },
  { time: "Mid-morning", mins: "2 min", act: "Optical palming & shoulder rolls" },
  { time: "Post-lunch", mins: "5 min", act: "Light walking & posture reset" },
  { time: "Mid-afternoon", mins: "3 min", act: "Energising breathwork" },
  { time: "End of workday", mins: "5 min", act: "Gentle spine twist & mental release" },
];

const BENEFITS = [
  { e: "📉", t: "Reduced Absenteeism", d: "Fewer health-related sick leaves over time — with direct savings on productivity loss." },
  { e: "🤝", t: "Elevated Engagement", d: "Shared wellness activities foster team connection — especially for remote teams." },
  { e: "⚡", t: "Improved Productivity & Focus", d: "Reduced cognitive overload and better sleep support sharper decision-making." },
  { e: "💼", t: "Stronger Employer Brand", d: "Wellness initiatives help attract top talent and improve retention." },
  { e: "🌱", t: "Better Team Wellbeing", d: "Employees report reduced stress, better sleep and less pain — higher job satisfaction." },
];

const FORMATS = [
  { t: "Daily Micro-Sessions", dur: "15–20 min", d: "Quick wellness touchpoints, 3–4× per week, live or recorded." },
  { t: "Weekly Workshops", dur: "45–60 min", d: "Deeper dives into Yoga, meditation and stress management — live interactive." },
  { t: "Monthly Masterclasses", dur: "60 min", d: "Expert-led sessions on ergonomic setups, metabolic health and sleep optimisation." },
  { t: "Fully Customized Programs", dur: "Flexible", d: "Adapt duration, frequency, delivery (virtual, hybrid, in-person) and topics to your needs." },
];

const SUPPORTED = ["In-office teams", "Fully remote teams", "Distributed global teams", "Hybrid models"];

const INCLUDED = [
  { t: "Desk Yoga & Chair Mobility", d: "No equipment needed, works in business attire" },
  { t: "Mudra Science Training", d: "Discreet hand practices for focus & anxiety relief" },
  { t: "Pranayama & Nervous-System Reset", d: "Quick breathwork protocols" },
  { t: "Guided Mindfulness & Meditation", d: "Group and individual options" },
  { t: "Digital Eye Wellness", d: "Visual-break protocols" },
  { t: "Corporate Nutrition Education", d: "Practical meal-timing & hydration strategies" },
  { t: "Customized Implementation", d: "Tailored to your organization" },
  { t: "Ongoing Support & Coaching", d: "Progress tracking & adjustments" },
];

const FAQS = [
  { q: "Do employees need yoga experience or special clothing?", a: "No. Everything is designed for business attire and complete beginners — no gym clothes, no shower required." },
  { q: "Can this work for remote and international teams?", a: "Yes. We deliver live sessions via Zoom, MS Teams and Google Meet, scheduled across time zones. Remote teams get the same experience as on-site employees." },
  { q: "Can this prevent or treat medical conditions?", a: "This is lifestyle support, not clinical treatment. It helps reduce lifestyle risk factors and supports general wellness. Employees with medical conditions should consult their healthcare provider." },
  { q: "How quickly do employees see benefits?", a: "Energy and focus improvements are often noticed within a few weeks, with sleep-quality improvements following over 4–6 weeks. Longer-term benefits build with consistent participation. Individual results vary." },
  { q: "How is this customized to our organization?", a: "We adapt duration, frequency, topics and delivery model based on your schedule, team size and wellness goals." },
  { q: "Can we run this for specific departments or company-wide?", a: "Both. We can pilot with a single department or scale across your entire organization." },
];

const TRUST = [
  "Designed for office & remote teams",
  "No yoga experience required",
  "Can be done in business attire",
  "Flexible 15–60 minute sessions",
  "Customizable to your organization",
  "Supports global & distributed teams",
];

export default function CorporateWellnessView() {
  const label = "text-xs uppercase font-bold tracking-widest text-[#EF8321]";
  const h2 = "font-heading font-bold text-[#004C53]";
  const card = "rounded-3xl bg-white border border-[#004C53]/10 shadow-sm p-6";

  return (
    <div className="bg-[#FAF5EC] min-h-screen font-sans text-[#3A4A40]">
      <SEO
        title="Corporate Wellness Program for Healthy, Productive Teams | Shivoham Shiv"
        description="Desk Yoga, Meditation, Pranayama and workplace wellness for office and remote teams — reduce sitting strain, workplace stress and build healthier, more productive employees."
        focusKeyword="corporate wellness program"
        isFAQPage
        faqs={FAQS}
      />

      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#004C53] to-[#003A40] text-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-16 sm:py-24 text-center">
          <span className={`${label} text-amber-300`}>Corporate & Organizational Wellness</span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight text-white mt-3">
            Corporate Wellness for Healthier,<br /><span className="text-amber-300">More Productive Teams</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base font-semibold text-amber-100">
            Reduce sitting strain, workplace stress and the sedentary impact on employee health.
          </p>
          <p className="mt-5 text-sm sm:text-base text-green-50/85 leading-relaxed">
            Modern employees spend 7–10 hours sitting at desks, in back-to-back meetings and on screens — a continuous
            cycle that affects health, resilience and long-term vitality. Shivoham Shiv brings practical Desk Yoga,
            Meditation, Pranayama, Mudra practice and workplace mindfulness directly into office and remote
            environments — no equipment, no gym clothes needed.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#EF8321] hover:bg-[#D9741A] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">
              Book a Corporate Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center px-7 py-4 border-2 border-white/25 text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider rounded-full transition-all">
              Talk to Our Wellness Team →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE CHALLENGE */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className={label}>The Challenge</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>What Long Sitting & Workplace Stress Actually Do</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {IMPACTS.map((i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-2xl bg-white border border-[#004C53]/10 px-4 py-3 text-sm text-[#004C53]">
                <span className="text-[#EF8321] mt-0.5">•</span> {i}
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mt-6 max-w-2xl mx-auto text-center">
            Over the long term, sedentary patterns are <em>associated with</em> a higher risk of cardiovascular
            disease, hypertension, type 2 diabetes, obesity and fatty liver disease. The problem isn't individual
            employee laziness — it's the working environment itself. (This program supports healthier habits; it does
            not diagnose or treat any medical condition.)
          </p>
        </div>
      </section>

      {/* 3. OUR SOLUTION */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>Our Solution</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Practical Wellness Built Into the Workday</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTIONS.map((s) => (
              <div key={s.t} className={card}>
                <div className="text-3xl mb-3">{s.e}</div>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{s.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE DAILY PRACTICE */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>The Daily Practice</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>The 20-Minute Daily Wellness Routine</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {ROUTINE.map((b, i) => (
              <div key={b.time} className="rounded-2xl bg-white border border-[#004C53]/10 p-5 shadow-sm">
                <span className="font-heading text-xl font-extrabold text-[#EF8321]">{i + 1}</span>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#004C53] mt-1">{b.time}</p>
                <p className="text-[11px] font-semibold text-[#EF8321] mb-1.5">{b.mins}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{b.act}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-6 max-w-2xl mx-auto">
            <p className="font-heading font-bold text-lg text-[#004C53]">20 minutes a day</p>
            <p className="text-sm text-slate-600 mt-1">Micro-breaks that fit into existing schedules with zero disruption — for healthier, more focused employees.</p>
          </div>
        </div>
      </section>

      {/* 5. BUSINESS BENEFITS */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>The Business Impact</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Why It Matters for the Organization</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.t} className="rounded-3xl bg-[#FAF5EC] border border-[#004C53]/10 p-6">
                <div className="text-3xl mb-3">{b.e}</div>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{b.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FLEXIBLE FORMATS */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>Flexible Delivery</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>We Work Around Your Schedule</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {FORMATS.map((f) => (
              <div key={f.t} className={card}>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EF8321]/15 text-[#D9741A] rounded-full px-2.5 py-1">{f.dur}</span>
                <h3 className="font-heading font-bold text-base text-[#004C53] mt-3 mb-1.5">{f.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {SUPPORTED.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#004C53] bg-white border border-[#004C53]/10 rounded-full px-3.5 py-1.5"><Check className="w-3.5 h-3.5 text-[#EF8321]" /> {s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHAT'S INCLUDED */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>Program Components</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>What's Included</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INCLUDED.map((c) => (
              <div key={c.t} className="rounded-2xl bg-[#FAF5EC] border border-[#004C53]/10 p-5">
                <Check className="w-4 h-4 text-[#EF8321] mb-2" />
                <h3 className="font-heading font-bold text-sm text-[#004C53] mb-1">{c.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className={`${h2} text-2xl sm:text-3xl text-center mb-10`}>Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <details key={i} className="group rounded-2xl bg-white border border-[#004C53]/10 px-5 py-4 shadow-sm">
                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none font-heading font-bold text-sm text-[#004C53]">
                  {f.q}
                  <span className="text-[#EF8321] shrink-0 transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                </summary>
                <p className="text-sm text-slate-600 leading-relaxed mt-3 pt-3 border-t border-[#004C53]/10">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="bg-gradient-to-b from-[#004C53] to-[#003A40] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white">Build a Healthier Workplace Today</h2>
          <p className="mt-4 text-sm sm:text-base text-green-50/85">
            Your employees are your greatest asset. A healthier, less stressed team is more engaged, more productive
            and more resilient.
          </p>
          <p className="mt-3 text-sm text-green-50/75 max-w-xl mx-auto">
            We give you practical, proven practices that work in real office environments — no disruption, real results.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 bg-[#EF8321] hover:bg-[#F49B3E] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">
              Book a Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 bg-white text-[#004C53] hover:bg-green-50 font-bold text-xs uppercase tracking-wider rounded-full transition-all">
              Send an Inquiry →
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-green-50/85">
            {TRUST.map((t) => <span key={t} className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-300" /> {t}</span>)}
          </div>
        </div>
      </section>
    </div>
  );
}
