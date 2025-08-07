import { db } from "@/lib/db";
import { getUserFromSession } from "@/lib/session";
import { response } from "@/lib/response";
import { APP_ENV } from "@/lib/config";

export async function GET(request: Request) {
  try {
    const sessionUser = await getUserFromSession();

    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return response(401, "Tidak memiliki akses");
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10)),
    );
    const offset = (page - 1) * limit;

    let users;
    let total;

    if (q) {
      const keywords = q
        .split(" ")
        .filter(Boolean)
        .map((k) => `%${k}%`);

      const conditions = keywords
        .map((_, i) => `(name ILIKE $${i + 1} OR email ILIKE $${i + 1})`)
        .join(" AND ");

      users = await db.$queryRawUnsafe(
        `
        SELECT id, name, email, "createdAt"
        FROM "User"
        WHERE role = 'USER'
        AND ${conditions}
        ORDER BY "createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
        ...keywords,
      );

      const totalResult = await db.$queryRawUnsafe<{ count: bigint }[]>(
        `
        SELECT COUNT(*) as count
        FROM "User"
        WHERE role = 'USER'
        AND ${conditions}
      `,
        ...keywords,
      );

      total = Number(totalResult[0].count);
    } else {
      const [userResult, totalResult] = await Promise.all([
        db.user.findMany({
          where: { role: "USER" },
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          skip: offset,
          take: limit,
        }),
        db.user.count({ where: { role: "USER" } }),
      ]);

      users = userResult;
      total = totalResult;
    }

    return response(200, users, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error("Error in admin/user GET:", error);

    const errorMessage =
      APP_ENV === "development"
        ? `Database error: ${error instanceof Error ? error.message : "Unknown error"}`
        : "Terjadi kesalahan saat mengambil data user";

    return response(500, errorMessage);
  }
}
