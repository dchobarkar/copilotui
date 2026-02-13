"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";

interface PromptInputProps {
  onSubmit: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  showCharacterCount?: boolean;
  maxLength?: number;
}

export function PromptInput({
  onSubmit,
  disabled = false,
  placeholder = "Message CopilotUI…",
  showCharacterCount = false,
  maxLength = 4000,
}: PromptInputProps) {
  const [value, setValue] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative">
      <div
        className={`flex items-end gap-2 rounded-xl border bg-white dark:bg-slate-800/60 backdrop-blur-sm transition-colors ${
          isDragging
            ? "border-violet-500/50 bg-violet-50/80 dark:bg-slate-800/80"
            : "border-stone-200 dark:border-slate-700/50 hover:border-stone-300 dark:hover:border-slate-600/50"
        }`}
      >
        <button
          type="button"
          className="p-2 rounded-lg text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-700/50 transition-colors shrink-0"
          title="Attach file"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            // File upload UI only - no processing
          }}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent px-4 py-3 text-stone-900 dark:text-slate-100 placeholder-stone-400 dark:placeholder-slate-500 focus:outline-none text-sm min-h-11 max-h-50"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          className="p-2 rounded-lg text-stone-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-stone-100 dark:hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-stone-400 dark:disabled:hover:text-slate-400 transition-colors shrink-0"
          title="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      {showCharacterCount && value.length > 0 && (
        <span className="absolute bottom-1 right-1 text-xs text-stone-500 dark:text-slate-500">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}
