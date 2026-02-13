import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "./CodeBlock";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className ?? "");
            const code = String(children).replace(/\n$/, "");
            return match ? (
              <CodeBlock code={code} language={match[1]} />
            ) : (
              <code
                className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-slate-300 text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline"
              >
                {children}
              </a>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mt-4 mb-2 text-stone-900 dark:text-slate-100">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mt-3 mb-2 text-stone-900 dark:text-slate-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold mt-2 mb-1 text-stone-800 dark:text-slate-200">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-2 text-stone-700 dark:text-slate-300 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside my-2 space-y-1 text-stone-700 dark:text-slate-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside my-2 space-y-1 text-stone-700 dark:text-slate-300">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="ml-2">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-stone-800 dark:text-slate-200">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-stone-700 dark:text-slate-300">
              {children}
            </em>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full border border-stone-200 dark:border-slate-700 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-stone-100 dark:bg-slate-800">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-stone-200 dark:divide-slate-700">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-stone-200 dark:border-slate-700">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-sm font-medium text-stone-800 dark:text-slate-200 border-stone-200 dark:border-slate-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-sm text-stone-700 dark:text-slate-300 border-stone-200 dark:border-slate-700">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
