/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signInUser } from "@/app/actions/authActions";
import FormInput from "../FormInput/form-input";
import { LogInSchema } from "@/types/type";


export function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof LogInSchema>>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LogInSchema>) {
    const result = await signInUser(values);
    if (result?.status == "success") {
   
      router.push("/");
    } else {
      toast.error(result?.error as string);
    }
  }
  return (
    <Card className="mx-auto max-w-sm  dark:bg-gray-700 shadow-2xl   dark:ring-offset-slate-900   ">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormInput
              form={form}
              name={"email"}
              placeholder="user@example.com"
              ispassword={false}
              label={"Email"}
            />
            <FormInput
              form={form}
              name={"password"}
              placeholder="Enter your password"
              ispassword={true}
              label={"Password"}
            />

            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
