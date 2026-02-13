"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";

const DashboardError = ({
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
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/30 mb-4">
          <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-xl font-semibold text-stone-900 dark:text-slate-100 mb-2">
          Something went wrong
        </h1>
        <p className="text-stone-600 dark:text-slate-400 mb-8">
          An error occurred while loading this page. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Link href="/chat">
            <Button variant="secondary">Back to chat</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardError;
