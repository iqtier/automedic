import { z } from "zod";

export const LogInSchema = z.object({
    email: z
      .string()
      .min(1, "Email Required")
      .email("Please provide a valid email"),
    password: z.string().min(1, "Password required").min(8, {
      message: "Password must be at least 8 characters",
    }),
  });
  
  export const UserSchema = z.object({
    username: z
      .string()
      .min(1, "Username Required")
      .min(3, "Username must be more than 3 character")
      .max(15, "User name must be under 15 Character"),
    email: z
      .string()
      .min(1, "Email Required")
      .email("Please provide a valid email"),
    password: z.string().min(1, "Password required").min(8, {
      message: "Password must be at least 8 characters",
    }),
    role: z.string().min(1,"Role is required"),
    
  });

  export const ServiceSchema = z.object({
    name: z.string().min(1, "Please Provide a service name." ),
    price: z.string().min(1, "Please provide a unit price"),
    fields: z.array(
      z.object({
        name: z.string().min(1,"Provide a field name"),
        value: z.string().min(1, "Please provide a value"),
      })
    ),
  });
  

  export type Employee = {
    username: string;
    email: string;
    role: string;
  };
  
  export type ActionResult<T> =
    { status: 'success', data: T } | { status: 'error', error: string }