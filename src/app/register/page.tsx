import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-purple-100/20 to-violet-200/30 dark:from-gray-950 dark:via-purple-900/10 dark:to-violet-900/20" />
      <div className="relative z-10 w-full max-w-md">
        <Card className="mx-auto max-w-sm bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto mb-4 h-14 w-14 text-primary">
              <Icons.logo />
            </div>
            <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Enter your information to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/" className="underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
