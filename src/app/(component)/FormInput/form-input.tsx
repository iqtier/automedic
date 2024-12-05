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
            <div>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  className={cn("border-2 border-slate-300 hover:border-slate-400")}
                  placeholder={placeholder}
                  {...field}
                  type={ispassword?"password":""}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    )
  }
  
  export default FormInput