import React from "react";

export const metadata = {
  title: "Setor Sampah | GreenPay",
  description:
    "Setor sampah Anda di GreenPay dan ubah menjadi saldo digital. Ikut serta dalam gerakan peduli lingkungan dan dapatkan manfaatnya.",
  alternates: {
    canonical: `${process.env.APP_URL}/trash/desosit`,
  },
  openGraph: {
    title: "Setor Sampah | GreenPay",
    description:
      "Setorkan sampah dengan mudah melalui GreenPay. Dukung lingkungan bersih sambil mendapatkan saldo digital.",
    url: `${process.env.APP_URL}/trash/desosit`,
    siteName: "GreenPay",
    type: "website",
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
