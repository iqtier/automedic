/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { auth } from "@/lib/auth";

import { getUserByEmail } from "@/app/actions/authActions";


import { columns } from "@/app/(component)/Table/userColumns";
import { DataTable } from "@/app/(component)/Table/data-table";


import AddEmployeeForm from "@/app/(component)/Employee/add-employee-form";
import { prisma } from "@/lib/prisma";
const Page = async () => {
  const session = await auth();
  const userEmail = session?.user?.email;
  const user = await getUserByEmail(userEmail as string);
  const isAdmin = user?.role === "admin";
  const users = await prisma.user?.findMany();

  return (
    <div>
      <div className="flex justify-center w-full items-center bg-blue-300 p-2 rounded-lg">
        <p className="text-2xl font-bold">Employees</p>
      </div>

      {isAdmin && <AddEmployeeForm />}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={users?.map((user) => ({
            email: user.email,
            password: user.password,
            role: user.role,
            username: user.name, // Assuming 'name' is the correct property for 'username'
          }))}
        />
      </div>
    </div>
  );
};

export default Page;
