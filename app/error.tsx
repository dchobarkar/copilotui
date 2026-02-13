"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-slate-950 px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/30 mb-4">
          <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-xl font-semibold text-stone-900 dark:text-slate-100 mb-2">
          Something went wrong
        </h1>
        <p className="text-stone-600 dark:text-slate-400 mb-8">
          An unexpected error occurred. Please try again. If the problem
          persists, try refreshing the page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>Try again</Button>
          <a href="/">
            <Button variant="secondary">Return home</Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Error;
