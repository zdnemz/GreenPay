import { ApiResponse } from "@/types";
import { NextResponse } from "next/server";

const defaultMessages: Record<number, string> = {
  200: "OK",
  201: "Created",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
};

export function response<T>(
  status: number,
  data?: T | null,
  pagination?: ApiResponse["pagination"],
) {
  const success = status >= 200 && status < 300;
  const message = defaultMessages[status] || (success ? "Success" : "Error");
  let error: unknown = null;

  if (!success) {
    if (typeof data === "string") {
      error = data;
      data = null;
    } else if (data && typeof data === "object") {
      error = data;
      data = null;
    }
  }

  const body: ApiResponse<T> = {
    success,
    message,
    data: success ? data : null,
    error,
    pagination: success ? pagination : undefined,
  };

  return NextResponse.json(body, { status });
}
