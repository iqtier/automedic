"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useUserStore } from "@/app/store/useUserStore";
import Image from "next/image";
import { getBusinessById } from "@/app/actions/settingActions";
interface BrandLogoProps {
  name?: string;
  logo?: string;
}
export function BrandLogo({ name, logo }: BrandLogoProps) {
  

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          {logo && (
            <div className="flex justify-center">
              <Image
                src={logo as string}
                alt="Business Logo"
                width={50}
                height={50}
                className="rounded-lg shadow-md"
              />
            </div>
          )}

          <Link href="/home" className="flex items-center" prefetch={false}>
            <p className="font-mono text-2xl font-bold tracking-widest hover:text-blue-600 dark:hover:text-blue-400 text-indigo-800 dark:text-indigo-200 transition-colors duration-200">
              {name?.toUpperCase()}
            </p>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
