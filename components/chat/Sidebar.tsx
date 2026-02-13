"use client";

import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Star,
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

import { SidebarItem } from "./SidebarItem";
import { SidebarUser } from "./SidebarUser";
import type { Conversation } from "@/lib/types";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  searchQuery: string;
  onNewChat: () => string;
  onSelectChat: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onSearchChange: (query: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({
  conversations,
  activeId,
  searchQuery,
  onNewChat,
  onSelectChat,
  onRename,
  onDelete,
  onToggleFavorite,
  onSearchChange,
  isOpen,
  onToggle,
}: SidebarProps) => {
  const router = useRouter();
  const favorites = conversations.filter((c) => c.isFavorite);
  const others = conversations.filter((c) => !c.isFavorite);

  const handleNewChat = () => {
    const newId = onNewChat();
    router.push(`/chat/${newId}`);
    onSelectChat(newId);
  };

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 flex flex-col w-64 bg-white/95 dark:bg-slate-900/95 border-r border-stone-200 dark:border-slate-800 backdrop-blur-sm transition-transform duration-200 ease-out ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0 md:w-0 md:border-r-0 md:overflow-hidden"
        }`}
      >
        <div className="flex items-center justify-between p-3 border-b border-stone-200 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-stone-800 dark:text-slate-200">
            CopilotUI
          </h2>
          <button
            type="button"
            onClick={onToggle}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={handleNewChat}
          className="flex items-center gap-2 mx-3 mt-3 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 dark:bg-violet-600/80 dark:hover:bg-violet-600 text-white text-sm font-medium transition-colors"
          title="New chat (⌘⇧O)"
        >
          <Plus className="w-4 h-4" />
          New chat
        </button>

        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-stone-100 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700/50 text-stone-800 dark:text-slate-200 placeholder-stone-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {favorites.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-stone-500 dark:text-slate-500 uppercase tracking-wider">
                <Star className="w-3.5 h-3.5" />
                Favorites
              </div>
              <div className="space-y-1">
                {favorites.map((conv) => (
                  <SidebarItem
                    key={conv.id}
                    id={conv.id}
                    title={conv.title}
                    isActive={conv.id === activeId}
                    isFavorite={conv.isFavorite}
                    onSelect={() => {
                      router.push(`/chat/${conv.id}`);
                      onSelectChat(conv.id);
                    }}
                    onRename={onRename}
                    onDelete={onDelete}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-stone-500 dark:text-slate-500 uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" />
              History
            </div>
            <div className="space-y-1">
              {others.map((conv) => (
                <SidebarItem
                  key={conv.id}
                  id={conv.id}
                  title={conv.title}
                  isActive={conv.id === activeId}
                  isFavorite={conv.isFavorite}
                    onSelect={() => {
                      router.push(`/chat/${conv.id}`);
                      onSelectChat(conv.id);
                    }}
                  onRename={onRename}
                  onDelete={onDelete}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </div>

          {conversations.length === 0 && (
            <div className="py-8 px-4 text-center">
              <p className="text-sm text-stone-500 dark:text-slate-500 mb-3">
                No conversations yet
              </p>
              <button
                type="button"
                onClick={handleNewChat}
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium"
              >
                Start your first chat
              </button>
            </div>
          )}
        </div>

        <SidebarUser />
      </aside>
    </>
  );
}
