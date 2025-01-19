import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import InventoryReceivingForm from "./InventoryReceivingForm";
const Receiving = () => {
  return (
    <div className="">
      <ScrollArea className="lg:h-full md:h-[480px] w-full border rounded-md">
        <InventoryReceivingForm />
      </ScrollArea>
    </div>
  );
};

export default Receiving;
