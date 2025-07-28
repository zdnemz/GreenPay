"use client";
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
import ToggleTheme from "./ToggleTheme";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [tolerancePadding, setTolerancePadding] = React.useState(0);

  const { isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (isMenuOpen) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      setTolerancePadding(scrollBarWidth);
    } else {
      document.body.style.overflow = "auto";
      setTolerancePadding(0);
    }

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [isMenuOpen]);

  return (
    <div className="bg-sidebar flex w-full items-center justify-between border-b py-3">
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

      {/* Desktop Navigation */}
      <nav className="hidden lg:block">
        <ul className="flex items-center justify-center text-sm lg:space-x-6 xl:space-x-12">
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

      {/* Action + Hamburger */}
      <div className="flex items-center space-x-3">
        <ToggleTheme />
        <div className="hidden lg:flex">
          <NavbarAction isAuthenticated={isAuthenticated} />
        </div>

        {/* Hamburger (Mobile Only) */}
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Fullscreen Modal Menu */}
      {isMenuOpen && (
        <div
          className="bg-sidebar fixed inset-0 z-50 *:px-6 *:sm:px-12 *:md:px-24"
          style={{ paddingRight: `${tolerancePadding}px` }}
        >
          {/* Header Mobile Modal */}
          <div className="flex items-center justify-between pt-[14px] pb-3 text-sm">
            {/* Logo */}
            <div>
              <h1 className="text-2xl font-semibold">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-x-1"
                >
                  <GreenPayIcon className="text-primary h-8 w-8" />
                  <span>
                    <span className="text-primary">Green</span>Pay
                  </span>
                </Link>
              </h1>
            </div>

            {/* Close Action Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex flex-col space-y-4 px-4 py-5">
            {/* Navigation Menu */}
            <Link
              href="/"
              className="hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="/how-it-works"
              className="hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Cara Kerja
            </Link>
            <Link
              href="/leaderboard"
              className="hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </Link>
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Tentang Kami
            </Link>

            <div className="border-t pt-4">
              <MobileProfileMenu
                isAuthenticated={isAuthenticated}
                onClose={() => setIsMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Menu Profil" className="cursor-pointer">
              Profile
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-3" align="end">
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
      )}
    </div>
  );
}

function MobileProfileMenu({
  isAuthenticated,
  onClose,
  onLogout,
}: {
  isAuthenticated: boolean;
  onClose: () => void;
  onLogout?: () => void;
}) {
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col space-y-3">
        <Button className="w-full" variant="outline" asChild>
          <Link href="/login" onClick={onClose}>
            Login
          </Link>
        </Button>
        <Button className="w-full" asChild>
          <Link href="/register" onClick={onClose}>
            Daftar
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      <Link
        href="/dashboard"
        className="hover:text-primary transition-colors"
        onClick={onClose}
      >
        Dashboard
      </Link>
      <Link
        href="/transactions"
        className="hover:text-primary transition-colors"
        onClick={onClose}
      >
        Riwayat Transaksi
      </Link>
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => {
          onLogout?.();
          onClose();
        }}
      >
        Keluar
      </Button>
    </div>
  );
}
