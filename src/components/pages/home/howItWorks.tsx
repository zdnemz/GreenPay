import { Card, CardContent } from "@/components/ui/card";
import { QrCode, ShoppingCart, Trash2 } from "lucide-react";
import * as React from "react";

const steps = [
  {
    icon: <Trash2 className="text-primary h-10 w-10" />,
    title: "Kumpulkan Sampah",
    desc: "Kumpulkan sampah sesuai jenisnya",
  },
  {
    icon: <QrCode className="text-primary h-10 w-10" />,
    title: "Scan QR",
    desc: "Datang ke mitra GreenPay, scan QR, saldo langsung masuk",
  },
  {
    icon: <ShoppingCart className="text-primary h-10 w-10" />,
    title: "Tarik atau Belanja",
    desc: "Saldo bisa dipakai untuk belanja digital atau tarik tunai",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-1 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">Gimana Ini Bekerja?</h1>
        <p className="text-muted-foreground max-w-md text-sm">
          Ikuti 3 langkah mudah ini untuk menukar sampahmu jadi saldo digital di
          GreenPay.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <Card
            key={i}
            className="hover:border-primary cursor-pointer transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]"
          >
            <CardContent className="flex flex-col items-center text-center">
              {step.icon}
              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{step.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
