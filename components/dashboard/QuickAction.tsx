export default function QuickAction() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
      <h2 className="text-xl font-bold">Quick Actions</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <button className="rounded-2xl bg-orange-500 p-4 text-white hover:bg-orange-600">
          🪖 เชื่อมต่อหมวก
        </button>

        <button className="rounded-2xl bg-blue-500 p-4 text-white hover:bg-blue-600">
          📍 เริ่มติดตาม
        </button>

        <button className="rounded-2xl bg-red-500 p-4 text-white hover:bg-red-600">
          🚨 SOS
        </button>
      </div>
    </div>
  );
}