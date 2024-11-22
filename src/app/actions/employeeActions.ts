/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import{ prisma} from '@/lib/prisma'
import { ActionResult } from '@/types/type';
import { User } from "@prisma/client";



export async function deleteEmployee(email:string):Promise<ActionResult<User>>  {
    try {
        const deleteuser = await prisma.user.delete({
            where:{email:email}
        })
        return {status : "success", data: deleteuser}
    } catch (error) {
        return { status: "error", error: error as string };
    }
}