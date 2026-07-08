import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
};

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-xl px-6 py-3 font-semibold transition-all duration-300",
        {
          "bg-orange-500 text-white hover:bg-orange-600":
            variant === "primary",

          "bg-slate-900 text-white hover:bg-slate-800":
            variant === "secondary",

          "border border-orange-500 text-orange-500 hover:bg-orange-50":
            variant === "outline",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}