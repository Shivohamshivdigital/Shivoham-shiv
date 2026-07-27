import React from "react";
import { MARMA_TESTIMONIALS } from "../data/marmaTestimonials";

/**
 * Auto-scrolling testimonials carousel (pauses on hover). Self-contained —
 * carries its own marquee keyframes so it can be dropped on any page.
 */
export default function MarmaTestimonials({
  eyebrow = "Real People · Real Stories",
  heading = "What our clients say",
}: {
  eyebrow?: string;
  heading?: string;
}) {
  const T = MARMA_TESTIMONIALS;
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes mt-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .mt-track { display: flex; width: max-content; animation: mt-marquee 32s linear infinite; }
          .mt-wrap:hover .mt-track { animation-play-state: paused; }
        `,
        }}
      />

      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">{eyebrow}</span>
        <h2 className="font-heading font-bold text-2xl sm:text-4xl text-[#2F5233] mt-1">{heading}</h2>
      </div>

      <div className="mt-wrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="mt-track gap-6">
          {[...T, ...T].map((t, i) => (
            <div
              key={i}
              className="w-[300px] sm:w-[360px] shrink-0 bg-white border border-green-100 rounded-2xl p-6 shadow-xs flex flex-col"
            >
              <span className="inline-block self-start px-2.5 py-1 text-[11px] font-bold bg-[#E3F1E3] text-green-800 rounded-md mb-3">
                {t.cond}
              </span>
              <div className="text-amber-400 text-sm mb-2" aria-hidden="true">★★★★★</div>
              <p className="text-sm text-[#3A4A40]/85 italic leading-relaxed flex-1">"{t.quote}"</p>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
                <span className="relative w-10 h-10 rounded-full bg-[#2F5D50] text-white text-sm font-bold flex items-center justify-center shrink-0 overflow-hidden">
                  {t.name.charAt(0)}
                  {t.img && (
                    <img
                      src={t.img}
                      alt={t.name}
                      onError={(e) => (e.currentTarget as HTMLImageElement).remove()}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </span>
                <div className="text-xs">
                  <b className="text-[#2F5233] block">{t.name}</b>
                  <span className="text-[#E8943A]">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[11px] text-slate-400 mt-8 max-w-2xl mx-auto">
        Individual experiences shared by our clients — results vary from person to person. Marma Dab Chikitsa is a
        traditional wellness practice that supports wellbeing and is not a substitute for medical care.
      </p>
    </section>
  );
}
