import { useCallback, useRef } from "react";
import { useLoadingActions } from "@/stores/loading-store";

export const useLoading = (key: string, minDelay = 300) => {
  const { startLoading: start, stopLoading: stop } = useLoadingActions();
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback(() => {
    startTimeRef.current = Date.now();
    start(key);
  }, [key, start]);

  const stopLoading = useCallback(() => {
    const now = Date.now();
    const elapsed = now - (startTimeRef.current ?? now);

    const delay = Math.max(0, minDelay - elapsed);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      stop(key);
      timeoutRef.current = null;
    }, delay);
  }, [key, stop, minDelay]);

  return { startLoading, stopLoading };
};
