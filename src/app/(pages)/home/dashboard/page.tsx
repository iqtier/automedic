import CompletedJobs from "@/app/(component)/Dashboard/CompletedJobs";
import CurrentJobs from "@/app/(component)/Dashboard/CurrentJobs";
import UpcomingJobs from "@/app/(component)/Dashboard/UpcomingJobs";
import { getAllBookings } from "@/app/actions/bookingActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React from "react";

const page = async () => {
  const bookings = await getAllBookings();
  return (
    <div>
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="alltime">All time</TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          <div className="flex flex-wrap gap-4">
            <CurrentJobs bookings= {bookings} />
            <UpcomingJobs bookings= {bookings}/>
            <CompletedJobs bookings= {bookings}/>
          </div>
        </TabsContent>
        <TabsContent value="alltime">All Time Report</TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
