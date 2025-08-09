"use client";

import * as React from "react";
import Image from "next/image";
import { CheckSquare, Clock } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

import EditProfileDialog from "./profileEdit";
import ChangePasswordDialog from "./changePassword";

import { useFetch } from "@/hooks/useFetch";
import { UserData } from "@/types";
import Link from "next/link";

export default function ProfileSection() {
  const { data: user, fetch: refetchUser } = useFetch<UserData>({
    url: "/api/users/me",
    fetcherParams: {
      method: "get",
      config: {
        withCredentials: true,
      },
    },
    immediate: true,
  });

  return (
    <section>
      <Card className="w-full max-w-none gap-0 overflow-hidden p-0">
        <div className="w-full">
          <Image
            src="/banner.png"
            alt="banner"
            width={960}
            height={200}
            priority
            className="h-32 w-full object-cover sm:h-40 md:h-48"
          />
        </div>

        {/* profile */}
        <div className="space-y-4 px-4 py-6 sm:px-8 md:px-12 md:py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
            {/* user info */}
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-x-6">
              <div className="relative w-fit -translate-y-8 sm:-translate-y-12 md:-translate-y-16">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32">
                  <AvatarImage src="/avatar.png" alt="User Avatar" />
                </Avatar>
              </div>

              <div className="-mt-8 space-y-1 sm:-mt-12 md:-mt-16 lg:mt-0">
                <div>
                  <div className="flex max-w-full items-center gap-3">
                    <h2 className="text-primary line-clamp-2 max-w-[12rem] text-xl font-semibold sm:max-w-[16rem] sm:text-2xl">
                      {user?.name}
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {user?.email ?? "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex w-full gap-3 sm:w-auto">
              {user && (
                <>
                  <ChangePasswordDialog />
                  <EditProfileDialog user={user} onSuccess={refetchUser} />
                </>
              )}
            </div>
          </div>

          {/* content */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Link href="/trash/verify" passHref>
              <Card className="hover:border-primary flex h-full cursor-pointer flex-col items-center justify-center gap-2 p-6 transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]">
                <CheckSquare className="text-primary h-12 w-12" />
                <h3 className="text-primary text-center text-lg font-semibold">
                  Verifikasi Sampah
                </h3>
                <p className="text-muted-foreground text-center text-sm">
                  Cek dan validasi setoran sampah oleh warga
                </p>
              </Card>
            </Link>

            <Link href="/trash/history" passHref>
              <Card className="hover:border-primary flex h-full cursor-pointer flex-col items-center justify-center gap-2 p-6 transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]">
                <Clock className="text-primary h-12 w-12" />
                <h3 className="text-primary text-center text-lg font-semibold">
                  Riwayat Transaksi
                </h3>
                <p className="text-muted-foreground text-center text-sm">
                  Melihat riwayat verifikasi dan transaksi sampah
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}
