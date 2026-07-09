"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useApp, TripRecord } from "@/contexts/AppContext";

export default function HistoryPage() {
  const { history, t, language } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"today" | "week" | "month" | "year" | "all">("all");
  const [selectedTrip, setSelectedTrip] = useState<TripRecord | null>(null);

  // Grouping trips
  const currentMonthTrips = history.filter(trip => {
    // For simplicity, let's assume trips from July 2026 are "This Month", and earlier ones are "Previous Month"
    return trip.date.startsWith("2026-07");
  });

  const previousMonthTrips = history.filter(trip => {
    return !trip.date.startsWith("2026-07");
  });

  const matchesSearchAndFilter = (trip: TripRecord) => {
    // Search match
    const formattedDate = new Date(trip.date).toLocaleDateString(
      language === "th" ? "th-TH" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
    const searchMatch = 
      trip.date.includes(search) || 
      formattedDate.toLowerCase().includes(search.toLowerCase());

    if (!searchMatch) return false;

    // Filter match
    if (filter === "all") return true;
    if (filter === "today") return trip.date === "2026-07-08";
    if (filter === "week") {
      // 2026-07-02 to 2026-07-08 approx
      const day = parseInt(trip.date.split("-")[2]);
      return trip.date.startsWith("2026-07") && day >= 2;
    }
    if (filter === "month") return trip.date.startsWith("2026-07");
    if (filter === "year") return trip.date.startsWith("2026");
    return true;
  };

  const getStatusEmoji = (status: TripRecord["status"]) => {
    if (status === "completed") return "🟢 ปกติ (Safe)";
    if (status === "alert") return "🟡 ความเร็วเกิน (Speed Alert)";
    return "🚨 เกิดอุบัติเหตุ (Crash)";
  };

  const getStatusColor = (status: TripRecord["status"]) => {
    if (status === "completed") return "text-emerald-500";
    if (status === "alert") return "text-amber-500";
    return "text-red-500";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      language === "th" ? "th-TH" : "en-US",
      { weekday: "short", year: "numeric", month: "long", day: "numeric" }
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-10">
        
        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between rounded-3xl bg-white p-6 shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          {/* Search bar */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchDate")}
              className="w-full rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-3 pl-12 pr-4 text-sm font-semibold outline-none ring-2 ring-transparent transition focus:border-orange-500 focus:ring-orange-500/20"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-1.5 justify-start md:justify-end">
            {(["today", "week", "month", "year", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                  filter === f
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {t(`filter${f.charAt(0).toUpperCase() + f.slice(1)}` as any)}
              </button>
            ))}
          </div>
        </div>

        {/* Trips Lists */}
        <div className="space-y-8">
          
          {/* Month Section 1: This Month */}
          <div>
            <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 mb-4 tracking-widest uppercase pl-2">
              {language === "th" ? "เดือนนี้" : "THIS MONTH"}
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              {currentMonthTrips.filter(matchesSearchAndFilter).length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-bold md:col-span-2">
                  ไม่มีประวัติการเดินทางในหมวดนี้
                </div>
              ) : (
                currentMonthTrips.filter(matchesSearchAndFilter).map((trip) => (
                  <button
                    key={trip.id}
                    onClick={() => setSelectedTrip(trip)}
                    className="w-full text-left p-6 rounded-[2rem] bg-gradient-to-br from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between min-h-[140px] group border border-transparent"
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="font-mono text-xs font-bold text-orange-100">
                        {trip.time}
                      </span>
                      <span className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur font-bold">
                        ★ {trip.score} pts
                      </span>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-lg font-black leading-tight">
                        {formatDate(trip.date)}
                      </h3>
                      <p className="text-xs text-orange-50/80 font-semibold mt-1">
                        ระยะทาง: {trip.distance.toFixed(2)} Km
                      </p>
                    </div>

                    <div className="w-full flex justify-end text-xs font-bold mt-2 text-orange-100 group-hover:translate-x-1 transition-transform">
                      ดูรายละเอียด ➔
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Month Section 2: Previous Month */}
          <div>
            <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 mb-4 tracking-widest uppercase pl-2">
              {language === "th" ? "เดือนก่อน" : "PREVIOUS MONTHS"}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {previousMonthTrips.filter(matchesSearchAndFilter).length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-bold md:col-span-2">
                  ไม่มีประวัติการเดินทางในหมวดนี้
                </div>
              ) : (
                previousMonthTrips.filter(matchesSearchAndFilter).map((trip) => (
                  <button
                    key={trip.id}
                    onClick={() => setSelectedTrip(trip)}
                    className="w-full text-left p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between min-h-[140px] group"
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                        {trip.time}
                      </span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 font-bold">
                        ★ {trip.score} pts
                      </span>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-lg font-black leading-tight text-slate-900 dark:text-white">
                        {formatDate(trip.date)}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                        ระยะทาง: {trip.distance.toFixed(2)} Km
                      </p>
                    </div>

                    <div className="w-full flex justify-end text-xs font-bold mt-2 text-orange-500 group-hover:translate-x-1 transition-transform">
                      ดูรายละเอียด ➔
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Trip Detail Modal */}
        {selectedTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-md rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-2xl space-y-6 animate-scale-up border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white">
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    TRIP DETAILS
                  </span>
                  <h3 className="text-2xl font-black mt-1">
                    {formatDate(selectedTrip.date)}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-lg hover:scale-105 active:scale-95 transition"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">เวลาเดินทาง</span>
                  <span className="text-sm font-black mt-1 block font-mono">{selectedTrip.time}</span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">คะแนนความปลอดภัย</span>
                  <span className="text-sm font-black mt-1 block text-orange-500 font-mono">★ {selectedTrip.score} คะแนน</span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">ระยะทางทั้งหมด</span>
                  <span className="text-sm font-black mt-1 block font-mono">{selectedTrip.distance.toFixed(2)} Km</span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">ความเร็วเฉลี่ย</span>
                  <span className="text-sm font-black mt-1 block font-mono">{selectedTrip.avgSpeed} Km/h</span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">สถานะความปลอดภัย</span>
                <span className={`text-sm font-black ${getStatusColor(selectedTrip.status)}`}>
                  {getStatusEmoji(selectedTrip.status)}
                </span>
              </div>

              <button
                onClick={() => setSelectedTrip(null)}
                className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full shadow-lg transition-transform hover:scale-[1.01]"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
