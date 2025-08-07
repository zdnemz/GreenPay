import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { response } from "@/lib/response";
import { db } from "@/lib/db";
import { validate } from "@/lib/validate";
import { APP_ENV } from "@/lib/config";
import { signToken } from "@/lib/jwt";
import { registerSchema } from "@/schemas/auth-schema";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const validated = await validate(registerSchema, data);

    // jika gagal validasi
    if (!validated.success) {
      return response(400, validated.error);
    }

    const { name, email, password } = validated.data;

    // check user
    const isUserExist = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (isUserExist) return response(400, "Pengguna sudah terdaftar");

    const SALT_ROUNDS = 12;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // simpan data ke tabel users
    const newUser = await db.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        points: 0,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // membuat token jwt
    const token = signToken(newUser);

    // kembalikan response dengan cookies
    const res = response(201, newUser);

    res.cookies.set({
      name: "auth_token",
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
