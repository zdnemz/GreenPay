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

export function formatOrdinalNumber(num: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = num % 100;
  const suffix = v >= 11 && v <= 13 ? "th" : suffixes[num % 10] || "th";
  return `${num}${suffix}`;
}
