import { db } from "@/lib/db";
import { getUserFromSession } from "@/lib/session";
import { response } from "@/lib/response";
import { Status } from "@/generated/prisma/client";

export async function GET(req: Request) {
  try {
    const user = await getUserFromSession();

    if (!user || user.role !== "ADMIN") {
      return response(401, "Tidak memiliki akses");
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const mine = searchParams.get("mine") === "true";

    const rawStatus = searchParams.get("status");
    const isValidStatus = rawStatus && Object.values(Status).includes(rawStatus.toUpperCase() as Status);
    const status = isValidStatus ? rawStatus.toUpperCase() as Status : undefined;

    const transactions = await db.transaction.findMany({
      where: {
        ...(mine && { petugasId: user.id }), // hanya jika query ?mine=true
        ...(search && {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
        ...(status && { status }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return response(200, transactions);
  } catch (err) {
    console.error("Error GET /admin/transactions:", err);
    return response(500, "Terjadi kesalahan saat mengambil data transaksi");
  }
}
