import Link from "next/link";

export const metadata = {
  title: "404 - Page Not Found | CopilotUI",
  description: "The page you are looking for does not exist.",
};

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-slate-950 px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-violet-600 dark:text-violet-400 mb-2">
          404
        </p>
        <h1 className="text-xl font-semibold text-stone-900 dark:text-slate-100 mb-2">
          Page not found
        </h1>
        <p className="text-stone-600 dark:text-slate-400 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
          have been moved or doesn&apos;t exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/chat"
            className="px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors text-center"
          >
            Go to Chat
          </Link>
          <Link
            href="/"
            className="px-4 py-2.5 rounded-lg border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 text-sm font-medium hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors text-center"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
