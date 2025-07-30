"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import {
  useAuthUser,
  useIsAuthenticated,
  useIsInitialized,
} from "@/store/auth-store";
import { User } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import RootLayout from "@/components/layouts/RootLayout";
import Loading from "@/components/Loading";
import { useLoading } from "@/contexts/loading-context";

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = "/login",
  roles?: User["role"][],
) => {
  return function AuthenticatedComponent(props: P) {
    const isAuthenticated = useIsAuthenticated();
    const isInitialized = useIsInitialized();
    const user = useAuthUser();
    const { isAnyLoading } = useLoading();

    const router = useRouter();

    const shouldBlockRender = !isInitialized || isAnyLoading;

    useEffect(() => {
      if (isInitialized && !isAuthenticated) {
        router.replace(redirectTo);
      }
    }, [isInitialized, isAuthenticated, router]);

    if (shouldBlockRender || (!isAuthenticated && isInitialized)) {
      return <Loading />;
    }

    if (roles && (!user?.role || !roles.includes(user.role))) {
      return (
        <RootLayout>
          <div className="flex min-h-screen w-full flex-col items-center justify-center space-y-3 text-center">
            <div>
              <h1 className="text-primary text-6xl font-bold">401</h1>
              <h2 className="text-2xl font-semibold">Tidak Memiliki Akses</h2>
              <p className="text-muted-foreground max-w-md text-sm">
                Maaf, Kamu tidak memiliki akses ke halaman ini.
              </p>
            </div>
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

    return <Component {...props} />;
  };
};

export const withGuest = <P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = "/",
) => {
  return function GuestComponent(props: P) {
    const isAuthenticated = useIsAuthenticated();
    const isInitialized = useIsInitialized();
    const { isAnyLoading } = useLoading();

    const router = useRouter();

    const shouldBlockRender = !isInitialized || isAnyLoading;

    useEffect(() => {
      if (isInitialized && isAuthenticated) {
        router.replace(redirectTo);
      }
    }, [isAuthenticated, isInitialized, router]);

    if (shouldBlockRender || (isAuthenticated && isInitialized)) {
      return <Loading />;
    }

    return <Component {...props} />;
  };
};
