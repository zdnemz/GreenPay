import React from "react";

export const metadata = {
  title: "Login | GreenPay",
  description: "Masuk ke akun GreenPay Anda untuk mulai menukar sampah.",
  alternates: {
    canonical: `${process.env.APP_URL}/login`,
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
