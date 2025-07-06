"use client";

import { useState, useEffect } from "react";
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
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, LabelList } from "recharts";
import { DollarSign, Users, Briefcase, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

const connectors = [
    { name: 'Google Sheets' },
    { name: 'FreeAgent' },
    { name: 'Xero' },
    { name: 'QuickBooks' },
    { name: 'Google Analytics' },
    { name: 'Shopify' },
    { name: 'Wix' },
];

function DataConnectors({ className }: { className?: string }) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Connect Your Data</CardTitle>
                <CardDescription>
                    To see your business metrics, connect to a data source.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {connectors.map(connector => (
                    <Button key={connector.name} variant="outline" className="w-full justify-start gap-4 p-6 text-left h-auto">
                        <div className="w-8 h-8 bg-muted rounded-md flex-shrink-0" />
                        <span className="font-medium">{connector.name}</span>
                    </Button>
                ))}
            </CardContent>
        </Card>
    );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
            <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-2/4" />
                    <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-7 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-2/4" />
                </CardContent>
            </Card>
        ))}
       </div>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
             <CardHeader>
                <Skeleton className="h-6 w-1/3 mb-2"/>
                <Skeleton className="h-4 w-2/3"/>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[300px] w-full" />
            </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
             <CardHeader>
                <Skeleton className="h-6 w-1/3 mb-2"/>
                <Skeleton className="h-4 w-2/3"/>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[300px] w-full" />
            </CardContent>
        </Card>
       </div>
    </div>
  )
}


export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  // In a real app, this would be fetched from a server action
  const [hasBusinessData, setHasBusinessData] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // For demonstration, we'll show the data connectors after the loading skeleton.
      // In a real app, you would fetch from your DB and set `hasBusinessData` accordingly.
      setHasBusinessData(false);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
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
            {hasBusinessData ? (
              <>
                <Card className="col-span-4 transform transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue for the last 6 months.</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
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
                        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} barSize={30}>
                           <LabelList 
                              dataKey="revenue" 
                              position="top" 
                              offset={8}
                              className="fill-foreground text-xs"
                              formatter={(value: number) => `$${(value / 1000).toFixed(0)}k`} 
                            />
                        </Bar>
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
              </>
            ) : (
                <DataConnectors className="col-span-full" />
            )}
          </div>
        </>
      )}
    </div>
  );
}
