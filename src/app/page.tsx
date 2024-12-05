/* eslint-disable @typescript-eslint/no-unused-vars */

import { redirect } from "next/navigation";
import "react-big-calendar/lib/css/react-big-calendar.css"
import SignIn from "./(pages)/(auth)/sign-in/page";
import { auth } from "@/lib/auth";
export default async function Home() {
  const session = await auth();

  return <div>{session?.user ? redirect("/home") : <SignIn />}</div>;
}
