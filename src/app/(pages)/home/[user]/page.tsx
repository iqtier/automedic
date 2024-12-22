/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react'

import { getUserById } from '@/app/actions/authActions'

const  Page = async ({params}:{params:Promise<{user:string}>}) => {
  const userId = (await params).user
  const user = await getUserById(userId) 
  return (
   
    <div>
      
      <p>User name : {user?.name}</p>
      <p>User email : {user?.email}</p>
      <p>User email : {user?.role}</p>
    </div>
  )
}

export default Page
