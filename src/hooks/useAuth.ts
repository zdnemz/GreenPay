"use client";

import * as React from "react";
import axios, { AxiosError } from "axios";

import { useAuthStore, User } from "@/store/auth-store";
import { ApiResponse } from "@/lib/response";

export const useAuthCheck = () => {
  const { setUser, clearUser, setLoading, setInitialized } = useAuthStore();

  React.useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get<ApiResponse>("/api/users/me");

        if (!data.success) {
          await clearUser();
          return;
        }

        await setUser(data.data as User);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(
            "Auth check failed:",
            (error.response?.data as ApiResponse).error,
          );
        }
        await clearUser();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkAuthStatus();
  }, [setUser, clearUser, setLoading, setInitialized]);
};
