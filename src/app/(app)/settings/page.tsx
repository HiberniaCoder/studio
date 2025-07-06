import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image';

export default function SettingsPage() {
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
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input id="business-name" defaultValue="Innovate Inc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-person">Contact Person</Label>
                  <Input id="contact-person" defaultValue="Jane Doe" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="contact@innovate.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Innovation Drive, Tech City, 12345" />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
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
}
