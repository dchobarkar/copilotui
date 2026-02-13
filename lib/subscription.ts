export type PlanId = "free" | "pro" | "team";

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  interval: "month" | "year";
  description: string;
  features: string[];
  highlighted?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    description: "Get started with CopilotUI",
    features: [
      "20 messages per day",
      "Basic conversations",
      "Standard response speed",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 20,
    interval: "month",
    description: "For power users and professionals",
    features: [
      "Unlimited messages",
      "Priority access",
      "Faster responses",
      "Advanced models",
      "Email support",
      "Export conversations",
    ],
    highlighted: true,
  },
  {
    id: "team",
    name: "Team",
    price: 40,
    interval: "month",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Shared workspaces",
      "Admin controls",
      "Usage analytics",
      "SSO & SAML",
      "Priority support",
    ],
  },
];

export const DEFAULT_PLAN: PlanId = "free";

const STORAGE_KEY = "copilotui-subscription";

export function loadSubscription(): PlanId {
  if (typeof window === "undefined") return DEFAULT_PLAN;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ["free", "pro", "team"].includes(stored)) {
      return stored as PlanId;
    }
  } catch {
    // ignore
  }
  return DEFAULT_PLAN;
}

export function saveSubscription(planId: PlanId) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, planId);
  } catch {
    // ignore
  }
}

export function getPlanById(id: PlanId): Plan {
  const plan = PLANS.find((p) => p.id === id);
  return plan ?? PLANS[0];
}
