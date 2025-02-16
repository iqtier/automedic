"use client";

import React, { useState, useEffect, useMemo } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon,  } from "lucide-react";
import {
  getAllBookings,
} from "@/app/actions/bookingActions";
import { getAllEmployees, getTechnicians } from "@/app/actions/employeeActions";
import { getAllCustomer } from "@/app/actions/customerActions";
import { getAllInventory } from "@/app/actions/inventoryActions";
import { Booking, User, Customer } from "@/types/type";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar"
import { type DateRange } from "react-day-picker"

const InventoryReport = () => {
    const [employees, setEmployees] = useState<User[] | null>(null)
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [technicians, setTechnicians] = useState<User[] | null>(null);
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [inventories, setInventories] = useState<any[] | null>(null);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allEmployees = await getAllEmployees();
        const allBookings = await getAllBookings();
        const allTechnicians = await getTechnicians();
        const allCustomers = await getAllCustomer();
        const allInventories = await getAllInventory();

        if (allBookings && allTechnicians && allCustomers && allInventories && allEmployees) {
          setBookings(allBookings);
          setTechnicians(allTechnicians);
          setCustomers(allCustomers);
          setInventories(allInventories);
          setEmployees(allEmployees)
        }
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading data...
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredBookings = bookings?.filter((booking) => {
    if (!date?.from || !date?.to) return true;
    const bookingDate = new Date(booking.date);
    return bookingDate >= date.from && bookingDate <= date.to;
  });

  const totalRevenue = filteredBookings?.reduce((acc, booking) => {
    let serviceRevenue =
      booking.services?.reduce((serviceAcc, serviceItem) => {
        const price = serviceItem.service?.price || 0;
        const qty = parseInt(serviceItem.qty, 10) || 1;
        return serviceAcc + price * qty;
      }, 0) || 0;

    let inventoryRevenue =
      booking.UsedInventory?.reduce((inventoryAcc, inventoryItem) => {
        if (!inventoryItem.includedWithService) {
          const retailPrice = inventoryItem.inventory?.retailPrice || 0;
          const quantity = inventoryItem.quantity || 1;
          return inventoryAcc + retailPrice * quantity;
        }
        return inventoryAcc;
      }, 0) || 0;
    return acc + serviceRevenue + inventoryRevenue;
  }, 0);

  const topSellingServices = () => {
    if (!filteredBookings) return [];
  
    const serviceCounts: { [key: string]: number } = {};
  
    filteredBookings.forEach((booking) => {
      booking.services?.forEach((serviceItem) => {
        const serviceName = serviceItem.service?.name;
        if (serviceName) {
          serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
        }
      });
    });
  
    // Convert the result into an array of objects instead of tuples
    return Object.entries(serviceCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })); // Convert tuple to object
  };
  


  const outOfStockInventoryCount = inventories?.filter(
    (inventory) => inventory.quantityOnHand <= 0
  ).length ||0;

  const inventoryUnderReorderPointCount = inventories?.filter(
    (inventory) => inventory.quantityOnHand <= inventory.reorderPoint
  ).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Inventories</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  `${format(date.from, "MMM dd, yyyy")} - ${format(
                    date.to,
                    "MMM dd, yyyy"
                  )}`
                ) : (
                  format(date.from, "MMM dd, yyyy")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            align="start"
          >
            <Calendar
              className="rounded-md border p-2"
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
              pagedNavigation
              
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
       
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Inventory Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              {inventories?.length}
            </div>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              All Inventory Items
            </CardDescription>
          </CardContent>
        </Card>
        { outOfStockInventoryCount > 0 && (<Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Out of Stock Inventory Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {outOfStockInventoryCount}
            </div>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Inventory that needs re-stocking
            </CardDescription>
          </CardContent>
        </Card>)}

       { inventoryUnderReorderPointCount>0 && ( <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Inventory Items Reaches reorder point
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {inventoryUnderReorderPointCount}
            </div>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Inventory that needs re-stocking
            </CardDescription>
          </CardContent>
        </Card>)}
      </div>

      {/* Detailed Statistics */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
       
        
      </div>
    </div>
  );
};

// Helper function to prevent typescript errors

export default InventoryReport;
