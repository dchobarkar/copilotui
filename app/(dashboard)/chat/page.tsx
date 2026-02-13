"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useChatContext } from "@/contexts/ChatContext";

const ChatPage = () => {
  const router = useRouter();
  const { allConversations } = useChatContext();

  useEffect(() => {
    const first = allConversations[0];
    router.replace(first ? `/chat/${first.id}` : "/chat/new");
  }, [allConversations, router]);

  return null;
};

export default ChatPage;
