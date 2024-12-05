/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React from 'react'
import { useParams } from 'next/navigation'

const  Page = () => {
  const params = useParams<{ user: string }>()
  return (
    <div>
      
      <p>user Id : {params.user}</p>
     
    </div>
  )
}

export default Page
