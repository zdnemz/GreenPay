import React from "react";

export const metadata = {
  title: "Menu Setor Sampah | GreenPay",
  description:
    "Akses berbagai fitur setor sampah di GreenPay. Pilih jenis sampah, lihat harga, dan mulai ubah sampah jadi saldo digital.",
  alternates: {
    canonical: `${process.env.APP_URL}/trash`,
  },
  openGraph: {
    title: "Menu Setor Sampah | GreenPay",
    description:
      "Temukan semua fitur setor sampah di GreenPay. Dukung lingkungan bersih sambil mendapatkan saldo digital.",
    url: `${process.env.APP_URL}/trash`,
    siteName: "GreenPay",
    type: "website",
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
