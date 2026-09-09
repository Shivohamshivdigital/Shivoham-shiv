import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import AuthModal from "../components/AuthModal";
import { startPayment, PaymentPlan } from "../services/paymentService";
import { setSession } from "../utils/session";
import Testimonials from "../components/Testimonials";

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

const CLINICAL_CONCERNS = [
  { e: "❤️", t: "Cardiovascular Strain", d: "Arterial pressure, higher resting heart rate and circulatory stress." },
  { e: "⚡", t: "Metabolic Sluggishness", d: "Blood-glucose fluctuations, insulin-sensitivity issues and systemic inflammation." },
  { e: "🦴", t: "Structural Fatigue", d: "Excess mechanical stress on knees, lower back and posture." },
  { e: "😴", t: "Sleep & Vitality Deficits", d: "Disrupted circadian rhythms, shallow breathing and afternoon energy crashes." },
];

const OPTIMIZATION = [
  { base: "80 kg (176 lbs)", five: "4 kg (8.8 lbs)", ten: "8 kg (17.6 lbs)", marker: "Supports healthy resting blood pressure" },
  { base: "90 kg (198 lbs)", five: "4.5 kg (9.9 lbs)", ten: "9 kg (19.8 lbs)", marker: "Promotes balanced blood sugar and insulin response" },
  { base: "100 kg (220 lbs)", five: "5 kg (11 lbs)", ten: "10 kg (22 lbs)", marker: "Relieves joint pressure and supports sleep quality" },
];

const PILLARS = [
  { e: "🥗", t: "Prakriti-Based Nutrition", d: "Wholesome, seasonal eating customized to your individual doshic constitution — no calorie deprivation, strictly whole-food nourishment.", f: ["Customized to your Dosha (Vata, Pitta, Kapha)", "Whole-food nutrition", "No calorie counting or deprivation", "Seasonal eating aligned with nature", "Digestive-fire (Agni) support"] },
  { e: "🤲", t: "Therapeutic Mudra Science", d: "Specific energetic hand configurations (such as Surya and Linga mudras) used in tradition to support metabolic vitality and balance.", f: ["Surya Mudra for metabolic fire", "Linga Mudra for energy activation", "Traditional endocrine-balancing practice", "Daily practice protocols"] },
  { e: "🧘", t: "Restorative Yoga & Biomechanics", d: "Joint-safe, functional movement sequences that enhance mobility and everyday activity without athletic burnout.", f: ["Functional, joint-friendly movement", "Improved mobility and flexibility", "Activity without extreme exercise", "Posture improvement", "Long-term sustainability"] },
  { e: "🌬️", t: "Pranayama & Nervous-System Regulation", d: "Structured breathwork to support stress and cortisol regulation — a recognised factor in stress-related weight gain.", f: ["Breathwork for stress regulation", "Support for stress-driven habits", "Nervous-system rebalancing", "Parasympathetic activation", "Daily breathing routines"] },
  { e: "🧠", t: "Mindful Habit Architecture", d: "Practical mindfulness techniques to ease emotional-eating patterns and build lifelong self-care habits.", f: ["Ease emotional-eating patterns", "Mindfulness-based habit formation", "Self-care habit building", "Lifelong sustainability focus", "Behavioural change support"] },
];

const TRACKS = [
  { e: "🔄", dur: "14 Days", intensity: "Beginner-Friendly", t: "14-Day Metabolic Reset Challenge", d: "A kickstart focused on gentle gut cleansing, digestive reactivation and building consistent daily wellness habits.", inc: ["Gentle gut-cleansing protocols", "Digestive-fire (Agni) reactivation", "Daily wellness habit building", "Foundational mudra practice", "Introduction to Vedic nutrition"], best: "Anyone new to Vedic wellness or needing a quick reset", cta: "Start the 14-Day Challenge", action: "challenge" as const },
  { e: "📅", dur: "60 Days", intensity: "Comprehensive", t: "60-Day Comprehensive Weight Management", d: "An immersive, guided track with personalized dietary guidelines, weekly Mudra routines, live movement sessions and one-on-one habit coaching.", inc: ["Personalized dietary guidelines", "Weekly Mudra routines", "Live movement sessions", "One-on-one habit coaching", "Progress tracking & adjustments", "Community support group", "Lifetime access to materials"], best: "Serious about sustainable, long-term change", cta: "Book a Consultation", action: "enroll" as const },
  { e: "💼", dur: "60 Days (Optimized)", intensity: "Time-Efficient", t: "Executive & Professional Track", d: "Time-efficient, desk-friendly movement, 5-minute desktop breathwork and metabolic meal-timing strategies for demanding schedules.", inc: ["Desk-friendly movement protocols", "5-minute desktop breathwork", "Metabolic meal-timing strategies", "Executive accountability coaching", "Flexible scheduling", "Corporate wellness integration"], best: "Busy professionals and corporate teams", cta: "Explore the Corporate Track", action: "consult" as const },
];

const INCLUDES = [
  { t: "Personalized Prakriti Assessment", d: "Understand your constitutional type and receive customized nutrition and lifestyle recommendations." },
  { t: "Weekly Live Movement Sessions", d: "Guided, joint-friendly Yoga and functional movement for weight management and mobility." },
  { t: "Mudra Therapy Training", d: "Learn specific hand mudras used in tradition to support everyday metabolic balance." },
  { t: "Pranayama Breathwork", d: "Structured breathing to support stress regulation and the parasympathetic nervous system." },
  { t: "Nutritional Guidance", d: "Dosha-specific, whole-food eating protocols — no calorie counting, no restrictions." },
  { t: "Habit Coaching", d: "One-on-one or group coaching to ease emotional-eating patterns and build lasting change." },
  { t: "Progress Tracking & Adjustment", d: "Regular check-ins to monitor progress, address challenges and adjust protocols." },
  { t: "Community Access", d: "Join a growing global community for ongoing support and accountability." },
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

  const goConsult = () => navigate("/contact");
  const scrollToEnroll = goConsult;

  const sectionLabel = "text-xs uppercase font-bold tracking-widest text-[#EF8321]";
  const heading = "font-heading font-bold text-[#004C53]";
  const card = "rounded-3xl bg-white border border-[#004C53]/10 shadow-sm p-6";
  const orangeBtn =
    "inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#EF8321] hover:bg-[#D9741A] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all";

  const goChallenge = () => navigate("/challenge");
  const trackAction = (a: "challenge" | "enroll" | "consult") =>
    a === "challenge" ? goChallenge : a === "enroll" ? scrollToEnroll : goConsult;

  const FAQS = [
    { q: "Is this a crash diet or fasting program?", a: "No. We don't advocate calorie starvation, synthetic fat burners or meal-replacement shakes. Our methodology focuses on supporting your body's natural metabolic efficiency through authentic food and traditional practices — working with your body, not against it." },
    { q: "Can this program support people with existing lifestyle conditions?", a: "Our gentle, drug-free practices can support blood-sugar balance, cardiovascular ease and stress reduction as part of a healthy lifestyle. It complements, and does not replace, your medical care. If you have a diagnosed condition, please consult your healthcare provider before starting." },
    { q: "How is Vedic Mudra practice applied to weight management?", a: "In Vedic tradition, specific Hasta Mudras are used to support the body's internal fire element (Agni) and everyday metabolic balance. For example, Surya Mudra is associated with metabolic fire and Linga Mudra with energy and vitality." },
    { q: "How long before I see results?", a: "Many participants notice improved energy, digestion and sleep within 2–3 weeks, with weight stabilization typically following over 4–6 weeks as habits settle. Individual results vary. Our focus is sustainable, long-term change — not rapid reduction." },
    { q: "Do I need to follow strict meal plans?", a: "No. We teach Prakriti-based nutrition principles so you can make nourishing choices aligned with your constitution — you learn what to eat and why, rather than following rigid meal plans." },
    { q: "Is this suitable for people with dietary restrictions?", a: "Yes. The Prakriti-based approach is customizable for vegetarian, vegan, gluten-free and other dietary preferences — it works with your choices, not against them." },
  ];

  const TRUST = [
    "100% Drug-Free, Vedic Methodology",
    "Sustainable 5–10% Optimization",
    "Personalized Prakriti-Based Nutrition",
    "Certified Practitioners",
    "Live + Guided Community Support",
  ];

  return (
    <div className="bg-[#FAF5EC] min-h-screen font-sans text-[#3A4A40]">
      <SEO
        title="Holistic Weight Management Program | Medicine-Free Vedic Wellness | Shivoham Shiv"
        description="Sustainable, 100% drug-free weight management. Rebuild your metabolic health naturally through Vedic nutrition, Mudra science, therapeutic Yoga and habit mastery."
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
            Optimize Your Weight. Reclaim Your Vitality.<br />
            <span className="text-amber-300">Rebuild Your Lifestyle.</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base font-semibold text-amber-100">
            A 100% Drug-Free, Vedic Weight Management Program for Long-Term Health and Metabolic Balance.
          </p>
          <p className="mt-5 text-sm sm:text-base text-green-50/85 leading-relaxed">
            Carrying excess weight places chronic strain on cardiovascular health, joint mobility, restful sleep and
            emotional wellbeing. Shivoham Shiv bridges ancient Vedic practices with modern lifestyle science to help
            restore your body's natural metabolic balance — without meal replacements, synthetic supplements or
            restrictive crash diets.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={scrollToEnroll} className={orangeBtn}>Explore the 60-Day Program <ArrowRight className="w-4 h-4" /></button>
            <button onClick={goConsult} className="inline-flex items-center justify-center px-7 py-4 border-2 border-white/25 text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider rounded-full transition-all">Book a Private Consultation →</button>
          </div>
        </div>
      </section>

      {/* 2. CLINICAL PERSPECTIVE */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className={sectionLabel}>The Clinical Perspective</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>Beyond the Scale</h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              Weight management is not an aesthetic pursuit; it is a foundational pillar of preventive health.
              Unaddressed metabolic resistance is frequently associated with:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CLINICAL_CONCERNS.map((c) => (
              <div key={c.t} className={card}>
                <div className="text-3xl mb-3">{c.e}</div>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{c.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-slate-500 leading-relaxed mt-6 max-w-2xl mx-auto">
            These are general wellness associations, not medical claims. This program supports a healthy lifestyle and
            is not a substitute for professional medical care.
          </p>
        </section>
      </div>

      {/* 3. 5-10% OPTIMIZATION */}
      <section className="bg-[#EEF6F6] border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className={sectionLabel}>Small Change · Real Benefit</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>The Power of 5% to 10% Optimization</h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              Sustainable progress consistently outperforms rapid, short-term reduction. International clinical
              consensus highlights that a sustained 5–10% reduction in baseline weight delivers measurable systemic
              health benefits:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {OPTIMIZATION.map((row) => (
              <div key={row.base} className="rounded-3xl bg-white border border-[#004C53]/10 shadow-sm p-6 text-center">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Baseline</span>
                <p className="text-2xl font-bold text-[#004C53] mt-1 mb-4">{row.base}</p>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div>
                    <span className="block text-lg font-bold text-[#EF8321]">{row.five}</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">5%</span>
                  </div>
                  <span className="text-[#EF8321] font-bold text-lg">·</span>
                  <div>
                    <span className="block text-lg font-bold text-[#EF8321]">{row.ten}</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">10%</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed border-t border-[#004C53]/10 pt-3">{row.marker}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-600 mt-6">
            These are sustainable, achievable targets — not extreme transformations. The goal is metabolic rebalancing,
            not rapid reduction.
          </p>
          <p className="text-center text-[11px] text-slate-500 leading-relaxed mt-3 max-w-2xl mx-auto">
            Individual results vary depending on age, starting weight, health conditions, medications, lifestyle and other factors.
          </p>
        </div>
      </section>

      {/* 4. 5-PILLAR METHODOLOGY */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={sectionLabel}>Our Methodology</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>Our 5-Pillar Drugless Methodology</h2>
            <p className="text-sm text-slate-600 mt-3">We support sustainable weight management through five integrated practices:</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PILLARS.map((p) => (
              <div key={p.t} className={card}>
                <div className="text-3xl mb-3">{p.e}</div>
                <h3 className="font-heading font-bold text-base text-[#004C53] mb-1.5">{p.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{p.d}</p>
                <ul className="space-y-1.5">
                  {p.f.map((ft) => (
                    <li key={ft} className="flex items-start gap-2 text-xs text-[#004C53]"><Check className="w-3.5 h-3.5 text-[#EF8321] shrink-0 mt-0.5" /> {ft}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROGRAM TRACKS */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className={sectionLabel}>Choose Your Track</span>
            <h2 className={`${heading} text-2xl sm:text-3xl mt-2`}>Structured Program Tracks</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TRACKS.map((t) => (
              <div key={t.t} className="flex flex-col rounded-3xl bg-[#FAF5EC] border border-[#004C53]/10 p-6 shadow-sm">
                <div className="text-3xl mb-3">{t.e}</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#004C53]/10 text-[#004C53] rounded-full px-2.5 py-1">{t.dur}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EF8321]/15 text-[#D9741A] rounded-full px-2.5 py-1">{t.intensity}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-[#004C53] mb-1.5">{t.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{t.d}</p>
                <ul className="space-y-1.5 mb-4">
                  {t.inc.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-xs text-[#004C53]"><Check className="w-3.5 h-3.5 text-[#EF8321] shrink-0 mt-0.5" /> {it}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-slate-500 mb-4"><span className="font-semibold text-[#004C53]">Best for:</span> {t.best}</p>
                <button onClick={trackAction(t.action)} className={`${orangeBtn} mt-auto w-full`}>{t.cta} <ArrowRight className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className={`${heading} text-2xl sm:text-3xl text-center mb-10`}>Frequently Asked Questions</h2>
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

      {/* 7. PROGRAM INCLUDES */}
      <section className="bg-white border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className={`${heading} text-2xl sm:text-3xl text-center mb-10`}>What's Included in Your Program</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INCLUDES.map((c) => (
              <div key={c.t} className="rounded-2xl bg-[#FAF5EC] border border-[#004C53]/10 p-5">
                <h3 className="font-heading font-bold text-sm text-[#004C53] mb-1">{c.t}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials heading="Real People, Real Progress" />

      {/* 8. FINAL CTA */}
      <section className="bg-gradient-to-b from-[#004C53] to-[#003A40] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white">Build a Lifestyle You Never Need a Break From</h2>
          <p className="mt-4 text-sm sm:text-base text-green-50/85">Sustainable wellness requires no extremes — only consistent, time-tested practices aligned with your body's natural design.</p>
          <p className="mt-3 text-sm text-green-50/75 max-w-xl mx-auto">Whether you're ready for a quick 14-day reset or a comprehensive 60-day transformation, we provide the structure, expert guidance and community support to make it happen.</p>
          <p className="mt-4 font-heading text-lg text-amber-100">Your metabolic balance is waiting to be reactivated. Let's begin.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={scrollToEnroll} className="inline-flex items-center gap-2 px-7 py-4 bg-[#EF8321] hover:bg-[#F49B3E] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">Start Your Weight Management Journey <ArrowRight className="w-4 h-4" /></button>
            <button onClick={goConsult} className="inline-flex items-center gap-2 px-7 py-4 bg-white text-[#004C53] hover:bg-green-50 font-bold text-xs uppercase tracking-wider rounded-full transition-all">Schedule an Introductory Call →</button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-green-50/85">
            {TRUST.map((t) => <span key={t} className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-300" /> {t}</span>)}
          </div>
        </div>
      </section>
    </div>
  );
}
