"use client";

import * as React from "react";
import axios, { AxiosError } from "axios";
import { useAuthActions } from "@/store/auth-store";
import { ApiResponse } from "@/lib/response";
import { User } from "@/types";
import { useAppStore } from "@/store/app-store";

export const useAuthCheck = () => {
  const { setUser, clearUser, setInitialized } = useAuthActions();
  const setLoading = useAppStore((s) => s.setLoading);

  React.useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading("auth-check", true);

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
        setLoading("auth-check", false);

        setInitialized(true);
      }
    };

    checkAuthStatus();
  }, [clearUser, setInitialized, setLoading, setUser]);
};
