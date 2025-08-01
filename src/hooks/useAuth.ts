"use client";

import * as React from "react";
import axios, { AxiosError } from "axios";
import { useAuthActions } from "@/stores/auth-store";
import { ApiResponse } from "@/lib/response";
import { User } from "@/types";
import { useLoading } from "@/hooks/useLoading";

export const useAuthCheck = () => {
  const { setUser, clearUser, setInitialized } = useAuthActions();
  const { startLoading, stopLoading } = useLoading("auth-check");

  React.useEffect(() => {
    let canceled = false;

    const checkAuthStatus = async () => {
      if (canceled) return;
      startLoading();

      try {
        const { data } = await axios.get<ApiResponse>("/api/auth/check");

        if (!data.success) {
          await clearUser();
          return;
        }

        await setUser(data.data as User);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status !== 401) {
          console.error(
            "Auth check failed:",
            (error.response?.data as ApiResponse).error,
          );
        }
        await clearUser();
      } finally {
        stopLoading();

        setInitialized(true);
      }
    };

    checkAuthStatus();

    return () => {
      canceled = false;
    };
  }, [clearUser, setInitialized, setUser, startLoading, stopLoading]);
};
