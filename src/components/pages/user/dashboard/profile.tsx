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

export default function ProfileSection() {
  const [user, setUser] = React.useState<UserData | null>(null);
  const [hasFetched, setHasFetched] = React.useState(false);

  React.useEffect(() => {
    if (hasFetched) return;
    async function fetchData() {
      try {
        const { data } = await axios.get<ApiResponse>("/api/users/me");

        if (!data.success) {
          toast.error((data.error as string) || "Terjadi Kesalahan");
          return;
        }

        setUser(data.data as UserData);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Login error:", error);
          toast.error((error.response?.data as ApiResponse).error as string);
        }
      } finally {
        setHasFetched(true);
      }
    }

    fetchData();
  }, [hasFetched]);

  return (
    <section>
      <Card className="w-full max-w-none gap-0 overflow-hidden p-0">
        <div className="w-full">
          <Image
            src="/banner.png"
            alt="banner"
            width={1920} // optional
            height={400} // optional
            className="h-48 w-full object-cover"
          />
        </div>

        {/* profile */}
        <div className="space-y-6 px-12 py-8">
          <div className="flex justify-between">
            {/* user info */}
            <div className="flex gap-x-6">
              <div className="relative w-fit -translate-y-16">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/avatar.png" alt="User Avatar" />
                </Avatar>
              </div>

              <div className="space-y-1">
                <div>
                  <h2 className="text-primary text-2xl font-semibold">
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

            <div>
              <EditProfileDialog user={user!} />
            </div>
          </div>

          {/* content */}
          <div className="bg-background w-full space-y-1 rounded-md p-6">
            <div>
              <h3>User ID</h3>
              <p className="text-muted-foreground text-sm">{user?.id}</p>
            </div>
            <div>
              <h3>Email</h3>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>
            <div>
              <h3>Dibuat pada</h3>
              <p className="text-muted-foreground text-sm">
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

// export default function Test() {
//   return (
//     <div>
//       <h1>Gelo</h1>
//     </div>
//   )
// }
