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
import { CalendarIcon, Check, ChevronsUpDown, UserPlus } from "lucide-react";
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
const timeSlots = [
  { label: "09:00 AM", value: "09:00" },
  { label: "09:30 AM", value: "09:30" },
  { label: "10:00 AM", value: "10:00" },
  { label: "10:30 AM", value: "10:30" },
  { label: "11:00 AM", value: "11:00" },
  { label: "11:30 AM", value: "11:30" },
  { label: "12:00 PM", value: "12:00" },
  { label: "12:30 PM", value: "12:30" },
  { label: "01:00 PM", value: "13:00" },
  { label: "01:30 PM", value: "13:30" },
  { label: "02:00 PM", value: "14:00" },
  { label: "02:30 PM", value: "14:30" },
  { label: "03:00 PM", value: "15:00" },
  { label: "03:30 PM", value: "15:30" },
  { label: "04:00 PM", value: "16:00" },
  { label: "04:30 PM", value: "16:30" },
  { label: "05:00 PM", value: "17:00" },
] as const;
type AppointmentFormType = z.infer<typeof AppointmentSchema>;
type Customers = CustomerType & { id: string };
type AppointmentFormProps = { services: Service[]; customers: Customers[] };

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  services,
  customers,
}) => {
  const [month, setMonth] = useState(new Date());

  const form = useForm<AppointmentFormType>({
    resolver: zodResolver(AppointmentSchema),
  });

  const { fields, append, remove } = useFieldArray<AppointmentFormType>({
    control: form.control,
    name: "services_id_qty",
  });
  async function onSubmit(data: AppointmentFormType) {
    await createAppointmet(data);
    form.reset();
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger
          asChild
          className="px-8 py-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700"
        >
          <Button>Appointment</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-5">Appoinment</DialogTitle>
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
                    name="time"
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
                                  ? timeSlots.find(
                                      (slot) => slot.value === field.value
                                    )?.label
                                  : "Select time slot"}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search time slot..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No time slot found.</CommandEmpty>
                                <CommandGroup>
                                  {timeSlots.map((slot) => (
                                    <CommandItem
                                      value={slot.label}
                                      key={slot.value}
                                      onSelect={() => {
                                        form.setValue("time", slot.value);
                                      }}
                                    >
                                      {slot.label}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          slot.value === field.value
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
                                          `customer_id`,
                                          customer.id.toString()
                                        );
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
                    <CustomerForm isEdit= {false} customerToEdit={null} fromBooking={true}/>
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

export default AppointmentForm;
