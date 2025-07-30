"use client";

import { createContext, useContext, useCallback, useMemo } from "react";

// Tipe untuk loading state
export interface LoadingState {
  [key: string]: boolean;
}

// Tipe untuk context value
export interface LoadingContextType {
  loadingStates: LoadingState;
  setLoading: (key: string, isLoading: boolean) => void;
  isAnyLoading: boolean;
  isLoading: (key: string) => boolean;
  clearAllLoading: () => void;
  getLoadingKeys: () => string[];
}

// Buat context
export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined,
);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

// Hook khusus untuk individual loading state - OPTIMIZED
export const useLoadingState = (key: string) => {
  const { setLoading, isLoading } = useLoading();

  // STABLE functions dengan useCallback
  const startLoading = useCallback(
    () => setLoading(key, true),
    [setLoading, key],
  );
  const stopLoading = useCallback(
    () => setLoading(key, false),
    [setLoading, key],
  );
  const toggleLoading = useCallback(
    (loading: boolean) => setLoading(key, loading),
    [setLoading, key],
  );

  return useMemo(
    () => ({
      isLoading: isLoading(key),
      setLoading: toggleLoading,
      startLoading,
      stopLoading,
    }),
    [isLoading, key, toggleLoading, startLoading, stopLoading],
  );
};
