import React, { useState } from "react";
import AppointmentForm from "@/app/(component)/Appoinment/appointment-form";
import AppointmentCalendar from "@/app/(component)/Appoinment/appointment_calendar";
import { getAllServices } from "@/app/actions/serviceActions";

import {getAllCustomer } from "@/app/actions/customerActions";

const page = async () => {
  const services = await getAllServices();
  const customers = await getAllCustomer()
  
  return (
    <div >
      <AppointmentForm services={services} customers={customers}/>
      <div className=" w-full p-4">
        <AppointmentCalendar />
      </div>
  
    </div>
  );
};

export default page;