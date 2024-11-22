"use client"

import { useSidebar } from "@/components/ui/sidebar"
 import {PanelLeft} from 'lucide-react'
export function SideBarToggle() {
  const { toggleSidebar } = useSidebar()
 
  return <button onClick={toggleSidebar}><PanelLeft/></button>
}