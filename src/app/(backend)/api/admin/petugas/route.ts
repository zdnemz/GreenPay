import { db } from "@/lib/db";
import { getUserFromSession } from "@/lib/session";
import { response } from "@/lib/response";
import { APP_ENV } from "@/lib/config";
import { NextRequest } from "next/server";
import { registerSchema } from "@/schemas/auth-schema";
import { validate } from "@/lib/validate";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  try {
    const user = await getUserFromSession();

    if (!user || user.role !== "ADMIN") {
      return response(401, "Tidak memiliki akses");
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10)),
    );
    const offset = (page - 1) * limit;

    let petugas;
    let total;

    if (q) {
      const keywords = q
        .split(" ")
        .filter(Boolean)
        .map((k) => `%${k}%`);

      const conditions = keywords
        .map((_, i) => `(name ILIKE $${i + 1} OR email ILIKE $${i + 1})`)
        .join(" AND ");

      const values = [...keywords];

      // Query data
      petugas = await db.$queryRawUnsafe(
        `
        SELECT id, name, email, "createdAt"
        FROM "User"
        WHERE role = 'PETUGAS'
        AND ${conditions}
        ORDER BY "createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
        ...values,
      );

      // Query total
      const totalResult = await db.$queryRawUnsafe<{ count: bigint }[]>(
        `
        SELECT COUNT(*) as count
        FROM "User"
        WHERE role = 'PETUGAS'
        AND ${conditions}
      `,
        ...values,
      );

      total = Number(totalResult[0].count);
    } else {
      const [petugasResult, totalResult] = await Promise.all([
        db.user.findMany({
          where: { role: "PETUGAS" },
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          skip: offset,
          take: limit,
        }),
        db.user.count({ where: { role: "PETUGAS" } }),
      ]);

      petugas = petugasResult;
      total = totalResult;
    }

    return response(200, petugas, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error("Error in admin/petugas GET:", error);

    const errorMessage =
      APP_ENV === "development"
        ? `Database error: ${error instanceof Error ? error.message : "Unknown error"}`
        : "Terjadi kesalahan saat mengambil data petugas";

    return response(500, errorMessage);
  }
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
        points: 0,
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
