import { type NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

/**
 * This is the callback route for Wix OAuth.
 * Wix redirects the user to this endpoint after they grant consent.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dashboardUrl = new URL('/dashboard', request.url);
  const code = searchParams.get('code');

  if (!code) {
    dashboardUrl.searchParams.set('error', 'wix_auth_failed');
    dashboardUrl.searchParams.set('error_description', 'Authorization was not granted.');
    return NextResponse.redirect(dashboardUrl);
  }

  try {
    // In the next step, we will exchange this code for an access token
    // and store it securely in the database.
    
    // For now, we will just confirm the connection was initiated.
    // TODO: Step 1: Exchange the authorization code for an access token from Wix.
    // TODO: Step 2: Get the authenticated user from Supabase.
    // TODO: Step 3: Securely store the access_token and refresh_token in your database.

    dashboardUrl.searchParams.set('wix_connected', 'true');
    return NextResponse.redirect(dashboardUrl);

  } catch (error) {
    console.error('Wix OAuth callback error:', error);
    dashboardUrl.searchParams.set('error', 'wix_token_exchange_failed');
    dashboardUrl.searchParams.set('error_description', 'Could not exchange authorization code for an access token.');
    return NextResponse.redirect(dashboardUrl);
  }
}
