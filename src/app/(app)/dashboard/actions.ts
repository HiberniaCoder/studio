'use server';

/**
 * This file contains server actions for the dashboard.
 *
 * To store Wix API tokens, you should create a table in Supabase:
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
*/

/**
 * Creates the authorization URL for the Wix OAuth flow.
 * @returns An object containing the URL to redirect the user to.
 */
export async function getWixAuthUrl(): Promise<{ authUrl?: string; error?: string }> {
    const wixClientId = process.env.WIX_CLIENT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!wixClientId || !appUrl) {
        console.error("Wix environment variables are not set.");
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
