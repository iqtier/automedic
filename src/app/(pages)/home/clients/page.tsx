import Clients from '@/app/(component)/Customer/Customer'
import React from 'react'

const page = () => {
  return (
    <div className='space-y-4'>
    <div className="flex justify-center w-full items-center bg-blue-300 p-2 rounded-lg">
      <p className="text-2xl font-bold">Clients</p>
    </div>

    <Clients/>

    
  </div>
  )
}

export default page