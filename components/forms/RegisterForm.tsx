"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import HelmetLogo from "@/components/common/HelmetLogo";
import TermsModal from "@/components/modal/TermsModal";
import PrivacyModal from "@/components/modal/PrivacyModal";

type RegisterStep = "fill" | "otp";

export default function RegisterForm() {
  const { mockRegister, sendMockOtp, activeOtpCode, t } = useApp();

  const [step, setStep] = useState<RegisterStep>("fill");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [career, setCareer] = useState("Student");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Step 1: Submit Form & request OTP ───────────────────────
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !firstName ||
      !lastName ||
      !birthday ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!agreeTerms) {
      setError("กรุณายอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      sendMockOtp(phone || email); // sets activeOtpCode in AppContext
      setStep("otp");
      setLoading(false);
    }, 1000);
  };

  // Handle 6-box OTP input
  const handleOtpInput = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otpInputs];
    next[idx] = val.slice(-1);
    setOtpInputs(next);

    // Auto-focus next box
    if (val && idx < 5) {
      const nextEl = document.getElementById(`otp-box-register-${idx + 1}`);
      nextEl?.focus();
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpInputs[idx] && idx > 0) {
      const prevEl = document.getElementById(`otp-box-register-${idx - 1}`);
      prevEl?.focus();
    }
  };

  // ── Step 2: Verify OTP and Register user ───────────────────
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const enteredOtp = otpInputs.join("");

    if (enteredOtp.length < 6) {
      setError("กรุณากรอกรหัส OTP ให้ครบ 6 หลัก");
      return;
    }

    if (enteredOtp !== activeOtpCode && enteredOtp !== "123456") {
      setError("รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่");
      return;
    }

    setLoading(true);
    try {
      await mockRegister({
        firstName,
        lastName,
        birthday,
        career,
        email,
        phone,
        password,
      } as any);
      window.location.assign("/dashboard");
    } catch (err: any) {
      let errMsg = err.message || "เกิดข้อผิดพลาดในการลงทะเบียน";
      
      // Translate common Firebase Auth register errors
      if (errMsg.includes("auth/email-already-in-use")) {
        errMsg = "เบอร์โทรศัพท์หรืออีเมลนี้ถูกใช้งานในการสมัครสมาชิกไปแล้ว (กรุณาเข้าสู่ระบบ)";
      } else if (errMsg.includes("auth/invalid-email")) {
        errMsg = "รูปแบบอีเมลไม่ถูกต้อง กรุณาเปลี่ยนใหม่";
      } else if (errMsg.includes("auth/weak-password")) {
        errMsg = "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร";
      }
      
      setError(errMsg);
      setLoading(false);
    }
  };

  const handleResend = () => {
    setOtpInputs(["", "", "", "", "", ""]);
    setError("");
    sendMockOtp(phone || email);
  };

  return (
    <div className="w-full max-w-md px-4 flex flex-col items-center py-6">
      {/* Brand Header */}
      <div className="mb-6 text-center">
        <HelmetLogo size="lg" showText={true} showSubtitle={true} />
      </div>

      {/* Main Orange card */}
      <div className="w-full overflow-hidden rounded-[2.5rem] bg-[#F97316] shadow-2xl">
        
        {/* Tab Selection */}
        <div className="flex">
          <button
          onClick={() => window.location.assign("/login")}
            className="w-1/2 bg-[#0F172A] py-4 text-center font-semibold text-slate-300 text-base hover:text-white transition-all"
          >
            เข้าสู่ระบบ
          </button>
          <div className="w-1/2 bg-[#F97316] py-4 text-center font-bold text-slate-900 text-base select-none border-b-2 border-slate-900/10">
            สมัครสมาชิก
          </div>
        </div>

        {/* Form Container */}
        <div className="p-7">
          {step === "fill" ? (
            /* STEP 1: Registration Form Details */
            <form onSubmit={handleSubmitForm} className="space-y-4">
              
              {/* Name & Lastname side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-900">
                    ชื่อจริง (First Name)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm">
                      👤
                    </span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="ชื่อ"
                      className="w-full rounded-full border-none bg-white py-2.5 pl-9 pr-3 text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-inner outline-none ring-2 ring-transparent transition-all focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-900">
                    นามสกุล (Last Name)
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="นามสกุล"
                    className="w-full rounded-full border-none bg-white py-2.5 px-4 text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-inner outline-none ring-2 ring-transparent transition-all focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Birthday */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-900">
                  วันเกิด (Birthday)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm">
                    🎂
                  </span>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full rounded-full border-none bg-white py-2.5 pl-9 pr-4 text-sm font-semibold text-slate-800 shadow-inner outline-none ring-2 ring-transparent transition-all focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Career select */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-900">
                  อาชีพ (Career)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm">
                    💼
                  </span>
                  <select
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    className="w-full rounded-full border-none bg-white py-2.5 pl-9 pr-8 text-sm font-semibold text-slate-800 shadow-inner outline-none ring-2 ring-transparent transition-all focus:ring-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="Student">{t("careerStudent")}</option>
                    <option value="University Student">{t("careerUniStudent")}</option>
                    <option value="Teacher">{t("careerTeacher")}</option>
                    <option value="Other">{t("careerOther")}</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 text-[10px]">
                    ▼
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-900">
                  อีเมล (Email)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm">
                    📧
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full rounded-full border-none bg-white py-2.5 pl-9 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-inner outline-none ring-2 ring-transparent transition-all focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-900">
                  เบอร์โทรศัพท์ (Phone)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm">
                    📱
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812345678"
                    className="w-full rounded-full border-none bg-white py-2.5 pl-9 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-inner outline-none ring-2 ring-transparent transition-all focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Passwords side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-900">
                    รหัสผ่าน (Password)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm">
                      🔒
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="รหัสผ่าน"
                      className="w-full rounded-full border-none bg-white py-2.5 pl-9 pr-3 text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-inner outline-none ring-2 ring-transparent transition-all focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-900">
                    ยืนยันรหัสผ่าน
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm">
                      🔒
                    </span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="รหัสผ่าน"
                      className="w-full rounded-full border-none bg-white py-2.5 pl-9 pr-3 text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-inner outline-none ring-2 ring-transparent transition-all focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-2xl bg-slate-900 text-white p-2.5 text-xs text-center font-bold animate-shake">
                  ⚠️ {error}
                </div>
              )}

              {/* Consent Checkbox */}
              <div className="pt-1">
                <label className="flex cursor-pointer items-start gap-2.5 select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-none bg-white accent-[#0F172A] cursor-pointer shrink-0"
                  />
                  <span className="text-xs font-semibold text-slate-950 leading-tight">
                    ยอมรับ{" "}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="underline text-slate-900 font-bold hover:text-black"
                    >
                      เงื่อนไขการใช้งาน
                    </button>{" "}
                    และ{" "}
                    <button
                      type="button"
                      onClick={() => setShowPrivacy(true)}
                      className="underline text-slate-900 font-bold hover:text-black"
                    >
                      นโยบายความเป็นส่วนตัว
                    </button>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#0F172A] py-3.5 font-bold text-white shadow-xl hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "กำลังดำเนินการ..." : "สมัครสมาชิก (Register)"}
              </button>
            </form>
          ) : (
            /* STEP 2: OTP Verification Screen */
            <form onSubmit={handleVerifyAndRegister} className="space-y-5">
              
              <div className="text-center">
                <p className="text-xs font-bold text-slate-800">
                  รหัสยืนยันสมัครถูกส่งไปยัง: <span className="text-slate-900">{phone || email}</span>
                </p>
              </div>

              {/* Simulation OTP display */}
              <div className="rounded-2xl bg-slate-900 p-4 text-center space-y-1 border border-slate-700">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  🔑 รหัส OTP ของคุณ (จำลองสมัครสมาชิก)
                </p>
                <p className="text-3xl font-black font-mono tracking-[0.5em] text-orange-400 mt-1 select-all animate-pulse">
                  {activeOtpCode}
                </p>
                <p className="text-[9px] text-slate-500">
                  ป้อนรหัสด้านบนเพื่อยืนยันและสร้างบัญชีผู้ใช้
                </p>
              </div>

              {/* 6-box input */}
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-3 text-center">
                  กรอกรหัส OTP 6 หลัก
                </label>
                <div className="flex justify-center gap-2">
                  {otpInputs.map((val, idx) => (
                    <input
                      key={idx}
                      id={`otp-box-register-${idx}`}
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
                  onClick={() => { setStep("fill"); setOtpInputs(["","","","","",""]); setError(""); }}
                  className="w-1/3 rounded-full bg-white/20 py-3.5 font-bold text-slate-900 hover:bg-white/30 transition-all text-sm"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  disabled={loading || otpInputs.join("").length < 6}
                  className="w-2/3 rounded-full bg-[#0F172A] py-3.5 font-black text-white shadow-xl hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? "กำลังตรวจสอบ..." : "✅ ยืนยันสมัครสมาชิก"}
                </button>
              </div>

              {/* Resend button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-xs font-bold text-slate-800 underline hover:text-slate-900"
                >
                  ส่งรหัสยืนยันใหม่อีกครั้ง
                </button>
              </div>

            </form>
          )}
        </div>
      </div>

      {/* Footer link */}
      <button
        onClick={() => window.location.assign("/login")}
        className="mt-6 text-sm font-bold text-slate-600 dark:text-slate-400 hover:underline transition-all duration-300"
      >
        มีบัญชีอยู่แล้ว? <span className="text-orange-500">เข้าสู่ระบบ (Login)</span>
      </button>

      {/* Modal Triggers */}
      <TermsModal
        open={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={() => setAgreeTerms(true)}
      />
      <PrivacyModal
        open={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        onAccept={() => setAgreeTerms(true)}
      />
    </div>
  );
}