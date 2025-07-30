import { db } from "@/lib/db";
import { getUserFromSession } from "@/lib/auth";
import { response } from "@/lib/response";
import { Role, Status } from "@/generated/prisma/client";
import { POINTS_CONFIG } from "@/lib/points";

export async function GET() {
  try {
    const user = await getUserFromSession();

    if (!user || user.role !== Role.ADMIN) {
      return response(401, "Tidak memiliki akses");
    }

    const totalUser = await db.user.count({
      where: { role: Role.USER },
    });

    const totalPetugas = await db.user.count({
      where: { role: Role.PETUGAS },
    });

    const totalTransaksi = await db.transaction.count();

    const transaksiGrup = await db.transaction.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    const { pending, approved, rejected } = {
      pending:
        transaksiGrup.find((g) => g.status === Status.PENDING)?._count._all ??
        0,
      approved:
        transaksiGrup.find((g) => g.status === Status.APPROVED)?._count._all ??
        0,
      rejected:
        transaksiGrup.find((g) => g.status === Status.REJECTED)?._count._all ??
        0,
    };

    const totalPoint = await db.transaction.groupBy({
      by: ["trashType"],
      where: { status: Status.APPROVED },
      _sum: { points: true },
    });

    const totalSampah = totalPoint.map((item) => {
      const jenis = item.trashType;
      const totalPoints = item._sum.points || 0;
      const pointsPerKg = POINTS_CONFIG.POINTS_PER_KG[jenis];
      const totalKg = totalPoints / pointsPerKg;

      return {
        type: jenis,
        total: parseFloat(totalKg.toFixed(2)),
      };
    });

    const transaksiPerBulan = await db.$queryRaw<
      { bulan: number; tahun: number; jumlah: number }[]
    >`
      SELECT 
        EXTRACT(MONTH FROM "createdAt") AS bulan,
        EXTRACT(YEAR FROM "createdAt") AS tahun,
        COUNT(*) AS jumlah
      FROM "Transaction"
      GROUP BY bulan, tahun
      ORDER BY tahun ASC, bulan ASC;
    `;

    return response(200, {
      totalUser,
      totalPetugas,
      totalTransaksi,
      transaksiPerBulan,
      totalSampah,
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
