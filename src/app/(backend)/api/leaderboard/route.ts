import { db } from "@/lib/db";
import { getUserFromSession } from "@/lib/session";
import { response } from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromSession();

    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = 50;
    const offset = (page - 1) * limit;

    const total = await db.user.count({
      where: { role: "USER", currentRank: { not: null } },
    });

    const totalPages = Math.ceil(total / limit);

    const leaderboard = await db.user.findMany({
      where: { role: "USER", currentRank: { not: null } },
      orderBy: { currentRank: "asc" },
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        points: true,
        currentRank: true,
      },
    });

    let me = undefined;

    if (user && user.role === "USER") {
      const currentUser = await db.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          points: true,
          currentRank: true,
        },
      });

      me = currentUser || undefined;
    }

    return response(
      200,
      {
        users: leaderboard,
        me,
      },
      {
        limit,
        page,
        total,
        totalPages,
      },
    );
  } catch (err) {
    console.error("Leaderboard error:", err);
    return response(500, "Terjadi kesalahan saat mengambil leaderboard");
  }
}
