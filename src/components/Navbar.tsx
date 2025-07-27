import Link from "next/link";
import * as React from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GreenPayIcon from "./icons/GreenPay";

// dummy state
const isAuthenticated = true;

export default function Navbar() {
  return (
    <div className="bg-sidebar flex w-full items-center justify-between">
      {/* Logo */}
      <div>
        <h1 className="text-2xl font-semibold">
          <Link href="/" className="flex items-center justify-center gap-x-1">
            <GreenPayIcon className="text-primary h-8 w-8" />
            <span>
              <span className="text-primary">Green</span>Pay
            </span>
          </Link>
        </h1>
      </div>

      {/* Navigation List */}
      <nav>
        <ul className="flex items-center justify-center space-x-12 text-sm">
          <li className="hover:text-primary transition-colors">
            <Link href="/">Beranda</Link>
          </li>
          <li className="hover:text-primary transition-colors">
            <Link href="/how-it-works">Cara Kerja</Link>
          </li>
          <li className="hover:text-primary transition-colors">
            <Link href="/leaderboard">Leaderboard</Link>
          </li>
          <li className="hover:text-primary transition-colors">
            <Link href="/about">Tentang Kami</Link>
          </li>
        </ul>
      </nav>

      {/* Action Button */}
      <div className="flex items-center space-x-3">
        <NavbarAction isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
}

function NavbarAction({
  isAuthenticated,
  onLogout,
}: {
  isAuthenticated: boolean;
  onLogout?: () => void;
}) {
  return (
    <div className="flex items-center space-x-3">
      {!isAuthenticated ? (
        <>
          {/* Guest Action */}
          <Button className="cursor-pointer" variant="outline" asChild>
            <Link href="/login" aria-label="Login ke akun GreenPay">
              Login
            </Link>
          </Button>
          <Button className="cursor-pointer" asChild>
            <Link href="/register" aria-label="Daftar akun GreenPay">
              Daftar
            </Link>
          </Button>
        </>
      ) : (
        <>
          {/* Authenticated Action */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Menu Profil" className="cursor-pointer">
                Profile
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/transactions">Riwayat Transaksi</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={onLogout}>
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
}
