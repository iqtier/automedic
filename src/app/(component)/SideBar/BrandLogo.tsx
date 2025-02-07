"use client";

import * as React from "react";
import { AudioWaveform } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function BrandLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-500 text-white dark:bg-indigo-700 dark:text-gray-200">
            <AudioWaveform />
          </div>
          <Link href="/home" className="flex items-center" prefetch={false}>
            <p className="font-mono text-2xl font-bold tracking-widest hover:text-blue-600 dark:hover:text-blue-400 text-indigo-800 dark:text-indigo-200 transition-colors duration-200">
              AUTOMEDIC
            </p>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}