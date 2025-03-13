import { LoginForm } from "@/app/(component)/Authentication/login-form";
import { ModeToggle } from "@/app/(component)/Navbar/ThemeToggleButton";
import { buttonVariants } from "@/components/ui/button";

import Link from "next/link";
import React from "react";
import Image from "next/image";
const SignIn = () => {
  return (

      <div className="flex h-screen w-full items-center justify-center px-4">
        <div className="w-full max-w-xs">
          <LoginForm />
        </div>
  
    </div>
  );
};

export default SignIn;
