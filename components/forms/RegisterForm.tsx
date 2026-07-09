"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import HelmetLogo from "@/components/common/HelmetLogo";
import TermsModal from "@/components/modal/TermsModal";
import PrivacyModal from "@/components/modal/PrivacyModal";

export default function RegisterForm() {
  const { register } = useApp();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [career, setCareer] = useState("Student");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !birthday || !email || !phone || !password || !confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (!agreeTerms) {
      setError("กรุณายอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว");
      return;
    }

    setLoading(true);
    try {
      await register({
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
      if (errMsg.includes("auth/email-already-in-use")) {
        errMsg = "อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบหรือใช้อีเมลอื่น";
      } else if (errMsg.includes("auth/invalid-email")) {
        errMsg = "รูปแบบอีเมลไม่ถูกต้อง";
      } else if (errMsg.includes("auth/weak-password")) {
        errMsg = "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร";
      }
      setError(errMsg);
      setLoading(false);
    }
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
          <form onSubmit={handleSubmit} className="space-y-4">
            
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
                  <option value="Student">นักเรียน</option>
                  <option value="University Student">นักศึกษา</option>
                  <option value="Teacher">ครู / อาจารย์</option>
                  <option value="Government Officer">ข้าราชการ</option>
                  <option value="Business Owner">ธุรกิจส่วนตัว</option>
                  <option value="Employee">พนักงานบริษัท</option>
                  <option value="Freelance">ฟรีแลนซ์</option>
                  <option value="Other">อื่นๆ</option>
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
                  autoComplete="email"
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
                  autoComplete="tel"
                  className="w-full rounded-full border-none bg-white py-2.5 pl-9 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-inner outline-none ring-2 ring-transparent transition-all focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Passwords side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-900">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm">
                    🔒
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6+ ตัวอักษร"
                    autoComplete="new-password"
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
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="รหัสผ่านอีกครั้ง"
                    autoComplete="new-password"
                    className="w-full rounded-full border-none bg-white py-2.5 pl-9 pr-3 text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-inner outline-none ring-2 ring-transparent transition-all focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Show Password Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="h-4 w-4 rounded accent-[#0F172A] cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-900">แสดงรหัสผ่าน</span>
            </label>

            {/* Error Message */}
            {error && (
              <div className="rounded-2xl bg-slate-900 text-white p-2.5 text-xs text-center font-bold">
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
              {loading ? "กำลังสมัครสมาชิก..." : "✅ สมัครสมาชิก (Register)"}
            </button>
          </form>
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