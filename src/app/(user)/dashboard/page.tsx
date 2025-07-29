"use client";

import * as React from "react";
import RootLayout from "@/components/layouts/RootLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Dashboard() {
  return (
    <RootLayout header={<Navbar />} footer={<Footer />}>
      <h1>Hello World</h1>
    </RootLayout>
  );
}
