"use server";
import { ActionResult, AppointmentSchema } from "@/types/type";
import { Appointment } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
export async function createAppointmet(
  data: z.infer<typeof AppointmentSchema>
): Promise<ActionResult<Appointment>> {
  const { date, time, customer_id, services_id_qty } = data;
  try {
    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        time: time,
        customerid: customer_id,
        ServiceAppointment: {
          create: services_id_qty.map((serviceIdQty) => ({
            qty: serviceIdQty.qty,
            serviceId: parseInt(serviceIdQty.id), // Convert id to integer
          })),
        },
      },
      include: {
        ServiceAppointment: true,
      },
    });
    return { status: "success", data: appointment };
  } catch (error) {
    console.error("Error creating service:", error);
    return { status: "error", error: error as string };
  }
}
