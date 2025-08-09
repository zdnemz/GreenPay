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
import { withSuspense } from "@/hoc/withSuspense";
import { usePagination } from "@/hooks/usePagination";
import { BalanceHistoryData } from "@/types";
import * as React from "react";

export default withSuspense(BalanceHistoryPage);

function BalanceHistoryPage() {
  const { data, pagination, handlePageChange } =
    usePagination<BalanceHistoryData>({
      apiEndpoint: "/api/balance/history",
    });

  return (
    <RootLayout
      header={<SimpleNavbar backTo="/dashboard" />}
      footer={<Footer />}
    >
      <section className="grid space-y-6">
        <div>
          <h3 className="text-2xl font-semibold">Riwayat Saldo</h3>
          <p className="text-muted-foreground text-sm">
            Semua transaksi saldo kamu tercatat di sini, termasuk penambahan dan
            pengurangan saldo.
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Alasan</TableHead>
                <TableHead>Tipe Referensi</TableHead>
                <TableHead>Ref ID</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <span className="block max-w-20 truncate overflow-hidden text-ellipsis whitespace-nowrap">
                        {tx.id}
                      </span>
                    </TableCell>
                    <TableCell
                      className={
                        Number(tx.amount) > 0
                          ? "text-primary"
                          : "text-destructive"
                      }
                    >
                      {Number(tx.amount) > 0 ? "+" : ""}
                      {Number(tx.amount).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>{tx.reason}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{tx.refType}</Badge>
                    </TableCell>
                    <TableCell>{tx.refId ?? "-"}</TableCell>
                    <TableCell>
                      {new Date(tx.createdAt).toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground p-6 text-center"
                  >
                    Tidak ada riwayat saldo
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
