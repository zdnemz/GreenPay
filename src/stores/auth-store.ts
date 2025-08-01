import { User } from "@/types";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => Promise<void>;
  clearUser: () => Promise<void>;
  setInitialized: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,

  setUser: (user) =>
    new Promise<void>((resolve) => {
      set({
        user,
        isAuthenticated: !!user,
      });

      // Resolve after state update
      setTimeout(() => {
        resolve();
      }, 0);
    }),

  clearUser: () =>
    new Promise<void>((resolve) => {
      set({
        user: null,
        isAuthenticated: false,
      });

      setTimeout(() => {
        resolve();
      }, 0);
    }),

  setInitialized: (value) => set({ isInitialized: value }),
}));

export const useAuthUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useIsInitialized = () => useAuthStore((s) => s.isInitialized);

export const useAuthActions = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  return { setUser, clearUser, setInitialized };
};
