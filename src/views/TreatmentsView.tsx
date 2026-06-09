import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Star, Clock, Layers, CheckCircle2, HelpCircle } from "lucide-react";
import { mockCourses } from "../data/coursesData";
import SEO from "../components/SEO";

// Map each course id to its public detail-page slug.
const SLUG_BY_ID: Record<string, string> = {
  "corp-wellness": "corporate-wellness",
  "mudra-therapy": "mudra-therapy",
  "acupressure-therapy": "acupressure-therapy",
  "kids-eq": "mindfulness-kids",
};

const FAQS = [
  {
    q: "What holistic treatments does Shivoham Shiv offer?",
    a: "Shivoham Shiv offers a range of Vedic wellness treatments including Acupressure (Marma) Therapy, Mudra Therapy, Corporate & Adult Wellness programs, and Mindfulness & Emotional Intelligence (EQ) training for kids. Each therapy blends ancient Vedic science with practical, modern guidance.",
  },
  {
    q: "Are these treatments suitable for beginners?",
    a: "Yes. Most of our treatments are beginner-friendly and self-paced, with step-by-step video modules, downloadable charts and guided practice. You do not need any prior experience to start.",
  },
  {
    q: "Can I take these treatments online from anywhere?",
    a: "Absolutely. All treatments are available online so you can learn and practice from anywhere in India or abroad. Some programs also include live interactive sessions with certified instructors.",
  },
  {
    q: "How do I choose the right treatment for me?",
    a: "If you are unsure which therapy suits your needs, you can book a free consultation. Our wellness team will understand your concerns and recommend the most suitable treatment for your goals.",
  },
];

export default function TreatmentsView() {
  return (
    <div className="bg-[#FAFBF7] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Holistic Treatments & Therapies in Jhansi | Vedic Wellness — Shivoham Shiv"
        description="Explore Shivoham Shiv's holistic Vedic treatments — Acupressure (Marma) Therapy, Mudra Therapy, Corporate & Adult Wellness and Mindfulness & EQ training for kids. Online & beginner-friendly."
        focusKeyword="holistic treatments and therapies"
        isBreadcrumb={true}
        breadcrumbItems={[
          { name: "Home", url: "/" },
          { name: "Treatments", url: "/treatments" },
        ]}
        isFAQPage={true}
        faqs={FAQS}
      />

      <div className="max-w-7xl mx-auto">
        {/* Hero / Intro */}
        <header className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center space-x-1.5 bg-green-100 border border-green-200/60 rounded-full px-4.5 py-1.5 text-green-900 text-xs font-bold uppercase tracking-widest leading-none">
            <Sparkles className="w-3.5 h-3.5 text-[#E8943A] fill-[#E8943A]" />
            <span>Healing Directory</span>
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl text-green-900 mt-3 mb-5 leading-tight">
            Holistic Treatments &amp; Therapies
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-slate-700">
            At Shivoham Shiv, every treatment is rooted in authentic Vedic science and shaped for modern
            life. From <strong>Acupressure (Marma) Therapy</strong> and <strong>Mudra Therapy</strong> to{" "}
            <strong>Corporate &amp; Adult Wellness</strong> and <strong>Mindfulness &amp; EQ training for kids</strong>,
            explore the complete directory below and find the path that brings your body and mind back to balance.
          </p>
        </header>

        {/* Quick directory grid */}
        <section aria-label="All treatments" className="mb-20">
          <h2 className="font-heading font-bold text-2xl text-green-900 mb-8 text-center">
            Browse All Treatments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockCourses.map((course) => {
              const slug = SLUG_BY_ID[course.id] || course.id;
              return (
                <Link
                  key={course.id}
                  to={`/courses/${slug}`}
                  className="group flex flex-col bg-white border border-green-100 rounded-3xl shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={course.image}
                      alt={`${course.category} treatment at Shivoham Shiv`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {course.isUpcoming && (
                      <span className="absolute top-3 left-3 bg-[#E8943A] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col flex-grow p-6">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8943A] mb-2">
                      {course.category}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-green-900 leading-snug mb-2">
                      {course.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-600 mb-4 line-clamp-3">
                      {course.tagline}
                    </p>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-slate-500 mb-5 mt-auto">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {course.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-green-600" /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-green-600" /> {course.lessonsCount} lessons
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2F5D50] group-hover:text-[#23483E] transition-colors">
                      Explore Treatment
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Detailed SEO content sections */}
        <section aria-label="Treatment details" className="space-y-16 mb-20">
          {mockCourses.map((course, idx) => {
            const slug = SLUG_BY_ID[course.id] || course.id;
            return (
              <article
                key={course.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  idx % 2 === 1 ? "lg:[&>figure]:order-2" : ""
                }`}
              >
                <figure className="rounded-3xl overflow-hidden shadow-sm border border-green-100">
                  <img
                    src={course.image}
                    alt={`${course.category} — ${course.title}`}
                    loading="lazy"
                    className="w-full h-64 object-cover"
                  />
                </figure>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8943A]">
                    {course.category}
                  </span>
                  <h2 className="font-heading font-bold text-2xl sm:text-3xl text-green-900 mt-2 mb-4 leading-tight">
                    {course.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-700 mb-5">{course.description}</p>
                  <ul className="space-y-2.5 mb-6">
                    {course.benefits.slice(0, 3).map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/courses/${slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#2F5D50] hover:bg-[#23483E] text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                  >
                    Learn More About {course.category}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </section>

        {/* FAQ section (also emitted as FAQ schema for SEO) */}
        <section aria-label="Frequently asked questions" className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-green-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm">
                <h3 className="flex items-start gap-2.5 font-semibold text-green-900 text-sm mb-2">
                  <HelpCircle className="w-4.5 h-4.5 text-[#E8943A] shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-sm leading-relaxed text-slate-700 pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2F5D50] hover:bg-[#23483E] text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            Not sure which one? Book a free consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
