
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getConnectionStatuses, disconnectWix, getWixAuthUrl } from "./actions";
import { Loader2, Code, Sheet, Briefcase, BarChart, ShoppingCart, CheckCircle2, XCircle, Unplug } from "lucide-react";
import type { Icon } from "lucide-react";

type ConnectionStatus = {
    [key: string]: {
        connected: boolean;
    };
};

const ALL_CONNECTORS: { name: string; key: string; icon: Icon }[] = [
    { name: 'Wix', key: 'wix', icon: Code },
    { name: 'Google Sheets', key: 'googleSheets', icon: Sheet },
    { name: 'FreeAgent', key: 'freeAgent', icon: Briefcase },
    { name: 'Xero', key: 'xero', icon: Briefcase },
    { name: 'QuickBooks', key: 'quickBooks', icon: Briefcase },
    { name: 'Google Analytics', key: 'googleAnalytics', icon: BarChart },
    { name: 'Shopify', key: 'shopify', icon: ShoppingCart },
];

function ConnectionSkeleton() {
    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-md" />
            </div>
        </div>
    );
}

export default function ConnectionsPage() {
    const [statuses, setStatuses] = useState<ConnectionStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const router = useRouter();

    const fetchStatuses = useCallback(async () => {
        try {
            const currentStatuses = await getConnectionStatuses();
            setStatuses(currentStatuses);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: (error as Error).message });
        } finally {
            setLoading(false);
        }
    }, [toast]);
    
    useEffect(() => {
        fetchStatuses();
    }, [fetchStatuses]);

    useEffect(() => {
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
            toast({
                title: `Error: ${error}`,
                description: errorDescription || 'An unknown error occurred.',
                variant: 'destructive',
            });
            router.replace('/settings/connections');
        }
    }, [searchParams, toast, router]);

    const handleConnectWix = async () => {
        setActionLoading('wix');
        try {
            const result = await getWixAuthUrl();
            if (result.error) throw new Error(result.error);
            if (result.authUrl) window.location.href = result.authUrl;
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to connect to Wix', description: (error as Error).message });
            setActionLoading(null);
        }
    };

    const handleDisconnectWix = async () => {
        setActionLoading('wix');
        try {
            const result = await disconnectWix();
            if (result.error) throw new Error(result.error);
            toast({ title: 'Wix Disconnected', description: 'Your Wix account has been unlinked.' });
            await fetchStatuses();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to disconnect Wix', description: (error as Error).message });
        } finally {
            setActionLoading(null);
        }
    };

    const renderConnection = (connector: { name: string; key: string; icon: Icon }) => {
        const isConnected = statuses?.[connector.key]?.connected ?? false;
        const isLoading = actionLoading === connector.key;

        const onConnect = connector.key === 'wix' ? handleConnectWix : undefined;
        const onDisconnect = connector.key === 'wix' ? handleDisconnectWix : undefined;

        return (
            <div key={connector.key} className="flex items-center justify-between p-4 border-b last:border-b-0">
                <div className="flex items-center gap-4">
                    <connector.icon className="h-8 w-8 text-muted-foreground" />
                    <span className="font-medium">{connector.name}</span>
                </div>
                <div className="flex items-center gap-4">
                    {isConnected ? (
                        <Badge variant="outline" className="text-green-600 border-green-600 gap-1.5 pl-2 pr-3">
                            <CheckCircle2 className="h-4 w-4" /> Connected
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="gap-1.5">
                            <XCircle className="h-4 w-4" /> Not Connected
                        </Badge>
                    )}

                    {isConnected ? (
                        <Button variant="destructive" size="sm" onClick={onDisconnect} disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : <Unplug />}
                            Disconnect
                        </Button>
                    ) : (
                        <Button variant="default" size="sm" onClick={onConnect} disabled={isLoading || !onConnect}>
                            {isLoading ? <Loader2 className="animate-spin" /> : null}
                            Connect
                        </Button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <h1 className="text-3xl font-bold tracking-tight">Data Connections</h1>
            <p className="text-muted-foreground">
                Manage your third-party integrations to sync business data directly to your dashboard.
            </p>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Integrations</CardTitle>
                    <CardDescription>
                        Connect or disconnect your accounts from the services below.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="space-y-2 p-4">
                            {[...Array(3)].map((_, i) => <ConnectionSkeleton key={i} />)}
                        </div>
                    ) : (
                        <div>
                            {ALL_CONNECTORS.map(renderConnection)}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
