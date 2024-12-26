"use server";

import{ prisma} from '@/lib/prisma'
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { LogInSchema, UserSchema } from '@/types/type';
import { signIn, } from "@/lib/auth";
import { AuthError } from 'next-auth';
import { ActionResult } from '@/types/type';
import { z } from 'zod';


export async function registerUser(data: z.infer<typeof UserSchema>): Promise<ActionResult<User>> {
        try {
            const {username,email,password,role} = data;
            const hashedPassword = await bcrypt.hash(password,10)
            const existingUser = await prisma.user.findUnique({
                where: {email}
            })

            
            if (existingUser) {
                return {status: 'error', error: "User Already exist" }
            }
            const user = await prisma.user.create({
                data: {
                  name: username,
                  email,
                  password: hashedPassword,
                  role
                
                },
              });
             return {status : "success", data: user} 

        } catch (error) {
            return { status: "error", error: error as string };
        }
}

export async function signInUser(data:z.infer<typeof LogInSchema>) : Promise<ActionResult<User> | undefined> {
    try {
        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        });
        return {status: "success", data: result};
    } catch (error) {
   
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {status:'error', error: "Invalid Credentials"};
                default:
                  return {status:'error', error: "Something went wrong"}
            }
        }else {
          return {status:'error', error: "Something else went wrong"}
        }
    }
}

export async function getUserByEmail(email: string){
    console.log("calling user by email", email);
    return  await prisma.user.findUnique({where:{email}})
}

export async function getUserById(id: string){
    return  await prisma.user.findUnique({where:{id}})
}