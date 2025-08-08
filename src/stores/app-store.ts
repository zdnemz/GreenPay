import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  isBalanceVisible: boolean;
  toggleBalanceVisibility: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isBalanceVisible: true,
      toggleBalanceVisibility: () =>
        set((state) => ({
          isBalanceVisible: !state.isBalanceVisible,
        })),
    }),
    { name: "app-storage" },
  ),
);

export const useIsBalanceVisible = () => useAppStore((s) => s.isBalanceVisible);

export const useAppActions = () => {
  const toggleBalanceVisibility = useAppStore((s) => s.toggleBalanceVisibility);

  return { toggleBalanceVisibility };
};
