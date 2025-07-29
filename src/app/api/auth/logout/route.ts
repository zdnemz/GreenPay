import { response } from "@/lib/response";

export async function POST() {
  try {
    const res = response(200, "Logout berhasil");

    res.cookies.set({
      name: "auth-token",
      value: "",
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res;
  } catch (error) {
    console.error("Logout error:", error);
    return response(500, "Terjadi kesalahan saat logout");
  }
}
