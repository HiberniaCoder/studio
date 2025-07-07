'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Deletes a user account from Supabase auth and all associated data.
 * This requires the SUPABASE_SERVICE_ROLE_KEY to be set in environment variables.
 * @returns An object with an error message if something goes wrong.
 */
export async function deleteUserAccount(): Promise<{ error?: string } | void> {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to delete your account.' };
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (error) {
    console.error('Error deleting user:', error);
    return { error: 'There was a problem deleting your account.' };
  }
  
  redirect('/register');
}

/*
* In your Supabase project, you'll need to create the following tables:
*
* CREATE TABLE clients (
*   id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
*   user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
*   business_name text,
*   business_type text,
*   website text,
*   industry text,
*   onboarding_step integer DEFAULT 1,
*   created_at timestamp with time zone DEFAULT now() NOT NULL
* );
*
* CREATE TABLE industries (
*  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
*  name text NOT NULL UNIQUE,
*  created_at timestamp with time zone DEFAULT now() NOT NULL
* );
*
* CREATE TABLE business_types (
*  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
*  name text NOT NULL UNIQUE,
*  created_at timestamp with time zone DEFAULT now() NOT NULL
* );
*
* And enable Row Level Security (RLS) and create policies.
*
* -- Policies for clients table
* CREATE POLICY "Enable read access for own user" ON public.clients FOR SELECT USING (auth.uid() = user_id);
* CREATE POLICY "Enable insert for authenticated users" ON public.clients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
* CREATE POLICY "Enable update for own user" ON public.clients FOR UPDATE USING (auth.uid() = user_id);
*
* -- Policies for industries table
* CREATE POLICY "Enable read access for all users" ON public.industries FOR SELECT USING (true);
*
* -- Policies for business_types table
* CREATE POLICY "Enable read access for all users" ON public.business_types FOR SELECT USING (true);
*
* You can also insert some initial data:
*
* INSERT INTO industries (name) VALUES ('Technology'), ('Marketing'), ('Retail'), ('Healthcare'), ('Finance'), ('E-commerce');
* INSERT INTO business_types (name) VALUES ('SaaS'), ('Agency'), ('B2B'), ('B2C'), ('Marketplace');
*
*/


export type SelectOption = {
    name: string;
};

export async function getIndustries(): Promise<SelectOption[]> {
  const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('industries').select('name').order('name');
    if (error) {
        console.error('Error fetching industries:', error);
        return [];
    }
    return data;
}

export async function getBusinessTypes(): Promise<SelectOption[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('business_types').select('name').order('name');
    if (error) {
        console.error('Error fetching business types:', error);
        return [];
    }
    return data;
}
