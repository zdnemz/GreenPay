import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/session";
import { verifySignature } from "@/lib/crypto";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { validate } from "@/lib/validate";
import { verifyTransactionSchema } from "@/schemas/transaction-schema";
import { calculatePoints } from "@/lib/points";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getUserFromSession();

    if (!sessionUser || sessionUser.role !== "PETUGAS") {
      return response(403, "Hanya petugas yang dapat menyerahkan transaksi");
    }

    const data = await req.json();

    const validated = await validate(verifyTransactionSchema, data);
    if (!validated.success) return response(400, validated.error);

    const { payload, signature, status } = validated.data;

    // Validasi signature
    const isValid = verifySignature(payload, signature);
    if (!isValid) return response(400, "QR signature tidak valid");

    // Cek timestamp
    const now = Date.now();
    if (now > payload.expiresAt) {
      return response(400, "QR code sudah kedaluwarsa");
    }

    // cek apakah qr sudah digunakan
    const existing = await db.transaction.findFirst({ where: { signature } });
    if (existing) return response(400, "QR Code sudah digunakan");

    let points = 0;
    let weight = 0;

    const trashData = payload.trash.map((v) => {
      const currentPoint = calculatePoints(v.trashType, v.weight);

      points = points + currentPoint;
      weight = weight + v.weight;

      return {
        ...v,
        points: currentPoint,
      };
    });

    const transaction = await db.transaction.create({
      data: {
        userId: payload.userId,
        petugasId: sessionUser.id,
        signature,
        status,
        items: {
          createMany: {
            data: trashData,
          },
        },
      },
    });

    // if approved add user point
    if (status === "APPROVED") {
      await db.user.update({
        where: { id: payload.userId },
        data: {
          points: { increment: points },
        },
      });
    }

    return response(201, { ...transaction, points, weight });
  } catch (error) {
    console.error("transaction submit error:", error);
    return response(500, "Terjadi kesalahan saat verifikasi transaksi");
  }
}
