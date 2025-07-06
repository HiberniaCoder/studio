'use server';

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type WixAnalyticsData = {
    metric_type: string;
    date: string;
    value: number;
}[];

export async function getWixAnalyticsData(): Promise<WixAnalyticsData | null> {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('wix_analytics_data')
        .select('metric_type, date, value')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

    if (error) {
        console.error("Error fetching Wix analytics data:", error);
        return null;
    }
    
    return data;
}

export async function checkWixConnection() {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { connected: false, configured: false };

    const { data, error } = await supabase
        .from('wix_settings')
        .select('is_configured')
        .eq('user_id', user.id)
        .single();
    
    if (error || !data) {
        return { connected: false, configured: false };
    }

    return { connected: true, configured: data.is_configured };
}
