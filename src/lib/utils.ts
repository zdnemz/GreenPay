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
