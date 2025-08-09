import React from "react";

export const metadata = {
  title: "Verifikasi Sampah | GreenPay",
  description:
    "Verifikasi setoran sampah warga dengan cepat dan akurat melalui fitur scan QR code di GreenPay.",
  alternates: {
    canonical: `${process.env.APP_URL}/trash/verify`,
  },
  openGraph: {
    title: "Verifikasi Sampah | GreenPay",
    description:
      "Gunakan fitur scan QR code untuk memvalidasi setoran sampah secara realtime di GreenPay. Mendukung gerakan lingkungan bersih.",
    url: `${process.env.APP_URL}/trash/verify`,
    siteName: "GreenPay",
    type: "website",
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
