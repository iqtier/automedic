"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Service, BookingSchema, CustomerType } from "@/types/type";
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
import { format, } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, } from "lucide-react";
import { DayPicker } from "react-day-picker";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  createBooking,
  getBookedTimeSlotsByDateRange,
} from "@/app/actions/bookingActions";
import CustomerForm from "../Customer/CustomerForm";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Ramp = 1 | 2;

// Modify the time slot type to include ramp information
type TimeSlot = {
  value: string;
  label: string;
};
const timeSlots: TimeSlot[] = [
  { value: "08:00 AM", label: "08:00 AM" },
  { value: "08:30 AM", label: "08:30 AM" },
  { value: "09:00 AM", label: "09:00 AM" },
  { value: "09:30 AM", label: "09:30 AM" },
  { value: "10:00 AM", label: "10:00 AM" },
  { value: "10:30 AM", label: "10:30 AM" },
  { value: "11:00 AM", label: "11:00 AM" },
  { value: "11:30 AM", label: "11:30 AM" },
  { value: "12:00 PM", label: "12:00 PM" },
  { value: "12:30 PM", label: "12:30 PM" },
  { value: "01:00 PM", label: "01:00 PM" },
  { value: "01:30 PM", label: "01:30 PM" },
  { value: "02:00 PM", label: "02:00 PM" },
  { value: "02:30 PM", label: "02:30 PM" },
  { value: "03:00 PM", label: "03:00 PM" },
  { value: "03:30 PM", label: "03:30 PM" },
  { value: "04:00 PM", label: "04:00 PM" },
  { value: "04:30 PM", label: "04:30 PM" },

];
interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: string;
  customerId: string;
}

type Technician = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: Date;
};
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicles: Vehicle[];
}

type BookingFormType = z.infer<typeof BookingSchema>;

type BookingFormProps = {
  services: Service[];
  customers: Customer[];
  isEdit: boolean;
  isAppointment: boolean;
  technicians: Technician[];
};
type BookedSlot = { date: Date; time: string; ramp: Ramp };
const BookingForm: React.FC<BookingFormProps> = ({
  services,
  customers,
  isEdit,
  isAppointment,
  technicians,
}) => {
  const router = useRouter();
  const [month, setMonth] = useState(new Date());
  const [date, setDate] = useState<Date>();
  const [bookedSlots, setBookedSlots] = useState<
    { date: Date; time: string; ramp: string | null }[]
  >([]);
  const [ramp, setRamp] = useState<string>("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const availableRamps = ["1", "2"];
  const form = useForm<BookingFormType>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      date: isAppointment ? undefined : new Date(),
      time: isAppointment
        ? ""
        : new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
      customer_id: "",
      vehicle_id: "",
      services_id_qty: [],
      technician_ids: [],
      type: isAppointment ? "Appointment" : "Drive-Thru",
    },
  });

  const { fields, append, remove } = useFieldArray<BookingFormType>({
    control: form.control,
    name: "services_id_qty",
  });

  useEffect(() => {
    if (isAppointment) {
      if (month) {
      
        const fetchBookedSlots = async () => {
          const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
          const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

          try {
            const booked = await getBookedTimeSlotsByDateRange(
              startOfMonth, endOfMonth
            ); 
            setBookedSlots(booked || []);
          } catch (error) {
            console.error("Error fetching booked slots:", error);
            toast.error("Failed to load booked slots. Please try again later.");
          }
        };

        fetchBookedSlots();
      } else {
        setBookedSlots([]);
      }
    }
  }, [isAppointment,month, ramp, date]);

  useEffect(() => {
    if (isAppointment) {
      form.setValue("time", ""); // Reset time whenever date changes
    }
  }, [isAppointment,month, ramp, date]); // Depend on form.watch("date")

  const isTimeSlotDisabled = (timeSlot: string, dateToCheck: Date) => {
    const startOfDay = new Date(dateToCheck);
    startOfDay.setHours(0, 0, 0, 0);
  
    const endOfDay = new Date(dateToCheck);
    endOfDay.setHours(23, 59, 59, 999);
  
    return bookedSlots.some((slot) => {
      const slotDate = new Date(slot.date);
      return (
        slot.time === timeSlot &&
        slot.ramp === ramp &&
        slotDate.getTime() >= startOfDay.getTime() &&
        slotDate.getTime() <= endOfDay.getTime()
      );
    });
  };

  const isDateDisabled = (dateToCheck: Date) => {
    const startOfDay = new Date(dateToCheck);
    startOfDay.setHours(0, 0, 0, 0);
  
    const endOfDay = new Date(dateToCheck);
    endOfDay.setHours(23, 59, 59, 999);
  
    for (const currentRamp of availableRamps) {
      const isRampAvailable = !bookedSlots.some((slot) => {
        const slotDate = new Date(slot.date);
        return (
          slotDate.getTime() >= startOfDay.getTime() &&
          slotDate.getTime() <= endOfDay.getTime() &&
          slot.ramp === currentRamp // Only check for current ramp
        );
      });
  
      if (isRampAvailable) {
        return false; // At least one ramp is available, date is NOT disabled
      }
    }
  
    return true; // All ramps are fully booked on this date, date IS disabled
  };

  async function onSubmit(data: BookingFormType) {
    const result = await createBooking(data);
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
          className={`px-8 py-4  text-white font-bold rounded-lg ${
            isAppointment
              ? " hover:bg-blue-700 bg-blue-500"
              : " bg-green-500 hover:bg-green-700"
          }`}
        >
          <Button>{isAppointment ? "Appointment" : "Drive Through"}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-5">
              {isAppointment ? "Appointment" : "Drive Through"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex flex-col gap-y-5 ">
                <div className="flex flex-row gap-x-3">
                  {isAppointment && (
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <DayPicker
                            className="rounded-md border p-2"
                               numberOfMonths={2}
                                month={month}
                                disabled={{ before: new Date() }}
                                hidden={isDateDisabled} // Disable dates
                                onMonthChange={setMonth}
                                autoFocus
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date)
                                  setDate(date);; // Update form value
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="ramp"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) => {field.onChange(value); setRamp(value)}}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <SelectValue placeholder="Select a ramp or select N/A" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Ramp 1</SelectItem>
                            <SelectItem value="2">Ramp 2</SelectItem>
                            <SelectItem value="0">Not applicable</SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isAppointment && (
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
                                  <CommandEmpty>
                                    No time slot found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {timeSlots.map((slot) => (
                                      <CommandItem
                                        value={slot.label}
                                        key={slot.value}
                                        disabled={isTimeSlotDisabled(slot.value,form.getValues("date"))} // Disable booked slots
                                        onSelect={() =>
                                          form.setValue("time", slot.value)
                                        }
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
                  )}

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
                                      )?.model +
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
                                      )?.year
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
                                          vehicle.make +
                                          " " +
                                          vehicle.model +
                                          " " +
                                          vehicle.year
                                        }
                                        key={vehicle.id}
                                        onSelect={() => {
                                          form.setValue(
                                            "vehicle_id",
                                            vehicle.id.toString()
                                          );
                                        }}
                                      >
                                        {vehicle.make +
                                          " " +
                                          vehicle.model +
                                          " " +
                                          vehicle.year}
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
                <FormField
                  control={form.control}
                  name="technician_ids"
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
                                !field.value || field.value.length === 0
                                  ? "text-muted-foreground"
                                  : ""
                              )}
                            >
                              {field.value && field.value.length > 0
                                ? technicians
                                    .filter((technician) =>
                                      field.value?.includes(
                                        technician.id.toString()
                                      )
                                    )
                                    .map((technician) => technician.name)
                                    .join(", ")
                                : "Select technicians"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search technicians..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No technician found.</CommandEmpty>
                              <CommandGroup>
                                {technicians.map((technician) => (
                                  <CommandItem
                                    value={technician.name}
                                    key={technician.id}
                                    onSelect={() => {
                                      const selectedTechnicianIds =
                                        field.value?.includes(
                                          technician.id.toString()
                                        )
                                          ? field.value.filter(
                                              (id) =>
                                                id !== technician.id.toString()
                                            )
                                          : [
                                              ...(field.value || []),
                                              technician.id.toString(),
                                            ];

                                      form.setValue(
                                        "technician_ids",
                                        selectedTechnicianIds
                                      );
                                    }}
                                  >
                                    {technician.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        field.value?.includes(
                                          technician.id.toString()
                                        )
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

export default BookingForm;
