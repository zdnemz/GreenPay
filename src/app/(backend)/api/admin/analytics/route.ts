import { db } from "@/lib/db";
import { getUserFromSession } from "@/lib/session";
import { response } from "@/lib/response";
import { Role, Status } from "@/generated/prisma/client";
import { convertBigInt } from "@/lib/utils";

export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user || user.role !== Role.ADMIN) {
      return response(401, "Tidak memiliki akses");
    }

    const [
      totalUser,
      totalPetugas,
      totalTransaksi,
      transaksiStatusGroup,
      totalSampahPerType,
      transaksiPerBulan,
    ] = await Promise.all([
      db.user.count({ where: { role: Role.USER } }),
      db.user.count({ where: { role: Role.PETUGAS } }),
      db.trashDeposit.count(),
      db.trashDeposit.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      db.trashDepositItem.groupBy({
        by: ["trashType"],
        where: {
          trashDeposit: { status: Status.APPROVED },
        },
        _sum: { weight: true },
      }),
      db.$queryRaw<{ bulan: number; tahun: number; jumlah: number }[]>`
        SELECT 
          EXTRACT(MONTH FROM "createdAt") AS bulan,
          EXTRACT(YEAR FROM "createdAt") AS tahun,
          COUNT(*) AS jumlah
        FROM "TrashDeposit"
        GROUP BY bulan, tahun
        ORDER BY tahun ASC, bulan ASC;
      `,
    ]);

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

    const totalSampah = totalSampahPerType.map((item) => ({
      type: item.trashType,
      total: item._sum.weight ?? 0,
    }));

    return response(
      200,
      convertBigInt({
        totalUser,
        totalPetugas,
        totalTransaksi,
        totalSampah,
        transaksiPerBulan,
        transaksiStatus,
      }),
    );
  } catch (err) {
    console.error("Error GET /admin/analytics:", err);
    return response(500, "Gagal memuat statistik");
  }
}
