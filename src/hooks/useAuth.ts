"use client";

import * as React from "react";
import { useAuthActions } from "@/stores/auth-store";
import { User } from "@/types";
import { useLoading } from "@/hooks/useLoading";
import { fetcher } from "@/lib/fetcher";

export const useAuthCheck = () => {
  const { setUser, clearUser, setInitialized } = useAuthActions();
  const { startLoading, stopLoading } = useLoading("auth-check");

  React.useEffect(() => {
    let canceled = false;

    const checkAuthStatus = async () => {
      if (canceled) return;
      startLoading();

      try {
        const { data } = await fetcher<User>({
          url: "/api/auth/check",
          method: "get",
          config: { withCredentials: true },
        });

        if (!data) throw new Error();

        await setUser(data);
      } catch (error) {
        console.error("Auth check failed:", error);
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
