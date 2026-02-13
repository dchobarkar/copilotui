"use client";

import { createContext, useContext } from "react";

import { useChat } from "@/hooks/useChat";

type ChatContextValue = ReturnType<typeof useChat>;

const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useChat();
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
}
