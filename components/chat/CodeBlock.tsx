"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ghcolors } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";
import { LANGUAGE_MAP } from "@/data/codeBlock";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "text" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const lang = LANGUAGE_MAP[language] ?? language;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg border border-stone-200 dark:border-slate-700/50 bg-stone-50 dark:bg-slate-900/80 my-3 overflow-hidden" style={{ width: "100%", maxWidth: "100%" }}>
      <div className="flex items-center justify-between px-3 py-2 bg-stone-100 dark:bg-slate-800/80 border-b border-stone-200 dark:border-slate-700/50 min-w-0 shrink-0">
        <span className="text-xs font-medium text-stone-500 dark:text-slate-400 uppercase tracking-wider truncate min-w-0">
          {lang}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-700/50 transition-colors shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="code-block-scroll">
        <SyntaxHighlighter
          language={lang}
          style={isDark ? oneDark : ghcolors}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            minWidth: "min-content",
          }}
          PreTag="pre"
          codeTagProps={{ className: "text-sm" }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
