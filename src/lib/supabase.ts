import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  // This warning will be logged on the server during SSR and on the client.
  // It avoids crashing the application if env variables are not set.
  console.warn("Supabase environment variables not set. Features using Supabase will be disabled. Please check your .env file.");
}
