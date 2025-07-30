"use client";

import { createContext, useContext, useCallback, useMemo } from "react";

// Tipe untuk loading state
export interface LoadingState {
  [key: string]: boolean;
}

// Tipe untuk context value
export interface LoadingContextType {
  setLoading: (key: string, value: boolean) => void;
  isLoading: (key: string) => boolean;
  getAllKeys: () => string[];
  clearAll: () => void;
  isAnyLoading: boolean; // ✅ Tambahkan ini
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

  const startLoading = useCallback(
    () => setLoading(key, true),
    [key, setLoading],
  );
  const stopLoading = useCallback(
    () => setLoading(key, false),
    [key, setLoading],
  );
  const toggleLoading = useCallback(
    (val: boolean) => setLoading(key, val),
    [key, setLoading],
  );

  return useMemo(
    () => ({
      isLoading: () => isLoading(key), // ⬅️ penting: getter function, bukan boolean
      setLoading: toggleLoading,
      startLoading,
      stopLoading,
    }),
    [isLoading, key, toggleLoading, startLoading, stopLoading],
  );
};
