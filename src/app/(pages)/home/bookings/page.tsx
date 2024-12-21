import React from "react";
import { format } from "date-fns";
import { getAllServices } from "@/app/actions/serviceActions";

import { getAllCustomer } from "@/app/actions/customerActions";

import { getAllBookings, getBooking } from "@/app/actions/bookingActions";
import { columns } from "@/app/(component)/Table/bookingTableColums";
import { DataTable } from "@/app/(component)/Table/data-table";
import BookingForm from "@/app/(component)/Bookings/booking_form";

import { getTechnicians } from "@/app/actions/employeeActions";

const Bookings = async () => {
  const services = await getAllServices();
  const customers = await getAllCustomer();
  const bookings = await getAllBookings();
  const technicians = await getTechnicians();

  const data = bookings.map((booking) => ({
    bookingid: booking.id,
    date: format(booking.date, "dd MMM yyyy"),
    time: booking.time,
    customer:  booking.customer.name,
    ramp:booking.ramp,
    vehicle: {
      id: booking.vehicle? booking.vehicle.id:null,
      details: booking.vehicle? `${booking.vehicle.make} ${booking.vehicle.model} ${booking.vehicle.year}`:"No Vehicle associated",
    },

    services: booking.services.map((sa) => ({
      name: sa.service.name,
      quantity: sa.qty,
    })),
    status: booking.status,
    note: booking.note,
    technicians: booking.technicians.map((t) => t.technician.name).join(", "),
    booking_type: booking.booking_type,
    payment_status: booking.payment_status,
    payment_method: booking.payment_method,
  }));

  return (
    <div className="flex flex-col gap-y-4 ">
      <div className="flex items-center  space-x-4">
        <BookingForm
          services={services}
          customers={customers}
          isAppointment={true}
          isEdit={false}
          technicians={technicians}
        />
        <BookingForm
          services={services}
          customers={customers}
          isAppointment={false}
          isEdit={false}
          technicians={technicians}
        />
      </div>
      <div>
      <DataTable columns={columns} data={data} />
      </div>
      
    </div>
  );
};

export default Bookings;
