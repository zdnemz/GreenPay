import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { response } from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const auth_token = req.cookies.get("auth-token")?.value;

  if (!auth_token) {
    const res = response(401, "Tidak terautentikasi");
    res.cookies.delete("auth-token");

    return res;
  }

  const payload = verifyToken(auth_token);

  // jika tidak ada payload atau tidak terverifikasi
  if (!payload) {
    const res = response(401, "Tidak terautentikasi");
    res.cookies.delete("auth-token");

    return res;
  }

  const user = await db.user.findUnique({
    where: { id: payload?.userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    return response(404, "Pengguna tidak ditemukan");
  }

  return response(200, user);
}
