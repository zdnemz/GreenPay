import { db } from "@/lib/db";
import { getUserFromSession } from "@/lib/session";
import { response } from "@/lib/response";
import { Role, Status } from "@/generated/prisma/client";

export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user || user.role !== Role.ADMIN) {
      return response(401, "Tidak memiliki akses");
    }

    // Parallel Queries
    const [
      totalUser,
      totalPetugas,
      totalTransaksi,
      transaksiStatusGroup,
      totalSampah,
      pointPerTrashType,
      transaksiPerBulan,
    ] = await Promise.all([
      db.user.count({ where: { role: Role.USER } }),
      db.user.count({ where: { role: Role.PETUGAS } }),
      db.transaction.count(),
      db.transaction.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      db.transactionItem.aggregate({
        _sum: { weight: true, points: true },
        where: {
          transaction: { status: Status.APPROVED },
        },
      }),
      db.transactionItem.groupBy({
        by: ["trashType"],
        where: {
          transaction: { status: Status.APPROVED },
        },
        _sum: { points: true },
      }),
      db.$queryRaw<{ bulan: number; tahun: number; jumlah: number }[]>`
        SELECT 
          EXTRACT(MONTH FROM t."createdAt") AS bulan,
          EXTRACT(YEAR FROM t."createdAt") AS tahun,
          COUNT(*) AS jumlah
        FROM "Transaction" t
        GROUP BY bulan, tahun
        ORDER BY tahun ASC, bulan ASC;
      `,
    ]);

    // Format Data Status Transaksi
    const transaksiStatus = {
      approved: 0,
      rejected: 0,
    };

    for (const group of transaksiStatusGroup) {
      if (group.status === Status.APPROVED) {
        transaksiStatus.approved = group._count._all;
      } else if (group.status === Status.REJECTED) {
        transaksiStatus.rejected = group._count._all;
      }
    }

    // Format Point per TrashType
    const poinPerJenisSampah = pointPerTrashType.map((item) => ({
      trashType: item.trashType,
      totalPoin: item._sum.points ?? 0,
    }));

    // Format Total Sampah
    const totalSampahResult = {
      totalBerat: totalSampah._sum.weight ?? 0,
      totalPoin: totalSampah._sum.points ?? 0,
    };

    // Final Response
    return response(200, {
      totalUser,
      totalPetugas,
      totalTransaksi,
      transaksiStatus,
      transaksiPerBulan,
      poinPerJenisSampah,
      totalSampah: totalSampahResult,
    });
  } catch (err) {
    console.error("Error GET /admin/analytics:", err);
    return response(500, "Gagal memuat statistik");
  }
}
