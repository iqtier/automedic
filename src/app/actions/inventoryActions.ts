"use server"
import {
  ActionResult,
  inventoryReceivingSchema,
  categorySchema,
  inventorySchema,
  supplierSchema,
} from "@/types/type";
import { prisma } from "@/lib/prisma";
import { Inventory, Category, Supplier } from "@prisma/client";
import { z } from "zod";

export async function getAllCategories() {
  try {
   const allCategories = await prisma.category.findMany() 
   return allCategories 
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}
export async function CreateCategory(
  data: z.infer<typeof categorySchema>
): Promise<ActionResult<Category>> {
  const name = data.name;
  const description = data.description;
  try {
    const category = await prisma.category.create({
      data: {
        name: name,
        description: description,
      },
    });
    return { status: "success", data: category };
  } catch (error) {
    return { status: "error", error: error as string };
  }
}


export async function getAllSuppliers() {
  try {
   const allSuppliers = await prisma.supplier.findMany({
    include:{
      contact:true
    }
   }) 
   return  allSuppliers 
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}
export async function CreateSupplier(
  data: z.infer<typeof supplierSchema>
): Promise<ActionResult<Supplier>> {
  const { name, phone, email, address } = data;
  try {
    const supplier = await prisma.supplier.create({
      data: { 
        name: name,
        contact: {
            create:{
                phone:phone,
                email:email? email:"no email associated",
                address:address
            }
        }
    },
    });
    return {status: "success", data:supplier}
  } catch (error) {
    return { status: "error", error: error as string };
  }
}
