"use client";

import Link from "next/link";

export default function CookiesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
          <h2 className="text-xl font-black">นโยบายการใช้คุกกี้</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            เว็บไซต์ HelmetPoint ใช้คุกกี้เพื่อเพิ่มประสิทธิภาพการทำงานและประสบการณ์ใช้งานของคุณ
            โดยคุกกี้ที่ใช้ประกอบด้วยคุกกี้ที่จำเป็นต่อการทำงานของระบบ เช่น การจดจำการเข้าสู่ระบบ
            การตั้งค่าภาษา และธีมที่เลือก เราไม่แบ่งปันข้อมูลส่วนตัวกับบุคคลที่สาม
          </p>
        </div>
        <div className="text-center">
          <Link href="/login" className="inline-block text-sm font-bold text-orange-500 hover:underline">
            ⬅ กลับไปยังหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </main>
  );
}
