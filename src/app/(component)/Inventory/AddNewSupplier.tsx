"use client"
import {
  useState
} from "react"

import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  cn
} from "@/lib/utils"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import {
  Textarea
} from "@/components/ui/textarea"


import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HousePlus, UserPlus } from "lucide-react";
import { toast } from "react-toastify"

const formSchema = z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().optional(),
    address: z.string().optional()
  });
const AddNewSupplier = () => {

    const form = useForm < z.infer < typeof formSchema >> ({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name:"",
            phone: "",
            email: "",
            address: "",
        },
    
      })
    
      function onSubmit(values: z.infer < typeof formSchema > ) {
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
        <DialogTrigger >
        <Button className="font-normal" >
        <HousePlus /> Add Supplier
        </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Supplier</DialogTitle>
            <DialogDescription>
            Enter Your supplier Details here
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  py-5">
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                placeholder="Name"
                
                type="text"
                {...field} />
              </FormControl>
              <FormDescription>Write your suppliers name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-12 gap-4">
          
          <div className="col-span-6">
            
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input 
                placeholder="Phone"
                
                type=""
                {...field} />
              </FormControl>
              <FormDescription>Enter Phone number of the supplier</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
          
          <div className="col-span-6">
            
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                placeholder="Email"
                
                type="email"
                {...field} />
              </FormControl>
              <FormDescription>Enter Email of your Supplier</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
          
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Address"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter Address of your Supplier</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewSupplier;
