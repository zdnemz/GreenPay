"use client";

import * as React from "react";
import Footer from "@/components/Footer";
import RootLayout from "@/components/layouts/RootLayout";
import Loading from "@/components/Loading";
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
import { Card } from "@/components/ui/card";
import { EditPetugasDialog } from "@/components/pages/admin/petugas/editPetugas";
import { DeleteUserDialog } from "@/components/pages/admin/users/deleteUser";
import { AddPetugasDialog } from "@/components/pages/admin/petugas/addPetugas";

export default function Petugas() {
  const [petugas, setPetugas] =
    React.useState<(User & { createdAt: Date })[]>();
  const [loading, setLoading] = React.useState(true);
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    let canceled = true;

    if (!canceled) return;
    async function fetchData() {
      try {
        const { data } = await axios.get<ApiResponse>("/api/admin/petugas");
        setPetugas(data.data as (User & { createdAt: Date })[]);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Admin dashboard error:", error);
          toast.error((error.response?.data as ApiResponse).error as string);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => {
      canceled = false;
    };
  }, [refreshKey]);

  if (loading || !petugas) return <Loading />;

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
          <div className="flex justify-end">
            <AddPetugasDialog onSuccess={() => setRefreshKey((k) => k + 1)} />
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
              {petugas.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
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
