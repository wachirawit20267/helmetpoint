interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  color = "bg-orange-500",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="flex justify-between items-center">

        <div>
          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${color}`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}