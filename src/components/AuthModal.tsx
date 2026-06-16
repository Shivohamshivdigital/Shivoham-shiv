import React, { useState } from "react";
import { X, Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { getAttribution } from "../utils/attribution";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (email: string) => void;
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
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        await post("/api/auth", { action: "signup", email, password, attribution: getAttribution() });
        setStep("otp");
        setInfo("We've emailed you a 6-digit code.");
      } else {
        const data = await post("/api/auth", { action: "login", email, password });
        if (data.needsVerification) {
          setStep("otp");
          setInfo("Please verify your email — we've sent you a code.");
        } else if (data.success) {
          onSuccess(data.email || email.trim().toLowerCase());
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await post("/api/auth", { action: "verify", email, otp });
      if (data.success) onSuccess(data.email || email.trim().toLowerCase());
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

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#143f29] to-[#0c2a1b] text-cream rounded-3xl shadow-2xl border border-green-700/40 p-7 sm:p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-green-200 hover:text-white" aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        {step === "form" ? (
          <>
            <h2 className="font-heading font-bold text-2xl text-white mb-1">
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-xs text-green-100/70 mb-6">
              {mode === "signup"
                ? "Sign up to reserve your seat and pay securely."
                : "Log in to continue to payment."}
            </p>
            <form onSubmit={submitForm} className="space-y-4">
              <label className="block">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#F3C969]">Email</span>
                <div className="mt-1.5 flex items-center gap-2 bg-white/10 border border-green-700 rounded-xl px-3">
                  <Mail className="w-4 h-4 text-green-200 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full bg-transparent py-3 text-sm text-white placeholder-green-200/40 focus:outline-none"
                  />
                </div>
              </label>
              <label className="block">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#F3C969]">Password</span>
                <div className="mt-1.5 flex items-center gap-2 bg-white/10 border border-green-700 rounded-xl px-3">
                  <Lock className="w-4 h-4 text-green-200 shrink-0" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-transparent py-3 text-sm text-white placeholder-green-200/40 focus:outline-none"
                  />
                </div>
              </label>
              {error && <p className="text-xs text-red-300">{error}</p>}
              {info && <p className="text-xs text-green-200">{info}</p>}
              <button type="submit" disabled={loading} className={greenBtn}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === "signup" ? "Sign up & continue" : "Log in & continue"}
              </button>
            </form>
            <p className="text-center text-xs text-green-100/70 mt-5">
              {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
              <button
                onClick={() => {
                  setMode(mode === "signup" ? "login" : "signup");
                  setError(null);
                  setInfo(null);
                }}
                className="text-[#F3C969] font-bold hover:underline"
              >
                {mode === "signup" ? "Log in" : "Sign up"}
              </button>
            </p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-green-800/40 flex items-center justify-center text-[#F3C969] mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-bold text-2xl text-white mb-1">Verify your email</h2>
            <p className="text-xs text-green-100/70 mb-6">
              Enter the 6-digit code we sent to <span className="text-white font-semibold">{email}</span>.
            </p>
            <form onSubmit={submitOtp} className="space-y-4">
              <input
                inputMode="numeric"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="------"
                className="w-full text-center tracking-[0.5em] text-2xl font-bold bg-white/10 border border-green-700 rounded-xl py-3 text-white placeholder-green-200/30 focus:outline-none focus:ring-2 focus:ring-[#F3C969]"
              />
              {error && <p className="text-xs text-red-300">{error}</p>}
              {info && <p className="text-xs text-green-200">{info}</p>}
              <button type="submit" disabled={loading || otp.length < 6} className={greenBtn}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Verify & continue to payment
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
      </div>
    </div>
  );
}
