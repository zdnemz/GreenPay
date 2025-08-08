"use client";

import * as React from "react";
import RootLayout from "@/components/layouts/RootLayout";
import { useAuthUser } from "@/stores/auth-store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AdminAnalyticData } from "@/types";
import TransactionGraphics from "@/components/pages/admin/dashboard/transactionChart";
import TransactionStatusChart from "@/components/pages/admin/dashboard/transactionStatusChart";
import TrashTypeTotalChart from "@/components/pages/admin/dashboard/trashTypeTotalChart";
import Statistic from "@/components/pages/admin/dashboard/statictic";
import { useFetch } from "@/hooks/useFetch";
import { IS_DEV } from "@/lib/config";
import { toast } from "sonner";
import { MOCK_ADMIN_DASHBOARD_DATA } from "@/lib/mock";

export default function Dashboard() {
  const user = useAuthUser();

  const { data } = useFetch<AdminAnalyticData>({
    url: "/api/admin/analytics",
    fetcherParams: {
      method: "get",
      config: { withCredentials: true },
    },
    immediate: !IS_DEV,
  });

  // dev info
  const didToast = React.useRef(false);

  React.useEffect(() => {
    if (IS_DEV && !didToast.current) {
      toast.info("This data is MOCK for development");
      didToast.current = true;
    }
  }, []);

  const analytics = !IS_DEV ? data : MOCK_ADMIN_DASHBOARD_DATA;

  return (
    <RootLayout header={<Navbar />} footer={<Footer />}>
      <section className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold">
            Halo Admin, <span className="text-primary">{user?.name}</span>!
          </h3>
        </div>

        {/* content */}
        <div className="space-y-6">
          <Statistic data={analytics} />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <TransactionGraphics data={analytics?.transaksiPerBulan} />
            </div>
            <div className="md:col-span-1">
              <TransactionStatusChart data={analytics?.transaksiStatus} />
            </div>
            <div className="md:col-span-1">
              <TrashTypeTotalChart data={analytics?.totalSampah} />
            </div>
          </div>
        </div>
      </section>
    </RootLayout>
  );
}
