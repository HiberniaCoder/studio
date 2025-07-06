"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { startWixImport } from "./actions";
import { DatabaseZap, Loader2 } from "lucide-react";

const dataTypes = [
  { id: "site-sessions", label: "Site Sessions" },
  { id: "total-sales", label: "Total Sales" },
  { id: "bookings", label: "Bookings" },
] as const;

const timeframes = ["1 month", "6 months", "12 months", "All time"];

const formSchema = z.object({
  dataTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one data type to import.",
  }),
  timeframe: z.string({
    required_error: "You need to select a timeframe.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ConfigureWixForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataTypes: ["site-sessions", "total-sales"],
      timeframe: "6 months",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    const result = await startWixImport(values);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: result.error,
      });
      setLoading(false);
    }
    // On success, the action redirects, so no success toast is needed.
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="dataTypes"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Data to Import</FormLabel>
                <FormDescription>
                  Select the analytics data you want to display on your dashboard.
                </FormDescription>
              </div>
              {dataTypes.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="dataTypes"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timeframe"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base">Timeframe</FormLabel>
              <FormDescription>
                How far back should we import your data?
              </FormDescription>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                    {timeframes.map(frame => (
                         <FormItem key={frame} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                                <RadioGroupItem value={frame} />
                            </FormControl>
                            <FormLabel className="font-normal">{frame}</FormLabel>
                         </FormItem>
                    ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing Data...</>
            ) : (
                <><DatabaseZap className="mr-2 h-4 w-4" /> Start Import</>
            )}
        </Button>
      </form>
    </Form>
  );
}
