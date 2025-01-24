import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
const CompletedJobs = () => {
  return (
  <div className="w-2/3">
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold text-2xl">Completd Jobs</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Date time - vehicle -services -customer- print invoice</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
  )
}

export default CompletedJobs
