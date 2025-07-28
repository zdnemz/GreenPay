import { verifyToken } from "@/lib/jwt";
import { response } from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;

    // jika token tidak ada
    if (!token) {
      const res = response(401, "Tidak terautentikasi");
      res.cookies.delete("auth-token");

      return res;
    }

    const payload = verifyToken(token);

    // jika tidak ada payload atau tidak terverifikasi
    if (!payload) {
      const res = response(401, "Tidak terautentikasi");
      res.cookies.delete("auth-token");

      return res;
    }

    return response(200, "Terautentikasi");
  } catch (err) {
    // menangkap error pada server
    console.error(`error : ${(err as Error).message}`);
    return response(500, "Terjadi kesalahan");
  }
}
