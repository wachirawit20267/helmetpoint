import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="HelmetPoint"
            className="w-11 h-11"
          />

          <div>
            <h1 className="font-bold text-xl text-[#1E3A5F]">
              HelmetPoint
            </h1>

            <p className="text-xs text-gray-500">
              Smart Helmet System
            </p>
          </div>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8">

          <Link href="/" className="hover:text-orange-500 transition">
            หน้าแรก
          </Link>

          <Link href="#features" className="hover:text-orange-500 transition">
            คุณสมบัติ
          </Link>

          <Link href="#about" className="hover:text-orange-500 transition">
            เกี่ยวกับ
          </Link>

        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          <button className="px-3 py-2 rounded-xl hover:bg-gray-100">
            ไทย
          </button>

          <button className="px-3 py-2 rounded-xl hover:bg-gray-100">
            🌙
          </button>

          <Link
            href="/login"
            className="px-5 py-2 rounded-xl border border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            เข้าสู่ระบบ
          </Link>

          <Link
            href="/register"
            className="px-5 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
          >
            สมัครสมาชิก
          </Link>

        </div>

      </div>
    </nav>
  );
}