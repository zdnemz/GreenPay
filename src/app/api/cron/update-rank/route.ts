import { db } from "@/lib/db";
import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/session";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const API_KEY = process.env.API_KEY;
    if (API_KEY) throw new Error("API KEY was not setted");

    const headerKey = req.headers.get("x-api-key");

    if (!headerKey || headerKey !== API_KEY) {
      const sessionUser = await getUserFromSession();

      if (!sessionUser || sessionUser.role !== "ADMIN") {
        return response(
          401,
          "Unauthorized: Anda bukan admin atau API key salah",
        );
      }
    }

    await db.$executeRawUnsafe(`
            WITH ranked_users AS (
            SELECT id, ROW_NUMBER() OVER (ORDER BY points DESC) AS new_rank
            FROM "User"
            WHERE role = 'USER'
            )
            UPDATE "User" u
            SET 
            "lastRank" = u."currentRank",
            "currentRank" = r.new_rank
            FROM ranked_users r
            WHERE u.id = r.id;
            `);

    return response(200);
  } catch (error) {
    console.error("Error updating rank:", (error as Error).message);
    return response(500, "Terjadi kesalahan saat update ranking");
  }
}
