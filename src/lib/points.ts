import { TrashType } from "@/generated/prisma/client";

export const POINTS_CONFIG = {
  // Points per kg untuk setiap jenis sampah
  POINTS_PER_KG: {
    PLASTIC: 10, // Plastik bernilai sedang
    PAPER: 6, // Kertas cenderung murah
    METAL: 20, // Logam punya nilai tinggi
    ORGANIC: 2, // Organik bernilai rendah
    OTHER: 1, // Lain-lain sulit didaur ulang
  } as Record<TrashType, number>,

  // Conversion rate: 1 point = Rp 50
  // Jadi 1 kg plastik = 10 poin = Rp 500
  POINTS_TO_RUPIAH: 50,

  // Minimum weight untuk transaksi (dalam kg)
  MIN_WEIGHT: 0.1,

  // Maximum weight untuk transaksi (dalam kg)
  MAX_WEIGHT: 20, // Batas 20 kg per transaksi lebih realistis & manageable
};

// Helper function untuk hitung points
export function calculatePoints(
  trashType: TrashType,
  weightKg: number,
): number {
  const pointsPerKg = POINTS_CONFIG.POINTS_PER_KG[trashType];
  return Math.floor(pointsPerKg * weightKg);
}

// Helper function untuk convert points ke rupiah
export function pointsToBalance(points: number): number {
  return points * POINTS_CONFIG.POINTS_TO_RUPIAH;
}
