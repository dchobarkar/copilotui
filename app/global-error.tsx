"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-slate-950 px-4 antialiased">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/30 mb-4">
            <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-xl font-semibold text-stone-900 dark:text-slate-100 mb-2">
            Something went wrong
          </h1>
          <p className="text-stone-600 dark:text-slate-400 mb-8">
            A critical error occurred. Please try again or refresh the page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
            >
              Try again
            </button>
            <a
              href="/"
              className="px-4 py-2.5 rounded-lg border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 text-sm font-medium hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors text-center"
            >
              Return home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
