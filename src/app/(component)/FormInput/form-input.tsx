"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

  import React from 'react'
import { UseFormReturn } from "react-hook-form";
  

interface InputProps {
  form:UseFormReturn<any>
  name:string,label:string, 
  placeholder:string, 
  ispassword:boolean

}

  const FormInput:React.FC<InputProps> = ({form, name, label, placeholder, ispassword}) => {
    return (
        <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
           <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">{label}</FormLabel>
            <FormControl>
              <Input
               className="text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={placeholder}
                {...field}
                type={ispassword ? "password" : "text"} // Use "text" for non-password inputs
              />
            </FormControl>
             <FormMessage />
          </FormItem>
        )}
      />
    )
  }
  
  export default FormInput