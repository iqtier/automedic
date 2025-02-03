import React from "react";
import { format } from "date-fns";
import { ScheduleDropdown } from "./ShceduleDropdown";
import { Control, FieldErrors } from "react-hook-form";
import { User } from "@prisma/client";
type ScheduleRowProps = {
    technician: User;
    weekDays: Date[];
    control: Control<any>;
    errors: FieldErrors<any>;
    scheduleData: { [key: string]: string };
    setScheduleData: (scheduleData: { [key: string]: string }) => void;
};
export function ScheduleRow({
                                 technician,
                                 weekDays,
                                 control,
                                 errors,
                                 scheduleData,
                                 setScheduleData
                             }: ScheduleRowProps) {

    const handleDropdownChange = (day:Date, status: string)=>{
        const key = `${technician.id}_${format(day,"yyyy-MM-dd")}`
        setScheduleData({...scheduleData,[key]:status})
    }

    return (
        <tr key={technician.id}>
            <td className="py-2 px-4 border-b text-left dark:border-gray-600">{technician.name}</td>
            {weekDays.map((day) => {
                const key = `${technician.id}_${format(day,"yyyy-MM-dd")}`
                const status = scheduleData[key]
                let bgColorClass = "";

                
                return (
                    <td
                        key={format(day, "yyyy-MM-dd")}
                        className={`py-2 px-4 border-b ${bgColorClass} dark:border-gray-600`}
                    >
                        <ScheduleDropdown
                            name={`schedules.${key}`}
                            control={control}
                            errors={errors}
                            onStatusChange={(value)=>handleDropdownChange(day,value)}
                            defaultValue = {status}
                        />
                    </td>
                );
            })}
        </tr>
    );
}