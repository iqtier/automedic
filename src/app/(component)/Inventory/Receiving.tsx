import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddNewInventory from "./AddNewInventory";
import AddNewCatagory from "./AddNewCatagory";
import AddNewSupplier from "./AddNewSupplier";
import InventoryReceivingForm from "./InventoryReceivingForm";
const Receiving = () => {
  return (
    <div className="">
   
     
      <div>
        <InventoryReceivingForm/>
      </div>
    </div>
  );
};

export default Receiving;
