"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PanelLeft } from "lucide-react";

import { useChatContext } from "@/contexts/ChatContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useUser } from "@/contexts/UserContext";
import { getMockResponse } from "@/lib/mockResponses";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { TypingIndicator } from "@/components/ui/TypingIndicator";
import { PromptInput } from "@/components/chat/PromptInput";
import { PromptTemplates } from "@/components/chat/PromptTemplates";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const STREAM_SPEED = 25;
const THINKING_DELAY_MS = 400;

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

export default function ChatIdPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    conversations: allConversations,
    activeConversation,
    setActiveId,
    startNewChat,
    addMessage,
  } = useChatContext();
  const { isOpen: sidebarOpen, setOpen: setSidebarOpen } = useSidebar();
  const { user } = useUser();

  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const [streamingContent, setStreamingContent] = useState("");
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

  const convId = id === "new" ? null : id;
  const messages = (id === "new" ? null : activeConversation)?.messages ?? [];
  const displayMessages =
    streamingMessageId && streamingContent
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

  const scrollToBottom = useCallback((instant = false) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: instant ? "auto" : "smooth",
    });
  }, []);

  const lastScrollRef = useRef(0);
  const SCROLL_THROTTLE_MS = 80;

  useEffect(() => {
    if (displayMessages.length === 0) return;
    const isStreaming = !!streamingMessageId;
    if (isStreaming) {
      const now = Date.now();
      if (now - lastScrollRef.current >= SCROLL_THROTTLE_MS) {
        lastScrollRef.current = now;
        requestAnimationFrame(() => scrollToBottom(true));
      }
    } else {
      scrollToBottom(false);
    }
  }, [displayMessages.length, streamingContent, streamingMessageId, scrollToBottom]);

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
      const tempId = `msg-stream-${Date.now()}`;
      setStreamingMessageId(tempId);
      setStreamingContent("");

      // Show "Thinking…" for a moment before streaming starts
      setTimeout(() => {
        streamText(
          mockResponse,
          (chunk) => setStreamingContent((prev) => prev + chunk),
          () => {
            addMessage("assistant", mockResponse, targetId);
            setStreamingMessageId(null);
            setStreamingContent("");
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          },
        );
      }, THINKING_DELAY_MS);
    },
    [convId, startNewChat, addMessage, router],
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
          {id === "new"
            ? "New chat"
            : (activeConversation?.title ?? "New chat")}
        </h1>
        <ThemeToggle />
      </header>

      <div ref={listRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-3xl mx-auto py-6">
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
            ref={promptInputRef}
            onSubmit={handleSend}
            disabled={!!streamingMessageId}
            placeholder="Message CopilotUI…"
          />
          <p className="mt-2 text-center text-xs text-stone-400 dark:text-slate-500">
            Simulated responses · No LLM
          </p>
        </div>
      </div>
    </>
  );
}
