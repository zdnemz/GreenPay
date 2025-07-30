import React from "react";
import { create } from "zustand";

interface AppState {
  loadingMap: Record<string, boolean>;
  setLoading: (key: string, value: boolean) => void;
  isLoading: (key: string) => boolean;
  clearAllLoading: () => void;
  isAnyLoading: boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  loadingMap: {},

  setLoading: (key, value) => {
    const currentState = get();
    const currentMap = { ...currentState.loadingMap };

    if (value) {
      currentMap[key] = true;
    } else {
      delete currentMap[key];
    }

    const newIsAnyLoading = Object.values(currentMap).some((v) => v);

    if (
      currentState.isAnyLoading !== newIsAnyLoading ||
      JSON.stringify(currentState.loadingMap) !== JSON.stringify(currentMap)
    ) {
      set({
        loadingMap: currentMap,
        isAnyLoading: newIsAnyLoading,
      });
    }
  },

  isLoading: (key) => !!get().loadingMap[key],

  clearAllLoading: () =>
    set({
      loadingMap: {},
      isAnyLoading: false,
    }),

  isAnyLoading: false,
}));

export const useLoadingMap = () => useAppStore((s) => s.loadingMap);
export const useIsAnyLoading = () => useAppStore((s) => s.isAnyLoading);

export const useAppActions = () => {
  const setLoading = useAppStore((s) => s.setLoading);
  const clearAllLoading = useAppStore((s) => s.clearAllLoading);
  const isLoading = useAppStore((s) => s.isLoading);

  return React.useMemo(
    () => ({
      setLoading,
      clearAllLoading,
      isLoading,
    }),
    [setLoading, clearAllLoading, isLoading],
  );
};
