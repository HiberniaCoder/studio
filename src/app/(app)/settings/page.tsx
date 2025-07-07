import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image';
import Link from 'next/link';
import { DatabaseZap } from "lucide-react";
import { getBusinessProfile } from "./actions";
import { getBusinessTypes, getIndustries } from "@/app/onboarding/actions";
import { BusinessProfileForm } from "./business-profile-form";

export default async function SettingsPage() {
  
  try {
    const [profile, industries, businessTypes] = await Promise.all([
      getBusinessProfile(),
      getIndustries(),
      getBusinessTypes(),
    ]);

    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>Update your company's information.</CardDescription>
            </CardHeader>
            <CardContent>
              <BusinessProfileForm profile={profile} industries={industries} businessTypes={businessTypes} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Connections</CardTitle>
              <CardDescription>Manage your third-party integrations to sync business data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                    <DatabaseZap className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Connect your business tools like Wix, Shopify, or Google Analytics to automatically populate your dashboard with real-time data and insights.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                  <Link href="/settings/connections">Manage Connections</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Customize the look of your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center gap-6">
                 <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center">
                    <Image src="https://placehold.co/100x100.png" alt="Logo" width={100} height={100} className="rounded-md" data-ai-hint="logo company"/>
                 </div>
                 <div>
                    <h3 className="text-lg font-medium">Company Logo</h3>
                    <p className="text-sm text-muted-foreground">Upload a JPG, PNG, or SVG. Max size 800x800px.</p>
                    <Button variant="outline" className="mt-2">Upload Logo</Button>
                 </div>
               </div>
               <Separator/>
               <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: 'hsl(var(--primary))' }} />
                    <Input id="primary-color" defaultValue="#4B0082" className="w-40" />
                    <Button variant="secondary">Change</Button>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
     return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Card>
            <CardHeader>
                <CardTitle>Error</CardTitle>
                <CardDescription>Could not load your business profile.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-destructive">Please try logging out and logging back in. If the problem persists, please contact support.</p>
            </CardContent>
        </Card>
      </div>
    );
  }
}