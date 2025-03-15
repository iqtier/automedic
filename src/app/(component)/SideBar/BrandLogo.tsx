"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

import Image from "next/image";
import { Cog } from "lucide-react";

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
          <div className="flex aspect-square size-10  items-center justify-start ">
            <Cog color="green" size={35} />
          </div>

          <Link href="/home" prefetch={false}>
            <Image
              src={"/name.png"}
              alt="Brand"
              width={1000}
              height={1000}
              priority // Add priority for initial load
              className="object-contain" // Make sure image fits nicely
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
