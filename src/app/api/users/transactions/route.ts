import { db } from "@/lib/db";
import { response } from "@/lib/response";
import { getUserIdFromCookie } from "@/lib/verifyToken";
import { TrashType, Status } from "@/generated/prisma/client";

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromCookie();

    if (!userId) return response(401, "Unauthorized");

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "desc";

    // Cast ke enum 
    const statusParam = searchParams.get("status");
    const trashTypeParam = searchParams.get("trashType");

    const status = statusParam ? (statusParam as Status) : undefined;
    const trashType = trashTypeParam ? (trashTypeParam as TrashType) : undefined;

    const skip = (page - 1) * limit;

    const total = await db.transaction.count({
      where: {
        userId,
        ...(status && { status }),
        ...(trashType && { trashType }),
      },
    });

    const transactions = await db.transaction.findMany({
      where: {
        userId,
        ...(status && { status }),
        ...(trashType && { trashType }),
      },
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
      skip,
      take: limit,
    });

    return Response.json({
      data: transactions,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Transaction fetch error:", (err as Error).message);
    return response(500, "Terjadi kesalahan saat mengambil data transaksi");
  }
}
