"use client";

import React from "react";

interface HelmetLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  theme?: "light" | "dark";
}

export default function HelmetLogo({
  size = "md",
  showText = true,
  showSubtitle = false,
  className = "",
  theme = "light",
}: HelmetLogoProps) {
  const dimensions = {
    sm: { svg: "h-10 w-10", text: "text-lg", stars: "w-16" },
    md: { svg: "h-16 w-16", text: "text-2xl", stars: "w-24" },
    lg: { svg: "h-24 w-24", text: "text-4xl", stars: "w-32" },
    xl: { svg: "h-36 w-36", text: "text-5xl", stars: "w-44" },
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* Helmet Icon */}
      <svg
        className={`${dimensions.svg} text-slate-900 dark:text-white transition-all hover:scale-105 duration-300`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Outer Helmet Shell */}
        <path
          d="M85 50C85 22.3858 62.6142 0 35 0C17.3478 0 2 12.3858 2 30C2 40 8 48 15 52C12 55 10 60 10 65C10 75 25 80 40 80C42 80 50 78 55 75C60 78 72 80 80 75C88 70 85 55 85 50Z"
          fill="currentColor"
          className="text-slate-900 dark:text-slate-800"
        />
        
        {/* Helmet Accents & Details */}
        <path
          d="M10 32C10 18 20 8 35 8C50 8 60 18 60 32"
          stroke="#F96E28"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Visor Area (Orange / Glassmorphic) */}
        <path
          d="M88 45C88 38 80 30 65 30H30C25 30 20 35 20 40C20 48 28 55 35 55H70C82 55 88 50 88 45Z"
          fill="#F96E28"
        />

        {/* Visor Reflection Highlight */}
        <path
          d="M62 35C62 35 55 35 48 38C46 39 42 42 42 42"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Lower Chin Guard details */}
        <path
          d="M28 65H42"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M26 71H38"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Vent Hole */}
        <circle cx="15" cy="42" r="3" fill="#1E3E62" />
      </svg>

      {/* Title Text */}
      {showText && (
        <div className="mt-2 select-none">
          <h1
            className={`font-black tracking-widest text-slate-900 dark:text-white ${dimensions.text} flex items-center justify-center`}
            style={{ fontFamily: "'Outfit', sans-serif, system-ui" }}
          >
            <span>HELMET</span>
            <span className="text-[#F96E28] ml-2">POINT</span>
          </h1>

          {/* Stars */}
          <div className="flex justify-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-500 text-lg">★</span>
            ))}
          </div>
        </div>
      )}

      {showSubtitle && (
        <p className="mt-2 max-w-xs text-xs font-medium text-slate-500 dark:text-slate-400">
          ส่วนหนึ่งในโครงงาน หมวกกันน็อกอัจฉริยะ AI & IoT เพื่อการขับขี่ปลอดภัยและสร้างวินัยจราจร
        </p>
      )}
    </div>
  );
}
