import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { getTechnicians } from "@/app/actions/employeeActions";
import { getBooking, updateBooking } from "@/app/actions/bookingActions";
import { Booking, User } from "@/types/type";

import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const bookingSchema = z.object({
  status: z.string(),
  note: z.string().optional(),
  payment_status: z.string(),
  payment_method: z.string(),
  technician_ids: z.array(z.string()).optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const EditBookingForm: React.FC<{
  booking_id: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ booking_id, setIsOpen }) => {
  const [technicians, setTechnicians] = useState<User[] | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const get_technicians = async () => {
      try {
        const technicians = await getTechnicians();
        setTechnicians(technicians);
      } catch (error: any) {
        setError(error.message);
      }
    };
    const get_booking = async () => {
      try {
        const booking = await getBooking(booking_id);
        setBooking(booking);
        form.reset({
          status: booking?.status || "",
          note: booking?.note || "",
          payment_method: booking?.payment_method || "",
          payment_status: booking?.payment_status || "",
          technician_ids: booking?.technicians.map((t) => t.technicianId) || [],
        });
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    get_technicians();
    get_booking();
  }, [booking_id]);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  async function onSubmit(data: BookingFormValues) {
    const result = await updateBooking(booking_id, data);
    if (result?.status === "success") {
      toast.success(`Appointment successfully updated`);
      router.refresh();
      setIsOpen(false);
      form.reset();
    } else {
      form.setError("root.serverError", { message: result?.error as string });
      toast.error(`${result?.error}`);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
          <div className="flex  flex-row gap-x-5">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          {field.value
                            ? field.value.toUpperCase()
                            : "Select your status"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          {field.value
                            ? field.value.toUpperCase()
                            : "Select Payment Status"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="charge">Charge</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          {field.value
                            ? field.value.toUpperCase()
                            : "Select Payment method"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="debit">Debit</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                      <SelectItem value="interac">Interac</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
              
          <FormField
            control={form.control}
            name="technician_ids"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Technicians</FormLabel>
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
                              ?.filter((technician) =>
                                field.value?.includes(technician.id)
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
                          {technicians?.map((technician) => (
                            <CommandItem
                              value={technician.name}
                              key={technician.id}
                              onSelect={() => {
                                const selectedTechnicianIds = (
                                  field.value || []
                                ).includes(technician.id)
                                  ? (field.value || []).filter(
                                      (id) => id !== technician.id
                                    )
                                  : [...(field.value || []), technician.id];
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
                                  (field.value || []).includes(technician.id)
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
          <Separator />
          <div>
            Add parts, show by catagory and separte select box if parts comes
            with service or its an add on with cost.
          </div>
          <Separator />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>

                <FormControl>
                  <Textarea
                    placeholder="Notes"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default EditBookingForm;
