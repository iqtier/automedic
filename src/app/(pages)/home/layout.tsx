/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { cookies } from "next/headers";
import { AppSidebar } from "@/app/(component)/SideBar/SideBar";


import {
  SidebarInset,
  SidebarProvider,
 
} from "@/components/ui/sidebar";
import NavBar from "@/app/(component)/Navbar/NavBar";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
 

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavBar />
        <div className="m-5">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default HomeLayout;
