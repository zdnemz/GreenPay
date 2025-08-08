import React from "react";

export const metadata = {
  title: "Dashboard | GreenPay",
  description:
    "Pantau saldo, riwayat transaksi, dan progress penukaran sampah Anda.",
  alternates: {
    canonical: `${process.env.APP_URL}/dashboard`,
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
