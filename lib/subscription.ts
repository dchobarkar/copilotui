export { PLANS, DEFAULT_PLAN } from "@/data/subscription";
export type { Plan, PlanId } from "@/data/subscription";

import { PLANS, DEFAULT_PLAN } from "@/data/subscription";
import { STORAGE_KEYS } from "@/data/constants";
import type { PlanId } from "@/data/subscription";

export const loadSubscription = (): PlanId => {
  if (typeof window === "undefined") return DEFAULT_PLAN;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.subscription);
    if (stored && ["free", "pro", "team"].includes(stored)) {
      return stored as PlanId;
    }
  } catch {
    // ignore
  }
  return DEFAULT_PLAN;
};

export const saveSubscription = (planId: PlanId) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.subscription, planId);
  } catch {
    // ignore
  }
};

export const getPlanById = (id: PlanId) => {
  const plan = PLANS.find((p) => p.id === id);
  return plan ?? PLANS[0];
};
