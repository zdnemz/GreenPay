"use client";

import * as React from "react";
import Footer from "@/components/Footer";
import RootLayout from "@/components/layouts/RootLayout";
import Navbar from "@/components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/types";
import { Card } from "@/components/ui/card";
import { EditPetugasDialog } from "@/components/pages/admin/petugas/editPetugas";
import { DeletePetugasDialog } from "@/components/pages/admin/petugas/deletePetugas";
import { AddPetugasDialog } from "@/components/pages/admin/petugas/addPetugas";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/useSearch";
import { withSuspense } from "@/hoc/withSuspense";

export default withSuspense(Petugas);

function Petugas() {
  const {
    data: petugas,
    pagination,
    searchInput,
    handleSearchInputChange,
    handlePageChange,
    refreshData,
  } = useSearch<(User & { createdAt: Date })[]>({
    apiEndpoint: "/api/admin/petugas",
    loadingKey: "admin-petugas",
    debounceMs: 500,
  });

  const handlePetugasUpdate = React.useCallback(() => {
    refreshData();
  }, [refreshData]);

  const handlePetugasDelete = React.useCallback(() => {
    refreshData();
  }, [refreshData]);

  return (
    <RootLayout header={<Navbar />} footer={<Footer />}>
      <section className="space-y-6 px-4 py-6 md:px-8">
        <div>
          <h3 className="text-xl font-semibold md:text-2xl">Daftar Pengguna</h3>
          <p className="text-muted-foreground text-sm md:text-base">
            Kelola data pengguna yang terdaftar dalam sistem. Lihat informasi
            akun, ubah data pengguna, atau hapus pengguna jika diperlukan.
          </p>
        </div>

        <Card className="gap-3 p-6 shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]">
          <div className="grid w-full gap-3 md:flex md:justify-between">
            {/* Search Input */}
            <form
              className="flex w-full items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                placeholder="Cari nama atau email..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className="w-full max-w-md"
              />
            </form>
            <AddPetugasDialog onSuccess={handlePetugasUpdate} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {petugas?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <span className="block max-w-20 truncate overflow-hidden text-ellipsis whitespace-nowrap">
                      {user.id}
                    </span>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <EditPetugasDialog
                      petugas={user}
                      onSuccess={handlePetugasUpdate}
                    />
                    <DeletePetugasDialog
                      petugas={user}
                      onSuccess={handlePetugasDelete}
                    />
                  </TableCell>
                </TableRow>
              ))}
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
