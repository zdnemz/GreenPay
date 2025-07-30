import { response } from "@/lib/response";
import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { db } from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";

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
        balance: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) return response(404, "Pengguna tidak ditemukan");

    // Hitung total points semua user
    const allPoints = await db.transaction.groupBy({
      by: ["userId"],
      _sum: {
        points: true,
      },
      orderBy: {
        _sum: {
          points: "desc",
        },
      },
    });

    const pointEntry = allPoints.find((p) => p.userId === user.id);
    const userPoints = pointEntry?._sum.points ?? 0;
    let rank = allPoints.findIndex((p) => p.userId === user.id);
    rank = rank === -1 ? allPoints.length + 1 : rank + 1;

    return response(200, {
      ...user,
      points: userPoints,
      rank,
    });
  } catch (err) {
    console.error(`Error getting current user : ${(err as Error).message}`);
    return response(500, "Terjadi kesalahan server");
  }
}
