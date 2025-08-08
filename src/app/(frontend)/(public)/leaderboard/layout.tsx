import React from "react";

export const metadata = {
  title: "Leaderboard | GreenPay",
  description:
    "Lihat peringkat kontributor terbaik dalam menyelamatkan lingkungan.",
  alternates: {
    canonical: `${process.env.APP_URL}/leaderboard`,
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
