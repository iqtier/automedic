import BusinessSetup from "@/app/(component)/Authentication/business-setup-form";

import { ModeToggle } from "@/app/(component)/Navbar/ThemeToggleButton";
import { Button, buttonVariants } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";

import React from "react";

const page = () => {
  return (
    <div className="">
      <nav className="inset-x-0  top-0 sticky bg-white shadow-sm z-10 dark:bg-gray-950">
        <div className="flex justify-between h-14 items-center pr-10 py-5">
          <div className="flex  h-14 items-center pr-10">
            <div className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4"></div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />

            <div className="flex items-center gap-4">
            
            <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/sign-in" });
            }}
          >
            <Button
              className="flex flex-row gap-1 items-center "
              type="submit"
              variant={"destructive"}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-6xl font-bold">Setup Business</h1>
        <p className="text-xl">Fill up your business information</p>
        <BusinessSetup />
      </div>
    </div>
  );
};

export default page;
