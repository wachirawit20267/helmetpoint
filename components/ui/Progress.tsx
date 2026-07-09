export default function Progress({ value, max = 100, className = "" }: { value: number; max?: number; className?: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ${className}`}>
      <div
        className="h-full rounded-full bg-orange-500 transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
