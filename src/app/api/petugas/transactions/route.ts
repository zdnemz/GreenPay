import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/session";
import { calculatePoints, POINTS_CONFIG } from "@/lib/points";
import { createTransactionSchema } from "@/schemas/transaction-schema";
import { validate } from "@/lib/validate";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getUserFromSession();

    if (!sessionUser || sessionUser.role !== "PETUGAS") {
      return response(401, "Hanya petugas yang dapat mengakses endpoint ini");
    }

    const data = await req.json();
    const validated = await validate(createTransactionSchema, data);

    if (!validated.success) {
      return response(400, validated.error);
    }

    const { userId, trashType, weight } = validated.data;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, role: true, email: true },
    });

    if (!user) {
      return response(404, "User tidak ditemukan");
    }

    if (user.role !== "USER") {
      return response(
        400,
        "Transaksi hanya bisa dibuat untuk user dengan role USER",
      );
    }

    const points = calculatePoints(trashType, weight);

    const transaction = await db.transaction.create({
      data: {
        userId,
        petugasId: sessionUser.id,
        trashType,
        points,
        status: "PENDING",
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, balance: true },
        },
        petugas: {
          select: { id: true, name: true },
        },
      },
    });

    return response(201, {
      message: "Transaksi berhasil dibuat dan menunggu persetujuan",
      transaction: {
        ...transaction,
        weightKg: weight,
        pointsPerKg: POINTS_CONFIG.POINTS_PER_KG[trashType],
        estimatedBalance: points * POINTS_CONFIG.POINTS_TO_RUPIAH,
      },
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return response(500, "Terjadi kesalahan saat membuat transaksi");
  }
}
