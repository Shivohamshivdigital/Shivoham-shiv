import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import SEO from "../components/SEO";

const REALITY = [
  "Eye strain and screen fatigue", "Neck and shoulder stiffness", "Cervical discomfort",
  "Lower-back discomfort", "Sciatica-type pain and leg stiffness", "Poor posture",
  "Abdominal weight and belly fat", "Digestion problems and bloating", "Low energy and afternoon fatigue",
  "Reduced mobility and flexibility", "Headaches from screen use or muscle tension", "Poor sleep",
  "Mental stress", "Reduced concentration", "Workplace burnout",
];

const RISKS = [
  { e: "❤️", t: "Cardiovascular disease & heart-attack risk" },
  { e: "🩸", t: "High blood pressure" },
  { e: "🍬", t: "Type 2 diabetes" },
  { e: "🧪", t: "High cholesterol" },
  { e: "🫁", t: "Sleep apnea & breathing problems" },
  { e: "🦴", t: "Joint problems & osteoarthritis" },
  { e: "🫀", t: "Fatty liver disease (MASLD)" },
  { e: "🧠", t: "Stroke risk" },
  { e: "🔥", t: "Metabolic syndrome" },
  { e: "💪", t: "Poor circulation & musculoskeletal problems" },
];

const WORKDAY = [
  "7–10 hours sitting", "Several hours continuously on screens", "Long periods without meaningful movement",
  "Back-to-back meetings", "Meals at the desk", "Limited physical activity", "High levels of mental pressure",
];

const CYCLE = ["Long Sitting", "High Stress", "Poor Sleep", "Limited Movement", "Irregular Eating", "Constant Screen Exposure"];

const CHALLENGES = [
  { n: 1, t: "Eye Strain & Digital Screen Fatigue", effect: "Tired eyes, dryness, headaches, blurred vision, difficulty focusing.", sol: "Screen-break routines, palming, blinking awareness, eye-relaxation practices." },
  { n: 2, t: "Neck, Shoulder & Cervical Discomfort", effect: "Neck stiffness, shoulder tightness, upper-back discomfort, reduced neck mobility.", sol: "Desk-friendly mobility, stretching, posture awareness." },
  { n: 3, t: "Lower-Back Pain & Sciatica-Type Discomfort", effect: "Strain on lower back, hips and surrounding muscles causing stiffness and reduced mobility.", sol: "Gentle lower-body mobility, stretching, Yoga, regular movement breaks." },
  { n: 4, t: "Poor Posture & Reduced Mobility", effect: "Rounded shoulders, forward-head posture, slouching, tight hamstrings, stiff shoulders.", sol: "Posture consciousness and flexible movement routines." },
  { n: 5, t: "Belly Fat, Weight Gain & Sedentary Lifestyle", effect: "Long sitting, limited activity, stress eating, irregular meals and poor sleep contribute to weight gain and abdominal fat.", sol: "Daily movement, Yoga, mindful eating, better routines, hydration." },
  { n: 6, t: "Digestion, Bloating & Post-Meal Sluggishness", effect: "Eating quickly, skipping meals, eating at the desk and sitting right after eating leave employees bloated and low on energy.", sol: "Mindful eating, hydration, post-meal movement, stress management." },
  { n: 7, t: "Stress, Anxiety & Mental Fatigue", effect: "Deadlines, targets, constant emails and client pressure lead to emotional exhaustion, poor concentration, irritability and burnout.", sol: "Meditation, breathing practices, mindfulness, guided relaxation." },
  { n: 8, t: "Low Energy & Afternoon Fatigue", effect: "Energy dips after lunch or mid-workday, often met only with caffeine.", sol: "Short movement breaks, breathing practices and hydration habits throughout the day." },
  { n: 9, t: "Poor Sleep & Difficulty Switching Off", effect: "Work stress continues after hours, creating a cycle of fatigue, cravings, low motivation and poor concentration.", sol: "Relaxation, breathing and wellness education for home." },
];

const INCLUDED = [
  { t: "Desk Yoga & Workplace Mobility", d: "Simple movements beside a desk or meeting room — neck, shoulder, spine and hip mobility, lower-back movement and posture awareness. No gym equipment required." },
  { t: "Eye Wellness for Screen-Based Employees", d: "Regular visual breaks, palming, blinking awareness, gentle eye movements and distance viewing to interrupt long periods of continuous screen exposure." },
  { t: "Meditation & Mindfulness at Work", d: "Short mental resets during an intense working day — mindfulness meditation, breath awareness, stress management and focus-building exercises." },
  { t: "Breathing Practices for Workplace Stress", d: "Simple, beginner-friendly techniques employees can use independently during stressful situations." },
  { t: "Mudra & Traditional Indian Wellness", d: "Traditional Mudra practices alongside Yoga, meditation, breathing and mindfulness — introduced in a practical, accessible way." },
  { t: "Healthy Eating & Lifestyle Awareness", d: "Mindful eating, meal-timing awareness, hydration, healthy snacking, post-meal movement, sleep routines, digital wellness and work-life boundaries." },
];

const MICRO = [
  { time: "Before starting work", act: "Mobility + breathing" },
  { time: "Mid-morning", act: "Eye break + posture reset" },
  { time: "Between meetings", act: "2–5 minutes of movement" },
  { time: "Before lunch", act: "Brief mobility break" },
  { time: "After lunch", act: "Gentle walking or movement" },
  { time: "Mid-afternoon", act: "Breathing + energising movement" },
  { time: "End of workday", act: "Stretching + relaxation" },
];

const SESSION = [
  { m: "5 min", a: "Breathing & mental reset" },
  { m: "10 min", a: "Neck, shoulder & spine mobility" },
  { m: "10 min", a: "Desk Yoga / full-body movement" },
  { m: "5 min", a: "Eye relaxation" },
  { m: "5 min", a: "Mindfulness / meditation" },
  { m: "5 min", a: "Practical lifestyle guidance" },
];

const STRUCTURES = [
  { t: "Daily Micro-Wellness Sessions", d: "Short 10–20 minute sessions on movement, posture, breathing or screen recovery." },
  { t: "Weekly Yoga & Mobility Sessions", d: "Longer guided sessions to improve overall movement habits." },
  { t: "Weekly Meditation & Stress-Management", d: "Guided mindfulness, breathing and relaxation practices." },
  { t: "Monthly Wellness Workshops", d: "Long-sitting risks, desk posture, eye wellness, stress, healthy eating, sleep, mobility and preventive habits." },
  { t: "Employee Wellness Challenges", d: "Structured challenges that encourage healthier routines together." },
];

const ORGBENEFITS = [
  { t: "Healthier Workplace Culture", d: "Regular wellness activities show that employee wellbeing is part of organizational culture." },
  { t: "Improved Employee Engagement", d: "Group sessions give employees positive shared experiences." },
  { t: "Better Stress-Management Awareness", d: "Employees learn practical techniques they can apply during demanding days." },
  { t: "Preventive Health Awareness", d: "Greater awareness of activity, posture, sleep, stress, screen use and health behavior." },
  { t: "Team Connection", d: "Yoga, workshops and mindfulness can bring teams together." },
  { t: "Employer Branding", d: "Structured initiatives strengthen employee experience and a people-first culture." },
];

const SERVE = [
  "IT companies", "Technology companies", "Startups", "Corporates", "Banks & financial institutions",
  "BPO & call centres", "Educational institutions", "Hospitals", "Government organizations",
  "Professional service companies", "Remote teams", "Hybrid teams", "Co-working communities",
];

const WHYCHOOSE = [
  { t: "Traditional Indian Wellness for Modern Work", d: "Yoga, Meditation, Mudra, breathing, mindfulness and lifestyle awareness brought into today's workplace." },
  { t: "Mind + Body Approach", d: "We address movement, posture, stress, screen habits, lifestyle, mindfulness and recovery — not just one problem." },
  { t: "Beginner-Friendly", d: "Employees need no previous Yoga or meditation experience." },
  { t: "Practical Workplace Sessions", d: "Many practices can be done next to a desk without equipment." },
  { t: "Online, Offline & Hybrid-Friendly", d: "Supports office teams, remote workers and distributed organizations." },
  { t: "Customized Programs", d: "Topics, duration, frequency and delivery format adapted to your goals." },
  { t: "Sustainable Wellness Habits", d: "Employees learn practices they can continue independently outside sessions." },
  { t: "Growing Wellness Community", d: "Become part of a growing Shivoham Shiv wellness community." },
];

const FAQS = [
  { q: "What is a Corporate Wellness Program?", a: "A structured workplace initiative to encourage healthier physical, mental and lifestyle habits. Shivoham Shiv combines Yoga, workplace mobility, meditation, mindfulness, breathing and lifestyle education." },
  { q: "Is this suitable for employees who sit all day?", a: "Yes — it's customized for desk-based employees, focusing on long sitting, posture, mobility, eye strain, neck/shoulder stiffness, lower-back mobility, stress and screen fatigue." },
  { q: "Can it reduce risks associated with long sitting?", a: "It cannot guarantee prevention of disease. It encourages employees to interrupt prolonged sitting, move more often, manage stress and build healthier lifestyle habits." },
  { q: "Can it help employees with high blood pressure or diabetes?", a: "It does not diagnose or treat medical conditions. It can support healthier movement, stress-management and lifestyle habits alongside appropriate medical care." },
  { q: "Does the program treat sciatica?", a: "No. Sciatica can have several causes and should be assessed appropriately. We focus on general mobility and reducing prolonged inactivity — not treating medical conditions." },
  { q: "Is the program suitable for beginners?", a: "Yes. Sessions can be customized for employees with no previous Yoga or meditation experience." },
  { q: "Can you run the program online?", a: "Yes. Online programs suit remote, hybrid and international teams." },
  { q: "Can the program be customized for our company?", a: "Yes. Structure, frequency, session duration and wellness topics are adapted to your organization's needs." },
];

const EMP_BENEFITS = [
  "Greater posture awareness", "Better mobility and flexibility", "Reduced everyday stiffness",
  "More regular movement through the workday", "Better management of workplace stress", "Improved relaxation",
  "Healthier screen habits", "Greater mindfulness", "Better energy management",
  "Improved awareness of eating and sleep habits", "Better overall wellness routines", "A greater sense of wellbeing",
];

const TRUST = [
  "Structured programs for all workplace types",
  "No yoga experience required",
  "Can be done in business attire",
  "Flexible 15–60 minute sessions",
  "Customizable to your organization",
  "Supports global & distributed teams",
  "Online, offline & hybrid options",
];

export default function CorporateWellnessView() {
  const label = "text-xs uppercase font-bold tracking-widest text-[#EF8321]";
  const h2 = "font-heading font-bold text-[#004C53]";
  const card = "rounded-3xl bg-white border border-[#004C53]/10 shadow-sm p-6";
  const wrap = "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8";

  return (
    <div className="bg-[#FAF5EC] min-h-screen font-sans text-[#3A4A40]">
      <SEO
        title="Corporate Wellness Program for Healthy, Productive Teams | Shivoham Shiv"
        description="Desk Yoga, Meditation, Pranayama, Mudra and workplace wellness for office, remote and hybrid teams — reduce long-sitting strain, workplace stress and build healthier employees."
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
            Modern employees spend hours sitting at laptops, attending meetings and working on phones — moving far
            less than the body is designed for. Long sitting, continuous screen exposure, workplace pressure, poor
            sleep, irregular eating and low activity gradually affect comfort and long-term wellbeing. The Shivoham
            Shiv Corporate Wellness Program brings practical Yoga, Meditation, breathing practices, Mudra, mobility,
            posture awareness and traditional Indian wellness directly into the work environment.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#EF8321] hover:bg-[#D9741A] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">
              Book a Corporate Wellness Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center px-7 py-4 border-2 border-white/25 text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider rounded-full transition-all">
              Talk to Our Wellness Team →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE REALITY */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className={label}>The Reality</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Modern Workplace. Modern Wellness Challenges.</h2>
          <p className="text-sm text-slate-600 mt-3">Employees commonly experience:</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {REALITY.map((r) => (
            <div key={r} className="flex items-start gap-2.5 rounded-2xl bg-white border border-[#004C53]/10 px-4 py-3 text-sm text-[#004C53]"><span className="text-[#EF8321] mt-0.5">•</span> {r}</div>
          ))}
        </div>
        <p className="text-center text-sm font-semibold text-[#004C53] mt-6">This is not normal wear and tear — it's what a sedentary corporate environment does to the human body.</p>
      </section>

      {/* 3. LONG-TERM RISKS */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className={label}>The Bigger Picture</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Long Sitting Is Not Just About Back Pain</h2>
            <p className="text-sm text-slate-600 mt-3">Over time, a sedentary lifestyle combined with other unhealthy factors may contribute to risk factors associated with:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RISKS.map((r) => (
              <div key={r.t} className="flex items-start gap-2.5 rounded-2xl bg-[#FAF5EC] border border-[#004C53]/10 px-4 py-3 text-sm text-[#004C53]"><span className="text-lg leading-none">{r.e}</span> {r.t}</div>
            ))}
          </div>
          <p className="text-center text-[11px] text-slate-500 leading-relaxed mt-6 max-w-2xl mx-auto">
            Note: working in an office does not automatically cause these diseases. However, prolonged inactivity
            combined with stress, excess body weight, poor nutrition and low physical activity may increase long-term
            health risk.
          </p>
        </div>
      </section>

      {/* 4. WHY THIS MATTERS */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className={label}>Why It Matters</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Why Corporate Wellness Matters</h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-3">
            Employee wellness shouldn't begin only after someone becomes unwell. The goal is to help employees build
            healthier daily habits <em>before</em> sedentary routines become deeply established. The workplace has
            changed — the human body hasn't. A typical working day may involve:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-w-4xl mx-auto mb-8">
          {WORKDAY.map((w) => (
            <div key={w} className="flex items-start gap-2.5 rounded-2xl bg-white border border-[#004C53]/10 px-4 py-3 text-sm text-[#004C53]"><Check className="w-4 h-4 text-[#EF8321] shrink-0 mt-0.5" /> {w}</div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-600 mb-4">The problem isn't just sitting — it's the combination of:</p>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {CYCLE.map((c, i) => (
            <span key={c} className="inline-flex items-center gap-2.5">
              <span className="rounded-full bg-[#EEF6F6] border border-[#004C53]/10 px-4 py-2 text-sm font-semibold text-[#004C53]">{c}</span>
              {i < CYCLE.length - 1 && <span className="text-[#EF8321] font-bold">+</span>}
            </span>
          ))}
        </div>
      </section>

      {/* 5. DETAILED CHALLENGES */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>What Employees Face</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Common Health & Wellness Challenges Among Desk Employees</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CHALLENGES.map((c) => (
              <div key={c.n} className={card}>
                <div className="flex items-center gap-2 mb-2"><span className="font-heading text-lg font-extrabold text-[#EF8321]">{c.n}</span><h3 className="font-heading font-bold text-base text-[#004C53]">{c.t}</h3></div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">{c.effect}</p>
                <p className="text-xs text-[#004C53] flex items-start gap-1.5 border-t border-[#004C53]/10 pt-2"><Check className="w-3.5 h-3.5 text-[#EF8321] shrink-0 mt-0.5" /> <span><span className="font-semibold">Included:</span> {c.sol}</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HEALTH CONNECTIONS */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className={label}>Health Connections</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>From Desk Discomfort to Long-Term Lifestyle Risk</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { t: "Short-Term", d: "Eye strain, neck stiffness, shoulder tightness, back discomfort, tight hips, poor posture, fatigue, stress." },
            { t: "Medium-Term", d: "Reduced fitness, weight gain, more belly fat, poor sleep, persistent musculoskeletal discomfort, lower energy, more stress." },
            { t: "Long-Term Risk Factors", d: "Cardiovascular disease, stroke, hypertension, type 2 diabetes, obesity, metabolic syndrome and other lifestyle-related conditions." },
          ].map((x) => (
            <div key={x.t} className={card}>
              <h3 className="font-heading font-bold text-base text-[#004C53] mb-2">{x.t}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-600 leading-relaxed mt-8 max-w-2xl mx-auto">
          The purpose isn't to promise every illness can be prevented — it's to help employees reduce avoidable
          lifestyle risk factors and build healthier everyday behaviours.
        </p>
      </section>

      {/* 7. WHAT'S INCLUDED */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>What's Included</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>One Program. Multiple Employee Challenges.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INCLUDED.map((c) => (
              <div key={c.t} className="rounded-3xl bg-[#FAF5EC] border border-[#004C53]/10 p-6">
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{c.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. MICRO-BREAK */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className={label}>Small Actions, All Day</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Micro-Break Wellness Throughout the Workday</h2>
          <p className="text-sm text-slate-600 mt-3">Employees don't need a 60-minute session every time they feel stiff — short, intelligent breaks build healthier habits.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MICRO.map((m, i) => (
            <div key={m.time} className="rounded-2xl bg-white border border-[#004C53]/10 p-5 shadow-sm">
              <span className="font-heading text-lg font-extrabold text-[#EF8321]">{i + 1}</span>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#004C53] mt-1">{m.time}</p>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">{m.act}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. TYPICAL SESSION */}
      <section className="bg-[#EEF6F6] border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className={label}>A Typical Session</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>What a Shivoham Shiv Wellness Session Looks Like</h2>
          </div>
          <div className="rounded-3xl bg-white border border-[#004C53]/10 overflow-hidden shadow-sm">
            {SESSION.map((s, i) => (
              <div key={s.a} className={`flex items-center gap-4 px-5 py-3.5 ${i % 2 ? "bg-[#FAF5EC]" : "bg-white"}`}>
                <span className="text-sm font-bold text-[#EF8321] min-w-[64px]">{s.m}</span>
                <span className="text-sm text-[#004C53]">{s.a}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">Duration and structure adapted to your organization.</p>
        </div>
      </section>

      {/* 10. FLEXIBLE STRUCTURES */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className={label}>Flexible Delivery</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Flexible Program Structures</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STRUCTURES.map((s) => (
            <div key={s.t} className={card}>
              <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{s.t}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-600 mt-6">Delivered <span className="font-semibold text-[#004C53]">online, offline or hybrid</span> — for office teams, remote workers and distributed organizations.</p>
      </section>

      {/* 11. ORG BENEFITS */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>For the Organization</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>How Organizations Benefit</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ORGBENEFITS.map((b) => (
              <div key={b.t} className="rounded-3xl bg-[#FAF5EC] border border-[#004C53]/10 p-6">
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{b.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. WHO WE SERVE */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className={label}>Who We Serve</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Corporate Wellness for Every Type of Workplace</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5 mb-8">
          {SERVE.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#004C53] bg-white border border-[#004C53]/10 rounded-full px-3.5 py-1.5"><Check className="w-3.5 h-3.5 text-[#EF8321]" /> {s}</span>
          ))}
        </div>
        <div className="rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-6 sm:p-8 max-w-3xl mx-auto">
          <h3 className="font-heading font-bold text-base text-[#004C53] mb-2">Remote & Hybrid Teams</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Working from home doesn't automatically create a healthier workday — remote employees may sit on beds or
            sofas, work without ergonomic setups, attend back-to-back video meetings and blur work-life boundaries.
            Online sessions let geographically distributed teams participate together and build healthier
            remote-working habits. For organizations across India and international teams worldwide.
          </p>
        </div>
      </section>

      {/* 13. WHY CHOOSE */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>Why Shivoham Shiv</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Why Choose Shivoham Shiv Corporate Wellness?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHYCHOOSE.map((w) => (
              <div key={w.t} className="rounded-2xl bg-[#FAF5EC] border border-[#004C53]/10 p-5">
                <h3 className="font-heading font-bold text-sm text-[#004C53] mb-1.5">{w.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. FAQ */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
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

      {/* 15. EMPLOYEE BENEFITS */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className={label}>What Employees Can Expect</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Benefits Employees May Experience</h2>
            <p className="text-sm text-slate-600 mt-3">With regular participation and healthier daily habits, employees may experience:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EMP_BENEFITS.map((b) => (
              <div key={b} className="flex items-start gap-2.5 rounded-2xl bg-[#FAF5EC] border border-[#004C53]/10 px-4 py-3 text-sm text-[#004C53]"><Check className="w-4 h-4 text-[#EF8321] shrink-0 mt-0.5" /> {b}</div>
            ))}
          </div>
          <p className="text-center text-[11px] text-slate-500 mt-6 max-w-2xl mx-auto">Individual outcomes vary. The program is intended to support healthy lifestyles and does not replace medical care.</p>
        </div>
      </section>

      {/* 16. FINAL CTA */}
      <section className="bg-gradient-to-b from-[#004C53] to-[#003A40] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white">Build a Healthier Workplace With Shivoham Shiv</h2>
          <p className="mt-3 font-heading text-lg text-amber-100">Healthy Employees. Healthier Habits. Stronger Workplaces.</p>
          <p className="mt-4 text-sm sm:text-base text-green-50/85">
            Your employees spend a significant part of their lives working — make those hours healthier. From Desk
            Yoga, mobility, eye wellness and posture to meditation, stress management and healthy-lifestyle education,
            we help organizations integrate practical wellbeing into everyday corporate life — for office, remote and
            hybrid teams across India and worldwide.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 bg-[#EF8321] hover:bg-[#F49B3E] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">
              Book a Wellness Consultation <ArrowRight className="w-4 h-4" />
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

      {/* 17. DISCLAIMER */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-6 sm:p-8">
          <h3 className="font-heading font-bold text-base text-[#004C53] mb-2">Important Wellness Disclaimer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Shivoham Shiv Corporate Wellness Programs are intended for general wellness, movement, mindfulness,
            relaxation, stress management and lifestyle education. The program does not diagnose, treat, cure or
            prevent heart disease, heart attacks, stroke, diabetes, hypertension, sciatica or other medical
            conditions. Employees with existing medical conditions, injuries, persistent pain, serious symptoms or
            cardiovascular concerns should consult a qualified healthcare professional before participating.
          </p>
        </div>
      </section>
    </div>
  );
}
