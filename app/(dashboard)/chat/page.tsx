"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { PanelLeft } from "lucide-react";

import { useChatContext } from "@/contexts/ChatContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { getMockResponse } from "@/lib/mockResponses";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { TypingIndicator } from "@/components/ui/TypingIndicator";
import { PromptInput } from "@/components/chat/PromptInput";
import { PromptTemplates } from "@/components/chat/PromptTemplates";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const STREAM_SPEED = 25;

function streamText(
  text: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
) {
  const words = text.split(/(\s+)/);
  let i = 0;
  const interval = setInterval(() => {
    if (i >= words.length) {
      clearInterval(interval);
      onComplete();
      return;
    }
    onChunk(words[i] ?? "");
    i++;
  }, STREAM_SPEED);
  return () => clearInterval(interval);
}

export default function ChatPage() {
  const {
    activeId,
    activeConversation,
    setActiveId,
    startNewChat,
    addMessage,
  } = useChatContext();
  const { isOpen: sidebarOpen, setOpen: setSidebarOpen } = useSidebar();

  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const [streamingContent, setStreamingContent] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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
  }, []);

  const messages = activeConversation?.messages ?? [];
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

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages.length, streamingContent, scrollToBottom]);

  const handleSend = useCallback(
    (text: string) => {
      const convId = activeId ?? startNewChat();
      if (!activeId) setActiveId(convId);

      addMessage("user", text, convId);

      const mockResponse = getMockResponse();
      const tempId = `msg-stream-${Date.now()}`;
      setStreamingMessageId(tempId);
      setStreamingContent("");

      streamText(
        mockResponse,
        (chunk) => setStreamingContent((prev) => prev + chunk),
        () => {
          addMessage("assistant", mockResponse, convId);
          setStreamingMessageId(null);
          setStreamingContent("");
        },
      );
    },
    [activeId, startNewChat, setActiveId, addMessage],
  );

  return (
    <>
      <header className="flex items-center gap-2 px-4 py-3 border-b border-stone-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm shrink-0">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className={`p-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 ${!sidebarOpen ? "flex" : "hidden"}`}
          title="Expand sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-sm font-medium text-stone-700 dark:text-slate-300 truncate">
          {activeConversation?.title ?? "New chat"}
        </h1>
        <ThemeToggle />
      </header>

      <div ref={listRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-3xl mx-auto py-6">
          {displayMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] px-4">
              <p className="text-stone-500 dark:text-slate-500 text-sm mb-4">
                Start a conversation or try a prompt:
              </p>
              <PromptTemplates onSelect={handleSend} />
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
                    msg.id === streamingMessageId
                      ? streamingContent
                      : undefined
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
            onSubmit={handleSend}
            disabled={!!streamingMessageId}
            placeholder="Message CopilotUI…"
          />
        </div>
      </div>
    </>
  );
}
