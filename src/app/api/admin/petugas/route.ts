import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { response } from "@/lib/response";
import { db } from "@/lib/db";
import { validate } from "@/lib/validate";
import { registerSchema } from "@/schemas/auth-schema";
import { getUserFromSession } from "@/lib/session";

export async function GET() {
  const sessionUser = await getUserFromSession();

  if (!sessionUser || sessionUser.role !== "ADMIN") {
    return response(401, "Unauthorized");
  }

  const petugas = await db.user.findMany({
    where: { role: "PETUGAS" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return response(200, petugas);
}

export async function POST(req: NextRequest) {
  const sessionUser = await getUserFromSession();

  if (!sessionUser || sessionUser.role !== "ADMIN") {
    return response(401, "Unauthorized");
  }

  try {
    const data = await req.json();

    const validated = await validate(registerSchema, data);
    if (!validated.success) {
      return response(400, validated.error);
    }

    const { name, email, password } = validated.data;

    const isUserExist = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (isUserExist) return response(400, "Pengguna sudah terdaftar");

    const SALT_ROUNDS = 12;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Buat akun PETUGAS
    const newUser = await db.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "PETUGAS",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return response(201, newUser);
  } catch (err) {
    console.error(`error : ${(err as Error).message}`);
    return response(500, "Terjadi kesalahan");
  }
}
