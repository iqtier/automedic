import React from "react";
import AppointmentForm from "@/app/(component)/Bookings/appointment_form";
import AppointmentCalendar from "@/app/(component)/Bookings/appointment_calendar";
import { getAllServices } from "@/app/actions/serviceActions";

import { getAllCustomer } from "@/app/actions/customerActions";
import WalkInServiceForm from "@/app/(component)/Bookings/walk_in_form";
import { getAllAppointments } from "@/app/actions/appointmentActions";
import { columns } from "@/app/(component)/Table/appointmentColums";
import { DataTable } from "@/app/(component)/Table/data-table";

const page = async () => {
  const services = await getAllServices();
  const customers = await getAllCustomer();
  const appointments = await getAllAppointments();
  console.log(appointments);
  return (
    <div className="flex flex-col gap-y-4 ">
      <div className="flex items-center  space-x-4">
        <AppointmentForm services={services} customers={customers} />
        <WalkInServiceForm services={services} customers={customers} />
      </div>

      <DataTable columns={columns} data={appointments} />
    </div>
  );
};

export default page;
