"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogIn } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const JUST_SIGNED_OUT_KEY = "copilotui-just-signed-out";

export default function LoggedOutPage() {
  const router = useRouter();
  const { signIn, isSignedIn, isLoading } = useAuth();
  const [showProcess, setShowProcess] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (!isLoading && isSignedIn) router.replace("/chat");
  }, [isSignedIn, isLoading, router]);

  useEffect(() => {
    const justSignedOut = typeof window !== "undefined" && sessionStorage.getItem(JUST_SIGNED_OUT_KEY);
    if (justSignedOut) {
      sessionStorage.removeItem(JUST_SIGNED_OUT_KEY);
      const t = setTimeout(() => setShowProcess(false), 1200);
      return () => clearTimeout(t);
    }
    setShowProcess(false);
  }, []);

  const handleSignIn = () => {
    setIsSigningIn(true);
    setTimeout(() => {
      signIn();
      setIsSigningIn(false);
      router.push("/chat");
    }, 600);
  };

  if (!isLoading && isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-2 border-stone-300 dark:border-slate-600 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-slate-950">
      <header className="flex items-center justify-end p-4 border-b border-stone-200 dark:border-slate-800">
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {showProcess ? (
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 p-8 shadow-sm text-center">
              <div className="inline-block w-10 h-10 border-2 border-stone-300 dark:border-slate-600 border-t-violet-600 rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium text-stone-700 dark:text-slate-300">
                Signing out…
              </p>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                Please wait
              </p>
            </div>
          ) : (
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 p-8 shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 dark:bg-emerald-500/30 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-xl font-semibold text-stone-900 dark:text-slate-100 text-center mb-2">
                You&apos;re Logged Out
              </h1>
              <p className="text-sm text-stone-600 dark:text-slate-400 text-center mb-6">
                You have been successfully logged out of CopilotUI. Thank you for
                using our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {isSigningIn ? "Signing in…" : "Return to Dashboard"}
                </button>
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In Again
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
