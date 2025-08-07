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
      return response(401, "Hanya petugas yang dapat menolak transaksi");
    }

    const { id } = await params;

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

    const updated = await db.transaction.update({
      where: { id },
      data: { status: "REJECTED" },
      include: {
        user: { select: { id: true, name: true } },
        petugas: { select: { id: true, name: true } },
      },
    });

    return response(200, {
      updated,
    });
  } catch (error) {
    console.error("Error rejecting transaction:", error);
    return response(500, "Terjadi kesalahan saat menolak transaksi");
  }
}
