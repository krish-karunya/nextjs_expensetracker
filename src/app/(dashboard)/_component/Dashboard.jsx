"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { months } from "@/lib/utils";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { useEffect } from "react";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Configuration for chart colors and labels, linked to CSS variables
const chartConfig = {
  Income: { label: "Income", color: "hsl(var(--chart-1))" },
  Expense: { label: "Expense", color: "hsl(var(--chart-2))" },
};

const fetchMonthData = (year) => {
  return axiosInstance.get(`dashboard-history/${year}`);
};

export function ChartBarMultiple({ dashboardYear, dashBoardRefetch }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["totalMonthData"],
    queryFn: () => fetchMonthData(dashboardYear),
  });
  console.log(data?.data?.monthHistoryData);
  const newData = data?.data?.monthHistoryData.map((dt) => ({
    ...dt,
    month: dt.month ? months[dt.month - 1] : dt.month,
    balance: dt.income - dt.expense,
  }));
  console.log(newData);
  useEffect(() => {
    dashBoardRefetch(refetch);
  }, [dashboardYear]);

  if (isLoading)
    return (
      <div>
        <DashboardSkeleton />
      </div>
    );
  if (error) return <div>Error loading data</div>;
  // console.log(dashboardMonth);
  if (data?.data?.monthHistoryData.length === 0) {
    return (
      <div className="w-full flex items-center justify-center border border-gray-400 rounded-lg h-[350px]">
        No data for the selected year
      </div>
    );
  }
  return (
    <Card className={""}>
      <CardHeader>
        <CardTitle>Bar Chart – Monthly Income and Expense Report</CardTitle>
        <CardDescription>Year-{dashboardYear}</CardDescription>
      </CardHeader>

      <CardContent>
        {/* ChartContainer can provide styling/context */}
        <ChartContainer
          config={chartConfig}
          className="h-[300px] w-full"
          style={{
            contentVisibility: "auto",
            containIntrinsicSize: "300px", // reserve space
          }}
        >
          <BarChart accessibilityLayer data={newData}>
            {/* Grid lines (horizontal only) */}
            <CartesianGrid vertical={true} />
            {/* X Axis with shortened month labels */}
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              //   tickFormatter={(value) => value.slice(0, 3)} // Jan, Feb, Mar...
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              //   tickFormatter={(value) => value.slice(0, 3)} // Jan, Feb, Mar...
            />
            {/* Tooltip with custom content */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {/* Bars with radius and colors linked to CSS vars */}
            <Bar
              dataKey="income"
              fill="oklch(44.8% 0.119 151.328)"
              radius={4}
              className="cursor-pointer"
              barSize={24}
            />{" "}
            <Bar
              dataKey="expense"
              fill="oklch(44.4% 0.177 26.899)"
              radius={4}
              className="cursor-pointer"
              barSize={24}
            />
            <Bar
              dataKey="balance"
              fill="oklch(58.5% 0.233 277.117)"
              radius={4}
              className="cursor-pointer"
              barSize={24}
            />
            <Legend />
          </BarChart>
        </ChartContainer>
      </CardContent>

      {/* <CardFooter className="flex flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          Monthly Data for Income and Expense <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
