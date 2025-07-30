"use client";

import { LoadingContext } from "@/contexts/loading-context";
import React, { useContext, useCallback, useState, useMemo } from "react";

export default function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loadingMap, setLoadingMap] = useState<Map<string, boolean>>(
    () => new Map([["initial-load", true]]),
  );

  const setLoading = useCallback((key: string, value: boolean) => {
    setLoadingMap((prev) => {
      const newMap = new Map(prev);
      if (value) {
        newMap.set(key, true);
      } else {
        newMap.delete(key);
      }
      return newMap;
    });
  }, []);

  const isLoading = useCallback(
    (key: string) => {
      return loadingMap.get(key) ?? false;
    },
    [loadingMap],
  );

  const getAllKeys = useCallback(() => {
    return Array.from(loadingMap.keys());
  }, [loadingMap]);

  const clearAll = useCallback(() => {
    setLoadingMap(new Map());
  }, []);

  const isAnyLoading = useMemo(() => loadingMap.size > 0, [loadingMap]);

  const value = useMemo(
    () => ({
      setLoading,
      isLoading,
      getAllKeys,
      clearAll,
      isAnyLoading,
    }),
    [setLoading, isLoading, getAllKeys, clearAll, isAnyLoading],
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context)
    throw new Error("useLoading must be used within LoadingProvider");
  return context;
};
