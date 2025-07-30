"use client";

import * as React from "react";
import RootLayout from "@/components/layouts/RootLayout";
import { useAuthUser } from "@/store/auth-store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AdminAnalyticData } from "@/types";
import { ApiResponse } from "@/lib/response";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import TransactionGraphics from "@/components/pages/admin/dashboard/transactionChart";
import TransactionStatusChart from "@/components/pages/admin/dashboard/transactionStatusChart";
import { APP_ENV } from "@/lib/config";
import TrashTypeTotalChart from "@/components/pages/admin/dashboard/trashTypeTotalChart";
import Statistic from "@/components/pages/admin/dashboard/statictic";

// mock data for development
const MOCK_DATA: AdminAnalyticData | null =
  APP_ENV === "development"
    ? {
        totalUser: 150,
        totalPetugas: 10,
        totalTransaksi: 65,
        totalSampah: [
          { type: "Plastik", total: 120 },
          { type: "Kertas", total: 90 },
          { type: "Logam", total: 30 },
          { type: "Kaca", total: 50 },
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
          pending: 15,
          approved: 42,
          rejected: 8,
        },
      }
    : null;

export default function Dashboard() {
  const user = useAuthUser();

  const [analytics, setanalytics] = React.useState<AdminAnalyticData>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let canceled = true;

    if (!canceled) return;
    async function fetchData() {
      try {
        if (APP_ENV == "development") {
          setanalytics(MOCK_DATA as AdminAnalyticData);
          return;
        }

        const { data } = await axios.get<ApiResponse>("/api/admin/analytics");

        setanalytics(data.data as AdminAnalyticData);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Admin dashboard error:", error);
          toast.error((error.response?.data as ApiResponse).error as string);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      canceled = false;
    };
  }, []);

  if (loading || !analytics) return <Loading />;

  return (
    <RootLayout header={<Navbar />} footer={<Footer />}>
      <section className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold">
            Halo Admin, <span className="text-primary">{user?.name}</span>!
          </h3>
        </div>

        {/* content */}
        <div className="space-y-6">
          <Statistic data={analytics} />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <TransactionGraphics data={analytics.transaksiPerBulan} />
            </div>
            <div className="md:col-span-1">
              <TransactionStatusChart data={analytics.transaksiStatus} />
            </div>
            <div className="md:col-span-1">
              <TrashTypeTotalChart data={analytics.totalSampah} />
            </div>
          </div>
        </div>
      </section>
    </RootLayout>
  );
}
