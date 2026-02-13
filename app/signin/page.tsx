"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/logged-out");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-slate-950">
      <div className="w-8 h-8 border-2 border-stone-300 dark:border-slate-600 border-t-violet-600 rounded-full animate-spin" />
    </div>
  );
};

export default SignInPage;
