"use client";

import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Send, Paperclip, X } from "lucide-react";

interface PromptInputProps {
  onSubmit: (value: string, files?: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
  showCharacterCount?: boolean;
  maxLength?: number;
  /** Renders next to the send button (e.g. "Stop generating" during streaming) */
  endAction?: React.ReactNode;
}

export interface PromptInputHandle {
  addFiles: (files: FileList | File[]) => void;
}

// eslint-disable-next-line react/display-name
const PromptInput = forwardRef<PromptInputHandle, PromptInputProps>(
  (
    {
      onSubmit,
      disabled = false,
      placeholder = "Message CopilotUI…",
      showCharacterCount = false,
      maxLength = 4000,
      endAction,
    },
    ref,
  ) => {
    const [value, setValue] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      addFiles: (newFiles: FileList | File[]) => {
        const list = Array.from(newFiles);
        setFiles((prev) => [...prev, ...list].slice(0, 5));
      },
    }));

    useEffect(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }, [value]);

    const handleSubmit = () => {
      const trimmed = value.trim();
      if ((!trimmed && files.length === 0) || disabled) return;
      onSubmit(trimmed || "", files.length > 0 ? files : undefined);
      setValue("");
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const canSubmit =
      (value.trim().length > 0 || files.length > 0) && !disabled;

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    const addFiles = (newFiles: FileList | File[]) => {
      const list = Array.from(newFiles);
      setFiles((prev) => [...prev, ...list].slice(0, 5));
    };

    const removeFile = (index: number) => {
      setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handlePaperclipClick = () => {
      if (disabled) return;
      fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files;
      if (selected) addFiles(selected);
      e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    };

    return (
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.md,.json,.csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          className={`flex flex-col gap-2 rounded-xl border bg-white dark:bg-slate-800/60 backdrop-blur-sm transition-colors ${
            isDragging
              ? "border-violet-500/50 bg-violet-50/80 dark:bg-slate-800/80"
              : "border-stone-200 dark:border-slate-700/50 hover:border-stone-300 dark:hover:border-slate-600/50"
          }`}
        >
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 px-3 pt-2">
              {files.map((file, i) => (
                <span
                  key={`${file.name}-${i}`}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-stone-100 dark:bg-slate-700/60 text-stone-700 dark:text-slate-300 text-xs"
                >
                  <span className="truncate max-w-30">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="p-0.5 rounded hover:bg-stone-200 dark:hover:bg-slate-600 text-stone-500 dark:text-slate-400"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 py-2 px-3">
            <button
              type="button"
              onClick={handlePaperclipClick}
              disabled={disabled}
              className="flex items-center justify-center p-2 rounded-lg text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-700/50 disabled:opacity-50 transition-colors shrink-0 size-10"
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
              onDrop={handleDrop}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className="flex-1 resize-none bg-transparent px-4 py-2 text-stone-900 dark:text-slate-100 placeholder-stone-400 dark:placeholder-slate-500 focus:outline-none text-sm min-h-11 max-h-50 leading-normal self-center"
            />
            {endAction}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex items-center justify-center p-2 rounded-lg text-stone-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-stone-100 dark:hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-stone-400 dark:disabled:hover:text-slate-400 transition-colors shrink-0 size-10"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        {showCharacterCount && value.length > 0 && (
          <span className="absolute bottom-1 right-1 text-xs text-stone-500 dark:text-slate-500">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    );
  },
);

export default PromptInput;
