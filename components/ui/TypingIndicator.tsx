export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700/50 w-fit">
      <div className="flex gap-1">
        <span
          className="w-2 h-2 rounded-full bg-stone-400 dark:bg-slate-400 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-stone-400 dark:bg-slate-400 animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-stone-400 dark:bg-slate-400 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <span className="text-sm text-stone-500 dark:text-slate-400">
        Thinking…
      </span>
    </div>
  );
}
