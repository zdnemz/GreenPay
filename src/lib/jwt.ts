import { User } from "@/types";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET tidak ditemukan di environment variables");
}

const JWT_OPTIONS = {
  expiresIn: 60 * 60 * 24 * 7, // 7 days
};

/**
 * Generate JWT token berdasarkan userId
 */
export function signToken({ id, email, role }: User): string {
  return jwt.sign({ id, email, role }, JWT_SECRET, JWT_OPTIONS);
}

/**
 * Verifikasi token dan kembalikan payload valid
 */
export function verifyToken<T = User>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      console.warn("JWT verification failed:", err.message);
    }
    return null;
  }
}
