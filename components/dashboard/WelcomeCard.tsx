export default function WelcomeCard() {
  const hour = new Date().getHours();

  let greeting = "สวัสดี";

  if (hour < 12) greeting = "🌤️ สวัสดีตอนเช้า";
  else if (hour < 17) greeting = "☀️ สวัสดีตอนบ่าย";
  else greeting = "🌙 สวัสดีตอนเย็น";

  return (
    <section className="rounded-3xl bg-gradient-to-r from-orange-500 to-orange-400 p-8 text-white shadow-xl">
      <p className="text-lg opacity-90">
        {greeting}
      </p>

      <h1 className="mt-2 text-4xl font-bold">
        ยินดีต้อนรับสู่ HelmetPoint
      </h1>

      <p className="mt-4 max-w-2xl text-orange-100">
        ระบบหมวกนิรภัยอัจฉริยะที่ช่วยติดตามตำแหน่ง
        วิเคราะห์การขับขี่ และแจ้งเหตุฉุกเฉินแบบเรียลไทม์
      </p>

      <div className="mt-8 flex flex-wrap gap-4">

        <div className="rounded-2xl bg-white/20 px-5 py-3 backdrop-blur">
          📍 GPS พร้อมใช้งาน
        </div>

        <div className="rounded-2xl bg-white/20 px-5 py-3 backdrop-blur">
          🪖 Helmet Connected
        </div>

        <div className="rounded-2xl bg-white/20 px-5 py-3 backdrop-blur">
          🚨 Safety Monitoring
        </div>

      </div>
    </section>
  );
}