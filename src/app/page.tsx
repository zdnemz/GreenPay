"use client";

import * as React from "react";

import RootLayout from "@/components/layouts/RootLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Hero from "@/components/pages/home/hero";
import HowItWorks from "@/components/pages/home/howItWorks";

export default function Home() {
  return (
    <RootLayout
      className="[&>:first-child]:pt-36 [&>:last-child]:pb-36"
      header={<Navbar />}
      footer={<Footer />}
    >
      <Hero />
      <HowItWorks />
    </RootLayout>
  );
}
