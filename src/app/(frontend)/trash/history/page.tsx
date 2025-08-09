"use client";

import Footer from "@/components/Footer";
import RootLayout from "@/components/layouts/RootLayout";
import Pagination from "@/components/Pagination";
import SimpleNavbar from "@/components/SimpleNavbar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { withAuth } from "@/hoc/withAuth";
import { withSuspense } from "@/hoc/withSuspense";
import { usePagination } from "@/hooks/usePagination";
import { useAuthUser } from "@/stores/auth-store";
import { TrashHistoryData } from "@/types";
import * as React from "react";

export default withAuth(withSuspense(TrashHistoryPage), undefined, [
  "USER",
  "PETUGAS",
]);

// const statusOptions = [
//   { label: "Semua", value: "ALL" },
//   { label: "Disetujui", value: "APPROVED" },
//   { label: "Ditolak", value: "REJECTED" },
// ];

function TrashHistoryPage() {
  // const [statusFilter, setStatusFilter] = React.useState("");

  const { data, pagination, handlePageChange } =
    usePagination<TrashHistoryData>({
      apiEndpoint: "/api/trash/history",
    });

  const user = useAuthUser();

  return (
    <RootLayout header={<SimpleNavbar />} footer={<Footer />}>
      <section className="grid space-y-6">
        <div>
          <h3 className="text-2xl font-semibold">Riwayat Transaksi</h3>
          <p className="text-muted-foreground text-sm">
            Semua aktivitas penukaran sampah yang kamu lakukan tercatat di sini.
            Cek jenis sampah, jumlah poin yang kamu dapat, serta status
            verifikasi dari petugas.
          </p>
        </div>

        <Card className="p-6 shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]">
          {/* <div className="flex flex-wrap items-end gap-4">
            <div>
              <label
                htmlFor="statusFilter"
                className="text-muted-foreground ml-2 text-sm"
              >
                Status
              </label>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger id="statusFilter" className="w-[180px]">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div> */}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>
                  {user?.role === "PETUGAS" ? "Pengguna" : "Petugas"}
                </TableHead>
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
                      <TableCell>
                        <span className="block max-w-20 truncate overflow-hidden text-ellipsis whitespace-nowrap">
                          {tx.id}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user?.role === "PETUGAS"
                          ? tx.user.name
                          : (tx.petugas?.name ?? "-")}
                      </TableCell>
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
        </Card>
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
