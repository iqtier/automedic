"use client";
import React, { useState } from "react";
import { z } from "zod";
import { Service, AppointmentSchema, CustomerType } from "@/types/type";
import { cn } from "@/lib/utils";
import "react-day-picker/style.css";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { DayPicker } from "react-day-picker";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { createAppointmet } from "@/app/actions/appointmentActions";
import CustomerForm from "../Customer/CustomerForm";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Car {
  id: number;
  make: string;
  model: string;
  year: string;
  customerId: string;
}
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicles: Car[];
}

type WalkInServiceFormType = z.infer<typeof AppointmentSchema>;

type WalkInServiceFormProps = { services: Service[]; customers: Customer[] };

const WalkInServiceForm: React.FC<WalkInServiceFormProps> = ({
  services,
  customers,
}) => {
  const [month, setMonth] = useState(new Date());
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<WalkInServiceFormType>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      date: new Date(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      customer_id: "",
      vehicle_id: "",
      services_id_qty: [],
      type: "Drive through"
    },
  });

  const { fields, append, remove } = useFieldArray<WalkInServiceFormType>({
    control: form.control,
    name: "services_id_qty",
  });
  async function onSubmit(data: WalkInServiceFormType) {
    const result = await createAppointmet(data);
    if (result?.status === "success") {
      toast.success(`Appointment successfully added`);
      router.refresh();
      setIsDialogOpen(false);
      form.reset();
    } else {
      form.setError("root.serverError", { message: result?.error as string });
      toast.error(`${result?.error}`);
    }
  }

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger
          asChild
          className="px-8 py-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-700"
        >
          <Button>Drive Through</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-5">Drive through Service</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex flex-col gap-y-5 ">
                <div className="flex flex-row gap-x-3">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <DayPicker
                              month={month}
                              onMonthChange={setMonth}
                              autoFocus
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customer_id"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? customers.find(
                                      (customer) =>
                                        customer.id.toString() === field.value
                                    )?.name
                                  : "Select customer"}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search customer..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No customer found.</CommandEmpty>
                                <CommandGroup>
                                  {customers.map((customer) => (
                                    <CommandItem
                                      value={customer.name}
                                      key={customer.id}
                                      onSelect={() => {
                                        form.setValue(
                                          "customer_id",
                                          customer.id.toString()
                                        );
                                        form.setValue("vehicle_id", ""); // Reset vehicle selection when customer changes
                                      }}
                                    >
                                      {customer.name}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          customer.id.toString() === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vehicle_id"
                    render={({ field }) => (
                      <FormItem className="">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={!form.watch("customer_id")} // Disable if no customer is selected
                              >
                                {field.value
                                  ? customers
                                      .find(
                                        (customer) =>
                                          customer.id ===
                                          form.watch("customer_id")
                                      )
                                      ?.vehicles.find(
                                        (vehicle) =>
                                          vehicle.id.toString() === field.value
                                      )?.make +
                                    " " +
                                    customers
                                      .find(
                                        (customer) =>
                                          customer.id ===
                                          form.watch("customer_id")
                                      )
                                      ?.vehicles.find(
                                        (vehicle) =>
                                          vehicle.id.toString() === field.value
                                      )?.model
                                  : "Select vehicle"}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search vehicle..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No vehicle found.</CommandEmpty>
                                <CommandGroup>
                                  {customers
                                    .find(
                                      (customer) =>
                                        customer.id ===
                                        form.watch("customer_id")
                                    )
                                    ?.vehicles.map((vehicle) => (
                                      <CommandItem
                                        value={
                                          vehicle.make + " " + vehicle.model
                                        }
                                        key={vehicle.id}
                                        onSelect={() => {
                                          form.setValue(
                                            "vehicle_id",
                                            vehicle.id.toString()
                                          );
                                        }}
                                      >
                                        {vehicle.make + " " + vehicle.model}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            vehicle.id.toString() ===
                                              field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <CustomerForm
                    isEdit={false}
                    customerToEdit={null}
                    fromBooking={true}
                  />
                </div>

                {fields.map((item, index) => (
                  <div key={item.id} className="flex flex-row gap-x-2">
                    <FormField
                      control={form.control}
                      name={`services_id_qty.${index}.id`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-[200px] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? services.find(
                                        (service) =>
                                          service.id.toString() === field.value
                                      )?.name
                                    : "Select service"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search service..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>No service found.</CommandEmpty>
                                  <CommandGroup>
                                    {services.map((service) => (
                                      <CommandItem
                                        value={service.name}
                                        key={service.id}
                                        onSelect={() => {
                                          form.setValue(
                                            `services_id_qty.${index}.id`,
                                            service.id.toString()
                                          );
                                        }}
                                      >
                                        {service.name}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            service.id.toString() ===
                                              field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`services_id_qty.${index}.qty`}
                      render={({ field }) => (
                        <FormItem className="">
                          <FormControl>
                            <Input
                              placeholder="Enter quantity"
                              {...field}
                              className="w-[200px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className=" text-red-600"
                      onClick={() => remove(index)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={() => append({ id: "", qty: "" })}
                className="mt-2 bg-cyan-500 hover:bg-cyan-600"
              >
                Add Service
              </Button>

              <DialogFooter>
                <Button type="submit" className="w-full font-bold">
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalkInServiceForm;
