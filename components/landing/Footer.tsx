import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-4">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold text-orange-500">
              🪖 HelmetPoint
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              ระบบหมวกนิรภัยอัจฉริยะที่ผสาน AI, IoT และ GPS
              เพื่อเพิ่มความปลอดภัยในการเดินทาง
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-lg">Product</h3>

            <ul className="mt-4 space-y-3 text-slate-300">
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>

              <li>
                <Link href="/device">Device</Link>
              </li>

              <li>
                <Link href="/history">History</Link>
              </li>

              <li>
                <Link href="/ranking">Ranking</Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-bold text-lg">Account</h3>

            <ul className="mt-4 space-y-3 text-slate-300">
              <li>
                <Link href="/login">Login</Link>
              </li>

              <li>
                <Link href="/register">Register</Link>
              </li>

              <li>
                <Link href="/profile">Profile</Link>
              </li>

              <li>
                <Link href="/settings">Settings</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg">Support</h3>

            <p className="mt-4 text-slate-300">
              Email
            </p>

            <p className="text-orange-400">
              support@helmetpoint.com
            </p>

            <p className="mt-6 text-slate-300">
              Smart Helmet Platform
            </p>
          </div>

        </div>

        <div className="mt-12 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
          © 2026 HelmetPoint. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}