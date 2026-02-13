"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import {
  loadSubscription,
  saveSubscription,
  getPlanById,
  type PlanId,
  type Plan,
} from "@/lib/subscription";

type SubscriptionContextValue = {
  planId: PlanId;
  plan: Plan;
  setPlan: (planId: PlanId) => void;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(
  null,
);

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [planId, setPlanIdState] = useState<PlanId>(loadSubscription());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlanIdState(loadSubscription());
  }, []);

  const setPlan = useCallback((newPlanId: PlanId) => {
    setPlanIdState(newPlanId);
    saveSubscription(newPlanId);
  }, []);

  const plan = getPlanById(planId);

  return (
    <SubscriptionContext.Provider value={{ planId, plan, setPlan }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx)
    throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}
