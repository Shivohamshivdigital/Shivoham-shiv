import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Activity, Scale, Ruler, ArrowRight, Info, ShieldCheck } from "lucide-react";
import SEO from "../components/SEO";

type Unit = "metric" | "imperial";
type Standard = "who" | "asian";

interface Band {
  label: string;
  min: number; // inclusive lower bound of the band
  color: string; // bar segment colour
  text: string; // pill text colour classes
}

// WHO standard adult BMI bands and the ICMR / WHO Asia-Pacific (Asian-Indian) bands.
const BANDS: Record<Standard, Band[]> = {
  who: [
    { label: "Underweight", min: 0, color: "#5FA8D3", text: "text-sky-700 bg-sky-50 border-sky-200" },
    { label: "Normal", min: 18.5, color: "#5DBB63", text: "text-green-700 bg-green-50 border-green-200" },
    { label: "Overweight", min: 25, color: "#F3C969", text: "text-amber-700 bg-amber-50 border-amber-200" },
    { label: "Obese", min: 30, color: "#E8743B", text: "text-orange-700 bg-orange-50 border-orange-200" },
  ],
  asian: [
    { label: "Underweight", min: 0, color: "#5FA8D3", text: "text-sky-700 bg-sky-50 border-sky-200" },
    { label: "Normal", min: 18.0, color: "#5DBB63", text: "text-green-700 bg-green-50 border-green-200" },
    { label: "Overweight", min: 23, color: "#F3C969", text: "text-amber-700 bg-amber-50 border-amber-200" },
    { label: "Obese", min: 25, color: "#E8743B", text: "text-orange-700 bg-orange-50 border-orange-200" },
  ],
};

// The visual gauge runs 15 → 40 so a marker can be positioned along it.
const GAUGE_MIN = 15;
const GAUGE_MAX = 40;

function classify(bmi: number, standard: Standard): Band {
  const bands = BANDS[standard];
  let match = bands[0];
  for (const b of bands) {
    if (bmi >= b.min) match = b;
  }
  return match;
}

const FAQS = [
  {
    q: "What is BMI?",
    a: "BMI (Body Mass Index) is a simple screening number calculated from your height and weight (weight in kg ÷ height in metres squared). It gives a quick, general idea of whether your weight sits in a healthy range.",
  },
  {
    q: "Is BMI accurate for everyone?",
    a: "BMI is a screening tool, not a diagnosis. It doesn't tell muscle from fat and doesn't account for age, gender, or body frame. Athletes and very muscular people can read high while being healthy. Always confirm with a qualified professional.",
  },
  {
    q: "Why are the Asian-Indian numbers different?",
    a: "Indian bodies tend to carry more body fat and face metabolic risk at a lower BMI. Indian medical guidelines (ICMR / WHO Asia-Pacific) therefore use lower cut-offs — overweight from 23 and obese from 25 — so you can use the Asian-Indian setting for a more relevant picture.",
  },
  {
    q: "My BMI is high — what should I do?",
    a: "Don't panic over one number. A natural, sustainable routine of the right diet, movement and daily habits works better than crash dieting. Our team can build a personalized Ayurvedic plan around your body type — start with the 14-day challenge or book a free call.",
  },
];

export default function BmiCalculatorView() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [standard, setStandard] = useState<Standard>("asian");

  // Metric inputs
  const [cm, setCm] = useState("");
  const [kg, setKg] = useState("");
  // Imperial inputs
  const [ft, setFt] = useState("");
  const [inch, setInch] = useState("");
  const [lb, setLb] = useState("");

  const bmi = useMemo(() => {
    let heightM = 0;
    let weightKg = 0;
    if (unit === "metric") {
      heightM = parseFloat(cm) / 100;
      weightKg = parseFloat(kg);
    } else {
      const totalInches = (parseFloat(ft) || 0) * 12 + (parseFloat(inch) || 0);
      heightM = totalInches * 0.0254;
      weightKg = (parseFloat(lb) || 0) * 0.45359237;
    }
    if (!heightM || !weightKg || heightM <= 0 || weightKg <= 0) return null;
    const value = weightKg / (heightM * heightM);
    if (!isFinite(value) || value <= 0 || value > 200) return null;
    return value;
  }, [unit, cm, kg, ft, inch, lb]);

  const band = bmi != null ? classify(bmi, standard) : null;
  const markerPct =
    bmi != null
      ? Math.min(100, Math.max(0, ((bmi - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)) * 100))
      : 0;

  const bands = BANDS[standard];

  const inputBase =
    "w-full rounded-xl border border-green-200 bg-white px-4 py-3 text-lg font-semibold text-[#2F5233] placeholder-slate-300 focus:border-[#5DBB63] focus:ring-2 focus:ring-[#5DBB63]/30 focus:outline-none transition";

  return (
    <div className="min-h-screen bg-[#FAFBF7] font-sans">
      <SEO
        title="Free BMI Calculator — Shivoham Shiv"
        description="Calculate your Body Mass Index (BMI) instantly with metric or imperial units and Indian (ICMR) or WHO cut-offs. A quick, free screening tool from Shivoham Shiv."
        focusKeyword="BMI calculator"
        isFAQPage
        faqs={FAQS}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#234036] to-[#2F5D50] text-white px-4 sm:px-6 lg:px-8 pt-14 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-200">
            <Activity className="w-3.5 h-3.5" /> Free Health Tool
          </span>
          <h1 className="mt-5 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight text-white">
            BMI Calculator
          </h1>
          <p className="mt-4 text-sm sm:text-base text-green-50/85 leading-relaxed max-w-xl mx-auto">
            Find out where your weight sits in seconds. Enter your height and weight — we'll show your
            Body Mass Index and what it means, using Indian or WHO guidelines.
          </p>
        </div>
      </section>

      {/* Calculator card */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-16 pb-20">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-green-100 p-6 sm:p-9">
          {/* Unit toggle */}
          <div className="flex items-center justify-center gap-2 mb-7">
            <div className="inline-flex rounded-full bg-green-50 border border-green-100 p-1">
              {(["metric", "imperial"] as Unit[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                    unit === u ? "bg-[#2F5D50] text-white shadow" : "text-[#2F5233] hover:bg-green-100"
                  }`}
                >
                  {u === "metric" ? "Metric (cm / kg)" : "Imperial (ft / lb)"}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2F5233] mb-2">
                <Ruler className="w-3.5 h-3.5 text-[#5DBB63]" /> Height
              </label>
              {unit === "metric" ? (
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={cm}
                    onChange={(e) => setCm(e.target.value)}
                    placeholder="170"
                    className={inputBase}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">cm</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={ft}
                      onChange={(e) => setFt(e.target.value)}
                      placeholder="5"
                      className={inputBase}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">ft</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={inch}
                      onChange={(e) => setInch(e.target.value)}
                      placeholder="7"
                      className={inputBase}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">in</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2F5233] mb-2">
                <Scale className="w-3.5 h-3.5 text-[#5DBB63]" /> Weight
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  value={unit === "metric" ? kg : lb}
                  onChange={(e) => (unit === "metric" ? setKg(e.target.value) : setLb(e.target.value))}
                  placeholder={unit === "metric" ? "68" : "150"}
                  className={inputBase}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                  {unit === "metric" ? "kg" : "lb"}
                </span>
              </div>
            </div>
          </div>

          {/* Standard toggle */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-500">Guideline</span>
            <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs">
              <button
                onClick={() => setStandard("asian")}
                className={`px-4 py-1.5 rounded-full font-bold transition ${
                  standard === "asian" ? "bg-white text-[#2F5233] shadow-sm" : "text-slate-500 hover:text-[#2F5233]"
                }`}
              >
                Asian-Indian (ICMR)
              </button>
              <button
                onClick={() => setStandard("who")}
                className={`px-4 py-1.5 rounded-full font-bold transition ${
                  standard === "who" ? "bg-white text-[#2F5233] shadow-sm" : "text-slate-500 hover:text-[#2F5233]"
                }`}
              >
                WHO Standard
              </button>
            </div>
          </div>

          {/* Result */}
          <div className="mt-8 border-t border-green-100 pt-8">
            {bmi == null || band == null ? (
              <p className="text-center text-sm text-slate-400 py-6">
                Enter your height and weight to see your BMI.
              </p>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-center"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Your BMI</p>
                <div className="mt-1 flex items-end justify-center gap-3">
                  <span className="text-6xl font-bold text-[#2F5233] leading-none">{bmi.toFixed(1)}</span>
                  <span
                    className={`mb-1.5 inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${band.text}`}
                  >
                    {band.label}
                  </span>
                </div>

                {/* Gauge */}
                <div className="mt-8">
                  <div className="relative h-3 w-full rounded-full overflow-hidden flex">
                    {bands.map((b, i) => {
                      const next = bands[i + 1];
                      const start = i === 0 ? GAUGE_MIN : b.min;
                      const end = next ? next.min : GAUGE_MAX;
                      const width = ((end - start) / (GAUGE_MAX - GAUGE_MIN)) * 100;
                      return <span key={b.label} style={{ width: `${width}%`, backgroundColor: b.color }} />;
                    })}
                    {/* Marker */}
                    <span
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-white border-[3px] border-[#2F5233] shadow-md"
                      style={{ left: `${markerPct}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
                    <span>{GAUGE_MIN}</span>
                    <span>{GAUGE_MAX}+</span>
                  </div>
                </div>

                {/* Band legend */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {bands.map((b, i) => {
                    const next = bands[i + 1];
                    const range =
                      i === 0
                        ? `< ${bands[1].min}`
                        : next
                        ? `${b.min}–${(next.min - 0.1).toFixed(1)}`
                        : `${b.min}+`;
                    const active = band.label === b.label;
                    return (
                      <div
                        key={b.label}
                        className={`rounded-xl border px-2 py-2 text-center transition ${
                          active ? b.text + " ring-2 ring-offset-1 ring-current/30" : "border-slate-100 bg-slate-50 text-slate-500"
                        }`}
                      >
                        <span className="block h-1.5 w-full rounded-full mb-1.5" style={{ backgroundColor: b.color }} />
                        <span className="block text-[11px] font-bold">{b.label}</span>
                        <span className="block text-[10px] opacity-80">{range}</span>
                      </div>
                    );
                  })}
                </div>

                {/* CTA when above normal */}
                {(band.label === "Overweight" || band.label === "Obese") && (
                  <div className="mt-8 rounded-2xl bg-[#F2F9F2] border border-[#D8ECD8] p-5 text-left">
                    <p className="text-sm font-bold text-[#2F5233]">
                      Your BMI is above the healthy range — a natural plan can help.
                    </p>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      No crash diets or pills. Our team builds a personalized Ayurvedic routine around your body type.
                    </p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <Link
                        to="/challenge"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-br from-[#5DBB63] to-[#3E9B49] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition"
                      >
                        Try the 14-day challenge <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to="/weight-loss"
                        className="flex-1 inline-flex items-center justify-center px-5 py-3 border-2 border-green-200 text-green-800 hover:bg-green-50 font-bold text-xs uppercase tracking-wider rounded-xl transition"
                      >
                        See the 60-day program
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="mt-8 flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              BMI is a general screening tool, not a medical diagnosis. It does not distinguish muscle from
              fat or account for age and body frame. Please consult a qualified professional before making
              health decisions.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center font-heading font-bold text-2xl sm:text-3xl text-[#2F5233] mb-8">
            BMI — quick answers
          </h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl bg-white border border-green-100 px-5 py-4 shadow-sm"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-bold text-[#2F5233]">
                  {f.q}
                  <span className="ml-4 text-[#5DBB63] transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            Your numbers are calculated in your browser — nothing is stored or sent anywhere.
          </div>
        </div>
      </section>
    </div>
  );
}
