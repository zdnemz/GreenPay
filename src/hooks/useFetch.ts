import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { fetcher, FetcherOptions } from "@/lib/fetcher";
import { useLoading } from "@/hooks/useLoading";
import { toast } from "sonner";
import { AxiosRequestConfig } from "axios";
import { nanoid } from "nanoid";
import type { ApiResponse } from "@/types";
import { buildUrlWithParams } from "@/lib/utils";

interface UseFetchOptions<T = unknown> {
  url: string;
  params?: Record<string, unknown>;
  fetcherParams: Omit<FetcherOptions<ApiResponse<T>>, "url">;
  loadingKey?: string;
  immediate?: boolean;
  withLoading?: boolean;
}

export function useFetch<T = unknown>({
  url,
  params,
  fetcherParams,
  loadingKey,
  immediate = false,
  withLoading = true,
}: UseFetchOptions<T>) {
  const loadKey = useMemo(
    () => loadingKey || `load-${nanoid(6)}`,
    [loadingKey],
  );
  const { startLoading, stopLoading } = useLoading(loadKey);

  const [data, setData] = useState<T | null>(null);
  const [pagination, setPagination] = useState<ApiResponse["pagination"]>();
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetcherParamsRef = useRef(fetcherParams);
  fetcherParamsRef.current = fetcherParams;

  const safeStartLoading = useCallback(() => {
    if (withLoading) {
      startLoading();
      setIsLoading(true);
    }
  }, [withLoading, startLoading]);

  const safeStopLoading = useCallback(() => {
    if (withLoading) {
      setTimeout(() => {
        stopLoading();
        setIsLoading(false);
      }, 500);
    }
  }, [withLoading, stopLoading]);

  const triggerFetch = useCallback(
    async (
      override?: Partial<FetcherOptions> & { params?: Record<string, unknown> },
    ) => {
      safeStartLoading();

      const finalUrl = buildUrlWithParams(
        url,
        override?.params || fetcherParamsRef.current.config?.params || params,
      );

      try {
        const response = await fetcher<T>({
          url: finalUrl,
          method: fetcherParamsRef.current.method,
          data: override?.data ?? fetcherParamsRef.current.data,
          config: {
            ...(fetcherParamsRef.current.config || {}),
            ...(override?.config || {}),
          } as AxiosRequestConfig,
        });

        if (!response.data) throw new Error("terjadi kesalahan");

        setData(response.data);
        setPagination(response.pagination);
        setError(null);

        return response.data;
      } catch (err) {
        const message = (err as Error).message || "Terjadi kesalahan.";
        toast.error(message);

        setError(err);
        return null;
      } finally {
        safeStopLoading();
      }
    },
    [url, safeStartLoading, safeStopLoading, params],
  );

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (immediate && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      triggerFetch();
    }
  }, [immediate, triggerFetch]);

  const mutate = useCallback(
    (newData: T, revalidateNow: boolean = false) => {
      setData(newData);
      if (revalidateNow) {
        triggerFetch();
      }
    },
    [triggerFetch],
  );

  return {
    data,
    pagination,
    error,
    isLoading,
    fetch: triggerFetch,
    mutate,
  };
}
