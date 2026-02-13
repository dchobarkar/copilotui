"use client";

import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  return (
    <div className="rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className="text-sm font-medium text-stone-900 dark:text-slate-100">
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-stone-500 dark:text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="px-4 pb-3 pt-0 text-sm text-stone-600 dark:text-slate-400">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
