import { STORAGE_KEYS } from "@/data/constants";

export const clearAccountData = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.settings);
    localStorage.removeItem(STORAGE_KEYS.subscription);
  } catch {
    // ignore
  }
};
