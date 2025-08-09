import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/session";
import { verifySignature } from "@/lib/crypto";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { validate } from "@/lib/validate";
import { verifyDepositTrashSchema } from "@/schemas/trash-schema";
import { getRedisClient } from "@/lib/redis";
import { TrashPayload } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getUserFromSession();

    if (!sessionUser || sessionUser.role !== "PETUGAS") {
      return response(403, "Hanya petugas yang dapat memverifikasi transaksi");
    }

    const data = await req.json();

    const validated = await validate(verifyDepositTrashSchema, data);
    if (!validated.success) return response(400, validated.error);

    const { payloadId, signature } = validated.data;

    // get payload from redis by payloadId
    const redis = getRedisClient();
    const payloadJSON = await redis.get(payloadId);
    if (!payloadJSON) return response(400, "QR code sudah kedaluwarsa");

    const payload: TrashPayload = JSON.parse(payloadJSON);

    // Validasi signature
    const isValid = verifySignature(payloadId, signature);
    if (!isValid) return response(400, "QR signature tidak valid");

    // Cek timestamp
    const now = Date.now();
    if (now > payload.expiresAt) {
      return response(400, "QR code sudah kedaluwarsa");
    }

    // Cek apakah QR code sudah digunakan
    const existing = await db.trashDeposit.findFirst({
      where: { signature },
    });
    if (existing) {
      return response(400, "QR Code sudah digunakan");
    }

    return response(200, {
      payload: {
        payloadId,
        ...payload,
      },
      signature,
    });
  } catch (error) {
    console.error("trashDeposit verify error:", error);
    return response(500, "Terjadi kesalahan saat verifikasi transaksi");
  }
}
