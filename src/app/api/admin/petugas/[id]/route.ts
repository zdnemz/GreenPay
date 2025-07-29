import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const sessionUser = await getUserFromSession();

  if (!sessionUser || sessionUser.role !== "ADMIN") {
    return response(401, "Tidak diizinkan");
  }

  try {
    const petugas = await db.user.findFirst({
      where: {
        id: params.id,
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
  } catch (err) {
    console.error(err);
    return response(500, "Terjadi kesalahan saat mengambil data petugas");
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const sessionUser = await getUserFromSession();

  if (!sessionUser || sessionUser.role !== "ADMIN") {
    return response(401, "Unauthorized");
  }

  const { role } = await req.json();

  if (!role) {
    return response(400, "Role wajib diisi");
  }

  try {
    const updated = await db.user.update({
      where: { id: params.id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return response(200, updated);
  } catch (err) {
    console.error(err);
    return response(500, "Gagal memperbarui data petugas");
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const sessionUser = await getUserFromSession();

  if (!sessionUser || sessionUser.role !== "ADMIN") {
    return response(401, "Tidak diizinkan");
  }

  const { id } = params;

  try {
    const deleted = await db.user.delete({
      where: { id, role: "PETUGAS" },
    });

    return response(200, { id: deleted.id });
  } catch (err) {
    console.error(err);
    return response(500, "Terjadi kesalahan saat menghapus petugas");
  }
}
