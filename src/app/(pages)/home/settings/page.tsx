import { getBusinessById } from '@/app/actions/settingActions';
import { auth } from '@/lib/auth';
import { User } from '@/types/type';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const Page = async () => {
  const session = await auth();
  const user = session?.user as User;
  const businessDetails = await getBusinessById(user?.business_Id as string);

  if (!businessDetails) {
    return <p className="text-center text-gray-500 dark:text-gray-400">No business details found.</p>;
  }

  const address = businessDetails.address as { state: string; postal: string; country: string; roadname: string };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-lg shadow-lg bg-white dark:bg-gray-800 rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center text-gray-900 dark:text-gray-100">{businessDetails.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {businessDetails.logo && (
            <div className="flex justify-center">
              <Image
                src={`data:image/png;base64,${Buffer.from(businessDetails.logo).toString('base64')}`}
                alt="Business Logo"
                width={100}
                height={100}
                className="rounded-lg shadow-md"
              />
            </div>
          )}
          <p className="text-gray-700 dark:text-gray-300"><strong>Phone:</strong> {businessDetails.phone}</p>
          <p className="text-gray-700 dark:text-gray-300"><strong>Address:</strong></p>
          <ul className="text-gray-700 dark:text-gray-300 pl-4 list-disc">
            <li><strong>Road:</strong> {address.roadname}</li>
            <li><strong>State:</strong> {address.state}</li>
            <li><strong>Postal Code:</strong> {address.postal}</li>
            <li><strong>Country:</strong> {address.country}</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300"><strong>Tax Rate:</strong> {businessDetails.taxRate*100} %</p>
         
              </CardContent>
      </Card>
    </div>
  );
};

export default Page;
