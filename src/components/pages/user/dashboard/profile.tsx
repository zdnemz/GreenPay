"use client";

import * as React from "react";
import Image from "next/image";

import { useAuthStore, User } from "@/store/auth-store";

import { ChevronUp, Info, Trophy } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditProfileDialog from "./profileEdit";

export default function ProfileSection() {
  const { user } = useAuthStore() as { user: User };

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
                    {user.name}
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
                        <p>Lorem ipsum dolor sit amet consectetur.</p>
                      </TooltipContent>
                    </Tooltip>
                  </p>
                  <h3>1880 pts.</h3>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-x-1 text-sm">
                    Peringkat anda
                    <Trophy className="h-4 w-4" />
                  </p>
                  <h3 className="flex items-center gap-x-1">
                    1 st <ChevronUp className="text-primary h-4 w-4" />
                  </h3>
                </div>
              </div>
            </div>

            <div>
              <EditProfileDialog />
            </div>
          </div>

          {/* content */}
          <div className="bg-background w-full space-y-1 rounded-md p-6">
            <div>
              <h3>User ID</h3>
              <p className="text-muted-foreground text-sm">{user.id}</p>
            </div>
            <div>
              <h3>Email</h3>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
