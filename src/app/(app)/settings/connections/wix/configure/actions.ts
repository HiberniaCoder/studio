'use server';

import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { redirect } from 'next/navigation';
import { revalidatePath } from "next/cache";

/*
* In your Supabase project, create a 'wix_settings' table:
*
* CREATE TABLE wix_settings (
*   id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
*   user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
*   import_site_sessions boolean DEFAULT false,
*   import_total_sales boolean DEFAULT false,
*   import_bookings boolean DEFAULT false,
*   import_timeframe text NOT NULL,
*   is_configured boolean DEFAULT false,
*   created_at timestamp with time zone DEFAULT now() NOT NULL,
*   updated_at timestamp with time zone DEFAULT now() NOT NULL
* );
*
* And a 'wix_analytics_data' table:
*
* CREATE TABLE wix_analytics_data (
*   id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
*   user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
*   metric_type text NOT NULL,
*   date date NOT NULL,
*   value numeric NOT NULL,
*   created_at timestamp with time zone DEFAULT now() NOT NULL
* );
* 
* Don't forget to enable RLS and create policies for both tables.
*
* -- RLS Policies for wix_settings
* CREATE POLICY "Enable all actions for own user"
* ON public.wix_settings
* FOR ALL
* USING (auth.uid() = user_id);
*
* -- RLS Policies for wix_analytics_data
* CREATE POLICY "Enable all actions for own user"
* ON public.wix_analytics_data
* FOR ALL
* USING (auth.uid() = user_id);
*/

const formSchema = z.object({
    dataTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one data type to import.",
    }),
    timeframe: z.string().min(1, "Please select a timeframe."),
});

type FormValues = z.infer<typeof formSchema>;

// MOCK WIX API. In a real app, you would use the Wix SDK or REST API.
async function fetchWixData(accessToken: string, dataType: string, timeframe: string) {
    console.log(`Fetching ${dataType} for ${timeframe} from Wix...`);
    // This is a placeholder. A real implementation would make an HTTP request to the Wix API.
    // e.g., await axios.get(`https://www.wixapis.com/v1/analytics?metrics=${dataType}&from=${...}`, { headers: { Authorization: `Bearer ${accessToken}` } });
    
    // Generate some mock data for demonstration
    const mockData: { date: string; value: number }[] = [];
    const now = new Date();
    const months = timeframe === '1 month' ? 1 : timeframe === '6 months' ? 6 : timeframe === '12 months' ? 12 : 24;
    
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        let value = 0;
        if (dataType === 'site-sessions') {
            value = Math.floor(Math.random() * (15000 - 5000 + 1) + 5000);
        } else if (dataType === 'total-sales') {
            value = Math.floor(Math.random() * (25000 - 8000 + 1) + 8000);
        } else { // bookings
            value = Math.floor(Math.random() * (500 - 100 + 1) + 100);
        }
        mockData.push({ date: date.toISOString().split('T')[0], value });
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return { data: mockData };
}

export async function startWixImport(values: FormValues) {
    if (!supabase) {
        return { error: 'Database connection is not configured.' };
    }
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return { error: 'You must be logged in.' };
    }

    // 1. Get user's Wix access token
    const { data: tokenData, error: tokenError } = await supabase
        .from('wix_tokens')
        .select('access_token')
        .eq('user_id', user.id)
        .single();
    
    if (tokenError || !tokenData) {
        return { error: 'Wix connection not found. Please reconnect.' };
    }

    // 2. Save configuration
    const { error: settingsError } = await supabase
        .from('wix_settings')
        .upsert({
            user_id: user.id,
            import_site_sessions: values.dataTypes.includes('site-sessions'),
            import_total_sales: values.dataTypes.includes('total-sales'),
            import_bookings: values.dataTypes.includes('bookings'),
            import_timeframe: values.timeframe,
            is_configured: true,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

    if (settingsError) {
        console.error('Error saving Wix settings:', settingsError);
        return { error: 'Failed to save configuration.' };
    }
    
    // 3. Clear old data for this user
    await supabase.from('wix_analytics_data').delete().eq('user_id', user.id);

    // 4. Fetch and insert data for each selected type
    for (const dataType of values.dataTypes) {
        try {
            const wixData = await fetchWixData(tokenData.access_token, dataType, values.timeframe);

            if (wixData.data && wixData.data.length > 0) {
                const recordsToInsert = wixData.data.map(d => ({
                    user_id: user.id,
                    metric_type: dataType,
                    date: d.date,
                    value: d.value
                }));

                const { error: insertError } = await supabase.from('wix_analytics_data').insert(recordsToInsert);
                if (insertError) {
                    throw new Error(`Failed to insert ${dataType} data: ${insertError.message}`);
                }
            }
        } catch (e) {
            console.error(`Error importing ${dataType}:`, e);
            return { error: `Failed to import data for ${dataType}.` };
        }
    }

    revalidatePath('/dashboard');
    redirect('/dashboard');
}
