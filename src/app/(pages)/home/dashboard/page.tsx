import CompletedJobs from "@/app/(component)/Dashboard/CompletedJobs";
import CurrentJobs from "@/app/(component)/Dashboard/CurrentJobs";
import UpcomingJobs from "@/app/(component)/Dashboard/UpcomingJobs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React from "react";

const page = () => {
  return (
    <div>
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="alltime">All time</TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          <div className="flex flex-col gap-y-2">
            <CurrentJobs />

            <UpcomingJobs />
            <CompletedJobs/>
          </div>
        </TabsContent>
        <TabsContent value="alltime">All Time Report</TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
