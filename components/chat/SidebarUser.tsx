"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Settings, LogOut, ChevronUp } from "lucide-react";
import { mockUser } from "@/lib/user";

export function SidebarUser() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = mockUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={menuRef} className="relative border-t border-stone-200 dark:border-slate-800">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 px-3 py-3 hover:bg-stone-100 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex shrink-0 items-center justify-center w-9 h-9 rounded-full bg-stone-300 dark:bg-slate-600 text-stone-700 dark:text-slate-200 text-sm font-medium">
          {initials}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-stone-800 dark:text-slate-200 truncate">
            {mockUser.name}
          </p>
          <p className="text-xs text-stone-500 dark:text-slate-400 truncate">
            {mockUser.email}
          </p>
        </div>
        <ChevronUp
          className={`w-4 h-4 shrink-0 text-stone-400 dark:text-slate-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-1 mx-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-lg">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
              pathname === "/profile"
                ? "bg-stone-100 dark:bg-slate-700/50 text-stone-900 dark:text-slate-100"
                : "text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700/50"
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
              pathname === "/settings"
                ? "bg-stone-100 dark:bg-slate-700/50 text-stone-900 dark:text-slate-100"
                : "text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700/50"
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <div className="border-t border-stone-200 dark:border-slate-700 my-1" />
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-stone-100 dark:hover:bg-slate-700/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Link>
        </div>
      )}
    </div>
  );
}
