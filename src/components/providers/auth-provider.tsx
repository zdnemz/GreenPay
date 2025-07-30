"use client";

import { useAuthCheck } from "@/hooks/useAuth";
import { useIsInitialized } from "@/store/auth-store";
import { useAppStore, useIsAnyLoading, useLoadingMap } from "@/store/app-store";
import Loading from "../Loading";
import { ReactNode } from "react";

export interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const isInitialized = useIsInitialized();

  const isAnyLoading = useIsAnyLoading();
  const loadingMap = useLoadingMap();

  useAuthCheck();

  console.log(loadingMap);
  console.log(isAnyLoading);

  if (!isInitialized || isAnyLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}
