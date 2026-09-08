import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import SEO from "../components/SEO";

const SIGNS = [
  { e: "📚", t: "Study-Time Distractions", d: "Losing interest within minutes and constantly looking away from books.", flag: "Can't sustain focus for even 15–20 minutes on one task." },
  { e: "📱", t: "High Screen Time", d: "Mental fatigue, restlessness and irritability when screens are turned off.", flag: "Strong reaction to screen limits; hard to engage with non-digital activities." },
  { e: "🧠", t: "Retention Difficulties", d: "Forgetting recently learned lessons due to divided attention rather than poor comprehension.", flag: "Understands something, but can't recall it days later." },
  { e: "😭", t: "Emotional Overwhelm", d: "Meltdowns during homework, exam anxiety and difficulty settling down for sleep.", flag: "Overreacts to small frustrations; takes a long time to calm down." },
  { e: "⚡", t: "Hyperactive Restlessness", d: "Difficulty sitting calmly or listening through multi-step instructions.", flag: "Fidgeting, interrupting, difficulty following through on requests." },
];

const CHAIN = [
  { s: "Awareness", ch: "Distractions prevent initial noticing", tool: "Focus & observation drills strengthen noticing" },
  { s: "Sustained Attention", ch: "Mind wanders to screens or worries", tool: "Pranayama & breathing build attention stamina" },
  { s: "Deep Processing", ch: "Overwhelm prevents deep thinking", tool: "Meditation clears mental clutter" },
  { s: "Retention", ch: "Attention gaps prevent encoding", tool: "Emotional calm supports memory encoding" },
  { s: "Confident Recall", ch: "Exam anxiety blocks memory access", tool: "Emotional regulation enables retrieval" },
];

const PILLARS = [
  { p: "Playful Kids Yoga", fmt: "Animal postures & balancing movements", ben: "Better motor control, posture and physical calm" },
  { p: "Pranayama & Breathwork", fmt: "Balloon breathing, bumblebee hums", ben: "Calms restless nervous systems before study time" },
  { p: "Guided Visual Meditation", fmt: "Sensory stories & sound awareness", ben: "Lowers mental clutter and eases test anxiety" },
  { p: "Focus & Observation Drills", fmt: "Spot-the-detail & mindful-listening games", ben: "Lengthens attention span and active listening" },
  { p: "Emotional Regulation", fmt: "Identifying feelings without tantrums", ben: "Healthier self-expression and resilience" },
  { p: "Mindful Study Architecture", fmt: "Pre-homework sensory resets", ben: "Smooth shift from playtime to focused learning" },
];

const ROUTINE = [
  { e: "🏃", n: "Move", dur: "60 sec", act: "Gentle stretching or balancing to release restless energy.", why: "Burns off excess energy so the child can sit calmly." },
  { e: "🌬️", n: "Breathe", dur: "2–3 min", act: "Three slow belly breaths — inhale 4 counts, exhale 6 counts.", why: "Shifts the nervous system from 'play' to 'calm focus'." },
  { e: "🎯", n: "Anchor", dur: "1–2 min", act: "A mindful pause: look at the task and say 'I'm ready to learn about this.'", why: "Creates a mental commitment and transitions attention." },
  { e: "📖", n: "Learn", dur: "20–25 min", act: "Screens away; read or work in a distraction-free block.", why: "The optimal attention window for children; protects focus." },
  { e: "💭", n: "Recall", dur: "2–3 min", act: "Explain one concept learned, in their own words.", why: "Moves information into long-term memory; confirms understanding." },
  { e: "🌟", n: "Acknowledge", dur: "1–2 min", act: "Celebrate the effort — 'You stayed calm for 25 minutes!' — not just grades.", why: "Builds intrinsic motivation and resilience." },
];

const BEFORE = [
  "Restless during study sessions",
  "Agitation and tantrums over homework",
  "Mind wanders continuously to screens",
  "Overwhelmed and fatigued by schoolwork",
  "Exam anxiety and test panic",
  "Difficulty falling asleep despite tiredness",
  "Frequent emotional meltdowns",
  "“I'm not smart enough” mindset",
];

const AFTER = [
  "Calmer posture and more sustained attention",
  "Emotional composure and healthy self-expression",
  "More awareness of distractions and ability to refocus",
  "Balanced mental energy and steady learning confidence",
  "Calmer confidence during assessments",
  "More peaceful bedtime routine and better sleep",
  "Healthier ways to express and process feelings",
  "A growth mindset and confidence in learning",
];

const AUDIENCE = [
  { e: "📱", t: "Screen-Time Struggle", d: "Children 6–14 needing help navigating screen-time distractions.", helps: "Builds alternative calming skills; reduces screen dependency." },
  { e: "😰", t: "Academic Anxiety", d: "Students experiencing exam-related anxiety, stress or self-doubt.", helps: "Emotional regulation, confidence building, test-anxiety relief." },
  { e: "📚", t: "Study Resistance", d: "Children who find traditional stationary study routines hard to sustain.", helps: "Makes learning enjoyable; builds stamina gradually." },
  { e: "💭", t: "Emotional Development", d: "Parents seeking a balanced, non-competitive space for growth.", helps: "Whole-child development and emotional resilience." },
  { e: "🌱", t: "High-Sensitivity Children", d: "Children who are sensitive, introverted or easily overwhelmed.", helps: "A safe space to develop calm and confidence." },
];

const FAQS = [
  { q: "Does this program promise immediate improvement in school grades?", a: "No. No program can realistically guarantee grades. We focus on foundational skills — concentration, emotional poise and mental calm — which create an optimal mindset for learning. Better focus often leads to improved performance over time, but the goal is healthy learning habits, not grade guarantees." },
  { q: "Is this academic tutoring or a coaching class?", a: "No. It's a holistic wellness and focus program based on Yoga, breathing and mindfulness. It complements schooling by teaching children how to direct attention and manage emotions. For subject help (maths, language, etc.), tutoring is still recommended." },
  { q: "Can parents practise these techniques at home?", a: "Yes — we strongly encourage it. Parents get simple, fun micro-routines (pre-study breathing, bedtime relaxation) that reinforce healthy habits at home. Family participation accelerates results and makes them last." },
  { q: "How are sessions structured for younger children (6–8)?", a: "Interactive, story-led and movement-based — we don't ask children to sit rigidly in silence. Mindfulness is taught through movement, breathing games, sensory exercises and imagination. Older children (9–14) get more structured, peer-interactive practices." },
  { q: "What if my child is very active or hyperactive?", a: "Active children often benefit most, because we channel their energy productively. We start with movement-based practices and gradually build toward stillness — the playful structure works well for high-energy kids." },
  { q: "Is this suitable for shy or introverted children?", a: "Absolutely. Many shy children thrive because there's no performance pressure. Sessions include partner and solo activities in a safe, non-competitive environment where everyone feels comfortable." },
];

const COMPONENTS = [
  { t: "Age-Appropriate Kids Yoga", d: "Playful animal postures and balancing movements that improve coordination, flexibility and physical calm — no performance pressure." },
  { t: "Breathing Techniques (Pranayama)", d: "Balloon breathing, bumblebee hums and other child-friendly practices that calm the nervous system anytime a child feels anxious." },
  { t: "Guided Visual Meditation", d: "Story-led sensory meditations (not sitting in silence) that lower mental clutter and help children build their own inner calm." },
  { t: "Focus & Observation Drills", d: "Interactive games like spot-the-detail and mindful listening that lengthen attention span in a fun way." },
  { t: "Emotional Regulation Training", d: "Learning to identify and express feelings without tantrums, building emotional vocabulary and resilience." },
  { t: "Mindful Study Architecture", d: "Pre-homework breathing and body routines, plus the 6-step study routine for home and school." },
  { t: "Parent Guidance & Resources", d: "Practical routines parents can use at home, plus recorded practices to reinforce learning." },
  { t: "Progress Tracking & Support", d: "Regular check-ins on confidence and focus, with adjustments for your child's unique learning style." },
];

const TRUST = [
  "Age-appropriate Vedic practices (6–14 years)",
  "Fun, engaging, non-competitive environment",
  "Parent-supported with routines for home",
  "Certified, caring instructors",
  "Lifetime access to resources & support community",
];

export default function KidsMindfulnessView() {
  const label = "text-xs uppercase font-bold tracking-widest text-[#EF8321]";
  const h2 = "font-heading font-bold text-[#004C53]";
  const card = "rounded-3xl bg-white border border-[#004C53]/10 shadow-sm p-6";

  return (
    <div className="bg-[#FAF5EC] min-h-screen font-sans text-[#3A4A40]">
      <SEO
        title="Kids Mindfulness & Focus Program | Build Concentration & Emotional Balance | Shivoham Shiv"
        description="Age-appropriate Yoga, breathing, meditation and mindfulness for children 6–14. Help your child focus better, learn better and grow with confidence."
        focusKeyword="kids mindfulness program"
        isFAQPage
        faqs={FAQS}
      />

      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#004C53] to-[#003A40] text-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-16 sm:py-24 text-center">
          <span className={`${label} text-amber-300`}>Kids Mindfulness & Focus · Ages 6–14</span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight text-white mt-3">
            Help Your Child Focus Better, Learn Better &<br /><span className="text-amber-300">Grow with Confidence</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base font-semibold text-amber-100">
            A structured attention-building program with age-appropriate Yoga, Breathwork, Meditation and Mindfulness.
          </p>
          <p className="mt-5 text-sm sm:text-base text-green-50/85 leading-relaxed">
            In an era of endless screens, short-form media and demanding school routines, children face real sensory
            overload. The challenge is rarely a lack of intelligence — it's the absence of tools to manage attention.
            This program teaches children to calm their minds, anchor their concentration and build balanced study
            habits through engaging, playful Vedic practices.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#EF8321] hover:bg-[#D9741A] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">
              Enroll Your Child Today <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center px-7 py-4 border-2 border-white/25 text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider rounded-full transition-all">
              Book a Free Parent Consultation →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE MODERN CHALLENGE */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>The Modern Challenge</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Is Your Child Struggling to Stay Focused?</h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              Children are often told to "just focus" — but rarely taught <em>how</em>. If your child shows these signs,
              they may be experiencing sensory and attentional overload:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SIGNS.map((s) => (
              <div key={s.t} className={card}>
                <div className="text-3xl mb-3">{s.e}</div>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{s.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{s.d}</p>
                <p className="text-[11px] text-[#D9741A] font-semibold border-t border-[#004C53]/10 pt-2">Red flag: {s.flag}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-600 leading-relaxed mt-8 max-w-2xl mx-auto">
            The good news: these aren't character flaws. They're signs your child needs practical tools to manage
            attention and emotional energy — which is exactly what this program teaches.
          </p>
        </div>
      </section>

      {/* 3. PHILOSOPHY */}
      <section className="bg-[#004C53] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className={`${label} text-amber-300`}>Our Core Philosophy</span>
          <p className="font-heading font-bold text-xl sm:text-2xl leading-relaxed mt-4">
            Academic tuition teaches children <span className="text-amber-300">what</span> to study.<br />
            Mindfulness trains their mind on <span className="text-amber-300">how</span> to pay attention while studying.
          </p>
          <p className="text-sm text-green-50/85 leading-relaxed mt-5">
            Learning isn't just about content — it's the capacity to absorb, process and retain it. A brilliant child
            with poor attention will struggle; a child of average ability with strong focus will excel. So we build the
            foundational skill that makes all other learning possible: attention.
          </p>
        </div>
      </section>

      {/* 4. COGNITIVE LEARNING CHAIN */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>How Mindfulness Supports Memory</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>The Cognitive Learning Chain</h2>
            <p className="text-sm text-slate-600 mt-3">Information can't be remembered if it's never properly absorbed. Each stage depends on the one before it:</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            {CHAIN.map((c, i) => (
              <span key={c.s} className="inline-flex items-center gap-2.5">
                <span className="rounded-full bg-[#EEF6F6] border border-[#004C53]/10 px-4 py-2 text-sm font-bold text-[#004C53]">{c.s}</span>
                {i < CHAIN.length - 1 && <span className="text-[#EF8321] font-bold">→</span>}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CHAIN.map((c, i) => (
              <div key={c.s} className={card}>
                <span className="font-heading text-xl font-extrabold text-[#EF8321]">{i + 1}</span>
                <h3 className="font-heading font-bold text-base text-[#004C53] mt-1 mb-2">{c.s}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-1.5"><span className="font-semibold">Challenge:</span> {c.ch}</p>
                <p className="text-xs text-[#004C53] leading-relaxed flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-[#EF8321] shrink-0 mt-0.5" /> {c.tool}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-600 leading-relaxed mt-8 max-w-2xl mx-auto">
            These activities train executive functioning — the brain's command centre for filtering distractions,
            self-regulation and working memory — as an enjoyable daily practice, not rigid discipline.
          </p>
        </div>
      </section>

      {/* 5. PROGRAM PILLARS */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>Inside the Program</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>What Your Child Will Learn</h2>
            <p className="text-sm text-slate-600 mt-3">Six core pillars, each delivered through fun, age-appropriate activities:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PILLARS.map((p) => (
              <div key={p.p} className="rounded-2xl bg-[#FAF5EC] border border-[#004C53]/10 p-5">
                <h3 className="font-heading font-bold text-sm text-[#004C53] mb-1.5">{p.p}</h3>
                <p className="text-[11px] font-semibold text-[#EF8321] mb-2">{p.fmt}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{p.ben}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. STUDY-READY ROUTINE */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>For Home & School</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>The "Study-Ready" 6-Step Routine</h2>
            <p className="text-sm text-slate-600 mt-3">A simple sequence parents can guide, preparing the mind and body for focused learning:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ROUTINE.map((r, i) => (
              <div key={r.n} className={card}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{r.e}</span>
                  <span className="font-heading text-lg font-extrabold text-[#EF8321]">{i + 1}</span>
                </div>
                <h3 className="font-heading font-bold text-base text-[#004C53]">{r.n} <span className="text-[11px] font-semibold text-slate-500">· {r.dur}</span></h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5 mb-2">{r.act}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed border-t border-[#004C53]/10 pt-2"><span className="font-semibold text-[#004C53]">Why:</span> {r.why}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-6 max-w-2xl mx-auto">
            <p className="font-heading font-bold text-lg text-[#004C53]">~30 minutes, start to finish</p>
            <p className="text-sm text-slate-600 mt-1">A complete, focused study session — with preparation and emotional support built in.</p>
          </div>
        </div>
      </section>

      {/* 7. BEFORE / AFTER */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>Real Transformation</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Before & After Building Mindful Habits</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-[#FAF5EC] border border-red-100 p-6">
              <h3 className="font-heading font-bold text-base text-slate-700 mb-4">Before</h3>
              <ul className="space-y-2">{BEFORE.map((b) => <li key={b} className="flex items-start gap-2 text-sm text-slate-600"><span className="text-red-400 shrink-0">✕</span> {b}</li>)}</ul>
            </div>
            <div className="rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-6">
              <h3 className="font-heading font-bold text-base text-[#004C53] mb-4">After Building Mindful Habits</h3>
              <ul className="space-y-2">{AFTER.map((a) => <li key={a} className="flex items-start gap-2 text-sm text-[#004C53]"><span className="text-[#2E8A93] shrink-0">✓</span> {a}</li>)}</ul>
            </div>
          </div>
          <p className="text-center text-[11px] text-slate-500 leading-relaxed mt-6 max-w-2xl mx-auto">
            Many families notice visible changes within a few weeks and deeper changes over a few months. Individual
            results vary from child to child.
          </p>
        </div>
      </section>

      {/* 8. AUDIENCE */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={label}>Is It Right for Your Child?</span>
            <h2 className={`${h2} text-2xl sm:text-3xl mt-2`}>Who This Program Is Designed For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AUDIENCE.map((a) => (
              <div key={a.t} className={card}>
                <div className="text-3xl mb-3">{a.e}</div>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{a.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">{a.d}</p>
                <p className="text-xs text-[#004C53] flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-[#EF8321] shrink-0 mt-0.5" /> {a.helps}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-6 sm:p-8 max-w-3xl mx-auto">
            <h3 className="font-heading font-bold text-base text-[#004C53] mb-2">What this program is not</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This program complements, but does not replace, academic tutoring (subject help), speech therapy, ADHD
              medication for diagnosed conditions, or psychiatric care. If your child has a diagnosed condition, please
              consult your healthcare provider.
            </p>
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

      {/* 10. PROGRAM INCLUDES */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className={`${h2} text-2xl sm:text-3xl text-center mb-10`}>What's Included in Your Child's Program</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COMPONENTS.map((c) => (
              <div key={c.t} className="rounded-2xl bg-white border border-[#004C53]/10 p-5 shadow-sm">
                <h3 className="font-heading font-bold text-sm text-[#004C53] mb-1.5">{c.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="bg-gradient-to-b from-[#004C53] to-[#003A40] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white">Don't Just Tell Your Child to "Focus." Teach Them How.</h2>
          <p className="mt-4 text-sm sm:text-base text-green-50/85">
            Every child can focus, learn deeply and grow with confidence — they just need the right tools.
          </p>
          <ul className="mt-6 inline-block text-left space-y-2">
            {["Practical attention-building techniques", "Emotional regulation and resilience", "Confidence in their learning ability", "Lifelong skills for managing stress and overwhelm", "A calm, supportive community of learning peers"].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-green-50/90"><Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" /> {f}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 bg-[#EF8321] hover:bg-[#F49B3E] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">
              Enroll in the Kids Program <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 bg-white text-[#004C53] hover:bg-green-50 font-bold text-xs uppercase tracking-wider rounded-full transition-all">
              Schedule a Discovery Consultation →
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
