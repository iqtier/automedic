import React from "react";

import { getAllServices } from "@/app/actions/serviceActions";

import { getAllCustomer } from "@/app/actions/customerActions";

import { getAllBookings } from "@/app/actions/appointmentActions";
import { columns } from "@/app/(component)/Table/appointmentColums";
import { DataTable } from "@/app/(component)/Table/data-table";
import BookingForm from "@/app/(component)/Bookings/booking_form";

const page = async () => {
  const services = await getAllServices();
  const customers = await getAllCustomer();
  const bookings = await getAllBookings();
  console.log(bookings);
  return (
    <div className="flex flex-col gap-y-4 ">
      <div className="flex items-center  space-x-4">
        <BookingForm
          services={services}
          customers={customers}
          isAppointment={true}
          isEdit={false}
        />
        <BookingForm
          services={services}
          customers={customers}
          isAppointment={false}
          isEdit={false}
        />
      </div>

      <DataTable columns={columns} data={bookings} />
    </div>
  );
};

export default page;
