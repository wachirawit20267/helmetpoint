import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Checkbox({
  children,
  ...props
}: Props) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        className="h-5 w-5 rounded border-slate-300 accent-orange-500"
        {...props}
      />

      <span className="text-sm text-slate-600 dark:text-slate-300">
        {children}
      </span>
    </label>
  );
}