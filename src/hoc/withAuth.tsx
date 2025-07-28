"use client";

import { useRequireAuth, useRequireGuest } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import RootLayout from "@/components/layouts/RootLayout";
import { User } from "@/generated/prisma/client";

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = "/auth/login",
  roles?: User["role"][],
) => {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, user } = useRequireAuth(redirectTo);

    if (roles && (!user?.role || !roles.includes(user.role))) {
      return (
        <RootLayout>
          <div className="flex min-h-screen w-full flex-col items-center justify-center space-y-3 text-center">
            <div>
              {/* Status Code */}
              <h1 className="text-primary text-6xl font-bold">401</h1>

              {/* Message */}
              <h2 className="text-2xl font-semibold">Tidak Memiliki Akses</h2>
              <p className="text-muted-foreground max-w-md text-sm">
                Maaf, Kamu tidak memiliki akses ke halaman ini.
              </p>
            </div>
            {/* Back to Home */}

            <Button asChild className="flex items-center gap-2">
              <Link href="/">
                <ChevronLeft className="h-4 w-4" />
                Kembali ke Beranda
              </Link>
            </Button>
          </div>
        </RootLayout>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
};

export const withGuest = <P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = "/",
) => {
  return function GuestComponent(props: P) {
    const { isAuthenticated } = useRequireGuest(redirectTo);

    if (isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
};
