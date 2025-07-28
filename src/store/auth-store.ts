import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "PETUGAS" | "ADMIN";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loading: boolean;
  setUser: (user: User | null) => Promise<void>;
  clearUser: () => Promise<void>;
  setInitialized: (value: boolean) => void;
  setLoading: (value: boolean) => void;
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
  setLoading: (value) => set({ loading: value }),
}));
