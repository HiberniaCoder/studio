'use server';

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type BusinessProfile = {
    business_name: string | null;
    full_name: string | null;
    website: string | null;
    industry: string | null;
    business_type: string | null;
    email: string | null;
};

// This function will fetch data from both `clients` and `auth.users`.
export async function getBusinessProfile(): Promise<BusinessProfile> {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated.");
    }

    const { data: clientData, error } = await supabase
        .from('clients')
        .select('business_name, website, industry, business_type')
        .eq('user_id', user.id)
        .single();

    if (error) {
        console.error("Error fetching client data:", error);
        throw new Error("Could not fetch business profile.");
    }

    return {
        business_name: clientData.business_name,
        website: clientData.website,
        industry: clientData.industry,
        business_type: clientData.business_type,
        full_name: user.user_metadata.full_name,
        email: user.email ?? null
    };
}

const profileSchema = z.object({
    businessName: z.string().min(2, "Business name must be at least 2 characters."),
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    website: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
    industry: z.string().min(1, "Please select an industry."),
    businessType: z.string().min(1, "Please select a business type."),
});

export async function updateBusinessProfile(values: z.infer<typeof profileSchema>): Promise<{ success?: boolean; error?: string }> {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "User not authenticated." };
    }

    // Update the clients table
    const { error: clientError } = await supabase
        .from('clients')
        .update({
            business_name: values.businessName,
            website: values.website,
            industry: values.industry,
            business_type: values.businessType,
        })
        .eq('user_id', user.id);

    if (clientError) {
        console.error("Error updating client data:", clientError);
        return { error: "Failed to update business profile." };
    }

    // Update the user's metadata
    const { error: userError } = await supabase.auth.updateUser({
        data: { full_name: values.fullName }
    });
    
    if (userError) {
        console.error("Error updating user metadata:", userError);
        return { error: "Failed to update contact person." };
    }

    revalidatePath('/settings');
    return { success: true };
}
