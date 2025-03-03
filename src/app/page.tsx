/* eslint-disable @typescript-eslint/no-unused-vars */

import { redirect } from "next/navigation";
import "react-big-calendar/lib/css/react-big-calendar.css"
import SignIn from "./(pages)/(auth)/sign-in/page";
import { auth } from "@/lib/auth";
import { User } from "@/types/type";
import { getUserById } from "./actions/authActions";
export default async function Home() {
  
  const session = await auth();
  const currentUser = session?.user as User;
  
  if (currentUser) {
    const user = await getUserById(currentUser.id);
    (session?.user as User).business_Id = user?.business_Id;
  }
  if (session?.user) {
    // Fetch the user's business details (tenant)
    const businessId = currentUser?.business_Id; // Assuming this is stored in the session
    if (businessId) {
      // Redirect to the tenant-specific home page
      redirect(`/home`);
    } else {
      // Handle case where user has no associated business
      redirect("/setup-business");
    }
  }

  // If no session, show the sign-in page
  return <SignIn />;
}
