"use client";

import * as React from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Info,
  Minus,
  Trophy,
} from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditProfileDialog from "./profileEdit";
import ChangePasswordDialog from "./changePassword";

import { useFetch } from "@/hooks/useFetch";
import { UserData } from "@/types";
import { formatOrdinalNumber } from "@/lib/utils";
import { useAppActions, useIsBalanceVisible } from "@/stores/app-store";

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

  const isBalanceVisible = useIsBalanceVisible();
  const { toggleBalanceVisibility } = useAppActions();

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
        <div className="space-y-4 px-4 py-6 sm:px-8 md:px-12 md:py-8 lg:space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
            {/* user info */}
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-x-6">
              <div className="relative w-fit -translate-y-8 sm:-translate-y-12 md:-translate-y-16">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32">
                  <AvatarImage src="/avatar.png" alt="User Avatar" />
                </Avatar>
              </div>

              <div className="-mt-8 space-y-1 sm:-mt-12 md:-mt-16 lg:mt-0">
                <div className="flex max-w-full items-center gap-3">
                  <h2 className="text-primary line-clamp-2 max-w-[12rem] text-xl font-semibold sm:max-w-[16rem] sm:text-2xl">
                    {user?.name}
                  </h2>
                  <div className="bg-muted-foreground h-6 w-px" />
                  <p className="text-muted-foreground whitespace-nowrap">
                    {user?.points ?? "-"} pts
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground flex items-center gap-x-1 text-sm">
                    Balance saat ini
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-48 text-center">
                        <p>jumlah balance yang terkumpul</p>
                      </TooltipContent>
                    </Tooltip>
                  </p>
                  <div className="relative flex items-center gap-2">
                    <span
                      className={`block overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-300`}
                      style={{
                        maxWidth: isBalanceVisible ? "8rem" : "4rem",
                      }}
                    >
                      {isBalanceVisible
                        ? user?.balance != null
                          ? user.balance.toLocaleString()
                          : "0"
                        : "******"}
                    </span>

                    <button
                      type="button"
                      aria-label={
                        isBalanceVisible
                          ? "Sembunyikan saldo"
                          : "Tampilkan saldo"
                      }
                      onClick={toggleBalanceVisibility}
                      className="text-muted-foreground hover:text-primary flex-shrink-0 transition-colors duration-200"
                    >
                      {isBalanceVisible ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-x-1 text-sm">
                    Peringkat anda
                    <Trophy className="h-4 w-4" />
                  </p>
                  <h3 className="flex items-center gap-x-1">
                    {user?.currentRank
                      ? formatOrdinalNumber(user.currentRank)
                      : "-"}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {typeof user?.currentRank === "number" &&
                        typeof user?.lastRank === "number" ? (
                          user.currentRank < user.lastRank ? (
                            <ChevronUp className="text-primary h-4 w-4" />
                          ) : user.currentRank > user.lastRank ? (
                            <ChevronDown className="text-destructive h-4 w-4" />
                          ) : (
                            <Minus className="text-muted-foreground h-4 w-4" />
                          )
                        ) : (
                          <Info className="text-muted-foreground h-4 w-4" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent className="max-w-48 text-center">
                        <p>
                          {typeof user?.currentRank === "number" &&
                          typeof user?.lastRank === "number"
                            ? user.currentRank < user.lastRank
                              ? "Peringkatmu naik"
                              : user.currentRank > user.lastRank
                                ? "Peringkatmu turun"
                                : "Peringkatmu tidak berubah"
                            : "Data peringkat belum tersedia"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </h3>
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
          <div className="bg-background w-full space-y-2 rounded-md p-4 sm:space-y-1 sm:p-6">
            <div>
              <h3 className="text-sm sm:text-base">User ID</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {user?.id ?? "-"}
              </p>
            </div>
            <div>
              <h3 className="text-sm sm:text-base">Email</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {user?.email ?? "-"}
              </p>
            </div>
            <div>
              <h3 className="text-sm sm:text-base">Dibuat pada</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {user?.createdAt
                  ? new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(user.createdAt))
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
