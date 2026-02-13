"use client";

interface SettingsToggleRowProps {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ROW_BASE =
  "flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 cursor-pointer hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors";

export const SettingsToggleRow = ({
  title,
  description,
  checked,
  onChange,
}: SettingsToggleRowProps) => {
  return (
    <label className={ROW_BASE}>
      <div>
        <p className="text-sm font-medium text-stone-700 dark:text-slate-300">
          {title}
        </p>
        {description && (
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
            {description}
          </p>
        )}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-stone-300 dark:border-slate-600 text-violet-600 focus:ring-violet-500"
      />
    </label>
  );
}
