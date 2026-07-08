export default function Features() {
  const features = [
    {
      icon: "📍",
      title: "GPS Tracking",
      desc: "ติดตามตำแหน่งของหมวกนิรภัยแบบเรียลไทม์ พร้อมแสดงข้อมูลบนแผนที่",
    },
    {
      icon: "🚨",
      title: "Emergency SOS",
      desc: "แจ้งเตือนเหตุฉุกเฉินไปยังผู้ติดต่อเมื่อเกิดอุบัติเหตุหรือกดปุ่ม SOS",
    },
    {
      icon: "📊",
      title: "Driving Analytics",
      desc: "วิเคราะห์ข้อมูลการขับขี่ พร้อมแสดงคะแนนความปลอดภัยและสถิติการใช้งาน",
    },
    {
      icon: "🔋",
      title: "Device Monitoring",
      desc: "ตรวจสอบแบตเตอรี่ สถานะการเชื่อมต่อ และข้อมูลจากอุปกรณ์แบบเรียลไทม์",
    },
  ];

  return (
    <section
      id="features"
      className="bg-slate-50 py-24 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
            ✨ Features
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-slate-900 dark:text-white md:text-5xl">
            คุณสมบัติเด่นของ HelmetPoint
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            ระบบหมวกนิรภัยอัจฉริยะที่ผสาน AI, IoT และ GPS
            เพื่อยกระดับความปลอดภัยในการเดินทางแบบครบวงจร
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-4xl transition group-hover:scale-110">
                {item.icon}
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                {item.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
                {item.desc}
              </p>

              <button className="mt-8 font-semibold text-orange-500 transition hover:text-orange-600">
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}