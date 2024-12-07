"use client"
import React from "react";
import CustomerForm from "./CustomerForm";
import { CustomerType } from "@/types/type";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger  } from "@/components/ui/accordion";


import ServiceForm from "../Services/service-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { deleteService } from "@/app/actions/serviceActions";
import { deleteCustomer } from "@/app/actions/customerActions";
import { toast } from "react-toastify";

type Customers = CustomerType & { id: string };


const Clients: React.FC<{isAdmin: boolean, customers:Customers[]}> = ({isAdmin, customers}) => {
  const router = useRouter();

  const handleDeleteClick = async (id: string) => {
    try {
      const result = await deleteCustomer(id); // Ensure this function exists and works as expected
      if (result.status === "success") {
        toast.success("Customer deleted successfully");
        router.refresh(); // Refresh the page or handle the update to reflect changes
      } else {
        toast.error("Failed to delete customer");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the customer");
    }
  };

  return (
    <div className="mt-5">
     <CustomerForm isEdit = {false} customerToEdit= {null} fromBooking={false}/>
     <Accordion type="single" collapsible className="w-full mt-5 gap-y-2">
        {customers.map((customer) => (
          <AccordionItem
            className="border rounded px-5 shadow-sm"
            key={customer.id}
            value={`item ${customer.id}`}
          >
            <AccordionTrigger className="text-lg hover:no-underline font-semibold">
              <h2 className="font-semibold">{customer.name}</h2>
              <p>{customer.email}</p>
            </AccordionTrigger>

            {customer.cars?.map((car, index) => (
              <AccordionContent key={index}>
                <strong>{car.make}</strong> {car.model} {car.year}
              </AccordionContent>
            ))}
            {isAdmin && (
              <AccordionContent className="flex flex-row gap-x-2">
                <CustomerForm isEdit = {true} customerToEdit={customer} fromBooking={false}/>
                <Button
                  variant={"destructive"}
                  onClick={() => handleDeleteClick(customer.id)}
                >
                  Delete
                </Button>
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Clients;
