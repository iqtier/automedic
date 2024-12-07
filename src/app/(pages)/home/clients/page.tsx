import Clients from '@/app/(component)/Customer/Customer'
import { getUserByEmail } from '@/app/actions/authActions';
import { getAllCustomer } from '@/app/actions/customerActions';
import { auth } from '@/lib/auth';
import React from 'react'

const page = async () => {
  const session = await auth();
  const userEmail = session?.user?.email;
  const user = await getUserByEmail(userEmail as string);
  const isAdmin = user?.role === "admin";
  const customers = await getAllCustomer();
  return (
    <div className='space-y-4'>
    <div className="flex justify-center w-full items-center bg-blue-300 p-2 rounded-lg">
      <p className="text-2xl font-bold">Clients</p>
    </div>

    <Clients isAdmin={isAdmin} customers = {customers}/>

    
  </div>
  )
}

export default page