import { response } from "@/lib/response";
import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { db } from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";
import { UserData } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      const res = response(401, "Tidak terautentikasi");
      res.cookies.delete("auth_token");

      return res;
    }

    const payload = verifyToken(token);

    if (!payload) {
      const res = response(401, "Tidak terautentikasi");
      res.cookies.delete("auth_token");

      return res;
    }

    const user = await db.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        role: true,
        createdAt: true,
      },
    });

    // dummy
    // const user: UserData = {
    //   id: "user_12345",
    //   name: "John Doe",
    //   email: "johndoe@example.com",
    //   balance: new Decimal(150000),
    //   role: "USER",
    //   createdAt: new Date("2024-05-01T10:30:00Z"),
    // };

    if (!user) {
      return response(404, "Pengguna tidak ditemukan");
    }

    return response(200, user);
  } catch (err) {
    console.error(`Error getting current user : ${(err as Error).message}`);
    return response(500, "Terjadi kesalahan server");
  }
}
