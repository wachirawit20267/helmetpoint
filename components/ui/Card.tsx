export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900 ${className}`}>
      {children}
    </div>
  );
}
