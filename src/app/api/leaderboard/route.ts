import { db } from "@/lib/db";
import { getUserFromSession } from "@/lib/session";
import { response } from "@/lib/response";
import { NextRequest } from "next/server";
import { convertBigInt } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromSession(); // Boleh null

    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = 50;
    const offset = (page - 1) * limit;

    // Ambil leaderboard user
    const leaderboard = await db.$queryRaw<
      { id: string; name: string; role: string; points: number | bigint }[]
    >`
      SELECT u.id, u.name, u.role, COALESCE(SUM(t.points), 0) AS points
      FROM "User" u
      LEFT JOIN "Transaction" t ON t."userId" = u.id
      WHERE u.role = 'USER'
      GROUP BY u.id
      ORDER BY points DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    const rankedUsers = leaderboard.map((u, i) => ({
      ...u,
      rank: offset + i + 1,
    }));

    let myRank: number | null = null;
    let myPoints = 0;
    let role = null;

    if (user && user.role === "USER") {
      role = user.role;

      const myPointsResult = await db.$queryRaw<{ points: bigint }[]>`
        SELECT COALESCE(SUM(points), 0) AS points
        FROM "Transaction"
        WHERE "userId" = ${user.id}
      `;
      myPoints = Number(myPointsResult[0]?.points ?? 0);

      const myRankResult = await db.$queryRaw<{ rank: bigint }[]>`
        SELECT COUNT(*) + 1 AS rank
        FROM (
          SELECT u.id
          FROM "User" u
          LEFT JOIN "Transaction" t ON t."userId" = u.id
          WHERE u.role = 'USER'
          GROUP BY u.id
          HAVING COALESCE(SUM(t.points), 0) > (
            SELECT COALESCE(SUM(points), 0)
            FROM "Transaction"
            WHERE "userId" = ${user.id}
          )
        ) AS higher_users;
      `;
      myRank = Number(myRankResult[0]?.rank ?? null);
    }

    return response(
      200,
      convertBigInt({
        users: rankedUsers,
        myRank,
        myPoints,
        role,
        page,
      }),
    );
  } catch (err) {
    console.error(`error: ${(err as Error).message}`);
    return response(500, "Terjadi kesalahan saat mengambil leaderboard");
  }
}
