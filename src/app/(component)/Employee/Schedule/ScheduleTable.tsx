"use client";

import React, { useState, useEffect } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ScheduleRow } from "./ScheduleRow";
import { Button } from "@/components/ui/button";
import {
    fetchScheduleData,
  getTechnicians,
  updateSchedule,
} from "@/app/actions/employeeActions";
import { ScheduleHeader } from "./ScheduleHeader";

import {  toZonedTime } from 'date-fns-tz';

const ScheduleSchema = z.object({
  schedules: z.record(
    z.string(),
    z.enum(["on", "off", "sick", "vacation", "available"])
  ),
});

type ScheduleForm = z.infer<typeof ScheduleSchema>;

export function ScheduleTable() {
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
    const [technicians, setTechnicians] = useState<any[]>([]);
      const [scheduleData, setScheduleData] = useState<{ [key: string]: string }>({});
      const [loading, setLoading] = useState(true)
      const [initialFormValues, setInitialFormValues] = useState<ScheduleForm["schedules"]>({});
  
    const {
      handleSubmit,
      control,
      watch,
      reset,
      setValue,
      formState: { errors, isDirty },
    } = useForm<ScheduleForm>({
      resolver: zodResolver(ScheduleSchema),
        defaultValues: { schedules: {} },
      mode: "onChange",
    });
  
      const watchedScheduleValues = watch("schedules");
  
  
    const weekDays = eachDayOfInterval({
      start: currentWeekStart,
      end: endOfWeek(currentWeekStart, { weekStartsOn: 0 }),
    });
  
  
      useEffect(() => {
          const fetchTechniciansAndSchedules = async () => {
              setLoading(true);
              const techData = await getTechnicians();
  
              if(techData){
                  setTechnicians(techData);
                const scheduleFetch = await fetchScheduleData(weekDays);
  
                  const initialSchedules = techData.reduce((acc:any, tech:any) => {
                      weekDays.forEach(day=>{
                          const schedule = scheduleFetch.find((schedule)=>schedule.userId === tech.id && isSameDay(new Date(schedule.date.toISOString().split('T')[0]), day.toISOString().split('T')[0]));
                          acc[`${tech.id}_${format(day, "yyyy-MM-dd")}`] = schedule?.status || 'off';
                      })
                      return acc
                  },{})
                setScheduleData(initialSchedules);
                 setInitialFormValues(initialSchedules);
                 reset({schedules:initialSchedules});
              }
  
              setLoading(false);
          };
  
          fetchTechniciansAndSchedules();
      }, [currentWeekStart, reset, setValue]);
  
  
  
      const handleWeekChange = (direction: "next" | "prev") => {
          setCurrentWeekStart((prev) =>
              direction === "next" ? addDays(prev, 7) : addDays(prev, -7)
          );
      };
  
      const onSubmit = async (data: ScheduleForm) => {
           const changedSchedules = Object.entries(watchedScheduleValues).filter(
            ([key, value]) => initialFormValues[key] !== value
          );
  
          try {
              const responses = await Promise.all(changedSchedules.map(async([key,status])=>{
                  const [userId, date] = key.split("_")
                const utcDate =  new Date(date).toISOString().split('T')[0]
                  return await updateSchedule(userId,utcDate,status)
              }))
              if(responses.every((res)=>res.status === "success")){
                  const scheduleFetch = await fetchScheduleData(weekDays);
                  const initialSchedules = technicians.reduce((acc:any, tech:any) => {
                      weekDays.forEach(day=>{
                          const schedule = scheduleFetch.find((schedule)=>schedule.userId === tech.id && isSameDay(new Date(schedule.date.toISOString().split('T')[0]), day.toISOString().split('T')[0]));
                        acc[`${tech.id}_${format(day, "yyyy-MM-dd")}`] = schedule?.status || 'off';
                      })
                      return acc
                  },{})
                setScheduleData(initialSchedules);
                  setInitialFormValues(initialSchedules);
                reset({ schedules: initialSchedules });
              }
          } catch (error) {
              console.error("Error:",error)
          }
      };
  
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <ScheduleHeader
          currentWeekStart={currentWeekStart}
          handleWeekChange={handleWeekChange}
        />
  
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="py-2 px-4 border-b font-semibold text-left dark:border-gray-600">
                  Employee Name
                </th>
                {weekDays.map((day) => (
                  <th
                    key={format(day, "yyyy-MM-dd")}
                    className="py-2 px-4 border-b font-semibold dark:border-gray-600"
                  >
                      {format(day, "EEE dd")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  technicians.map((technician) => (
                      <ScheduleRow
                          key={technician.id}
                          technician={technician}
                          weekDays={weekDays}
                          control={control}
                          errors={errors}
                          scheduleData = {scheduleData}
                            setScheduleData = {setScheduleData}
                      />
                  ))
              )}
  
            </tbody>
          </table>
        </div>
  
        <div className="mt-4">
          <Button type="submit" disabled={!isDirty}>Update Schedule</Button>
        </div>
      </form>
    );
  }