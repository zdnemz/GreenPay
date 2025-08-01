"use client";

import { useAuthCheck } from "@/hooks/useAuth";
import { ReactNode } from "react";

export interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  useAuthCheck();

  return children;
}
