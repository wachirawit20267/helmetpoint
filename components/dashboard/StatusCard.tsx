type StatusCardProps = {
  title: string;
  value: string;
  color?: "green" | "blue" | "orange" | "red";
};

export default function StatusCard({
  title,
  value,
  color = "green",
}: StatusCardProps) {
  const colors = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>

        <div
          className={`h-4 w-4 rounded-full ${colors[color]}`}
        />
      </div>
    </div>
  );
}