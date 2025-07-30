import React from "react";

export const metadata = {
  title: "Daftar | GreenPay",
  description: "Buat akun GreenPay dan mulai ubah sampah jadi saldo.",
  alternates: {
    canonical: `${process.env.APP_URL}/register`,
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
