import { db } from "@/lib/db";
import { response } from "@/lib/response";
import { Status } from "@/generated/prisma/client";
import { NextRequest } from "next/server";
import { getUserFromSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const session = await getUserFromSession();
    if (!session || session.role !== "USER") {
      return response(401, "Hanya user yang dapat mengakses endpoint ini");
    }

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "desc";

    // Cast ke enum
    const statusParam = searchParams.get("status");

    const status = statusParam ? (statusParam as Status) : undefined;

    const skip = (page - 1) * limit;

    const total = await db.transaction.count({
      where: {
        userId: session.id,
        ...(status && { status }),
      },
    });

    const transactions = await db.transaction.findMany({
      where: {
        userId: session.id,
        ...(status && { status }),
      },
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
      skip,
      take: limit,
      select: {
        id: true,
        createdAt: true,
        status: true,
        signature: true,
        petugas: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          select: {
            trashType: true,
            weight: true,
            points: true,
          },
        },
      },
    });

    return response(200, {
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
