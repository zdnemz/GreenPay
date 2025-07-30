import { db } from "@/lib/db";
import { response } from "@/lib/response";
import { TrashType, Status } from "@/generated/prisma/client";
import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    // jika token tidak ada
    if (!token) {
      const res = response(401, "Tidak terautentikasi");
      res.cookies.delete("auth_token");

      return res;
    }

    const payload = verifyToken(token);

    // jika tidak ada payload atau tidak terverifikasi
    if (!payload) {
      const res = response(401, "Tidak terautentikasi");
      res.cookies.delete("auth_token");

      return res;
    }

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "desc";

    // Cast ke enum
    const statusParam = searchParams.get("status");
    const trashTypeParam = searchParams.get("trashType");

    const status = statusParam ? (statusParam as Status) : undefined;
    const trashType = trashTypeParam
      ? (trashTypeParam as TrashType)
      : undefined;

    const skip = (page - 1) * limit;

    const total = await db.transaction.count({
      where: {
        userId: payload.id,
        ...(status && { status }),
        ...(trashType && { trashType }),
      },
    });

    const transactions = await db.transaction.findMany({
      where: {
        userId: payload.id,
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
