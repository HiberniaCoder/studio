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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getForecasts } from "./actions";
import type { GenerateBusinessForecastsOutput } from "@/ai/flows/generate-business-forecasts";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessDescription: z.string().min(50, "Please provide a detailed business description."),
  historicalData: z.string().min(50, "Please provide some historical data."),
  marketTrends: z.string().min(50, "Please describe the current market trends."),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForensicsForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateBusinessForecastsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessDescription: "",
      historicalData: "",
      marketTrends: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setResult(null);
    try {
      const forecastResult = await getForecasts(values);
      setResult(forecastResult);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="businessDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your business, its products/services, and target audience..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="historicalData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide sales figures, marketing spend, user growth, etc..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketTrends"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Trends</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the current market landscape, competitor activities, and industry trends..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Forecast
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {loading && (
        <div className="mt-8 flex justify-center items-center">
          <div className="text-center">
             <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
             <p className="mt-2 text-muted-foreground">Our AI is analyzing your data...</p>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card className="transform transition-all hover:shadow-lg animate-in fade-in-50 duration-500">
            <CardHeader>
              <CardTitle>Prioritized Business Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{result.prioritizedAreas}</p>
            </CardContent>
          </Card>
          <Card className="transform transition-all hover:shadow-lg animate-in fade-in-50 duration-500 delay-150">
            <CardHeader>
              <CardTitle>AI-driven Forecasts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{result.forecasts}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
