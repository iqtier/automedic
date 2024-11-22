"use client"

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import React from "react";
import { usePathname } from 'next/navigation'
const SideBarItem = ({
  item,
}: {
  item: {
    title: string;
    url: string;
    icon: LucideIcon;
  };
}) => {
    const pathname = usePathname()
    const active = pathname ===item.url
  return (
    <SidebarMenuItem  key={item.title}>
      <SidebarMenuButton tooltip={item.title} className={`${active? "bg-blue-200 dark:bg-blue-700 " : ""} hover:bg-blue-200 dark:hover:bg-blue-700 `} asChild>
        <a href={item.url}>
          <item.icon />
          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SideBarItem;
