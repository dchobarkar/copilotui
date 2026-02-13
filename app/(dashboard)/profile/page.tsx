"use client";

import { useState, useEffect } from "react";
import { PanelLeft } from "lucide-react";
import Link from "next/link";

import { useSidebar } from "@/contexts/SidebarContext";
import { useUser } from "@/contexts/UserContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function ProfilePage() {
  const { isOpen: sidebarOpen, setOpen: setSidebarOpen } = useSidebar();
  const { user, updateUser } = useUser();
  const { plan } = useSubscription();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(user.name);
    setEmail(user.email);
  }, [user.name, user.email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
          Profile
        </h1>
        <ThemeToggle />
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto py-8 px-4">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-stone-300 dark:bg-slate-600 flex items-center justify-center text-2xl font-medium text-stone-700 dark:text-slate-200 mb-4">
              {initials}
            </div>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-slate-100">
              {user.name}
            </h2>
            <p className="text-sm text-stone-500 dark:text-slate-400">
              {user.email}
            </p>
            <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">
              {plan.name} plan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-1"
              >
                Display name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium"
              >
                {saved ? "Saved!" : "Save changes"}
              </button>
              <Link
                href="/chat"
                className="px-4 py-2 rounded-lg border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 text-sm font-medium hover:bg-stone-100 dark:hover:bg-slate-800"
              >
                Cancel
              </Link>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-200 dark:border-slate-700 flex gap-4">
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
              href="/subscription"
              className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
            >
              Subscription
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
