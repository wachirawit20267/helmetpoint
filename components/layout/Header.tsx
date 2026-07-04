"use client";

export default function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold">
          HP
        </div>

        <div>
          <h1 className="font-bold text-xl text-[#1E3A5F]">
            HelmetPoint
          </h1>

          <p className="text-xs text-gray-500">
            AI & IoT Smart Helmet
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        <button className="text-gray-600 hover:text-orange-500">
          🔔
        </button>

        <button className="text-gray-600 hover:text-orange-500">
          🌙
        </button>

        <button className="text-gray-600 hover:text-orange-500">
          🌐
        </button>

        <div className="w-10 h-10 rounded-full bg-gray-300"></div>

      </div>
    </header>
  );
}