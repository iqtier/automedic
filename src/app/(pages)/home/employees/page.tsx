/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import { auth } from "@/lib/auth";

import { columns } from "@/app/(component)/Employee/userTableColumns";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AddEmployeeForm from "@/app/(component)/Employee/add-employee-form";

import { EmployeeTable } from "@/app/(component)/Employee/employee-table";
import { ClockInForm } from "@/app/(component)/Employee/clockInOut";

import { ScheduleTable } from "@/app/(component)/Employee/Schedule/ScheduleTable";
import { User } from "@/types/type";
import { getAllEmployees } from "@/app/actions/employeeActions";

const Page = async () => {
  const session = await auth();
  const currentUser = session?.user as User;
  const isAdmin = currentUser?.role === "admin";
  const employees = await getAllEmployees(currentUser.business_Id as string);

  return (
    <div className="">
      {isAdmin && <AddEmployeeForm />}

      <Tabs defaultValue="Clock IN/Out" className="w-full mt-2">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="Clock IN/Out">Clock IN/Out</TabsTrigger>
          <TabsTrigger value="Schedule">Schedule</TabsTrigger>
          <TabsTrigger value="List">List</TabsTrigger>
        </TabsList>
        <TabsContent
          value="Clock IN/Out"
          className="animate-in fade-in slide-in-from-bottom-10"
        >
          <ClockInForm />
        </TabsContent>
        <TabsContent
          value="Schedule"
          className="animate-in fade-in slide-in-from-bottom-10"
        >
          <ScheduleTable />
        </TabsContent>
        <TabsContent
          value="List"
          className="animate-in fade-in slide-in-from-bottom-10"
        >
          <div className="mt-4">
            <EmployeeTable
              columns={columns}
              data={employees?.map((employee) => ({
                id: employee.id,
                email: employee.email,
                password: employee.password,
                role: employee.role,
                username: employee.name,
              }))}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
