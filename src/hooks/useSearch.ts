import React from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useDebounced } from "@/hooks/useDebounced";
import { useLoading } from "@/hooks/useLoading";
import { toast } from "sonner";
import { Pagination } from "@/types";
import { buildUrlWithParams } from "@/lib/utils";
import { fetcher } from "@/lib/fetcher";

interface SearchHookConfig {
  apiEndpoint: string;
  loadingKey?: string;
  debounceMs?: number;
  defaultPage?: number;
  searchParamKey?: string;
  pageParamKey?: string;
}

interface SearchHookReturn<T> {
  // Data
  data: T | null | undefined;
  pagination: Pagination;

  // Search state
  searchInput: string;
  isLoading: boolean;

  // Handlers
  handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePageChange: (newPage: number) => void;
  handleClearSearch: () => void;
  refreshData: () => Promise<void>;

  // URL state
  currentPage: number;
  currentQuery: string;
}

export function useSearch<T = unknown>(
  config: SearchHookConfig,
): SearchHookReturn<T> {
  const {
    apiEndpoint,
    loadingKey = "search",
    debounceMs = 1000,
    defaultPage = 1,
    searchParamKey = "q",
    pageParamKey = "page",
  } = config;

  const router = useRouter();
  const searchParams = useSearchParams();
  const { startLoading, stopLoading } = useLoading(loadingKey);

  const isFromUserInputRef = React.useRef(false);

  // Get current URL params
  const currentPage = Number(
    searchParams.get(pageParamKey) ?? String(defaultPage),
  );
  const currentQuery = searchParams.get(searchParamKey) || "";

  // Component state
  const [searchInput, setSearchInput] = React.useState(currentQuery);
  const [data, setData] = React.useState<T | null | undefined>(null);
  const [pagination, setPagination] = React.useState<Pagination>({
    page: defaultPage,
    total: 0,
    totalPages: 1,
    limit: 10,
  });

  // Control flags
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const debouncedSearchInput = useDebounced(searchInput, debounceMs);

  // Fetch data function
  const fetchData = React.useCallback(
    async (params: Record<string, unknown>) => {
      try {
        const response = await fetcher<T>({
          url: buildUrlWithParams(apiEndpoint, params),
          method: "get",
          config: { withCredentials: true },
        });

        if (!response.success) {
          throw new Error("Gagal memuat data");
        }

        return { data: response, error: null };
      } catch (err) {
        console.error("Fetch data error:", err);
        return {
          data: null,
          error: (err as Error).message || "Terjadi kesalahan",
        };
      }
    },
    [apiEndpoint],
  );

  // Update URL params
  const updateUrl = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const newUrl = params.toString() ? `?${params.toString()}` : "";
      router.push(newUrl, { scroll: false });
    },
    [router, searchParams],
  );

  // Load data with optional loading indicator
  const loadData = React.useCallback(
    async (pageParam: number, queryParam: string, showLoading = false) => {
      if (showLoading) {
        startLoading();
      }
      setIsLoading(true);

      try {
        const searchParams: Record<string, unknown> = {
          [pageParamKey]: String(pageParam),
        };

        if (queryParam) {
          searchParams[searchParamKey] = queryParam;
        }

        const response = await fetchData(searchParams);

        if (response.error) {
          toast.error(response.error);
          return;
        }

        if (response.data) {
          setData(response.data.data);
          setPagination(
            response.data.pagination || {
              page: defaultPage,
              totalPages: 1,
              limit: 10,
              total: 0,
            },
          );
        }
      } finally {
        if (showLoading) {
          stopLoading();
        }
        setIsLoading(false);
      }
    },
    [
      fetchData,
      startLoading,
      stopLoading,
      pageParamKey,
      searchParamKey,
      defaultPage,
    ],
  );

  // Refresh data function
  const refreshData = React.useCallback(async () => {
    await loadData(currentPage, currentQuery, true);
  }, [loadData, currentPage, currentQuery]);

  // Initial load effect
  React.useEffect(() => {
    if (isInitialLoad) {
      loadData(currentPage, currentQuery, true);
      setIsInitialLoad(false);
    }
  }, [currentPage, currentQuery, loadData, isInitialLoad]);

  // Load data when params change (without loading indicator) - but skip initial load
  React.useEffect(() => {
    if (!isInitialLoad) {
      loadData(currentPage, currentQuery, false);
    }
  }, [currentPage, currentQuery, loadData, isInitialLoad]);

  // Sync search input with URL query when URL changes externally
  // Only update if the current search input doesn't match URL and it's not from user input
  React.useEffect(() => {
    setSearchInput(currentQuery);
  }, [currentQuery]);

  // Handle debounced search - update URL when user stops typing
  React.useEffect(() => {
    // Skip if debounced value equals current URL query
    if (debouncedSearchInput === currentQuery) {
      return;
    }

    // Update URL with debounced search input
    updateUrl({
      [searchParamKey]: debouncedSearchInput || null,
      [pageParamKey]: String(defaultPage), // Reset to first page when search changes
    });
  }, [
    debouncedSearchInput,
    currentQuery,
    updateUrl,
    searchParamKey,
    pageParamKey,
    defaultPage,
  ]);

  // Event handlers
  const handleSearchInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      isFromUserInputRef.current = true;
      setSearchInput(e.target.value);
    },
    [],
  );

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      updateUrl({ [pageParamKey]: String(newPage) });
    },
    [updateUrl, pageParamKey],
  );

  const handleClearSearch = React.useCallback(() => {
    isFromUserInputRef.current = true;
    setSearchInput("");
    updateUrl({
      [searchParamKey]: null,
      [pageParamKey]: String(defaultPage),
    });
  }, [updateUrl, searchParamKey, pageParamKey, defaultPage]);

  return {
    data,
    pagination,

    searchInput,
    isLoading,

    handleSearchInputChange,
    handlePageChange,
    handleClearSearch,
    refreshData,

    currentPage,
    currentQuery,
  };
}
