'use server';

import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

const formSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters."),
  businessType: z.string().min(2, "Please enter a valid business type."),
  website: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  industry: z.string().min(2, "Please enter your industry."),
});

type FormValues = z.infer<typeof formSchema>;

export async function saveBusinessDetails(values: FormValues) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: 'You must be logged in to complete onboarding.' };
  }

  /*
    * In your Supabase project, you'll need to create a 'clients' table with the following schema:
    *
    * CREATE TABLE clients (
    *   id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    *   user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    *   business_name text,
    *   business_type text,
    *   website text,
    *   industry text,
    *   created_at timestamp with time zone DEFAULT now() NOT NULL
    * );
    *
    * After creating the table, enable Row Level Security (RLS) and create policies.
    * Example policies:
    * - Enable read access for users based on their user_id:
    *   CREATE POLICY "Enable read access for own user" ON public.clients FOR SELECT USING (auth.uid() = user_id);
    * - Enable insert for authenticated users:
    *   CREATE POLICY "Enable insert for authenticated users" ON public.clients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  */
  const { error } = await supabase.from('clients').insert({
    user_id: user.id,
    business_name: values.businessName,
    business_type: values.businessType,
    website: values.website,
    industry: values.industry,
  });

  if (error) {
    console.error('Supabase insert error:', error);
    if (error.code === '23505') { // Unique constraint violation
        return { error: 'These business details have already been saved.' };
    }
    return { error: 'Failed to save your business details. Please try again.' };
  }

  redirect('/dashboard');
}
