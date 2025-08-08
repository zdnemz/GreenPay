import React from "react";

export const metadata = {
  title: "Histori Setor Sampah | GreenPay",
  description:
    "Lihat riwayat setor sampah Anda di GreenPay. Pantau jumlah sampah yang disetorkan dan saldo digital yang diperoleh.",
  alternates: {
    canonical: `${process.env.APP_URL}/trash/history`,
  },
  openGraph: {
    title: "Histori Setor Sampah | GreenPay",
    description:
      "Pantau histori setor sampah Anda di GreenPay. Cek total sampah dan saldo digital yang berhasil dikumpulkan.",
    url: `${process.env.APP_URL}/trash/history`,
    siteName: "GreenPay",
    type: "website",
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
