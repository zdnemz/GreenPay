"use client";

import * as React from "react";

import RootLayout from "@/components/layouts/RootLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import HeroSection from "@/components/pages/home/hero";
import HowItWorksSection from "@/components/pages/home/howItWorks";
import WhyUsSection from "@/components/pages/home/whyUs";
import CTASection from "@/components/pages/home/cta";

export default function Home() {
  return (
    <RootLayout
      className="[&>:first-child]:pt-36 [&>:last-child]:pb-36"
      header={<Navbar />}
      footer={<Footer />}
    >
      <HeroSection />
      <HowItWorksSection />
      <WhyUsSection />
      <CTASection />
    </RootLayout>
  );
}
