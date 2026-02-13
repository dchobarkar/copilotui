import { memo, useState, useCallback } from "react";
import type { Message } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { MessageActions } from "./MessageActions";

interface ChatBubbleProps {
  message: Message;
  isStreaming?: boolean;
  streamingContent?: string;
  onRegenerate?: (messageId: string) => void;
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
  onRegenerate,
}: ChatBubbleProps) {
  const isUser = message.role === "user";
  const content =
    isStreaming && streamingContent !== undefined
      ? streamingContent
      : message.content;

  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [content]);

  const handleLike = useCallback(() => {
    setFeedback((prev) => (prev === "like" ? null : "like"));
  }, []);

  const handleDislike = useCallback(() => {
    setFeedback((prev) => (prev === "dislike" ? null : "dislike"));
  }, []);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: "CopilotUI",
      text: content,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } else {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [content]);

  return (
    <div
      className={`group flex gap-3 px-4 py-3 ${!isStreaming ? "animate-fade-in" : ""} ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      <Avatar role={message.role} />
      <div
        className={`flex flex-col w-full max-w-[85%] min-w-0 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`relative rounded-lg px-4 py-2.5 min-w-0 overflow-hidden ${
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
            <div className="prose dark:prose-invert max-w-none min-w-0 overflow-x-hidden">
              <MarkdownRenderer content={content} />
            </div>
          )}
          {!isUser && !isStreaming && (
            <MessageActions
              onCopy={handleCopy}
              copied={copied}
              onRegenerate={onRegenerate ? () => onRegenerate(message.id) : undefined}
              onLike={handleLike}
              onDislike={handleDislike}
              feedback={feedback}
              onShare={handleShare}
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
