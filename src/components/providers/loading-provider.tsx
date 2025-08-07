"use client";

import {
  useHasHydrated,
  useIsLoading,
  useLoadingActions,
} from "@/stores/loading-store";
import Loading from "../Loading";
import { useEffect } from "react";
import { lockScroll, unlockScroll } from "@/lib/scroll";

interface LoadingProviderProps {
  children: React.ReactNode;
}

export default function LoadingProvider({ children }: LoadingProviderProps) {
  const isLoading = useIsLoading();
  const hasHydrated = useHasHydrated();
  const { setHasHydrated } = useLoadingActions();

  useEffect(() => {
    setHasHydrated();
  }, [setHasHydrated]);

  useEffect(() => {
    if (hasHydrated) {
      if (isLoading) {
        lockScroll();
      } else {
        unlockScroll();
      }
    }
  }, [hasHydrated, isLoading]);

  return (
    <>
      {(!hasHydrated || isLoading) && <Loading />}
      {children}
    </>
  );
}
