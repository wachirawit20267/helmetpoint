import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/cards/StatCard";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">

        {/* หัวข้อ */}
        <div>
          <h1 className="text-3xl font-bold text-[#1E3A5F]">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            ยินดีต้อนรับสู่ระบบ HelmetPoint
          </p>
        </div>

        {/* การ์ด */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <StatCard
            title="คะแนนสะสม"
            value="1,250 คะแนน"
            icon={<span className="text-2xl">🏆</span>}
          />

          <StatCard
            title="ระยะทางรวม"
            value="286 km"
            icon={<span className="text-2xl">📍</span>}
            color="bg-blue-500"
          />

          <StatCard
            title="สถานะหมวก"
            value="เชื่อมต่อ"
            icon={<span className="text-2xl">🪖</span>}
            color="bg-green-500"
          />

          <StatCard
            title="แบตเตอรี่"
            value="93%"
            icon={<span className="text-2xl">🔋</span>}
            color="bg-purple-500"
          />

        </div>

      </div>
    </AppLayout>
  );
}