import React, { useState } from "react";
import { X, Mail, Phone, ShieldCheck, Loader2 } from "lucide-react";
import { getAttribution } from "../utils/attribution";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (email: string, phone: string, token?: string) => void;
}

async function post(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [step, setStep] = useState<"email" | "otp" | "phone">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      await post("/api/auth", { action: "request", email, attribution: getAttribution() });
      setStep("otp");
      setInfo("We've emailed you a 6-digit code.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await post("/api/auth", { action: "verify", email, otp });
      setToken(data.token);
      setStep("phone");
      setInfo(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await post("/api/auth", { action: "phone", email, phone });
      onSuccess(email.trim().toLowerCase(), phone.trim(), token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      await post("/api/auth", { action: "resend", email });
      setInfo("A new code is on its way.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const greenBtn =
    "w-full py-3.5 bg-gradient-to-br from-[#5DBB63] to-[#3E9B49] hover:from-[#6BC971] hover:to-[#46AA52] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-green-900/40 ring-1 ring-green-300/40 transition-all disabled:opacity-60 flex items-center justify-center gap-2";
  const fieldWrap = "mt-1.5 flex items-center gap-2 bg-white/10 border border-green-700 rounded-xl px-3";
  const inputCls = "w-full bg-transparent py-3 text-sm text-white placeholder-green-200/40 focus:outline-none";
  const labelCls = "text-[10px] uppercase font-bold tracking-widest text-[#F3C969]";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#143f29] to-[#0c2a1b] text-cream rounded-3xl shadow-2xl border border-green-700/40 p-7 sm:p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-green-200 hover:text-white" aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5 mb-5">
          {(["email", "otp", "phone"] as const).map((s, i) => (
            <span
              key={s}
              className={`h-1 rounded-full transition-all ${
                step === s ? "w-6 bg-[#F3C969]" : (["email", "otp", "phone"].indexOf(step) > i ? "w-6 bg-green-500" : "w-3 bg-green-800")
              }`}
            />
          ))}
        </div>

        {step === "email" && (
          <>
            <h2 className="font-heading font-bold text-2xl text-white mb-1">Continue with email</h2>
            <p className="text-xs text-green-100/70 mb-6">We'll email you a one-time code — no password needed.</p>
            <form onSubmit={sendCode} className="space-y-4">
              <label className="block">
                <span className={labelCls}>Email</span>
                <div className={fieldWrap}>
                  <Mail className="w-4 h-4 text-green-200 shrink-0" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className={inputCls}
                  />
                </div>
              </label>
              {error && <p className="text-xs text-red-300">{error}</p>}
              {info && <p className="text-xs text-green-200">{info}</p>}
              <button type="submit" disabled={loading} className={greenBtn}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Send code
              </button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-green-800/40 flex items-center justify-center text-[#F3C969] mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-bold text-2xl text-white mb-1">Verify your email</h2>
            <p className="text-xs text-green-100/70 mb-6">
              Enter the 6-digit code we sent to <span className="text-white font-semibold">{email}</span>.
            </p>
            <form onSubmit={verifyCode} className="space-y-4">
              <input
                inputMode="numeric"
                maxLength={6}
                required
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="------"
                className="w-full text-center tracking-[0.5em] text-2xl font-bold bg-white/10 border border-green-700 rounded-xl py-3 text-white placeholder-green-200/30 focus:outline-none focus:ring-2 focus:ring-[#F3C969]"
              />
              {error && <p className="text-xs text-red-300">{error}</p>}
              {info && <p className="text-xs text-green-200">{info}</p>}
              <button type="submit" disabled={loading || otp.length < 6} className={greenBtn}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Verify
              </button>
            </form>
            <p className="text-center text-xs text-green-100/70 mt-5">
              Didn't get it?{" "}
              <button onClick={resend} disabled={loading} className="text-[#F3C969] font-bold hover:underline disabled:opacity-60">
                Resend code
              </button>
            </p>
          </>
        )}

        {step === "phone" && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-green-800/40 flex items-center justify-center text-[#F3C969] mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-bold text-2xl text-white mb-1">Your phone number</h2>
            <p className="text-xs text-green-100/70 mb-6">So our team can reach you on WhatsApp about your onboarding.</p>
            <form onSubmit={submitPhone} className="space-y-4">
              <label className="block">
                <span className={labelCls}>Phone / WhatsApp</span>
                <div className={fieldWrap}>
                  <Phone className="w-4 h-4 text-green-200 shrink-0" />
                  <input
                    type="tel"
                    required
                    autoFocus
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={inputCls}
                  />
                </div>
              </label>
              {error && <p className="text-xs text-red-300">{error}</p>}
              <button type="submit" disabled={loading} className={greenBtn}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Continue to payment
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
