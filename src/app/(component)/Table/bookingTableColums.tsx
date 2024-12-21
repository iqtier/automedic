/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableRowActions } from "./booking_row_actions";

// This type is used to define the shape of our data.

type ServiceDetail = {
  name: string;
  quantity: string;
};

type BookingDetail = {
  bookingid: number;
  date: string; // Formatted as 'dd MMM yyyy'
  time: string;
  customer: string;
  ramp: string | null;
  vehicle: {
    id: number | null;
    details: string;
  }; // Formatted as 'make model year' or 'No vehicle associated'
  services: ServiceDetail[];
  status: string;
  note: string;
  technicians: string; // Concatenated technician names
  payment_status: string;
  payment_method: string;
  booking_type: string | null;
};

export const columns: ColumnDef<BookingDetail>[] = [
  {
    accessorKey: "bookingid",
    header: "ID",
    cell: ({ row }) => {
      return <div>{row.getValue("bookingid")}</div>;
    },
  },

  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => <div>{row.getValue("time")}</div>,
  },
  {
    accessorKey: "ramp",
    header: "Ramp",
    cell: ({ row }) => {
      return <div> {row.getValue("ramp")}</div>;
    },
  },
  {
    accessorKey: "customer",
    header: () => <div>Customer</div>,
    cell: ({ row }) => {
      const customer = row.getValue("customer");
      return <div className="">{customer as string}</div>;
    },
  },
  {
    accessorKey: "vehicle",
    header: () => <div>Vehicle</div>,
    cell: ({ row }) => {
      const { id, details } = row.getValue("vehicle") as {
        id: number;
        details: string;
      };

      return (
        <div className="">
          {row.getValue("vehicle") ? details : "No Vehicle associated"}
        </div>
      );
    },
  },
  {
    accessorKey: "services",
    header: "Services",
    cell: ({ row }) => {
      const services = row.getValue("services") as ServiceDetail[];
      return (
        <div>
          {services.map((service) => (
            <div key={service.name}>
              {service.name} - {service.quantity}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => <div>{row.getValue("note")}</div>,
  },
  {
    accessorKey: "technicians",
    header: "Technicians",
    cell: ({ row }) => <div>{row.getValue("technicians")}</div>,
  },
  {
    accessorKey: "payment_status",
    header: "Payment Status",
    cell: ({ row }) => <div>{row.getValue("payment_status")}</div>,
  },
  {
    accessorKey: "booking_type",
    header: "Booking Type",
    cell: ({ row }) => {
      const isAppointment = row.getValue("booking_type") === "Appointment";

      return (
        <div
          className={`px-2 py-1 text-white rounded-lg ${
            isAppointment ? " bg-blue-500" : "bg-green-500"
          }`}
        >
          {row.getValue("booking_type")}
        </div>
      );
    },
  },
  {
    accessorKey: "payment_method",
    header: "Payment Method",
    cell: ({ row }) => <div>{row.getValue("payment_method")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking_id = row.getValue("bookingid") as string;
      return <DataTableRowActions booking_id={booking_id} />;
    },
  },
];
