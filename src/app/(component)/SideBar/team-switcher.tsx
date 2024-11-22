"use client";

import * as React from "react";
import { AudioWaveform, } from "lucide-react";


import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

} from "@/components/ui/sidebar";
import Link from "next/link";

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <AudioWaveform />
          </div>
          <Link href="#" className="flex items-center" prefetch={false}>
            <p className="font-mono text-2xl font-bold tracking-widest hover:text-blue-600 text-indigo-800">
              AUTOMEDIC
            </p>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
