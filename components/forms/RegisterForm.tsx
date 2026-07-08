"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Checkbox from "@/components/ui/Checkbox";

export default function RegisterForm() {
  return (
    <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-900">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          🪖 HelmetPoint
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          สมัครสมาชิกเพื่อเริ่มใช้งาน
        </p>
      </div>

      <form className="space-y-5">
        <Input
          label="ชื่อ-นามสกุล"
          type="text"
          placeholder="กรอกชื่อ-นามสกุล"
        />

        <Input
          label="Email"
          type="email"
          placeholder="example@email.com"
        />

        <Input
          label="เบอร์โทรศัพท์"
          type="tel"
          placeholder="08xxxxxxxx"
        />

        <Input
          label="รหัสผ่าน"
          type="password"
          placeholder="••••••••"
        />

        <Input
          label="ยืนยันรหัสผ่าน"
          type="password"
          placeholder="••••••••"
        />

        <Checkbox>
          ฉันยอมรับเงื่อนไขการใช้งาน (Terms of Service)
        </Checkbox>

        <Checkbox>
          ฉันยอมรับนโยบายความเป็นส่วนตัว (Privacy Policy)
        </Checkbox>

        <Button className="w-full">
          สมัครสมาชิก
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500">
        มีบัญชีอยู่แล้ว?

        <Link
          href="/login"
          className="ml-2 font-semibold text-orange-500 hover:underline"
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    </div>
  );
}