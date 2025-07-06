import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import OnboardingForm from "./onboarding-form";
import { getBusinessTypes, getIndustries } from "./actions";

export default async function OnboardingPage() {
  const [industries, businessTypes] = await Promise.all([
    getIndustries(),
    getBusinessTypes(),
  ]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-purple-100/20 to-violet-200/30 dark:from-gray-950 dark:via-purple-900/10 dark:to-violet-900/20" />
      <div className="relative z-10 w-full max-w-md p-4">
        <Card className="mx-auto w-full bg-card/80 backdrop-blur-sm">
          <CardHeader>
             <div className="mx-auto mb-4 h-14 w-14 text-primary">
              <Icons.logo />
            </div>
            <CardTitle className="text-2xl text-center">Tell us about your business</CardTitle>
            <CardDescription className="text-center">
              This will help us tailor your dashboard experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingForm industries={industries} businessTypes={businessTypes} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
