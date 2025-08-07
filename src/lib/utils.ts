import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertBigInt(obj: unknown) {
  return JSON.parse(
    JSON.stringify(obj, (_, val) =>
      typeof val === "bigint" ? Number(val) : val,
    ),
  );
}

export function buildUrlWithParams(
  baseUrl: string,
  params?: Record<string, unknown>,
): string {
  if (!params) return baseUrl;

  const url = new URL(baseUrl, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.pathname + url.search;
}
