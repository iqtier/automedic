/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import FormInput from "../FormInput/form-input";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/authActions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { UserSchema } from "@/types/type";
import { z } from "zod";
const AddEmployeeForm = () => {
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "",
    },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    form.reset();
  };
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof UserSchema>) {
    const result = await registerUser(values);

    if (typeof result === "string") {
      toast.error(result);
      return;
    }
    if (result.status === "success") {
      toast.success("Employees successfully added");
      router.refresh();
      handleDialogClose()
    } else {
      form.setError("root.serverError", { message: result.error as string });
      toast.error(`${result.error}`);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
          <UserPlus /> Add Eployee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogDescription>
            Create emplouyee profile here. Click submit when youre done.
          </DialogDescription>
        </DialogHeader>
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
              Add
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeForm;
