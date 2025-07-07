"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
import { type SelectOption } from "./actions";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters."),
  industry: z.string().min(1, "Please select an industry."),
  businessType: z.string().min(1, "Please select a business type."),
  website: z.string().url("Please enter a valid URL (e.g., https://example.com)").optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

type OnboardingFormProps = {
  industries: SelectOption[];
  businessTypes: SelectOption[];
};

export default function OnboardingForm({ industries, businessTypes }: OnboardingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { supabase, user, loading: authLoading } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      website: "",
      industry: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    if (!user) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "You must be logged in to complete onboarding.",
      });
      setIsSubmitting(false);
      return;
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
      toast({
        variant: "destructive",
        title: "Failed to save details",
        description: error.message,
      });
    } else {
      toast({
        title: "Profile updated!",
        description: "Redirecting you to the dashboard.",
      });
      router.push("/dashboard");
    }
    
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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

        <Button type="submit" className="w-full mt-2" disabled={isSubmitting || authLoading}>
          {(isSubmitting || authLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue to Dashboard
        </Button>
      </form>
    </Form>
  );
}
