"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import { deleteUserAccount } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, Trash2 } from "lucide-react";

export default function OnboardingActions() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteUserAccount();
      if (result?.error) {
        throw new Error(result.error);
      }
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      });
      // The server action redirects, but we'll push just in case.
      router.push("/register");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="w-full text-center text-sm text-muted-foreground">or</div>
      <div className="flex w-full items-center justify-center gap-4">
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Yes, delete account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
