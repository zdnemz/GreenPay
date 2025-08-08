"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminAnalyticData } from "@/types";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

interface Props {
  data: AdminAnalyticData["transaksiPerBulan"] | undefined;
}

export default function TransactionChart({ data }: Props) {
  const formattedData = data?.map((item) => ({
    label: `${item.bulan.toString().padStart(2, "0")}/${item.tahun}`,
    jumlah: item.jumlah,
  }));

  return (
    <Card className="hover:border-primary transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg font-semibold">
          Statistik Transaksi Bulanan
        </CardTitle>
        <CardDescription>{"Jumlah transaksi tiap bulan (Kg)"}</CardDescription>
      </CardHeader>

      <CardContent className="px-4 pt-6 sm:px-6">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillJumlah" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor="var(--primary)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--muted)"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)" }}
              tickMargin={10}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)" }}
              tickMargin={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--muted)",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "var(--muted-foreground)" }}
              itemStyle={{ color: "var(--foreground)" }}
            />
            <Area
              type="monotone"
              dataKey="jumlah"
              stroke="var(--primary)"
              fill="url(#fillJumlah)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
