import { LoginForm } from "@/app/(component)/Authentication/login-form";
import { ModeToggle } from "@/app/(component)/Navbar/ThemeToggleButton";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const SignIn = () => {
  return (
    <div className="">
      <nav className="inset-x-0 top-0  bg-white shadow-sm dark:bg-gray-950/90">
        <div className="flex justify-between h-14 items-center pr-10 py-5">
          <div className="flex  h-14 items-center pr-10">
            <div className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4"></div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />

            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "outline" })}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={`${buttonVariants({ variant: "default" })} `}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="mt-20"><LoginForm  /></div>
      

    </div>
  );
};

export default SignIn;
