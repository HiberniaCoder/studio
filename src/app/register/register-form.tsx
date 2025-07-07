
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
            description: "This application is not configured for authentication. Please check the setup.",
        });
        setLoading(false);
        return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
            data: {
                full_name: values.fullName,
            }
        }
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

    // A user was created. Now, create a corresponding entry in the 'clients' table.
    const { error: clientError } = await supabase
        .from('clients')
        .insert({ 
            user_id: signUpData.user.id, 
            onboarding_step: 1 
        });

    if (clientError) {
        toast({
            variant: "destructive",
            title: "Registration Partially Failed",
            description: "Your account was created, but we failed to set up your profile. Please contact support.",
        });
        setLoading(false);
        return;
    }

    // Profile created successfully. Now check if the user has a session.
    if (signUpData.session) {
        // User is logged in (likely email confirmation is disabled).
        toast({
            title: "Registration Successful",
            description: "Redirecting you to onboarding...",
        });
        router.push("/onboarding");
    } else {
        // User needs to confirm their email.
        toast({
            title: "Registration Successful",
            description: "Please check your email to verify your account.",
        });
    }

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

