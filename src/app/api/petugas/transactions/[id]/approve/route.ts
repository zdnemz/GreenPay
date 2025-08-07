import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/session";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sessionUser = await getUserFromSession();

    if (!sessionUser || sessionUser.role !== "PETUGAS") {
      return response(401, "Hanya petugas yang dapat menyetujui transaksi");
    }

    const { id } = await params;

    const transaction = await db.transaction.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, points: true },
        },
        petugas: {
          select: { id: true, name: true },
        },
      },
    });

    if (!transaction) {
      return response(404, "Transaksi tidak ditemukan");
    }

    if (transaction.status !== "PENDING") {
      return response(
        400,
        `Transaksi sudah ${transaction.status.toLowerCase()}, tidak bisa diubah lagi`,
      );
    }

    if (transaction.petugasId !== sessionUser.id) {
      return response(
        403,
        "Anda hanya bisa menyetujui transaksi yang Anda buat sendiri",
      );
    }

    const result = await db.$transaction(async (prisma) => {
      const updatedTransaction = await prisma.transaction.update({
        where: { id },
        data: { status: "APPROVED" },
        include: {
          user: {
            select: { id: true, name: true },
          },
          petugas: {
            select: { id: true, name: true },
          },
        },
      });

      await prisma.user.update({
        where: { id: transaction.userId },
        data: {
          points: { increment: transaction.points },
        },
        select: {
          id: true,
          name: true,
          points: true,
        },
      });

      return updatedTransaction;
    });

    return response(200, result);
  } catch (error) {
    console.error("Error approving transaction:", error);
    return response(500, "Terjadi kesalahan saat menyetujui transaksi");
  }
}
