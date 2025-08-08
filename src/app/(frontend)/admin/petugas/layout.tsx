import React from "react";

export const metadata = {
  title: "Manajemen Petugas | GreenPay Admin",
  description: "Kelola akun dan tugas petugas lapangan GreenPay.",
  alternates: {
    canonical: `${process.env.APP_URL}/admin/petugas`,
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
