import { Star } from "lucide-react";
import { MARMA_TESTIMONIALS } from "../data/marmaTestimonials";

/**
 * Reusable "What our community says" testimonials — an auto-scrolling
 * carousel (pauses on hover). Reads the shared MARMA_TESTIMONIALS data
 * (photos embedded as data URIs, so they render with no upload/CDN).
 * Self-contained (own background, spacing and marquee keyframes) so it can
 * drop onto any page before the CTA.
 */
export default function Testimonials({ heading = "What Our Community Says" }: { heading?: string }) {
  return (
    <section className="bg-[#EEF6F6] border-y border-[#004C53]/10 py-16 sm:py-20">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes tm-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .tm-track { display: flex; width: max-content; animation: tm-marquee 45s linear infinite; }
          .tm-wrap:hover .tm-track { animation-play-state: paused; }
          @media (prefers-reduced-motion: reduce) { .tm-track { animation: none; } }
        `,
        }}
      />
      <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#004C53] text-center mb-10 px-4">{heading}</h2>

      <div className="tm-wrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
        <div className="tm-track gap-6">
          {[...MARMA_TESTIMONIALS, ...MARMA_TESTIMONIALS].map((t, i) => (
            <div
              key={i}
              className="w-[300px] sm:w-[360px] shrink-0 flex flex-col rounded-3xl bg-white border border-[#004C53]/10 p-6 shadow-sm"
            >
              <span className="inline-flex w-fit items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-[#EF8321]/15 text-[#D9741A] rounded-full px-3 py-1 mb-3">
                {t.cond}
              </span>
              <div className="flex gap-0.5 text-[#EF8321] mb-3">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-[#EF8321]" />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed italic flex-grow line-clamp-6">"{t.quote}"</p>
              <div className="mt-4 pt-4 border-t border-[#004C53]/10 flex items-center gap-3">
                <span className="relative w-10 h-10 rounded-full bg-[#004C53] text-white font-heading font-bold flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-[#004C53]/10">
                  {t.name.charAt(0)}
                  {t.img && (
                    <img
                      src={t.img}
                      alt={t.name}
                      loading="lazy"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </span>
                <div>
                  <p className="font-heading font-bold text-sm text-[#004C53]">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[11px] text-slate-500 mt-8 max-w-2xl mx-auto px-4">
        Hover to pause · individual experiences shared by our clients; results vary from person to person and are not
        guaranteed. These are personal accounts, not medical claims, and are not a substitute for professional medical care.
      </p>
    </section>
  );
}
