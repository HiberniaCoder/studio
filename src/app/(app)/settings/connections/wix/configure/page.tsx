import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import ConfigureWixForm from "./form";
  
export default function ConfigureWixPage() {
    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex flex-col items-center justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                            <Icons.logo className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-2xl">Configure Wix Integration</CardTitle>
                        <CardDescription>
                            Your Wix account is connected. Select the data you want to import into your dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ConfigureWixForm />
                    </CardContent>
                </Card>
            </div>
      </div>
    );
}
