import React from "react";
import BookingDetails from "@/app/(component)/Bookings/BookingDetails";

const page = async ({
  params,
}: {
  params: Promise<{ booking_id: string }>;
}) => {
  const { booking_id } = await params;

  return <BookingDetails booking_id={booking_id} />;
};

export default page;
