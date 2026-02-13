"use client";

import { useEffect, useState } from "react";

import { THEME_STORAGE_KEY } from "@/lib/theme";
import type { Theme } from "@/lib/theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (stored === "dark" || stored === "light") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeState(stored);
    }
  }, []);

  const setTheme = (value: Theme) => {
    setThemeState(value);
    localStorage.setItem(THEME_STORAGE_KEY, value);
    document.documentElement.classList.toggle("dark", value === "dark");
  };

  return { theme, setTheme };
}
