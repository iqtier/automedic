/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, UserPlus } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CustomerSchema, CustomerType } from "@/types/type";
import { createCustomer, updateCustomer } from "@/app/actions/customerActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Customer = CustomerType & { id: string };
type CustomerFormProps = { isEdit: boolean; customerToEdit: Customer | null,fromBooking: boolean};
const CustomerForm: React.FC<CustomerFormProps> = ({
  isEdit,
  customerToEdit,
  fromBooking
}) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addForm = useForm<CustomerType>({
    resolver: zodResolver(CustomerSchema),
    defaultValues:{
      name:"",
      email: "",
      phone:""
    }
  });

  const editForm = useForm<CustomerType>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      ...customerToEdit,
    },
  });
  const form = isEdit ? editForm : addForm;
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cars",
  });

  async function onSubmit(data: CustomerType) {
    let result;
    if (isEdit) {
      if (customerToEdit?.id !== undefined) {
        result = await updateCustomer(customerToEdit?.id, data);
      }
    } else {
      result = await createCustomer(data);
    }

    if (result?.status === "success") {
      toast.success(`Customer successfully ${isEdit ? "updated" : "added"}}`);
      router.refresh();
      setIsDialogOpen(false);
      form.reset();
    } else {
      form.setError("root.serverError", { message: result?.error as string });
      toast.error(`${result?.error}`);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="" onClick={() => setIsDialogOpen(true)}>
          {isEdit ?  "Edit" : fromBooking? <UserPlus />:"Add"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Customer" : "Add Customer"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edit your customer details here."
              : "Add your customer here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-5 space-y-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eamil</FormLabel>
                  <FormControl>
                    <Input placeholder="Eamil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-row justify-center items-center gap-x-2 w-full"
              >
                <FormField
                  control={form.control}
                  name={`cars.${index}.make`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <FormControl>
                        <Input placeholder="Make" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`cars.${index}.model`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Model" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`cars.${index}.year`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input placeholder="Year" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-8"
                  onClick={() => remove(index)}
                >
                  <Trash2 className=" text-red-600" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              onClick={() => append({ make: "", model: "", year: "" })}
            >
              Add Car
            </Button>

            <DialogFooter>
              <Button className="w-full font-bold" type="submit">
                {isEdit ? "Update " : "ADD "}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerForm;
