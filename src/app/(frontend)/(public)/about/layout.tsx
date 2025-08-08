import React from "react";

export const metadata = {
  title: "Tentang Kami | GreenPay",
  description:
    "Kenali GreenPay: platform digital yang memberdayakan masyarakat dalam mengelola sampah dan mendukung ekonomi hijau.",
  alternates: {
    canonical: `${process.env.APP_URL}/about`,
  },
  openGraph: {
    title: "Tentang Kami | GreenPay",
    description:
      "Temui tim di balik GreenPay dan misi kami dalam mewujudkan lingkungan yang lebih bersih dan berkelanjutan.",
    url: `${process.env.APP_URL}/about`,
    siteName: "GreenPay",
    type: "profile",
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
