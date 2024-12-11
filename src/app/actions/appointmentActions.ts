"use server";
import { ActionResult, BookingSchema } from "@/types/type";
import { format } from 'date-fns';
import { Booking} from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
export async function createAppointmet(
  data: z.infer<typeof BookingSchema>
): Promise<ActionResult<Booking>> {
  const {
    date,
    time,
    customer_id,
    services_id_qty,
    vehicle_id,
    status,
    payment_status,
    payment_method,
    technician_ids,
    type
  } = data;
  try {
    const booking = await prisma.booking.create({
      data: {
        date: new Date(date),
        time: time,
        customerid: customer_id,
        vehicle_id: Number(vehicle_id),
        status: status,
        payment_status: payment_status,
        payment_method: payment_method,
        booking_type:type,
        services: {
          create: services_id_qty.map((serviceIdQty) => ({
            qty: serviceIdQty.qty,
            serviceId: parseInt(serviceIdQty.id), // Convert id to integer
          })),
        },
      },
      include: {
        services: true,
      },
    });
    return { status: "success", data: booking };
  } catch (error) {
    console.error("Error creating service:", error);
    return { status: "error", error: error as string };
  }
}

export async function getAllBookings() {
  const bookings = await prisma.booking.findMany({
    include: {
      customer: true,
      vehicle: true,
      services: { include: { service: true } },
      technicians: { include: { technician: true, }, },
    },
  });
  return bookings.map((booking) => ({
    bookingid: booking.id,
    date: format(booking.date, 'dd MMM yyyy'),
    time: booking.time,
    customerEmail: booking.customer.email,
    vehicle: booking.vehicle
      ? `${booking.vehicle.make} ${booking.vehicle.model} ${booking.vehicle.year}`
      : "No vehicle associated",
    services: booking.services.map((sa) => ({
      name: sa.service.name,
      quantity: sa.qty,
    })),
    status:booking.status,
    note: booking.note,
    technicians: booking.technicians.map(t => t.technician.name).join(', '),
    booking_type:booking.booking_type,
    payment_status: booking.payment_status,
    payment_method: booking.payment_method
  }));
} // Example usage
