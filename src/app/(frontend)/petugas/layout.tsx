import React from "react";

export const metadata = {
  title: "Dashboard Petugas | GreenPay",
  description:
    "Dashboard khusus petugas GreenPay untuk verifikasi setoran sampah, memantau riwayat transaksi, dan proses withdraw saldo.",
  alternates: {
    canonical: `${process.env.APP_URL}/petugas/dashboard`,
  },
  openGraph: {
    title: "Dashboard Petugas | GreenPay",
    description:
      "Kelola dan verifikasi setoran sampah dengan efisien melalui dashboard petugas GreenPay. Pantau riwayat transaksi dan proses penarikan saldo.",
    url: `${process.env.APP_URL}/petugas/dashboard`,
    siteName: "GreenPay",
    type: "website",
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
