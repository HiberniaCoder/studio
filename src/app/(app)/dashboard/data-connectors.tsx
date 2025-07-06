
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatabaseZap, Sheet, Briefcase, BarChart, ShoppingCart, Code, Loader2 } from 'lucide-react';
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getWixAuthUrl } from "../settings/connections/actions";

const staticConnectors = [
    { name: 'Google Sheets', icon: Sheet },
    { name: 'FreeAgent', icon: Briefcase },
    { name: 'Xero', icon: Briefcase },
    { name: 'QuickBooks', icon: Briefcase },
    { name: 'Google Analytics', icon: BarChart },
    { name: 'Shopify', icon: ShoppingCart },
];

function WixConnectButton() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleConnect = async () => {
        setLoading(true);
        try {
            const result = await getWixAuthUrl();
            if (result.error) {
                throw new Error(result.error);
            }
            if (result.authUrl) {
                window.location.href = result.authUrl;
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Failed to connect to Wix',
                description: (error as Error).message,
            });
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleConnect} disabled={loading} variant="outline" className="w-full h-28 flex-col gap-2 p-4 text-center transition-all hover:bg-accent/50 hover:scale-105">
            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Code className="w-8 h-8 text-muted-foreground" />}
            <span className="font-medium">Wix</span>
        </Button>
    );
}


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
                    {staticConnectors.map(connector => (
                        <Button key={connector.name} variant="outline" className="w-full h-28 flex-col gap-2 p-4 text-center transition-all hover:bg-accent/50 hover:scale-105" disabled>
                            <connector.icon className="w-8 h-8 text-muted-foreground" />
                            <span className="font-medium">{connector.name}</span>
                        </Button>
                    ))}
                    <WixConnectButton />
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
