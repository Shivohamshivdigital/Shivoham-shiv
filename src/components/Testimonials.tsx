import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "I came to Shivoham Shiv wanting to improve my own health. Three months later, I'm a certified Mudra therapist. The structured approach and live instruction made all the difference — my clients are already seeing results.",
    name: "Rajesh Kumar",
    role: "Former IT Professional, Now Wellness Practitioner",
  },
  {
    quote:
      "As a yoga teacher for 8 years, I thought I knew traditional practices. But this academy deepened my understanding completely. Now I can offer my students authentic, safe and science-informed techniques.",
    name: "Priya Sharma",
    role: "Certified Yoga Teacher",
  },
  {
    quote:
      "The weight-management program changed how I think about health. It's not about restriction — it's about understanding your body and building sustainable habits.",
    name: "Isha Desai",
    role: "Wellness Transformation Student",
  },
];

/**
 * Reusable "What our community says" testimonials band. Self-contained
 * (own background + spacing) so it can drop onto any page before the CTA.
 */
export default function Testimonials({ heading = "What Our Community Says" }: { heading?: string }) {
  return (
    <section className="bg-[#EEF6F6] border-y border-[#004C53]/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#004C53] text-center mb-10">{heading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="flex flex-col rounded-3xl bg-white border border-[#004C53]/10 p-6 shadow-sm">
              <div className="flex gap-0.5 text-[#EF8321] mb-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-[#EF8321]" />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed italic flex-grow">"{t.quote}"</p>
              <div className="mt-4 pt-4 border-t border-[#004C53]/10">
                <p className="font-heading font-bold text-sm text-[#004C53]">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-[11px] text-slate-500 mt-6 max-w-2xl mx-auto">
          Individual experiences shared by our students; results vary from person to person.
        </p>
      </div>
    </section>
  );
}
