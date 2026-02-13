import { memo, useState, useCallback } from "react";

import type { Message } from "@/lib/types";
import Avatar from "@/components/ui/Avatar";
import MarkdownRenderer from "./MarkdownRenderer";
import MessageActions from "./MessageActions";

interface ChatBubbleProps {
  message: Message;
  isStreaming?: boolean;
  streamingContent?: string;
  onRegenerate?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onEditAndRegenerate?: (messageId: string, newContent: string) => void;
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatBubbleInner = ({
  message,
  isStreaming = false,
  streamingContent,
  onRegenerate,
  onDelete,
  onEdit,
  onEditAndRegenerate,
}: ChatBubbleProps) => {
  const isUser = message.role === "user";
  const content =
    isStreaming && streamingContent !== undefined
      ? streamingContent
      : message.content;

  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);

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

  const handleEditSubmit = useCallback(
    (andRegenerate = false) => {
      const trimmed = editValue.trim();
      if (!trimmed) {
        setEditValue(message.content);
        setIsEditing(false);
        return;
      }
      if (andRegenerate && onEditAndRegenerate) {
        onEditAndRegenerate(message.id, trimmed);
      } else if (trimmed !== message.content && onEdit) {
        onEdit(message.id, trimmed);
      } else {
        setEditValue(message.content);
      }
      setIsEditing(false);
    },
    [editValue, message.content, message.id, onEdit, onEditAndRegenerate],
  );

  const handleEditStart = useCallback(() => {
    setEditValue(message.content);
    setIsEditing(true);
  }, [message.content]);

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
        className={`flex flex-col w-full min-w-0 ${
          isUser && isEditing
            ? "max-w-[95%] min-w-[min(400px,95%)]"
            : "max-w-[85%]"
        } ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`relative rounded-lg px-4 py-2.5 min-w-0 overflow-hidden ${
            isUser
              ? "bg-violet-600 text-white dark:bg-slate-700/80 dark:text-slate-100 border border-violet-500/30 dark:border-slate-600/50"
              : "bg-stone-100 dark:bg-linear-to-br dark:from-slate-800/90 dark:to-slate-900/90 text-stone-800 dark:text-slate-200 border border-stone-200 dark:border-slate-700/50 shadow-sm"
          }`}
        >
          {isUser ? (
            isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleEditSubmit(true);
                    }
                    if (e.key === "Escape") {
                      setEditValue(message.content);
                      setIsEditing(false);
                    }
                  }}
                  className="w-full min-h-50 min-w-[320px] px-3 py-2 rounded bg-white/10 dark:bg-slate-800/50 border border-white/20 dark:border-slate-600/50 text-sm text-inherit placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30 resize-y"
                  placeholder="Edit message..."
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditSubmit(true)}
                    className="px-2 py-1 rounded text-xs bg-white/20 hover:bg-white/30"
                  >
                    Save & regenerate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditValue(message.content);
                      setIsEditing(false);
                    }}
                    className="px-2 py-1 rounded text-xs text-white/80 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap wrap-break-word">
                {content}
              </p>
            )
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
              onRegenerate={
                onRegenerate ? () => onRegenerate(message.id) : undefined
              }
              onLike={handleLike}
              onDislike={handleDislike}
              feedback={feedback}
              onShare={handleShare}
              onDelete={onDelete ? () => onDelete(message.id) : undefined}
            />
          )}
          {isUser && !isEditing && (
            <MessageActions
              onCopy={handleCopy}
              copied={copied}
              onEdit={onEdit ? handleEditStart : undefined}
              onDelete={onDelete ? () => onDelete(message.id) : undefined}
            />
          )}
        </div>
        <span className="text-xs text-stone-500 dark:text-slate-500 mt-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export const ChatBubble = memo(ChatBubbleInner);
