import React from "react";
import { format } from "date-fns";

type ScheduleHeaderProps = {
    currentWeekStart: Date;
    handleWeekChange: (direction: "next" | "prev") => void;
};

export function ScheduleHeader({
                                 currentWeekStart,
                                 handleWeekChange,
                             }: ScheduleHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-4">
            <button
                onClick={() => handleWeekChange("prev")}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
                {"<"}
            </button>
            <h2 className="text-xl font-semibold">
                {format(currentWeekStart, "MMMM dd")} -{" "}
                {format(
                    new Date(
                        currentWeekStart.getFullYear(),
                        currentWeekStart.getMonth(),
                        currentWeekStart.getDate() + 6
                    ),
                    "MMMM dd, yyyy"
                )}
            </h2>
            <button
                onClick={() => handleWeekChange("next")}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
                {">"}
            </button>
        </div>
    );
}