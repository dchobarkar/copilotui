import { SETTINGS_STORAGE_KEY } from "./settings";

const USER_STORAGE_KEY = "copilotui-user";
const SUBSCRIPTION_STORAGE_KEY = "copilotui-subscription";

/**
 * Clears all account-related data from localStorage.
 * Call this when the user deletes their account.
 */
export function clearAccountData() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    localStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
  } catch {
    // ignore
  }
}
