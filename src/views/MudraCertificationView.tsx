import { Link } from "react-router-dom";
import { ArrowRight, Check, AlertTriangle } from "lucide-react";
import SEO from "../components/SEO";

const ALONGSIDE = ["Yoga", "Meditation", "Pranayama", "Mindfulness", "Relaxation practices", "Traditional Indian wellness routines"];
const ELEMENTS = ["Earth", "Water", "Fire", "Air", "Space"];

const STUDENTS_LEARN = [
  "How a Mudra is traditionally practised",
  "When it may be appropriate",
  "How it integrates into broader wellness routines",
  "How to guide others responsibly",
  "When medical help is required",
];

const WHY_LEARN = [
  "Correct finger positioning", "Hand placement", "Appropriate pressure", "Body posture", "Breathing",
  "Practice duration", "Traditional applications", "Common mistakes", "Precautions", "Case-based application",
  "How to guide another person responsibly", "When Mudra Therapy may be appropriate", "When professional medical help is required",
];

const FORMAT = [
  ["Duration", "3 Months"],
  ["Mode", "Online Live Training"],
  ["Live Classes", "3 Classes Every Week"],
  ["Recorded Classes", "Included"],
  ["Study Material", "Included"],
  ["Practical Training", "Included"],
  ["Case-Based Learning", "Included"],
  ["Emergency Support Awareness", "Included"],
];

const LEARNING_AREAS = [
  { t: "Foundations of Mudra Therapy", d: "Meaning and traditional background of Mudras, the role of Hasta Mudras in Yoga, traditional energetic concepts, five-element theory and the importance of posture, breathing and basic practice guidelines." },
  { t: "Understanding the Five Elements", d: "How different fingers are traditionally associated with Earth, Water, Fire, Air and Space — and how different Mudras are understood within this framework." },
  { t: "Correct Mudra Technique", d: "Practical guidance on finger placement, contact points, hand pressure and relaxation, sitting posture, breath awareness, practice duration and common positioning mistakes." },
  { t: "Mudras for Everyday Wellness", d: "Mudras traditionally incorporated into routines for stress management, relaxation, mental calmness, meditation, concentration, sleep preparation, general digestive wellness, emotional balance and daily Yoga — taught as complementary wellness practices, not replacements for medical treatment." },
];

const EMERGENCY_CONFIDENCE = [
  "Stay calm during an urgent situation",
  "Help a conscious person remain calm",
  "Guide suitable breathing practices",
  "Use selected calming Mudras where appropriate",
  "Provide grounding and relaxation support",
  "Observe how the person is responding",
  "Recognize warning signs",
  "Understand when professional medical help is required",
];

const URGENT_SITUATIONS = [
  "Sudden emotional stress", "Panic or anxiety-related restlessness", "Stress-related rapid breathing",
  "Sudden general weakness", "Mental overwhelm", "Fear or nervousness",
  "Situations where calming and grounding support may help",
];

const RED_FLAGS = [
  "Chest pain", "Suspected heart attack", "Stroke symptoms", "Severe breathing difficulty",
  "Loss of consciousness", "Seizure", "Heavy bleeding", "Serious injury", "Severe allergic reaction", "Sudden weakness or paralysis",
];

const CANNOT_REPLACE = ["CPR", "Emergency medication", "Ambulance services", "Hospital treatment", "Medical diagnosis"];

const CHRONIC_ROUTINES = ["Relaxation", "Meditation", "Mindfulness", "Breath awareness", "Sleep preparation", "Emotional wellbeing", "Lifestyle balance"];

const SKILLS = [
  "Identify commonly taught Hasta Mudras", "Perform Mudras correctly", "Understand their traditional purposes",
  "Select suitable Mudras for general wellness routines", "Correct common positioning mistakes", "Guide basic Mudra practices",
  "Combine Mudras with breathing and Meditation", "Create personal wellness routines", "Support relaxation and stress-management practices",
  "Incorporate Mudras into Yoga or Meditation sessions", "Work with selected non-emergency wellness situations",
  "Provide appropriate calming support during suitable urgent situations", "Recognize red-flag symptoms",
  "Understand when emergency medical help is necessary", "Refer people to qualified professionals when required",
  "Develop responsible complementary wellness practitioner skills",
];

const WHO = [
  { t: "Complete Beginners", d: "Anyone interested in learning Mudra Therapy properly from foundation level." },
  { t: "Yoga Teachers & Instructors", d: "Add Mudra knowledge to Yoga, Pranayama, Meditation and relaxation practices." },
  { t: "Meditation Teachers", d: "Learn how selected Mudras may be appropriately integrated into Meditation." },
  { t: "Wellness Coaches", d: "Develop additional complementary wellness knowledge." },
  { t: "Holistic Wellness Practitioners", d: "Expand your traditional Indian wellness skill set." },
  { t: "Acupressure & Marma Practitioners", d: "Add Mudra Therapy as a complementary practice." },
  { t: "Ayurveda Enthusiasts", d: "Explore Mudras alongside the five-element framework and holistic principles." },
  { t: "Corporate Wellness Trainers", d: "Learn Mudra, breathing and calming practices for appropriate workplace sessions." },
  { t: "Healthcare Professionals", d: "Study Mudra Therapy as additional complementary wellness knowledge (without replacing clinical qualifications)." },
  { t: "Teachers & Educators", d: "Learn concentration, relaxation and mindfulness practices for suitable environments." },
  { t: "Homemakers & Family Enthusiasts", d: "Develop Mudra knowledge for personal and family wellness." },
  { t: "Senior Learners", d: "Many Mudras can be performed seated and require very little space." },
];

const STEPS = [
  "Understand foundations — traditional concepts & five-element principles",
  "Learn correct techniques — finger placement, posture & breathing",
  "Attend live classes — guided practical learning 3× a week",
  "Practise & revise — recorded classes and study material",
  "Learn practical applications — how Mudras fit into wellness routines",
  "Study case-based situations — think through practical scenarios",
  "Understand emergency support — calming techniques & red-flag awareness",
  "Learn practitioner boundaries — when professional referral is necessary",
];

const WHY_CHOOSE = [
  { t: "Structured Learning", d: "An organized program instead of disconnected online videos." },
  { t: "Practical Training", d: "Learn how Mudras are actually performed and applied." },
  { t: "Live Guidance", d: "Regular live online classes with doubt-clearing." },
  { t: "Case-Based Learning", d: "Understand how Mudras fit into different practical situations." },
  { t: "Emergency Support Awareness", d: "Appropriate calming practices and when professional emergency help is necessary." },
  { t: "Beginner-Friendly", d: "Start even with no previous Mudra experience." },
  { t: "Professional Development", d: "Wellness professionals can expand their complementary knowledge." },
  { t: "Flexible Online Learning", d: "Attend live classes and use recorded sessions for revision." },
  { t: "Traditional Foundation", d: "Learn Hasta Mudras within the wider context of Yoga, Meditation and Pranayama." },
  { t: "Responsible Practitioner Training", d: "Emphasis on knowing when to support and when to refer." },
  { t: "Growing Wellness Community", d: "Become part of a growing Shivoham Shiv wellness community." },
];

const GLANCE = [
  ["Course Name", "Mudra Therapy"],
  ["Duration", "3 Months"],
  ["Mode", "Online Live Training"],
  ["Live Classes", "3 Classes Every Week"],
  ["Recorded Classes", "Included for Revision"],
  ["Study Material", "Included"],
  ["Practical Training", "Included"],
  ["Case-Based Learning", "Included"],
  ["Emergency Support Awareness", "Included"],
  ["Previous Experience", "Not Required"],
  ["Suitable For", "Beginners & Wellness Professionals"],
  ["Location", "Learn From Anywhere"],
];

const FAQS = [
  { q: "What is the duration of the Mudra Therapy Course?", a: "The course duration is 3 months." },
  { q: "Is the course online?", a: "Yes. The program is delivered entirely online." },
  { q: "How many live classes are there?", a: "There are 3 live classes every week." },
  { q: "Are recorded classes included?", a: "Yes. Recorded classes are provided for revision and flexible learning." },
  { q: "Is study material provided?", a: "Yes. Structured study material is included to support learning." },
  { q: "Can beginners join?", a: "Yes. No previous Mudra Therapy experience is required." },
  { q: "Who can join the course?", a: "Beginners, Yoga and Meditation teachers, wellness coaches, holistic practitioners, Acupressure and Marma practitioners, corporate wellness trainers, healthcare professionals interested in complementary wellness, homemakers and aspiring practitioners." },
  { q: "Will I learn Mudras for urgent or emergency situations?", a: "The course covers how selected Mudras, breathing and calming techniques may be used as supportive wellness measures during appropriate urgent situations. You also learn to identify red-flag symptoms and understand when professional emergency medical care is required." },
  { q: "Can Mudra Therapy replace emergency treatment?", a: "No. Medical emergencies require immediate professional treatment. Mudra Therapy must not delay emergency services, CPR, necessary medication or hospital care." },
  { q: "Can I work with chronic wellness cases?", a: "You develop complementary wellness skills for selected non-emergency situations. The course does not qualify students to diagnose or medically treat chronic diseases." },
];

const TRUST = [
  "Structured 3-month program",
  "No previous experience required",
  "Beginner-friendly training",
  "Live expert guidance",
  "Practical case-based learning",
  "Responsible practitioner training",
  "Learn from anywhere",
];

export default function MudraCertificationView() {
  const label = "text-xs uppercase font-bold tracking-widest text-[#EF8321]";
  const h2 = "font-heading font-bold text-[#004C53]";
  const card = "rounded-3xl bg-white border border-[#004C53]/10 shadow-sm p-6";
  const wrap = "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8";
  const chip = "inline-flex items-center gap-1.5 rounded-full bg-white border border-[#004C53]/10 px-3.5 py-1.5 text-xs font-medium text-[#004C53]";

  return (
    <div className="bg-[#FAF5EC] min-h-screen font-sans text-[#3A4A40]">
      <SEO
        title="Online Mudra Therapy Course & Practitioner Training | Shivoham Shiv"
        description="A structured 3-month online Mudra Therapy course — traditional Hasta Mudras, correct technique, everyday wellness, case-based learning, emergency-support awareness and responsible practitioner training. Beginners welcome."
        focusKeyword="mudra therapy course"
        isFAQPage
        faqs={FAQS}
      />

      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#004C53] to-[#003A40] text-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-16 sm:py-24 text-center">
          <span className={`${label} text-amber-300`}>Online Mudra Therapy Course & Practitioner Training</span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight text-white mt-3">
            Learn Traditional Hasta Mudras for<br /><span className="text-amber-300">Wellness & Responsible Practice</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base font-semibold text-amber-100">
            Wellness · Practitioner Practice · Appropriate Emergency-Support Awareness
          </p>
          <p className="mt-5 text-sm sm:text-base text-green-50/85 leading-relaxed">
            Build practical knowledge of Mudra Therapy through a structured 3-month online live training program —
            traditional Hasta Mudras, correct hand positioning, breathing techniques, practical applications,
            case-based learning and responsible practitioner use. A key highlight is learning how selected Mudras and
            calming practices may be used as supportive techniques during appropriate urgent situations, while
            understanding when immediate medical care is necessary.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#EF8321] hover:bg-[#D9741A] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">
              Join the Mudra Therapy Course <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center px-7 py-4 border-2 border-white/25 text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider rounded-full transition-all">
              Talk to Our Course Advisor →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. WHAT IS */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="max-w-3xl mx-auto text-center">
          <span className={label}>The Practice</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Understanding Mudra Therapy</h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-4">
            Mudra Therapy is a traditional Indian wellness practice based on specific positions and combinations of the
            hands and fingers. The Sanskrit word <em>Mudra</em> means a gesture, seal or symbolic hand position.
            Hasta Mudras have traditionally been practised alongside:
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 mt-5">{ALONGSIDE.map((a) => <span key={a} className={chip}>{a}</span>)}</div>
          <p className="text-sm text-slate-600 leading-relaxed mt-6">Traditional systems explain finger combinations through the five-element concept:</p>
          <div className="flex flex-wrap justify-center gap-2.5 mt-3">{ELEMENTS.map((e) => <span key={e} className="inline-flex rounded-full bg-[#EEF6F6] border border-[#004C53]/10 px-4 py-1.5 text-xs font-bold text-[#004C53]">{e}</span>)}</div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {STUDENTS_LEARN.map((s) => (
              <div key={s} className="flex items-start gap-2.5 rounded-2xl bg-white border border-[#004C53]/10 px-4 py-3 text-sm text-[#004C53]"><Check className="w-4 h-4 text-[#EF8321] shrink-0 mt-0.5" /> {s}</div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY STRUCTURED */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className={label}>Why It Matters</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Why Learn Mudra Therapy Through Structured Training?</h2>
            <p className="text-sm text-slate-600 mt-3">Copying a hand position from an image doesn't mean you understand Mudra Therapy. Proper training helps you learn:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {WHY_LEARN.map((w) => (
              <div key={w} className="flex items-start gap-2.5 rounded-2xl bg-[#FAF5EC] border border-[#004C53]/10 px-4 py-3 text-sm text-[#004C53]"><span className="text-[#EF8321] mt-0.5">•</span> {w}</div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center">
            <span className="rounded-full bg-white border border-[#004C53]/10 px-4 py-2 text-sm font-semibold text-slate-500">Random Mudra Practice</span>
            <span className="text-[#EF8321] font-bold">→</span>
            <span className="rounded-full bg-[#004C53] text-white px-4 py-2 text-sm font-semibold">Structured, Practical & Responsible Application</span>
          </div>
        </div>
      </section>

      {/* 4. COURSE HIGHLIGHTS */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className={label}>Course Highlights</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>What You'll Get in This 3-Month Program</h2>
          </div>
          <div className="rounded-3xl border border-[#004C53]/10 bg-white shadow-sm p-6 sm:p-8">
            <dl className="space-y-2.5">
              {FORMAT.map(([k, v]) => (
                <div key={k} className="flex flex-wrap items-baseline gap-x-2 border-b border-[#004C53]/10 pb-2.5 last:border-0 last:pb-0">
                  <dt className="text-sm font-bold text-[#EF8321] sm:min-w-[210px]">{k}:</dt>
                  <dd className="text-sm text-[#004C53]">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-center text-xs sm:text-sm font-semibold text-slate-600 mt-6">3 Months | Online | 3 Live Classes/Week | Recorded Sessions | Study Material Included</p>
          </div>
        </div>
      </section>

      {/* 5. CORE LEARNING AREAS */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>What You Will Learn</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Core Learning Areas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LEARNING_AREAS.map((a, i) => (
              <div key={a.t} className={card}>
                <span className="font-heading text-xl font-extrabold text-[#EF8321]">{i + 1}</span>
                <h3 className="font-heading font-bold text-base text-[#004C53] mt-1 mb-1.5">{a.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{a.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EMERGENCY SUPPORT AWARENESS */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className={label}>A Key Highlight</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Mudra Therapy for Appropriate Emergency Support</h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-3">
            A key part of this program is understanding how selected Mudras, breathing practices and calming techniques
            may be used as <strong>supportive wellness measures</strong> during suitable urgent situations. After
            training, students can develop greater confidence to:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl mx-auto">
          {EMERGENCY_CONFIDENCE.map((c) => (
            <div key={c} className="flex items-start gap-2.5 rounded-2xl bg-white border border-[#004C53]/10 px-4 py-3 text-sm text-[#004C53]"><Check className="w-4 h-4 text-[#EF8321] shrink-0 mt-0.5" /> {c}</div>
          ))}
        </div>
        <p className="text-center font-heading font-bold text-base text-[#004C53] mt-8">The most important skill is knowing when to support — and when to refer.</p>
        <p className="text-center text-sm text-slate-600 mt-2 max-w-2xl mx-auto">Responsible Mudra Therapy is not only about techniques — it's about understanding your limits. Case-based learning may include appropriate supportive situations such as:</p>
        <div className="flex flex-wrap justify-center gap-2.5 mt-5">{URGENT_SITUATIONS.map((u) => <span key={u} className={chip}>{u}</span>)}</div>
      </section>

      {/* 7. DOES NOT REPLACE EMERGENCY CARE */}
      <section className="bg-[#6E1B12] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-amber-200"><AlertTriangle className="w-4 h-4" /> Critical</span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mt-2">Mudra Therapy Does Not Replace Emergency Medical Care</h2>
            <p className="text-sm text-white/85 leading-relaxed mt-3">Mudra Therapy must never delay professional emergency treatment. These symptoms require <strong>immediate</strong> professional medical help:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
            {RED_FLAGS.map((r) => (
              <div key={r} className="flex items-start gap-2.5 rounded-2xl bg-white/[0.08] border border-white/15 px-4 py-3 text-sm text-white"><span className="shrink-0">🚨</span> {r}</div>
            ))}
          </div>
          <p className="text-center text-sm text-white/85 mb-3">In these situations, Mudra Therapy cannot replace:</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {CANNOT_REPLACE.map((c) => <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs font-medium text-white">✕ {c}</span>)}
          </div>
          <p className="text-center text-xs text-white/70 leading-relaxed mt-8 max-w-2xl mx-auto">
            Selected Mudras may only be used as supportive calming practices where appropriate <em>while professional
            help is being arranged</em>. Red-flag recognition and appropriate referral are part of this course.
          </p>
        </div>
      </section>

      {/* 8. CHRONIC WELLNESS CASES */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="max-w-3xl mx-auto text-center">
          <span className={label}>Complementary Support</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Chronic Wellness Cases</h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-3">
            The course introduces how Mudra Therapy can be incorporated into <strong>supportive routines</strong> for
            people living with long-term conditions — who may also experience stress, poor sleep, mental fatigue, low
            energy, general digestive discomfort or emotional imbalance. Supportive routines may involve:
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 mt-5">{CHRONIC_ROUTINES.map((c) => <span key={c} className={chip}>{c}</span>)}</div>
          <div className="mt-8 rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-6 text-left">
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-[#004C53]">Important:</span> the focus is complementary wellness support,
              not medical diagnosis or disease treatment. People with diagnosed chronic diseases should continue
              appropriate medical treatment. The course does not qualify students to diagnose or medically treat
              chronic diseases.
            </p>
          </div>
        </div>
      </section>

      {/* 9. SKILLS */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>After the Course</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Skills You Will Develop</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {SKILLS.map((s) => (
              <div key={s} className="flex items-start gap-2.5 rounded-2xl bg-[#FAF5EC] border border-[#004C53]/10 px-4 py-3 text-sm text-[#004C53]"><Check className="w-4 h-4 text-[#EF8321] shrink-0 mt-0.5" /> {s}</div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. WHO CAN JOIN */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className={label}>Who Can Join</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Beginners & Wellness Professionals</h2>
          <p className="text-sm text-slate-600 mt-3">No previous Mudra Therapy experience is required. This course is suitable for:</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHO.map((w) => (
            <div key={w.t} className={card}>
              <h3 className="font-heading font-bold text-sm text-[#004C53] mb-1.5">{w.t}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{w.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <div className="rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-6">
            <h3 className="font-heading font-bold text-sm text-[#004C53] mb-3">You do NOT need</h3>
            <ul className="space-y-1.5">{["Previous Mudra Therapy knowledge", "Medical training", "Advanced Yoga experience", "Ayurveda or Meditation certification"].map((x) => <li key={x} className="flex items-start gap-2 text-xs text-slate-600"><span className="text-red-400">✕</span> {x}</li>)}</ul>
          </div>
          <div className="rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-6">
            <h3 className="font-heading font-bold text-sm text-[#004C53] mb-3">You should have</h3>
            <ul className="space-y-1.5">{["Interest in wellness", "Willingness to learn", "Commitment to regular practice", "Respect for safety & responsible boundaries"].map((x) => <li key={x} className="flex items-start gap-2 text-xs text-[#004C53]"><Check className="w-3.5 h-3.5 text-[#EF8321] shrink-0 mt-0.5" /> {x}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* 11. HOW IT WORKS */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>How It Works</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Learn Through Live Classes, Practice & Revision</h2>
            <p className="text-sm text-slate-600 mt-3">Three months of structured training with 3 live classes weekly, recorded sessions and study material.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-start gap-3 rounded-2xl bg-[#FAF5EC] border border-[#004C53]/10 px-4 py-3">
                <span className="font-heading font-bold text-[#EF8321] shrink-0">{i + 1}.</span>
                <span className="text-sm text-[#004C53]">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. TWO PATHWAYS */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className={label}>Two Pathways</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Learn for Yourself, or to Guide Others</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className={card}>
            <h3 className="font-heading font-bold text-base text-[#004C53] mb-2">Learn for Yourself</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Build a structured personal Mudra practice around meditation, relaxation, mindfulness, breath awareness and daily wellness routines.</p>
          </div>
          <div className={card}>
            <h3 className="font-heading font-bold text-base text-[#004C53] mb-2">Learn to Guide Others</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Existing wellness professionals develop Mudra knowledge that complements their practice — with an emphasis on responsible use, safety and appropriate referral.</p>
          </div>
        </div>
      </section>

      {/* 13. WHY CHOOSE */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>Why Shivoham Shiv</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Why Choose Shivoham Shiv Mudra Training?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_CHOOSE.map((w) => (
              <div key={w.t} className="rounded-2xl bg-[#FAF5EC] border border-[#004C53]/10 p-5">
                <h3 className="font-heading font-bold text-sm text-[#004C53] mb-1.5">{w.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. AT A GLANCE */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="max-w-2xl mx-auto">
          <h2 className={`${h2} text-2xl sm:text-3xl text-center mb-8`}>Course at a Glance</h2>
          <div className="rounded-3xl border border-[#004C53]/10 bg-white overflow-hidden shadow-sm">
            {GLANCE.map(([k, v], i) => (
              <div key={k} className={`flex flex-wrap gap-x-3 px-5 py-3.5 ${i % 2 ? "bg-[#FAF5EC]" : "bg-white"}`}>
                <span className="text-sm font-bold text-[#EF8321] sm:min-w-[210px]">{k}</span>
                <span className="text-sm text-[#004C53]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. FAQ */}
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

      {/* 16. FINAL CTA */}
      <section className="bg-gradient-to-b from-[#004C53] to-[#003A40] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white">Start Your Mudra Therapy Journey</h2>
          <p className="mt-3 font-heading text-lg text-amber-100">Learn Traditional Mudras. Develop Practical Skills. Respond Responsibly.</p>
          <p className="mt-4 text-sm sm:text-base text-green-50/85">
            Move beyond random Mudra images and short videos. Learn traditional Hasta Mudras through structured live
            training, practical demonstrations, case-based learning and guided practice.
          </p>
          <ul className="mt-6 inline-block text-left space-y-2">
            {["3 Months of Structured Training", "3 Live Classes Every Week", "Recorded Classes & Study Material", "Practical & Case-Based Learning", "Chronic-Wellness Support Education", "Emergency-Support Awareness", "For Beginners & Wellness Professionals"].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-green-50/90"><Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" /> {f}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 bg-[#EF8321] hover:bg-[#F49B3E] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">
              Join the Mudra Therapy Course <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 bg-white text-[#004C53] hover:bg-green-50 font-bold text-xs uppercase tracking-wider rounded-full transition-all">
              Talk to Our Course Advisor →
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
          <h3 className="font-heading font-bold text-base text-[#004C53] mb-2">Important Wellness & Medical Disclaimer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Shivoham Shiv Mudra Therapy Course is intended for education and complementary wellness practice. Mudra
            Therapy does not replace medical diagnosis, prescribed medication, emergency medical treatment, CPR,
            hospital care or professional healthcare. The emergency-support component teaches appropriate calming
            practices, red-flag recognition and responsible referral. Anyone experiencing a medical emergency should
            receive immediate professional medical assistance.
          </p>
        </div>
      </section>
    </div>
  );
}
