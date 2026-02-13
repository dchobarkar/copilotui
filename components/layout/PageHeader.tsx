"use client";

import { PanelLeft } from "lucide-react";

import { useSidebar } from "@/contexts/SidebarContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface PageHeaderProps {
  title: string;
  /** Custom content for the title area (e.g. editable input). When provided, replaces the plain title. */
  children?: React.ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  const { isOpen: sidebarOpen, setOpen: setSidebarOpen } = useSidebar();

  return (
    <header className="flex items-center gap-2 px-4 py-3 border-b border-stone-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm shrink-0">
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className={`p-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 ${!sidebarOpen ? "flex" : "hidden"}`}
        title="Expand sidebar"
      >
        <PanelLeft className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0 flex items-center">
        {children ?? (
          <h1 className="text-sm font-medium text-stone-700 dark:text-slate-300">
            {title}
          </h1>
        )}
      </div>
      <ThemeToggle />
    </header>
  );
}
