/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import NavBar from "@/app/(component)/Navbar/NavBar";
const  page = async () => {
  const params = useParams<{ user: string }>()
  return (
    <div>
      
      <p>user Id : {params.user}</p>
     
    </div>
  )
}

export default page
