import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sessionUser = await getUserFromSession();

    // Validasi hanya PETUGAS yang boleh reject
    if (!sessionUser || !["PETUGAS"].includes(sessionUser.role)) {
      return response(
        401,
        "Hanya petugas atau admin yang dapat menolak transaksi",
      );
    }

    const { id } = await params;

    // Cek apakah transaksi exist dan masih PENDING
    const transaction = await db.transaction.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
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

    // Petugas hanya bisa menolak transaksi yang dia buat
    if (
      sessionUser.role === "PETUGAS" &&
      transaction.petugasId !== sessionUser.id
    ) {
      return response(
        403,
        "Anda hanya bisa menolak transaksi yang Anda buat sendiri",
      );
    }

    // Update status transaksi menjadi REJECTED
    const updatedTransaction = await db.transaction.update({
      where: { id },
      data: {
        status: "REJECTED",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
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

    return response(200, {
      message: `Transaksi berhasil ditolak.`,
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error("Error rejecting transaction:", error);
    return response(500, "Terjadi kesalahan saat menolak transaksi");
  }
}
