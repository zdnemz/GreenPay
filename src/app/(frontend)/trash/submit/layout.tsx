import React from "react";

export const metadata = {
  title: "Submit Setoran Sampah | GreenPay",
  description:
    "Petugas dapat menginput dan submit setoran sampah warga dengan mudah melalui halaman Submit Setoran Sampah GreenPay.",
  alternates: {
    canonical: `${process.env.APP_URL}/trash/submit`,
  },
  openGraph: {
    title: "Submit Setoran Sampah | GreenPay",
    description:
      "Memudahkan petugas dalam mencatat dan mengelola setoran sampah warga dengan fitur submit setoran yang praktis di GreenPay.",
    url: `${process.env.APP_URL}/trash/submit`,
    siteName: "GreenPay",
    type: "website",
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
