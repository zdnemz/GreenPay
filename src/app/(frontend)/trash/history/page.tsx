"use client";

import Footer from "@/components/Footer";
import RootLayout from "@/components/layouts/RootLayout";
import Pagination from "@/components/Pagination";
import SimpleNavbar from "@/components/SimpleNavbar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePagination } from "@/hooks/usePagination";
import { TrashHistoryData } from "@/types";
import * as React from "react";

export default function Transactions() {
  const { data, pagination, handlePageChange } =
    usePagination<TrashHistoryData>({
      apiEndpoint: "/api/trash/history",
    });

  return (
    <RootLayout header={<SimpleNavbar backTo="/trash" />} footer={<Footer />}>
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
                <TableHead>Petugas</TableHead>
                <TableHead>Jenis Sampah</TableHead>
                <TableHead>{"Berat(Kg)"}</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((tx) => {
                  const totalBerat = tx.items.reduce(
                    (sum, item) => sum + item.weight,
                    0,
                  );
                  const totalPoin = tx.items.reduce(
                    (sum, item) => sum + item.points,
                    0,
                  );
                  const jenisSampah = tx.items
                    .map((item) => item.trashType)
                    .join(", ");

                  return (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.id}</TableCell>
                      <TableCell>{tx.petugas?.name ?? "-"}</TableCell>
                      <TableCell>{jenisSampah}</TableCell>
                      <TableCell>{totalBerat}</TableCell>
                      <TableCell>{totalPoin}</TableCell>
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
                        {new Date(tx.createdAt).toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-muted-foreground p-6 text-center"
                  >
                    Tidak ada history
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-center">
          <Pagination
            currentPage={pagination?.page || 1}
            totalPages={pagination?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </RootLayout>
  );
}
