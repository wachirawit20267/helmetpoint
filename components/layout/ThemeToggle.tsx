"use client";

import { useApp } from "@/contexts/AppContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useApp();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      title={isDark ? "สลับเป็นโหมดกลางวัน" : "สลับเป็นโหมดกลางคืน"}
      className="flex items-center justify-center h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-lg transition-all duration-300 hover:scale-105 active:scale-95"
    >
      {/* แสดงไอคอนโหมดที่กำลังใช้งานอยู่ */}
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}