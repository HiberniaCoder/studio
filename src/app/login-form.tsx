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
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const { supabase } = useAuth();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: FormValues) {
        setLoading(true);

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        });

        if (signInError) {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: signInError.message,
            });
            setLoading(false);
            return;
        }
        
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: client, error: clientError } = await supabase
                .from("clients")
                .select("onboarding_step")
                .eq("user_id", user.id)
                .single();
            
            if (clientError && clientError.code !== 'PGRST116') { // Ignore error when row not found
                toast({
                    variant: "destructive",
                    title: "Error fetching profile",
                    description: clientError.message,
                });
                setLoading(false);
                return;
            }

            if (client && client.onboarding_step === 1) {
                router.push("/onboarding");
            } else {
                 router.push("/dashboard");
            }
        } else {
             // Fallback if user is somehow null after successful login
            router.push("/dashboard");
        }
        
        // No need to set loading to false, router push will unmount
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                            />
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
                        <div className="flex items-center">
                            <FormLabel>Password</FormLabel>
                            <Link
                                href="#"
                                className="ml-auto inline-block text-sm underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                </Button>
            </form>
        </Form>
    );
}
