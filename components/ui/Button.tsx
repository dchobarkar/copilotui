"use client";

type ButtonVariant = "primary" | "secondary" | "danger" | "warning" | "ghost" | "outline";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800",
  danger:
    "bg-red-600 hover:bg-red-700 text-white disabled:opacity-50",
  warning:
    "bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50",
  ghost:
    "text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800",
  outline:
    "border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-800",
};

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";
  return (
    <button
      type="button"
      className={`rounded-lg font-medium transition-colors ${sizeClass} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
