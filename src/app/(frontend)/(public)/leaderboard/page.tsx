"use client";

import Footer from "@/components/Footer";
import First from "@/components/icons/ranks/First";
import Second from "@/components/icons/ranks/Second";
import Third from "@/components/icons/ranks/Third";
import RootLayout from "@/components/layouts/RootLayout";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagination";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { withSuspense } from "@/hoc/withSuspense";
import { usePagination } from "@/hooks/usePagination";
import { IS_DEV } from "@/lib/config";
import { MOCK_LEADERBOARD_DATA } from "@/lib/mock";
import { LeaderboardData } from "@/types";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

export default withSuspense(Leaderboard);

function Leaderboard() {
  const { data, pagination, handlePageChange } = usePagination<LeaderboardData>(
    {
      apiEndpoint: "/api/leaderboard",
    },
  );

  // dev info
  const didToast = React.useRef(false);

  React.useEffect(() => {
    if (IS_DEV && !didToast.current) {
      toast.info("This data is MOCK for development");
      didToast.current = true;
    }
  }, []);

  const leaderboard = !IS_DEV ? data : MOCK_LEADERBOARD_DATA;

  return (
    <RootLayout header={<Navbar />} footer={<Footer />}>
      <section className="flex flex-col gap-6">
        <div className="flex min-h-screen w-full flex-col items-center gap-12">
          {/* title */}
          <div>
            <h1 className="text-primary text-4xl font-bold md:text-5xl">
              Peringkat Terbaik
            </h1>
          </div>

          {/* content */}
          <div className="w-full max-w-lg space-y-6">
            {/* 1,2,3 rank */}
            <div className="flex justify-center gap-6 pt-12 md:gap-12">
              <div>
                <div className="relative w-fit">
                  <Avatar className="h-24 w-24 border-3 border-[#8D8989] shadow-[0_0_20px_#8D8989]">
                    <AvatarImage src="/avatar.png" alt="User Avatar" />
                  </Avatar>
                  <div className="absolute top-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-br from-[#8D8989] to-[#d5d1d1] text-sm font-semibold text-white">
                    <span>2</span>
                  </div>
                  <div className="absolute bottom-0 h-fit w-fit translate-y-9">
                    <Second />
                  </div>
                </div>
                <div className="mt-6 max-w-24 text-center">
                  <h2 className="truncate text-xl font-semibold">
                    {leaderboard?.users[1].name}
                  </h2>
                  <h3 className="text-primary text-2xl font-semibold">
                    {leaderboard?.users[1].points} pts
                  </h3>
                </div>
              </div>

              <div className="-translate-y-12">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-3 border-[#FFD700] shadow-[0_0_20px_#FFD700]">
                    <AvatarImage src="/avatar.png" alt="User Avatar" />
                  </Avatar>
                  <div className="absolute top-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-br from-[#FFD700] to-[#ffde26] text-sm font-semibold text-white">
                    <span>1</span>
                  </div>
                  <div className="absolute bottom-0 h-fit w-fit translate-y-9">
                    <First />
                  </div>
                </div>
                <div className="mt-6 max-w-24 text-center">
                  <h2 className="truncate text-xl font-semibold">
                    {leaderboard?.users[0].name}
                  </h2>
                  <h3 className="text-primary text-2xl font-semibold">
                    {leaderboard?.users[0].points} pts
                  </h3>
                </div>
              </div>

              <div>
                <div className="relative">
                  <Avatar className="h-24 w-24 border-3 border-[#834625] shadow-[0_0_20px_#834625]">
                    <AvatarImage src="/avatar.png" alt="User Avatar" />
                  </Avatar>
                  <div className="absolute top-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-br from-[#834625] to-[#c08a6d] text-sm font-semibold text-white">
                    <span>3</span>
                  </div>
                  <div className="absolute bottom-0 h-fit w-fit translate-x-4 translate-y-6">
                    <Third />
                  </div>
                </div>
                <div className="mt-6 max-w-24 text-center">
                  <h2 className="truncate text-xl font-semibold">
                    {leaderboard?.users[2].name}
                  </h2>
                  <h3 className="text-primary text-2xl font-semibold">
                    {leaderboard?.users[2].points} pts
                  </h3>
                </div>
              </div>
            </div>

            {/* other ranks */}
            <div className="space-y-3">
              {leaderboard?.users.slice(3).map((user) => (
                <Card key={user.id} className="p-6">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="from-chart-1 to-chart-3 text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br font-semibold">
                          {user.currentRank}
                        </div>

                        {/* Avatar dan info */}
                        <div className="flex flex-1 items-center gap-3">
                          <div className="border-primary h-12 w-12 overflow-hidden rounded-full border-2">
                            <Image
                              src="/avatar.png"
                              alt={user.id}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                      </div>
                    </div>

                    <div>
                      {/* Points */}
                      <div className="text-right">
                        <p className="text-primary text-lg font-bold">
                          {user.points.toLocaleString("id-ID")}
                        </p>
                        <p className="text-muted-foreground text-xs">poin</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Pagination
            currentPage={pagination?.page || 1}
            totalPages={pagination?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </RootLayout>
  );
}
