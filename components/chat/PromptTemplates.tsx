import { PROMPT_TEMPLATES } from "@/data/promptTemplates";

interface PromptTemplatesProps {
  onSelect: (text: string) => void;
  className?: string;
}

export function PromptTemplates({
  onSelect,
  className = "",
}: PromptTemplatesProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {PROMPT_TEMPLATES.map((template) => (
        <button
          key={template}
          type="button"
          onClick={() => onSelect(template)}
          className="px-3 py-1.5 rounded-lg text-sm text-stone-600 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-700/50 border border-stone-200 dark:border-slate-700/50 hover:border-stone-300 dark:hover:border-slate-600/50 transition-colors"
        >
          {template}
        </button>
      ))}
    </div>
  );
}
