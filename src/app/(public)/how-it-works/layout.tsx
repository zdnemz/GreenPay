import React from "react";

export const metadata = {
  title: "Cara Kerja | GreenPay",
  description:
    "Pelajari bagaimana GreenPay mengubah sampah Anda menjadi saldo digital dengan sistem yang transparan dan efisien.",
  alternates: {
    canonical: `${process.env.APP_URL}/how-it-works`,
  },
  openGraph: {
    title: "Cara Kerja | GreenPay",
    description:
      "Jelajahi langkah-langkah penukaran sampah menjadi saldo digital dengan GreenPay.",
    url: `${process.env.APP_URL}/how-it-works`,
    siteName: "GreenPay",
    type: "article",
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
