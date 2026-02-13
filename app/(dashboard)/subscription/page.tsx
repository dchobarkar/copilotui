"use client";

import { useState } from "react";
import { PanelLeft, Check, Loader2 } from "lucide-react";
import Link from "next/link";

import { useSidebar } from "@/contexts/SidebarContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { PLANS, type PlanId } from "@/lib/subscription";

export default function SubscriptionPage() {
  const { isOpen: sidebarOpen, setOpen: setSidebarOpen } = useSidebar();
  const { planId, setPlan } = useSubscription();
  const [upgradingTo, setUpgradingTo] = useState<PlanId | null>(null);
  const [upgradeComplete, setUpgradeComplete] = useState<PlanId | null>(null);

  const handleSelectPlan = (targetPlanId: PlanId) => {
    if (targetPlanId === planId) return; // Already on this plan
    setUpgradingTo(targetPlanId);
    setTimeout(() => {
      setPlan(targetPlanId);
      setUpgradingTo(null);
      setUpgradeComplete(targetPlanId);
      setTimeout(() => setUpgradeComplete(null), 3000);
    }, 1500);
  };

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
          Subscription
        </h1>
        <ThemeToggle />
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-slate-100 mb-2">
              Choose your plan
            </h2>
            <p className="text-sm text-stone-600 dark:text-slate-400">
              Upgrade or change your subscription at any time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {PLANS.map((plan) => {
              const isCurrent = plan.id === planId;
              const isUpgrading = upgradingTo === plan.id;
              const justUpgraded = upgradeComplete === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-xl border p-6 flex flex-col ${
                    plan.highlighted
                      ? "border-violet-500 dark:border-violet-500 bg-violet-50/50 dark:bg-violet-950/20"
                      : "border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 border"
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-600 text-white">
                      Popular
                    </span>
                  )}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-stone-900 dark:text-slate-100">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-slate-400 mt-1">
                      {plan.description}
                    </p>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-stone-900 dark:text-slate-100">
                        ${plan.price}
                      </span>
                      <span className="text-sm text-stone-500 dark:text-slate-400">
                        /{plan.interval}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-stone-600 dark:text-slate-400"
                      >
                        <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrent || isUpgrading}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      isCurrent
                        ? "bg-stone-200 dark:bg-slate-700 text-stone-500 dark:text-slate-400 cursor-default"
                        : plan.highlighted
                          ? "bg-violet-600 hover:bg-violet-700 text-white"
                          : "border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {isCurrent ? (
                      "Current plan"
                    ) : isUpgrading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing…
                      </>
                    ) : justUpgraded ? (
                      "Updated!"
                    ) : plan.id === "free" ? (
                      "Downgrade"
                    ) : (
                      "Upgrade"
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-stone-100 dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-stone-900 dark:text-slate-100 mb-2">
              Billing
            </h3>
            <p className="text-sm text-stone-600 dark:text-slate-400">
              This is a demo. No real payment is processed. Changes to your plan
              are simulated and saved locally.
            </p>
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
