"use client";

import Footer from "@/components/Footer";
import RootLayout from "@/components/layouts/RootLayout";
import Navbar from "@/components/Navbar";
import { QrCode, ShoppingCart, Trash2 } from "lucide-react";
import * as React from "react";

const steps = [
  {
    icon: Trash2,
    title: "Kumpulkan Sampah",
    desc: "Kumpulkan sampah sesuai jenisnya dan pastikan sudah dipilah.",
  },
  {
    icon: QrCode,
    title: "Scan QR",
    desc: "Datang ke mitra GreenPay, scan QR dan dapatkan saldo secara instan.",
  },
  {
    icon: ShoppingCart,
    title: "Tarik atau Belanja",
    desc: "Gunakan saldo untuk belanja digital atau tarik tunai dengan mudah.",
  },
];

export default function HowItWorks() {
  return (
    <RootLayout header={<Navbar />} footer={<Footer />}>
      <section className="space-y-10">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            Bagaimana Cara Kerjanya?
          </h1>
          <p className="text-muted-foreground max-w-md text-sm">
            Ikuti 3 langkah mudah ini untuk menukar sampahmu menjadi saldo
            digital.
          </p>
        </div>

        <div className="space-y-10">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isEven = i % 2 === 0;

            return (
              <div
                key={i}
                className={`flex flex-col items-center gap-6 md:flex-row ${
                  !isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="bg-primary/10 flex items-center justify-center rounded-full p-6 shadow-md">
                  <Icon className="text-primary h-12 w-12" />
                </div>
                <div className="max-w-md text-center md:text-left">
                  <h3 className="mb-2 text-xl font-bold">
                    <span className="text-primary mr-2">0{i + 1}.</span>{" "}
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </RootLayout>
  );
}
