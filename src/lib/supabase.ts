
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client = null;

// Check for non-empty strings before attempting to create the client.
if (supabaseUrl && supabaseUrl.length > 0 && supabaseAnonKey && supabaseAnonKey.length > 0) {
    try {
        client = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
        console.error("Error creating Supabase client: Invalid URL or Key. Please check your .env file.", e);
        client = null;
    }
}

export const supabase = client;

if (!supabase) {
  // This warning will be logged on the server during SSR and on the client.
  // It avoids crashing the application if env variables are not set.
  console.warn("Supabase environment variables not set or invalid. Features using Supabase will be disabled. Please check your .env file.");
}
