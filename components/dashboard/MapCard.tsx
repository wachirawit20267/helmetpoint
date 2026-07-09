export default function MapCard() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        Live GPS Map
      </h2>

      <div className="mt-6 flex h-80 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
        <div className="text-center">
          <div className="text-6xl">🗺️</div>

          <p className="mt-4 text-slate-500">
            แผนที่จะเชื่อมกับ GPS ของ ESP32
          </p>
        </div>
      </div>
    </div>
  );
}