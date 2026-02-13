"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import { STORAGE_KEYS } from "@/data/constants";

const loadAuth = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEYS.auth) === "true";
  } catch {
    return false;
  }
}

const saveAuth = (signedIn: boolean) => {
  if (typeof window === "undefined") return;
  try {
    if (signedIn) {
      localStorage.setItem(STORAGE_KEYS.auth, "true");
    } else {
      localStorage.removeItem(STORAGE_KEYS.auth);
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
