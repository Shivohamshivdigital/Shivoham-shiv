import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Mail, ShieldCheck, Loader2, LogIn } from "lucide-react";
import SEO from "../components/SEO";
import { getAttribution } from "../utils/attribution";
import { setSession, getSession } from "../utils/session";

async function post(body: any) {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export default function LoginView() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Already logged in? Go straight through.
  useEffect(() => {
    if (getSession()) navigate(redirect, { replace: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [navigate, redirect]);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      await post({ action: "request", email, attribution: getAttribution() });
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
      const data = await post({ action: "verify", email, otp });
      if (!data.token) throw new Error("Login failed. Please try again.");
      setSession(data.token, data.email || email.trim().toLowerCase());
      navigate(redirect, { replace: true });
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
      await post({ action: "resend", email });
      setInfo("A new code is on its way.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const field =
    "mt-1.5 flex items-center gap-2 bg-white border border-green-200 rounded-xl px-3 focus-within:ring-2 focus-within:ring-green-500";
  const inputCls = "w-full bg-transparent py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none";
  const labelCls = "text-[10px] uppercase font-bold tracking-widest text-slate-500";
  const greenBtn =
    "w-full py-3.5 bg-gradient-to-br from-[#5DBB63] to-[#3E9B49] hover:from-[#6BC971] hover:to-[#46AA52] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2";

  return (
    <div className="min-h-screen bg-[#FAFBF7] flex items-center justify-center px-4 py-20 font-sans">
      <SEO title="Log in — Shivoham Shiv" description="Log in to your Shivoham Shiv account." />
      <div className="w-full max-w-md bg-white border border-green-100 rounded-3xl shadow-sm p-7 sm:p-9">
        <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-5">
          {step === "email" ? <LogIn className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
        </div>

        {step === "email" && (
          <>
            <h1 className="font-heading font-bold text-2xl text-green-900 mb-1">Log in</h1>
            <p className="text-xs text-slate-500 mb-6">
              Enter your email — we'll send a one-time code. No password needed.
            </p>
            <form onSubmit={sendCode} className="space-y-4">
              <label className="block">
                <span className={labelCls}>Email</span>
                <div className={field}>
                  <Mail className="w-4 h-4 text-green-600 shrink-0" />
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
              {error && <p className="text-xs text-red-600">{error}</p>}
              {info && <p className="text-xs text-green-700">{info}</p>}
              <button type="submit" disabled={loading} className={greenBtn}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Send code
              </button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <h1 className="font-heading font-bold text-2xl text-green-900 mb-1">Enter your code</h1>
            <p className="text-xs text-slate-500 mb-6">
              We sent a 6-digit code to <span className="text-slate-800 font-semibold">{email}</span>.
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
                className="w-full text-center tracking-[0.5em] text-2xl font-bold bg-[#FAFBF7] border border-green-200 rounded-xl py-3 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              {info && <p className="text-xs text-green-700">{info}</p>}
              <button type="submit" disabled={loading || otp.length < 6} className={greenBtn}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Log in
              </button>
            </form>
            <p className="text-center text-xs text-slate-500 mt-5">
              Didn't get it?{" "}
              <button onClick={resend} disabled={loading} className="text-green-700 font-bold hover:underline disabled:opacity-60">
                Resend code
              </button>
              {" · "}
              <button onClick={() => { setStep("email"); setOtp(""); setError(null); }} className="text-green-700 font-bold hover:underline">
                Change email
              </button>
            </p>
          </>
        )}

        <p className="text-center text-[11px] text-slate-400 mt-7">
          New here?{" "}
          <Link to="/weight-loss" className="text-green-700 font-semibold hover:underline">
            Explore the program
          </Link>
        </p>
      </div>
    </div>
  );
}
