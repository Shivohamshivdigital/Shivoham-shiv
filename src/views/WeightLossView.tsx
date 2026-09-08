import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import AuthModal from "../components/AuthModal";
import { startPayment, PaymentPlan } from "../services/paymentService";
import { setSession } from "../utils/session";

interface Pricing {
  registerAmount: number;
  courseAmount: number;
  courseOriginal: number;
  discountLabel: string;
}

const DEFAULT_PRICING: Pricing = {
  registerAmount: 999,
  courseAmount: 7999,
  courseOriginal: 11999,
  discountLabel: "30% OFF",
};

const inr = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

const HEALTH_RISKS = [
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

const BENEFITS = [
  { e: "⚖️", t: "Healthier Weight", d: "Work toward a weight that is more appropriate for your individual health goals." },
  { e: "❤️", t: "Better Cardiovascular Health", d: "Healthy lifestyle changes can help address important cardiovascular risk factors." },
  { e: "🩸", t: "Better Blood Pressure Management", d: "Weight management and physical activity can support healthier blood pressure levels." },
  { e: "🍬", t: "Better Blood-Sugar Management", d: "Regular physical activity and healthy weight management can help the body manage blood sugar and insulin levels." },
  { e: "🧪", t: "Healthier Cholesterol Profile", d: "Weight reduction and lifestyle changes may help improve cholesterol and triglyceride levels." },
  { e: "🫁", t: "Better Sleep & Breathing", d: "Healthy weight management may help address obesity-related sleep and breathing problems." },
  { e: "🦵", t: "Better Mobility", d: "Reducing excess body weight can make everyday movement easier." },
  { e: "⚡", t: "More Energy for Daily Activities", d: "Building regular movement and healthy routines can support energy and physical functioning." },
  { e: "🧠", t: "Better Mental Wellbeing", d: "Physical activity can support mental wellbeing and reduce symptoms of depression and anxiety." },
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

export default function WeightLossView() {
  const navigate = useNavigate();
  const [bannerText, setBannerText] = useState<string | null>(null);
  const [payingPlan, setPayingPlan] = useState<PaymentPlan | null>(null);
  const [authPlan, setAuthPlan] = useState<PaymentPlan | null>(null);
  const [pricing, setPricing] = useState<Pricing>(DEFAULT_PRICING);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setPricing((prev) => ({ ...prev, ...d })))
      .catch(() => {});
  }, []);

  const handlePay = (plan: PaymentPlan) => {
    if (payingPlan) return;
    setAuthPlan(plan);
    navigate(`/weight-loss?step=checkout&plan=${plan}`);
  };
  const closeAuth = () => {
    setAuthPlan(null);
    navigate("/weight-loss");
  };
  const handleAuthSuccess = async (authedEmail: string, phone: string, token?: string) => {
    const plan = authPlan;
    setAuthPlan(null);
    if (token) setSession(token, authedEmail);
    if (!plan) return;
    setPayingPlan(plan);
    const amount = plan === "register" ? pricing.registerAmount : pricing.courseAmount;
    (window as any).fbq?.("track", "InitiateCheckout", { value: amount, currency: "INR", content_name: plan });
    (window as any).gtag?.("event", "begin_checkout", { value: amount, currency: "INR" });
    try {
      await startPayment(plan, { email: authedEmail, contact: phone });
      const q = new URLSearchParams({ plan, amount: String(amount), email: authedEmail, phone });
      navigate(`/thank-you?${q.toString()}`);
    } catch (err: any) {
      if (err?.message && err.message !== "Payment cancelled.") setBannerText(err.message);
    } finally {
      setPayingPlan(null);
    }
  };

  const scrollToEnroll = () => document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" });
  const goConsult = () => navigate("/contact");

  const sectionLabel = "text-xs uppercase font-bold tracking-widest text-[#EF8321]";
  const heading = "font-heading font-bold text-[#004C53]";
  const card = "rounded-3xl bg-white border border-[#004C53]/10 shadow-sm p-6";
  const orangeBtn =
    "inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#EF8321] hover:bg-[#D9741A] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all";

  const FAQS = [
    { q: "Is this a crash-diet program?", a: "No. This program is about sustainable weight management and healthier lifestyle habits rather than extreme short-term dieting." },
    { q: "Can the program help with diabetes or blood pressure?", a: "The program does not treat or cure diabetes or hypertension. Healthy weight management and physical activity can support blood-sugar and blood-pressure management and may reduce associated health risks. People with diagnosed conditions should continue working with their healthcare professional." },
    { q: "How much weight should I lose?", a: "There is no single target that is appropriate for everyone. Goals depend on factors such as starting weight, health status, age, activity level and medical history." },
    { q: "Is losing 5–10% of body weight useful?", a: "Yes. For people with overweight or obesity, a 5–10% reduction can provide meaningful health benefits." },
    { q: "Does Yoga help with weight management?", a: "Yoga can be part of an active lifestyle and can complement broader weight-management habits. It is one component of a comprehensive approach rather than a standalone cure." },
  ];

  return (
    <div className="bg-[#FAF5EC] min-h-screen font-sans text-[#3A4A40]">
      <SEO
        title="Weight Management & Wellness Program | Shivoham Shiv"
        description="A holistic Weight Loss & Wellness Program combining Yoga, movement, mindful eating, meditation, breathing practices and healthy lifestyle education to help you build healthier habits and work toward a healthier weight."
        focusKeyword="holistic weight management program"
        isFAQPage
        faqs={FAQS}
      />

      {bannerText && (
        <div className="fixed bottom-6 right-6 z-[60] max-w-sm w-[calc(100%-3rem)] sm:w-full bg-[#002A2E] text-white shadow-2xl p-4 rounded-2xl flex items-start gap-3 border border-[#004C53]">
          <AlertCircle className="w-5 h-5 text-[#EF8321] shrink-0 mt-0.5" />
          <span className="text-xs leading-relaxed font-medium flex-1">{bannerText}</span>
          <button onClick={() => setBannerText(null)} className="text-green-200 hover:text-white shrink-0" aria-label="Close">✕</button>
        </div>
      )}

      {authPlan && <AuthModal onClose={closeAuth} onSuccess={handleAuthSuccess} />}

      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#004C53] to-[#003A40] text-white">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 py-16 sm:py-24 text-center">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight text-white">
            Lose Weight. Build Healthy Habits.<br />
            <span className="text-amber-300">Transform Your Lifestyle.</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base font-semibold text-amber-100">
            A Holistic Weight Loss &amp; Wellness Program for Sustainable Transformation
          </p>
          <p className="mt-5 text-sm sm:text-base text-green-50/85 leading-relaxed">
            Excess weight is not only about appearance. It can affect mobility, energy, sleep and metabolic and
            cardiovascular health, and is associated with increased risk of several chronic health conditions. The
            Shivoham Shiv Weight Loss &amp; Wellness Program combines practical lifestyle guidance with Yoga, exercise,
            mindful eating, breathing practices, meditation and wellness education to help you build healthier habits
            and work toward a healthier weight.
          </p>
          <p className="mt-4 text-sm sm:text-base text-white font-semibold">
            Your goal isn't just to lose weight. Your goal is to build a healthier lifestyle you can maintain.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={scrollToEnroll} className={orangeBtn}>Join the Weight Loss Program <ArrowRight className="w-4 h-4" /></button>
            <button onClick={goConsult} className="inline-flex items-center justify-center px-7 py-4 border-2 border-white/25 text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider rounded-full transition-all">Book a Consultation →</button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. THE PROBLEM — HEALTH RISKS */}
        <section className="py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className={sectionLabel}>The Problem</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>Is Excess Weight Affecting More Than Your Appearance?</h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              Many people think of weight gain as simply a cosmetic concern. But carrying excess weight can be
              associated with a higher risk of several health problems.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {HEALTH_RISKS.map((r) => (
              <div key={r} className="rounded-2xl bg-white border border-[#004C53]/10 px-4 py-3 text-sm text-[#004C53] font-medium">{r}</div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-600 mt-6">Certain cancers are also associated with obesity. This is why healthy weight management matters.</p>
        </section>
      </div>

      {/* 3. THE SHIVOHAM SHIV APPROACH */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={sectionLabel}>The Shivoham Shiv Approach</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>Weight Loss Is Not Just About Eating Less — It's About Changing the Way You Live.</h2>
            <p className="text-sm text-slate-600 mt-3">Our holistic approach combines:</p>
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

      {/* 4. BENEFITS */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
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
              <div key={b.t} className={card}>
                <div className="text-3xl mb-3">{b.e}</div>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{b.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 5-10% */}
      <section className="bg-[#EEF6F6] border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className={sectionLabel}>Small Change · Real Benefit</span>
          <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>You Don't Have to Lose Everything to Start Seeing Health Benefits</h2>
          <p className="text-sm font-semibold text-[#004C53] mt-3">Even modest weight loss can matter.</p>
          <p className="text-sm text-slate-600 leading-relaxed mt-2 max-w-2xl mx-auto">
            For people with overweight or obesity, losing around <strong className="text-[#004C53]">5–10% of body weight</strong> can provide meaningful health benefits.
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

      {/* 6. TRANSFORMATION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className={`${heading} text-2xl sm:text-3xl text-center mb-10`}>From Weight Loss to Wellness</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-white border border-red-100 p-6">
              <h3 className="font-heading font-bold text-base text-slate-700 mb-4">Before</h3>
              <ul className="space-y-2">{BEFORE.map((b) => <li key={b} className="flex items-start gap-2 text-sm text-slate-600"><span className="text-red-400">❌</span> {b}</li>)}</ul>
            </div>
            <div className="rounded-3xl bg-[#EEF6F6] border border-[#004C53]/10 p-6">
              <h3 className="font-heading font-bold text-base text-[#004C53] mb-4">After Building Healthier Habits</h3>
              <ul className="space-y-2">{AFTER.map((a) => <li key={a} className="flex items-start gap-2 text-sm text-[#004C53]"><span className="text-[#2E8A93]">✅</span> {a}</li>)}</ul>
            </div>
          </div>
          <p className="text-center text-sm font-semibold text-[#004C53] mt-6">Small Daily Changes Can Create Long-Term Transformation.</p>
        </div>
      </section>

      {/* 7. PROGRAM COMPONENTS */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className={`${heading} text-2xl sm:text-3xl text-center mb-10`}>What You'll Work On</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COMPONENTS.map((c) => (
              <div key={c.t} className="rounded-2xl bg-[#FAF5EC] border border-[#004C53]/10 p-5">
                <div className="text-2xl mb-2">{c.e}</div>
                <h3 className="font-heading font-bold text-sm text-[#004C53] mb-1">{c.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENROLL / PRICING */}
      <section id="enroll" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto rounded-3xl bg-gradient-to-b from-[#004C53] to-[#003A40] text-white p-8 sm:p-10 text-center shadow-xl">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">Full Transformation</span>
          <h3 className="font-heading font-bold text-2xl text-white mt-1">Natural Weight Management Program</h3>
          <div className="flex items-end justify-center gap-2 mt-4">
            <span className="text-4xl font-bold text-white">{inr(pricing.courseAmount)}</span>
            {pricing.courseOriginal ? <span className="text-lg text-green-100/50 line-through mb-1">{inr(pricing.courseOriginal)}</span> : null}
            {pricing.discountLabel ? <span className="text-[11px] bg-amber-400 text-[#5a3a12] font-extrabold px-2 py-0.5 rounded-full mb-1.5">{pricing.discountLabel}</span> : null}
          </div>
          <ul className="text-left space-y-2.5 mt-6 mb-7">
            {["Personalized diet & lifestyle plan", "Yoga, Pranayama, meditation & breathing guidance", "Ongoing guidance until you build the habit"].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-green-50/90"><Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" /> {f}</li>
            ))}
          </ul>
          <button onClick={() => handlePay("course")} disabled={payingPlan !== null} className="w-full py-4 bg-[#EF8321] hover:bg-[#F49B3E] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all disabled:opacity-70">
            {payingPlan === "course" ? "Processing…" : "Join the Program"}
          </button>
          <p className="text-[11px] text-green-100/60 mt-3 flex items-center justify-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Secure payment via Razorpay</p>
          <button onClick={goConsult} className="text-xs font-semibold text-amber-100 underline underline-offset-2 mt-4">Prefer to talk first? Book a consultation →</button>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="bg-gradient-to-b from-[#004C53] to-[#003A40] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white">Your Health Is Worth the Change</h2>
          <p className="mt-4 text-sm sm:text-base text-green-50/85">You don't need an extreme diet. You don't need to transform overnight.</p>
          <p className="mt-2 text-base sm:text-lg font-semibold text-amber-100">You need a healthier routine you can actually maintain.</p>
          <p className="mt-3 text-sm text-green-50/75 max-w-xl mx-auto">Start building better habits around food, movement, mindfulness, sleep and lifestyle.</p>
          <p className="mt-6 font-heading text-lg text-white">Start Your Weight Loss &amp; Wellness Journey Today</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={scrollToEnroll} className="inline-flex items-center gap-2 px-7 py-4 bg-[#EF8321] hover:bg-[#F49B3E] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">Join the Program <ArrowRight className="w-4 h-4" /></button>
            <button onClick={goConsult} className="inline-flex items-center gap-2 px-7 py-4 bg-white text-[#004C53] hover:bg-green-50 font-bold text-xs uppercase tracking-wider rounded-full transition-all">Book a Consultation →</button>
          </div>
        </div>
      </section>
    </div>
  );
}
