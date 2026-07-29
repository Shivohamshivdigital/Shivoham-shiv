import React from "react";
import { CERTIFICATES } from "../data/certificates";

/**
 * Auto-scrolling carousel of the founder's certificate scans (pauses on
 * hover). Each card opens the full-size image in a new tab. Self-contained —
 * carries its own marquee keyframes so it can drop onto any page.
 */
export default function CertificateGallery({
  eyebrow = "Verified Certificates",
  heading = "",
}: {
  eyebrow?: string;
  heading?: string;
}) {
  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes cg-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .cg-track { display: flex; width: max-content; animation: cg-marquee 55s linear infinite; }
          .cg-wrap:hover .cg-track { animation-play-state: paused; }
        `,
        }}
      />

      <div className="text-center mb-8">
        <p className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">{eyebrow}</p>
        {heading && (
          <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#2F5233] mt-1">{heading}</h3>
        )}
      </div>

      <div className="cg-wrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="cg-track gap-5">
          {[...CERTIFICATES, ...CERTIFICATES].map((c, i) => (
            <a
              key={i}
              href={c.src}
              target="_blank"
              rel="noreferrer"
              className="group w-[240px] sm:w-[270px] shrink-0 bg-white border border-green-100 rounded-2xl p-2.5 shadow-xs hover:shadow-md hover:border-[#4A7C59] transition-all"
              title={`${c.title} — ${c.org} (${c.year})`}
            >
              <div className="overflow-hidden rounded-xl bg-[#F2F9F2]">
                <img
                  src={c.src}
                  alt={`${c.title} — ${c.org}, ${c.year}`}
                  loading="lazy"
                  className="w-full h-40 object-cover object-top group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-xs font-semibold text-[#2F5233] leading-snug mt-2 line-clamp-2">{c.title}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{c.year}</p>
            </a>
          ))}
        </div>
      </div>

      <p className="text-center text-[11px] text-slate-400 mt-6 max-w-2xl mx-auto">
        Hover to pause · tap any certificate to view it full size.
      </p>
    </div>
  );
}
