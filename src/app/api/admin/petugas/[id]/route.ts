import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/session";
import { validate } from "@/lib/validate";
import { PetugasUpdateSchema } from "@/schemas/admin-schema";

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
    return response(401, "Tidak memiliki akses");
  }

  try {
    const { id } = await params;
    const data = await req.json();

    const validated = await validate(PetugasUpdateSchema, data);

    if (!validated.success) {
      return response(400, validated.error);
    }

    const updated = await db.user.update({
      where: { id },
      data: validated.data,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return response(200, updated);
  } catch (error) {
    console.error("Error updating petugas:", error);

    return response(500, "Gagal memperbarui data petugas");
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
      return response(404, "Petugas tidak di temukan");
    }

    if (user.role !== "PETUGAS") {
      return response(403, "Hanya user dengan role: PETUGAS yang bisa dihapus");
    }

    await db.user.delete({ where: { id } });

    return response(200, "Petugas berhasil dihapus");
  } catch (error) {
    console.error("Error deleting petugas:", error);

    return response(500, "Terjadi kesalahan saat menghapus petugas");
  }
}
