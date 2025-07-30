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
import {
  useAuthActions,
  useAuthStore,
  useIsAuthenticated,
} from "@/store/auth-store";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/lib/response";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [tolerancePadding, setTolerancePadding] = React.useState(0);

  const isAuthenticated = useIsAuthenticated();
  const { clearUser } = useAuthActions();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { data }: { data: ApiResponse } =
        await axios.delete("/api/auth/logout");

      if (!data.success) {
        toast.error((data.error as string) || "Terjadi kesalahan");
      }

      setTimeout(() => {
        clearUser();
        // router.push("/");
      }, 200);

      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("register error:", error);
        toast.error((error.response?.data as ApiResponse).error as string);
      }
    }
  };

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
          <NavbarAction
            onLogout={handleLogout}
            isAuthenticated={isAuthenticated}
          />
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
          className="bg-sidebar fixed inset-0 z-50 block *:px-6 *:sm:px-12 *:md:px-24 lg:hidden"
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
                onLogout={handleLogout}
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
  onLogout: () => void;
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
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/transactions">Riwayat Transaksi</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                  variant="destructive"
                  className="cursor-pointer"
                >
                  Keluar
                </DropdownMenuItem>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Keluar dari akun?</DialogTitle>
                  <DialogDescription>
                    Apakah kamu yakin ingin keluar? Kamu harus login lagi untuk
                    mengakses dashboard.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button variant="outline" className="cursor-pointer">
                      Batal
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      onClick={onLogout}
                      className="cursor-pointer"
                    >
                      Ya, Keluar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
  onLogout: () => void;
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
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" className="w-full cursor-pointer">
            Keluar
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Keluar dari akun?</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin keluar? Kamu harus login lagi untuk
              mengakses dashboard.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Batal
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={onLogout}
              className="cursor-pointer"
            >
              Ya, Keluar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
