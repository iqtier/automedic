import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CurrentJobs = () => {
  return (
    <div className="w-2/3">
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold text-2xl">Ongoing Jobs</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Job No - lisence plate-vheicle- ramp- service </p>
        </CardContent>
        <CardContent>
          <p>Job No - lisence plate-vheicle- ramp- service </p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CurrentJobs;
