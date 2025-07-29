import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { getUserFromSession } from "@/lib/auth";
import { response } from "@/lib/response";
import { Role } from "@/generated/prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sessionUser = await getUserFromSession();

    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return response(401, "Unauthorized");
    }

    const { id } = await params;

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return response(404, "User not found");
    }

    return response(200, user);
  } catch (error) {
    console.error("GET /admin/users/[id] error:", error);
    return response(500, "Something went wrong");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const sessionUser = await getUserFromSession();

  if (!sessionUser || sessionUser.role !== "ADMIN") {
    return response(401, "Tidak memiliki akses");
  }

  try {
    const { id } = await params;
    const { role } = await req.json();

    if (!role) {
      return response(400, "Field role wajib diisi");
    }

    const allowedRoles = Object.values(Role);

    if (!allowedRoles.includes(role)) {
      return response(
        400,
        `Role tidak valid. Hanya bisa: ${allowedRoles.join(", ")}`,
      );
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return response(200, updatedUser);
  } catch (error) {
    console.error("Error saat update role:", error);

    return response(500, "Terjadi kesalahan pada server");
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const sessionUser = await getUserFromSession();

  if (!sessionUser || sessionUser.role !== "ADMIN") {
    return response(401, "Unauthorized");
  }

  try {
    const { id } = await params;

    const user = await db.user.findUnique({ where: { id } });

    if (!user) {
      return response(404, "User tidak di temukan");
    }

    // Validasi role yang bisa dihapus dengan query dari database
    const deletableRoles = await db.user.findMany({
      select: { role: true },
      distinct: ["role"],
      where: {
        role: {
          not: "ADMIN", // Tidak bisa hapus ADMIN
        },
      },
    });

    const allowedDeletableRoles = deletableRoles.map((u) => u.role);

    if (!allowedDeletableRoles.includes(user.role)) {
      return response(
        403,
        `Hanya user dengan role: ${allowedDeletableRoles.join(", ")} yang bisa dihapus`,
      );
    }

    await db.user.delete({ where: { id } });

    return response(200, "User berhasil dihapus");
  } catch (error) {
    console.error("Error deleting user:", error);

    return response(500, "Terjadi kesalahan saat menghapus user");
  }
}
