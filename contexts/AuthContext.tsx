"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const AUTH_STORAGE_KEY = "copilotui-auth";

function loadAuth(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function saveAuth(signedIn: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (signedIn) {
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

type AuthContextValue = {
  isSignedIn: boolean;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsSignedIn(loadAuth());
    setIsLoading(false);
  }, []);

  const signIn = useCallback(() => {
    saveAuth(true);
    setIsSignedIn(true);
  }, []);

  const signOut = useCallback(() => {
    saveAuth(false);
    setIsSignedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isSignedIn, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
