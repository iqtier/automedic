/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type ServiceDetail = {
  name: string;
  quantity: string;
};

type AppointmentDetail = {
  appointid: number;
  date: string; // Formatted as 'dd MMM yyyy'
  time: string;
  customerEmail: string;
  vehicle: string; // Formatted as 'make model year' or 'No vehicle associated'
  services: ServiceDetail[];
  status: string;
  note: string;
  technicians: string; // Concatenated technician names
  payment_status: string;
  payment_method: string;
};

export const columns: ColumnDef<AppointmentDetail>[] = [
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
    accessorKey: "customerEmail",
    header: () => <div>Customer Email</div>,
    cell: ({ row }) => {
      return <div className="">{row.getValue("customerEmail")}</div>;
    },
  },
  {
    accessorKey: "vehicle",
    header: () => <div>Vehicle</div>,
    cell: ({ row }) => {
      return <div className="">{row.getValue("vehicle")}</div>;
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
    accessorKey: "payment_method",
    header: "Payment Method",
    cell: ({ row }) => <div>{row.getValue("payment_method")}</div>,
  },
];
