import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <div className="mx-auto grid min-h-[85vh] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2">

        {/* Left */}
        <div>
          <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
            🪖 AI • IoT • GPS Tracking
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-900 md:text-7xl">
            HelmetPoint
          </h1>

          <h2 className="mt-4 text-2xl font-semibold text-slate-600 md:text-3xl">
            Smart Helmet
            <br />
            Smart Safety
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
            ระบบหมวกนิรภัยอัจฉริยะสำหรับติดตามตำแหน่ง วิเคราะห์การขับขี่
            ตรวจจับอุบัติเหตุ และแจ้งเหตุฉุกเฉินแบบเรียลไทม์
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/register">
              <Button>เริ่มต้นใช้งาน</Button>
            </Link>

            <Link href="/login">
              <Button variant="outline">
                เข้าสู่ระบบ
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-600">
            <span>📍 GPS Tracking</span>
            <span>🚨 SOS Alert</span>
            <span>🪖 Smart Helmet</span>
          </div>
        </div>

        <div className="flex items-center justify-center">
  <div className="flex h-96 w-96 items-center justify-center rounded-full border-4 border-dashed border-orange-300 bg-orange-50 text-center">
    <div>
      <p className="text-6xl">🪖</p>
      <p className="mt-4 text-slate-500">
        Smart Helmet Image
        <br />
        (Coming Soon)
      </p>
    </div>
  </div>
</div>

      </div>
    </section>
  );
}