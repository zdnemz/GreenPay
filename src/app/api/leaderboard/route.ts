import { db } from "@/lib/db";
import { getUserFromSession } from "@/lib/auth";
import { response } from "@/lib/response";

export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user) return response(401, "Tidak terautentikasi");

    const allUsers = await db.user.findMany({
      where: { role: "USER" },
      include: {
        transactions: { select: { points: true } },
      },
    });

    const ranked = allUsers
      .map((u) => ({
        id: u.id,
        name: u.name,
        role: u.role,
        points: u.transactions.reduce((sum, t) => sum + t.points, 0),
      }))
      .sort((a, b) => b.points - a.points)
      .map((u, i) => ({ ...u, rank: i + 1 }));

    const myRank = user.role === "USER"
      ? ranked.find((u) => u.id === user.id)
      : null;

    return response(200,{
      users: ranked,
      myRank: myRank?.rank ?? null,
      myPoints: myRank?.points ?? 0,
      role: user.role,
    });
  } catch (err) {
    console.error(`error: ${(err as Error).message}`);
    return response(500, "Terjadi kesalahan saat mengambil peringkat");
  }
}
