/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { auth } from "@/lib/auth";

import { getUserByEmail } from "@/app/actions/authActions";


import { columns } from "@/app/(component)/Employee/userTableColumns";



import AddEmployeeForm from "@/app/(component)/Employee/add-employee-form";
import { prisma } from "@/lib/prisma";
import { EmployeeTable } from "@/app/(component)/Employee/employee-table";
const Page = async () => {
  const session = await auth();
  const userEmail = session?.user?.email;
  const user = await getUserByEmail(userEmail as string);
  const isAdmin = user?.role === "admin";
  const users = await prisma.user?.findMany();

  return (
    <div>


      {isAdmin && <AddEmployeeForm />}
      <div className="container mx-auto py-10">
        <EmployeeTable
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
