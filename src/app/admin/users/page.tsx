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
import { EditUserDialog } from "@/components/pages/admin/users/editUser";
import { Card } from "@/components/ui/card";
import { DeleteUserDialog } from "@/components/pages/admin/users/deleteUser";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/useSearch";

export default function Users() {
  const {
    data: users,
    pagination,
    searchInput,
    handleSearchInputChange,
    handlePageChange,
    refreshData,
  } = useSearch<(User & { createdAt: Date })[]>({
    apiEndpoint: "/api/admin/users",
    loadingKey: "admin-users",
    debounceMs: 500,
  });

  // Event handlers untuk user actions
  const handleUserUpdate = React.useCallback(() => {
    refreshData();
  }, [refreshData]);

  const handleUserDelete = React.useCallback(() => {
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

        <Card className="p-6 shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]">
          <div className="grid w-full gap-3 md:flex md:justify-between">
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
          </div>

          {users?.length === 0 && !searchInput ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <p className="text-muted-foreground">Belum ada data pengguna</p>
            </div>
          ) : users?.length === 0 && searchInput ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <p className="text-muted-foreground">
                {`Tidak ditemukan pengguna dengan kata kunci "${searchInput}"`}
              </p>
            </div>
          ) : (
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
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-sm">
                      {user.id}
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
                      <EditUserDialog
                        user={user}
                        onSuccess={handleUserUpdate}
                      />
                      <DeleteUserDialog
                        user={user}
                        onSuccess={handleUserDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </section>
    </RootLayout>
  );
}
