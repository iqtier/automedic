import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { authRoutes, publicRoutes } from "./lib/routes";
import { User } from "./types/type";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const session = req.auth
    const currentUser = session?.user as User;
    const isBusinessRegistered = currentUser?.business_Id;
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

   
    if (isPublicRoute) {
        return NextResponse.next();
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL('/', nextUrl));
        }
        return NextResponse.next();
    }
    

    // If the user is logged in but has no business registered, force them to /setup-business
    if (isLoggedIn && !isBusinessRegistered && nextUrl.pathname !== "/setup-business") {
        return NextResponse.redirect(new URL('/setup-business', nextUrl));
    }
    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/sign-in', nextUrl));
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
      '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
  }