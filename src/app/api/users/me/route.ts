import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { response } from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const auth_token = req.cookies.get("auth-token")?.value;

    if (!auth_token) {
      const res = response(401, "Tidak terautentikasi");
      res.cookies.delete("auth-token");

      return res;
    }

    const payload = verifyToken(auth_token);

    if (!payload) {
      const res = response(401, "Tidak terautentikasi");
      res.cookies.delete("auth-token");

      return res;
    }

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return response(404, "Pengguna tidak ditemukan");
    }

    return response(200, user);
  } catch (err) {
    console.error(`error : ${(err as Error).message}`);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return response(401, "Unauthorized");

    const session = verifyToken(token);
    const body = await req.json();

    const { name, email } = body;

    const updatedUser = await db.user.update({
      where: { id: session?.userId },
      data: {
        name,
        email,
      },
      select: { id: true, name: true, email: true },
    });

    return response(200, "Data berhasil diubah : " + updatedUser.name);
  } catch (err) {
    console.error(`error : ${(err as Error).message}`);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return response(401, "Unauthorized");

    const session = verifyToken(token);

    await db.user.delete({ where: { id: session?.userId } });

    // hapus cookie
    const res = response(200, "Akun berhasil dihapus");
    res.cookies.set({
      name: "auth-token",
      value: "",
      maxAge: 0,
    });

    return res;
  } catch (err) {
    console.error(`error : ${(err as Error).message}`);
  }
}
