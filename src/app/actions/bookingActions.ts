"use server";
import { ActionResult, BookingSchema } from "@/types/type";

import { Booking } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
export async function createBooking(
  data: z.infer<typeof BookingSchema>
): Promise<ActionResult<Booking>> {
  const {
    date,
    time,
    ramp,
    customer_id,
    services_id_qty,
    vehicle_id,
    status,
    payment_status,
    payment_method,
    technician_ids,
    type,
  } = data;
  try {
    const booking = await prisma.booking.create({
      data: {
        date: new Date(date),
        time: time,
        ramp: ramp,
        customerid: customer_id,
        vehicle_id: Number(vehicle_id),
        status: status,
        payment_status: payment_status,
        payment_method: payment_method,
        booking_type: type,
        services: {
          create: services_id_qty.map((serviceIdQty) => ({
            qty: serviceIdQty.qty,
            serviceId: parseInt(serviceIdQty.id), // Convert id to integer
          })),
        },
        technicians: {
          create: technician_ids?.map((technicianId) => ({
            technician: { connect: { id: technicianId } },
          })),
        },
      },
      include: {
        services: true,
        technicians: true,
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
      technicians: { include: { technician: true } },
    },
  });
  return bookings;
} // Example usage

export async function getBooking(id: string) {
  const booking = await prisma.booking.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      services: { include: { service: true } },
      technicians: {
        include: {
          technician: true,
        },
      },
      customer: true,
      vehicle: true,
    },
  });
  return booking;
}

export async function updateBooking(
  id: string,
  data: {
    status: string;
    note?: string;
    payment_status: string;
    payment_method: string;
    technician_ids?: string[];
  }
): Promise<ActionResult<Booking>> {
  const { status, note, payment_status, payment_method, technician_ids } = data;
  try {
    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: {
        status,
        note: note || "",
        payment_status,
        payment_method,
        technicians: {
          deleteMany: {},
          create: technician_ids?.map((technicianId) => ({
            technician: { connect: { id: technicianId } },
          })),
        },
      },
      include: {
        services: true,
        technicians: true,
        customer: true,
        vehicle: true,
      },
    });
    return { status: "success", data: booking };
  } catch (error) {
    console.error("Error updating booking:", error);
    return { status: "error", error: error as string };
  }
}

export async function getBookedTimeSlotsByDateRange(
  startDate: Date,
  endDate: Date
) {
  const bookings = await prisma.booking.findMany({
    where: {
      AND: [{ date: { gte: new Date(startDate), lte: new Date(endDate) } }],
    },
    select: { date: true, time: true, ramp: true },
  });

  return bookings;
}
