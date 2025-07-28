// lib/jwt.ts
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
export function signToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, JWT_OPTIONS);
}

/**
 * Verifikasi token dan kembalikan payload valid
 */
export function verifyToken<T = { userId: string }>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      console.warn("JWT verification failed:", err.message);
    }
    return null;
  }
}
