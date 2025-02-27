"use server";

import { ActionResult, BusinessDetailsType } from "@/types/type";
import { BusinessDetails } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function createBusinessDetails(
  data: BusinessDetailsType
): Promise<ActionResult<BusinessDetails>> {
  const { businame, phone, location, roadname, postal, logo } = data;
   try {
    const buffer = await logo.arrayBuffer();
    const imageBinary = Buffer.from(buffer);
    const business = await prisma.businessDetails.create({
        data: {
          name:businame,
          phone,
          address: {country:location[0],state:location[1],roadname:roadname,postal:postal},
          logo: imageBinary, // Store binary data
        },
      });

    return { status: "success", data: business }
   } catch (error) {
    console.error("Error creating service:", error);
    return { status: "error", error: error as string };
   }

}
