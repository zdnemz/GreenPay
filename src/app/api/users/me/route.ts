import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return response(401, "Tidak terautentikasi");
    }

    return response(200, user);
  } catch (_err) {
    console.error(`error : ${(_err as Error).message}`);
    return response(500, "Terjadi kesalahan server");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return response(401, "Unauthorized");

    const session = verifyToken(token);
    if (!session) return response(401, "Invalid token");

    const body = await req.json();
    const { name, email } = body;

    // Validasi input
    if (!name || !email) {
      return response(400, "Name and email are required");
    }

    const updatedUser = await db.user.update({
      where: { id: session.userId },
      data: {
        name,
        email,
      },
      select: { id: true, name: true, email: true, role: true, balance: true },
    });

    return response(200, {
      message: "Data berhasil diubah",
      user: updatedUser,
    });
  } catch (_err) {
    console.error("Error updating user:", _err);
    return response(500, "Server error");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return response(401, "Unauthorized");

    const session = verifyToken(token);
    if (!session) return response(401, "Invalid token");

    await db.user.delete({ where: { id: session.userId } });

    // Hapus cookie
    const res = response(200, "Akun berhasil dihapus");
    res.cookies.set({
      name: "auth-token",
      value: "",
      maxAge: 0,
    });

    return res;
  } catch (_err) {
    console.error("Error deleting user:", _err);
    return response(500, "Server error");
  }
}
