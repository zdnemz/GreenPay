"use client";

import { useLoading } from "@/contexts/loading-context";
import { useAuthCheck } from "@/hooks/useAuth";
import { ReactNode } from "react";
import Loading from "../Loading";

export interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  useAuthCheck();

  const { isAnyLoading } = useLoading();

  if (isAnyLoading) return <Loading />;

  return children;
}
