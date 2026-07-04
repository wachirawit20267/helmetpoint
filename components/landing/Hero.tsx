import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-white to-blue-100" />

      <div className="relative max-w-7xl mx-auto px-6 py-24">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}

          <div>

            <span className="inline-flex px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-medium">
              🚀 Smart Helmet Platform
            </span>

            <h1 className="text-6xl font-bold mt-6 leading-tight">

              สวมหมวกทุกครั้ง

              <br />

              <span className="text-orange-500">
                ทุกกิโลเมตรมีคุณค่า
              </span>

            </h1>

            <p className="text-gray-600 mt-8 text-lg leading-8">

              ระบบส่งเสริมการสวมหมวกกันน็อก
              ตรวจสอบการสวมหมวกด้วย IoT
              พร้อมสะสมคะแนนจากระยะทางการเดินทาง

            </p>

            <div className="flex gap-4 mt-10">

              <Link
                href="/register"
                className="px-8 py-4 rounded-2xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
              >
                เริ่มต้นใช้งาน
              </Link>

              <Link
                href="#features"
                className="px-8 py-4 rounded-2xl border border-gray-300 hover:bg-gray-100 transition"
              >
                เรียนรู้เพิ่มเติม
              </Link>

            </div>

          </div>

          {/* Right */}

          <div className="flex justify-center">

            <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-300 to-blue-300 opacity-40 blur-3xl absolute" />

            <div className="relative w-96 h-96 rounded-[40px] bg-white shadow-2xl flex items-center justify-center">

              <span className="text-8xl">
                🪖
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}