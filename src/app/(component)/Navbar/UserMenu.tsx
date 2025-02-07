import {
  LogOut,
  User,
 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { signOut } from "@/lib/auth";

export async function UserMenu() {
  const session = await auth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt={session?.user?.name || "User"} />
            <AvatarFallback className="bg-muted-foreground text-foreground">{session?.user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="dark:bg-slate-700" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="dark:hover:bg-gray-700">
            
             <Link href={`/home/${session?.user?.id}`} className="">
             <div
              className="flex items-center px-4 gap-1 ">
             <User className="mr-2 h-4 w-4" />
                <p>Profile</p>
                
             </div>
             
             
              </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator className="dark:bg-slate-700" />
        <DropdownMenuItem >
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/sign-in" });
            }}
          >
              <Button
                className="flex flex-row gap-1 items-center "
                type="submit"
                variant={"destructive"}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}