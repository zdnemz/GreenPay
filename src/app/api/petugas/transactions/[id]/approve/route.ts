import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/auth";
import { pointsToBalance } from "@/lib/points";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sessionUser = await getUserFromSession();

    // Validasi user harus PETUGAS
    if (!sessionUser || !["PETUGAS"].includes(sessionUser.role)) {
      return response(
        401,
        "Hanya petugas atau admin yang dapat menyetujui transaksi",
      );
    }

    const { id } = await params;

    // Cek apakah transaksi exist dan statusnya PENDING
    const transaction = await db.transaction.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            balance: true,
          },
        },
        petugas: {
          select: {
            id: true,
            name: true,
          },
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

    // Jika petugas, hanya bisa approve transaksi yang dia buat
    if (
      sessionUser.role === "PETUGAS" &&
      transaction.petugasId !== sessionUser.id
    ) {
      return response(
        403,
        "Anda hanya bisa menyetujui transaksi yang Anda buat sendiri",
      );
    }

    // Hitung balance yang akan ditambahkan
    const balanceToAdd = pointsToBalance(transaction.points);

    // Update transaksi dan saldo user dalam satu transaksi database
    const result = await db.$transaction(async (prisma) => {
      // Update status transaksi
      const updatedTransaction = await prisma.transaction.update({
        where: { id },
        data: {
          status: "APPROVED",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              balance: true,
            },
          },
          petugas: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Update saldo user
      const updatedUser = await prisma.user.update({
        where: { id: transaction.userId },
        data: {
          balance: {
            increment: balanceToAdd,
          },
        },
        select: {
          id: true,
          name: true,
          balance: true,
        },
      });

      return { transaction: updatedTransaction, user: updatedUser };
    });

    return response(200, {
      message: `Transaksi berhasil disetujui. Saldo ${result.user.name} bertambah Rp ${balanceToAdd.toLocaleString()}`,
      transaction: result.transaction,
      user: {
        ...result.user,
        previousBalance: transaction.user.balance,
        newBalance: result.user.balance,
        addedBalance: balanceToAdd,
      },
    });
  } catch (error) {
    console.error("Error approving transaction:", error);
    return response(500, "Terjadi kesalahan saat menyetujui transaksi");
  }
}
