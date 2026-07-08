"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Checkbox from "@/components/ui/Checkbox";

export default function LoginForm() {
  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-900">

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          🪖 HelmetPoint
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          ยินดีต้อนรับกลับ
        </p>
      </div>

      <form className="space-y-5">

        <Input
          label="Email"
          type="email"
          placeholder="example@email.com"
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
        />

        <div className="flex items-center justify-between">

          <Checkbox>
            Remember me
          </Checkbox>

          <Link
            href="#"
            className="text-sm text-orange-500 hover:underline"
          >
            ลืมรหัสผ่าน?
          </Link>

        </div>

        <Button className="w-full">
          เข้าสู่ระบบ
        </Button>

      </form>

      <div className="mt-8 text-center text-sm text-slate-500">

        ยังไม่มีบัญชี?

        <Link
          href="/register"
          className="ml-2 font-semibold text-orange-500 hover:underline"
        >
          สมัครสมาชิก
        </Link>

      </div>

    </div>
  );
}