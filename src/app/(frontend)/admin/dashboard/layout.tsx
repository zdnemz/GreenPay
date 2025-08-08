import React from "react";

export const metadata = {
  title: "Admin Panel | GreenPay",
  description:
    "Panel kontrol untuk manajemen user, petugas, dan data transaksi.",
  alternates: {
    canonical: `${process.env.APP_URL}/admin`,
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
