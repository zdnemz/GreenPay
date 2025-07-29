"use client";

import * as React from "react";
import RootLayout from "@/components/layouts/RootLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { ChevronUp, Edit2, Info, Trophy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useAuthStore, User } from "@/store/auth-store";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuthStore() as { user: User };

  return (
    <RootLayout header={<Navbar />} footer={<Footer />}>
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
                  <div className="bg-background/50 border-primary absolute right-0 bottom-0 -translate-2 rounded-full border p-1 shadow-md">
                    <Edit2 className="h-4 w-4" />
                  </div>
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
                <Button
                  className="cursor-pointer bg-[linear-gradient(270deg,var(--chart-1),var(--chart-2),var(--chart-3),var(--chart-4))] bg-[length:200%_200%] shadow transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]"
                  asChild
                >
                  <Link href="/profile/edit">Edit profil</Link>
                </Button>
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
    </RootLayout>
  );
}
