"use server";
import {
  ActionResult,
  inventoryReceivingSchema,
  categorySchema,
  inventorySchema,
  supplierSchema,
} from "@/types/type";
import { prisma } from "@/lib/prisma";
import {
  Inventory,
  Category,
  Supplier,
  InventoryTransaction,
} from "@prisma/client";
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
  const { name, description, fields, compatibleVehicles } = data;

  try {
    const category = await prisma.category.create({
      data: {
        name: name,
        description: description,
        fields: fields.map((field) => field.name), // Transform array of objects to array of strings
        compatibleVehicles: compatibleVehicles,
      },
    });
    console.log(category);
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

export async function CreateInventory(
  data: z.infer<typeof inventorySchema>
): Promise<ActionResult<Inventory>> {
  const {
    name,
    sku,
    categoryId,
    brand,
    unit_cost,
    quantityOnHand,
    retail_price,
    measure_of_unit,
    reorder_point,
    storage_location,
    compatibleVehicles,
    fields,
  } = data;
  try {
    const inventory = await prisma.inventory.create({
      data: {
        name,
        sku,
        brand,
        categoryId,
        measure_of_unit,
        unitCost: parseFloat(unit_cost), // Parse to float
        retailPrice: parseFloat(retail_price), // Parse if provided
        location: storage_location,
        reorderPoint: parseInt(reorder_point), // Parse to int
        compatibleVehicles: compatibleVehicles,
        InventoryFields: {
          create: fields.map((field) => ({
            name: field.name,
            value: field.value,
          })),
        },
      },
    });

    return { status: "success", data: inventory };
  } catch (error) {
    console.error("Error creating inventory:", error);

    return { status: "error", error: "Failed to create inventory." };
  }
}

export async function getAllInventory() {
  try {
    const inventoies = await prisma.inventory.findMany({
      include: {
        InventoryFields: {
          select: {
            value: true,
          },
        },
        category: {
          select: {
            name: true, //
          },
        },
      },
    });
    return inventoies;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getInventoryNameAndId() {
  try {
    const inventory = await prisma.inventory.findMany({
      select: {
        id: true,
        name: true,
        brand: true,
        InventoryFields: {
          select: {
            value: true,
          },
        },
      },
    });
    const transformedInventory = inventory.map((item) => ({
      id: item.id,
      name: `${item.brand} ${item.name} ${item.InventoryFields.map(
        (field) => field.value
      ).join(" ")}`,
    }));
    return transformedInventory;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getSupplierNameAndId() {
  try {
    const supplier = await prisma.supplier.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return supplier;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function ReceiveInventory(
  data: z.infer<typeof inventoryReceivingSchema>
): Promise<ActionResult<InventoryTransaction>> {
  const { inventory, supplier, quantity, reference_number, cost, notes } = data;
  try {
    const inventoryQty = await prisma.inventory.findUnique({
      where: { id: parseInt(inventory) },
      select: {
        quantityOnHand: true,
      },
    });
    if (inventoryQty) {
      await prisma.inventory.update({
        where: { id: parseInt(inventory) },
        data: {
          quantityOnHand: inventoryQty.quantityOnHand + parseInt(quantity),
        },
      });
    }
    const inventoryTransaction = await prisma.inventoryTransaction.create({
      data: {
        inventoryId: parseInt(inventory),
        supplierId: parseInt(supplier),
        type: "Received",
        quantity: parseInt(quantity),
        referenceNumber: reference_number,
        cost: cost ? parseInt(cost) : undefined,
        notes: notes ? notes : undefined,
      },
    });
    return { status: "success", data: inventoryTransaction };
  } catch (error) {
    console.error("Error creating inventory:", error);

    return { status: "error", error: "Failed to create inventory." };
  }
}
