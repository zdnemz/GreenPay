"use client";

import * as React from "react";
import axios, { AxiosError } from "axios";
import { useRouter, usePathname  } from "next/navigation";
import { useAuthStore, User } from "@/store/auth-store";
import { ApiResponse } from "@/lib/response";

export const useAuthCheck = () => {
  const pathname = usePathname();
  const { setUser, clearUser, setLoading, setInitialized } = useAuthStore();

  React.useEffect(() => {
    const publicRoutes = ["/", "/login", "/register"];

    if (publicRoutes.includes(pathname)) {
      setInitialized(true);
      return;
    }
    
    const checkAuthStatus = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get<ApiResponse>("/api/users/me");

        if (!data.success) {
          clearUser();
          return;
        }

        setUser(data.data as User);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(
            "Auth check failed:",
            (error.response?.data as ApiResponse).error,
          );
        }
        clearUser();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkAuthStatus();
  }, [setUser, clearUser, setLoading, setInitialized]);
};

export const useRequireAuth = (redirectTo: string = "/auth/login") => {
  const { isAuthenticated, isInitialized, user } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isInitialized, router, redirectTo]);

  return { isAuthenticated, isInitialized, user };
};

export const useRequireGuest = (redirectTo: string = "/") => {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isInitialized, router, redirectTo]);

  return { isAuthenticated, isInitialized };
};
