import { memo } from "react";
import type { Message } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { MessageActions } from "./MessageActions";

interface ChatBubbleProps {
  message: Message;
  isStreaming?: boolean;
  streamingContent?: string;
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChatBubbleInner({
  message,
  isStreaming = false,
  streamingContent,
}: ChatBubbleProps) {
  const isUser = message.role === "user";
  const content =
    isStreaming && streamingContent !== undefined
      ? streamingContent
      : message.content;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
  };

  return (
    <div
      className={`group flex gap-3 px-4 py-3 ${!isStreaming ? "animate-fade-in" : ""} ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      <Avatar role={message.role} />
      <div
        className={`flex flex-col max-w-[85%] min-w-0 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`relative rounded-lg px-4 py-2.5 ${
            isUser
              ? "bg-violet-600 text-white dark:bg-slate-700/80 dark:text-slate-100 border border-violet-500/30 dark:border-slate-600/50"
              : "bg-stone-100 dark:bg-linear-to-br dark:from-slate-800/90 dark:to-slate-900/90 text-stone-800 dark:text-slate-200 border border-stone-200 dark:border-slate-700/50 shadow-sm"
          }`}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap wrap-break-word">
              {content}
            </p>
          ) : isStreaming ? (
            <p className="text-sm whitespace-pre-wrap wrap-break-word">
              {content}
            </p>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <MarkdownRenderer content={content} />
            </div>
          )}
          {!isUser && (
            <MessageActions
              onCopy={handleCopy}
              onRegenerate={() => {}}
              onLike={() => {}}
              onDislike={() => {}}
              onShare={() => {}}
            />
          )}
        </div>
        <span className="text-xs text-stone-500 dark:text-slate-500 mt-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

export const ChatBubble = memo(ChatBubbleInner);
