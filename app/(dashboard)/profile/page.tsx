"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import PageHeader from "@/components/layout/PageHeader";
import PageContent from "@/components/layout/PageContent";
import PageFooterLinks from "@/components/layout/PageFooterLinks";
import Button from "@/components/ui/Button";
import { useUser } from "@/contexts/UserContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Page = () => {
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
      <PageHeader title="Profile" />

      <PageContent maxWidth="xl">
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
            <Button type="submit">{saved ? "Saved!" : "Save changes"}</Button>
            <Link
              href="/chat"
              className="px-4 py-2 rounded-lg border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 text-sm font-medium hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors inline-block"
            >
              Cancel
            </Link>
          </div>
        </form>

        <PageFooterLinks
          links={[
            { href: "/chat", label: "← Back to chat" },
            { href: "/settings", label: "Settings" },
            { href: "/subscription", label: "Subscription" },
          ]}
          className="mt-8"
        />
      </PageContent>
    </>
  );
};

export default Page;
