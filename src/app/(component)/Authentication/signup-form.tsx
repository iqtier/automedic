/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { registerUser } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-toastify";

import FormInput from "../FormInput/form-input";
import { UserSchema } from "@/types/type";




export function SignUpForm() {
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const router = useRouter();
  async function onSubmit(values:z.infer<typeof UserSchema>) {
    const result = await registerUser(values);

    if (typeof result === "string") {
      toast.error(result);
      return;
    }
    if (result.status === "success") {
      toast.success("User registration successful");
      router.push("/sign-in");
    } else {
      form.setError("root.serverError", { message: result.error as string });
      toast.error(`${result.error}`);
    }
  }

  return (
    <Card className="mx-auto max-w-sm  dark:bg-gray-700 shadow-2xl ring-2 ring-purple-500 ring-offset-4 ring-offset-slate-50 dark:ring-offset-slate-900   ">
      <CardHeader>
        <CardTitle className="text-2xl">Register </CardTitle>
        <CardDescription>
          Enter your information to Create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormInput
              form={form}
              name="username"
              label="Username"
              placeholder="Enter your username"
              ispassword={false}
            />
            <FormInput
              form={form}
              name="email"
              label="Email"
              placeholder="Enter your email"
              ispassword={false}
            />
            <FormInput
              form={form}
              name="password"
              label="Password"
              placeholder="Enter your password"
              ispassword={true}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          <Button variant="outline" className="w-full mb-3">
            Login with Google
          </Button>
          Already have an account?{" "}
          <Link href="/sign-in" className="underline">
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
