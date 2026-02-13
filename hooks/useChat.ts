"use client";

import { useState, useCallback } from "react";

import { mockConversations } from "@/data/conversations";
import { generateUUID } from "@/lib/uuid";
import type { Conversation, Message } from "@/lib/types";

export function useChat() {
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const [activeId, setActiveId] = useState<string | null>(
    mockConversations[0]?.id ?? null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const activeConversation = conversations.find((c) => c.id === activeId);

  const startNewChat = useCallback(() => {
    let newId: string;
    do {
      newId = generateUUID();
    } while (conversations.some((c) => c.id === newId));
    const newConversation: Conversation = {
      id: newId,
      title: "New chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false,
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveId(newId);
    return newId;
  }, [conversations]);

  const addMessage = useCallback(
    (
      role: Message["role"],
      content: string,
      targetId?: string | null,
      options?: { messageId?: string },
    ) => {
      const id = targetId ?? activeId;
      if (!id) return;

      const newMessage: Message = {
        id: options?.messageId ?? generateUUID(),
        role,
        content,
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                messages: [...c.messages, newMessage],
                updatedAt: new Date(),
                title:
                  c.messages.length === 0 && role === "user"
                    ? content.slice(0, 50) + (content.length > 50 ? "…" : "")
                    : c.title,
              }
            : c,
        ),
      );

      return newMessage;
    },
    [activeId],
  );

  const removeMessage = useCallback(
    (messageId: string, conversationId?: string | null) => {
      const targetId = conversationId ?? activeId;
      if (!targetId) return;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetId
            ? {
                ...c,
                messages: c.messages.filter((m) => m.id !== messageId),
                updatedAt: new Date(),
              }
            : c,
        ),
      );
    },
    [activeId],
  );

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) {
        const remaining = conversations.filter((c) => c.id !== id);
        setActiveId(remaining[0]?.id ?? null);
      }
    },
    [activeId, conversations],
  );

  const renameConversation = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, title, updatedAt: new Date() } : c,
      ),
    );
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c)),
    );
  }, []);

  const clearAllConversations = useCallback(() => {
    setConversations([]);
    setActiveId(null);
  }, []);

  const filteredConversations = searchQuery
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : conversations;

  return {
    conversations: filteredConversations,
    allConversations: conversations,
    activeId,
    activeConversation,
    setActiveId,
    startNewChat,
    addMessage,
    removeMessage,
    deleteConversation,
    renameConversation,
    toggleFavorite,
    clearAllConversations,
    searchQuery,
    setSearchQuery,
  };
}
