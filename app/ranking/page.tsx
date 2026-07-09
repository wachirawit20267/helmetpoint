"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useApp } from "@/contexts/AppContext";
import { db, auth } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;   // Accumulated rank points
  score: number;    // Safety score 0-100
  badge: string;
  distance: number; // Total km
  isSelf?: boolean;
}

// Helper: get badge from accumulated points
function getBadgeFromPoints(points: number): string {
  if (points >= 5000) return "Legend";
  if (points >= 2000) return "Champion";
  if (points >= 1000) return "Master";
  if (points >= 600)  return "Diamond";
  if (points >= 300)  return "Gold";
  if (points >= 100)  return "Silver";
  return "Bronze";
}

export default function RankingPage() {
  const { user } = useApp();
  const [topRiders, setTopRiders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("points", "desc"), limit(20));

    const unsub = onSnapshot(q, (snap) => {
      const realUsers: LeaderboardUser[] = [];
      const currentUid = auth.currentUser?.uid;

      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const firstName = data.firstName || "ผู้ใช้งาน";
        const lastName = data.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim();

        realUsers.push({
          rank: 0, // Assigned dynamically after merging/sorting
          name: fullName,
          points: data.points ?? 100,
          score: data.safetyScore ?? 100,
          badge: getBadgeFromPoints(data.points ?? 100),
          distance: Number((data.distance ?? 0).toFixed(1)),
          isSelf: docSnap.id === currentUid,
        });
      });

      // Template riders for mock backup to populate empty lists beautifully
      const mockRidersTemplate: Omit<LeaderboardUser, "rank">[] = [
        { name: "สมชาย ยอดรัก",       points: 6820, score: 99, badge: "Legend",   distance: 682.0 },
        { name: "กิตติพงษ์ ใจงาม",     points: 5930, score: 98, badge: "Legend",   distance: 593.0 },
        { name: "อัญชลี ศรีสุข",       points: 5210, score: 98, badge: "Legend",   distance: 521.0 },
        { name: "สิทธิพงษ์ มั่นคง",    points: 4550, score: 96, badge: "Champion", distance: 455.0 },
        { name: "นารี รัตน์ดาว",       points: 3980, score: 95, badge: "Champion", distance: 398.0 },
        { name: "วิทยา เปรื่องไกร",    points: 3120, score: 93, badge: "Champion", distance: 312.0 },
        { name: "ภานุเดช แสงอรุณ",     points: 2750, score: 91, badge: "Champion", distance: 275.0 },
        { name: "รพีภัทร วัฒนา",       points: 2100, score: 89, badge: "Champion", distance: 210.0 },
        { name: "อรัญญา ปัญญาเลิศ",    points: 1820, score: 87, badge: "Master",   distance: 182.0 },
        { name: "พิมพิศา นามสมมุติ",   points: 1540, score: 85, badge: "Master",   distance: 154.0 },
        { name: "ณัฐพล เจริญทรัพย์",   points: 1350, score: 84, badge: "Master",   distance: 135.0 },
        { name: "ณรงค์เดช เกียรติคุณ", points: 1020, score: 82, badge: "Master",   distance: 102.0 },
        { name: "จักรภัทร เทพสถิตย์",  points: 870,  score: 80, badge: "Diamond",  distance: 87.0 },
        { name: "มนัสวี อานนท์",        points: 760,  score: 78, badge: "Diamond",  distance: 76.0 },
        { name: "ปัทมา จิรวัฒน์",       points: 640,  score: 76, badge: "Diamond",  distance: 64.0 },
        { name: "ธนภัทร สมใจ",         points: 520,  score: 74, badge: "Gold",     distance: 52.0 },
        { name: "กุลธิดา บุปผา",        points: 430,  score: 72, badge: "Gold",     distance: 43.0 },
        { name: "อภิวัฒน์ พงษ์ไพร",    points: 340,  score: 70, badge: "Gold",     distance: 34.0 },
        { name: "ศิริพร เดชชัย",        points: 250,  score: 68, badge: "Silver",   distance: 25.0 }
      ];

      // Merge & Deduplicate lists using the names
      const realUserNames = new Set(realUsers.map(u => u.name));
      const mergedList = [...realUsers];

      mockRidersTemplate.forEach(mock => {
        if (!realUserNames.has(mock.name)) {
          mergedList.push({
            rank: 0,
            ...mock,
            isSelf: false
          });
        }
      });

      // Sort by points desc
      mergedList.sort((a, b) => b.points - a.points);

      // Re-assign ranks 1 to N
      const rankedList = mergedList.map((rider, index) => ({
        ...rider,
        rank: index + 1
      }));

      setTopRiders(rankedList.slice(0, 20));
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const getRankMedal = (rankNumber: number) => {
    if (rankNumber === 1) return "🥇";
    if (rankNumber === 2) return "🥈";
    if (rankNumber === 3) return "🥉";
    return null;
  };

  const getBadgeStyle = (badgeName: string) => {
    switch (badgeName) {
      case "Legend":   return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "Champion": return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      case "Master":   return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
      case "Diamond":  return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "Gold":     return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "Silver":   return "bg-slate-400/10 text-slate-600 dark:text-slate-400 border-slate-400/20";
      default:         return "bg-amber-700/10 text-amber-700 dark:text-amber-500 border-amber-700/20";
    }
  };

  // Locate current user in list, or construct fallback if not yet synced/merged
  const selfRecord = topRiders.find((r) => r.isSelf) || {
    rank: topRiders.length + 1,
    name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "ผู้ใช้งาน",
    points: user?.points ?? 100,
    score: user?.safetyScore ?? 100,
    badge: getBadgeFromPoints(user?.points ?? 100),
    distance: user?.distance ?? 0,
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto pb-10">

        {/* Pinned Self Card */}
        <div className="rounded-[2.5rem] bg-gradient-to-r from-orange-500 to-orange-400 p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in border border-orange-400/20">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl font-black backdrop-blur-md shadow-inner">
              {selfRecord.rank}
            </div>
            <div>
              <span className="text-[10px] font-bold text-orange-100 uppercase tracking-widest block">
                อันดับของคุณ (YOUR RANK)
              </span>
              <h3 className="text-xl font-black mt-0.5 leading-none">{selfRecord.name}</h3>
              <p className="text-xs text-orange-50/80 font-bold mt-1">
                แรงค์: 👑 {selfRecord.badge} · ระยะทางสะสม: {selfRecord.distance.toLocaleString()} km
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right shrink-0">
            <span className="text-xs font-semibold text-orange-100 block">แต้มสะสม</span>
            <span className="text-3xl font-black font-mono leading-none">{selfRecord.points.toLocaleString()}</span>
            <span className="text-xs font-semibold text-orange-100 ml-1 block">pts (Safety: {selfRecord.score}/100)</span>
          </div>
        </div>

        {/* Top 20 Leaderboard */}
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
            <div>
              <h2 className="font-black text-slate-800 dark:text-white">
                🏆 อันดับผู้ขับขี่ปลอดภัยสูงสุด
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">แสดงผลเพียง 20 อันดับแรก · อัปเดตแบบเรียลไทม์</p>
            </div>
            <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
              Top 20
            </span>
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {loading ? (
              <div className="text-center py-10 text-xs font-bold text-slate-400">กำลังโหลดอันดับ...</div>
            ) : (
              topRiders.map((rider) => {
                const medal = getRankMedal(rider.rank);
                return (
                  <div
                    key={`${rider.rank}-${rider.name}`}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
                      rider.isSelf
                        ? "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-500/30"
                        : "bg-slate-50/60 border-slate-100 dark:bg-slate-950/30 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank / Medal */}
                      <div className="w-8 shrink-0 text-center font-mono font-black text-sm text-slate-400">
                        {medal || <span className="text-slate-500">{rider.rank}</span>}
                      </div>

                      {/* Avatar */}
                      <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-xs font-black text-white shadow-sm ${
                        rider.isSelf ? "bg-orange-500" : rider.rank <= 3 ? "bg-gradient-to-tr from-yellow-400 to-amber-500" : "bg-slate-400 dark:bg-slate-600"
                      }`}>
                        {rider.name.charAt(0)}
                      </div>

                      {/* User info */}
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-tight truncate max-w-[140px] sm:max-w-none">
                          {rider.name}
                          {rider.isSelf && (
                            <span className="text-[9px] bg-orange-500 text-white font-bold px-1.5 py-0.5 rounded-full ml-1.5">YOU</span>
                          )}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className={`inline-block border text-[8px] font-black px-1.5 py-0.5 rounded ${getBadgeStyle(rider.badge)}`}>
                            {rider.badge}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold">{rider.distance} km</span>
                        </div>
                      </div>
                    </div>

                    {/* Points & Safety score */}
                    <div className="text-right shrink-0">
                      <span className="font-mono text-sm font-black text-slate-800 dark:text-white block">
                        {rider.points.toLocaleString()} pts
                      </span>
                      <span className="text-[9px] font-bold text-slate-400">
                        Safety: {rider.score}/100
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Rank Formula Info Card */}
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800 shadow-lg text-center space-y-2">
          <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            สูตรคำนวณแต้มสะสม
          </p>
          <p className="text-lg font-black text-slate-900 dark:text-white font-mono">
            แต้มสะสม = 100 + (ระยะทาง km × 10) + คะแนนความปลอดภัย
          </p>
          <p className="text-xs text-slate-400 font-semibold">
            ขับขี่ปลอดภัย สวมหมวก ไม่เกิน 80 กม./ชม. เพื่อรักษาคะแนนสูงสุด
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
