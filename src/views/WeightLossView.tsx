import { Link, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { ArrowRight } from "lucide-react";

const RISK_LIST = [
  "❤️ Heart Disease & Cardiovascular Problems",
  "🩸 High Blood Pressure",
  "🍬 Type 2 Diabetes & Blood-Sugar Problems",
  "🧪 High Cholesterol & Triglycerides",
  "🫁 Sleep Apnea & Breathing Problems",
  "🦴 Joint Pain & Osteoarthritis",
  "🫀 Fatty Liver / MASLD",
  "🧠 Stroke",
  "🔥 Inflammation & Metabolic Problems",
  "🫃 Gallbladder Problems",
  "🧠 Mental Health Challenges",
];

const APPROACH = [
  { e: "🧘", t: "Yoga & Movement", d: "Build regular physical activity into your lifestyle." },
  { e: "🥗", t: "Healthy Eating & Mindful Eating", d: "Learn practical approaches to food choices, portions and eating habits." },
  { e: "🌬️", t: "Pranayama & Breathing", d: "Introduce structured breathing practices into your wellness routine." },
  { e: "🧠", t: "Meditation & Mindfulness", d: "Develop greater awareness of habits, emotions and everyday choices." },
  { e: "💧", t: "Healthy Daily Routines", d: "Build sustainable habits around hydration, sleep, movement and daily activity." },
  { e: "📚", t: "Wellness Education", d: "Understand the relationship between lifestyle habits and healthy weight management." },
];

const HEALTH_RISKS = [
  { e: "❤️", t: "Heart Disease", d: "Excess weight is associated with cardiovascular risk factors such as high blood pressure, abnormal cholesterol and diabetes, which can contribute to heart disease." },
  { e: "🩸", t: "High Blood Pressure", d: "Overweight and obesity are linked with increased risk of hypertension." },
  { e: "🍬", t: "Type 2 Diabetes", d: "Excess weight is strongly associated with increased risk of type 2 diabetes." },
  { e: "🧪", t: "High Cholesterol & Triglycerides", d: "Excess weight can be associated with unhealthy cholesterol and triglyceride levels, increasing cardiovascular risk." },
  { e: "🫁", t: "Sleep Apnea", d: "Obesity is associated with sleep apnea and other breathing problems." },
  { e: "🦴", t: "Joint Problems", d: "Additional body weight can contribute to joint stress, and obesity is associated with osteoarthritis." },
  { e: "🫀", t: "Fatty Liver Disease", d: "Obesity is associated with metabolic dysfunction-associated steatotic liver disease (MASLD)." },
  { e: "🧠", t: "Stroke", d: "High blood pressure and other cardiovascular risk factors associated with obesity can increase stroke risk." },
  { e: "🔥", t: "Metabolic Health Problems", d: "Excess weight can contribute to metabolic risk factors, particularly when combined with inactivity and unhealthy eating patterns." },
];

const BENEFITS = [
  { e: "⚖️", t: "Healthier Weight", d: "Work toward a weight that is more appropriate for your individual health goals." },
  { e: "❤️", t: "Better Cardiovascular Health", d: "Healthy lifestyle changes can help address important cardiovascular risk factors." },
  { e: "🩸", t: "Better Blood Pressure Management", d: "Weight management and physical activity can support healthier blood pressure levels." },
  { e: "🍬", t: "Better Blood-Sugar Management", d: "Regular physical activity and healthy weight management can help the body manage blood sugar and insulin levels." },
  { e: "🧪", t: "Healthier Cholesterol Profile", d: "Weight reduction and lifestyle changes may help improve cholesterol and triglyceride levels." },
  { e: "🫁", t: "Better Sleep & Breathing", d: "Healthy weight management may help address obesity-related sleep and breathing problems." },
  { e: "🦵", t: "Better Mobility", d: "Reducing excess body weight and becoming more active can make everyday movement easier." },
  { e: "⚡", t: "More Energy for Daily Activities", d: "Building regular movement, healthy eating and better routines can support energy and physical functioning." },
  { e: "🧠", t: "Better Mental Wellbeing", d: "Physical activity can support mental wellbeing and reduce symptoms of depression and anxiety." },
];

const WHO_FOR = [
  "Lose excess weight",
  "Improve their lifestyle",
  "Become more physically active",
  "Develop healthier eating habits",
  "Improve consistency with exercise",
  "Practice mindful eating",
  "Build a healthier daily routine",
  "Improve sleep and energy habits",
  "Reduce sedentary lifestyle",
  "Learn Yoga and wellness practices",
  "Create sustainable weight-management habits",
];

const JOURNEY = [
  { n: "01", t: "Understand", d: "Understand your current lifestyle, habits and weight-management challenges." },
  { n: "02", t: "Move", d: "Introduce appropriate movement, Yoga and exercise into your routine." },
  { n: "03", t: "Nourish", d: "Develop healthier eating and mindful eating habits." },
  { n: "04", t: "Balance", d: "Use breathing, meditation, mindfulness and healthy routines to support consistency." },
  { n: "05", t: "Sustain", d: "Build habits that can continue beyond the program." },
];

const WHY = [
  { e: "🌿", t: "Holistic Approach", d: "We address movement, food habits, mindfulness and lifestyle together." },
  { e: "🧘", t: "Yoga & Mindfulness", d: "Use traditional wellness practices alongside modern healthy lifestyle habits." },
  { e: "📚", t: "Education", d: "Understand why your lifestyle matters instead of simply following instructions." },
  { e: "🎯", t: "Habit-Based Approach", d: "Focus on sustainable habits rather than extreme short-term methods." },
  { e: "👥", t: "Guided Support", d: "Receive structured guidance throughout your wellness journey." },
  { e: "🌱", t: "Long-Term Thinking", d: "The objective is not simply to reach a number on the weighing scale — it is to build a healthier way of living." },
];

const BEFORE = [
  "Sedentary lifestyle",
  "Irregular eating habits",
  "Low physical activity",
  "Poor sleep routine",
  "Stress-driven habits",
  "Difficulty maintaining consistency",
];

const AFTER = [
  "More regular movement",
  "Healthier eating patterns",
  "Better daily routine",
  "Greater mindfulness",
  "Improved physical activity",
  "More sustainable weight-management habits",
];

const COMPONENTS = [
  { e: "🧘", t: "Yoga", d: "Movement and yoga practices designed around your wellness goals." },
  { e: "🏃", t: "Exercise & Physical Activity", d: "Encourage regular movement and reduce sedentary time." },
  { e: "🥗", t: "Nutrition & Eating Habits", d: "Learn practical healthy eating and portion-awareness strategies." },
  { e: "🌬️", t: "Pranayama", d: "Breathing practices incorporated into your wellness routine." },
  { e: "🧠", t: "Meditation", d: "Mindfulness practices to support awareness and consistency." },
  { e: "💧", t: "Hydration", d: "Develop better daily hydration habits." },
  { e: "😴", t: "Sleep", d: "Understand the importance of healthy sleep routines for overall wellbeing." },
  { e: "📈", t: "Progress Tracking", d: "Monitor your progress and focus on sustainable improvements." },
];

const CORPORATE_LIST = [
  "Desk-friendly movement", "Yoga", "Breathing exercises", "Mindfulness",
  "Healthy eating education", "Lifestyle routines", "Weight-management awareness",
];

const FAQS = [
  { q: "Is this a crash-diet program?", a: "No. This program is about sustainable weight management and healthier lifestyle habits rather than extreme short-term dieting." },
  { q: "Can the program help with diabetes or blood pressure?", a: "The program does not treat or cure diabetes or hypertension. Healthy weight management and physical activity can support blood-sugar and blood-pressure management and may reduce associated health risks. People with diagnosed conditions should continue working with their healthcare professional." },
  { q: "How much weight should I lose?", a: "There is no single target that is appropriate for everyone. Goals depend on factors such as starting weight, health status, age, activity level and medical history." },
  { q: "Is losing 5–10% of body weight useful?", a: "Yes. For people with overweight or obesity, a 5–10% reduction can provide meaningful health benefits." },
  { q: "Does Yoga help with weight management?", a: "Yoga can be part of an active lifestyle and can complement broader weight-management habits. It is one component of a comprehensive approach rather than a standalone cure." },
];

export default function WeightLossView() {
  const navigate = useNavigate();

  const sectionLabel = "text-xs uppercase font-bold tracking-widest text-[#EF8321]";
  const heading = "font-heading font-bold text-[#004C53]";
  const orangeBtn =
    "inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#EF8321] hover:bg-[#004C53] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all";
  const tealOutlineDark =
    "inline-flex items-center justify-center gap-2 px-7 py-4 border-2 border-white/25 text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider rounded-full transition-all";
  const card = "rounded-3xl bg-white border border-[#004C53]/10 shadow-sm p-6";

  const goJoin = () => navigate("/contact");
  const goConsult = () => navigate("/contact");

  return (
    <div className="bg-[#FAF5EC] min-h-screen font-sans text-[#3A4A40]">
      <SEO
        title="Weight Management & Wellness Program | Shivoham Shiv"
        description="A holistic Weight Loss & Wellness Program combining Yoga, movement, mindful eating, meditation, breathing practices and healthy lifestyle education to help you build healthier habits and work toward a healthier weight."
        focusKeyword="holistic weight management program"
        isFAQPage
        faqs={FAQS}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#004C53] to-[#003A40] text-white">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 py-16 sm:py-24 text-center">
          <h1 className={`font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight text-white`}>
            Lose Weight. Build Healthy Habits.<br />
            <span className="text-amber-300">Transform Your Lifestyle.</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base font-semibold text-amber-100">
            A Holistic Weight Loss &amp; Wellness Program for Sustainable Transformation
          </p>
          <p className="mt-5 text-sm sm:text-base text-green-50/85 leading-relaxed">
            Excess weight is not only about appearance. It can affect mobility, energy, sleep and metabolic and
            cardiovascular health, and is associated with increased risk of several chronic health conditions. Our
            Weight Loss &amp; Wellness Program combines practical lifestyle guidance with Yoga, exercise, mindful
            eating, breathing practices, meditation and wellness education to help you build healthier habits and work
            toward a healthier weight.
          </p>
          <p className="mt-4 text-sm sm:text-base text-white font-semibold">
            Your goal isn't just to lose weight. Your goal is to build a healthier lifestyle you can maintain.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={goJoin} className={orangeBtn}>Join the Weight Loss Program <ArrowRight className="w-4 h-4" /></button>
            <button onClick={goConsult} className={tealOutlineDark}>Book a Consultation</button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* THE PROBLEM */}
        <section className="py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className={sectionLabel}>The Problem</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>Is Excess Weight Affecting More Than Your Appearance?</h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              Many people think of weight gain as simply a cosmetic concern. But carrying excess weight can be
              associated with a higher risk of several health problems. Excess weight may increase the risk of:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RISK_LIST.map((r) => (
              <div key={r} className="rounded-2xl bg-white border border-[#004C53]/10 px-4 py-3 text-sm text-[#004C53] font-medium">{r}</div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-600 mt-6">Certain cancers are also associated with obesity. This is why healthy weight management matters.</p>
        </section>

        {/* IMPORTANT HEALTH MESSAGE */}
        <section className="pb-16 sm:pb-20">
          <div className="rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-8 sm:p-10 text-center max-w-3xl mx-auto">
            <span className={sectionLabel}>Important Health Message</span>
            <h2 className={`${heading} text-xl sm:text-2xl mt-2`}>Don't Wait Until Weight Becomes a Bigger Health Problem</h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              Excess weight can interact with other risk factors such as physical inactivity, unhealthy eating patterns,
              poor sleep and metabolic health. For some people, reducing excess weight and adopting healthier lifestyle
              habits can help improve health markers and reduce health risks. Your weight is only one part of your
              health — our program focuses on the lifestyle factors that influence your overall wellbeing.
            </p>
          </div>
        </section>
      </div>

      {/* THE SHIVOHAM SHIV APPROACH */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={sectionLabel}>The Shivoham Shiv Approach</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>Weight Loss Is Not Just About Eating Less — It's About Changing the Way You Live.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {APPROACH.map((a) => (
              <div key={a.t} className={card}>
                <div className="text-3xl mb-3">{a.e}</div>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{a.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{a.d}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-600 mt-8 max-w-3xl mx-auto">
            Regular physical activity can help with weight management and also provides benefits for blood pressure,
            heart health, blood sugar, sleep and mental wellbeing.
          </p>
        </div>
      </section>

      {/* HEALTH RISKS */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={sectionLabel}>Health Risks</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>What Can Happen When Excess Weight Is Left Unmanaged?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HEALTH_RISKS.map((r, i) => (
              <div key={r.t} className={card}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl">{r.e}</span>
                  <span className="font-heading font-bold text-base text-[#004C53]">{i + 1}. {r.t}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-4">
            <span className={sectionLabel}>Benefits of the Program</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>What Can You Gain From a Healthier Weight?</h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              Our program does not promise that every participant will experience the same medical outcome. However,
              healthy weight management and increased physical activity can support important aspects of health.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.t} className="rounded-3xl bg-[#FAFBF7] border border-[#004C53]/10 p-6">
                <div className="text-3xl mb-3">{b.e}</div>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{b.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-10% */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className={sectionLabel}>Small Change · Real Benefit</span>
          <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>You Don't Have to Lose Everything to Start Seeing Health Benefits</h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-3 max-w-2xl mx-auto">
            Even modest weight loss can matter. For people with overweight or obesity, losing around
            <strong className="text-[#004C53]"> 5–10% of body weight</strong> can provide meaningful health benefits.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="rounded-2xl bg-white border border-[#004C53]/10 px-6 py-4 shadow-sm">
              <span className="block text-2xl font-bold text-[#004C53]">100 kg</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Starting weight</span>
            </div>
            <span className="text-[#EF8321] text-xl font-bold">→</span>
            <div className="rounded-2xl bg-white border border-[#004C53]/10 px-6 py-4 shadow-sm">
              <span className="block text-2xl font-bold text-[#EF8321]">5 kg</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">5% loss</span>
            </div>
            <span className="text-[#EF8321] text-xl font-bold">→</span>
            <div className="rounded-2xl bg-white border border-[#004C53]/10 px-6 py-4 shadow-sm">
              <span className="block text-2xl font-bold text-[#EF8321]">10 kg</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">10% loss</span>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-6">The goal isn't extreme weight loss. The goal is sustainable progress.</p>
          <p className="text-[11px] text-slate-500 leading-relaxed mt-3 max-w-2xl mx-auto">
            Individual results vary depending on age, starting weight, health conditions, medications, lifestyle and other factors.
          </p>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className={sectionLabel}>Who Is This Program For?</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>Is This Program Right for You?</h2>
            <p className="text-sm text-slate-600 mt-3">This program may be suitable for adults who want to:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WHO_FOR.map((w) => (
              <div key={w} className="flex items-start gap-2.5 text-sm text-slate-700"><span className="text-[#EF8321]">✓</span> {w}</div>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={sectionLabel}>Your Weight Loss Journey</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>A Simple 5-Step Approach</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {JOURNEY.map((s) => (
              <div key={s.n} className="rounded-2xl bg-white border border-[#004C53]/10 p-6">
                <span className="font-heading text-xl font-extrabold text-[#EF8321]">{s.n}</span>
                <h3 className="font-heading font-bold text-sm text-[#004C53] mt-1 mb-1.5">{s.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={sectionLabel}>Why Shivoham Shiv?</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>More Than a Weight Loss Program</h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              We don't want weight loss to be a temporary challenge. We want to help you develop a healthier lifestyle
              you can continue after the program ends.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY.map((w) => (
              <div key={w.t} className="rounded-3xl bg-[#FAFBF7] border border-[#004C53]/10 p-6">
                <div className="text-3xl mb-3">{w.e}</div>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{w.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSFORMATION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={sectionLabel}>Transformation</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>From Weight Loss to Wellness</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-white border border-red-100 p-6">
              <h3 className="font-heading font-bold text-base text-slate-700 mb-4">Before</h3>
              <ul className="space-y-2">
                {BEFORE.map((b) => <li key={b} className="flex items-start gap-2 text-sm text-slate-600"><span className="text-red-400">✕</span> {b}</li>)}
              </ul>
            </div>
            <div className="rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-6">
              <h3 className="font-heading font-bold text-base text-[#004C53] mb-4">After Building Healthier Habits</h3>
              <ul className="space-y-2">
                {AFTER.map((a) => <li key={a} className="flex items-start gap-2 text-sm text-[#004C53]"><span className="text-[#EF8321]">✓</span> {a}</li>)}
              </ul>
            </div>
          </div>
          <p className="text-center text-sm font-semibold text-[#004C53] mt-6">Small Daily Changes Can Create Long-Term Transformation.</p>
        </div>
      </section>

      {/* PROGRAM COMPONENTS */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={sectionLabel}>Program Components</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>What You'll Work On</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COMPONENTS.map((c) => (
              <div key={c.t} className="rounded-2xl bg-[#FAFBF7] border border-[#004C53]/10 p-5">
                <div className="text-2xl mb-2">{c.e}</div>
                <h3 className="font-heading font-bold text-sm text-[#004C53] mb-1">{c.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORPORATE / ADULT EXTENSION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-[#004C53] to-[#003A40] text-white p-8 sm:p-10 text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">Weight Management for Working Professionals</span>
          <p className="text-sm text-green-50/85 leading-relaxed mt-3 max-w-2xl mx-auto">
            Long working hours, prolonged sitting, stress, irregular meals and reduced physical activity can make
            healthy weight management difficult. Our adult wellness approach can incorporate:
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {CORPORATE_LIST.map((c) => (
              <span key={c} className="text-[11px] font-semibold rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-green-50/90">{c}</span>
            ))}
          </div>
          <div className="mt-7">
            <Link to="/courses/corporate-wellness" className="inline-flex items-center gap-2 px-6 py-3 bg-[#EF8321] hover:bg-[#F49B3E] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all">
              Explore Corporate &amp; Adult Wellness <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className={sectionLabel}>Your Health Is Worth the Change</span>
          <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>Start Your Weight Loss &amp; Wellness Journey Today</h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-3">
            You don't need an extreme diet. You don't need to transform overnight. You need a healthier routine you can
            actually maintain — built around food, movement, mindfulness, sleep and lifestyle.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={goJoin} className={orangeBtn}>Join the Program <ArrowRight className="w-4 h-4" /></button>
            <button onClick={goConsult} className="inline-flex items-center justify-center gap-2 px-7 py-4 border-2 border-[#004C53] text-[#004C53] hover:bg-[#004C53] hover:text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all">Book a Consultation</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className={sectionLabel}>FAQ</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>Common Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-2xl border border-[#004C53]/10 bg-white p-5">
                <h3 className="font-heading font-bold text-sm text-[#004C53] mb-1.5">{f.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
