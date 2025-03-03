import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { authRoutes, publicRoutes } from "./lib/routes";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
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

    if (!isPublicRoute && !isLoggedIn) {
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