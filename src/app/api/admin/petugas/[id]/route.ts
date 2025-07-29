import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/auth";
import { Role } from "@/generated/prisma/client";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const sessionUser = await getUserFromSession();

  if (!sessionUser || sessionUser.role !== "ADMIN") {
    return response(401, "Tidak diizinkan");
  }

  try {
    const { id } = await params;

    const petugas = await db.user.findFirst({
      where: {
        id,
        role: "PETUGAS",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!petugas) {
      return response(404, "Petugas tidak ditemukan");
    }

    return response(200, petugas);
  } catch (error) {
    console.error("Error fetching petugas:", error);
    return response(500, "Terjadi kesalahan saat mengambil data petugas");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const sessionUser = await getUserFromSession();

  if (!sessionUser || sessionUser.role !== "ADMIN") {
    return response(401, "Tidak diizinkan");
  }

  try {
    const { id } = await params;
    const { role } = await req.json();

    if (!role) {
      return response(400, "Role wajib diisi");
    }

    // Validasi role dengan mengambil dari Prisma
    const allowedRoles = Object.values(Role);

    if (!allowedRoles.includes(role)) {
      return response(
        400,
        `Role tidak valid. Hanya bisa: ${allowedRoles.join(", ")}`,
      );
    }

    const updated = await db.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return response(200, updated);
  } catch (error) {
    console.error("Error updating petugas:", error);

    return response(500, "Gagal memperbarui data petugas");
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const sessionUser = await getUserFromSession();

  if (!sessionUser || sessionUser.role !== "ADMIN") {
    return response(401, "Tidak diizinkan");
  }

  try {
    const { id } = await params;

    // Cek apakah user yang akan dihapus adalah petugas
    const existingUser = await db.user.findFirst({
      where: { id, role: "PETUGAS" },
      select: { id: true, name: true, role: true },
    });

    if (!existingUser) {
      return response(404, "Petugas tidak ditemukan");
    }

    const deletableRoles = await db.user.findMany({
      select: { role: true },
      distinct: ["role"],
      where: {
        role: {
          not: "ADMIN",
        },
      },
    });

    const allowedDeletableRoles = deletableRoles.map((u) => u.role);

    if (!allowedDeletableRoles.includes(existingUser.role)) {
      return response(
        403,
        `Hanya user dengan role: ${allowedDeletableRoles.join(", ")} yang bisa dihapus`,
      );
    }

    // Hapus user
    const deleted = await db.user.delete({
      where: { id },
    });

    return response(200, {
      id: deleted.id,
      message: `Petugas ${existingUser.name} berhasil dihapus`,
    });
  } catch (error) {
    console.error("Error deleting petugas:", error);

    return response(500, "Terjadi kesalahan saat menghapus petugas");
  }
}
