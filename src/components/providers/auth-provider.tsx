/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useLoading, useLoadingState } from "@/contexts/loading-context";
import { useAuthCheck } from "@/hooks/useAuth";
import { ReactNode, useEffect } from "react";
import Loading from "../Loading";

export interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  useAuthCheck();

  const { stopLoading } = useLoadingState("initial-load");

  useEffect(() => {
    stopLoading();
  }, []);

  const { isAnyLoading } = useLoading();

  if (isAnyLoading) return <Loading />;

  return children;
}
