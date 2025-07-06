"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataConnectors } from "./data-connectors";

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
      ) : hasBusinessData ? (
        // In a real app, the dashboard with data would be rendered here.
        <div className="text-center py-12 text-muted-foreground">
          <p>Your connected data would be displayed here.</p>
        </div>
      ) : (
        <DataConnectors />
      )}
    </div>
  );
}
