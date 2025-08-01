"use client";

import * as React from "react";
import Image from "next/image";

import { ChevronUp, Info, Trophy } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditProfileDialog from "./profileEdit";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/lib/response";
import { toast } from "sonner";
import { UserData } from "@/types";
import ChangePasswordDialog from "./changePassword";
import { useLoading } from "@/hooks/useLoading";

export default function ProfileSection() {
  const [user, setUser] = React.useState<UserData | null>(null);
  const [refreshKey, setRefreshKey] = React.useState<number>(0);
  const { startLoading, stopLoading } = useLoading("user-dashboard");

  React.useEffect(() => {
    let canceled = true;

    async function fetchData() {
      try {
        if (!canceled) return;

        startLoading();
        const { data } = await axios.get<ApiResponse>("/api/users/me");

        setUser(data.data as UserData);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Profile error:", error);
          toast.error((error.response?.data as ApiResponse).error as string);
        }
      } finally {
        stopLoading();
      }
    }

    fetchData();

    return () => {
      canceled = false;
    };
  }, [refreshKey, startLoading, stopLoading]);

  return (
    <section>
      <Card className="w-full max-w-none gap-0 overflow-hidden p-0">
        <div className="w-full">
          <Image
            src="/banner.png"
            alt="banner"
            width={1920} // optional
            height={400} // optional
            className="h-32 w-full object-cover sm:h-40 md:h-48"
          />
        </div>

        {/* profile */}
        <div className="space-y-4 px-4 py-6 sm:space-y-6 sm:px-8 md:px-12 md:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            {/* user info */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-x-6">
              <div className="relative w-fit -translate-y-8 sm:-translate-y-12 md:-translate-y-16">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32">
                  <AvatarImage src="/avatar.png" alt="User Avatar" />
                </Avatar>
              </div>

              <div className="-mt-4 space-y-1 sm:mt-0">
                <div>
                  <h2 className="text-primary text-xl font-semibold sm:text-2xl">
                    {user?.name}
                  </h2>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-x-1 text-sm">
                    Point saat ini
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-48 text-center">
                        <p>jumlah poin yang terkumpul</p>
                      </TooltipContent>
                    </Tooltip>
                  </p>
                  <h3>{user?.points} pts.</h3>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-x-1 text-sm">
                    Peringkat anda
                    <Trophy className="h-4 w-4" />
                  </p>
                  <h3 className="flex items-center gap-x-1">
                    {user?.rank} st{" "}
                    <ChevronUp className="text-primary h-4 w-4" />
                  </h3>
                </div>
              </div>
            </div>

            <div className="w-full space-x-3 sm:w-auto">
              <ChangePasswordDialog />
              <EditProfileDialog
                user={user!}
                onSuccess={() => setRefreshKey((v) => v + 1)}
              />
            </div>
          </div>

          {/* content */}
          <div className="bg-background w-full space-y-2 rounded-md p-4 sm:space-y-1 sm:p-6">
            <div>
              <h3 className="text-sm sm:text-base">User ID</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {user?.id}
              </p>
            </div>
            <div>
              <h3 className="text-sm sm:text-base">Email</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {user?.email}
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
