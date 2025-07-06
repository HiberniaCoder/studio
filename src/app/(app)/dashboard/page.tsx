"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from "recharts";
import { DollarSign, Users, Briefcase, Smile } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const kpiData = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    icon: DollarSign,
    iconColor: "text-green-500",
  },
  {
    title: "New Clients",
    value: "+230",
    change: "+18.2% this month",
    icon: Users,
    iconColor: "text-blue-500",
  },
  {
    title: "Active Projects",
    value: "12",
    change: "+2 since last week",
    icon: Briefcase,
    iconColor: "text-purple-500",
  },
  {
    title: "Client Satisfaction",
    value: "98%",
    change: "Great feedback!",
    icon: Smile,
    iconColor: "text-yellow-500",
  },
];

const chartData = [
  { month: "January", revenue: 4000 },
  { month: "February", revenue: 3000 },
  { month: "March", revenue: 5000 },
  { month: "April", revenue: 4500 },
  { month: "May", revenue: 6000 },
  { month: "June", revenue: 7500 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const pieData = [
  { name: 'Marketing', value: 400, fill: 'hsl(var(--chart-1))' },
  { name: 'Development', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'Design', value: 300, fill: 'hsl(var(--chart-3))' },
  { name: 'Support', value: 200, fill: 'hsl(var(--chart-4))' },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="transform transition-all hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 text-muted-foreground ${kpi.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 transform transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3 transform transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Project Distribution</CardTitle>
            <CardDescription>Breakdown of active project types.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <PieChart>
                 <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
