import { TrashType } from "@/generated/prisma";

// QR Code hanya berlaku 10 menit
export const QR_CODE_EXPIRATION = 600_000; // 10 minutes

// Points per kg untuk setiap jenis sampah (disesuaikan harga pasar rata-rata)
export const POINTS_PER_KG: Record<TrashType, number> = {
  PLASTIC: 10, // Plastik bernilai sedang
  PAPER: 5, // Kertas sekitar setengah nilai plastik
  METAL: 25, // Logam punya nilai sangat tinggi
  ORGANIC: 2, // Organik bernilai rendah
  OTHER: 1, // Lain-lain sulit didaur ulang
};

// Conversion rate: 1 point = Rp 50
export const POINTS_TO_RUPIAH = 50;

// Minimum berat (kg) per transaksi
export const MIN_WEIGHT = 0.1;

// Maximum berat (kg) per transaksi
export const MAX_WEIGHT = 20;
