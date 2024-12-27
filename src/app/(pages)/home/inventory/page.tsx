import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InventoryListTable from "@/app/(component)/Inventory/InventoryListTable";
import Receiving from "@/app/(component)/Inventory/Receiving";
import Adjustment from "@/app/(component)/Inventory/Adjustment";
import Reports from "@/app/(component)/Inventory/Reports";
import AddNewCatagory from "@/app/(component)/Inventory/AddNewCatagory";
import AddNewInventory from "@/app/(component)/Inventory/AddNewInventory";
import AddNewSupplier from "@/app/(component)/Inventory/AddNewSupplier";

const page = () => {
  return (
    <div >
      <div className="flex flex-1 gap-x-4">
        <AddNewInventory />
        <AddNewCatagory />
        <AddNewSupplier />
      </div>
      <div className="mt-4">
      <Tabs defaultValue="receiving" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventoryList">Inventory List</TabsTrigger>
          <TabsTrigger value="receiving">Reciving</TabsTrigger>
          <TabsTrigger value="adjustments">Adjustment</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="inventoryList">
          <InventoryListTable />
        </TabsContent>
        <TabsContent value="receiving">
          <Receiving />
        </TabsContent>
        <TabsContent value="adjustments">
          <Adjustment />
        </TabsContent>
        <TabsContent value="reports">
          <Reports />
        </TabsContent>
      </Tabs>
      </div>
      
    </div>
  );
};

export default page;
