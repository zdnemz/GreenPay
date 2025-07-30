"use client";

import {
  LoadingContext,
  LoadingContextType,
  LoadingState,
} from "@/contexts/loading-context";
import * as React from "react";

interface LoadingProviderProps {
  children: React.ReactNode;
}

export default function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingStates, setLoadingStates] = React.useState<LoadingState>({
    "initial-load": true,
  });

  // Function untuk set loading state - STABLE dengan useCallback
  const setLoading = React.useCallback((key: string, isLoading: boolean) => {
    setLoadingStates((prev) => {
      const newState = { ...prev };
      delete newState["initial-load"];

      const currentState = newState[key] || false;
      if (currentState === isLoading) {
        return newState;
      }

      if (isLoading) {
        newState[key] = true;
      } else {
        delete newState[key];
      }

      return newState;
    });
  }, []);

  // Check apakah ada loading yang aktif - STABLE dengan useMemo
  const isAnyLoading = React.useMemo(() => {
    return Object.keys(loadingStates).length > 0;
  }, [loadingStates]);

  // Check loading state untuk key tertentu - STABLE dengan useCallback
  const isLoading = React.useCallback(
    (key: string): boolean => {
      return loadingStates[key] || false;
    },
    [loadingStates],
  );

  // Clear semua loading states - STABLE dengan useCallback
  const clearAllLoading = React.useCallback(() => {
    setLoadingStates((prev) => {
      if (Object.keys(prev).length === 0) {
        return prev;
      }
      return {};
    });
  }, []);

  // Get semua loading keys yang aktif - STABLE dengan useMemo
  const getLoadingKeys = React.useCallback((): string[] => {
    return Object.keys(loadingStates);
  }, [loadingStates]);

  // STABLE context value dengan useMemo
  const value: LoadingContextType = React.useMemo(
    () => ({
      loadingStates,
      setLoading,
      isAnyLoading,
      isLoading,
      clearAllLoading,
      getLoadingKeys,
    }),
    [
      loadingStates,
      setLoading,
      isAnyLoading,
      isLoading,
      clearAllLoading,
      getLoadingKeys,
    ],
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}
