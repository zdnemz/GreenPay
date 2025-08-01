import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/session";
import { pointsToBalance } from "@/lib/points";
import { idTransactionSchema } from "@/schemas/transaction-schema";
import { treeifyError } from "zod";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sessionUser = await getUserFromSession();

    if (!sessionUser || sessionUser.role !== "PETUGAS") {
      return response(401, "Hanya petugas yang dapat menyetujui transaksi");
    }

    // Await params untuk mendapatkan nilai yang sebenarnya
    const resolvedParams = await params;

    // Validasi ID dengan Zod
    const parse = idTransactionSchema.safeParse(resolvedParams);

    if (!parse.success) {
      return response(400, {
        message: "Validasi gagal",
        errors: treeifyError(parse.error),
      });
    }

    const { id } = parse.data;

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

    if (
      sessionUser.role === "PETUGAS" &&
      transaction.petugasId !== sessionUser.id
    ) {
      return response(
        403,
        "Anda hanya bisa menyetujui transaksi yang Anda buat sendiri",
      );
    }

    const balanceToAdd = pointsToBalance(transaction.points);

    const result = await db.$transaction(async (prisma) => {
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
