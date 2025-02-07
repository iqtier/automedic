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
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: {include:{vehicles:true}},
        vehicle: true,
        services: { include: { service: {include:{fields:true}} } },
        technicians: { include: { technician:true } },
        UsedInventory: { include: { inventory: true }}
      },
    });
    return bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
}

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
      UsedInventory: {include: { inventory: true}},
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
    inventories?: {
      id: string;
      qty: string;
      included: boolean;
    }[];
  }
): Promise<ActionResult<Booking>> {
  const { status, note, payment_status, payment_method, technician_ids, inventories } = data;
  console.log("data", data);
  console.log("id", id)
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
        UsedInventory: {
          deleteMany: {},
          create: inventories?.map((inventory) => ({
            quantity: parseInt(inventory.qty),
            includedWithService: inventory.included,
            inventory: { connect: { id: parseInt(inventory.id) } },
            transactionType: "booking",
          })),
        },
      },
     
    });
    if (status === "completed" && inventories) {
      await Promise.all(inventories.map(async (inventory) => {
          const parsedQuantity = parseInt(inventory.qty, 10);

            await prisma.inventory.update({
            where: { id: parseInt(inventory.id) },
             data: {
              quantityOnHand: {
                 decrement: parsedQuantity,
               },
             },
              });
      }));
  }
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

export async function calculateBookingEarnings(bookingId: string): Promise<number> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id:parseInt(bookingId) },
      include: {
          services: { include: { service: true } },
          UsedInventory: { include: { inventory: true } }
      }
  });

  if (!booking) {
      console.error(`Booking with id ${bookingId} not found.`);
      return 0;
  }
    let serviceRevenue = booking.services?.reduce((serviceAcc, serviceItem) => {
      const price = serviceItem.service?.price || 0;
      const qty = parseInt(serviceItem.qty, 10) || 1;
      return serviceAcc + (price * qty);
  }, 0) || 0;

  let inventoryRevenue = booking.UsedInventory?.reduce((inventoryAcc, inventoryItem) => {
       if (!inventoryItem.includedWithService) {
          const retailPrice = inventoryItem.inventory?.retailPrice || 0;
          const quantity = inventoryItem.quantity || 1;
           return inventoryAcc + (retailPrice * quantity);
        }
           return inventoryAcc;
  }, 0) || 0;

  return serviceRevenue + inventoryRevenue;
  } catch (error) {
    console.error(`Error calculating earnings for booking id ${bookingId}:`, error);
    return 0;
  }
}
