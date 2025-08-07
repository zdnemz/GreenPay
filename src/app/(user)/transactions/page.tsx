"use client";

import Footer from "@/components/Footer";
import RootLayout from "@/components/layouts/RootLayout";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/useFetch";
import { TransactionData } from "@/types";
import * as React from "react";

export default function Transactions() {
  const { data: transactions } = useFetch<TransactionData>({
    url: "/api/users/transactions",
    fetcherParams: {
      method: "get",
      config: { withCredentials: true },
    },
    immediate: true,
  });

  return (
    <RootLayout header={<Navbar />} footer={<Footer />}>
      <section className="grid space-y-6">
        <div>
          <h3 className="text-2xl font-semibold">Riwayat Transaksi</h3>
          <p className="text-muted-foreground text-sm">
            Semua aktivitas penukaran sampah yang kamu lakukan tercatat di sini.
            Cek jenis sampah, jumlah poin yang kamu dapat, serta status
            verifikasi dari petugas.
          </p>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Petugas</TableHead>
                <TableHead>Jenis Sampah</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.data.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.id}</TableCell>
                  <TableCell>{tx.userId}</TableCell>
                  <TableCell>{tx.petugasId}</TableCell>
                  <TableCell>{tx.trashType}</TableCell>
                  <TableCell>{tx.points}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tx.status === "APPROVED" ? "default" : "destructive"
                      }
                    >
                      {tx.status === "APPROVED" ? "Disetujui" : "Ditolak"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {tx.createdAt.toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "medium",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </RootLayout>
  );
}
