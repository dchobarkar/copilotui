/**
 * Default settings values
 */

export type SettingsState = {
  improveModel: boolean;
  chatHistory: boolean;
  emailNotifs: boolean;
  pushNotifs: boolean;
  cookieEssential: boolean;
  cookieAnalytics: boolean;
  cookiePersonalization: boolean;
};

export const DEFAULT_SETTINGS: SettingsState = {
  improveModel: false,
  chatHistory: true,
  emailNotifs: true,
  pushNotifs: false,
  cookieEssential: true,
  cookieAnalytics: false,
  cookiePersonalization: false,
};
