"use server";

import { prisma } from "@/lib/prisma";
import { ActionResult, ServiceSchema } from "@/types/type";
import { z } from "zod";
import { Service } from "@prisma/client";

export async function createService(
  data: z.infer<typeof ServiceSchema>
): Promise<ActionResult<Service>> {
  try {
    console.log(data);
    const service = await prisma.service.create({
      data: {
        name: data.name,
        price: parseFloat(data.price),
        fields: {
          create: data.fields.map((field) => ({
            name: field.name,
            value: field.value,
          })),
        },
      },
    });
    return { status: "success", data: service };
  } catch (error) {
    console.error("Error creating service:", error);
    return { status: "error", error: error as string };
  }
}

export async function updateService(
  serviceId: number,
  data: z.infer<typeof ServiceSchema>
): Promise<ActionResult<Service>> {
  try {
    const updatedService = await prisma.service.update({
      where: { id: Number(serviceId) },
      data: {
        name: data.name,
        price: parseFloat(data.price),
        fields: {
          deleteMany: {},
          create: data.fields.map((field) => ({
            name: field.name,
            value: field.value,
          })),
        },
      },
    });
    return { status: "success", data: updatedService };
  } catch (error) {
    return { status: "error", error: error as string };
  }
}

export async function getAllServices() {
  return await prisma.service.findMany({ include: { fields: true } });
}

export async function deleteService(
  id: number
): Promise<ActionResult<Service>> {
  try {
    console.log(id)
    const deleteService = await prisma.service.delete({
      where: { id: id },
    });
    console.log(deleteService)
    return { status: "success", data: deleteService };
  } catch (error) {
    return { status: "error", error: error as string };
  }
}
