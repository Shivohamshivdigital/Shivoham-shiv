import { Star } from "lucide-react";

interface Testimonial {
  badge: string;
  quote: string;
  name: string;
  role: string;
  img?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    badge: "Chronic Neck & Cervical Pain",
    quote:
      "Long hours of desk work had caused persistent neck and cervical discomfort. Through Ayurvedic Acupressure the right marma points were worked on, and I experienced improved mobility, relaxation and better comfort through my whole workday — without depending on medication.",
    name: "Rajesh Sharma",
    role: "IT Professional",
  },
  {
    badge: "L5–L6 Disc Gapping",
    quote:
      "Long working hours had led to L5–L6 disc gapping, severe back discomfort and restricted movement. Through Ayurvedic Acupressure my blocked marma points were released — I regained posture, mobility and lasting comfort, without relying on pills.",
    name: "Vinod Kumar",
    role: "Banker",
    img: "https://cdn.corenexis.com/f/Dg8EUGRq3om.png",
  },
  {
    badge: "Irregular Menstrual Cycle",
    quote:
      "Irregular periods had started affecting my balance and daily routine. The Ayurvedic Acupressure sessions worked on exactly the right vital points and helped me feel more regulated, calm and confident — managing my body naturally, without any medication.",
    name: "Neha Sharma",
    role: "Working Professional",
  },
  {
    badge: "48-Hr Continuous Hand Tremor",
    quote:
      "My hands had been shaking almost continuously for close to 48 hours, along with mental stress and fatigue. The precise pressure of Ayurvedic Acupressure calmed the tremors and left me feeling steady, stable and emotionally balanced. The sessions were structured, reassuring and easy to follow.",
    name: "Gitanjali",
    role: "Teacher",
    img: "https://cdn.corenexis.com/f/A8hh8IjCwoa.png",
  },
  {
    badge: "Pregnancy Discomfort",
    quote:
      "During pregnancy my body often felt heavy and I was emotionally very sensitive. The gentle marma points of Ayurvedic Acupressure helped me feel calmer, more balanced and connected with my body — simple, reassuring and a real comfort during that phase of life.",
    name: "Sunita Verma",
    role: "Homemaker",
  },
  {
    badge: "15 Yrs of Continuous Swelling",
    quote:
      "For nearly 15 years I faced continuous swelling and physical heaviness that affected my daily routine. Ayurvedic Acupressure released the blocked points and I finally felt lighter, balanced and comfortable. I truly appreciated the natural, pill-free approach.",
    name: "Archana Gautam",
    role: "Teacher",
    img: "https://cdn.corenexis.com/f/6lo5URS2WWn.png",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="flex flex-col rounded-3xl bg-white border border-[#004C53]/10 p-6 shadow-sm">
              <span className="inline-flex w-fit items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-[#EF8321]/15 text-[#D9741A] rounded-full px-3 py-1 mb-3">
                {t.badge}
              </span>
              <div className="flex gap-0.5 text-[#EF8321] mb-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-[#EF8321]" />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed italic flex-grow">"{t.quote}"</p>
              <div className="mt-4 pt-4 border-t border-[#004C53]/10 flex items-center gap-3">
                {t.img ? (
                  <img
                    src={t.img}
                    alt={t.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-[#004C53]/10 shrink-0"
                  />
                ) : (
                  <span className="w-10 h-10 rounded-full bg-[#004C53] text-white font-heading font-bold flex items-center justify-center shrink-0">
                    {t.name.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="font-heading font-bold text-sm text-[#004C53]">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-[11px] text-slate-500 mt-6 max-w-2xl mx-auto">
          Individual experiences shared by our clients; results vary from person to person and are not guaranteed.
          These are personal accounts, not medical claims, and are not a substitute for professional medical care.
        </p>
      </div>
    </section>
  );
}
