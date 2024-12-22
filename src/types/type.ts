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
  role: z.string().min(1, "Role is required"),
});

export const ServiceSchema = z.object({
  name: z.string().min(1, "Please Provide a service name."),
  price: z.string().min(1, "Please provide a unit price"),
  fields: z.array(
    z.object({
      name: z.string().min(1, "Provide a field name"),
      value: z.string().min(1, "Please provide a value"),
    })
  ),
});

export const BookingSchema = z.object({
  date: z.date({
    required_error: "A date of birth is required.",
  }),
  time: z.string({ required_error: "Please select a time slot." }),
  customer_id: z.string().min(1, "Please Select a customer"),
  vehicle_id: z.string().min(1, "Please Select a car"),
  type:z.string(),
  ramp:z.string(),
  status: z
    .enum(["pending", "ongoing", "completed", "cancelled"])
    .default("pending"),
  notes: z.string().optional(),
  technician_ids: z.array(z.string()).optional(),
  payment_status: z.enum(["pending", "paid", "unpaid"]).default("pending"),
  payment_method: z.enum(["cash", "credit_card", "paypal"]).optional(),
  services_id_qty: z.array(
    z.object({
      id: z.string().min(1, "Provide a service"),
      qty: z.string().min(1, "Please provide a quantity"),
    })
  ),
});

export const CustomerSchema = z.object({
  name: z.string().min(1, "Name Required"),
  email: z
    .string()
    .min(1, "Email Required")
    .email("Please Provide a valid email"),
  phone: z.string().min(1, "Phone Number Required"),
  vehicles : z.array(
    z.object({
      make: z.string(),
      model: z.string(),
      year: z.string(),
    })
  ),
});

export type CustomerType = z.infer<typeof CustomerSchema>;

export type Employee = {
  username: string;
  email: string;
  role: string;
};

export type ServiceType = z.infer<typeof ServiceSchema>;

export type ActionResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string };

export type Service = {
  id: number;
  name: string;
  price: number;
  fields: ServiceFields[];
};
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: Date;
};
type ServiceFields = {
  id: number;
  serviceId: number;
  name: string;
  value: string;
};
type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  
};
type Vehicle = {
  id: number;
  make: string;
  model: string;
  year: string;
  customerId: string;

};
type ServiceIdQty = {
  id: string;
  bookingId: number;
  qty: string;
  serviceId: number;


};

export type Booking = {
  id: number;
  date: Date;
  time: string;
  ramp:string|null,
  vehicle_id?: number | null;
  booking_type?: string | null;
  status: string;
  note: string;
  payment_status: string;
  payment_method: string;
  customerid: string;
  services: ServiceIdQty[];
  technicians: BookingTechnician[];
  vehicle?: Vehicle | null;
  customer: Customer;
};
type BookingTechnician = {
  id: number;
  bookingId: number;
  technicianId: string;
 
};
