import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import SEO from "../components/SEO";

const WHAT_IS = [
  "Body points work within a wellness framework",
  "Five-element principles guide point selection",
  "Lifestyle patterns impact wellness outcomes",
  "Traditional observation methods inform case understanding",
  "Structured approaches support chronic wellness cases",
];
const EMPHASIS = ["Practical learning", "Case understanding", "Responsible application", "Professional boundaries", "Appropriate referral"];

const THERAPIES = [
  { e: "🎨", t: "Color Therapy", d: "How selected colours may be used on appropriate Acupressure points or zones within the taught wellness framework." },
  { e: "🌱", t: "Seed Therapy", d: "How selected seeds may be placed and stimulated on appropriate points as part of a complementary Acupressure routine." },
  { e: "🧲", t: "Bio-Magnet Therapy", d: "How magnets may be applied to selected points per the course framework, including basic placement and safety considerations." },
];

const CHRONIC_WELLNESS = [
  "Chronic digestive discomfort", "Acidity & bloating-related concerns", "Long-term neck & shoulder stiffness",
  "Back discomfort", "Joint discomfort", "Stress-related muscular tension", "Sleep-related concerns",
  "Fatigue", "Reduced mobility", "Recurring body stiffness", "Lifestyle-related imbalance",
  "Circulation-related concerns", "Stress & emotional imbalance",
];
const CHRONIC_MEDICAL = ["Diabetes", "Hypertension", "Heart-related conditions", "Thyroid disorders", "Arthritis", "Other long-term conditions"];

const STEPS = [
  { t: "Understand the Complaint", d: "Identify what the person is experiencing and how long it has been present." },
  { t: "Observe the Case", d: "Use face, tongue and nail observation with relevant wellness history." },
  { t: "Understand Lifestyle Factors", d: "Consider stress, sleep, digestion, movement and daily routines." },
  { t: "Select Appropriate Points", d: "Choose suitable Acupressure points within the taught framework." },
  { t: "Choose Supporting Therapy", d: "Decide whether Colour, Seed or Bio-Magnet Therapy may be appropriate." },
  { t: "Apply the Technique", d: "Use correct pressure and application methods." },
  { t: "Observe the Response", d: "Monitor comfort and general response." },
  { t: "Follow Up", d: "Review progress and make appropriate adjustments." },
  { t: "Refer When Required", d: "Recognize when the case needs qualified medical evaluation." },
];

const CONTENT = [
  { t: "Fundamentals & Foundations", items: ["Ayurvedic Acupressure fundamentals", "Five-element concepts", "Marma-related awareness", "Pressure-point identification"] },
  { t: "Observation & Assessment", items: ["Face observation", "Tongue observation", "Nail observation", "Case-history taking", "Case assessment"] },
  { t: "Practical Skills", items: ["Correct pressure techniques", "Acupressure point application", "Chronic wellness case handling"] },
  { t: "Complementary Therapies", items: ["Colour Therapy application", "Seed Therapy techniques", "Bio-Magnet Therapy methods"] },
  { t: "Professional Development", items: ["Contraindications (when NOT to use)", "Red-flag recognition (when to refer)", "Practitioner safety", "Appropriate referral protocols"] },
];

const DELIVERY = [
  { t: "6 Months of Structured Learning", d: "A progressive format giving students time to understand, practise and apply techniques." },
  { t: "4 Live Classes Every Week", d: "Regular guided learning, demonstrations, doubt-clearing and practical case discussion." },
  { t: "Recorded Classes Included", d: "Access recorded sessions for revision, missed classes and repeated practice." },
  { t: "Study Material & PDFs", d: "Structured PDFs covering concepts, pressure points, observation systems, complementary therapies and case notes." },
  { t: "Practical Training", d: "Learn to identify points, apply pressure appropriately and use supporting techniques." },
  { t: "Case-Based Learning", d: "Work through wellness scenarios using observation, point selection, techniques and response monitoring." },
];

const SKILLS = [
  "Identify commonly taught Acupressure points", "Apply correct pressure techniques", "Take a structured wellness case history",
  "Use face, tongue and nail observation", "Understand traditional five-element concepts", "Apply selected Colour Therapy methods",
  "Apply Seed Therapy techniques", "Understand Bio-Magnet Therapy application", "Select appropriate complementary approaches",
  "Work with selected chronic wellness cases", "Monitor response and follow-up", "Recognize contraindications",
  "Identify red-flag symptoms", "Know when professional medical referral is required", "Build responsible practitioner skills",
];

const WHO = [
  { t: "Complete Beginners", d: "Anyone learning Ayurvedic Acupressure from foundation level." },
  { t: "Yoga & Meditation Teachers", d: "Expand your wellness toolkit with case-based practitioner skills." },
  { t: "Wellness Coaches", d: "Develop deeper assessment and chronic-case support capabilities." },
  { t: "Mudra Therapy Practitioners", d: "Add Acupressure to your complementary practice." },
  { t: "Marma Practitioners", d: "Develop broader Ayurvedic wellness understanding." },
  { t: "Holistic Practitioners", d: "Enhance your practice with traditional assessment and complementary therapies." },
  { t: "Ayurveda Enthusiasts", d: "Learn practical applications of Ayurvedic principles." },
  { t: "Physiotherapists", d: "Add complementary Acupressure skills to your practice." },
  { t: "Healthcare Professionals", d: "Develop complementary wellness knowledge within your professional scope." },
  { t: "Massage & Bodywork Pros", d: "Integrate Acupressure and complementary therapies into your practice." },
  { t: "Corporate Wellness Trainers", d: "Learn case-based approaches for workplace wellness." },
  { t: "Homemakers & Family Learners", d: "Develop wellness skills for your family." },
];

const WHY_CHOOSE = [
  { t: "6-Month Practitioner Program", d: "More time to learn, practise and integrate than shorter courses." },
  { t: "Live Training 4 Days a Week", d: "Regular, intensive guided learning with expert instruction." },
  { t: "Recorded Sessions", d: "Flexible learning with the ability to review and practise independently." },
  { t: "Complete Study Material & PDFs", d: "Comprehensive resources you keep." },
  { t: "Practical Point Training", d: "Hands-on learning, not theory alone." },
  { t: "Complete Observation System", d: "Face, tongue and nail observation included." },
  { t: "Multiple Complementary Therapies", d: "Colour, Seed and Bio-Magnet Therapy all taught." },
  { t: "Chronic Wellness Case Learning", d: "Case-based training for long-term wellness situations." },
  { t: "Beginner-Friendly Entry", d: "No prior experience needed." },
  { t: "Case-Based Practitioner Approach", d: "Learn to think like a practitioner, not just apply techniques." },
  { t: "Learn From Anywhere", d: "100% online, global accessibility." },
  { t: "Growing Wellness Community", d: "Join a growing Shivoham Shiv community." },
];

const GLANCE = [
  ["Course Name", "Ayurvedic Acupressure Therapy"], ["Duration", "6 Months"], ["Mode", "Online Live"],
  ["Live Classes", "4 Days Every Week"], ["Recorded Classes", "Included"], ["Study Material / PDFs", "Included"],
  ["Practical Training", "Included"], ["Case-Based Learning", "Included"], ["Face Observation", "Included"],
  ["Tongue Observation", "Included"], ["Nail Observation", "Included"], ["Colour Therapy", "Included"],
  ["Seed Therapy", "Included"], ["Bio-Magnet Therapy", "Included"], ["Chronic Case Learning", "Included"],
  ["Previous Experience", "Not Required"], ["Suitable For", "Beginners & Wellness Professionals"],
];

const COMPARE = [
  ["Learn pressure points", "Learn a complete assessment system"],
  ["Short-term training", "6-month intensive program"],
  ["Theory-focused", "Case-based learning"],
  ["Single technique", "Multiple complementary therapies"],
  ["Limited scope", "Chronic case handling"],
  ["Know the “what”", "Understand the “why” and “when”"],
];

const FAQS = [
  { q: "What is the duration of the course?", a: "The course duration is 6 months." },
  { q: "Is the course online?", a: "Yes. The program is conducted through live online classes." },
  { q: "How many live classes are conducted?", a: "There are 4 live classes every week, providing intensive structured learning." },
  { q: "Are recorded classes included?", a: "Yes. Recorded sessions are provided for revision, missed classes and repeated practice." },
  { q: "Will I receive study material?", a: "Yes. Students receive structured PDFs and study material covering all concepts, points, observation systems, complementary therapies and case notes." },
  { q: "Can beginners join?", a: "Yes. No previous experience is required — the course is designed from foundation level." },
  { q: "Will I learn face, tongue and nail observation?", a: "Yes. These traditional observation methods are core parts of the course. They are taught as wellness-assessment tools and do not replace medical diagnosis or lab testing." },
  { q: "Will I learn Colour, Seed and Bio-Magnet Therapy?", a: "Yes. The program teaches how these complementary techniques may be applied alongside Ayurvedic Acupressure within the taught framework." },
  { q: "Will I learn to handle chronic cases?", a: "Yes — chronic wellness case-based learning is a core focus, helping you assess and support selected long-term cases through Acupressure and complementary therapies. The course does not replace medical treatment for diagnosed chronic diseases." },
  { q: "How does this compare to other Acupressure training?", a: "Unlike courses that teach isolated pressure points, this teaches a complete practitioner system — observation, assessment, case history, multiple complementary therapies and chronic case handling." },
];

const TRUST = [
  "6-month comprehensive training", "4 live classes every week", "Complete assessment system (face + tongue + nail)",
  "3 complementary therapies included", "Chronic case-handling focus", "Practitioner-level skills",
  "No prior experience required", "Learn from anywhere",
];

export default function AcupressureCourseView() {
  const label = "text-xs uppercase font-bold tracking-widest text-[#EF8321]";
  const h2 = "font-heading font-bold text-[#004C53]";
  const card = "rounded-3xl bg-white border border-[#004C53]/10 shadow-sm p-6";
  const wrap = "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8";
  const chip = "inline-flex items-center gap-1.5 rounded-full bg-white border border-[#004C53]/10 px-3.5 py-1.5 text-xs font-medium text-[#004C53]";

  return (
    <div className="bg-[#FAF5EC] min-h-screen font-sans text-[#3A4A40]">
      <SEO
        title="Online Ayurvedic Acupressure Therapy Course & Practitioner Training | Shivoham Shiv"
        description="A 6-month online Ayurvedic Acupressure practitioner course — face/tongue/nail observation, case assessment, Colour, Seed & Bio-Magnet therapy and chronic wellness case handling. Beginners welcome."
        focusKeyword="ayurvedic acupressure course"
        isFAQPage
        faqs={FAQS}
      />

      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#004C53] to-[#003A40] text-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-16 sm:py-24 text-center">
          <span className={`${label} text-amber-300`}>Online Ayurvedic Acupressure Therapy Course</span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight text-white mt-3">
            Learn to Understand Chronic Wellness Cases —<br /><span className="text-amber-300">Not Just Pressure Points</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base font-semibold text-amber-100">
            A 6-month live online practitioner training in Ayurvedic Acupressure.
          </p>
          <p className="mt-5 text-sm sm:text-base text-green-50/85 leading-relaxed">
            Build practical skills to observe, assess and support chronic wellness cases through Ayurvedic Acupressure,
            traditional observation methods and complementary techniques. You'll learn to observe a case, understand
            the wellness pattern, select appropriate points and apply supportive techniques through Colour Therapy,
            Seed Therapy and Bio-Magnet Therapy — with the emphasis on practical learning, case understanding and
            responsible application.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#EF8321] hover:bg-[#D9741A] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">
              Join the Ayurvedic Acupressure Course <ArrowRight className="w-4 h-4" />
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
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Understanding Ayurvedic Acupressure</h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-4">
            Ayurvedic Acupressure is a complementary wellness system that combines pressure-point application with
            traditional Indian wellness concepts. This course helps you understand how:
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {WHAT_IS.map((w) => (
              <div key={w} className="flex items-start gap-2.5 rounded-2xl bg-white border border-[#004C53]/10 px-4 py-3 text-sm text-[#004C53]"><Check className="w-4 h-4 text-[#EF8321] shrink-0 mt-0.5" /> {w}</div>
            ))}
          </div>
          <p className="text-sm text-slate-600 mt-6">The emphasis is on:</p>
          <div className="flex flex-wrap justify-center gap-2.5 mt-3">{EMPHASIS.map((e) => <span key={e} className={chip}>{e}</span>)}</div>
        </div>
      </section>

      {/* 3. OBSERVATION SYSTEM */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className={label}>The USP</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>A Complete Observation & Assessment System</h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-3">A practitioner shouldn't work from a single symptom. You'll learn to understand a person through a structured traditional assessment:</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
            {["Face", "Tongue", "Nail", "Case History", "Lifestyle"].map((s, i, arr) => (
              <span key={s} className="inline-flex items-center gap-2.5">
                <span className="rounded-full bg-[#EEF6F6] border border-[#004C53]/10 px-4 py-2 text-sm font-bold text-[#004C53]">{s}</span>
                {i < arr.length - 1 && <span className="text-[#EF8321] font-bold">+</span>}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed mt-5 max-w-2xl mx-auto">
            These are taught as traditional wellness-assessment tools and do not replace medical diagnosis or
            laboratory testing.
          </p>
          <div className="mt-8 rounded-3xl bg-[#FAF5EC] border border-[#004C53]/10 p-6 text-left max-w-2xl mx-auto">
            <p className="text-xs text-slate-500 mb-1">Instead of "person says X → apply Y point", you learn:</p>
            <p className="text-sm font-semibold text-[#004C53]">Observe face + tongue + nails + history + lifestyle → understand the pattern → select an appropriate approach → apply the technique → monitor response.</p>
          </div>
        </div>
      </section>

      {/* 4. COMPLEMENTARY THERAPIES */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className={label}>Beyond Acupressure</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Multiple Complementary Therapy Approaches</h2>
          <p className="text-sm text-slate-600 mt-3">Learn how selected therapies may be applied alongside Ayurvedic Acupressure:</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {THERAPIES.map((t) => (
            <div key={t.t} className={card}>
              <div className="text-3xl mb-3">{t.e}</div>
              <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{t.t}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.d}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-600 mt-6 max-w-2xl mx-auto">You'll understand which technique may suit different cases, how to apply it correctly, when it should not be used, and how to combine approaches responsibly.</p>
      </section>

      {/* 5. CHRONIC CASE HANDLING */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className={label}>Core Focus</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Chronic Case Handling</h2>
            <p className="text-sm text-slate-600 mt-3">A main objective is developing the skills to work with selected long-term and recurring wellness cases. Case-based learning may include supportive approaches for:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-8">
            {CHRONIC_WELLNESS.map((c) => (
              <div key={c} className="flex items-start gap-2.5 rounded-2xl bg-[#FAF5EC] border border-[#004C53]/10 px-4 py-3 text-sm text-[#004C53]"><Check className="w-4 h-4 text-[#EF8321] shrink-0 mt-0.5" /> {c}</div>
            ))}
          </div>
          <p className="text-sm text-slate-600 mb-3 text-center">Advanced learning also covers how to approach people who already live with chronic medical conditions such as:</p>
          <div className="flex flex-wrap justify-center gap-2.5 mb-8">{CHRONIC_MEDICAL.map((c) => <span key={c} className={chip}>{c}</span>)}</div>
          <div className="rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-6 sm:p-8 max-w-3xl mx-auto">
            <h3 className="font-heading font-bold text-sm text-[#004C53] mb-2">Important boundary</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The course teaches complementary wellness case support. It does not qualify students to independently
              diagnose, cure or replace medical treatment for serious chronic diseases. People with diagnosed heart
              disease, diabetes, hypertension or other chronic conditions should continue appropriate medical care
              while using complementary wellness practices where suitable.
            </p>
          </div>
        </div>
      </section>

      {/* 6. 9-STEP PROCESS */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className={label}>The Practitioner Process</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>How You'll Approach a Case — 9 Steps</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <div key={s.t} className={card}>
              <span className="font-heading text-xl font-extrabold text-[#EF8321]">{i + 1}</span>
              <h3 className="font-heading font-bold text-sm text-[#004C53] mt-1 mb-1.5">{s.t}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. WHAT YOU WILL LEARN */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>Complete Curriculum</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>What You Will Learn</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONTENT.map((c) => (
              <div key={c.t} className={card}>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-3">{c.t}</h3>
                <ul className="space-y-1.5">
                  {c.items.map((it) => <li key={it} className="flex items-start gap-2 text-xs text-[#004C53]"><Check className="w-3.5 h-3.5 text-[#EF8321] shrink-0 mt-0.5" /> {it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. DELIVERY */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className={label}>How You'll Learn</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Course Format & Delivery</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DELIVERY.map((d) => (
            <div key={d.t} className={card}>
              <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{d.t}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{d.d}</p>
            </div>
          ))}
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
          <p className="text-sm text-slate-600 mt-3">No previous Acupressure experience is required. This course is suitable for:</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHO.map((w) => (
            <div key={w.t} className={card}>
              <h3 className="font-heading font-bold text-sm text-[#004C53] mb-1.5">{w.t}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. WHY CHOOSE */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>Why Shivoham Shiv</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Why Choose This Training?</h2>
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

      {/* 12. WHAT MAKES IT DIFFERENT */}
      <section className={`py-16 sm:py-20 ${wrap}`}>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className={label}>The Difference</span>
          <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Not Just Pressure Points — A Complete System</h2>
        </div>
        <div className="max-w-3xl mx-auto rounded-3xl border border-[#004C53]/10 bg-white overflow-hidden shadow-sm">
          <div className="grid grid-cols-2 bg-[#004C53] text-white text-xs font-bold uppercase tracking-wider">
            <div className="px-4 py-3">Generic Course</div>
            <div className="px-4 py-3 border-l border-white/15">Shivoham Shiv Program</div>
          </div>
          {COMPARE.map(([a, b], i) => (
            <div key={a} className={`grid grid-cols-2 text-sm ${i % 2 ? "bg-[#FAF5EC]" : "bg-white"}`}>
              <div className="px-4 py-3 text-slate-500">{a}</div>
              <div className="px-4 py-3 border-l border-[#004C53]/10 text-[#004C53] font-medium">{b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 13. AT A GLANCE */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className={`${h2} text-2xl sm:text-3xl text-center mb-8`}>Course at a Glance</h2>
          <div className="rounded-3xl border border-[#004C53]/10 bg-[#FAF5EC] overflow-hidden">
            {GLANCE.map(([k, v], i) => (
              <div key={k} className={`flex flex-wrap gap-x-3 px-5 py-3 ${i % 2 ? "bg-white" : "bg-[#FAF5EC]"}`}>
                <span className="text-sm font-bold text-[#EF8321] sm:min-w-[200px]">{k}</span>
                <span className="text-sm text-[#004C53]">{v}</span>
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

      {/* 15. FINAL CTA */}
      <section className="bg-gradient-to-b from-[#004C53] to-[#003A40] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white">Start Your Practitioner Journey</h2>
          <p className="mt-3 font-heading text-lg text-amber-100">Learn to Understand Cases — Not Just Pressure Points</p>
          <p className="mt-4 text-sm sm:text-base text-green-50/85">
            Join the 6-month online Ayurvedic Acupressure Therapy Course and build practical skills in traditional
            assessment, Acupressure application and complementary wellness techniques.
          </p>
          <p className="mt-4 text-xs text-green-50/70">6 Months | Online Live | 4 Classes/Week | Recorded Sessions | PDFs & Study Material | Practical & Case-Based Learning</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 bg-[#EF8321] hover:bg-[#F49B3E] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">
              Join the Ayurvedic Acupressure Course <ArrowRight className="w-4 h-4" />
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

      {/* 16. DISCLAIMER */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-6 sm:p-8">
          <h3 className="font-heading font-bold text-base text-[#004C53] mb-2">Important Wellness & Medical Disclaimer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Shivoham Shiv Ayurvedic Acupressure Course is intended for wellness education and complementary
            practice. Ayurvedic Acupressure does not replace medical diagnosis, prescribed medication, professional
            medical treatment or clinical healthcare. The program teaches complementary wellness support for selected
            chronic conditions and does not qualify students to independently diagnose, cure or replace medical
            treatment for serious chronic diseases — people with diagnosed conditions should continue appropriate
            medical care. Face, tongue and nail observation are taught as traditional wellness-assessment tools and do
            not replace medical diagnosis or laboratory testing.
          </p>
        </div>
      </section>
    </div>
  );
}
