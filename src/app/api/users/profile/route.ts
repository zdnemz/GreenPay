import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { response } from "@/lib/response";
import { NextRequest } from "next/server";
import { validate } from "@/lib/validate";
import { updateUserSchema } from "@/schemas/user-schema";

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return response(401, "Unauthorized");

    const session = verifyToken(token);
    if (!session) return response(401, "Invalid token");

    const data = await req.json();

    console.log(data);

    const validated = await validate(updateUserSchema, data);
    if (!validated.success) {
      return response(400, validated.error);
    }

    const { name, email } = validated.data;

    // Cek apakah email ingin diubah
    if (email) {
      const isEmailExist = await db.user.count({
        where: {
          email,
          NOT: { id: session.id },
        },
      });

      if (isEmailExist) return response(400, "Email sudah terdaftar");
    }

    await db.user.update({
      where: { id: session.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    return response(200, "Profil berhasil diupdate");
  } catch (err) {
    console.error(`Error updating user : ${(err as Error).message}`);
    return response(500, "Server error");
  }
}
