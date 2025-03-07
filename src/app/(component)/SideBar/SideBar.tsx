"use client";

import * as React from "react";
import {
  Activity,
  CalendarCheck,
  UserCog,
  User,
  ShoppingBasket,
  Wrench,
  Swords,
  DollarSign,
  Settings2,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import SideBarItem from "./SideBarItem";
import { useUserStore } from "@/app/store/useUserStore";

const items = [
  {
    title: "Dashboard",
    url: "/home/dashboard",
    icon: Activity,
  },
  {
    title: "Bookings",
    url: "/home/bookings",
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
    title: "Finance",
    url: "/home/finance",
    icon: DollarSign,
  },
  {
    title: "Settings",
    url: "/home/settings",
    icon: Settings2,
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
}
export function AppSidebar({ ...props }: AppSidebarProps) {
  const { business } = useUserStore();
  return (
    <Sidebar
      collapsible="icon"
       {...props}
       className="bg-stone-50 dark:bg-slate-900 border-r dark:border-gray-700 shadow-md z-20"
    >
      <SidebarHeader>
        <BrandLogo name= {business?.name} logo = {business?.logo}  />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SideBarItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}