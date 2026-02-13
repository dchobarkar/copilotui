"use client";

interface SpinnerProps {
  size?: "sm" | "md";
  className?: string;
}

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizeClass = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  return (
    <div
      className={`${sizeClass} border-2 border-stone-300 dark:border-slate-600 border-t-violet-600 rounded-full animate-spin ${className}`}
      aria-label="Loading"
    />
  );
}
