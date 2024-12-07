import React from "react";
import AppointmentForm from "@/app/(component)/Bookings/appointment_form";
import AppointmentCalendar from "@/app/(component)/Bookings/appointment_calendar";
import { getAllServices } from "@/app/actions/serviceActions";

import {getAllCustomer } from "@/app/actions/customerActions";
import WalkInServiceForm from "@/app/(component)/Bookings/walk_in_form";

const page = async () => {
  const services = await getAllServices();
  const customers = await getAllCustomer()
  
  return (
    <div className="flex items-center  space-x-4" >
      <AppointmentForm services={services} customers={customers}/>
      <WalkInServiceForm services={services} customers={customers}/>

      
  
    </div>
  );
};

export default page;
