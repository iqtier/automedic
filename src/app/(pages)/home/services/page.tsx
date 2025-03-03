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
  const services = await getAllServices(user?.business_Id as string);
  return (
    <div className="animate-in fade-in slide-in-from-bottom-10">
   

      <ServicesAccordion services={services} isAdmin={isAdmin} />
    </div>
  );
};

export default Page;
