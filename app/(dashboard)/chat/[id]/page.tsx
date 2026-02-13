"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { useChatContext } from "@/contexts/ChatContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useUser } from "@/contexts/UserContext";
import { THINKING_DELAY_MS, STREAM_SPEED_MS } from "@/data/chat";
import { getMockResponse } from "@/lib/mockResponses";
import { streamText } from "@/lib/streamText";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { TypingIndicator } from "@/components/ui/TypingIndicator";
import { PromptInput } from "@/components/chat/PromptInput";
import { PromptTemplates } from "@/components/chat/PromptTemplates";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ChatIdPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const convId = id === "new" ? null : id;

  const {
    conversations: allConversations,
    setActiveId,
    startNewChat,
    addMessage,
    updateMessage,
    removeMessage,
    removeMessagesAfter,
    renameConversation,
  } = useChatContext();
  const { setOpen: setSidebarOpen } = useSidebar();
  const { user } = useUser();

  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const [streamingContent, setStreamingContent] = useState("");
  const streamAbortRef = useRef<(() => void) | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const promptInputRef = useRef<{ addFiles: (files: FileList | File[]) => void }>(null);

  // Sync URL id with chat context
  useEffect(() => {
    if (id && id !== "new") {
      setActiveId(id);
    }
  }, [id, setActiveId]);

  // Clear streaming state when switching to a different existing conversation (not when creating new)
  const prevConvIdForClearRef = useRef<string | null>(convId);
  useEffect(() => {
    const prev = prevConvIdForClearRef.current;
    prevConvIdForClearRef.current = convId;
    if (prev != null && convId != null && prev !== convId) {
      streamAbortRef.current?.();
      setStreamingMessageId(null);
      setStreamingContent("");
      streamAbortRef.current = null;
    }
  }, [convId]);

  // Redirect if conversation doesn't exist (e.g. deleted)
  useEffect(() => {
    if (id && id !== "new") {
      const exists = allConversations.some((c) => c.id === id);
      if (!exists) {
        const first = allConversations[0];
        router.replace(first ? `/chat/${first.id}` : "/chat/new");
      }
    }
  }, [id, allConversations, router]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes("Files")) setIsDraggingFile(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node))
      setIsDraggingFile(false);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files?.length) {
      promptInputRef.current?.addFiles(e.dataTransfer.files);
    }
  }, []);

  // Use URL id as source of truth for displayed conversation (avoids flash of wrong content when switching)
  const currentConversation =
    id === "new" ? null : allConversations.find((c) => c.id === id);
  const messages = currentConversation?.messages ?? [];
  const displayMessages = streamingMessageId
    ? [
        ...messages,
        {
          id: streamingMessageId,
          role: "assistant" as const,
          content: streamingContent,
          timestamp: new Date(),
        },
      ]
    : messages;

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  const prevConvIdRef = useRef<string | null>(convId);

  // Scroll when messages change. When switching conversations: defer scroll until after new content paints.
  useEffect(() => {
    if (displayMessages.length === 0) return;
    const prev = prevConvIdRef.current;
    const isSwitching = prev != null && convId != null && prev !== convId;
    prevConvIdRef.current = convId;

    if (isSwitching) {
      // Defer scroll until DOM has new content - avoids jarring scroll of old content
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = listRef.current;
          if (el) {
            el.scrollTop = el.scrollHeight;
          } else {
            scrollToBottom(false);
          }
        });
      });
    } else {
      scrollToBottom(true);
    }
  }, [displayMessages.length, streamingMessageId, convId, scrollToBottom]);

  // Keyboard shortcut: Cmd/Ctrl+Shift+O for new chat
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "O") {
        e.preventDefault();
        const newId = startNewChat();
        router.replace(`/chat/${newId}`);
        setActiveId(newId);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [startNewChat, router, setActiveId]);

  const handleSend = useCallback(
    (text: string, files?: File[]) => {
      let targetId = convId;
      if (!targetId) {
        const newId = startNewChat();
        router.replace(`/chat/${newId}`);
        targetId = newId;
      }

      const fileSuffix =
        files && files.length > 0
          ? `\n\n[Attached: ${files.map((f) => f.name).join(", ")}]`
          : "";
      const messageContent = (text || "Sent with attachments") + fileSuffix;

      addMessage("user", messageContent, targetId);

      const promptForMock =
        text ||
        (files?.length
          ? `User attached ${files.length} file(s): ${files.map((f) => f.name).join(", ")}`
          : "What can you help with?");
      const mockResponse = getMockResponse(promptForMock);
      const tempId = `stream-${Date.now()}`;
      streamAbortRef.current?.();
      setStreamingMessageId(tempId);
      setStreamingContent("");

      // Thinking… then word-by-word streaming (plain text during stream = no flicker)
      setTimeout(() => {
        const cleanup = streamText(
          mockResponse,
          (chunk) => setStreamingContent((prev) => prev + chunk),
          () => {
            addMessage("assistant", mockResponse, targetId, {
              messageId: tempId,
            });
            setStreamingMessageId(null);
            setStreamingContent("");
            streamAbortRef.current = null;
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          },
          STREAM_SPEED_MS,
        );
        streamAbortRef.current = cleanup;
      }, THINKING_DELAY_MS);
    },
    [convId, startNewChat, addMessage, router],
  );

  const handleRegenerate = useCallback(
    (messageId: string) => {
      if (!convId || !currentConversation || streamingMessageId) return;
      const msgs = currentConversation.messages;
      const idx = msgs.findIndex((m) => m.id === messageId);
      if (idx < 0 || msgs[idx]?.role !== "assistant") return;
      const prevUser = msgs
        .slice(0, idx)
        .reverse()
        .find((m) => m.role === "user");
      if (!prevUser) return;
      removeMessage(messageId, convId);
      streamAbortRef.current?.();
      const prompt = prevUser.content.replace(/\n\n\[Attached:[\s\S]*\]\s*$/, "").trim();
      const mockResponse = getMockResponse(prompt || "What can you help with?");
      const tempId = `stream-${Date.now()}`;
      setStreamingMessageId(tempId);
      setStreamingContent("");
      setTimeout(() => {
        const cleanup = streamText(
          mockResponse,
          (chunk) => setStreamingContent((prev) => prev + chunk),
          () => {
            addMessage("assistant", mockResponse, convId, {
              messageId: tempId,
            });
            setStreamingMessageId(null);
            setStreamingContent("");
            streamAbortRef.current = null;
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          },
          STREAM_SPEED_MS,
        );
        streamAbortRef.current = cleanup;
      }, THINKING_DELAY_MS);
    },
    [convId, currentConversation, streamingMessageId, removeMessage, addMessage],
  );

  const handleDeleteMessage = useCallback(
    (messageId: string) => {
      if (!convId || streamingMessageId) return;
      removeMessage(messageId, convId);
    },
    [convId, streamingMessageId, removeMessage],
  );

  const handleEditMessage = useCallback(
    (messageId: string, newContent: string) => {
      if (!convId) return;
      updateMessage(messageId, newContent, convId);
    },
    [convId, updateMessage],
  );

  const handleEditAndRegenerate = useCallback(
    (messageId: string, newContent: string) => {
      if (!convId || !currentConversation || streamingMessageId) return;
      updateMessage(messageId, newContent, convId);
      removeMessagesAfter(messageId, convId);
      const prompt = newContent.replace(/\n\n\[Attached:[\s\S]*\]\s*$/, "").trim();
      const mockResponse = getMockResponse(prompt || "What can you help with?");
      const tempId = `stream-${Date.now()}`;
      setStreamingMessageId(tempId);
      setStreamingContent("");
      setTimeout(() => {
        streamAbortRef.current?.();
        const cleanup = streamText(
          mockResponse,
          (chunk) => setStreamingContent((prev) => prev + chunk),
          () => {
            addMessage("assistant", mockResponse, convId, {
              messageId: tempId,
            });
            setStreamingMessageId(null);
            setStreamingContent("");
            streamAbortRef.current = null;
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          },
          STREAM_SPEED_MS,
        );
        streamAbortRef.current = cleanup;
      }, THINKING_DELAY_MS);
    },
    [convId, currentConversation, streamingMessageId, updateMessage, removeMessagesAfter, addMessage],
  );

  const handleStopGeneration = useCallback(() => {
    streamAbortRef.current?.();
    if (streamingMessageId && streamingContent && convId) {
      addMessage("assistant", streamingContent, convId, {
        messageId: streamingMessageId,
      });
    }
    setStreamingMessageId(null);
    setStreamingContent("");
    streamAbortRef.current = null;
  }, [streamingMessageId, streamingContent, convId, addMessage]);

  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState("");

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const check = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setShowScrollToBottom(scrollHeight - scrollTop - clientHeight > 100);
    };
    el.addEventListener("scroll", check, { passive: true });
    check();
    return () => el.removeEventListener("scroll", check);
  }, [displayMessages.length]);

  const displayTitle =
    id === "new" ? "New chat" : (currentConversation?.title ?? "New chat");

  const handleTitleEditStart = () => {
    if (id === "new" || !convId) return;
    setEditTitleValue(displayTitle);
    setIsEditingTitle(true);
  };

  const handleTitleEditSubmit = () => {
    const trimmed = editTitleValue.trim();
    if (trimmed && convId) {
      renameConversation(convId, trimmed);
    }
    setIsEditingTitle(false);
  };

  return (
    <>
      <PageHeader
        title={displayTitle}
        children={
          isEditingTitle && convId ? (
            <input
              type="text"
              value={editTitleValue}
              onChange={(e) => setEditTitleValue(e.target.value)}
              onBlur={handleTitleEditSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleEditSubmit();
                if (e.key === "Escape") {
                  setEditTitleValue(displayTitle);
                  setIsEditingTitle(false);
                }
              }}
              className="w-full bg-transparent border-b border-violet-500/50 text-sm font-medium text-stone-700 dark:text-slate-300 focus:outline-none py-0.5"
              autoFocus
            />
          ) : (
            <button
              type="button"
              onClick={handleTitleEditStart}
              className="text-left w-full truncate text-sm font-medium text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-slate-100 transition-colors"
            >
              {displayTitle}
            </button>
          )
        }
      />

      <div className="flex-1 min-h-0 min-w-0 relative">
        <div
          ref={listRef}
          className="h-full min-h-0 overflow-y-auto overflow-x-hidden"
        >
          <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 min-w-0 w-full">
          {displayMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] px-4">
              <p className="text-stone-700 dark:text-slate-300 text-base font-medium mb-1">
                {user.name
                  ? `Hi ${user.name.split(" ")[0]}, what can I help you with?`
                  : "What can I help you with?"}
              </p>
              <p className="text-stone-500 dark:text-slate-500 text-sm mb-4">
                Start a conversation or try a prompt:
              </p>
              <PromptTemplates onSelect={handleSend} />
              <p className="mt-6 text-xs text-stone-400 dark:text-slate-500">
                Simulated responses · Concept demo
              </p>
            </div>
          ) : (
            <>
              {displayMessages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  isStreaming={
                    msg.id === streamingMessageId && msg.role === "assistant"
                  }
                  streamingContent={
                    msg.id === streamingMessageId ? streamingContent : undefined
                  }
                  onRegenerate={
                    msg.role === "assistant" ? handleRegenerate : undefined
                  }
                  onDelete={handleDeleteMessage}
                  onEdit={
                    msg.role === "user" ? handleEditMessage : undefined
                  }
                  onEditAndRegenerate={
                    msg.role === "user" ? handleEditAndRegenerate : undefined
                  }
                />
              ))}
              {streamingMessageId && !streamingContent && (
                <div className="flex gap-3 px-4 py-3 animate-fade-in">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center" />
                  <div className="flex items-center">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
          </div>
        </div>
        {showScrollToBottom && (
          <button
            type="button"
            onClick={() => scrollToBottom()}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-stone-200/90 dark:bg-slate-700/90 hover:bg-stone-300 dark:hover:bg-slate-600 text-stone-700 dark:text-slate-200 text-sm font-medium shadow-lg transition-colors z-10"
          >
            Scroll to bottom
          </button>
        )}
      </div>

      <div
        className="shrink-0 border-t border-stone-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/30 backdrop-blur-sm px-4 py-4"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="max-w-3xl mx-auto">
          {isDraggingFile && (
            <div className="mb-3 px-4 py-3 rounded-lg border-2 border-dashed border-violet-500/50 bg-violet-500/10 text-center text-sm text-stone-600 dark:text-slate-300">
              Drop files here
            </div>
          )}
          <PromptInput
            ref={promptInputRef}
            onSubmit={handleSend}
            disabled={!!streamingMessageId}
            placeholder="Message CopilotUI…"
            endAction={
              streamingMessageId ? (
                <button
                  type="button"
                  onClick={handleStopGeneration}
                  className="flex items-center justify-center shrink-0 px-3 py-2 rounded-lg text-xs font-medium bg-red-500/90 hover:bg-red-600 text-white transition-colors"
                >
                  Stop generating
                </button>
              ) : undefined
            }
          />
          <p className="mt-2 text-center text-xs text-stone-400 dark:text-slate-500">
            Simulated responses · No LLM
          </p>
        </div>
      </div>
    </>
  );
}
