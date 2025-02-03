/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { auth } from "@/lib/auth";

import { getUserByEmail } from "@/app/actions/authActions";

import { columns } from "@/app/(component)/Employee/userTableColumns";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AddEmployeeForm from "@/app/(component)/Employee/add-employee-form";
import { prisma } from "@/lib/prisma";
import { EmployeeTable } from "@/app/(component)/Employee/employee-table";
import { ClockInForm } from "@/app/(component)/Employee/clockInOut";

import { ScheduleTable } from "@/app/(component)/Employee/Schedule/ScheduleTable";
const Page = async () => {
  const session = await auth();

  const userEmail = session?.user?.email;

  const user = await getUserByEmail(userEmail as string);
  const isAdmin = user?.role === "admin";
  const users = await prisma.user?.findMany();

  return (
    <div>
      {isAdmin && <AddEmployeeForm />}

      <Tabs defaultValue="Clock IN/Out" className="w-full mt-2">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="Clock IN/Out">Clock IN/Out</TabsTrigger>
          <TabsTrigger value="Schedule">Schedule</TabsTrigger>
          <TabsTrigger value="List">List</TabsTrigger>
        </TabsList>
        <TabsContent value="Clock IN/Out">
          <ClockInForm />
        </TabsContent>
        <TabsContent value="Schedule">
        <ScheduleTable/>
        </TabsContent>
        <TabsContent value="List">
          <div className="mt-4">
            <EmployeeTable
              columns={columns}
              data={users?.map((user) => ({
                email: user.email,
                password: user.password,
                role: user.role,
                username: user.name,
              }))}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
