export const SETTINGS_STORAGE_KEY = "copilotui-settings";

export type SettingsState = {
  improveModel: boolean;
  chatHistory: boolean;
  emailNotifs: boolean;
  pushNotifs: boolean;
};

export const DEFAULT_SETTINGS: SettingsState = {
  improveModel: false,
  chatHistory: true,
  emailNotifs: true,
  pushNotifs: false,
};

export function loadSettings(): SettingsState {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
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
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
