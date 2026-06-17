import React, { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import SEO from "../components/SEO";

export default function ThankYouView() {
  const [params] = useSearchParams();
  const amount = Number(params.get("amount") || 0);
  const plan = params.get("plan") || "";
  const fired = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (fired.current) return;
    fired.current = true;

    // Fire the conversion events here so /thank-you is the Purchase trigger.
    const fbq = (window as any).fbq;
    if (typeof fbq === "function") {
      fbq("track", "Purchase", { value: amount || undefined, currency: "INR", content_name: plan || undefined });
    }
    const gtag = (window as any).gtag;
    if (typeof gtag === "function") {
      gtag("event", "purchase", { value: amount, currency: "INR", items: plan ? [{ item_name: plan }] : undefined });
    }
  }, [amount, plan]);

  return (
    <div className="min-h-screen bg-[#FAFBF7] flex items-center justify-center px-4 py-20 font-sans">
      <SEO title="Thank you — Shivoham Shiv" description="Your payment was successful." />
      <div className="max-w-lg w-full bg-white border border-green-100 rounded-3xl shadow-sm p-8 sm:p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-green-900 mb-2">Payment successful 🎉</h1>
        <p className="text-sm text-slate-600 leading-relaxed mb-7">
          {amount ? `We've received your ₹${amount.toLocaleString("en-IN")} payment. ` : ""}
          Our team will reach out on WhatsApp within 24 hours to begin your transformation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://wa.me/917317778215"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Message us on WhatsApp
          </a>
          <Link
            to="/"
            className="px-6 py-3 border-2 border-green-200 text-green-800 hover:bg-green-50 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
