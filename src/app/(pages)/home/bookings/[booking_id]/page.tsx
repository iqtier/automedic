import React from "react";
import { getBooking } from "@/app/actions/bookingActions";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

const BookingDetails = async ({
  params,
}: {
  params: Promise<{ booking_id: string }>;
}) => {
  const { booking_id } = await params;

  const booking = await getBooking(booking_id);

  if (!booking) {
    return <div>Booking not found</div>;
  }

  const isPaid = booking.payment_status === "paid";
  const totalCost = booking.services.reduce(
    (acc, service) => acc + service.service.price * parseInt(service.qty),
    0
  );
  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Booking Details</CardTitle>
        <CardDescription>Booking ID: {booking_id}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Customer:</Label>
            <p>{booking.customer.name}</p>
            <p>{booking.customer.email}</p>
            <p>{booking.customer.phone}</p>
          </div>
          <div>
            <Label>Vehicle:</Label>
            <p>
              {booking.vehicle?.make} {booking.vehicle?.model} (
              {booking.vehicle?.year})
            </p>
            <p>Booking Type: {booking.booking_type}</p>
          </div>
        </div>
        <Separator />
        <div>
          <Label>Services:</Label>
          <ul className="list-disc pl-6">
            {booking.services.map((service) => (
              <li key={service.id}>
                {service.service.name} (Qty: {service.qty}) - $
                {(service.service.price *parseInt(service.qty)).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <div>
          <Label>Technicians:</Label>
          <ul className="list-disc pl-6">
            {booking.technicians.map((technician) => (
              <li key={technician.id}>{technician.technician.name}</li>
            ))}
          </ul>
        </div>
        <Separator />
        <div>
          <Label>Booking Details:</Label>
          <div>Date: {booking.date.toLocaleDateString()}</div>
          <div>Time: {booking.time}</div>
          <div>
            Status: <Badge variant="outline">{booking.status}</Badge>
          </div>
          <div>
            Payment Status:
            <Badge variant={isPaid ? "default" : "destructive"}>
              {booking.payment_status}
            </Badge>
          </div>
          <div>Note: {booking.note}</div>
          {totalCost > 0 && ( // Conditionally display total cost only if available
            <div>
              <Label>Total Cost:</Label>
              <p>${totalCost.toFixed(2)}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button disabled={!isPaid}>
          Print
          {isPaid && <Check className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingDetails;
