import { AdminAnalyticData } from "@/types";

export const MOCK_ADMIN_DASHBOARD_DATA: AdminAnalyticData = {
  totalUser: 150,
  totalPetugas: 10,
  totalTransaksi: 65,
  totalSampah: [
    { type: "PLASTIC", total: 120 },
    { type: "PAPER", total: 90 },
    { type: "METAL", total: 30 },
    { type: "ORGANIC", total: 50 },
    { type: "OTHER", total: 80 },
  ],
  transaksiPerBulan: [
    { bulan: 8, tahun: 2024, jumlah: 120 },
    { bulan: 9, tahun: 2024, jumlah: 140 },
    { bulan: 10, tahun: 2024, jumlah: 135 },
    { bulan: 11, tahun: 2024, jumlah: 160 },
    { bulan: 12, tahun: 2024, jumlah: 180 },
    { bulan: 1, tahun: 2025, jumlah: 200 },
    { bulan: 2, tahun: 2025, jumlah: 190 },
    { bulan: 3, tahun: 2025, jumlah: 220 },
    { bulan: 4, tahun: 2025, jumlah: 250 },
    { bulan: 5, tahun: 2025, jumlah: 270 },
    { bulan: 6, tahun: 2025, jumlah: 260 },
    { bulan: 7, tahun: 2025, jumlah: 300 },
    { bulan: 8, tahun: 2025, jumlah: 290 },
    { bulan: 9, tahun: 2025, jumlah: 420 },
    { bulan: 10, tahun: 2025, jumlah: 320 },
    { bulan: 11, tahun: 2025, jumlah: 390 },
  ],
  transaksiStatus: {
    approved: 42,
    rejected: 8,
  },
};
