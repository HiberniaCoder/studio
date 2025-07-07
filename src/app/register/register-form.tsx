
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
import { supabase } from "@/lib/supabase";

const formSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);

    if (!supabase) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description:
          "This application is not configured for authentication. Please check the setup.",
      });
      setLoading(false);
      return;
    }

    // 1. Create the user in Supabase auth
    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
        },
      });

    if (signUpError) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: signUpError.message,
      });
      setLoading(false);
      return;
    }

    if (!signUpData.user) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Could not create user. Please try again.",
      });
      setLoading(false);
      return;
    }

    // 2. Sign in the user to establish a session.
    // This is crucial for the RLS policy on the `clients` table insert.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    
    // If sign-in fails, it's likely because email confirmation is required.
    if (signInError) {
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      });
      setLoading(false);
      return;
    }

    // 3. With an active session, create the corresponding entry in the 'clients' table.
    const { error: clientError } = await supabase
      .from("clients")
      .insert({
        user_id: signUpData.user.id,
        onboarding_step: 1,
      });

    if (clientError) {
      toast({
        variant: "destructive",
        title: "Registration Partially Failed",
        description: `Your account was created, but we failed to set up your profile. Please contact support. Error: ${clientError.message}`,
      });
      setLoading(false);
      return;
    }
    
    // 4. Refresh server-side session and redirect to the onboarding flow.
    router.refresh();
    router.push("/onboarding");
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>
    </Form>
  );
}
