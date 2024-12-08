"use server";
import { ActionResult, AppointmentSchema } from "@/types/type";
import { format } from 'date-fns';
import { Appointment } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
export async function createAppointmet(
  data: z.infer<typeof AppointmentSchema>
): Promise<ActionResult<Appointment>> {
  const {
    date,
    time,
    customer_id,
    services_id_qty,
    vehicle_id,
    status,
    payment_status,
    payment_method,
    technician_id,
  } = data;
  try {
    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        time: time,
        customerid: customer_id,
        vehicleId: Number(vehicle_id),
        status: status,
        payment_status: payment_status,
        payment_method: payment_method,
        technician_id: technician_id,
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

export async function getAllAppointments() {
  const appointments = await prisma.appointment.findMany({
    include: {
      customer: true,
      vehicle: true,
     
      ServiceAppointment: { include: { service: true } },
    },
  });
  return appointments.map((appointment) => ({
    appointid: appointment.id,
    date: format(appointment.date, 'dd MMM yyyy'),
    time: appointment.time,
    customerEmail: appointment.customer.email,
    vehicle: appointment.vehicle
      ? `${appointment.vehicle.make} ${appointment.vehicle.model} ${appointment.vehicle.year}`
      : "No vehicle associated",
    services: appointment.ServiceAppointment.map((sa) => ({
      name: sa.service.name,
      quantity: sa.qty,
    })),
    status:appointment.status,
    note: appointment.note,
    technican_id: appointment.technician_id,
    payment_status: appointment.payment_status,
    payment_method: appointment.payment_method
  }));
} // Example usage
