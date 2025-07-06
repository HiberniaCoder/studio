import { type NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { supabase } from '@/lib/supabase';

/**
 * This is the callback route for Wix OAuth.
 * Wix redirects the user to this endpoint after they grant consent.
 * This handler exchanges the authorization code for an access token
 * and stores it securely in the database.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const connectionsUrl = new URL('/settings/connections', request.url);

  if (!code) {
    connectionsUrl.searchParams.set('error', 'wix_auth_failed');
    connectionsUrl.searchParams.set('error_description', 'Authorization was not granted.');
    return NextResponse.redirect(connectionsUrl);
  }

  const wixClientId = process.env.WIX_CLIENT_ID;
  const wixClientSecret = process.env.WIX_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!wixClientId || !wixClientSecret || !appUrl) {
    console.error('Wix environment variables are not fully set.');
    connectionsUrl.searchParams.set('error', 'wix_config_error');
    connectionsUrl.searchParams.set('error_description', 'Wix integration is not configured correctly.');
    return NextResponse.redirect(connectionsUrl);
  }

  try {
    // 1. Exchange authorization code for an access token from Wix.
    const tokenResponse = await axios.post('https://www.wix.com/oauth/token', {
      grant_type: 'authorization_code',
      client_id: wixClientId,
      client_secret: wixClientSecret,
      code: code,
    });

    const { access_token, refresh_token } = tokenResponse.data;

    if (!access_token || !refresh_token) {
        throw new Error('Failed to retrieve tokens from Wix.');
    }

    // 2. Get the authenticated user from Supabase.
    if (!supabase) {
        throw new Error('Supabase client is not available.');
    }
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated.');
    }

    // 3. Securely store the tokens in the database, updating if they already exist.
    const { error: upsertError } = await supabase
      .from('wix_tokens')
      .upsert({
        user_id: user.id,
        access_token,
        refresh_token,
      }, { onConflict: 'user_id' });

    if (upsertError) {
      throw upsertError;
    }

    connectionsUrl.searchParams.set('wix_connected', 'true');
    return NextResponse.redirect(connectionsUrl);

  } catch (error) {
    console.error('Wix OAuth callback error:', error);
    connectionsUrl.searchParams.set('error', 'wix_token_exchange_failed');
    
    let errorMessage = 'Could not connect your Wix account.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    connectionsUrl.searchParams.set('error_description', errorMessage);
    
    return NextResponse.redirect(connectionsUrl);
  }
}
