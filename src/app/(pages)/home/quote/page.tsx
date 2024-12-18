import { getAllServices } from '@/app/actions/serviceActions';
import React from 'react'

const page = async () => {
   const services = await getAllServices();
  return (
    <div>Quote page</div>
  )
}

export default page