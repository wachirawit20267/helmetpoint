"use client";

import { usePathname } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { user, t, notifications, triggerCrash, helmetStatus } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard": return t("dashboard");
      case "/device":    return t("device");
      case "/history":   return t("history");
      case "/ranking":   return t("ranking");
      case "/profile":   return t("profile");
      case "/settings":  return t("settings");
      default:           return "HelmetPoint";
    }
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    const g = h < 12 ? "สวัสดีตอนเช้า 🌤️" : h < 17 ? "สวัสดีตอนบ่าย ☀️" : "สวัสดีตอนเย็น 🌙";
    return g;
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 sm:h-20 items-center justify-between border-b px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      style={{ 
        background: "var(--card-bg)", 
        borderColor: "var(--card-border)" 
      }}
    >
      {/* Left side: hamburger + page title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger (mobile only) */}
        <button
          onClick={onMenuClick}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0"
          aria-label="Open menu"
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-slate-700 dark:bg-slate-300 rounded-full"></span>
            <span className="block h-0.5 w-5 bg-slate-700 dark:bg-slate-300 rounded-full"></span>
            <span className="block h-0.5 w-5 bg-slate-700 dark:bg-slate-300 rounded-full"></span>
          </div>
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-xl font-black truncate" style={{ color: "var(--foreground)" }}>
            {getPageTitle()}
          </h1>
          <p className="text-[10px] sm:text-xs hidden sm:block" style={{ color: "var(--muted)" }}>
            {user ? `${getGreeting()}, ${user.firstName} ${user.lastName}` : "ยินดีต้อนรับสู่ระบบ HelmetPoint"}
          </p>
        </div>
      </div>

      {/* Right side: actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Simulate Crash (desktop + connected only) */}
        {helmetStatus === "connected" && (
          <button
            onClick={triggerCrash}
            className="hidden lg:flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 px-3 py-2 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            🚨 Simulate Crash
          </button>
        )}

        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative h-9 w-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xl transition-all duration-300"
          >
            🔔
            {notifications.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white animate-pulse">
                {notifications.length > 9 ? "9+" : notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-3 w-72 sm:w-80 rounded-2xl border shadow-xl z-50 animate-fade-in-up overflow-hidden"
                style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--card-border)" }}>
                  <span className="font-bold text-sm" style={{ color: "var(--foreground)" }}>การแจ้งเตือน</span>
                  <span className="text-[10px]" style={{ color: "var(--muted)" }}>ล่าสุด</span>
                </div>
                <div className="max-h-60 overflow-y-auto p-3 space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-center text-xs py-4" style={{ color: "var(--muted)" }}>ไม่มีรายการแจ้งเตือน</p>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className={`p-2.5 rounded-xl text-xs flex flex-col gap-1 border ${
                        notif.type === "error"   ? "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400"
                        : notif.type === "warning" ? "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 text-amber-600 dark:text-amber-400"
                        : notif.type === "success" ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      }`}>
                        <span className="font-semibold">{notif.text}</span>
                        <span className="text-[9px] text-right" style={{ color: "var(--muted)" }}>{notif.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Avatar with profile photo support */}
        {user && (
          <div className="flex items-center gap-2 rounded-2xl px-2 sm:px-3 py-1.5 transition-colors duration-300"
            style={{ background: "var(--muted-bg)" }}
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden ring-2 ring-orange-500/30 shadow-md shrink-0">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-tr from-orange-500 to-orange-400 text-xs sm:text-sm font-black text-white">
                  {user.firstName?.charAt(0) || "?"}{user.lastName?.charAt(0) || ""}
                </div>
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold leading-tight" style={{ color: "var(--foreground)" }}>{user.firstName}</p>
              <p className="text-[10px] capitalize" style={{ color: "var(--muted)" }}>
                {user.career === "Student" ? t("careerStudent") : user.career === "Teacher" ? t("careerTeacher") : user.career}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}