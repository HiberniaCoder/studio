'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

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

const formSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters."),
  industry: z.string().min(1, "Please select an industry."),
  businessType: z.string().min(1, "Please select a business type."),
  website: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export async function saveBusinessDetails(values: FormValues) {
  const supabase = createSupabaseServerClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: 'You must be logged in to complete onboarding.' };
  }

  const { error } = await supabase
    .from('clients')
    .update({
      business_name: values.businessName,
      business_type: values.businessType,
      website: values.website,
      industry: values.industry,
      onboarding_step: 0,
    })
    .eq('user_id', user.id);


  if (error) {
    console.error('Supabase update error:', error);
    return { error: 'Failed to save your business details. Please try again.' };
  }

  redirect('/dashboard');
}

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
