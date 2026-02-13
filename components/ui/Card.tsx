"use client";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
}

const CARD_BASE =
  "rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700";

export function Card({
  children,
  className = "",
  as: Component = "div",
}: CardProps) {
  return (
    <Component className={`${CARD_BASE} ${className}`}>
      {children}
    </Component>
  );
}

interface CardButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function CardButton({
  children,
  onClick,
  className = "",
}: CardButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full block p-4 rounded-lg ${CARD_BASE} hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors text-left ${className}`}
    >
      {children}
    </button>
  );
}
