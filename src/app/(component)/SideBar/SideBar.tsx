"use client";

import * as React from "react";
import {
  Activity,
  CalendarCheck,
  UserCog,
  User,
  ShoppingBasket,
  Wrench,
  BadgeDollarSign,
  Swords,
  DollarSign,
} from "lucide-react";
import { usePathname } from 'next/navigation'
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import SideBarItem from "./SideBarItem";

// This is sample data.
const items = [
  {
    title: "Dashboard",
    url: "/home/dashboard",
    icon: Activity,
  },
  {
    title: "Appoinment",
    url: "/home/appoinment",
    icon: CalendarCheck,
  },
  {
    title: "Employees",
    url: "/home/employees",
    icon: UserCog,
  },
  {
    title: "Clients",
    url: "/home/clients",
    icon: User,
  },
  {
    title: "Inventory",
    url: "/home/inventory",
    icon: ShoppingBasket,
  },
  {
    title: "Services",
    url: "/home/services",
    icon: Wrench,
  },
  {
    title: "Quote",
    url: "/home/quote",
    icon: DollarSign,
  },
  {
    title: "Attendance",
    url: "/home/attendance",
    icon: Swords,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SideBarItem key={item.url} item={item}/>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}