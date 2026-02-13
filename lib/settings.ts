export type { SettingsState } from "@/data/settings";
export { DEFAULT_SETTINGS } from "@/data/settings";

import { DEFAULT_SETTINGS } from "@/data/settings";
import { STORAGE_KEYS } from "@/data/constants";
import type { SettingsState } from "@/data/settings";

export function loadSettings(): SettingsState {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.settings);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<SettingsState>;
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: SettingsState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
