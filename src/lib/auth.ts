import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getUserByEmail } from "@/app/actions/authActions";
import { User } from "@/types/type";
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        try {
          user = await getUserByEmail(credentials?.email as string);
          if (
            !user ||
            !(await compare(credentials?.password as string, user.password))
          ) {
            return null;
          }
          return user;
        } catch (error) {
          console.error("Authentication error", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as unknown as {
          id: string;
          name: string;
          email: string;
          role: string;
          business_Id: string;
        };
        return {
          ...token,
          name: typedUser.name,
          email: typedUser.email,
          role: typedUser.role,
          id: typedUser.id,
          business_Id: typedUser.business_Id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        //Here is the changed line
        const typedUser = session.user as unknown as {
          id: string;
          name: string;
          email: string;
          role: string;
          business_Id: string;
        };
        typedUser.id = token.id as string;
        typedUser.name = token.name as string;
        typedUser.email = token.email as string;
        typedUser.role = token.role as string;
        typedUser.business_Id = token.business_Id as string;
      }

      return session;
    },
  },
});
