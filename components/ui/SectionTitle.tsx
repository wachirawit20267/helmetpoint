export default function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-black text-slate-900 dark:text-white">{children}</h2>
      {subtitle && <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}
