import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { response } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return response(401, "Unauthorized");

    const session = verifyToken(token);
    const user = await db.user.findUnique({
      where: { id: session?.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) return response(404, "User tidak ditemukan");

    return response(200, user);
  } catch (err) {
    return response(500, "Server error");
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
    return response(500, "Server error");
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
    return response(500, "Server error");
  }
}
