/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Ellipsis } from "lucide-react";

// This type is used to define the shape of our data.

type ServiceDetail = {
  name: string;
  quantity: string;
};

type BookingDetail = {
  bookingid: number;
  date: string; // Formatted as 'dd MMM yyyy'
  time: string;
  customerEmail: string;
  vehicle: string; // Formatted as 'make model year' or 'No vehicle associated'
  services: ServiceDetail[];
  status: string;
  note: string;
  technicians: string; // Concatenated technician names
  payment_status: string;
  payment_method: string;
  booking_type: string | null;
};

export const columns: ColumnDef<BookingDetail>[] = [
  {
    accessorKey: "appointid",
    header: "ID",
    cell: ({ row }) => <div>{row.getValue("appointid")}</div>,
  },

  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => <div>{row.getValue("time")}</div>,
  },
  {
    accessorKey: "customerEmail",
    header: () => <div>Customer Email</div>,
    cell: ({ row }) => {
      return <div className="">{row.getValue("customerEmail")}</div>;
    },
  },
  {
    accessorKey: "vehicle",
    header: () => <div>Vehicle</div>,
    cell: ({ row }) => {
      return <div className="">{row.getValue("vehicle")}</div>;
    },
  },
  {
    accessorKey: "services",
    header: "Services",
    cell: ({ row }) => {
      const services = row.getValue("services") as ServiceDetail[];
      return (
        <div>
          {services.map((service) => (
            <div key={service.name}>
              {service.name} - {service.quantity}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => <div>{row.getValue("note")}</div>,
  },
  {
    accessorKey: "technicians",
    header: "Technicians",
    cell: ({ row }) => <div>{row.getValue("technicians")}</div>,
  },
  {
    accessorKey: "payment_status",
    header: "Payment Status",
    cell: ({ row }) => <div>{row.getValue("payment_status")}</div>,
  },
  {
    accessorKey: "appointment_type",
    header: "Booking Type",
    cell: ({ row }) => <div>{row.getValue("appointment_type")}</div>,
  },
  {
    accessorKey: "payment_method",
    header: "Payment Method",
    cell: ({ row }) => <div>{row.getValue("payment_method")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const appointment_id = row.getValue("appointid");

      const { control, handleSubmit } = useForm({
        defaultValues: {
          status: row.getValue("status"),
          note: row.getValue("note"),
          technicians: row.getValue("technicians"),
          payment_status: row.getValue("payment_status"),
          payment_method: row.getValue("payment_method"),
        }
      });

      const onSubmit = (data: any) => {
        console.log(data);
        // Update appointment logic here
        router.refresh();
      };

      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost">Actions</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Actions</DialogTitle>
                      <DialogDescription>
                        Update the appointment details here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Controller
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <select {...field} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                              <option value="pending">Pending</option>
                              <option value="ongoing">Ongoing</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          )}
                        />
                      </div>

                      <div>
                        <Label htmlFor="note">Note</Label>
                        <Controller
                          name="note"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                          )}
                        />
                      </div>

                      <div>
                        <Label htmlFor="technicians">Technicians</Label>
                        <Controller
                          name="technicians"
                          control={control}
                          render={({ field }) => (
                            <select {...field} multiple className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                              <option value="technician1">Technician 1</option>
                              <option value="technician2">Technician 2</option>
                              <option value="technician3">Technician 3</option>
                            </select>
                          )}
                        />
                      </div>

                      <div>
                        <Label htmlFor="payment_status">Payment Status</Label>
                        <Controller
                          name="payment_status"
                          control={control}
                          render={({ field }) => (
                            <select {...field} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="unpaid">Unpaid</option>
                            </select>
                          )}
                        />
                      </div>

                      <div>
                        <Label htmlFor="payment_method">Payment Method</Label>
                        <Controller
                          name="payment_method"
                          control={control}
                          render={({ field }) => (
                            <select {...field} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                              <option value="cash">Cash</option>
                              <option value="credit_card">Credit Card</option>
                              <option value="paypal">PayPal</option>
                            </select>
                          )}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost">Edit</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Appointment</DialogTitle>
                      <DialogDescription>
                        Make changes to your appointment here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      Edit Appointment
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost">Print</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Appointment Details</DialogTitle>
                      <DialogDescription>
                        Preview
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      Appointment Details
                    </div>
                    <DialogFooter>
                      <Button type="submit">Print</Button>
                    </DialogFooter>
                  </DialogContent>

                </Dialog>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
