"use server";

import { prisma } from "@/lib/prisma";
import { ActionResult, CustomerType } from "@/types/type";
import {  Customer } from "@prisma/client";

export async function createCustomer(
  data: CustomerType
): Promise<ActionResult<Customer>> {
  try {
    
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        cars: {
          create: data.cars.map((car) => ({
            make:car.make,
            model: car.model,
            year: car.year,
          })),
        },
      },
    });
    return { status: "success", data: customer };
  } catch (error) {
    console.error("Error creating service:", error);
    return { status: "error", error: error as string };
  }
}

export async function updateCustomer(
  customerId: string,
  data: CustomerType
): Promise<ActionResult<Customer>> {
  try {
    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        name: data.name,
        email: data.email,
        cars: {
          deleteMany: {},
          create: data.cars.map((car) => ({
            make: car.make,
            model:car.model,
            year:car.year
          })),
        },
      },
    });
    return { status: "success", data: updatedCustomer};
  } catch (error) {
    return { status: "error", error: error as string };
  }
}

export async function getAllCustomer() {
  return await prisma.customer.findMany({ include: { cars: true } });
}

export async function deleteCustomer(
  id: string
): Promise<ActionResult<Customer>> {
  try {
    console.log(id)
    const deleteCustomer= await prisma.customer.delete({
      where: { id: id },
    });
    
    return { status: "success", data: deleteCustomer };
  } catch (error) {
    return { status: "error", error: error as string };
  }
}