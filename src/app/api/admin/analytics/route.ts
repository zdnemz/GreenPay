import { db } from "@/lib/db";
import { getUserFromSession } from "@/lib/auth";
import { response } from "@/lib/response";
import { Role, Status } from "@/generated/prisma/client";

export async function GET(req: Request) {
  try {
    const user = await getUserFromSession();

    if (!user || user.role !== Role.ADMIN) {
      return response(401, "Tidak memiliki akses");
    }

    // Hitung total user (role USER)
    const totalUser = await db.user.count({
      where: { role: Role.USER },
    });

    // Hitung total petugas
    const totalPetugas = await db.user.count({
      where: { role: Role.PETUGAS },
    });

    // Hitung total transaksi
    const totalTransaksi = await db.transaction.count();

    // Hitung transaksi berdasarkan status
    const [pending, approved, rejected] = await Promise.all([
      db.transaction.count({ where: { status: Status.PENDING } }),
      db.transaction.count({ where: { status: Status.APPROVED } }),
      db.transaction.count({ where: { status: Status.REJECTED } }),
    ]);

    const transaksiPerBulan = await db.transaction.groupBy({
      by: ["createdAt"],
      _count: { _all: true },
    });

    return response(200, {
      totalUser,
      totalPetugas,
      totalTransaksi,
      transaksiPerBulan,
      transaksiStatus: {
        pending,
        approved,
        rejected,
      },
    });

  } catch (err) {
    console.error("Error GET /admin/analytics:", err);
    return response(500, "Gagal memuat statistik");
  }
}
