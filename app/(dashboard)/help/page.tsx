"use client";

import { useState } from "react";
import { PanelLeft, ChevronDown } from "lucide-react";
import Link from "next/link";

import { useSidebar } from "@/contexts/SidebarContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const FAQ_ITEMS = [
  {
    q: "How do I start a new conversation?",
    a: "Click the 'New chat' button in the sidebar or use the prompt templates on the welcome screen to begin.",
  },
  {
    q: "Can I export my conversation history?",
    a: "Yes. Go to Settings → Data Controls and click 'Export data' to download your chat history.",
  },
  {
    q: "How do I delete a conversation?",
    a: "Hover over a conversation in the sidebar, click the trash icon, and confirm the deletion.",
  },
  {
    q: "Can I change the theme?",
    a: "Use the theme toggle in the header, or go to Settings → Appearance to switch between light and dark mode.",
  },
  {
    q: "How do I favorite a conversation?",
    a: "Hover over a conversation in the sidebar and click the star icon to add it to your favorites.",
  },
  {
    q: "How do I manage my subscription?",
    a: "Go to Settings → Account → Subscription, or click your profile in the sidebar and select Subscription. You can upgrade or downgrade your plan at any time.",
  },
  {
    q: "How do I update my profile or settings?",
    a: "Click your profile in the sidebar to access Profile, Settings, and Subscription. Profile lets you change your name and email (click Save changes to apply). Settings includes appearance, notifications, and data controls—remember to click Save changes when you make edits.",
  },
  {
    q: "What keyboard shortcuts are available?",
    a: "Use the keyboard shortcut to start a new chat: Mac (⌘+Shift+O) or Windows (Ctrl+Shift+O). You can also click the New chat button in the sidebar.",
  },
];

export default function HelpPage() {
  const { isOpen: sidebarOpen, setOpen: setSidebarOpen } = useSidebar();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
          Help & Support
        </h1>
        <ThemeToggle />
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto py-8 px-4">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-slate-100 mb-2">
              Frequently asked questions
            </h2>
            <p className="text-sm text-stone-600 dark:text-slate-400">
              Find answers to common questions about using CopilotUI.
            </p>
          </div>

          <div className="space-y-1">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-stone-900 dark:text-slate-100">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-stone-500 dark:text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="px-4 pb-3 pt-0 text-sm text-stone-600 dark:text-slate-400">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-stone-200 dark:border-slate-700 flex flex-wrap gap-4">
            <Link
              href="/chat"
              className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
            >
              ← Back to chat
            </Link>
            <Link
              href="/settings"
              className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
            >
              Settings
            </Link>
            <Link
              href="/profile"
              className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
