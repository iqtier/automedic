
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
      const ramp = row.getValue("ramp") as string;
      const isNA = ramp === "0" 
      return <div> {isNA ? "N/A" :ramp}</div>;
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
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isCompleted = status === "completed";
      const isOnGoing = status === "ongoing";
      const isCancelled = status === "cancelled";

      return (
        <div
          className={`p-1 flex justify-center rounded-sm ${
            isCompleted
              ? "bg-green-300"
              : isOnGoing
              ? "bg-orange-300"
              : isCancelled
              ? "bg-red-300"
              : "bg-blue-300"
          } `}
        >
          {status.toUpperCase()}
        </div>
      );
    },
  },
  {
    accessorKey: "payment_status",
    header: "Payment Status",
    cell: ({ row }) => {
      const payment_status = row.getValue("payment_status") as string;
      const isPaid = payment_status === "paid";
      const isCharge = payment_status === "charge";
      const isUnpaid = payment_status === "unpaid";
      return (
        <div
          className={`p-1 flex justify-center rounded-sm ${
            isPaid
              ? "bg-green-300"
              : isCharge
              ? "bg-orange-300"
              : isUnpaid
              ? "bg-red-300"
              : "bg-blue-300"
          } `}
        >
          {payment_status.toUpperCase()}
        </div>
      );
    },
  },
  {
    accessorKey: "payment_method",
    header: "Payment Method",
    cell: ({ row }) => {
      const payment_method = row.getValue("payment_method") as string;

      return <div className="p-1 flex justify-center rounded-sm">{payment_method.toUpperCase()}</div>;
    },
  },
  {
    accessorKey: "technicians",
    header: "Technicians",
    cell: ({ row }) => <div>{row.getValue("technicians")}</div>,
  },

  {
    accessorKey: "booking_type",
    header: "Booking Type",
    cell: ({ row }) => {
      const isAppointment = row.getValue("booking_type") === "Appointment";

      return (
        <div
          className={`p-2 flex justify-center text-white rounded-sm ${
            isAppointment ? " bg-blue-800" : "bg-green-800"
          }`}
        >
          {row.getValue("booking_type")}
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const booking_id = row.getValue("bookingid") as string;
      return <DataTableRowActions booking_id={booking_id} />;
    },
  },
];
