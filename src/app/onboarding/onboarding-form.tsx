"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { saveBusinessDetails } from "./actions";

const formSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters."),
  businessType: z.string().min(2, "Please enter a valid business type."),
  website: z.string().url("Please enter a valid URL (e.g., https://example.com)").optional().or(z.literal('')),
  industry: z.string().min(2, "Please enter your industry."),
});

type FormValues = z.infer<typeof formSchema>;

export default function OnboardingForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    setLoading(true);
    const result = await saveBusinessDetails(values);

    if (result?.error) {
        toast({
            variant: "destructive",
            title: "Something went wrong",
            description: result.error,
        });
        setLoading(false);
    }
    // On success, the action redirects, so no need to handle success case here.
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
              <FormControl>
                <Input placeholder="e.g., Technology, Marketing, Retail" {...field} />
              </FormControl>
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
              <FormControl>
                <Input placeholder="e.g., SaaS, E-commerce, Agency" {...field} />
              </FormControl>
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

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue to Dashboard
        </Button>
      </form>
    </Form>
  );
}
