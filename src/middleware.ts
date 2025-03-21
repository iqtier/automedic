import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { authRoutes, publicRoutes } from "./lib/routes";
import { User } from "./types/type";
import { getUserById } from "./app/actions/authActions";
 // Import the function to get the user

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const session = req.auth;
  const currentUser = session?.user as User & {userExists:boolean};
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  if (isLoggedIn) {
    // **Database Check:** Verify the user still exists in the database
    if (!currentUser?.userExists) {
        return NextResponse.redirect(new URL("/sign-in", nextUrl));
      }
    const isBusinessRegistered = currentUser?.business_Id;


    if (nextUrl.pathname === "/setup-business" && isBusinessRegistered) {
      // If logged in, business is registered, and trying to access /setup-business, redirect to home
      return NextResponse.redirect(new URL("/", nextUrl));
    }

    if (!isBusinessRegistered && nextUrl.pathname !== "/setup-business") {
      // If logged in, business is NOT registered, and NOT on /setup-business, redirect to /setup-business
      return NextResponse.redirect(new URL("/setup-business", nextUrl));
    }
  } else {
    // If not logged in redirect to sign-in
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};