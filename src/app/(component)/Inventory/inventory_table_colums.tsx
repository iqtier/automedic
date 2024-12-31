"use client";

import { JsonValue } from "@prisma/client/runtime/library";
import { ColumnDef } from "@tanstack/react-table";
type CompatibleVehicle = {
  make: string;
  year: string;
  model: string;
};

type Category = {
  id: number;
  name: string;
  description: string;
};

type Supplier = {
  id: number;
  name: string;
  contactId: number;
};

type InventoryItem = {
  id: number;
  sku: string | null;
  name: string;
  description: string | null;
  categoryId: number;
  unitCost: number;
  retailPrice: number;
  quantityOnHand: number;
  measure_of_unit: string;
  location: string | null;
  reorderPoint: number | null;
  supplierId: number;
  compatibleVehicles: JsonValue;
  category: Category;
  supplier: Supplier;
};

export const colums: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => {
      return <div>{row.getValue("sku")}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
        return <div>{row.getValue("name")}</div>
    }
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
        return <div>{row.getValue("description")}</div>
    }
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
        const {name} = row.getValue("category") as Category;
        return <div>{name} </div>
    }
  },
  {
    accessorKey: "quantityOnHand",
    header: "Quantity On Hand",
    cell: ({ row }) => {
        return <div>{row.getValue("quantityOnHand")} {row.getValue("measure_of_unit")}</div>
    }
  },
  {
    accessorKey: "measure_of_unit",
    header: "Unit of Measure",
    cell: ({ row }) => {
        return <div>{row.getValue("measure_of_unit")}</div>
    }
  },
  {
    accessorKey: "unitCost",
    header: "Unit Cost",
    cell: ({ row }) => {
        return <div>${row.getValue("unitCost")}</div>
    }
  },
  {
    accessorKey: "retailPrice",
    header: "Retail Price",
    cell: ({ row }) => {
        return <div>${row.getValue("retailPrice")}</div>
    }

  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
        return <div>{row.getValue("location")}</div>
    }
  },
  {
    accessorKey: "reorderPoint",
    header: "Reorder Point",
    cell: ({ row }) => {
        return <div>{row.getValue("reorderPoint")} {row.getValue("measure_of_unit")}</div>
    }
  },
  {
    accessorKey: "supplier",
    header:"Supplier",
    cell: ({ row }) => {
        const {name} = row.getValue("supplier") as Supplier
        return <div>{name}</div>
    }
  },
  {
    accessorKey: "compatibleVehicles",
    header: "Compatible Vehicles",
    cell: ({ row }) => {
        const vehicle = row.getValue("compatibleVehicles")
        console.log(JSON.stringify(vehicle))
        
    }
  }

];
