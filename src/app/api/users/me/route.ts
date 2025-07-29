import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return response(401, "Tidak terautentikasi");
    }

    return response(200, user);
  } catch (err) {
    console.error(`Error getting current user : ${(err as Error).message}`);
    return response(500, "Terjadi kesalahan server");
  }
}
