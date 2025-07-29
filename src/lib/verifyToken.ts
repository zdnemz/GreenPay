import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

/**
 * Mengambil userId dari cookie JWT "auth-token"
 */
export async function getUserIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;

  const payload = verifyToken<{ userId: string }>(token);
  return payload?.userId || null;
}

