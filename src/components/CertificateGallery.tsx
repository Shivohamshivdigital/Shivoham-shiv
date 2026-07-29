import React from "react";
import { CERTIFICATES } from "../data/certificates";

/**
 * Grid of the founder's certificate scans. Each opens full-size in a new tab.
 * Images are lazy-loaded so the page stays fast.
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
      <div className="text-center mb-6">
        <p className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">{eyebrow}</p>
        {heading && (
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#2F5233] mt-1">{heading}</h3>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {CERTIFICATES.map((c) => (
          <a
            key={c.src}
            href={c.src}
            target="_blank"
            rel="noreferrer"
            className="group block bg-white border border-green-100 rounded-2xl p-2.5 shadow-xs hover:shadow-md hover:border-[#4A7C59] transition-all"
            title={`${c.title} — ${c.org} (${c.year})`}
          >
            <div className="overflow-hidden rounded-xl bg-[#F2F9F2]">
              <img
                src={c.src}
                alt={`${c.title} — ${c.org}, ${c.year}`}
                loading="lazy"
                className="w-full h-32 sm:h-36 object-cover object-top group-hover:scale-105 transition-transform"
              />
            </div>
            <p className="text-[11px] font-semibold text-[#2F5233] leading-snug mt-2 line-clamp-2">{c.title}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{c.year}</p>
          </a>
        ))}
      </div>

      <p className="text-center text-[11px] text-slate-400 mt-6 max-w-2xl mx-auto">
        Tap any certificate to view it full size.
      </p>
    </div>
  );
}
