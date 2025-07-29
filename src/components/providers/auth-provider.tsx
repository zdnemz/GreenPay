"use client";

import { useAuthCheck } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth-store";
import Loading from "../Loading";
import { ReactNode } from "react";

export interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isInitialized, loading } = useAuthStore();
  useAuthCheck();

  if (!isInitialized || loading) {
    return <Loading />;
  }

  return children;
}
