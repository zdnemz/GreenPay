import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { response } from "@/lib/response";
import { getUserFromSession } from "@/lib/auth";
import { calculatePoints, POINTS_CONFIG } from "@/lib/points";
import { TrashType, Status } from "@/generated/prisma/client";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getUserFromSession();

    // Validasi user harus PETUGAS
    if (!sessionUser || sessionUser.role !== "PETUGAS") {
      return response(401, "Hanya petugas yang dapat mengakses endpoint ini");
    }

    const body = await req.json();
    const {
      userId,
      trashType,
      weight,
    }: { userId: string; trashType: TrashType; weight: string } = body;

    // Validasi input required
    if (!userId || !trashType || !weight) {
      return response(
        400,
        "Data tidak lengkap. userId, trashType, dan weight wajib diisi",
      );
    }

    // Validasi trashType harus valid enum
    if (!Object.values(TrashType).includes(trashType)) {
      const validTypes = Object.values(TrashType).join(", ");
      return response(400, `Jenis sampah tidak valid. Pilihan: ${validTypes}`);
    }

    // Validasi weight harus number dan dalam range
    const weightNum = parseFloat(weight);
    if (
      isNaN(weightNum) ||
      weightNum < POINTS_CONFIG.MIN_WEIGHT ||
      weightNum > POINTS_CONFIG.MAX_WEIGHT
    ) {
      return response(
        400,
        `Berat sampah harus antara ${POINTS_CONFIG.MIN_WEIGHT}kg - ${POINTS_CONFIG.MAX_WEIGHT}kg`,
      );
    }

    // Cek apakah user exist dan role USER
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, role: true, email: true },
    });

    if (!user) {
      return response(404, "User tidak ditemukan");
    }

    if (user.role !== "USER") {
      return response(
        400,
        "Transaksi hanya bisa dibuat untuk user dengan role USER",
      );
    }

    // Hitung points berdasarkan jenis sampah dan berat
    const points = calculatePoints(trashType, weightNum);

    // Buat transaksi baru dengan status PENDING
    const transaction = await db.transaction.create({
      data: {
        userId,
        petugasId: sessionUser.id,
        trashType,
        points,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            balance: true,
          },
        },
        petugas: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return response(201, {
      message: "Transaksi berhasil dibuat dan menunggu persetujuan",
      transaction: {
        ...transaction,
        weightKg: weightNum,
        pointsPerKg: POINTS_CONFIG.POINTS_PER_KG[trashType],
        estimatedBalance: points * POINTS_CONFIG.POINTS_TO_RUPIAH,
      },
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return response(500, "Terjadi kesalahan saat membuat transaksi");
  }
}

// Lihat semua transaksi untuk petugas
export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getUserFromSession();

    if (!sessionUser || sessionUser.role !== "PETUGAS") {
      return response(401, "Hanya petugas yang dapat mengakses ini");
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "PENDING";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Ambil transaksi dengan filter
    const transactions = await db.transaction.findMany({
      where: {
        ...(status !== "ALL" && { status: status as Status }),
        // Petugas hanya bisa lihat transaksi yang dia handle atau semua jika ADMIN
        ...(sessionUser.role === "PETUGAS" && { petugasId: sessionUser.id }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        petugas: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Hitung total untuk pagination
    const total = await db.transaction.count({
      where: {
        ...(status !== "ALL" && { status: status as Status }),
        ...(sessionUser.role === "PETUGAS" && { petugasId: sessionUser.id }),
      },
    });

    return response(200, {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return response(500, "Terjadi kesalahan saat mengambil data transaksi");
  }
}
