"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { loginUser as firebaseLogin } from "@/services/auth";
import HelmetLogo from "@/components/common/HelmetLogo";

type LoginStep = "contact" | "otp" | "password";

export default function LoginForm() {
  const { sendMockOtp, loginWithOtp, activeOtpCode, t } = useApp();

  const [step, setStep] = useState<LoginStep>("contact");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [inputs, setInputs] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Step 1: Redirect / Request ─────────────────────────────
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!emailOrPhone.trim()) {
      setError("กรุณากรอกอีเมล หรือเบอร์โทรศัพท์");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      sendMockOtp(emailOrPhone); // generates & sets activeOtpCode in AppContext
      setStep("otp");
      setLoading(false);
    }, 800);
  };

  // Handle 6-box OTP input
  const handleOtpInput = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...inputs];
    next[idx] = val.slice(-1);
    setInputs(next);

    // Auto-focus next box
    if (val && idx < 5) {
      const nextEl = document.getElementById(`otp-box-login-${idx + 1}`);
      nextEl?.focus();
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !inputs[idx] && idx > 0) {
      const prevEl = document.getElementById(`otp-box-login-${idx - 1}`);
      prevEl?.focus();
    }
  };

  // ── Verify OTP ────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const enteredOtp = inputs.join("");
    if (enteredOtp.length < 6) {
      setError("กรุณากรอกรหัส OTP ให้ครบ 6 หลัก");
      return;
    }

    setLoading(true);
    try {
      await loginWithOtp(emailOrPhone, enteredOtp);
      window.location.assign("/dashboard");
    } catch (err: any) {
      let errMsg = err.message || "รหัส OTP ไม่ถูกต้อง";
      if (errMsg.includes("auth/user-not-found") || errMsg.includes("auth/invalid-credential")) {
        errMsg = "ไม่พบบัญชีผู้ใช้งานนี้ในระบบ (กรุณาสมัครสมาชิกก่อน)";
      }
      setError(errMsg);
      setLoading(false);
    }
  };

  // ── Login with custom Password directly ────────────────────
  const handleLoginWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("กรุณากรอกรหัสผ่านเพื่อเข้าใช้งาน");
      return;
    }

    setLoading(true);
    try {
      // Find user to map phone to email if phone is entered
      let finalEmail = emailOrPhone.trim();
      if (!finalEmail.includes("@")) {
        // Query to find user email by phone number
        const { db } = await import("@/lib/firebase");
        const { collection, query, getDocs } = await import("firebase/firestore");
        const usersRef = collection(db, "users");
        const q = query(usersRef);
        const querySnapshot = await getDocs(q);
        
        let foundEmail = "";
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.phone?.replace(/\D/g, "") === finalEmail.replace(/\D/g, "")) {
            foundEmail = data.email;
          }
        });
        
        if (foundEmail) {
          finalEmail = foundEmail;
        } else {
          throw new Error("auth/user-not-found");
        }
      }

      await firebaseLogin(finalEmail, password);
      window.location.assign("/dashboard");
    } catch (err: any) {
      let errMsg = err.message || "เข้าสู่ระบบล้มเหลว";
      if (errMsg.includes("auth/user-not-found") || errMsg.includes("auth/invalid-credential")) {
        errMsg = "ไม่พบเบอร์โทรศัพท์/อีเมลนี้ หรือรหัสผ่านไม่ถูกต้อง";
      } else if (errMsg.includes("auth/wrong-password")) {
        errMsg = "รหัสผ่านไม่ถูกต้อง กรุณากรอกใหม่อีกครั้ง";
      }
      setError(errMsg);
      setLoading(false);
    }
  };

  const handleResend = () => {
    setInputs(["", "", "", "", "", ""]);
    setError("");
    sendMockOtp(emailOrPhone);
  };

  return (
    <div className="w-full max-w-md px-4 flex flex-col items-center py-6">
      {/* Brand Logo */}
      <div className="mb-6 text-center">
        <HelmetLogo size="lg" showText={true} showSubtitle={true} />
      </div>

      {/* Main Form Box */}
      <div className="w-full overflow-hidden rounded-[2.5rem] bg-[#F97316] shadow-2xl">
        
        {/* Tabs */}
        <div className="flex">
          <div className="w-1/2 bg-[#F97316] py-4 text-center font-black text-slate-900 text-base select-none border-b-2 border-slate-900/10">
            เข้าสู่ระบบ
          </div>
          <button
            onClick={() => window.location.assign("/register")}
            className="w-1/2 bg-[#0F172A] py-4 text-center font-semibold text-slate-300 text-base hover:text-white transition-all"
          >
            สมัครสมาชิก
          </button>
        </div>

        <div className="p-7 space-y-5">
          
          {/* ── STEP 1: CONTACT INPUT ── */}
          {step === "contact" && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-900 uppercase tracking-widest">
                  อีเมล หรือ เบอร์โทรศัพท์
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-base pointer-events-none">
                    📱
                  </span>
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => { setEmailOrPhone(e.target.value); setError(""); }}
                    placeholder="email@example.com หรือ 0812345678"
                    className="w-full rounded-full bg-white py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-inner outline-none ring-2 ring-transparent focus:ring-slate-900 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl bg-slate-900 text-white p-3 text-xs text-center font-bold animate-shake">
                  ⚠️ {error}
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#0F172A] py-3.5 font-black text-white shadow-xl hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "กำลังส่ง..." : "📨 ขอรหัส OTP"}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setError("");
                    if (!emailOrPhone.trim()) {
                      setError("กรุณากรอกอีเมล หรือเบอร์โทรศัพท์ก่อน");
                      return;
                    }
                    setStep("password");
                  }}
                  className="w-full rounded-full bg-white/20 py-3.5 font-bold text-slate-900 hover:bg-white/30 transition-all text-sm"
                >
                  🔑 เข้าสู่ระบบด้วยรหัสผ่าน (Password)
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 2: VERIFY OTP ── */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center">
                <p className="text-xs font-bold text-slate-800">
                  ส่งรหัสไปยัง: <span className="text-slate-900">{emailOrPhone}</span>
                </p>
              </div>

              {/* OTP Simulation container */}
              <div className="rounded-2xl bg-slate-900 p-4 text-center space-y-1 border border-slate-700">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  🔑 รหัส OTP ของคุณ (จำลองการส่ง)
                </p>
                <p className="text-3xl font-black font-mono tracking-[0.5em] text-orange-400 mt-1 select-all animate-pulse">
                  {activeOtpCode}
                </p>
                <p className="text-[9px] text-slate-500">
                  ในระบบจริง รหัสนี้จะถูกส่งไปยังอีเมลหรือ SMS ของคุณ
                </p>
              </div>

              {/* 6-box input */}
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-3 text-center">
                  กรอกรหัส OTP 6 หลัก
                </label>
                <div className="flex justify-center gap-2">
                  {inputs.map((val, idx) => (
                    <input
                      key={idx}
                      id={`otp-box-login-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpInput(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`h-12 w-10 rounded-2xl bg-white text-center text-lg font-black text-slate-900 shadow-inner outline-none ring-2 transition-all ${
                        val ? "ring-slate-900 scale-105" : "ring-transparent"
                      } focus:ring-slate-900`}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-2xl bg-slate-900 text-white p-3 text-xs text-center font-bold animate-shake">
                  ⚠️ {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep("contact"); setInputs(["","","","","",""]); setError(""); }}
                  className="w-1/3 rounded-full bg-white/20 py-3.5 font-bold text-slate-900 hover:bg-white/30 transition-all text-sm"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  disabled={loading || inputs.join("").length < 6}
                  className="w-2/3 rounded-full bg-[#0F172A] py-3.5 font-black text-white shadow-xl hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? "กำลังตรวจสอบ..." : "✅ ยืนยัน"}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-xs font-bold text-slate-800 underline hover:text-slate-900"
                >
                  ส่งรหัสใหม่อีกครั้ง
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 3: LOGIN WITH PASSWORD ── */}
          {step === "password" && (
            <form onSubmit={handleLoginWithPassword} className="space-y-5">
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-800">
                  บัญชีผู้ใช้: <span className="text-slate-900">{emailOrPhone}</span>
                </p>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mt-3">
                  กรอกรหัสผ่านเพื่อเข้าสู่ระบบ
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-base pointer-events-none">
                    🔒
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="ป้อนรหัสผ่านของคุณ"
                    className="w-full rounded-full bg-white py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-800 shadow-inner outline-none ring-2 ring-transparent focus:ring-slate-900 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl bg-slate-900 text-white p-3 text-xs text-center font-bold animate-shake">
                  ⚠️ {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep("contact"); setPassword(""); setError(""); }}
                  className="w-1/3 rounded-full bg-white/20 py-3.5 font-bold text-slate-900 hover:bg-white/30 transition-all text-sm"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  disabled={loading || !password}
                  className="w-2/3 rounded-full bg-[#0F172A] py-3.5 font-black text-white shadow-xl hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "กำลังตรวจสอบ..." : "🔑 เข้าสู่ระบบ"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* Footer */}
      <button
        onClick={() => window.location.assign("/register")}
        className="mt-5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:underline"
      >
        ยังไม่มีบัญชี? <span className="text-orange-500">สมัครสมาชิก</span>
      </button>
    </div>
  );
}