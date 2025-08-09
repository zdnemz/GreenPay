import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/session";
import { verifySignature } from "@/lib/crypto";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { validate } from "@/lib/validate";
import { submitDepositTrashSchema } from "@/schemas/trash-schema";
import { calculatePoints, pointsToBalance } from "@/lib/points";
import { Status } from "@/generated/prisma/client";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getUserFromSession();

    if (!sessionUser || sessionUser.role !== "PETUGAS") {
      return response(403, "Hanya petugas yang dapat menyerahkan transaksi");
    }

    const data = await req.json();

    const validated = await validate(submitDepositTrashSchema, data);
    if (!validated.success) return response(400, validated.error);

    const { payloadId, userId, trash, signature, status } = validated.data;

    // Validasi signature
    const isValid = verifySignature(payloadId, signature);
    if (!isValid) return response(400, "signature tidak valid");

    // Cek apakah QR code sudah digunakan
    const existing = await db.trashDeposit.findFirst({ where: { signature } });
    if (existing) return response(400, "QR Code sudah digunakan");

    // Hitung poin dan berat
    let points = 0;
    let weight = 0;

    const trashData = trash.map((v) => {
      const currentPoint = calculatePoints(v.trashType, v.weight);
      points += currentPoint;
      weight += v.weight;

      return {
        trashType: v.trashType,
        weight: v.weight,
        points: currentPoint,
      };
    });

    const transaction = await db.trashDeposit.create({
      data: {
        userId: userId,
        petugasId: sessionUser.id,
        signature,
        status: status as Status,
        items: {
          createMany: {
            data: trashData,
          },
        },
      },
      include: {
        items: true,
        petugas: { select: { id: true, name: true } },
      },
    });

    // Tambahkan poin ke user jika disetujui
    if (status === "APPROVED") {
      const balance = pointsToBalance(points);

      await db.user.update({
        where: { id: userId },
        data: {
          points: { increment: points },
          balance: { increment: balance },
        },
      });

      // Buat catatan transaksi saldo (jika dibutuhkan)
      await db.balanceTransaction.create({
        data: {
          userId: userId,
          amount: balance,
          reason: "Setor sampah",
          refType: "REWARD",
          refId: transaction.id,
        },
      });
    }

    return response(201, {
      id: transaction.id,
      status: transaction.status,
      createdAt: transaction.createdAt,
      signature: transaction.signature,
      petugas: transaction.petugas,
      items: transaction.items,
      totalPoints: points,
      totalWeight: weight,
    });
  } catch (error) {
    console.error("trashDeposit submit error:", error);
    return response(500, "Terjadi kesalahan saat verifikasi transaksi");
  }
}
