"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ChatProvider, useChatContext } from "@/contexts/ChatContext";
import { UserProvider } from "@/contexts/UserContext";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Sidebar } from "@/components/chat/Sidebar";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      router.replace("/logged-out");
    }
  }, [isSignedIn, isLoading, router]);
  const urlChatId =
    pathname?.match(/^\/chat\/([^/]+)$/)?.[1] ?? null;

  const {
    conversations,
    activeId,
    setActiveId,
    startNewChat,
    deleteConversation,
    renameConversation,
    toggleFavorite,
    searchQuery,
    setSearchQuery,
  } = useChatContext();

  const { isOpen: sidebarOpen, setOpen: setSidebarOpen, toggle } = useSidebar();
  const isMobile = useIsMobile();
  const [deletePendingId, setDeletePendingId] = useState<string | null>(null);

  // Use URL as source of truth for active chat
  const activeIdFromUrl =
    urlChatId && urlChatId !== "new" ? urlChatId : null;

  if (!isLoading && !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-2 border-stone-300 dark:border-slate-600 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-stone-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeId={activeIdFromUrl}
        searchQuery={searchQuery}
        onNewChat={startNewChat}
        onSelectChat={(id) => {
          setActiveId(id);
          if (isMobile) setSidebarOpen(false);
        }}
        onRename={renameConversation}
        onDelete={(id) => setDeletePendingId(id)}
        onToggleFavorite={toggleFavorite}
        onSearchChange={setSearchQuery}
        isOpen={sidebarOpen}
        onToggle={toggle}
      />

      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {children}
      </main>

      {deletePendingId && (
        <ConfirmDeleteModal
          title={
            conversations.find((c) => c.id === deletePendingId)?.title ??
            "Untitled"
          }
          onConfirm={() => {
            if (deletePendingId) {
              const remaining = conversations.filter(
                (c) => c.id !== deletePendingId,
              );
              const nextId = remaining[0]?.id ?? "new";
              router.push(`/chat/${nextId}`);
              deleteConversation(deletePendingId);
            }
            setDeletePendingId(null);
          }}
          onCancel={() => setDeletePendingId(null)}
        />
      )}
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <ChatProvider>
        <SidebarProvider>
          <DashboardLayoutInner>{children}</DashboardLayoutInner>
        </SidebarProvider>
      </ChatProvider>
    </UserProvider>
  );
}
