"use client";

import * as React from "react";
import RootLayout from "@/components/layouts/RootLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { fetcher } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Update() {
  const [isPending, startTransition] = React.useTransition();

  async function handleUpdateRank() {
    startTransition(async () => {
      try {
        await fetcher({
          url: "/api/cron/update-rank",
          method: "post",
          config: { withCredentials: true },
        });
        toast.success("Update rank semua pengguna sukes!");
      } catch (error) {
        console.error("update rank error:", error);
        toast.error((error as Error).message || "Terjadi kesalahan");
      }
    });
  }

  return (
    <RootLayout header={<Navbar />} footer={<Footer />}>
      <section className="space-y-6 py-6">
        <div className="space-y-1 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Manajemen Sistem
          </h1>
          <p className="text-muted-foreground text-sm">
            Fitur ini digunakan untuk memperbarui peringkat seluruh pengguna
            berdasarkan transaksi terkini.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Card className="hover:border-primary p-6 transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="text-primary animate-spin-slow h-5 w-5" />
                Update Rank
              </CardTitle>
              <CardDescription>
                memperbarui ranking user pada leaderboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="relative cursor-pointer bg-[linear-gradient(270deg,var(--chart-1),var(--chart-2),var(--chart-3),var(--chart-4))] bg-[length:200%_200%] shadow transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]"
                onClick={handleUpdateRank}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Mulai Update Rank"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </RootLayout>
  );
}
