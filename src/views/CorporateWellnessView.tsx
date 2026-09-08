import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import SEO from "../components/SEO";

const CYCLE = [
  "Long Sitting (7–10 hrs)",
  "High Stress",
  "Poor Sleep",
  "Limited Movement",
  "Irregular Eating",
  "Constant Screen Exposure",
];

const DAILY = [
  { e: "👁️", t: "Digital Eye Fatigue", d: "Tired eyes, dryness, blurred vision, tension headaches and difficulty focusing from continuous screen exposure." },
  { e: "🦴", t: "Cervical & Upper-Body Stiffness", d: "Forward-head posture, rounded shoulders, neck stiffness and upper-back fatigue from leaning over workstations." },
  { e: "🪑", t: "Lower-Back & Hip Discomfort", d: "Continuous pressure on lower-back discs, tight hip flexors, leg stiffness and difficulty standing after prolonged sitting." },
  { e: "📉", t: "Postural Decline", d: "Slouching, tight hamstrings, uneven weight-bearing and reduced spinal mobility." },
  { e: "🍽️", t: "Digestive Discomfort", d: "Rapid desk-side meals, low hydration and stress leading to indigestion, bloating and post-lunch lethargy." },
  { e: "⚡", t: "Afternoon Fatigue & Burnout", d: "Shallow breathing, continuous mental stimulation, irritability, fragmented sleep and midday energy crashes." },
];

const CHRONIC = [
  { e: "❤️", t: "Cardiovascular Strain", d: "Inactivity reduces healthy circulation and metabolic output, a recognised risk factor for long-term cardiovascular problems." },
  { e: "📊", t: "Higher Blood Pressure", d: "Chronic deadlines elevate cortisol and adrenaline, which can contribute to raised resting blood pressure over time." },
  { e: "🍬", t: "Blood-Sugar & Insulin Concerns", d: "Prolonged sitting reduces how efficiently resting muscles clear glucose — a factor associated with insulin resistance." },
  { e: "⚖️", t: "Metabolic Syndrome & Abdominal Weight", d: "Inactivity combined with stress-driven snacking is associated with visceral belly fat and less favourable cholesterol balances." },
  { e: "🫀", t: "Fatty Liver Risk (MASLD)", d: "Slowed lipid metabolism from prolonged inactivity is associated with non-alcoholic fat storage in the liver." },
  { e: "🩸", t: "Poor Circulation", d: "Lower-limb blood pooling can cause heavy legs, swelling and reduced muscular efficiency." },
];

const MATRIX = [
  { challenge: "Long Sitting (7–10 hrs)", cause: "Static positioning & inactivity", intervention: "Desk Yoga, chair mobility, movement breaks", benefit: "Restored circulation and spinal fluidity" },
  { challenge: "Eye Strain & Screen Fatigue", cause: "Uninterrupted blue-light exposure", intervention: "Palming, eye rotations, 20-20-20 rule", benefit: "Reduced optical tension and screen headaches" },
  { challenge: "Neck, Shoulder & Cervical Tension", cause: "Forward-head tilt & desk slouching", intervention: "Cervical mobility stretches & posture checks", benefit: "Relieved muscular knots and aligned posture" },
  { challenge: "Lower-Back & Hip Stiffness", cause: "Compressed lumbar discs & tight hips", intervention: "Hip openers, gentle twists, standing poses", benefit: "Decompressed spine and reduced daily discomfort" },
  { challenge: "Belly Weight & Metabolic Dip", cause: "Stress eating & no post-meal motion", intervention: "Prakriti nutrition education, habit coaching", benefit: "Better metabolic regulation and weight balance" },
  { challenge: "Workplace Stress & Burnout", cause: "Constant mental overdrive & targets", intervention: "Guided Pranayama, meditation & mudras", benefit: "Calmer nervous system and emotional resilience" },
  { challenge: "Afternoon Energy Crash", cause: "Heavy desk meals & shallow breathing", intervention: "Oxygenating breathwork, mindful micro-breaks", benefit: "Consistent alertness without caffeine spikes" },
  { challenge: "Poor Sleep & Recovery", cause: "Digital stimulation & work pressure", intervention: "Evening wind-down routines & relaxation tools", benefit: "Deeper, more restorative sleep" },
];

const COMPONENTS = [
  { e: "🧘", t: "Desk Yoga & Chair Mobility", d: "Accessible stretches for the neck, shoulders, wrists, spine and hips — right at the workstation, no gym attire or shower required.", f: ["No equipment needed", "Can be done in business attire", "5–15 minute sessions", "Targets key tension areas", "Improves mobility and circulation"] },
  { e: "🤲", t: "Mudra Science for Focus", d: "Discreet hand-energy postures employees can practise during meetings, calls or commutes to support calm, focus and digestion.", f: ["Completely discreet", "Can be done in meetings or calls", "1–2 minute practices", "Supports stress reduction", "Enhanced focus and clarity"] },
  { e: "🌬️", t: "Pranayama & Rapid Stress Resets", d: "Structured breathwork (including box breathing and alternate-nostril breathing) to reset the nervous system during intense deadlines.", f: ["2–5 minute reset practices", "No physical exertion", "Can be done at the desk", "Immediate calming effect", "Supports lower cortisol"] },
  { e: "🧠", t: "Guided Mindfulness & Meditation", d: "5- to 10-minute mental resets to ease cognitive overload, improve focus and reduce emotional reactivity.", f: ["5–10 minute sessions", "Live or recorded options", "Group or individual", "Reduces mental fatigue", "Supports emotional regulation"] },
  { e: "👁️", t: "Digital Eye Wellness Protocols", d: "Actionable visual breaks, palming, blinking awareness and distance viewing to help preserve long-term eye comfort.", f: ["Eye-strain relief", "Headache prevention", "Vision-comfort support", "2–3 minute protocols", "Can be done at the desk"] },
  { e: "🥗", t: "Nutrition & Lifestyle Education", d: "Pragmatic workshops on balanced meal timing, desk-snack options, hydration habits and post-lunch mobility.", f: ["Practical nutrition guidance", "Desk-snack recommendations", "Hydration strategies", "Post-meal movement", "Sustainable eating habits"] },
];

const MICROBREAKS = [
  { time: "Start of workday", mins: "5 min", activity: "Diaphragmatic breathing & intention setting", benefit: "Calm nervous system, positive mindset" },
  { time: "Mid-morning", mins: "2 min", activity: "Optical palming & shoulder rollouts", benefit: "Eye relief, shoulder tension release" },
  { time: "Post-lunch", mins: "5 min", activity: "Light walking & posture reset", benefit: "Aids digestion, resets posture & circulation" },
  { time: "Mid-afternoon", mins: "3 min", activity: "Energising breathwork", benefit: "Overcome the afternoon slump naturally" },
  { time: "End of workday", mins: "5 min", activity: "Seated spine twist & mental detachment", benefit: "Release work stress, transition to personal time" },
];

const IMPACT = [
  { e: "📉", t: "Reduced Absenteeism", d: "Fewer sick leaves related to chronic back pain, cervical strain, migraines and burnout — with direct savings on productivity loss." },
  { e: "🤝", t: "Elevated Team Engagement", d: "Shared wellness activities that build connection and belonging across remote and office-based teams." },
  { e: "💼", t: "Stronger Employer Brand", d: "A proactive, employee-centric culture that helps attract top talent and improve retention." },
  { e: "⚡", t: "Improved Productivity & Focus", d: "Reduced cognitive overload, better sleep and clearer minds support sharper decision-making." },
];

const FORMATS = [
  { t: "Daily / Weekly Micro-Sessions", dur: "15–20 min", freq: "Daily or 3–4× per week", d: "Quick mobility, breathwork and posture breaks, delivered live-virtual or on-site.", best: "Consistent wellness touchpoints" },
  { t: "Comprehensive Workshops", dur: "45–60 min", freq: "Weekly or bi-weekly", d: "Deep-dive Yoga, guided meditation and stress-management clinics in live interactive sessions.", best: "Deeper learning and transformation" },
  { t: "Monthly Masterclasses", dur: "60 min", freq: "Monthly", d: "Ergonomic setups, metabolic health, sleep optimisation and wellness-strategy topics, expert-led.", best: "Educational depth and specialised topics" },
  { t: "Customized Program Design", dur: "Flexible", freq: "Tailored", d: "Duration, frequency, delivery model (virtual, hybrid or in-person) and topics tailored to your company.", best: "Organisation-specific goals" },
];

const INDUSTRIES = [
  "IT & technology firms", "Financial institutions", "BPOs & call centers", "Consultancies",
  "Healthcare organizations", "Startups", "Manufacturing & industrial", "Distributed global teams", "Government & public sector",
];

const FAQS = [
  { q: "Do employees need prior yoga experience or workout clothing?", a: "No. Every movement is beginner-friendly and designed to be done in normal business attire without equipment — no changing or showering required." },
  { q: "Can this support remote and international teams?", a: "Yes. We deliver live interactive virtual sessions across Zoom, MS Teams and Google Meet, scheduled to match global time zones. Remote teams get the same experience as on-site employees." },
  { q: "Can this program prevent or treat conditions like sciatica, diabetes or hypertension?", a: "No. This is a non-clinical lifestyle intervention. It does not replace medical treatment, but it can help reduce lifestyle risk factors through healthy movement, stress reduction and posture awareness. Employees with existing conditions should consult their healthcare provider." },
  { q: "How soon do employees notice benefits?", a: "Many notice improved energy, reduced neck/shoulder tension and better focus within a few weeks, with sleep-quality improvements often following over 4–6 weeks. Longer-term benefits build with sustained participation. Individual results vary." },
  { q: "How are sessions customized for our organization?", a: "Duration, frequency, delivery model (virtual, hybrid or in-person) and topics are tailored to your company's schedule, workforce and wellness goals." },
  { q: "Can we run this for one department or the whole organization?", a: "Yes. Pilot with a single department or scale across the entire organization — with flexible options for different team sizes and structures." },
];

const TRUST = [
  "Designed for office & remote teams",
  "No prior yoga experience required",
  "Can be done in business attire",
  "15–60 minute flexible sessions",
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
        description="Desk Yoga, Meditation, Pranayama and workplace wellness programs for office and remote teams — reduce sitting strain, workplace stress and build healthier, more productive employees."
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
            Reduce the impact of long sitting, workplace stress and a sedentary lifestyle.
          </p>
          <p className="mt-5 text-sm sm:text-base text-green-50/85 leading-relaxed">
            Modern employees spend 7–10 hours sitting at laptops, in back-to-back meetings and on mobile screens —
            moving far less than the body is built for. The Shivoham Shiv Corporate Wellness Program brings practical
            Desk Yoga, Meditation, Breathwork (Pranayama), Mudra practice, mobility and posture awareness directly into
            office and remote work environments.
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

      {/* 2. WORKPLACE CYCLE */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className={label}>The Modern Workplace</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>The Workplace Has Changed. The Human Body Hasn't.</h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-3">
            A typical working day creates a compounding cycle that gradually affects health, energy and productivity:
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {CYCLE.map((c, i) => (
              <span key={c} className="inline-flex items-center gap-2.5">
                <span className="rounded-full bg-white border border-[#004C53]/10 shadow-sm px-4 py-2 text-sm font-semibold text-[#004C53]">{c}</span>
                <span className="text-[#EF8321] font-bold">↓</span>
                {i === CYCLE.length - 1 && <span className="rounded-full bg-[#004C53] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">Cycle repeats</span>}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mt-8 max-w-2xl mx-auto">
            What feels like "normal workplace fatigue" today can build toward measurable lifestyle risk factors over
            months and years.
          </p>
        </div>
      </section>

      {/* 3. DAILY + CHRONIC */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>Why It Matters</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>From Daily Desk Discomfort to Long-Term Risk</h2>
          </div>
          <h3 className="font-heading font-bold text-lg text-[#004C53] mb-5">Everyday workday strain</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {DAILY.map((d) => (
              <div key={d.t} className="rounded-2xl bg-[#FAF5EC] border border-[#004C53]/10 p-5">
                <div className="text-2xl mb-2">{d.e}</div>
                <h4 className="font-heading font-bold text-sm text-[#004C53] mb-1">{d.t}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{d.d}</p>
              </div>
            ))}
          </div>
          <h3 className="font-heading font-bold text-lg text-[#004C53] mb-2">Risk factors linked to prolonged sedentary routines</h3>
          <p className="text-xs text-slate-500 mb-5 max-w-2xl">These conditions are <em>associated with</em> long-term sedentary lifestyles. This program supports healthier habits — it does not diagnose or treat any medical condition.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CHRONIC.map((c) => (
              <div key={c.t} className="rounded-2xl bg-[#FAF5EC] border border-[#004C53]/10 p-5">
                <div className="text-2xl mb-2">{c.e}</div>
                <h4 className="font-heading font-bold text-sm text-[#004C53] mb-1">{c.t}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SOLUTION MATRIX */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>How We Help</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>The Shivoham Shiv Solution Matrix</h2>
            <p className="text-sm text-slate-600 mt-3">Each workplace challenge matched with a targeted, practical intervention:</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MATRIX.map((m) => (
              <div key={m.challenge} className={card}>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-3">{m.challenge}</h3>
                <div className="space-y-2 text-xs">
                  <p><span className="font-bold text-slate-500 uppercase tracking-wider">Root cause:</span> <span className="text-slate-600">{m.cause}</span></p>
                  <p><span className="font-bold text-[#EF8321] uppercase tracking-wider">Intervention:</span> <span className="text-slate-700">{m.intervention}</span></p>
                  <p className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-[#2E8A93] shrink-0 mt-0.5" /> <span className="text-[#004C53] font-medium">{m.benefit}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHAT'S INCLUDED */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>The Program</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>What's Included</h2>
            <p className="text-sm text-slate-600 mt-3">Practical workplace wellness paired with traditional Vedic practice — built for office and remote environments.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COMPONENTS.map((c) => (
              <div key={c.t} className={card}>
                <div className="text-3xl mb-3">{c.e}</div>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{c.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{c.d}</p>
                <ul className="space-y-1.5">
                  {c.f.map((ft) => (
                    <li key={ft} className="flex items-start gap-2 text-xs text-[#004C53]"><Check className="w-3.5 h-3.5 text-[#EF8321] shrink-0 mt-0.5" /> {ft}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MICRO-BREAK BLUEPRINT */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>Small Actions, Lasting Impact</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>The Micro-Break Blueprint</h2>
            <p className="text-sm text-slate-600 mt-3">Meaningful wellness doesn't need hours — structured micro-breaks across the day add up:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {MICROBREAKS.map((b, i) => (
              <div key={b.time} className="rounded-2xl bg-white border border-[#004C53]/10 p-5 shadow-sm">
                <span className="font-heading text-xl font-extrabold text-[#EF8321]">{i + 1}</span>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#004C53] mt-1">{b.time}</p>
                <p className="text-[11px] font-semibold text-[#EF8321] mb-1.5">{b.mins}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-1.5">{b.activity}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed border-t border-[#004C53]/10 pt-1.5">{b.benefit}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-6 max-w-2xl mx-auto">
            <p className="font-heading font-bold text-lg text-[#004C53]">Just 20 minutes a day</p>
            <p className="text-sm text-slate-600 mt-1">5 + 2 + 5 + 3 + 5 minutes — healthier employees, better focus, reduced stress and better sleep.</p>
          </div>
        </div>
      </section>

      {/* 7. BUSINESS IMPACT */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>For the Organization</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>The Business Impact</h2>
            <p className="text-sm text-slate-600 mt-3">Beyond individual health, workplace wellness supports the whole organization:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {IMPACT.map((i) => (
              <div key={i.t} className="rounded-3xl bg-[#FAF5EC] border border-[#004C53]/10 p-6">
                <div className="text-3xl mb-3">{i.e}</div>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{i.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{i.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FLEXIBLE FORMATS */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>Flexible Delivery</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Program Formats for Every Workforce</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {FORMATS.map((f) => (
              <div key={f.t} className={card}>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-2">{f.t}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#004C53]/10 text-[#004C53] rounded-full px-2.5 py-1">{f.dur}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EF8321]/15 text-[#D9741A] rounded-full px-2.5 py-1">{f.freq}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{f.d}</p>
                <p className="text-[11px] text-slate-500"><span className="font-semibold text-[#004C53]">Best for:</span> {f.best}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-6 sm:p-8">
            <h3 className="font-heading font-bold text-base text-[#004C53] mb-4 text-center">Built for teams across industries</h3>
            <div className="flex flex-wrap justify-center gap-2.5">
              {INDUSTRIES.map((ind) => (
                <span key={ind} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#004C53] bg-white border border-[#004C53]/10 rounded-full px-3.5 py-1.5"><Check className="w-3.5 h-3.5 text-[#EF8321]" /> {ind}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className={`${h2} text-2xl sm:text-3xl text-center mb-10`}>Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <details key={i} className="group rounded-2xl bg-[#FAF5EC] border border-[#004C53]/10 px-5 py-4">
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

      {/* 10. DISCLAIMER */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-6 sm:p-8">
          <h3 className="font-heading font-bold text-base text-[#004C53] mb-2">Important Wellness Disclaimer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Shivoham Shiv Corporate Wellness Program provides general wellness, movement, mindfulness, relaxation,
            stress-management and lifestyle education. It does not diagnose, treat, cure or prevent cardiovascular
            disease, stroke, diabetes, hypertension, sciatica or other medical conditions. Employees with existing
            injuries, chronic pain or cardiovascular concerns should consult a qualified healthcare provider before
            participating in any movement-based sessions. This program is intended to support workplace wellness and
            reduce lifestyle risk factors — not to replace professional medical care.
          </p>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="bg-gradient-to-b from-[#004C53] to-[#003A40] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white">Build a Healthier Workplace Today</h2>
          <p className="mt-4 text-sm sm:text-base text-green-50/85">
            Your employees are your most valuable asset. A healthier team is more engaged, more productive and more
            resilient.
          </p>
          <p className="mt-3 text-sm text-green-50/75 max-w-xl mx-auto">
            We give you the structure, expert guidance and proven practices to build a lasting wellness culture —
            whether your team works from one office or across the globe.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 bg-[#EF8321] hover:bg-[#F49B3E] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">
              Book a Corporate Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 bg-white text-[#004C53] hover:bg-green-50 font-bold text-xs uppercase tracking-wider rounded-full transition-all">
              Talk to Our Wellness Team →
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
