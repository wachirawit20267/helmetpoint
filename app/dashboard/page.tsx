"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useApp } from "@/contexts/AppContext";
import MapComponent from "@/components/dashboard/MapComponent";

// Count-up animation helper
function AnimatedCounter({ 
  value, 
  duration = 800, 
  decimals = 0,
  prefix = "",
  suffix = ""
}: { 
  value: number; 
  duration?: number; 
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCurrentValue(progress * value);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  const formatNumber = (num: number) => {
    const formatted = num.toFixed(decimals);
    if (decimals === 0 && value < 100000 && suffix === " คะแนน") {
      return formatted.padStart(5, "0");
    }
    return formatted;
  };

  return (
    <span>
      {prefix}
      {formatNumber(currentValue)}
      {suffix}
    </span>
  );
}

export default function DashboardPage() {
  const { user, helmetStatus, helmetData, t } = useApp();
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [weather, setWeather] = useState({ temp: 32, label: "แดดจัด", icon: "☀️" });

  // Get dynamic Safety Score (starts at 100)
  const safetyScore = user?.safetyScore ?? 100;
  
  // Get Rank Points directly from user profile database
  const rankPoints = user?.points ?? 100;

  // Calculate Rank name, color, and badge based on accumulated rankPoints
  const getRankInfoByPoints = (points: number) => {
    if (points >= 5000) return { name: "Legend", color: "text-purple-500 dark:text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", icon: "👑" };
    if (points >= 2000) return { name: "Champion", color: "text-red-500 dark:text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", icon: "🏆" };
    if (points >= 1000) return { name: "Master", color: "text-orange-500 dark:text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: "💎" };
    if (points >= 600) return { name: "Diamond", color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", icon: "🔷" };
    if (points >= 300) return { name: "Gold", color: "text-yellow-500 dark:text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: "🥇" };
    if (points >= 100) return { name: "Silver", color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/30", icon: "🥈" };
    return { name: "Bronze", color: "text-amber-700 dark:text-amber-500", bg: "bg-amber-700/10", border: "border-amber-700/30", icon: "🥉" };
  };

  const rank = getRankInfoByPoints(rankPoints);

  // Time & Date Updates
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Weather simulation
  useEffect(() => {
    const weathers = [
      { temp: 32, label: "แดดจัด (Sunny)", icon: "☀️" },
      { temp: 30, label: "เมฆบางส่วน (Partly Cloudy)", icon: "🌤️" },
      { temp: 29, label: "มีฝนเล็กน้อย (Light Rain)", icon: "🌦️" },
    ];
    setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
  }, []);

  // Status Badge mappings
  const getStatusBadge = () => {
    switch (helmetStatus) {
      case "connected":
        return { text: "🟢 " + t("connected"), bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" };
      case "connecting":
        return { text: "🟡 " + t("connecting"), bg: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 animate-pulse" };
      case "disconnected":
        return { text: "🔴 " + t("disconnected"), bg: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400" };
      case "off":
      default:
        return { text: "⚫ " + t("powerOff"), bg: "bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400" };
    }
  };

  const status = getStatusBadge();

  return (
    <AppLayout>
      <div className="space-y-6">
        
        {/* Top Info Header Grid */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* Welcome User card */}
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-orange-500 to-orange-400 p-8 text-white shadow-xl md:col-span-8 flex flex-col justify-between min-h-[180px] group transition-all duration-300 hover:shadow-orange-500/20">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
            
            <div>
              <p className="text-sm font-semibold tracking-wider text-orange-100 uppercase">
                {t("welcomeBack")}
              </p>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                สวัสดี, {user ? `${user.firstName} ${user.lastName}` : "ผู้ใช้งาน"} 👋
              </h2>
              <p className="mt-2 text-xs md:text-sm text-orange-50/80 max-w-md font-medium">
                ขับขี่ปลอดภัยสวมใส่หมวกกันน็อกทุกครั้ง วันนี้ระบบอัจฉริยะพร้อมดูแลคุณแล้ว
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-md border border-white/10">
                📍 GPS Map Live
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-md border border-white/10">
                🪖 AI Safety Active
              </div>
            </div>
          </div>

          {/* Time & Weather card */}
          <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-lg md:col-span-4 flex flex-col justify-between min-h-[180px] border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-slate-500/5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  TIME & WEATHER
                </span>
                <span className="text-2xl">{weather.icon}</span>
              </div>
              <h3 className="mt-3 text-3xl font-black text-slate-900 dark:text-white transition-all duration-300">
                {timeStr || "--:--:--"}
              </h3>
              <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                {dateStr || "กำลังโหลด..."}
              </p>
            </div>

            <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-600 dark:text-slate-400">กรุงเทพมหานคร</span>
              <span className="font-black text-slate-900 dark:text-white">{weather.temp}°C ({weather.label})</span>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-md border border-slate-100 dark:border-slate-800 gap-4 transition-all duration-300">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🪖</span>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {t("helmetStatus")}
              </h4>
              <p className="text-xs text-slate-400">
                Helmet ID: <span className="font-mono text-slate-600 dark:text-slate-300 font-bold">{helmetData.helmetId || "None"}</span>
              </p>
            </div>
          </div>

          <div className={`rounded-full border px-5 py-2 text-sm font-bold text-center ${status.bg}`}>
            {status.text}
          </div>
        </div>

        {/* Live GPS Tracker & Map Layout */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* Leaflet Live Map wrapper */}
          <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800 shadow-lg md:col-span-8 h-[360px] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                🗺️ พิกัดตำแหน่งอุปกรณ์ขับขี่เรียลไทม์ (Live Maps)
              </h3>
              <span className="text-[10px] bg-orange-500/10 text-orange-500 font-bold px-2 py-0.5 rounded-full border border-orange-500/20">
                GPS active
              </span>
            </div>
            <div className="flex-1 min-h-0">
              <MapComponent gps={helmetData.gps} isActive={helmetStatus === "connected"} />
            </div>
          </div>

          {/* Safety Scoring circular card */}
          <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-lg border border-slate-100 dark:border-slate-800 md:col-span-4 flex flex-col justify-between h-[360px]">
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
                {t("score")} (Safety Score)
              </span>

              {/* Horizontal Slider Gauge */}
              <div className="mt-6 space-y-2">
                <div className="relative h-4 w-full overflow-hidden rounded-full flex bg-slate-100 dark:bg-slate-800">
                  <div className="h-full w-[20%] bg-red-500"></div>
                  <div className="h-full w-[20%] bg-orange-500"></div>
                  <div className="h-full w-[20%] bg-yellow-500"></div>
                  <div className="h-full w-[20%] bg-green-400"></div>
                  <div className="h-full w-[20%] bg-emerald-600"></div>
                  
                  {/* Slider pin Indicator line */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-slate-900 dark:bg-white shadow-md transition-all duration-1000 ease-out"
                    style={{ left: `${safetyScore}%` }}
                  >
                    <div className="absolute -top-1 -left-1.5 h-2 w-4 rounded-full bg-slate-950 dark:bg-white"></div>
                  </div>
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>0 (Danger)</span>
                  <span>100 (Safe)</span>
                </div>
              </div>

              {/* Display safety score digits */}
              <div className="mt-8 text-center">
                <div className="text-5xl font-black tracking-widest text-slate-900 dark:text-white">
                  <AnimatedCounter value={safetyScore} suffix=" คะแนน" />
                </div>
                {helmetData.speed > 80 && (
                  <p className="text-[10px] text-amber-500 font-bold mt-2 animate-pulse">
                    ⚠ ความเร็วเกิน 80 กม./ชม. — หัก -1 คะแนน
                  </p>
                )}
                {!helmetData.helmetWear && helmetData.speed > 0 && (
                  <p className="text-[10px] text-blue-500 font-bold mt-2">
                    🪖 แนะนำสวมหมวกกันน็อกเพื่อรับคะแนนโบนัส
                  </p>
                )}
              </div>
            </div>

            {/* User points statistics */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                ความเสถียรของความเร็วเฉลี่ยวันนี้
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                มอเตอร์ไซค์ขับขี่ปกติ: 30 - 60 km/h (ได้แต้มฟื้นฟู)
              </p>
            </div>
          </div>
        </div>

        {/* Primary Data Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Rank Points Progression Card */}
          <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col justify-between min-h-[260px] transition-all duration-300 hover:shadow-slate-500/5">
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
                แต้มสะสมและแรงค์ (Rank Cut-off)
              </span>

              <div className="mt-8 text-center space-y-2">
                <div className="text-4xl font-black text-slate-900 dark:text-white font-mono">
                  <AnimatedCounter value={rankPoints} suffix=" แต้ม" />
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">
                  (เริ่มสะสมจาก 100 คะแนนแรก)
                </div>
              </div>
            </div>

            {/* Rank display badge */}
            <div className={`rounded-2xl border p-4 flex items-center justify-between ${rank.bg} ${rank.border}`}>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">เกรดแรงค์ปัจจุบัน</span>
                <span className={`font-black text-base ${rank.color} mt-0.5 block`}>
                  {rank.icon} {rank.name}
                </span>
              </div>
              <div className="text-right text-[10px] text-slate-400 font-bold">
                อันดับที่: 🥇 #12
              </div>
            </div>
          </div>

          {/* Odometer Distance Card */}
          <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col justify-between min-h-[260px] transition-all duration-300 hover:shadow-slate-500/5">
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
                ระยะทางขับขี่สะสม (Odometer)
              </span>

              <div className="mt-8 text-center">
                <div className="text-4xl md:text-5xl font-black text-orange-500 font-mono tracking-tight">
                  <AnimatedCounter value={helmetData.distance} decimals={2} suffix=" km" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1 font-medium">
              <div className="flex justify-between">
                <span>ความเร็วปัจจุบัน (Speed)</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{helmetStatus === "connected" ? helmetData.speed : 0} km/h</span>
              </div>
              <div className="flex justify-between">
                <span>ระดับแบตเตอรี่ (Battery)</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{helmetStatus === "connected" ? helmetData.battery : 0}%</span>
              </div>
            </div>
          </div>

          {/* Today's Summary Card */}
          <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col justify-between min-h-[260px] transition-all duration-300 hover:shadow-slate-500/5">
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
                {t("summaryToday")}
              </span>

              {/* Grids */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold">{t("distance")}</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white mt-1 font-mono">
                    {helmetStatus === "connected" ? (helmetData.distance * 0.05).toFixed(2) : "0.00"} km
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold">{t("score")}</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white mt-1 font-mono">
                    {safetyScore} pts
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold">{t("ridingTime")}</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white mt-1 font-mono">
                    {helmetStatus === "connected" ? "32 mins" : "0 min"}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold">{t("wearCount")}</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white mt-1 font-mono">
                    {helmetStatus === "connected" ? "2 ครั้ง" : "0 ครั้ง"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center font-bold">
              อัปเดตข้อมูลแบบเรียลไทม์ผ่านบอร์ด ESP32
            </div>
          </div>

        </div>

        {/* SOS Alerting Layer (Shows when crash detected) */}
        {helmetData.crashDetect && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-md rounded-3xl bg-red-600 text-white p-8 shadow-2xl text-center space-y-6 animate-scale-up border-2 border-red-500">
              <span className="text-6xl animate-bounce inline-block">⚠</span>
              <h2 className="text-3xl font-black tracking-wide">ตรวจพบการล้ม!</h2>
              <p className="text-sm text-red-100 font-medium">
                ระบบเซนเซอร์วัดความเร่งและ Gyroscope ตรวจพบแรงกระแทกเฉียบพลัน คาดว่าเกิดอุบัติเหตุ
                ระบบได้แจ้งเตือนและแชร์พิกัด GPS ไปยังศูนย์กู้ภัยและติดต่อผู้ติดต่อฉุกเฉินแล้ว
              </p>
              
              <div className="bg-red-700/50 p-4 rounded-2xl text-left text-xs font-mono space-y-1">
                <div>📌 พิกัด: {helmetData.gps.lat.toFixed(4)}, {helmetData.gps.lng.toFixed(4)}</div>
                <div>📡 สถานะสัญญาณ: SOS Broadcast Active</div>
                <div>🔋 แบตเตอรี่อุปกรณ์: {helmetData.battery}%</div>
              </div>

              <div className="text-xs text-red-200/80 animate-pulse font-bold">
                * จะปิดสัญญาณเตือนภัยโดยอัตโนมัติในอีกสักครู่... *
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}