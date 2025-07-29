import { TrashType } from "@/generated/prisma/client";

export const POINTS_CONFIG = {
  // Points per kg untuk setiap jenis sampah
  POINTS_PER_KG: {
    PLASTIC: 15, // 15 points per kg
    PAPER: 8, // 8 points per kg
    METAL: 25, // 25 points per kg
    ORGANIC: 5, // 5 points per kg
    OTHER: 3, // 3 points per kg
  } as Record<TrashType, number>,

  // Conversion rate: 1 point = Rp 100
  POINTS_TO_RUPIAH: 100,

  // Minimum weight untuk transaksi (dalam kg)
  MIN_WEIGHT: 0.1,

  // Maximum weight untuk transaksi (dalam kg)
  MAX_WEIGHT: 100,
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
