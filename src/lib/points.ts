import { POINTS_PER_KG, POINTS_TO_RUPIAH } from "@/constants";
import { TrashType } from "@/generated/prisma/client";

// Helper function untuk hitung points
export function calculatePoints(
  trashType: TrashType,
  weightKg: number,
): number {
  const pointsPerKg = POINTS_PER_KG[trashType];
  return Math.floor(pointsPerKg * weightKg);
}

// Helper function untuk convert points ke rupiah
export function pointsToBalance(points: number): number {
  return points * POINTS_TO_RUPIAH;
}
