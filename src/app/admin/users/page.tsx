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
import { ApiResponse } from "@/lib/response";
import { User } from "@/types";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { EditUserDialog } from "@/components/pages/admin/users/editUser";
import { Card } from "@/components/ui/card";
import { DeleteUserDialog } from "@/components/pages/admin/users/deleteUser";
import { useLoading } from "@/hooks/useLoading";

export default function Users() {
  const [users, setUsers] = React.useState<(User & { createdAt: Date })[]>();
  const { startLoading, stopLoading } = useLoading("admin-users");
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    let canceled = true;

    async function fetchData() {
      if (!canceled) return;

      startLoading();
      try {
        const { data } = await axios.get<ApiResponse>("/api/admin/users");
        setUsers(data.data as (User & { createdAt: Date })[]);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Admin dashboard error:", error);
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
  }, [refreshKey, startLoading, stopLoading]);

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <EditUserDialog
                      user={user}
                      onSuccess={() => setRefreshKey((k) => k + 1)}
                    />
                    <DeleteUserDialog
                      user={user}
                      onSuccess={() => setRefreshKey((k) => k + 1)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>
    </RootLayout>
  );
}
