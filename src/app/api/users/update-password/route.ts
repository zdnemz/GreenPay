import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { response } from "@/lib/response";
import { verifyToken } from "@/lib/jwt";
import { validate } from "@/lib/validate";
import { changePasswordSchema } from "@/schemas/auth-schema";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return response(401, "Unauthorized");

    const session = verifyToken(token);
    if (!session) return response(401, "Unauthorized");

    const data = await req.json();
    const validated = await validate(changePasswordSchema, data);

    if (!validated.success) {
      return response(400, validated.error);
    }

    const { oldPassword, newPassword } = validated.data;

    const user = await db.user.findUnique({
      where: { id: session.id },
    });

    if (!user) return response(404, "User tidak ditemukan");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return response(400, "Password lama salah");

    const hashed = await bcrypt.hash(newPassword, 12);

    await db.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return response(200, "Password berhasil diperbarui");
  } catch (err) {
    console.error(err);
    return response(500, "Terjadi kesalahan server");
  }
}
