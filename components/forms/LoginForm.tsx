"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import HelmetLogo from "@/components/common/HelmetLogo";

export default function LoginForm() {
  const { login } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("กรุณากรอกอีเมลของคุณ");
      return;
    }
    if (!password) {
      setError("กรุณากรอกรหัสผ่าน");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      window.location.assign("/dashboard");
    } catch (err: any) {
      let errMsg = err.message || "เข้าสู่ระบบล้มเหลว";
      if (
        errMsg.includes("auth/user-not-found") ||
        errMsg.includes("auth/invalid-credential") ||
        errMsg.includes("auth/wrong-password")
      ) {
        errMsg = "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง";
      } else if (errMsg.includes("auth/too-many-requests")) {
        errMsg = "มีการพยายามเข้าสู่ระบบหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่";
      } else if (errMsg.includes("auth/invalid-email")) {
        errMsg = "รูปแบบอีเมลไม่ถูกต้อง";
      }
      setError(errMsg);
      setLoading(false);
    }
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
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-widest">
                อีเมล (Email)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-base pointer-events-none">
                  📧
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="email@example.com"
                  autoComplete="email"
                  className="w-full rounded-full bg-white py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-inner outline-none ring-2 ring-transparent focus:ring-slate-900 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-widest">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-base pointer-events-none">
                  🔒
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="ป้อนรหัสผ่านของคุณ"
                  autoComplete="current-password"
                  className="w-full rounded-full bg-white py-3.5 pl-11 pr-12 text-sm font-semibold text-slate-800 shadow-inner outline-none ring-2 ring-transparent focus:ring-slate-900 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-slate-900 text-white p-3 text-xs text-center font-bold">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#0F172A] py-3.5 font-black text-white shadow-xl hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "🔑 เข้าสู่ระบบ"}
            </button>
          </form>
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