
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatabaseZap, Sheet, Briefcase, BarChart, ShoppingCart, Code } from 'lucide-react';

const connectors = [
    { name: 'Google Sheets', icon: Sheet },
    { name: 'FreeAgent', icon: Briefcase },
    { name: 'Xero', icon: Briefcase },
    { name: 'QuickBooks', icon: Briefcase },
    { name: 'Google Analytics', icon: BarChart },
    { name: 'Shopify', icon: ShoppingCart },
    { name: 'Wix', icon: Code },
];

export function DataConnectors() {
  return (
    <div className="flex flex-col items-center justify-center h-full pt-10">
        <Card className="w-full max-w-4xl text-center shadow-lg animate-in fade-in-50 duration-500">
            <CardHeader className="p-8">
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                    <DatabaseZap className="h-8 w-8" />
                </div>
                <CardTitle className="text-3xl">Connect Your Data</CardTitle>
                <CardDescription className="max-w-2xl mx-auto pt-2">
                    To unlock the full power of your dashboard, connect your business tools.
                    Select a data source below to get started. Once connected, your KPIs and metrics will appear here automatically.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {connectors.map(connector => (
                        <Button key={connector.name} variant="outline" className="w-full h-28 flex-col gap-2 p-4 text-center transition-all hover:bg-accent/50 hover:scale-105">
                            <connector.icon className="w-8 h-8 text-muted-foreground" />
                            <span className="font-medium">{connector.name}</span>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
