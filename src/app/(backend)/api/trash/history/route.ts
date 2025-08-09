import { db } from "@/lib/db";
import { response } from "@/lib/response";
import { Status } from "@/generated/prisma/client";
import { NextRequest } from "next/server";
import { getUserFromSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const session = await getUserFromSession();
    if (!session) {
      return response(401, "Anda tidak memiliki mengakses endpoint ini");
    }

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "desc";

    const statusParam = searchParams.get("status");
    const status = statusParam ? (statusParam as Status) : undefined;

    const skip = (page - 1) * limit;

    const whereClause = {
      ...(session.role === "USER" && { userId: session.id }),
      ...(session.role === "PETUGAS" && { petugasId: session.id }),
      ...(status && { status }),
    };

    const total = await db.trashDeposit.count({
      where: whereClause,
    });

    const transactions = await db.trashDeposit.findMany({
      where: whereClause,
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
        user: {
          select: {
            id: true,
            name: true,
          },
        },
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

    return response(200, transactions, {
      page,
      total,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("TrashDeposit fetch error:", (err as Error).message);
    return response(500, "Terjadi kesalahan saat mengambil data transaksi");
  }
}
