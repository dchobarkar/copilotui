"use client";

import { useState } from "react";

import { ChatProvider, useChatContext } from "@/contexts/ChatContext";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Sidebar } from "@/components/chat/Sidebar";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
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

  return (
    <div className="flex h-screen bg-stone-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
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
            if (deletePendingId) deleteConversation(deletePendingId);
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
    <ChatProvider>
      <SidebarProvider>
        <DashboardLayoutInner>{children}</DashboardLayoutInner>
      </SidebarProvider>
    </ChatProvider>
  );
}
