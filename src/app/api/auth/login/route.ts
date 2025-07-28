import { NextRequest } from "next/server";

import { response } from "@/lib/response";
import { validate } from "@/lib/validate";

import { loginSchema } from "@/schemas/auth-schema";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { APP_ENV } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const validated = await validate(loginSchema, data);

    // jika gagal validasi
    if (!validated.success) {
      return response(400, validated.error);
    }

    const { email, password } = validated.data;

    const user = await db.user.findUnique({
      where: { email },
      select: { password: true, id: true },
    });

    // jika user tidak terdaftar
    if (!user) return response(404, "Pengguna belum terdaftar");

    // compare password dari input dengan password dari database
    const isPasswordMatching = await bcrypt.compare(password, user.password);

    // jika compare tidak cocok
    if (!isPasswordMatching)
      return response(401, "Email atau Password tidak cocok");

    // membuat token jwt
    const token = signToken(user.id);

    // kembalikan response dengan cookies
    const res = response(201, "Login berhasil");
    res.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: APP_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    // menangkap error pada server
    console.error(`error : ${(err as Error).message}`);
    return response(500, "Terjadi kesalahan");
  }
}
