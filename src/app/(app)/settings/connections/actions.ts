
'use server';

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

/**
 * In your Supabase project, you'll need to create a 'wix_tokens' table.
 *
 * CREATE TABLE wix_tokens (
 *   id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
 *   user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
 *   access_token text NOT NULL,
 *   refresh_token text NOT NULL,
 *   created_at timestamp with time zone DEFAULT now() NOT NULL
 * );
 *
 * And enable Row Level Security (RLS) with appropriate policies.
 * Example policies:
 * - Enable read access for users based on their user_id:
 *   CREATE POLICY "Enable read access for own user" ON public.wix_tokens FOR SELECT USING (auth.uid() = user_id);
 * - Enable all for users based on user_id (for upsert/delete):
 *   CREATE POLICY "Enable all actions for own user" ON public.wix_tokens FOR ALL USING (auth.uid() = user_id);
*/

/**
 * Creates the authorization URL for the Wix OAuth flow.
 * @returns An object containing the URL to redirect the user to.
 */
export async function getWixAuthUrl(): Promise<{ authUrl?: string; error?: string }> {
    const wixClientId = process.env.WIX_CLIENT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!wixClientId || !appUrl) {
        console.error("Wix environment variables WIX_CLIENT_ID or NEXT_PUBLIC_APP_URL are not set.");
        return { error: 'Wix application details are not configured. Please contact support.' };
    }

    const redirectUri = `${appUrl}/api/auth/wix/callback`;

    const authUrl = new URL('https://www.wix.com/oauth/authorize');
    authUrl.searchParams.set('client_id', wixClientId);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    // In a real app, you would add the necessary scopes to access specific Wix APIs.
    // Example: authUrl.searchParams.set('scope', 'wix-stores.read-orders'); 
    
    return { authUrl: authUrl.toString() };
}

/**
 * Fetches the connection status for all third-party services.
 */
export async function getConnectionStatuses(): Promise<{ [key: string]: { connected: boolean } }> {
    if (!supabase) {
        throw new Error("Database connection is not configured.");
    }
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated.");
    }

    // Check for Wix connection
    const { data: wixToken, error: wixError } = await supabase
        .from('wix_tokens')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

    if (wixError) {
        console.error("Error fetching Wix token status:", wixError);
        throw new Error("Failed to fetch Wix connection status.");
    }

    // In the future, check other connections here

    return {
        wix: { connected: !!wixToken },
    };
}


/**
 * Disconnects the user's Wix account by deleting their tokens.
 */
export async function disconnectWix(): Promise<{ success?: boolean, error?: string }> {
    if (!supabase) {
        return { error: "Database connection is not configured." };
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "User not authenticated." };
    }

    const { error } = await supabase
        .from('wix_tokens')
        .delete()
        .eq('user_id', user.id);

    if (error) {
        console.error("Error disconnecting Wix:", error);
        return { error: "Failed to disconnect Wix account." };
    }

    revalidatePath('/settings/connections');
    return { success: true };
}
