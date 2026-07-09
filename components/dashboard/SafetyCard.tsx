export default function SafetyCard() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Safety Score
          </p>

          <h2 className="mt-2 text-5xl font-bold text-orange-500">
            95
          </h2>

          <p className="mt-2 text-green-600 font-semibold">
            Excellent
          </p>
        </div>

        <div className="flex h-28 w-28 items-center justify-center rounded-full border-8 border-orange-500 text-3xl font-bold text-orange-500">
          95%
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>ความปลอดภัย</span>
          <span>95%</span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="h-full w-[95%] rounded-full bg-orange-500"></div>
        </div>
      </div>

      <div className="mt-6 flex justify-between rounded-2xl bg-orange-50 p-4 dark:bg-slate-800">
        <div>
          <p className="text-sm text-slate-500">Badge</p>
          <h3 className="font-bold text-orange-500">
            🥇 Gold
          </h3>
        </div>

        <div>
          <p className="text-sm text-slate-500">Ranking</p>
          <h3 className="font-bold text-slate-900 dark:text-white">
            #12
          </h3>
        </div>
      </div>
    </div>
  );
}