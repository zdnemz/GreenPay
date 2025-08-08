import { response } from "@/lib/response";
import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      const res = response(401, "Tidak terautentikasi");
      res.cookies.delete("auth_token");
      return res;
    }

    const payload = verifyToken(token);
    if (!payload) {
      const res = response(401, "Tidak terautentikasi");
      res.cookies.delete("auth_token");
      return res;
    }

    const user = await db.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        balance: true,
        lastRank: true,
        currentRank: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) return response(404, "Pengguna tidak ditemukan");

    return response(200, user);
  } catch (err) {
    console.error(`Error getting current user : ${(err as Error).message}`);
    return response(500, "Terjadi kesalahan server");
  }
}
