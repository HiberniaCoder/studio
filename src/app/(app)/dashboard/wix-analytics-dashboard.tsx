// src/app/(app)/dashboard/wix-analytics-dashboard.tsx
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, LineChart, AreaChart, TrendingUp, DollarSign, BookOpenCheck } from 'lucide-react';
import { Area, Bar, CartesianGrid, XAxis, YAxis, Line, ComposedChart } from 'recharts';
import type { WixAnalyticsData } from './actions';
import type { ChartConfig } from "@/components/ui/chart"

type ProcessedData = {
  date: string;
  "site-sessions"?: number;
  "total-sales"?: number;
  "bookings"?: number;
}

const chartConfig = {
  "total-sales": {
    label: "Total Sales",
    color: "hsl(var(--chart-1))",
    icon: DollarSign,
  },
  "site-sessions": {
    label: "Site Sessions",
    color: "hsl(var(--chart-2))",
    icon: TrendingUp,
  },
  "bookings": {
    label: "Bookings",
    color: "hsl(var(--chart-3))",
    icon: BookOpenCheck
  }
} satisfies ChartConfig

export default function WixAnalyticsDashboard({ data }: { data: WixAnalyticsData }) {
    
  const processedData = data.reduce<ProcessedData[]>((acc, item) => {
    const existingEntry = acc.find(entry => entry.date === item.date);
    if (existingEntry) {
      (existingEntry as any)[item.metric_type] = item.value;
    } else {
      acc.push({
        date: item.date,
        [item.metric_type]: item.value
      });
    }
    return acc;
  }, []);

  const formattedData = processedData.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const totals = data.reduce((acc, item) => {
    if (!acc[item.metric_type]) {
      acc[item.metric_type] = 0;
    }
    acc[item.metric_type] += Number(item.value);
    return acc;
  }, {} as Record<string, number>);

  const kpiCards = [
    { metric: 'total-sales', title: 'Total Sales', icon: DollarSign, prefix: '$', value: totals['total-sales'] },
    { metric: 'site-sessions', title: 'Site Sessions', icon: TrendingUp, value: totals['site-sessions'] },
    { metric: 'bookings', title: 'Total Bookings', icon: BookOpenCheck, value: totals['bookings'] },
  ].filter(card => card.value !== undefined);


  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {kpiCards.map(card => (
                 <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {card.prefix}{card.value.toLocaleString()}
                        </div>
                         <p className="text-xs text-muted-foreground">
                            Total from imported data
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>A combined view of your key metrics over time.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <ComposedChart data={formattedData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                         <YAxis yAxisId="left" stroke="hsl(var(--chart-1))" />
                         <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        
                        {totals['total-sales'] !== undefined && (
                            <Bar yAxisId="left" dataKey="total-sales" fill="hsl(var(--chart-1))" radius={4} />
                        )}
                        {totals['site-sessions'] !== undefined && (
                           <Line yAxisId="right" type="monotone" dataKey="site-sessions" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                        )}
                         {totals['bookings'] !== undefined && (
                           <Area yAxisId="right" type="monotone" dataKey="bookings" fill="hsl(var(--chart-3))" stroke="hsl(var(--chart-3))" strokeWidth={2} fillOpacity={0.4} dot={false} />
                        )}
                    </ComposedChart>
                 </ChartContainer>
            </CardContent>
        </Card>
    </div>
  )
}
