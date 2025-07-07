"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { type BusinessProfile, updateBusinessProfile } from "./actions";
import { type SelectOption } from "@/app/onboarding/actions";


const formSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters."),
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  website: z.string().url("Please enter a valid URL (e.g., https://example.com)").optional().or(z.literal('')),
  industry: z.string().min(1, "Please select an industry."),
  businessType: z.string().min(1, "Please select a business type."),
});

type FormValues = z.infer<typeof formSchema>;

type BusinessProfileFormProps = {
  profile: BusinessProfile;
  industries: SelectOption[];
  businessTypes: SelectOption[];
};

export function BusinessProfileForm({ profile, industries, businessTypes }: BusinessProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: profile.business_name ?? "",
      fullName: profile.full_name ?? "",
      website: profile.website ?? "",
      industry: profile.industry ?? "",
      businessType: profile.business_type ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    const result = await updateBusinessProfile(values);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: result.error,
      });
    } else {
      toast({
        title: "Profile updated!",
        description: "Your business profile has been saved.",
      });
    }
    
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Core Theorem BI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <Input readOnly disabled value={profile.email ?? "No email found"} />
            </FormItem>
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry.name} value={industry.name}>
                            {industry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a business type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type.name} value={type.name}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </div>
      </form>
    </Form>
  );
}
