import React from "react";
import { useController, Control, FieldErrors } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ScheduleDropdownProps = {
    name: string;
    control: Control<any>;
    errors: FieldErrors<any>;
    onStatusChange: (value: string) => void;
    defaultValue?:string
};

export function ScheduleDropdown({
                                     name,
                                     control,
                                     errors,
                                     onStatusChange,
                                     defaultValue
                                 }: ScheduleDropdownProps) {

    const { field } = useController({
        name,
        control,
        defaultValue:defaultValue
    });
    const getStatusColor = (status: string | undefined) => {
        switch (status) {
          case 'on':
            return 'bg-green-200 dark:bg-green-700';
          case 'off':
            return 'bg-red-200 dark:bg-red-700';
          case 'sick':
            return 'bg-yellow-200 dark:bg-yellow-700';
          case 'vacation':
            return 'bg-blue-200 dark:bg-blue-700';
          case 'available':
              return 'bg-gray-200 dark:bg-gray-700';
          default:
            return 'bg-gray-100 dark:bg-gray-800';
        }
      };

    return (
        <Select  onValueChange={(value) => {
            field.onChange(value);
            onStatusChange(value)
        }}
                defaultValue={defaultValue}
        >
            <SelectTrigger className={cn("w-[180px]", getStatusColor(field.value))}>
                <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem  value="on">On</SelectItem>
                <SelectItem value="off">Off</SelectItem>
                <SelectItem value="sick">Sick</SelectItem>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="available">Available for On Call</SelectItem>
            </SelectContent>
            {errors[name]?.message && typeof errors[name]?.message === 'string' && (
                <span className="text-red-500 text-sm">{errors[name].message}</span>
            )}
        </Select>
    );
}