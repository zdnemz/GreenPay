"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Recycle, Clock } from "lucide-react";
import RootLayout from "@/components/layouts/RootLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { withAuth } from "@/hoc/withAuth";

export default withAuth(TrashMainPage, undefined, ["USER"]);

function TrashMainPage() {
  return (
    <RootLayout header={<Navbar />} footer={<Footer />}>
      <section className="flex min-h-screen w-full items-center justify-center">
        <Card className="mx-auto max-w-2xl space-y-6 p-6">
          <div>
            <h2 className="text-xl font-semibold">Pengelolaan Sampah</h2>
            <p className="text-muted-foreground text-sm">
              Pilih menu untuk melakukan setor sampah atau melihat riwayat
              transaksi sampah Anda.
            </p>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="flex flex-col items-center p-4 text-center transition hover:shadow-md">
              <Recycle className="text-primary mb-3 h-10 w-10" />
              <h3 className="mb-2 font-semibold">Setor Sampah</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Isi data setoran dan dapatkan QR Code untuk diserahkan ke
                petugas.
              </p>
              <Link href="/trash/deposit" className="w-full">
                <Button className="w-full cursor-pointer bg-[linear-gradient(270deg,var(--chart-1),var(--chart-2),var(--chart-3),var(--chart-4))] bg-[length:200%_200%] shadow transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]">
                  Mulai Setor
                </Button>
              </Link>
            </Card>

            <Card className="flex flex-col items-center p-4 text-center transition hover:shadow-md">
              <Clock className="text-primary mb-3 h-10 w-10" />
              <h3 className="mb-2 font-semibold">Riwayat Sampah</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Lihat catatan semua setoran sampah yang telah Anda lakukan.
              </p>
              <Link href="/trash/history" className="w-full">
                <Button variant="outline" className="w-full cursor-pointer">
                  Lihat Riwayat
                </Button>
              </Link>
            </Card>
          </div>
        </Card>
      </section>
    </RootLayout>
  );
}
