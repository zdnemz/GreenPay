import React from "react";

export const metadata = {
  title: "Manajemen User | GreenPay Admin",
  description: "Kelola akun dan tugas User lapangan GreenPay.",
  alternates: {
    canonical: `${process.env.APP_URL}/admin/users`,
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
