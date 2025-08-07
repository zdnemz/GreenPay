import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface LoadingStore {
  loadingMap: Record<string, boolean>;
  hasHydrated: boolean;
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  setHasHydrated: () => void;
}

export const useLoadingStore = create<LoadingStore>()(
  subscribeWithSelector((set) => ({
    loadingMap: {},
    hasHydrated: false,

    setHasHydrated: () => set({ hasHydrated: true }),

    startLoading: (key) =>
      set((state) => ({
        loadingMap: {
          ...state.loadingMap,
          [key]: true,
        },
      })),

    stopLoading: (key) =>
      set((state) => {
        const updated = { ...state.loadingMap, [key]: false };

        // Hapus semua key yang sudah false
        const cleaned = Object.fromEntries(
          Object.entries(updated).filter(([, v]) => v),
        );

        return { loadingMap: cleaned };
      }),
  })),
);

export const useLoadingMap = () => useLoadingStore((s) => s.loadingMap);
export const useHasHydrated = () => useLoadingStore((s) => s.hasHydrated);
export const useIsLoading = () =>
  useLoadingStore((s) => Object.values(s.loadingMap).some((v) => v));

export const useLoadingActions = () => {
  const startLoading = useLoadingStore((s) => s.startLoading);
  const stopLoading = useLoadingStore((s) => s.stopLoading);
  const setHasHydrated = useLoadingStore((s) => s.setHasHydrated);
  return { startLoading, stopLoading, setHasHydrated };
};
