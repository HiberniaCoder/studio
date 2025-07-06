"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DataConnectors } from "./data-connectors";
import { checkWixConnection, getWixAnalyticsData, type WixAnalyticsData } from "./actions";
import WixAnalyticsDashboard from "./wix-analytics-dashboard";

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
                <Skeleton className="h-5 w-2/5 mb-3" />
                <Skeleton className="h-8 w-3/5 mb-2" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        ))}
       </div>
       <div className="pt-4">
            <Skeleton className="h-[350px] w-full" />
       </div>
    </div>
  )
}


export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [hasBusinessData, setHasBusinessData] = useState(false);
  const [wixData, setWixData] = useState<WixAnalyticsData | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
        setLoading(true);
        const wixStatus = await checkWixConnection();
        if (wixStatus.connected && wixStatus.configured) {
            const data = await getWixAnalyticsData();
            if (data && data.length > 0) {
                setWixData(data);
                setHasBusinessData(true);
            }
        }
        setLoading(false);
    }
    loadDashboardData();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {loading ? (
        <DashboardSkeleton />
      ) : hasBusinessData && wixData ? (
        <WixAnalyticsDashboard data={wixData} />
      ) : (
        <DataConnectors />
      )}
    </div>
  );
}
