import * as React from "react";

import Link from "next/link";
import { Instagram, Twitter } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-sidebar border-t">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-3">
        {/* Logo & Description */}
        <div className="space-y-3">
          <h2 className="text-primary text-2xl font-bold">GreenPay</h2>
          <p className="text-muted-foreground text-sm">
            Platform digital tukar sampah jadi saldo. Bersih lingkungannya, cuan
            kantongnya.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <h3 className="text-foreground font-semibold">Navigasi</h3>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li>
              <Link href="/">Beranda</Link>
            </li>
            <li>
              <Link href="/how-it-works">Cara Kerja</Link>
            </li>
            <li>
              <Link href="/leaderboard">Leaderboard</Link>
            </li>
            <li>
              <Link href="/about">Tentang Kami</Link>
            </li>
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h3 className="text-foreground mb-3 font-semibold">Kontak</h3>
          <p className="text-muted-foreground text-sm">support@greenpay.id</p>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" size="icon" asChild>
              <Link
                href="https://instagram.com"
                target="_blank"
                aria-label="Instagram"
              >
                <Instagram className="text-foreground h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <Link
                href="https://twitter.com"
                target="_blank"
                aria-label="Twitter"
              >
                <Twitter className="text-foreground h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-muted-foreground border-t py-4 text-center text-xs">
        © {new Date().getFullYear()} GreenPay. All rights reserved.
      </div>
    </footer>
  );
}
