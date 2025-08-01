import { db } from "@/lib/db";
import { getUserFromSession } from "@/lib/session";
import { response } from "@/lib/response";

export async function GET() {
  try {
    const user = await getUserFromSession();

    // Hanya ADMIN yang boleh akses
    if (!user || user.role !== "ADMIN") {
      return response(401, "Tidak memiliki akses");
    }

    const users = await db.user.findMany({
      where: {
        role: "USER", 
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return response(200, users);
  } catch (err) {
    console.error(`error: ${(err as Error).message}`);
    return response(500, "Terjadi kesalahan saat mengambil data user");
  }
}
