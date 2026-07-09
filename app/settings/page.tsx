"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useApp } from "@/contexts/AppContext";
import { auth, db } from "@/lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Rank cutoff data
const RANK_TIERS = [
  { name: "Bronze",   icon: "🥉", min: 0,    max: 99,    color: "text-amber-700", bg: "bg-amber-700/10 border-amber-700/20" },
  { name: "Silver",   icon: "🥈", min: 100,  max: 299,   color: "text-slate-500", bg: "bg-slate-500/10 border-slate-500/20" },
  { name: "Gold",     icon: "🥇", min: 300,  max: 599,   color: "text-yellow-500",bg: "bg-yellow-500/10 border-yellow-500/20" },
  { name: "Diamond",  icon: "🔷", min: 600,  max: 999,   color: "text-blue-500",  bg: "bg-blue-500/10 border-blue-500/20" },
  { name: "Master",   icon: "💎", min: 1000, max: 1999,  color: "text-orange-500",bg: "bg-orange-500/10 border-orange-500/20" },
  { name: "Champion", icon: "🏆", min: 2000, max: 4999,  color: "text-red-500",   bg: "bg-red-500/10 border-red-500/20" },
  { name: "Legend",   icon: "👑", min: 5000, max: null,  color: "text-purple-500",bg: "bg-purple-500/10 border-purple-500/20" },
];

// Score incentive rules for display
const SCORE_RULES = [
  { icon: "🪖", label: "สวมหมวกกันน็อกขณะขับขี่",               effect: "+2 คะแนน / รอบการตรวจสอบ (5 วินาที)", type: "recover" },
  { icon: "✅", label: "ขับปลอดภัยในช่วง 20-60 กม./ชม.",          effect: "+1 คะแนนเพิ่มเติม / รอบ",             type: "recover" },
  { icon: "🌟", label: "ขับขี่ปลอดภัยต่อเนื่อง 60 วินาที (Streak)", effect: "+5 คะแนนโบนัส Streak",              type: "recover" },
  { icon: "🏎️", label: "ความเร็วเกิน 80 กม./ชม. (หักน้อย)",     effect: "-1 คะแนน / รอบการตรวจสอบ (5 วินาที)", type: "info"    },
  { icon: "💥", label: "ตรวจพบอุบัติเหตุ (ไม่หักคะแนน)",          effect: "แจ้งเตือนเท่านั้น — ไม่มีการหักคะแนน", type: "info"    },
  { icon: "🪖", label: "ไม่สวมหมวก (ไม่หักคะแนน)",                effect: "แจ้งเตือนเท่านั้น — ระบบสมัครใจ",     type: "info"    },
];

// Guide steps for the user manual
const USER_MANUAL_STEPS = [
  { step: 1, icon: "📱", title: "สมัครสมาชิก", desc: "กรอกชื่อ-สกุล, วันเกิด, อาชีพ, อีเมล, เบอร์โทรศัพท์ และรหัสผ่าน จากนั้นยืนยัน OTP ที่ได้รับ" },
  { step: 2, icon: "🪖", title: "เชื่อมต่อหมวกกันน็อก", desc: "ไปที่หน้า 'เชื่อมต่อหมวก' แล้วกดปุ่ม 'เพิ่มอุปกรณ์' กรอก Helmet ID หรือสแกน QR Code บนตัวหมวก" },
  { step: 3, icon: "🗺️", title: "ติดตามเรียลไทม์", desc: "หน้าแรกจะแสดงแผนที่ GPS ตำแหน่งปัจจุบัน, ความเร็ว, แบตเตอรี่ และคะแนนความปลอดภัยแบบเรียลไทม์" },
  { step: 4, icon: "⚠", title: "ระบบ SOS", desc: "หากเซนเซอร์หมวกตรวจพบแรงกระแทกรุนแรง ระบบจะแจ้งเตือน SOS พร้อมส่งพิกัดให้ผู้ติดต่อฉุกเฉินทันที" },
  { step: 5, icon: "🏆", title: "สะสมคะแนนแรงค์", desc: "ขับขี่ปลอดภัย ไม่เร็วเกิน 80 กม./ชม. และสวมหมวกตลอดเส้นทางเพื่อสะสมแต้มสำหรับเลื่อนระดับแรงค์" },
];

type GuideModal = "none" | "manual" | "score" | "rank";

export default function SettingsPage() {
  const { language, setLanguage, theme, setTheme, logout, t } = useApp();
  const router_push = (path: string) => window.location.assign(path);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [guideModal, setGuideModal] = useState<GuideModal>("none");

  // Inspector state
  const [inspectStatus, setInspectStatus] = useState<string>("ยังไม่ได้ตรวจสอบ");
  const [inspectData, setInspectData] = useState<string>("");

  const handleTestDatabase = async () => {
    setInspectStatus("กำลังตรวจสอบข้อมูลเรียลไทม์...");
    setInspectData("");
    const fbUser = auth.currentUser;
    if (!fbUser) {
      setInspectStatus("🔴 ล้มเหลว: ไม่พบสถานะการล็อกอินใน Firebase Authentication");
      return;
    }

    try {
      const userDocRef = doc(db, "users", fbUser.uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        setInspectStatus("🟢 บันทึกข้อมูลสำเร็จจริง: ข้อมูลมีอยู่บน Cloud Firestore!");
        setInspectData(JSON.stringify(snap.data(), null, 2));
      } else {
        setInspectStatus("🟡 เชื่อมต่อสำเร็จ: แต่ยังไม่มีเอกสารโปรไฟล์บนคลาวด์ (ไปหน้าแรกเพื่อสแกนสร้าง)");
        setInspectData(`Firebase Auth UID: ${fbUser.uid}`);
      }
    } catch (err: any) {
      setInspectStatus(`🔴 ตรวจสอบล้มเหลว: ไม่สามารถสื่อสารกับ Firebase ได้`);
      setInspectData(err.message || String(err));
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(""); setError("");
    if (!currentPw || !newPw || !confirmPw) {
      setError(language === "th" ? "กรุณากรอกข้อมูลให้ครบ" : "Please fill in all fields");
      return;
    }
    if (newPw !== confirmPw) {
      setError(language === "th" ? "รหัสผ่านใหม่ไม่ตรงกัน" : "New passwords do not match");
      return;
    }
    if (newPw.length < 6) {
      setError("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }
    const fbUser = auth.currentUser;
    if (!fbUser || !fbUser.email) {
      setError("ไม่พบข้อมูลผู้ใช้งาน กรุณาเข้าสู่ระบบใหม่");
      return;
    }
    try {
      // Re-authenticate before changing password (Firebase requirement)
      const credential = EmailAuthProvider.credential(fbUser.email, currentPw);
      await reauthenticateWithCredential(fbUser, credential);
      await updatePassword(fbUser, newPw);
      setMsg(t("saveSuccess"));
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setTimeout(() => setMsg(""), 3000);
    } catch (err: any) {
      let errMsg = err.message || "เกิดข้อผิดพลาด";
      if (errMsg.includes("auth/wrong-password") || errMsg.includes("auth/invalid-credential")) {
        errMsg = "รหัสผ่านปัจจุบันไม่ถูกต้อง";
      } else if (errMsg.includes("auth/too-many-requests")) {
        errMsg = "พยายามหลายครั้งเกินไป กรุณารอสักครู่";
      }
      setError(errMsg);
    }
  };

  const handleLogout = async () => {
    await logout();
    router_push("/login");
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-xl mx-auto pb-10">

        {/* Theme & Language */}
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-slate-800 shadow-lg space-y-6">
          <h3 className="text-lg font-black text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            ⚙️ {t("settings")}
          </h3>

          {/* Theme */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white">{t("theme")}</h4>
              <p className="text-[10px] text-slate-400">เปลี่ยนสีธีมของเว็บไซต์</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("light")}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                  theme === "light"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                🌙 Dark
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5 flex-wrap gap-3">
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white">{t("language")}</h4>
              <p className="text-[10px] text-slate-400">เลือกภาษาอินเตอร์เฟส</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage("th")}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                  language === "th"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                🇹🇭 ไทย
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                  language === "en"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>
        </div>

        {/* Guide / Manual Section */}
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-slate-800 shadow-lg space-y-3">
          <h3 className="text-lg font-black text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
            📚 คู่มือและเกณฑ์ระบบ
          </h3>

          {/* Guide Button 1: User Manual */}
          <button
            onClick={() => setGuideModal("manual")}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <div className="text-left">
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">คู่มือการใช้งานระบบ</h4>
                <p className="text-[10px] text-slate-400">วิธีเชื่อมต่อหมวก, ยืนยัน OTP, ระบบ SOS</p>
              </div>
            </div>
            <span className="text-slate-400 group-hover:text-orange-500 transition-colors text-lg">›</span>
          </button>

          {/* Guide Button 2: Scoring Criteria */}
          <button
            onClick={() => setGuideModal("score")}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div className="text-left">
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">เกณฑ์การให้คะแนนความปลอดภัย</h4>
                <p className="text-[10px] text-slate-400">กฎการหักคะแนน, การฟื้นฟู, และเงื่อนไข SOS</p>
              </div>
            </div>
            <span className="text-slate-400 group-hover:text-orange-500 transition-colors text-lg">›</span>
          </button>

          {/* Guide Button 3: Rank Criteria */}
          <button
            onClick={() => setGuideModal("rank")}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div className="text-left">
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">เกณฑ์ระดับแรงค์และการเลื่อนขั้น</h4>
                <p className="text-[10px] text-slate-400">Bronze → Silver → Gold → Diamond → Master → Champion → Legend</p>
              </div>
            </div>
            <span className="text-slate-400 group-hover:text-orange-500 transition-colors text-lg">›</span>
          </button>
        </div>

        {/* Password Reset */}
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-slate-800 shadow-lg">
          <h3 className="text-lg font-black text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
            🔒 {t("changePassword")}
          </h3>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { label: t("currentPassword"), val: currentPw, setter: setCurrentPw },
              { label: t("newPassword"), val: newPw, setter: setNewPw },
              { label: t("confirmNewPassword"), val: confirmPw, setter: setConfirmPw },
            ].map(({ label, val, setter }) => (
              <div key={label} className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {label}
                </label>
                <input
                  type="password"
                  value={val}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 px-4 text-sm font-semibold outline-none ring-2 ring-transparent transition focus:border-orange-500 focus:ring-orange-500/20 text-slate-800 dark:text-white"
                />
              </div>
            ))}

            {msg && (
              <div className="rounded-full bg-emerald-500 text-white py-3 text-center font-bold text-sm animate-fade-in-up">
                ✅ {msg}
              </div>
            )}
            {error && (
              <div className="rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 py-3 text-center font-bold text-sm animate-shake">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-orange-500 hover:bg-orange-600 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {t("changePassword")}
            </button>
          </form>
        </div>

        {/* Firebase DB Inspector */}
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-slate-800 shadow-lg space-y-4">
          <h3 className="text-lg font-black text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-2 flex items-center justify-between">
            <span>⚙️ ตัวตรวจสอบฐานข้อมูล (Database Inspector)</span>
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            คุณสามารถตรวจสอบสถานะการบันทึกข้อมูลและดึงข้อมูลโปรไฟล์เรียลไทม์จากระบบหลัก Cloud Firestore เพื่อยืนยันว่าข้อมูลไม่สูญหายและบันทึกอยู่บนคลาวด์ของจริง
          </p>

          <button
            onClick={handleTestDatabase}
            className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50 dark:hover:bg-orange-950/20 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all hover:scale-[1.01]"
          >
            🔍 ตรวจสอบความถูกต้องของข้อมูลใน Firestore
          </button>

          <div className="space-y-2 mt-2">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex justify-between bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span>สถานะเชื่อมต่อ:</span>
              <span className="font-mono">{inspectStatus}</span>
            </div>
            
            {inspectData && (
              <div className="space-y-1.5 animate-fade-in">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">ข้อมูล JSON จาก Firestore:</span>
                <pre className="text-[10px] font-mono p-4 bg-slate-950 text-emerald-400 rounded-2xl overflow-x-auto max-h-48 border border-slate-800">
                  {inspectData}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800 shadow-lg text-center">
          <button
            onClick={handleLogout}
            className="w-full py-4 text-red-600 dark:text-red-400 font-bold hover:bg-red-500/10 rounded-[1.5rem] border border-transparent hover:border-red-500/20 transition-all"
          >
            🚪 {t("logout")}
          </button>
        </div>

      </div>

      {/* ─── Guide Modals ─── */}
      {guideModal !== "none" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setGuideModal("none")}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-8 py-5">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {guideModal === "manual" && "📖 คู่มือการใช้งานระบบ HelmetPoint"}
                {guideModal === "score" && "📊 เกณฑ์การให้คะแนนความปลอดภัย"}
                {guideModal === "rank" && "🏆 เกณฑ์ระดับแรงค์และการเลื่อนขั้น"}
              </h2>
              <button
                onClick={() => setGuideModal("none")}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors text-xl font-bold w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[65vh] overflow-y-auto px-8 py-6 space-y-4">
              
              {/* User Manual */}
              {guideModal === "manual" && USER_MANUAL_STEPS.map((step) => (
                <div key={step.step} className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <div className="shrink-0 h-9 w-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-sm">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {step.icon} {step.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}

              {/* Scoring Criteria */}
              {guideModal === "score" && (
                <>
                  <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/40 mb-2">
                    <p className="text-xs text-orange-700 dark:text-orange-300 font-bold leading-relaxed">
                      คะแนนความปลอดภัยมีค่าตั้งแต่ 0 ถึง 100 คะแนน โดยเริ่มต้นที่ 100 คะแนน ระบบตรวจสอบทุก 5 วินาที
                    </p>
                  </div>
                  {SCORE_RULES.map((rule) => (
                    <div key={rule.label} className={`flex gap-4 items-center p-4 rounded-2xl border ${
                      rule.type === "recover"
                        ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40"
                        : rule.type === "info"
                        ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40"
                        : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40"
                    }`}>
                      <span className="text-2xl shrink-0">{rule.icon}</span>
                      <div className="flex-1">
                        <h4 className={`font-bold text-sm ${
                          rule.type === "recover" ? "text-emerald-700 dark:text-emerald-300"
                          : rule.type === "info" ? "text-blue-700 dark:text-blue-300"
                          : "text-amber-700 dark:text-amber-300"
                        }`}>{rule.label}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-bold">{rule.effect}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Rank Criteria */}
              {guideModal === "rank" && (
                <>
                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 mb-2">
                    <p className="text-xs text-purple-700 dark:text-purple-300 font-bold leading-relaxed">
                      แต้มสะสม = 100 (ฐาน) + (ระยะทางรวม (กม.) × 10)<br/>
                      เช่น ขับ 50 กม. = 100 + 500 = 600 แต้ม (ระดับ Diamond)
                    </p>
                  </div>
                  {RANK_TIERS.map((tier) => (
                    <div key={tier.name} className={`flex items-center justify-between p-4 rounded-2xl border ${tier.bg}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tier.icon}</span>
                        <div>
                          <h4 className={`font-black text-sm ${tier.color}`}>{tier.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {tier.min.toLocaleString()} – {tier.max !== null ? tier.max.toLocaleString() : "∞"} แต้ม
                          </p>
                        </div>
                      </div>
                      <div className={`text-xs font-black px-3 py-1 rounded-full border ${tier.bg} ${tier.color}`}>
                        {tier.max !== null
                          ? `${tier.min.toLocaleString()} pts`
                          : "5,000+ pts"}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setGuideModal("none")}
                className="w-full rounded-full bg-orange-500 hover:bg-orange-600 py-3 font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

    </AppLayout>
  );
}
