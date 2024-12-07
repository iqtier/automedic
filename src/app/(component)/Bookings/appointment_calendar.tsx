"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AppointmentCalendar = () => {
  const localizer = momentLocalizer(moment);
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div>
      <div className="flex justify-end items-center space-x-2">
        <Switch
          id="toggle-calendar"
          onCheckedChange={(checked) => setShowCalendar(checked)}
        />
        <Label htmlFor="toggle-calendar">Calendar</Label>{" "}
      </div>
      {showCalendar && (
        <Calendar
          style={{ height: "75vh" }}
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
        />
      )}
    </div>
  );
};

export default AppointmentCalendar;
