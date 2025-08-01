import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/session";
import { idTransactionSchema } from "@/schemas/transaction-schema";
import { treeifyError } from "zod";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sessionUser = await getUserFromSession();

    if (!sessionUser || sessionUser.role !== "PETUGAS") {
      return response(401, "Hanya petugas yang dapat menolak transaksi");
    }

    const parsed = idTransactionSchema.safeParse(params);
    if (!parsed.success) {
      return response(400, {
        message: "Validasi gagal",
        errors: treeifyError(parsed.error),
      });
    }

    const { id } = parsed.data;

    const transaction = await db.transaction.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true },
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
        "Anda hanya bisa menolak transaksi yang Anda buat sendiri",
      );
    }

    const updatedTransaction = await db.transaction.update({
      where: { id },
      data: { status: "REJECTED" },
      include: {
        user: { select: { id: true, name: true } },
        petugas: { select: { id: true, name: true } },
      },
    });

    return response(200, {
      message: "Transaksi berhasil ditolak.",
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error("Error rejecting transaction:", error);
    return response(500, "Terjadi kesalahan saat menolak transaksi");
  }
}
