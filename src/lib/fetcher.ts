import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "@/types/index";

export type HTTPMethod = "get" | "post" | "put" | "delete" | "patch";

export interface FetcherOptions<TResponse = unknown, TData = unknown> {
  url: string;
  method?: HTTPMethod;
  data?: TData;
  config?: AxiosRequestConfig<TResponse>;
}

export async function fetcher<TResponse = unknown, TData = unknown>({
  url,
  method = "get",
  data,
  config = {},
}: FetcherOptions<TResponse, TData>): Promise<ApiResponse<TResponse>> {
  try {
    const response: AxiosResponse<ApiResponse<TResponse>> = await axios({
      url,
      method,
      data,
      ...config,
    });

    return response.data;
  } catch (error) {
    console.error(error);

    if (error instanceof AxiosError) {
      const message =
        ((error.response?.data as ApiResponse)?.error as string) ||
        "Terjadi kesalahan";
      throw new Error(message);
    }

    throw new Error((error as Error).message || "Terjadi Kesalahan");
  }
}
