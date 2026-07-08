import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Input({
  label,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>

      <input
        className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white ${className}`}
        {...props}
      />
    </div>
  );
}