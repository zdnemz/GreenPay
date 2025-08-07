import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/session";
import { verifySignature } from "@/lib/crypto";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { validate } from "@/lib/validate";
import { verifyTransactionSchema } from "@/schemas/transaction-schema";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getUserFromSession();

    if (!sessionUser || sessionUser.role !== "PETUGAS") {
      return response(403, "Hanya petugas yang dapat memverifikasi transaksi");
    }

    const data = await req.json();

    const validated = await validate(verifyTransactionSchema, data);
    if (!validated.success) return response(400, validated.error);

    const { payload, signature } = validated.data;

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

    return response(200, {
      payload,
      signature,
    });
  } catch (error) {
    console.error("transaction verify error:", error);
    return response(500, "Terjadi kesalahan saat verifikasi transaksi");
  }
}
