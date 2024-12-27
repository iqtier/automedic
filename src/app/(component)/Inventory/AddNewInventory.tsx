"use client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HousePlus, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
const formSchema = z.object({
  name: z.string().min(1),
  sku: z.string().optional(),
  description: z.string(),
  category: z.string().min(1),
  supplier: z.string().optional(),
  unit_cost: z.string().min(1),
  retail_price: z.string().optional(),
  measure_of_unit: z.string(),
  reorder_point: z.string().min(1),
  storage_location: z.string().min(1),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
});

const AddNewInventory = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button className="font-normal">
            <PackagePlus /> Add New Item
          </Button>
        </DialogTrigger>
        <DialogContent className="h-full ">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add your inventory details here
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="rounded-md border p-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 max-w-3xl mx-auto py-10"
              >
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Name" type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter Your inventory name
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="SKU" type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter stock keeping unit number of parts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Write Description of your Inventory
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="m@example.com">
                                m@example.com
                              </SelectItem>
                              <SelectItem value="m@google.com">
                                m@google.com
                              </SelectItem>
                              <SelectItem value="m@support.com">
                                m@support.com
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select Category of Inventory
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="supplier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Supplier</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Supplier" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="m@example.com">
                                m@example.com
                              </SelectItem>
                              <SelectItem value="m@google.com">
                                m@google.com
                              </SelectItem>
                              <SelectItem value="m@support.com">
                                m@support.com
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Select Supplier</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="unit_cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Cost</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Unit Cost"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter cost of your inventory (per unit)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="retail_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retail Price</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Retail Price"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Retail Price of your Inventory
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="measure_of_unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mesure Of Unit</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Measure of Unit"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the measure of unit of inventory
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="reorder_point"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reorder Point</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Reorder Point"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the amount when you want reminder for
                            reordering{" "}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="storage_location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Storage Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Storage Location"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter storage location of your inventory
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Make</FormLabel>
                          <FormControl>
                            <Input placeholder="Make" type="" {...field} />
                          </FormControl>
                          <FormDescription>Enter vehicle make</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input placeholder="Model" type="text" {...field} />
                          </FormControl>
                          <FormDescription>Enter Model</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input placeholder="Year" type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter Year of Vehicle
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInventory;
