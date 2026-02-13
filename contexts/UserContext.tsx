"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import { mockUser } from "@/lib/user";

const STORAGE_KEY = "copilotui-user";

type UserState = {
  name: string;
  email: string;
};

function loadUser(): UserState {
  if (typeof window === "undefined") {
    return { name: mockUser.name, email: mockUser.email };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as UserState;
      return { name: parsed.name ?? mockUser.name, email: parsed.email ?? mockUser.email };
    }
  } catch {
    // ignore
  }
  return { name: mockUser.name, email: mockUser.email };
}

function saveUser(user: UserState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

type UserContextValue = {
  user: UserState;
  updateUser: (updates: Partial<UserState>) => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserState>(() => ({
    name: mockUser.name,
    email: mockUser.email,
  }));

  useEffect(() => {
    setUser(loadUser());
  }, []);

  const updateUser = useCallback((updates: Partial<UserState>) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      saveUser(next);
      return next;
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
