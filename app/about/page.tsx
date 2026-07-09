"use client";

import Link from "next/link";
import HelmetLogo from "@/components/common/HelmetLogo";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
      <div className="w-full max-w-md text-center space-y-6">
        <HelmetLogo size="lg" showText={true} showSubtitle={true} />
        
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-xl border border-slate-100 dark:border-slate-800 text-left space-y-4">
          <h2 className="text-xl font-black">เกี่ยวกับโครงการ</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            <strong>HelmetPoint</strong> เป็นระบบโครงงานหมวกกันน็อกอัจฉริยะแบบ AI & IoT 
            ที่เชื่อมต่อการทำงานของหมวกนิรภัยเข้ากับแผงควบคุม Dashboard บนเว็บไซต์แบบเรียลไทม์ 
            เพื่อเพิ่มระดับความปลอดภัยในการขับขี่บนท้องถนน ตรวจหาความเร่ง แรงกระแทกจากการล้ม 
            รวมถึงเก็บสถิติระยะทางและคำนวณคะแนนความปลอดภัยเพื่อสร้างวินัยการจราจรที่ดี
          </p>
          <div className="text-xs text-slate-400 font-bold border-t border-slate-100 dark:border-slate-800 pt-3">
            ผู้พัฒนา: นายวชิรวิทย์ สมบูรณ์
          </div>
        </div>

        <Link
          href="/login"
          className="inline-block text-sm font-bold text-orange-500 hover:underline"
        >
          ⬅ กลับไปยังหน้าเข้าสู่ระบบ (Login)
        </Link>
      </div>
    </main>
  );
}
