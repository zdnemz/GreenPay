import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/session";
import { validate } from "@/lib/validate";
import { prepareDepositTrashSchema } from "@/schemas/trash-schema";
import { generateSignature } from "@/lib/crypto";
import { NextRequest } from "next/server";
import { QR_CODE_EXPIRATION } from "@/constants";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getUserFromSession();

    if (!sessionUser || sessionUser.role !== "USER") {
      return response(401, "Hanya user yang dapat mengakses endpoint ini");
    }

    const data = await req.json();

    const validated = await validate(prepareDepositTrashSchema, data);
    if (!validated.success) return response(400, validated.error);

    const trash = validated.data.trash;

    const timestamp = Date.now();
    const expiresAt = timestamp + QR_CODE_EXPIRATION;

    const qrPayload = {
      userId: sessionUser.id,
      trash,
      timestamp,
      expiresAt,
    };

    const signature = generateSignature(qrPayload);

    return response(201, {
      payload: qrPayload,
      signature,
    });
  } catch (error) {
    console.error("Error generate Transaction:", error);
    return response(500, "Terjadi kesalahan saat membuat QR");
  }
}
