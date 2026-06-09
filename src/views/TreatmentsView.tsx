import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Star, Clock, Layers } from "lucide-react";
import { mockCourses } from "../data/coursesData";
import SEO from "../components/SEO";

// Map each course id to its public detail-page slug.
const SLUG_BY_ID: Record<string, string> = {
  "corp-wellness": "corporate-wellness",
  "mudra-therapy": "mudra-therapy",
  "acupressure-therapy": "acupressure-therapy",
  "kids-eq": "mindfulness-kids",
};

export default function TreatmentsView() {
  return (
    <div className="bg-[#FAFBF7] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Our Treatments & Therapies | Vedic Healing Directory — Shivoham Shiv"
        description="Explore the full directory of Shivoham Shiv's holistic treatments and therapies — Acupressure, Mudra Therapy, Corporate Wellness and Mindfulness & EQ training."
        focusKeyword="holistic treatment therapies"
        isBreadcrumb={true}
        breadcrumbItems={[
          { name: "Home", url: "/" },
          { name: "Other Treatment", url: "/treatments" },
        ]}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center space-x-1.5 bg-green-100 border border-green-200/60 rounded-full px-4.5 py-1.5 text-green-900 text-xs font-bold uppercase tracking-widest leading-none">
            <Sparkles className="w-3.5 h-3.5 text-[#E8943A] fill-[#E8943A]" />
            <span>Healing Directory</span>
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl text-green-900 mt-3 mb-4 leading-tight">
            Our Treatments &amp; Therapies
          </h1>
          <p className="text-sm leading-relaxed text-slate-700">
            A complete directory of our Vedic wellness treatments. Choose a therapy below to explore its
            benefits, modules and how it can guide you back to balance.
          </p>
        </div>

        {/* Directory list */}
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
                    alt={course.category}
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
                  <h2 className="font-heading font-bold text-lg text-green-900 leading-snug mb-2">
                    {course.title}
                  </h2>
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

        {/* CTA */}
        <div className="text-center mt-16">
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
