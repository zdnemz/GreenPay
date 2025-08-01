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
import { useLoading } from "@/hooks/useLoading";
import { ApiResponse } from "@/lib/response";
import { TransactionData } from "@/types";
import axios, { AxiosError } from "axios";
import * as React from "react";
import { toast } from "sonner";

export default function Transactions() {
  const [transactions, setTransactions] = React.useState<TransactionData>();
  const { startLoading, stopLoading } = useLoading("user-transaction");

  React.useEffect(() => {
    let canceled = true;

    async function fetchData() {
      if (!canceled) return;

      startLoading();
      try {
        const { data } = await axios.get<ApiResponse>(
          "/api/users/transactions",
        );

        setTransactions(data.data as TransactionData);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Transaction error:", error);
          toast.error((error.response?.data as ApiResponse).error as string);
        }
      } finally {
        stopLoading();
      }
    }

    fetchData();

    return () => {
      canceled = false;
    };
  }, [startLoading, stopLoading]);

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
                        tx.status === "Disetujui"
                          ? "default"
                          : tx.status === "Ditolak"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {tx.status}
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
