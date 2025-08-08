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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  data: AdminAnalyticData["transaksiStatus"] | undefined;
}

const COLORS = ["var(--primary)", "var(--destructive)"];

export default function TransactionStatusChart({ data }: Props) {
  const chartData = [
    { name: "Approved", value: data?.approved },
    { name: "Rejected", value: data?.rejected },
  ];

  return (
    <Card className="hover:border-primary transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg font-semibold">
          Status Transaksi
        </CardTitle>
        <CardDescription>Distribusi status transaksi saat ini</CardDescription>
      </CardHeader>

      <CardContent className="px-4 pt-6 sm:px-6">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
              dataKey="value"
              stroke="none"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--muted)",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "var(--muted-foreground)" }}
              itemStyle={{ color: "var(--foreground)" }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
