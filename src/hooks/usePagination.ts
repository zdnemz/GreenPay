import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/hooks/useLoading";
import { toast } from "sonner";
import { fetcher } from "@/lib/fetcher";
import { buildUrlWithParams } from "@/lib/utils";
import { Pagination } from "@/types";

interface UsePaginationConfig {
  apiEndpoint: string;
  defaultPage?: number;
  pageParamKey?: string;
  loadingKey?: string;
}

interface UsePaginationReturn<T> {
  data: T | null | undefined;
  pagination: Pagination;
  currentPage: number;
  isLoading: boolean;

  handlePageChange: (page: number) => void;
  refreshData: () => Promise<void>;
}

export function usePagination<T = unknown>(
  config: UsePaginationConfig,
): UsePaginationReturn<T> {
  const {
    apiEndpoint,
    defaultPage = 1,
    pageParamKey = "page",
    loadingKey = "pagination",
  } = config;

  const router = useRouter();
  const searchParams = useSearchParams();
  const { startLoading, stopLoading } = useLoading(loadingKey);

  const currentPage = Number(searchParams.get(pageParamKey)) || defaultPage;

  const [data, setData] = React.useState<T | null | undefined>(null);
  const [pagination, setPagination] = React.useState<Pagination>({
    page: defaultPage,
    totalPages: 1,
    limit: 10,
    total: 0,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchData = React.useCallback(
    async (params: Record<string, unknown>) => {
      try {
        const response = await fetcher<T>({
          url: buildUrlWithParams(apiEndpoint, params),
          method: "get",
          config: { withCredentials: true },
        });

        if (!response.success) throw new Error("Gagal memuat data");

        return { data: response.data, pagination: response.pagination };
      } catch (err) {
        toast.error(
          (err as Error).message || "Terjadi kesalahan saat memuat data",
        );
        return { data: null, pagination: null };
      }
    },
    [apiEndpoint],
  );

  const updateUrlParam = React.useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const loadData = React.useCallback(
    async (page: number, showLoading = true) => {
      if (showLoading) startLoading();
      setIsLoading(true);

      const result = await fetchData({ [pageParamKey]: page });

      if (result.data) setData(result.data);
      if (result.pagination) setPagination(result.pagination);

      setIsLoading(false);
      if (showLoading) stopLoading();
    },
    [fetchData, pageParamKey, startLoading, stopLoading],
  );

  React.useEffect(() => {
    loadData(currentPage, true);
  }, [currentPage, loadData]);

  const handlePageChange = (newPage: number) => {
    updateUrlParam(pageParamKey, String(newPage));
  };

  const refreshData = async () => {
    await loadData(currentPage, true);
  };

  return {
    data,
    pagination,
    currentPage,
    isLoading,
    handlePageChange,
    refreshData,
  };
}
