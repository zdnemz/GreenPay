import { Card } from "@/components/ui/card";
import { AdminAnalyticData } from "@/types";
import { ArrowLeftRight, Trash2, UserCircle2, Wrench } from "lucide-react";
import * as React from "react";

export default function Statistic({
  data: analytics,
}: {
  data: AdminAnalyticData | undefined;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <Card className="hover:border-primary p-6 transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]">
        <div className="flex gap-6">
          <div className="flex items-center justify-center">
            <UserCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-primary text-xl font-semibold">
              {analytics?.totalUser}
            </h4>
            <p className="text-muted-foreground text-sm">Total User</p>
          </div>
        </div>
      </Card>
      <Card className="hover:border-primary p-6 transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]">
        <div className="flex gap-6">
          <div className="flex items-center justify-center">
            <Wrench className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-primary text-xl font-semibold">
              {analytics?.totalPetugas}
            </h4>
            <p className="text-muted-foreground text-sm">Total Petugas</p>
          </div>
        </div>
      </Card>
      <Card className="hover:border-primary p-6 transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]">
        <div className="flex gap-6">
          <div className="flex items-center justify-center">
            <Trash2 className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-primary text-xl font-semibold">
              {analytics?.totalSampah.reduce(
                (acc, item) => acc + item.total,
                0,
              )}
            </h4>
            <p className="text-muted-foreground text-sm">Total Sampah</p>
          </div>
        </div>
      </Card>
      <Card className="hover:border-primary p-6 transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]">
        <div className="flex gap-6">
          <div className="flex items-center justify-center">
            <ArrowLeftRight className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-primary text-xl font-semibold">
              {analytics?.totalTransaksi}
            </h4>
            <p className="text-muted-foreground text-sm">Total Transaksi</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
