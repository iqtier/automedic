/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import { auth } from "@/lib/auth";
import { getUserByEmail } from "@/app/actions/authActions";

import { getAllServices } from "@/app/actions/serviceActions";

import ServicesAccordion from "@/app/(component)/Services/service-accordion";
const Page = async () => {
  const session = await auth();
  const userEmail = session?.user?.email;
  const user = await getUserByEmail(userEmail as string);
  const isAdmin = user?.role === "admin";
  const services = await getAllServices();
  return (
    <div className="m-5">
      <div className="flex justify-center w-full items-center bg-blue-300 p-2 rounded-lg">
        <p className="text-2xl font-bold">Services</p>
      </div>

      <ServicesAccordion services={services} isAdmin={isAdmin} />
    </div>
  );
};

export default Page;
