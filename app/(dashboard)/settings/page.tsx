"use client";

import { PanelLeft } from "lucide-react";
import Link from "next/link";

import { useSidebar } from "@/contexts/SidebarContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function SettingsPage() {
  const { isOpen: sidebarOpen, setOpen: setSidebarOpen } = useSidebar();

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
        <h1 className="flex-1 text-sm font-medium text-stone-700 dark:text-slate-300">
          Settings
        </h1>
        <ThemeToggle />
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto py-8 px-4">
          <div className="space-y-6">
            <section>
              <h2 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-3">
                Appearance
              </h2>
              <div className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700">
                <span className="text-sm text-stone-700 dark:text-slate-300">
                  Theme
                </span>
                <ThemeToggle />
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-3">
                Notifications
              </h2>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 cursor-pointer">
                  <span className="text-sm text-stone-700 dark:text-slate-300">
                    Email notifications
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-stone-300 dark:border-slate-600"
                  />
                </label>
                <label className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 cursor-pointer">
                  <span className="text-sm text-stone-700 dark:text-slate-300">
                    Push notifications
                  </span>
                  <input
                    type="checkbox"
                    className="rounded border-stone-300 dark:border-slate-600"
                  />
                </label>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-3">
                Data
              </h2>
              <div className="p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700">
                <p className="text-sm text-stone-600 dark:text-slate-400 mb-3">
                  Export your conversation history or clear all data.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-sm border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800"
                  >
                    Export data
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Clear data
                  </button>
                </div>
              </div>
            </section>

            <div className="pt-4">
              <Link
                href="/chat"
                className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
              >
                ← Back to chat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
