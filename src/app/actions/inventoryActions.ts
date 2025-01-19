"use server";
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
    const allCategories = await prisma.category.findMany();
    return allCategories;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}
export async function CreateCategory(
  data: z.infer<typeof categorySchema>
): Promise<ActionResult<Category>> {
 
  const {name, description, fields,compatibleVehicles} = data
 
  try {
    const category = await prisma.category.create({
      data: {
        name: name,
        description: description,
        fields: fields.map(field => field.name), // Transform array of objects to array of strings 
        compatibleVehicles: compatibleVehicles,
      },
    });
    console.log(category)
    return { status: "success", data: category };
  } catch (error) {
    return { status: "error", error: error as string };
  }
}

export async function getAllSuppliers() {
  try {
    const allSuppliers = await prisma.supplier.findMany({
      include: {
        contact: true,
      },
    });
    return allSuppliers;
  } catch (error) {
    console.error("Error fetching services:", error);
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
          create: {
            phone: phone,
            email: email ? email : "no email associated",
            address: address,
          },
        },
      },
    });
    return { status: "success", data: supplier };
  } catch (error) {
    return { status: "error", error: error as string };
  }
}
/*
export async function CreateInventory(
  data: z.infer<typeof inventorySchema>
): Promise<ActionResult<Inventory>> {
  console.log(data);
  const {
    name,
    sku,
    categoryId,
    unit_cost,
    retail_price,
    measure_of_unit,
    reorder_point,
    storage_location,
    compatibleVehicles,
  } = data;
  try {
    const inventory = await prisma.inventory.create({
      data: {
        name,
        sku: sku || undefined, // Handle optional sku
       
        categoryId,
   
        measure_of_unit,
        unitCost: parseFloat(unit_cost), // Parse to float
        retailPrice: parseFloat(retail_price), // Parse if provided
        location: storage_location,
        reorderPoint: parseInt(reorder_point), // Parse to int
        compatibleVehicles: compatibleVehicles,
         
  }});

    return { status: "success", data: inventory };
  } catch (error) {
    console.error("Error creating inventory:", error);

    return { status: "error", error: "Failed to create inventory." };
  }
}

export async function getAllInventory() {
  try {
    const allInventory = await prisma.inventory.findMany({
      include: {
        category: true,
        supplier: true,
      },
    });
    return allInventory;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
*/
export  async function getInventoryNameAndId(){
  try {
    const inventory = await prisma.inventory.findMany({
      select:{
        id:true,
        name:true,
      }
    })
    return inventory
  } catch (error) {
    console.error(error)
    throw error
  }
}
  